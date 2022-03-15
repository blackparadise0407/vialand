import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useWindowSize } from 'hooks/useWindowSize'
import Footer from './Footer'
import Header from './Header'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [w] = useWindowSize()
  const location = useLocation()

  const handleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  useEffect(() => {
    if (w > 720 && collapsed) {
      setCollapsed(false)
    }
  }, [w, collapsed])

  useEffect(() => {
    setCollapsed(false)
  }, [location])

  return (
    <div>
      <Header collapsed={collapsed} onCollapsed={handleCollapsed} />
      <main className="min-h-[calc(100vh-88px-374px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
