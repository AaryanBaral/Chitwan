import React from 'react'
import '../../styles/footer.css'

export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <div className="footer__title">Quick Links</div>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#flora-fauna">Flora & Fauna</a></li>
            <li><a href="#blogs">Blogs</a></li>
            <li><a href="#hotels">Hotels</a></li>
            <li><a href="#notices">Notices</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <div className="footer__title">Programs</div>
          <ul>
            <li><a href="#training">Training</a></li>
            <li><a href="#forms">Forms</a></li>
            <li><a href="#photos">Photos</a></li>
            <li><a href="#videos">Videos</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <div className="footer__title">Support</div>
          <ul>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#feedback">Feedback</a></li>
            <li><a href="#complain">Complain</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">© {new Date().getFullYear()} Ward Portal</div>
    </footer>
  )
}

