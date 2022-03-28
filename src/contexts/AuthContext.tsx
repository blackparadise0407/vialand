import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'

import { Modal } from 'components'
import config from 'config'

type AuthProviderProps = {
  children: ReactNode
}

const initialValue: IAuthContext = {
  isAuth: false,
  token: '',
  onLogin: () => {},
  onOpenSignIn: () => {},
}

const PASSWORD = config.common.secret

const AuthContext = createContext<IAuthContext>(initialValue)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState(initialValue.isAuth)
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState('')

  const handleLogin = useCallback((password: string) => {
    if (!password) {
      toast.error('Yêu cầu nhập mật khẩu')
      return
    }
    if (password === PASSWORD) {
      setAuth(true)
      toast.success('Đăng nhập thành công')
    } else {
      toast.error('Sai mật khẩu')
    }
  }, [])

  const handleOpenSignIn = useCallback(() => {
    !auth && setOpen(true)
  }, [auth])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    fetch(config.common.baseApiUrl + '/auth/refresh', {
      method: 'GET',
      headers: {
        secret: config.common.secret,
      },
    })
      .then((r) => r.json())
      .then(({ data }) => {
        if (!data.error) {
          setToken(data.access_token)
        }
      })
      .catch()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuth: auth,
        token,
        onLogin: handleLogin,
        onOpenSignIn: handleOpenSignIn,
      }}
    >
      {children}
      <Modal open={open} onClose={handleClose}>
        Modal
      </Modal>
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
