import { FormGroup } from 'components'
import { useAuthContext } from 'contexts/AuthContext'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const { isAuth, onLogin } = useAuthContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    const pwd = inputRef.current?.value
    onLogin(pwd)
  }

  useEffect(() => {
    if (isAuth) navigate('/quan-tri')
  }, [isAuth])

  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="space-y-5">
        <h1 className="text-xl font-medium text-center">Quản trị</h1>
        <FormGroup label="Mật khẩu" htmlFor="password">
          <input ref={inputRef} type="password" className="input" />
        </FormGroup>
        <button className="btn w-full" onClick={handleLogin}>
          Đăng nhập
        </button>
      </div>
    </div>
  )
}
