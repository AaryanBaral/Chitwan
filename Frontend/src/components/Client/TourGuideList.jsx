import React from 'react'
import '../../styles/TourGuideList.css'

// Simple, static dataset for listing
const GUIDES = [
  { id: 1, name: 'Ramesh Thapa', languages: ['English', 'Nepali'], phone: '+9779801234567', email: 'ramesh.guide@example.com' },
  { id: 2, name: 'Sita Gurung',  languages: ['English'],            phone: '+9779812345678', email: 'sita.gurung@example.com' },
  { id: 3, name: 'Hari Chaudhary',languages: ['Nepali'],            phone: '+9779841111111', email: 'hari.c@example.com' },
  { id: 4, name: 'Mina Lama',     languages: ['English','Nepali'],  phone: '+9779852020202', email: 'mina.lama@example.com' },
]

export default function TourGuideList() {
  return (
    <section className="tgl">
      <h1 className="tgl__title">Tour Guide Directory</h1>

      <ul className="tgl__grid">
        {GUIDES.map(g => (
          <li key={g.id} className="tgl__card">
            <div className="tgl__cardBody">
              <div className="tgl__name">{g.name}</div>
              <div className="tgl__meta">Languages: {g.languages.join(', ')}</div>
              <div className="tgl__actions">
                <a className="btn btn--accent" href={`tel:${g.phone}`}>Call</a>
                <a className="btn btn--ghost" href={`mailto:${g.email}`}>Email</a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
