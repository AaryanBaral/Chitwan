import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/App.css'

import Navbar from './components/Common/Navbar.jsx'
import Footer from './components/Common/Footer.jsx'
import Home from './pages/Home.jsx'
import TourGuides from './components/Client/TourGuide.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tour-guides" element={<TourGuides />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
