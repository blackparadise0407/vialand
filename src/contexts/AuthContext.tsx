import { Modal } from 'components'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'

type AuthProviderProps = {
  children: ReactNode
}

const initialValue: IAuthContext = {
  isAuth: false,
  token: '',
  onLogin: () => {},
  onOpenSignIn: () => {},
}

const PASSWORD = process.env.REACT_APP_SECRET || '123456'

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
    fetch(
      process.env.REACT_APP_BASE_API + '/auth/refresh' ||
        'http://localhost:5000/auth/refresh',
      {
        method: 'GET',
        headers: {
          secret: process.env.REACT_APP_SECRET,
        },
      },
    )
      .then((r) => r.json())
      .then(({ data }) => setToken(data.access_token))
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
