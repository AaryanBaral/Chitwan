import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Pages
import TourGuides from './Client/TourGuide.jsx'

function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
        <Link to="/" style={{ fontWeight: 700 }}>Home</Link>
        <Link to="/tour-guides">Tour Guides</Link>
      </header>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<div>Welcome! Use the nav to explore.</div>} />
          <Route path="/tour-guides" element={<TourGuides />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
