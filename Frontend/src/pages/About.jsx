import React, { useEffect, useRef, useState } from 'react'
import '../styles/about.css'
import { useTranslate } from '../lib/i18n.jsx'
import Testimonials from '../components/Common/Testimonials.jsx'

export default function About(){
  const t = useTranslate()
  const tsliderRef = useRef(null)
  const ptrackRef = useRef(null)
  const [pIndex, setPIndex] = useState(1)
  useEffect(() => {
    const track = document.getElementById('ttrack')
    const slider = tsliderRef.current
    const dots = Array.from(document.querySelectorAll('#tscroll button'))
    function go(i){
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i))
      if (!track || !slider) return
      const w = slider.offsetWidth
      track.style.transform = `translateX(${-i * w}px)`
    }
    const handlers = dots.map((btn, i) => {
      const fn = () => go(i); btn.addEventListener('click', fn); return [btn, fn]
    })
    const onResize = () => { const a = document.querySelector('#tscroll button.active'); const idx = a ? Number(a.dataset.index) : 0; go(idx) }
    window.addEventListener('resize', onResize)
    go(0)
    return () => { handlers.forEach(([btn, fn]) => btn.removeEventListener('click', fn)); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    // People slider 3-at-once with center emphasis
    const wrap = ptrackRef.current
    if (!wrap) return
    const items = Array.from(wrap.querySelectorAll('.person'))
    function apply(){
      items.forEach((el, i) => {
        el.classList.remove('is-center','is-side')
        if (i === pIndex) el.classList.add('is-center')
        else if (i === pIndex-1 || i === pIndex+1) el.classList.add('is-side')
      })
      // center the active card
      const w = wrap.clientWidth
      const cardW = items[0]?.offsetWidth || 0
      const gap = 16
      const offset = (pIndex * (cardW + gap)) - (w/2 - cardW/2)
      wrap.style.transform = `translateX(${-Math.max(0, offset)}px)`
    }
    apply()
    const onResize = () => apply()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [pIndex])
  return (
    <div className="about">
      <section className="hero">
        <div className="hero__inner">
          <h1>{t('About')}</h1>
          <p>We serve our community with transparent services, conservation focus, and modern digital access.</p>
          <div className="hero__chips">
            <span className="chip chip--red">Service</span>
            <span className="chip chip--blue">Conservation</span>
            <span className="chip chip--black">Transparency</span>
          </div>
        </div>
      </section>

      <section className="grid two">
        <article className="panel">
          <h2>Our Mission</h2>
          <p>
            Empower citizens with accessible services, preserve local heritage, and promote responsible tourism
            through data-driven decisions and community programs.
          </p>
        </article>
        <article className="panel">
          <h2>Our Vision</h2>
          <p>
            A thriving ward where nature, culture, and people prosper together — with transparent governance and
            a modern digital experience.
          </p>
        </article>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat__num">24/7</div>
          <div className="stat__label">Digital Access</div>
        </div>
        <div className="stat">
          <div className="stat__num">50+</div>
          <div className="stat__label">Community Programs</div>
        </div>
        <div className="stat">
          <div className="stat__num">100%</div>
          <div className="stat__label">Open & Transparent</div>
        </div>
      </section>

      <section className="values">
        <h2>Core Values</h2>
        <ul>
          <li>
            <span className="bullet bullet--red" />
            People-first services with dignity
          </li>
          <li>
            <span className="bullet bullet--blue" />
            Evidence-based planning and action
          </li>
          <li>
            <span className="bullet bullet--black" />
            Accountability and transparency
          </li>
        </ul>
      </section>

      <section className="timeline">
        <h2>Journey</h2>
        <div className="steps">
          <div className="step">
            <div className="dot dot--red" />
            <div className="step__body">
              <h3>Community Onboarding</h3>
              <p>Establish shared standards for data and service delivery.</p>
            </div>
          </div>
          <div className="step">
            <div className="dot dot--blue" />
            <div className="step__body">
              <h3>Digital Services</h3>
              <p>Roll out self-service portals with accessible information.</p>
            </div>
          </div>
          <div className="step">
            <div className="dot dot--black" />
            <div className="step__body">
              <h3>Conservation & Growth</h3>
              <p>Scale conservation programs and tourism responsibly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Testimonials</h2>
        <Testimonials
          items={[
            { name: 'Anna Deynah', role: 'UX Designer', text: 'Excellent service and responsive staff. The portal makes everything easier.', image: '' },
            { name: 'John Doe', role: 'Web Developer', text: 'Clean processes and clear instructions. Appreciate the transparency.', image: '' },
            { name: 'Maria Kate', role: 'Photographer', text: 'Quick updates and friendly support — love the initiative!', image: '' },
            { name: 'Sita Sharma', role: 'Community Lead', text: 'Programs are well organized and inclusive.', image: '' },
            { name: 'Ram Karki', role: 'Volunteer', text: 'Registration and follow-ups were smooth through the portal.', image: '' },
          ]}
        />
      </section>

      <section className="people">
        <h2>Associated Persons</h2>
        <div className="ptrack" ref={ptrackRef}>
          {[
            ['AB', 'Ward Chairperson'],
            ['CD', 'Chief Admin Officer'],
            ['EF', 'IT Coordinator'],
            ['GH', 'Tourism Officer'],
          ].map(([init, pos], idx) => (
            <div key={idx} className="person">
              <div className="person__img">{init}</div>
              <div className="person__name">{pos.split(' ')[0]} {pos.split(' ')[1]}</div>
              <div className="person__pos">{pos}</div>
            </div>
          ))}
        </div>
        <div className="pnav">
          <button onClick={() => setPIndex(i => Math.max(0, i-1))}>‹</button>
          <button onClick={() => setPIndex(i => Math.min(3, i+1))}>›</button>
        </div>
      </section>
    </div>
  )
}
