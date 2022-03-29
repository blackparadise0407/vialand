import { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import useDrivePicker from 'react-google-drive-picker'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { second } from 'assets/images'
import { AddressSelect, FormError, FormGroup, Modal } from 'components'
import config from 'config'
import { RETRY_ERROR } from 'constants/message'
import { useAuthContext } from 'contexts/AuthContext'
import { PropertyTypeOptions } from 'constants/property'
import { db } from 'libs/firebase'
import { getFilesMetadata, removeFileFromDriveById } from 'libs/google'
import { mapAddressData } from 'utils/address'
import { slugify } from 'utils/string'
import { initialAddressSelectValue } from 'components/AddressSelect'

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
  type: number
  paymentImage: string
  price: number
}

const {
  google: { apiKey, clientId },
} = config

export default function NewsAdd() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsAddForm>()
  const [openPicker, data] = useDrivePicker()
  const [loading, setLoading] = useState(false)
  const { token } = useAuthContext()
  const [imageList, setImageList] = useState<IKeyValue[]>([])
  const [video, setVideo] = useState<IKeyValue>(null)
  const [paymentImage, setPaymentImage] = useState<IKeyValue>(null)
  const [pickerType, setPickerType] = useState<PickerTypeKey>(undefined)
  const [open, setOpen] = useState(false)

  const resetForm = () => {
    reset()
    setVideo(null)
    setImageList([])
    setPaymentImage(null)
    setOpen(false)
  }

  const onSubmit: SubmitHandler<NewsAddForm> = async (data) => {
    setLoading(true)
    try {
      const subject =
        PropertyTypeOptions.find((x) => x.value === data.type).name +
        ' - ' +
        data.subject
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
            link: window.location.origin + `/quan-tri?slug=${slug}`,
          }),
        }),
      ]
      toast.promise(Promise.all(promises), {
        pending: 'Đang đăng tin',
        success: 'Đăng tin BDS thành công',
        error: RETRY_ERROR,
      })
    } catch (e) {
    } finally {
      resetForm()
      setLoading(false)
    }
  }

  const handleNumberInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleOpenPicker = (pickerType: PickerTypeKey) => {
    openPicker({
      clientId,
      developerKey: apiKey,
      token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: pickerType === 'images',
      disableDefaultView: true,
    })
  }

  const handleRemoveImageById = async (id: string) => {
    const clone = [...imageList]
    const foundIdx = clone.findIndex((x) => x.id === id)

    if (
      foundIdx > -1 &&
      toast.promise<boolean>(removeFileFromDriveById(id, token), {
        pending: 'Đang xóa ảnh',
        success: 'Xóa ảnh thành công',
        error: RETRY_ERROR,
      })
    ) {
      clone.splice(foundIdx, 1)
      setImageList(clone)
    }
  }

  const handleRemoveVideo = async () => {
    if (
      toast.promise<boolean>(removeFileFromDriveById(video.id, token), {
        pending: 'Đang xóa video',
        success: 'Xóa video thành công',
        error: RETRY_ERROR,
      })
    ) {
      setVideo(null)
    }
  }

  const handleRemovePaymentImage = async () => {
    if (
      toast.promise<boolean>(removeFileFromDriveById(paymentImage.id, token), {
        pending: 'Đang xóa ảnh',
        success: 'Xóa ảnh thành công',
        error: RETRY_ERROR,
      })
    ) {
      setPaymentImage(null)
    }
  }

  const toggleModal = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const handleSubmitNews = () => {
    if (!paymentImage) {
      toast.warn('Vui lòng tải lên ảnh chụp hóa đơn để đăng bài')
      return
    }
    handleSubmit(onSubmit)()
  }

  useEffect(() => {
    async function eff() {
      if (data) {
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
                ({ thumbnailLink, id }, idx) =>
                  ({
                    id,
                    value: thumbnailLink,
                  } as IKeyValue),
              ),
            )
            break
          case 'paymentImage':
            if (!!media?.length) {
              const { id, thumbnailLink } = media[0]
              setPaymentImage({ id, value: thumbnailLink })
            }
            break
          default:
            break
        }
      }
    }
    eff()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const { common } = config

  return (
    <div className="my-5 mx-5 md:mx-20 lg:mx-30 flex gap-5">
      <div
        className="sticky top-[100px] max-w-[50vh] w-full h-[59vh] mx-auto hidden md:block"
        style={{
          background: `url(${second}) center no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full text-white text-xl p-[20px] bg-black bg-opacity-50">
          <p className="text-center">Đăng tin bất động sản</p>
        </div>
      </div>
      <form className="grid grid-cols-4 w-full lg:w-[50%] md:w-[80%] place-content-start gap-5">
        <div className="col-span-4">
          <h1 className="text-2xl font-medium">
            Điền thông tin của bất động sản
          </h1>
        </div>
        <FormGroup
          className="col-span-4"
          htmlFor="subject"
          label="Tiêu đề"
          error={errors.subject}
        >
          <input
            {...register('subject', { required: true })}
            className="input"
            placeholder="Nhập tiêu đề..."
            type="text"
          />
        </FormGroup>
        <FormGroup
          className="col-span-2 xl:col-span-1"
          htmlFor="type"
          label="Phân loại"
          error={errors.type}
        >
          <select
            {...register('type', { required: true, valueAsNumber: true })}
            className="input"
          >
            {PropertyTypeOptions.map((x) => (
              <option key={x.value} value={x.value}>
                {x.name}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup
          className="col-span-2 xl:col-span-1"
          htmlFor="price"
          label="Giá (tỷ đồng)"
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
            placeholder="Nhập giá..."
            type="number"
            step="0.01"
            min={0}
            max={10000}
          />
        </FormGroup>

        <FormGroup
          className="xl:col-span-1 col-span-2"
          htmlFor="direction"
          label="Hướng"
          error={errors.direction}
        >
          <input
            {...register('direction', { required: true })}
            className="input"
            placeholder="Nhập hướng"
            type="text"
          />
        </FormGroup>
        <FormGroup
          className="xl:col-span-1 col-span-2"
          htmlFor="size"
          label="Diện tích (m²)"
          error={errors.size}
        >
          <input
            {...register('size', {
              valueAsNumber: true,
              required: true,
              min: 0,
              max: 10000,
            })}
            className="input"
            placeholder="Nhập diện tích..."
            type="number"
            step="0.1"
            min={0}
            max={10000}
          />
        </FormGroup>
        <FormGroup
          className="xl:col-span-2 col-span-4"
          htmlFor="structure"
          label="Kết cấu"
          error={errors.structure}
        >
          <input
            {...register('structure', { required: true })}
            className="input"
            placeholder="VD: 1 trệt 1 lửng 1 lầu"
            type="text"
          />
        </FormGroup>
        <FormGroup
          className="xl:col-span-2 col-span-4"
          htmlFor="architecture"
          label="Kiến trúc"
          error={errors.architecture}
        >
          <input
            {...register('architecture', { required: true })}
            className="input"
            placeholder="VD: 2PN 1WC"
            type="text"
          />
        </FormGroup>

        <FormGroup className="col-span-4" htmlFor="address" label="Địa chỉ">
          <Controller
            control={control}
            name="address"
            defaultValue={initialAddressSelectValue}
            rules={{
              required: true,
              validate: (value) => {
                const entries = Object.entries(value)
                return entries.every(([, v]) => !!v)
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <AddressSelect value={value} onChange={onChange} />
                <FormError label="Địa chỉ" error={error} />
              </>
            )}
          />
        </FormGroup>
        <FormGroup
          className="col-span-2"
          htmlFor="contactName"
          label="Tên liên hệ"
          error={errors.contactName}
        >
          <input
            {...register('contactName', { required: true })}
            className="input"
            placeholder="Nguyễn Văn A"
            type="text"
          />
        </FormGroup>
        <FormGroup
          className="col-span-2"
          htmlFor="contactNumber"
          label="SĐT liên hệ"
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
        <FormGroup
          className="col-span-4"
          htmlFor="description"
          label="Thông tin"
          error={errors.description}
        >
          <textarea
            {...register('description', { required: true, maxLength: 255 })}
            className="input resize-none"
            placeholder="Nhập thông tin..."
            rows={5}
            maxLength={255}
          ></textarea>
        </FormGroup>
        <FormGroup
          className="col-span-4"
          htmlFor="addressLink"
          label="Link google map"
        >
          <input
            {...register('addressLink')}
            className="input"
            placeholder="Nhập link google map..."
            type="text"
          />
        </FormGroup>
        <FormGroup className="col-span-4" htmlFor="video" label="Link video">
          <small>
            Maximum file size limit is 300Mb.(Video Length 12-13 Minutes)
          </small>
          <button
            type="button"
            className="btn float-right"
            onClick={() => {
              setPickerType('video')
              handleOpenPicker('video')
            }}
          >
            Tải lên video
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
        <FormGroup className="col-span-4" htmlFor="video" label="Hình ảnh">
          <button
            type="button"
            className="btn float-right"
            onClick={() => {
              setPickerType('images')
              handleOpenPicker('images')
            }}
          >
            Tải lên hình ảnh
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
        <div className="col-span-4 ">
          <button
            type="button"
            onClick={toggleModal}
            className="btn float-right"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            Đăng tin
          </button>
        </div>
      </form>
      <Modal
        open={open}
        onClose={toggleModal}
        title="Vui lòng tiến hành thanh toán để hoàn tất đăng tin"
      >
        <div className="grow">
          <h1 className="text-sm md:text-base font-medium">
            Hướng dẫn thanh toán
          </h1>
          <p className="text-sm md:text-base">
            Tiến hành quét mã bên dưới để thanh toán. Sau đó tải ảnh chụp hóa
            đơn thanh toán vào bên dưới và nhấn nút <b>Hoàn tất</b>
          </p>

          <iframe
            width="100%"
            className="h-[500px] overflow-hidden py-2"
            title="momo payment"
            scrolling="vertical"
            src={common.paymentLink}
          ></iframe>
          <button
            type="button"
            className="btn w-full"
            onClick={() => {
              setPickerType('paymentImage')
              handleOpenPicker('paymentImage')
            }}
          >
            Tải lên ảnh chụp hóa đơn
          </button>
          {!!paymentImage && (
            <div className="relative mx-auto w-[120px] my-2">
              <img
                className="w-full overflow-hidden aspect-square border"
                src={paymentImage.value}
                alt=""
              />
              <AiOutlineClose
                className="absolute bg-white rounded-full shadow md:text-base lg:text-lg -top-1.5 -right-1.5 cursor-pointer z-10"
                onClick={handleRemovePaymentImage}
              />
            </div>
          )}
          <button onClick={handleSubmitNews} className="btn w-full mt-5">
            Hoàn tất
          </button>
        </div>
      </Modal>
    </div>
  )
}
