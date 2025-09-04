import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { hotelsApi, uploadsUrl } from '../lib/api'
import '../styles/hotels.css'

export default function Hotels(){
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })

  const q = params.get('q') || ''
  const city = params.get('city') || ''
  const state = params.get('state') || ''
  const country = params.get('country') || ''
  const sort = params.get('sort') || 'newest'
  const page = Number(params.get('page') || '1')

  const apiSort = useMemo(() => {
    if (sort === 'oldest') return { sortBy: 'created_at', sortOrder: 'ASC' }
    if (sort === 'name') return { sortBy: 'name', sortOrder: 'ASC' }
    return { sortBy: 'created_at', sortOrder: 'DESC' }
  }, [sort])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    hotelsApi.list({ page, pageSize: 12, q, city, state, country, ...apiSort })
      .then(res => { if (mounted) { setData(res); setError('') } })
      .catch(() => { if (mounted) setError('Failed to load hotels') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [q, city, state, country, sort, page])

  function updateParam(next){
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k,v]) => {
      if (v === undefined || v === null || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    setParams(p, { replace: true })
  }

  return (
    <div className="hotels">
      <div className="hotels__header">
        <h1>Hotels</h1>
        <div className="filters">
          <input type="search" placeholder="Search hotels" value={q} onChange={e => updateParam({ q: e.target.value, page: 1 })} />
          <input type="text" placeholder="City" value={city} onChange={e => updateParam({ city: e.target.value, page: 1 })} />
          <input type="text" placeholder="State" value={state} onChange={e => updateParam({ state: e.target.value, page: 1 })} />
          <input type="text" placeholder="Country" value={country} onChange={e => updateParam({ country: e.target.value, page: 1 })} />
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
          {data.items.map(h => {
            const href = `/hotels/${h.id}`
            const cover = (h.images && h.images[0]) ? uploadsUrl(h.images[0]) : null
            return (
              <article key={h.id} className="card">
                <div className="card__media" aria-hidden>
                  {cover && <img src={cover} alt="" onError={(e)=>{ e.currentTarget.style.display='none' }} />}
                </div>
                <div className="card__body">
                  <h3 className="card__title">{h.name}</h3>
                  <p className="card__sum">{h.address || ''}{h.city ? `, ${h.city}` : ''}{h.country ? `, ${h.country}` : ''}</p>
                </div>
                <Link className="card__link" to={href} aria-label={`Open ${h.name}`} />
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

