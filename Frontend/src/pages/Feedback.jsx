import React, { useState } from 'react'
import '../styles/feedback.css'

export default function Feedback(){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setSent(true) }
  return (
    <div className="static">
      <section className="s-hero">
        <h1>Feedback</h1>
        <p>Share your thoughts to help us improve.</p>
      </section>
      <section className="panel">
        <h2>Send feedback</h2>
        <form className="form" onSubmit={submit}>
          <div className="row-2">
            <div className="group"><label>Name</label><input className="input" name="name" value={form.name} onChange={update} required/></div>
            <div className="group"><label>Email</label><input className="input" name="email" type="email" value={form.email} onChange={update} /></div>
          </div>
          <div className="group"><label>Message</label><textarea className="textarea" name="message" value={form.message} onChange={update} required/></div>
          <div className="actions"><button className="btn">Submit</button></div>
          {sent && <div style={{marginTop:12}}>Thank you for your feedback!</div>}
        </form>
      </section>
    </div>
  )
}
