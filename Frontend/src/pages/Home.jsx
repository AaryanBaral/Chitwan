import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
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
            <li><a href="#training">Upcoming training: Nature guiding basics</a><small>Starting next week</small></li>
            <li><a href="#blogs">Blog: Conserving community forests</a><small>New post</small></li>
            <li><a href="#notices">Call for volunteers: Ward clean-up</a><small>Open</small></li>
          </ul>
        </div>

        <div className="panel">
          <div className="panel__title">Latest notices</div>
          <ul className="notice">
            <li><a href="#notices">Community training registration open</a><small>Just now</small></li>
            <li><a href="#notices">Ward clean-up program this weekend</a><small>2 days ago</small></li>
          </ul>
        </div>
      </section>
    </div>
  )
}
