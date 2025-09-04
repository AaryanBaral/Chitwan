import React, { useMemo, useState } from 'react'

function initials(name=''){ return name.split(/\s+/).map(s=>s[0]).filter(Boolean).slice(0,2).join('').toUpperCase() }

export default function Testimonials({ items = [] }){
  const data = useMemo(() => items && items.length ? items : [], [items])
  const n = data.length
  const [center, setCenter] = useState(0)
  const [dir, setDir] = useState(null) // 'left' | 'right' | null
  const [offset, setOffset] = useState('0%')

  if (!n) return null
  const prev = (center - 1 + n) % n
  const next = (center + 1) % n

  function goRight(){
    if (dir) return
    setDir('left')
    // Right arrow: move content right so LEFT card comes to center
    setOffset('33.333%')
  }
  function goLeft(){
    if (dir) return
    setDir('right')
    // Left arrow: move content left so RIGHT card comes to center
    setOffset('-33.333%')
  }

  const list = [data[prev], data[center], data[next]]

  function onTransitionEnd(){
    if (!dir) return
    if (dir === 'right') setCenter((c)=> (c-1+n)%n)
    if (dir === 'left') setCenter((c)=> (c+1)%n)
    // reset position for next run
    setDir(null)
    setOffset('0%')
  }

  return (
    <div className={`tc-window ${dir ? 'is-anim anim-'+dir : ''}`} role="region" aria-label="Testimonials">
      <button className="tc-nav tc-nav--left" onClick={goLeft} aria-label="Previous" tabIndex={0}>‹</button>
      <div className="tc-track" style={{ transform:`translateX(${offset})`, transition:'transform .35s ease' }} onTransitionEnd={onTransitionEnd}>
        {list.map((t,i) => (
          <article key={(t?.name||'')+i+String(center)} className={`tc-card ${i===1?'is-center':''}`} aria-label={t?.name}>
            <div className="tc-avatar">
              {t?.image ? <img src={t.image} alt={t.name} /> : <span>{initials(t?.name||'')}</span>}
            </div>
            <div className="tc-name">{t?.name}</div>
            {i===1 && t?.role && <div className="tc-role">{t.role}</div>}
            {i===1 && t?.text && <p className="tc-text">{t.text}</p>}
          </article>
        ))}
      </div>
      <button className="tc-nav tc-nav--right" onClick={goRight} aria-label="Next" tabIndex={0}>›</button>
    </div>
  )
}
