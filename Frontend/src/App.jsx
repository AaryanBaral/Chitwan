import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/App.css'

import Navbar from './components/Common/Navbar.jsx'
import Footer from './components/Common/Footer.jsx'
import Home from './pages/Home.jsx'
import TourGuides from './components/Client/TourGuide.jsx'
import Blogs from './pages/Blogs.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import Notices from './pages/Notices.jsx'
import NoticeDetail from './pages/NoticeDetail.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tour-guides" element={<TourGuides />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:idOrSlug" element={<BlogDetail />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
