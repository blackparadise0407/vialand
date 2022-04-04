import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from 'layouts/AuthLayout'
import { Login } from 'views/Auth'
import { NewsAdd, NewsDetail, NewsList, NewsManagement } from 'views/News'
import NotFound from 'views/NotFound/NotFound'
import { MainLayout } from './layouts/MainLayout'
import { Landing } from './views/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="/mua-ban" element={<NewsList />} />
        <Route path="/cho-thue" element={<NewsList />} />
        <Route path="/dang-tin" element={<NewsAdd />} />
        <Route path="/:slug" element={<NewsDetail />} />
      </Route>
      <Route path="/quan-tri" element={<AuthLayout />}>
        <Route index element={<NewsManagement />} />
      </Route>
      <Route path="/dang-nhap" element={<Login />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
