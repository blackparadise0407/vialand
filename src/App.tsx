import { Route, Routes } from 'react-router-dom'

import { AuthLayout } from 'layouts/AuthLayout'
import { Login } from 'views/Auth'
import { NewsAdd, NewsDetail, NewsManagement } from 'views/News'
import NotFound from 'views/NotFound/NotFound'
import { MainLayout } from './layouts/MainLayout'
import LandingPage from './views/Landing/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/nha-dat" element={<NewsAdd />} />
        <Route path="/nha-dat/:slug" element={<NewsDetail />} />
        <Route path="/cho-thue" element={<div>Cho thuee</div>} />
        <Route path="/dang-tin" element={<NewsAdd />} />
      </Route>
      <Route path="/quan-tri" element={<AuthLayout />}>
        <Route index element={<NewsManagement />} />
      </Route>
      <Route path="/dang-nhap" element={<Login />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
