import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthContext } from 'contexts/AuthContext'

export default function AuthLayout() {
  const { isAuth } = useAuthContext()
  const { search } = useLocation()

  if (!isAuth) {
    return <Navigate to="/dang-nhap" state={search} />
  }

  return <Outlet />
}
