import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'
import { noticesApi, trainingsApi } from '../lib/api'

export default function Home() {
  const [latestNotices, setLatestNotices] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    let mounted = true
    noticesApi.list({ page:1, pageSize:5, status:'published', sortBy:'created_at', sortOrder:'DESC' })
      .then(res => { if (mounted) setLatestNotices(res.items || []) })
      .catch(()=>{})
    trainingsApi.list({ page:1, pageSize:10, status:'published', sortBy:'start_at', sortOrder:'ASC' })
      .then(res => {
        if (!mounted) return
        const now = Date.now()
        const items = (res.items||[]).filter(t => {
          const s = t.startAt ? new Date(t.startAt).getTime() : 0
          const e = t.endAt ? new Date(t.endAt).getTime() : 0
          return now <= e
        }).slice(0,5)
        setActivities(items)
      }).catch(()=>{})
    return () => { mounted = false }
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__text">
          <h1>Welcome to the Ward Portal</h1>
          <p>Promoting flora & fauna, services, and community programs.</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/tour-guides">Find Guides</Link>
            <a className="btn btn--light" href="#flora-fauna">Explore Flora & Fauna</a>
          </div>
        </div>
      </section>

      <section className="home__grid">
        <div className="panel">
          <div className="panel__title">Current activities</div>
          <ul className="notice">
            {activities.map(a => (
              <li key={a.id}>
                <Link to={`/training/${a.slug || a.id}`}>{a.title}</Link>
                <small>{new Date(a.startAt).toLocaleDateString()} → {new Date(a.endAt).toLocaleDateString()}</small>
              </li>
            ))}
            {!activities.length && <li>No active items</li>}
          </ul>
        </div>

        <div className="panel">
          <div className="panel__title">Latest notices</div>
          <ul className="notice">
            {latestNotices.map(n => (
              <li key={n.id}>
                <Link to={`/notices/${n.id}`}>{n.title}</Link>
                <small>{new Date(n.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
            {!latestNotices.length && <li>No notices</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}
