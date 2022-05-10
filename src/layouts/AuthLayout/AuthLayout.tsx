import { Fragment, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { FormGroup, Modal } from 'components'
import { useAuthContext } from 'contexts/AuthContext'

export default function AuthLayout() {
  const navigate = useNavigate()
  const { isAuth, onLogin } = useAuthContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    if (inputRef.current) {
      onLogin(inputRef.current.value)
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <Fragment>
      <Modal open={!isAuth} title="Vui lòng đăng nhập" onClose={handleClose}>
        <div className="grow">
          <div className="space-y-5">
            <h1 className="text-xl font-medium text-center">Quản trị</h1>
            <FormGroup label="Mật khẩu" htmlFor="password">
              <input ref={inputRef} type="password" className="input" />
            </FormGroup>
            <div className="flex justify-end">
              <button className="btn" onClick={handleLogin}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {isAuth && <Outlet />}
    </Fragment>
  )
}
