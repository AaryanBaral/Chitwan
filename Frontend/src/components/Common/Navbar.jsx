import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../../styles/navbar.css'
import LanguageToggle from './LanguageToggle'
import { useTranslate } from '../../lib/i18n'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const t = useTranslate()

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
          <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>{t('Home')}</NavLink></li>

          <li><NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>{t('About')}</NavLink></li>
          <li><NavLink to="/flora-fauna" className={({isActive}) => isActive ? 'active' : ''}>{t('Flora & Fauna')}</NavLink></li>
          <li><NavLink to="/blogs" className={({isActive}) => isActive ? 'active' : ''}>{t('Blogs')}</NavLink></li>

          <li className="highlight">
            <NavLink to="/tour-guides" className={({isActive}) => isActive ? 'active' : ''}>{t('Guides')}</NavLink>
          </li>

          <li><NavLink to="/hotels" className={({isActive}) => isActive ? 'active' : ''}>{t('Hotels')}</NavLink></li>
          <li><NavLink to="/notices" className={({isActive}) => isActive ? 'active' : ''}>{t('Notices')}</NavLink></li>
          <li><NavLink to="/training" className={({isActive}) => isActive ? 'active' : ''}>{t('Training')}</NavLink></li>
          {/* Forms link removed from navbar as requested */}

          {/* Gallery dropdown */}
          <li className="has-dropdown">
            <a href="#gallery" className="dropdown__toggle">
              <span>{t('Gallery')}</span>
              <span className="caret">▾</span>
            </a>
            <ul className="dropdown">
              <li><a href="#photos">{t('Photos')}</a></li>
              <li><a href="#videos">{t('Videos')}</a></li>
            </ul>
          </li>

          <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>{t('Contact')}</NavLink></li>
          <li><NavLink to="/faq" className={({isActive}) => isActive ? 'active' : ''}>{t('FAQ')}</NavLink></li>
          <li><NavLink to="/feedback" className={({isActive}) => isActive ? 'active' : ''}>{t('Feedback')}</NavLink></li>
          <li><NavLink to="/complain" className={({isActive}) => isActive ? 'active' : ''}>{t('Complain')}</NavLink></li>
          <li className="lang-slot"><LanguageToggle /></li>
        </ul>
      </nav>
    </div>
  )
}
