import { useAuthContext } from 'contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  const { isAuth } = useAuthContext()

  // if (!isAuth) {
  //   return <Navigate to="/dang-nhap" />
  // }

  return <Outlet />
}
