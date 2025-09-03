import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../../styles/navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="site-wrapper">
      {/* Top utility bar */}
      <div className="utilbar">
        <div className="utilbar__inner">
          <span>Call Center: <strong>1141</strong></span>
          <span className="dot" />
          <a href="mailto:info@example.gov.np">info@example.gov.np</a>
          <div className="spacer" />
          <a className="util-link" href="#monitoring">Monitoring form list</a>
        </div>
      </div>

      {/* Banner header */}
      <header className="banner">
        <div className="banner__left" aria-hidden>
          <div className="crest">NP</div>
        </div>
        <div className="banner__center">
          <div className="banner__kicker">Government of Nepal</div>
          <div className="banner__dept">Department of Foreign Employment</div>
          <div className="banner__sub">Tahachal, Kathmandu</div>
        </div>
        <div className="banner__right" aria-hidden>
          <div className="flag">🇳🇵</div>
        </div>
      </header>

      {/* Main nav */}
      <nav className="mainnav">
        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
          ☰
        </button>
        <ul className={`mainnav__list ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
          <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>

          <li><a href="#about">About</a></li>
          <li><a href="#flora-fauna">Flora & Fauna</a></li>
          <li><NavLink to="/blogs" className={({isActive}) => isActive ? 'active' : ''}>Blogs</NavLink></li>

          <li className="highlight">
            <NavLink to="/tour-guides" className={({isActive}) => isActive ? 'active' : ''}>Guides</NavLink>
          </li>

          <li><a href="#hotels">Hotels</a></li>
          <li><NavLink to="/notices" className={({isActive}) => isActive ? 'active' : ''}>Notices</NavLink></li>
          <li><a href="#training">Training</a></li>
          <li><a href="#forms">Forms</a></li>

          {/* Gallery dropdown */}
          <li className="has-dropdown">
            <a href="#gallery" className="dropdown__toggle">
              <span>Gallery</span>
              <span className="caret">▾</span>
            </a>
            <ul className="dropdown">
              <li><a href="#photos">Photos</a></li>
              <li><a href="#videos">Videos</a></li>
            </ul>
          </li>

          <li><a href="#contact">Contact</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#feedback">Feedback</a></li>
          <li><a href="#complain">Complain</a></li>
        </ul>
      </nav>
    </div>
  )
}
