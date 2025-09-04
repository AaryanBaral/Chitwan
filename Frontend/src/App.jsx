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
import Hotels from './pages/Hotels.jsx'
import HotelDetail from './pages/HotelDetail.jsx'
import FloraFauna from './pages/FloraFauna.jsx'
import FloraFaunaDetail from './pages/FloraFaunaDetail.jsx'
import About from './pages/About.jsx'
import Trainings from './pages/Trainings.jsx'
import TrainingDetail from './pages/TrainingDetail.jsx'
import TrainingApply from './pages/TrainingApply.jsx'
import FAQ from './pages/FAQ.jsx'
import Feedback from './pages/Feedback.jsx'
import Complain from './pages/Complain.jsx'
import Contact from './pages/Contact.jsx'

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
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/flora-fauna" element={<FloraFauna />} />
          <Route path="/flora-fauna/:id" element={<FloraFaunaDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/complain" element={<Complain />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/training" element={<Trainings />} />
          <Route path="/training/:idOrSlug" element={<TrainingDetail />} />
          <Route path="/training/:idOrSlug/apply" element={<TrainingApply />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
