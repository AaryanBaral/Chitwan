import React, { useState } from 'react'
import '../styles/contact.css'

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [sent, setSent] = useState(false)
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setSent(true) }
  return (
    <div className="static">
      <section className="s-hero">
        <h1>Contact</h1>
        <p>Reach out to the ward office. We’re here to help.</p>
      </section>
      <section className="grid-2">
        <article className="panel">
          <h2>Send a message</h2>
          <form className="form" onSubmit={submit}>
            <div className="row-2">
              <div className="group"><label>Name</label><input className="input" name="name" value={form.name} onChange={update} required/></div>
              <div className="group"><label>Email</label><input className="input" name="email" type="email" value={form.email} onChange={update} /></div>
            </div>
            <div className="row-2">
              <div className="group"><label>Phone</label><input className="input" name="phone" value={form.phone} onChange={update}/></div>
              <div className="group"><label>Subject</label><input className="input" name="subject" onChange={update}/></div>
            </div>
            <div className="group"><label>Message</label><textarea className="textarea" name="message" value={form.message} onChange={update} required/></div>
            <div className="actions"><button className="btn">Send message</button></div>
            {sent && <div style={{marginTop:12}}>Your message has been sent.</div>}
          </form>
        </article>
        <article className="panel">
          <h2>Office</h2>
          <p><strong>Address:</strong> Ward Office, Chitwan</p>
          <p><strong>Email:</strong> info@example.gov.np</p>
          <p><strong>Phone:</strong> +977-1-1111111</p>
          <p><strong>Hours:</strong> Sun–Fri, 10am–5pm</p>
        </article>
      </section>
    </div>
  )
}
