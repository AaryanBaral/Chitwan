import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { trainingsApi } from '../lib/api'
import '../styles/training.css'

function isOpen(t){
  const now = Date.now()
  const oa = t.applicationOpenAt ? new Date(t.applicationOpenAt).getTime() : null
  const ca = t.applicationCloseAt ? new Date(t.applicationCloseAt).getTime() : null
  return oa && ca && now >= oa && now <= ca
}

export default function TrainingDetail(){
  const { idOrSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [t, setT] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    trainingsApi.get(idOrSlug)
      .then(res => { if (mounted){ setT(res); setError('') }})
      .catch(()=> { if (mounted) setError('Training not found') })
      .finally(()=> mounted && setLoading(false))
    return () => { mounted = false }
  }, [idOrSlug])

  if (loading) return <div className="training tdetail"><div className="state">Loading…</div></div>
  if (error || !t) return <div className="training tdetail"><div className="state state--error">{error || 'Error'}</div></div>

  const open = isOpen(t)

  return (
    <div className="training tdetail">
      <div className="detail__header">
        <Link className="btn-back" to="/training">← Back</Link>
        <h1>{t.title}</h1>
        <div className="meta">{new Date(t.startAt).toLocaleDateString()} → {new Date(t.endAt).toLocaleDateString()} {t.location ? `• ${t.location}` : ''}</div>
      </div>
      {t.summary && <p className="lede">{t.summary}</p>}
      {t.description && <div className="content" dangerouslySetInnerHTML={{ __html: t.description }} />}

      <div className="actions">
        {open ? (
          <Link className="btn btn--blue" to={`/training/${t.slug || t.id}/apply`}>Apply for this training</Link>
        ): (
          <button className="btn" disabled>Registration closed</button>
        )}
      </div>
    </div>
  )
}

