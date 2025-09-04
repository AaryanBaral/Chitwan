import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { floraApi, uploadsUrl } from '../lib/api'
import '../styles/flora.css'

export default function FloraFauna(){
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })

  const q = params.get('q') || ''
  const type = params.get('type') || '' // flora | fauna
  const habitat = params.get('habitat') || ''
  const location = params.get('location') || ''
  const sort = params.get('sort') || 'newest'
  const page = Number(params.get('page') || '1')

  const apiSort = useMemo(() => {
    if (sort === 'oldest') return { sortBy: 'created_at', sortOrder: 'ASC' }
    if (sort === 'name') return { sortBy: 'common_name', sortOrder: 'ASC' }
    return { sortBy: 'created_at', sortOrder: 'DESC' }
  }, [sort])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    floraApi.list({ page, pageSize: 12, q, type: type || undefined, habitat: habitat || undefined, location: location || undefined, ...apiSort })
      .then(res => { if (mounted) { setData(res); setError('') } })
      .catch(() => { if (mounted) setError('Failed to load items') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [q, type, habitat, location, sort, page])

  function updateParam(next){
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k,v]) => {
      if (v === undefined || v === null || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    setParams(p, { replace: true })
  }

  return (
    <div className="flora">
      <div className="flora__header">
        <h1>Flora & Fauna</h1>
        <div className="filters">
          <input type="search" placeholder="Search" value={q} onChange={e => updateParam({ q: e.target.value, page: 1 })} />
          <select value={type} onChange={e => updateParam({ type: e.target.value, page: 1 })}>
            <option value="">All types</option>
            <option value="flora">Flora</option>
            <option value="fauna">Fauna</option>
          </select>
          <input type="text" placeholder="Habitat" value={habitat} onChange={e => updateParam({ habitat: e.target.value, page: 1 })} />
          <input type="text" placeholder="Location" value={location} onChange={e => updateParam({ location: e.target.value, page: 1 })} />
          <select value={sort} onChange={e => updateParam({ sort: e.target.value, page: 1 })}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {loading && <div className="state">Loading…</div>}
      {error && <div className="state state--error">{error}</div>}

      {!loading && !error && (
        <div className="grid">
          {data.items.map(it => {
            const href = `/flora-fauna/${it.id}`
            const cover = (it.images && it.images[0]) ? uploadsUrl(it.images[0]) : null
            return (
              <article key={it.id} className="card">
                <div className="card__media" aria-hidden>
                  {cover && <img src={cover} alt="" onError={(e)=>{ e.currentTarget.style.display='none' }} />}
                </div>
                <div className="card__body">
                  <h3 className="card__title">{it.commonName}</h3>
                  <div className="card__meta">
                    {it.type ? <span className={`badge ${it.type === 'flora' ? 'badge--blue' : 'badge--red'}`}>{it.type}</span> : null}
                    {it.scientificName ? <span className="sci">{it.scientificName}</span> : null}
                  </div>
                  {it.habitat && <p className="card__sum">Habitat: {it.habitat}</p>}
                </div>
                <Link className="card__link" to={href} aria-label={`Open ${it.commonName}`} />
              </article>
            )
          })}
        </div>
      )}

      {!loading && !error && (
        <div className="pager">
          <button disabled={data.page <= 1} onClick={() => updateParam({ page: Math.max(1, data.page - 1) })}>Prev</button>
          <span>Page {data.page}</span>
          <button disabled={(data.page * data.pageSize) >= data.total} onClick={() => updateParam({ page: data.page + 1 })}>Next</button>
        </div>
      )}
    </div>
  )
}

