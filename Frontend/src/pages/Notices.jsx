import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { noticesApi, uploadsUrl } from '../lib/api'
import '../styles/notices.css'

export default function Notices(){
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })

  const q = params.get('q') || ''
  const sort = params.get('sort') || 'newest'
  const page = Number(params.get('page') || '1')
  const pop = params.get('pop') === '1'

  const apiSort = useMemo(() => {
    if (sort === 'oldest') return { sortBy: 'created_at', sortOrder: 'ASC' }
    if (sort === 'priority') return { sortBy: 'priority', sortOrder: 'DESC' }
    return { sortBy: 'created_at', sortOrder: 'DESC' }
  }, [sort])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    noticesApi.list({ page, pageSize: 12, q, status: 'published', isPopup: pop || undefined, ...apiSort })
      .then(res => { if (mounted) { setData(res); setError('') } })
      .catch(e => { if (mounted) setError('Failed to load notices') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [q, sort, page, pop])

  function updateParam(next){
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k,v]) => {
      if (v === undefined || v === null || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    setParams(p, { replace: true })
  }

  return (
    <div className="notices">
      <div className="notices__header">
        <h1>Notices</h1>
        <div className="filters">
          <input
            type="search"
            placeholder="Search"
            value={q}
            onChange={e => updateParam({ q: e.target.value, page: 1 })}
          />
          <select value={sort} onChange={e => updateParam({ sort: e.target.value, page: 1 })}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
          </select>
          <label className="toggle">
            <input type="checkbox" checked={pop} onChange={e => updateParam({ pop: e.target.checked ? '1' : '' , page: 1 })} />
            Popup-only
          </label>
        </div>
      </div>

      {loading && <div className="state">Loading…</div>}
      {error && <div className="state state--error">{error}</div>}

      {!loading && !error && (
        <div className="grid">
          {data.items.map(n => (
            <article key={n.id} className="ncard">
              <div className="ncard__media">
                {n.attachment && <img src={uploadsUrl(n.attachment)} alt="attachment" onError={(e)=>{ e.currentTarget.style.display='none' }} />}
              </div>
              <div className="ncard__body">
                <h3 className="ncard__title"><Link to={`/notices/${n.id}`}>{n.title}</Link></h3>
                {n.summary && <p className="ncard__sum">{n.summary}</p>}
                <div className="ncard__meta">
                  <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  {n.isPopup ? <span className="badge badge--red">Popup</span> : null}
                </div>
              </div>
            </article>
          ))}
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

