import { Navigate, Outlet } from 'react-router-dom'

import { useAuthContext } from 'contexts/AuthContext'

export default function AuthLayout() {
  const { isAuth } = useAuthContext()

  if (!isAuth) {
    return <Navigate to="/dang-nhap" />
  }

  return <Outlet />
}
