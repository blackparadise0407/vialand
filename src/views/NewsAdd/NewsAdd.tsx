import { second } from 'assets/images'
import { AddressSelect } from 'components'
import { useForm } from 'react-hook-form'

export default function NewsAdd() {
  const { register } = useForm()

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
      <form className="grid grid-cols-4 w-full lg:w-[50%] md:w-[80%] place-content-start gap-5">
        <div className="col-span-4">
          <h1 className="text-2xl font-medium">
            Điền thông tin của bất động sản
          </h1>
        </div>
        <div className="form-input col-span-4">
          <label htmlFor="subject">Tiêu đề</label>
          <input className="input" placeholder="Nhập tiêu đề..." type="text" />
        </div>
        <div className="form-input xl:col-span-1 col-span-2">
          <label htmlFor="size">Diện tích (m²)</label>
          <input
            className="input"
            placeholder="Nhập diện tích..."
            type="number"
            min={0}
            max={10000}
          />
        </div>
        <div className="form-input xl:col-span-1 col-span-2">
          <label htmlFor="structure">Kết cấu</label>
          <input
            className="input"
            placeholder="VD: 1 trệt 1 lửng 1 lầu"
            type="text"
          />
        </div>
        <div className="form-input xl:col-span-1 col-span-2">
          <label htmlFor="architecture">Kiến trúc</label>
          <input className="input" placeholder="VD: 2PN 1WC" type="text" />
        </div>
        <div className="form-input xl:col-span-1 col-span-2">
          <label htmlFor="direction">Hướng</label>
          <input className="input" placeholder="Nhập hướng" type="text" />
        </div>
        <div className="col-span-4">
          <label htmlFor="address">Địa chỉ</label>
          <AddressSelect />
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="contactName">Tên liên hệ</label>
          <input className="input" placeholder="Nguyễn Văn A" type="text" />
        </div>
        <div className="form-input col-span-2">
          <label htmlFor="contactNumber">SĐT liên hệ</label>
          <input
            className="input"
            maxLength={10}
            placeholder="0911xxxxxx"
            onKeyPress={handleNumberInput}
            type="text"
          />
        </div>
        <div className="form-input col-span-4">
          <label htmlFor="description">Thông tin</label>
          <textarea
            {...register('description')}
            className="input resize-none"
            placeholder="Nhập thông tin..."
            rows={5}
            maxLength={255}
          ></textarea>
        </div>
        <div className="form-input col-span-4">
          <label htmlFor="video">Link video</label>
          <input
            {...register('video')}
            className="input"
            placeholder="https://example.com/video"
            type="text"
          />
        </div>

        <div className="col-span-4">
          <button className="btn float-right">Đăng tin</button>
        </div>
      </form>
    </div>
  )
}
