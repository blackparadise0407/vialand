import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { t as translate } from 'i18next'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import useDrivePicker from 'react-google-drive-picker'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fileUploadNotification } from 'apis'
import { qr, second } from 'assets/images'
import { AddressSelect, FormError, FormGroup } from 'components'
import { initialAddressSelectValue } from 'components/AddressSelect'
import config from 'config'
import { RETRY_ERROR } from 'constants/message'
import { useAuthContext } from 'contexts/AuthContext'
import { PropertyActionOptions, PropertyTypeOptions } from 'constants/property'
import { EAction } from 'enums'
import { db } from 'libs/firebase'
import { getFilesMetadata, removeFileFromDriveById } from 'libs/google'
import { mapAddressData } from 'utils/address'
import { slugify } from 'utils/string'

type NewsAddForm = {
  address: IAddress
  architecture: string
  contactName: string
  contactNumber: string
  description: string
  size: number
  structure: string
  direction: string
  subject: string
  addressLink: string
  houseType: number
  paymentImage: string
  price: number
  action: number
  length: number
  width: number
}

const TIMEOUT = 5000

const {
  google: { apiKey, clientId },
  common,
} = config

const contructNewsSubject = (property: Partial<IProperty>) => {
  const { action, houseType, width, length, address } = property

  let area: any = width * length
  area = Number.isInteger(area) ? area : area.toFixed(2)

  const {
    address: inputAddress,
    wardName,
    districtName,
    provinceName,
  } = mapAddressData(address as any)

  return `${translate(
    PropertyActionOptions.find((x) => x.value === action).name,
  )} ${translate(
    PropertyTypeOptions.find((x) => x.value === houseType).name,
  )} ${area}m?? (${width} x ${length}m) - ${inputAddress}, ${wardName}, ${districtName}, ${provinceName}`
}

export default function NewsAdd() {
  const { t } = useTranslation()
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<NewsAddForm>()
  const [openPicker] = useDrivePicker()

  const { token } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [imageList, setImageList] = useState<IKeyValue[]>([])
  const [video, setVideo] = useState<IKeyValue>(null)
  const [paymentImage, setPaymentImage] = useState<IKeyValue>(null)

  const timeout = useRef<NodeJS.Timeout | undefined>(undefined)

  const watchAction = watch('action')

  const unitTransKey = useMemo(
    () => (watchAction === EAction.trade ? 'billion' : 'million'),
    [watchAction],
  )

  // const resetForm = () => {
  //   reset()
  //   setVideo(null)
  //   setImageList([])
  //   setPaymentImage(null)
  // }

  const onSubmit: SubmitHandler<NewsAddForm> = async (data) => {
    setLoading(true)
    try {
      const subject = contructNewsSubject(data as any)
      const slug = slugify(subject) + '-' + Date.now().toString()
      const promises = [
        addDoc(collection(db, 'properties'), {
          ...data,
          ...mapAddressData(data.address),
          slug,
          published: false,
          hideVideo: false,
          images: imageList,
          video,
          paymentImage,
          subject,
          createdAt: Timestamp.now().seconds,
        }),
        fetch(common.baseApiUrl + '/news-submission', {
          headers: {
            'Content-Type': 'application/json',
            secret: common.secret,
          },
          method: 'POST',
          body: JSON.stringify({
            name: subject,
            link: window.location.origin + `/chothue?slug=${slug}`,
          }),
        }),
      ]
      await toast.promise(Promise.all(promises), {
        pending: '??ang ????ng tin',
        success: '????ng tin BDS th??nh c??ng',
        error: RETRY_ERROR,
      })
    } catch (e) {
    } finally {
      if (typeof window !== 'undefined' && 'location' in window) {
        window.location.reload()
      }
      setLoading(false)
    }
  }

  const handleNumberInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleSendNotification = async () => {
    console.count('handleSendNotification')
    await fileUploadNotification()
  }

  const handleOpenPicker = (pickerType: PickerTypeKey) => {
    if (token) {
      timeout.current = setTimeout(() => {
        handleSendNotification()
      }, TIMEOUT)
      openPicker({
        clientId,
        developerKey: apiKey,
        token,
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        setParentFolder: common.isDev
          ? undefined
          : '1ffWn9rpAhl7KOkaEzIcFhuT8k_GvHbfS',
        multiselect: pickerType === 'images',
        disableDefaultView: true,
        // @ts-ignore
        callbackFunction: async (data) => {
          const action = data.action as PickerCallbackAction
          if (action === 'cancel') {
            clearTimeout(timeout.current)
          }
          if (action === 'picked' && data) {
            const { docs } = data
            const media = await getFilesMetadata(docs, token)
            switch (pickerType) {
              case 'video':
                if (!!media?.length) {
                  const { id, embedLink } = media[0]
                  setVideo({ id, value: embedLink })
                }
                break
              case 'images':
                setImageList(
                  media.map(
                    ({ embedLink, id }) =>
                      ({
                        id,
                        value: embedLink,
                      } as IKeyValue),
                  ),
                )
                break
              case 'paymentImage':
                if (!!media?.length) {
                  const { id, embedLink } = media[0]
                  setPaymentImage({ id, value: embedLink })
                }
                break
              default:
                break
            }
          }
        },
      })
    } else toast.error(RETRY_ERROR)
  }

  const handleRemoveImageById = async (id: string) => {
    const clone = [...imageList]
    const foundIdx = clone.findIndex((x) => x.id === id)
    const res = toast.promise<boolean>(removeFileFromDriveById(id, token), {
      pending: '??ang x??a ???nh',
      success: 'X??a ???nh th??nh c??ng',
      error: RETRY_ERROR,
    })

    if (foundIdx > -1 && res) {
      clone.splice(foundIdx, 1)
      setImageList(clone)
    }
  }

  const handleRemoveVideo = async () => {
    const res = await toast.promise<boolean>(
      removeFileFromDriveById(video.id, token),
      {
        pending: '??ang x??a video',
        success: 'X??a video th??nh c??ng',
        error: RETRY_ERROR,
      },
    )
    if (res) {
      setVideo(null)
    }
  }

  const handleRemovePaymentImage = async () => {
    const res = toast.promise<boolean>(
      removeFileFromDriveById(paymentImage.id, token),
      {
        pending: '??ang x??a ???nh',
        success: 'X??a ???nh th??nh c??ng',
        error: RETRY_ERROR,
      },
    )
    if (res) {
      setPaymentImage(null)
    }
  }

  const handleSubmitNews = () => {
    handleSubmit((form) => {
      if (!paymentImage) {
        toast.warn('Vui l??ng t???i l??n ???nh ch???p h??a ????n ????? ????ng b??i')
        return
      }
      onSubmit(form)
    })()
  }

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  return (
    <div className="my-5 mx-5 md:mx-10 lg:mx-20 xl:mx-32 flex gap-5 md:gap-10 kg:gap-20 xl:gap-32 text-xs sm:text-sm md:text-base">
      <div
        className="sticky top-[100px] w-full h-[80vh] mx-auto hidden lg:block"
        style={{
          background: `url(${second}) center no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full text-white text-xl p-[20px] bg-black bg-opacity-50">
          <p className="text-center">????ng tin b???t ?????ng s???n</p>
        </div>
      </div>
      <form className="grid grid-cols-4 w-full place-content-start gap-5">
        <div className="col-span-4 xl:col-span-3">
          <h1 className="text-base md:text-xl xl:text-2xl font-medium">
            ??i???n th??ng tin b???t ?????ng s???n
          </h1>
        </div>

        {/* Subject */}
        <FormGroup
          className="col-span-4 xl:col-span-1"
          htmlFor="subject"
          label="B??n - Cho thu??"
          error={errors.subject}
        >
          <select
            {...register('action', { required: true, valueAsNumber: true })}
            className="input"
          >
            {PropertyActionOptions.map((x) => (
              <option key={x.value} value={x.value}>
                {t(x.name)}
              </option>
            ))}
          </select>
        </FormGroup>

        {/* Type */}
        <FormGroup
          className="col-span-2 xl:col-span-1"
          htmlFor="type"
          label="Lo???i h??nh"
          error={errors.houseType}
        >
          <select
            {...register('houseType', { required: true, valueAsNumber: true })}
            className="input"
          >
            {PropertyTypeOptions.map((x) => (
              <option key={x.value} value={x.value}>
                {t(x.name)}
              </option>
            ))}
          </select>
        </FormGroup>

        {/* Width */}
        <FormGroup
          className="col-span-2 xl:col-span-1"
          htmlFor="width"
          label="Chi???u ngang (m)"
          error={errors.width}
        >
          <input
            {...register('width', {
              valueAsNumber: true,
              required: true,
              min: 0,
              max: 10000,
            })}
            className="input"
            placeholder="Nh???p chi???u ngang"
            type="number"
            step="0.01"
            min={0}
            max={10000}
          />
        </FormGroup>

        {/* Length */}
        <FormGroup
          className="col-span-2 xl:col-span-1"
          htmlFor="length"
          label="Chi???u d??i (m)"
          error={errors.length}
        >
          <input
            {...register('length', {
              valueAsNumber: true,
              required: true,
              min: 0,
              max: 10000,
            })}
            className="input"
            placeholder="Nh???p chi???u d??i"
            type="number"
            step="0.01"
            min={0}
            max={10000}
          />
        </FormGroup>

        {/* Price */}
        <FormGroup
          className="col-span-2 xl:col-span-1"
          htmlFor="price"
          label={`Gi?? (${t(unitTransKey)} ?????ng)`}
          error={errors.price}
        >
          <input
            {...register('price', {
              valueAsNumber: true,
              required: true,
              min: 0,
              max: 10000,
            })}
            className="input"
            placeholder="VD: 0.35"
            type="number"
            step="0.01"
            min={0}
            max={10000}
          />
        </FormGroup>

        {/* Structure */}
        <FormGroup
          className="xl:col-span-2 col-span-4"
          htmlFor="structure"
          label="K???t c???u"
          error={errors.structure}
        >
          <input
            {...register('structure', { required: true })}
            className="input"
            placeholder="VD: 1 tr???t 1 l???ng 1 l???u"
            type="text"
          />
        </FormGroup>

        {/* Architecture */}
        <FormGroup
          className="xl:col-span-1 col-span-4"
          htmlFor="architecture"
          label="Ki???n tr??c"
          error={errors.architecture}
        >
          <input
            {...register('architecture', { required: true })}
            className="input"
            placeholder="VD: 2PN 1WC"
            type="text"
          />
        </FormGroup>

        {/* Direction */}
        <FormGroup
          className="xl:col-span-1 col-span-4"
          htmlFor="direction"
          label="H?????ng"
          error={errors.direction}
        >
          <input
            {...register('direction', { required: true })}
            className="input"
            placeholder="Nh???p h?????ng"
            type="text"
          />
        </FormGroup>

        {/* Address */}
        <FormGroup className="col-span-4" htmlFor="address" label="?????a ch???">
          <Controller
            control={control}
            name="address"
            defaultValue={initialAddressSelectValue}
            rules={{
              required: true,
              validate: (value) => {
                const entries = Object.entries(value)
                let error: string
                let action = 'ch???n'
                entries.forEach(([k, v]) => {
                  if (!v) {
                    switch (k) {
                      case 'ward':
                        error = 'ph?????ng / x??'
                        return
                      case 'district':
                        error = 'qu???n / huy???n'
                        return
                      case 'province':
                        error = 't???nh / th??nh'
                        return
                      case 'address':
                        error = '?????a ch???'
                        action = 'nh???p'
                        return
                      default:
                        break
                    }
                    return
                  }
                })
                if (!error) return true
                return `Vui l??ng ${action} ${error}`
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <AddressSelect value={value} onChange={onChange} />
                <FormError label="?????a ch???" error={error} />
              </>
            )}
          />
        </FormGroup>

        {/* ContactName */}
        <FormGroup
          className="col-span-2"
          htmlFor="contactName"
          label="T??n li??n h???"
          error={errors.contactName}
        >
          <input
            {...register('contactName', { required: true })}
            className="input"
            placeholder="Nguy???n V??n A"
            type="text"
          />
        </FormGroup>

        {/* ContactNumber */}
        <FormGroup
          className="col-span-2"
          htmlFor="contactNumber"
          label="S??T li??n h???"
          error={errors.contactNumber}
        >
          <input
            {...register('contactNumber', {
              required: true,
              pattern: /^0/,
            })}
            className="input"
            maxLength={10}
            placeholder="0911xxxxxx"
            onKeyPress={handleNumberInput}
            type="text"
          />
        </FormGroup>

        {/* Description */}
        <FormGroup
          className="col-span-4"
          htmlFor="description"
          label="Th??ng tin"
          error={errors.description}
        >
          <textarea
            {...register('description', { required: true, maxLength: 255 })}
            className="input resize-none"
            placeholder="VD: G???n ch???, tr?????ng h???c..."
            rows={5}
            maxLength={255}
          ></textarea>
        </FormGroup>

        {/* AddressLink */}
        <FormGroup
          className="col-span-4"
          htmlFor="addressLink"
          label="Link google map"
        >
          <input
            {...register('addressLink')}
            className="input"
            placeholder="Nh???p link google map..."
            type="text"
          />
        </FormGroup>

        {/* Tutorial */}
        <div className="col-span-4">
          <label htmlFor="">
            H?????ng d???n ????ng tin Cho thu?? nh?? & Mua b??n B???t ?????ng s???n:
            <div className="relative aspect-vid">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/ot4gcoYtiEA?autoplay=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </label>
        </div>

        <div className="col-span-4">
          <h1 className="text-base md:text-xl xl:text-2xl font-medium mb-5">
            Vui l??ng ti???n h??nh thanh to??n ????? ????ng tin
          </h1>
          <p>H?????ng d???n thanh to??n</p>
          <p>Chuy???n ti???n qua v?? momo</p>
          <p>S??? ti???n 20.000??</p>
          <p>Ng?????i nh???n 0966885501</p>
          <p>
            Sau ???? t???i ???nh ch???p h??a ????n ???? thanh to??n l??n v??o ?? b??n d?????i r???i b???m
            n??t <b>Ho??n t???t</b>
          </p>

          <img
            className="w-[175px] md:w-[259px] h-[175px] md:h-[259px] mx-auto my-5 shadow"
            src={qr}
            alt=""
          />
          <button
            type="button"
            className="btn w-full md:w-[259px] mx-auto"
            onClick={() => {
              handleOpenPicker('paymentImage')
            }}
          >
            T???i l??n ???nh ch???p h??a ????n
          </button>
          {!!paymentImage && (
            <div className="relative mx-auto w-[120px] my-2">
              <iframe
                title="Payment image"
                className="w-full overflow-hidden aspect-square border"
                src={paymentImage.value}
              />
              <AiOutlineClose
                className="absolute bg-white rounded-full shadow md:text-base lg:text-lg -top-1.5 -right-1.5 cursor-pointer z-10"
                onClick={handleRemovePaymentImage}
              />
            </div>
          )}
        </div>

        {!!paymentImage && (
          <>
            {/* Video */}
            <FormGroup
              className="col-span-4"
              htmlFor="video"
              label="Link video"
            >
              <small>
                Maximum file size limit is 300Mb.(Video Length 12-13 Minutes)
              </small>
              <button
                type="button"
                className="btn w-full md:w-[259px] mx-auto"
                onClick={() => {
                  handleOpenPicker('video')
                }}
              >
                T???i l??n video
              </button>
            </FormGroup>
            <div className="col-span-4 flex flex-wrap gap-2">
              {!!video && (
                <div className="relative mx-auto">
                  <iframe
                    className="w-full overflow-hidden aspect-video border"
                    title="video"
                    scrolling="no"
                    src={video.value}
                  ></iframe>
                  <AiOutlineClose
                    className="absolute bg-white rounded-full shadow md:text-base lg:text-lg -top-1.5 -right-1.5 cursor-pointer z-10"
                    onClick={handleRemoveVideo}
                  />
                </div>
              )}
            </div>

            {/* Images */}
            <FormGroup className="col-span-4" htmlFor="images" label="H??nh ???nh">
              <button
                type="button"
                className="btn w-full md:w-[259px] mx-auto"
                onClick={() => {
                  handleOpenPicker('images')
                }}
              >
                T???i l??n h??nh ???nh
              </button>
            </FormGroup>
            <div className="col-span-4 flex flex-wrap gap-2">
              {imageList.map((x) => (
                <div key={x.id} className="relative">
                  <iframe
                    className="w-[60px] md:w-[80px] lg:w-[96px] overflow-hidden aspect-square border"
                    title={x.id}
                    scrolling="no"
                    src={x.value}
                  ></iframe>
                  <AiOutlineClose
                    className="absolute bg-white rounded-full shadow md:text-base lg:text-lg -top-1.5 -right-1.5 cursor-pointer z-10"
                    onClick={() => handleRemoveImageById(x.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="col-span-4 ">
          <button
            type="button"
            onClick={handleSubmitNews}
            className="btn w-full md:w-[259px] mx-auto mt-5"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            Ho??n t???t
          </button>
        </div>
      </form>
    </div>
  )
}
