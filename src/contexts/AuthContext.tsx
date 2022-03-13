import { Modal } from 'components'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { toast } from 'react-toastify'

type AuthProviderProps = {
  children: ReactNode
}

const initialValue: IAuthContext = {
  isAuth: false,
  onLogin: () => {},
  onOpenSignIn: () => {},
}

const PASSWORD = process.env.PASSWORD || '123456'

const AuthContext = createContext<IAuthContext>(initialValue)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState(initialValue.isAuth)
  const [open, setOpen] = useState(false)

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

  return (
    <AuthContext.Provider
      value={{
        isAuth: auth,
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
