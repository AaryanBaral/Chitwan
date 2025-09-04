import React, { useState } from 'react'
import '../styles/faq.css'

const QA = [
  ['How do I register for trainings?', 'Open the Training page, pick an open training and click Apply. Fill the form and submit.'],
  ['Where can I find notices?', 'Use the Notices page for the latest public notices and updates.'],
  ['How do I send feedback or complaints?', 'Use the Feedback or Complain page to submit your message. We review all submissions.'],
  ['What languages are supported?', 'Nepali by default with English as a secondary option.'],
]

export default function FAQ(){
  const [open, setOpen] = useState(0)
  return (
    <div className="static">
      <section className="s-hero">
        <h1>FAQ</h1>
        <p>Quick answers to frequently asked questions.</p>
      </section>
      <section className="faq">
        {QA.map(([q,a], idx) => {
          const isOpen = open===idx
          return (
          <article key={idx} className={`faq-item ${open===idx?'is-open':''}`}>
            <button className="faq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen? -1 : idx)}>
              <span>{q}</span>
              <span>{open===idx ? '−' : '+'}</span>
            </button>
              <div className="faq-a" role="region" aria-hidden={!isOpen}>{a}</div>
          </article>
        )
        })}
      </section>
    </div>
  )
}
