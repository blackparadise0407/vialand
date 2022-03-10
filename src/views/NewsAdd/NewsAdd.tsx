import { first, second } from 'assets/images'

export default function NewsAdd() {
  return (
    <div className="m-5 flex">
      <div
        className="relative max-w-[60vh] w-full h-[59vh] mx-auto"
        style={{
          background: `url(${second}) center no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute bottom-0 left-0 w-full text-white text-xl p-[20px] bg-black bg-opacity-50">
          <p className="text-center">Đăng tin bất động sản</p>
        </div>
      </div>
      <div className="grid grid-cols-4 w-[50%]">
        <div className="form-input col-span-4">
          <label htmlFor="subject">Tiêu đề</label>
          <input className="input" placeholder="Nhập tiêu đề" type="text" />
        </div>
        <div className="form-input">
          <label htmlFor="size">Diện tích</label>
          <input
            className="input"
            placeholder="Nhập diện tích"
            type="number"
            min={0}
            max={10000}
          />
        </div>
        <div className="form-input">
          <label htmlFor="description">Mô tả</label>
          <input className="input" placeholder="Nhập mô tả" type="text" />
        </div>
        <div className="form-input">
          <label htmlFor="contactName">Tên liên hệ</label>
          <input className="input" placeholder="Nhập tên liên hệ" type="text" />
        </div>
        <div className="form-input">
          <label htmlFor="contactNumber">SĐT liên hệ</label>
          <input className="input" placeholder="Nhập SĐT" type="text" />
        </div>
      </div>
    </div>
  )
}
