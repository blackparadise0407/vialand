import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore/lite'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { second } from 'assets/images'
import { AddressSelect, FormError, FormGroup } from 'components'
import { RETRY_ERROR } from 'constants/message'
import { db } from 'libs/firebase'

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
  video: string
}

export default function NewsAdd() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsAddForm>()
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<NewsAddForm> = async (data) => {
    setLoading(true)
    try {
      const promise = addDoc(collection(db, 'properties'), {
        data,
      })
      toast.promise(promise, {
        pending: 'Đang đăng tin',
        success: 'Đăng tin BDS thành công',
        error: RETRY_ERROR,
      })
      reset()
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const handleNumberInput = (e: any) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div className="my-5 mx-5 md:mx-20 lg:mx-30 flex gap-5">
      <div
        className="relative max-w-[50vh] w-full h-[59vh] mx-auto hidden md:block"
        style={{
          background: `url(${second}) center no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full text-white text-xl p-[20px] bg-black bg-opacity-50">
          <p className="text-center">Đăng tin bất động sản</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-4 w-full lg:w-[50%] md:w-[80%] place-content-start gap-5"
      >
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
            min={0}
            max={10000}
          />
        </FormGroup>
        <FormGroup
          className="xl:col-span-1 col-span-2"
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
          className="xl:col-span-1 col-span-2"
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
        <FormGroup className="col-span-4" htmlFor="address" label="Địa chỉ">
          <Controller
            control={control}
            name="address"
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
          htmlFor="video"
          label="Link video"
          error={errors.video}
        >
          <input
            {...register('video')}
            className="input"
            placeholder="https://example.com/video"
            type="text"
          />
        </FormGroup>
        <div className="col-span-4">
          <button type="submit" className="btn float-right">
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            Đăng tin
          </button>
        </div>
      </form>
    </div>
  )
}
