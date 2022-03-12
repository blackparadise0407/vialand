import { Route, Routes } from 'react-router-dom'
import NewsAdd from 'views/News/NewsAdd'
import NewsDetail from 'views/News/NewsDetail'
import NotFound from 'views/NotFound/NotFound'
import MainLayout from './layouts/MainLayout/MainLayout'
import LandingPage from './views/Landing/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/nha-dat" element={<NewsAdd />} />
        <Route path="/nha-dat/:id" element={<NewsDetail />} />
        <Route path="/cho-thue" element={<div>Cho thuee</div>} />
        <Route path="/dang-tin" element={<NewsAdd />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
