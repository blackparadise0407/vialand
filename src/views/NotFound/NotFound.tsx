import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="h-screen w-full grid place-content-center items-center space-y-5">
      <div className="text-xl">
        <b>404</b> <span>Không tìm thấy trang</span>
      </div>
      <Link className="text-center text-blue-500 hover:text-blue-400" to="/">
        Trở về trang chủ
      </Link>
    </div>
  )
}
