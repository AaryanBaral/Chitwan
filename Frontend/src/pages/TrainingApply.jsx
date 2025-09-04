import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { trainingRegApi, trainingsApi } from '../lib/api'
import '../styles/training.css'

export default function TrainingApply(){
  const { idOrSlug } = useParams()
  const nav = useNavigate()
  const [t, setT] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ registrantName:'', registrantEmail:'', registrantPhone:'', citizenshipNo:'', organization:'', address:'' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let mounted = true
    trainingsApi.get(idOrSlug)
      .then(res => { if (mounted) setT(res) })
      .catch(()=> { if (mounted) setError('Training not found') })
      .finally(()=> mounted && setLoading(false))
    return () => { mounted = false }
  }, [idOrSlug])

  function update(e){
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function submit(e){
    e.preventDefault()
    if (!t) return
    setSubmitting(true)
    setError(''); setSuccess('')
    try{
      await trainingRegApi.create({ trainingId: t.id, ...form })
      setSuccess('Application submitted successfully')
      setTimeout(() => nav(`/training/${t.slug || t.id}`), 1200)
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to submit application')
    }finally{
      setSubmitting(false)
    }
  }

  if (loading) return <div className="training tapply"><div className="state">Loading…</div></div>
  if (error || !t) return <div className="training tapply"><div className="state state--error">{error || 'Error'}</div></div>

  return (
    <div className="training tapply">
      <div className="detail__header">
        <Link className="btn-back" to={`/training/${t.slug || t.id}`}>← Back</Link>
        <h1>Apply: {t.title}</h1>
      </div>
      <form className="form" onSubmit={submit}>
        <div className="grid2">
          <label>
            <span>Full name</span>
            <input name="registrantName" required value={form.registrantName} onChange={update} />
          </label>
          <label>
            <span>Email</span>
            <input name="registrantEmail" type="email" value={form.registrantEmail} onChange={update} />
          </label>
          <label>
            <span>Phone</span>
            <input name="registrantPhone" value={form.registrantPhone} onChange={update} />
          </label>
          <label>
            <span>Citizenship No.</span>
            <input name="citizenshipNo" value={form.citizenshipNo} onChange={update} />
          </label>
          <label>
            <span>Organization</span>
            <input name="organization" value={form.organization} onChange={update} />
          </label>
          <label className="full">
            <span>Address</span>
            <input name="address" value={form.address} onChange={update} />
          </label>
        </div>
        {error && <div className="state state--error" style={{marginTop:12}}>{error}</div>}
        {success && <div className="state" style={{marginTop:12}}>{success}</div>}
        <div className="actions">
          <button className="btn btn--blue" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit application'}</button>
        </div>
      </form>
    </div>
  )
}

