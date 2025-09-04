import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { floraApi, uploadsUrl } from '../lib/api'
import '../styles/flora.css'

export default function FloraFaunaDetail(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [item, setItem] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    floraApi.get(id)
      .then(res => { if (mounted) { setItem(res); setError('') } })
      .catch(() => { if (mounted) setError('Not found') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="flora floradetail"><div className="state">Loading…</div></div>
  if (error || !item) return <div className="flora floradetail"><div className="state state--error">{error || 'Error'}</div></div>

  const cover = (item.images && item.images[0]) ? uploadsUrl(item.images[0]) : null

  return (
    <div className="flora floradetail">
      <div className="detail__header">
        <Link className="btn-back" to="/flora-fauna">← Back</Link>
        <h1>{item.commonName}</h1>
        <div className="meta">
          {item.type && <span className={`badge ${item.type === 'flora' ? 'badge--blue' : 'badge--red'}`}>{item.type}</span>}
          {item.scientificName && <span className="sci">{item.scientificName}</span>}
        </div>
      </div>
      {cover && (
        <div className="heroimg">
          <img src={cover} alt={item.commonName} />
        </div>
      )}
      {item.description && <p className="lede">{item.description}</p>}
      <div className="finfo">
        {item.habitat && <div><strong>Habitat:</strong> {item.habitat}</div>}
        {item.location && <div><strong>Location:</strong> {item.location}</div>}
        {item.conservationStatus && <div><strong>Status:</strong> {item.conservationStatus}</div>}
      </div>
    </div>
  )
}

