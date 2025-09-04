import React, { useState } from 'react'
import '../styles/complain.css'

export default function Complain(){
  const [form, setForm] = useState({ name:'', email:'', subject:'', details:'' })
  const [sent, setSent] = useState(false)
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setSent(true) }
  return (
    <div className="static">
      <section className="s-hero">
        <h1>Complain</h1>
        <p>Report issues or concerns. We will review and respond.</p>
      </section>
      <section className="panel">
        <h2>Submit a complain</h2>
        <form className="form" onSubmit={submit}>
          <div className="row-2">
            <div className="group"><label>Name</label><input className="input" name="name" value={form.name} onChange={update} required/></div>
            <div className="group"><label>Email</label><input className="input" name="email" type="email" value={form.email} onChange={update} /></div>
          </div>
          <div className="group"><label>Subject</label><input className="input" name="subject" value={form.subject} onChange={update} required/></div>
          <div className="group"><label>Details</label><textarea className="textarea" name="details" value={form.details} onChange={update} required/></div>
          <div className="actions"><button className="btn">Send complain</button></div>
          {sent && <div style={{marginTop:12}}>Your complain has been submitted.</div>}
        </form>
      </section>
    </div>
  )
}
