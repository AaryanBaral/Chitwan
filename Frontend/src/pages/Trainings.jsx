import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { trainingsApi } from '../lib/api'
import '../styles/training.css'

function classify(items){
  const now = Date.now()
  const open = []
  const upcoming = []
  const closed = []
  for (const t of items){
    const oa = t.applicationOpenAt ? new Date(t.applicationOpenAt).getTime() : null
    const ca = t.applicationCloseAt ? new Date(t.applicationCloseAt).getTime() : null
    if (oa && ca && now >= oa && now <= ca) open.push(t)
    else if (oa && now < oa) upcoming.push(t)
    else closed.push(t)
  }
  return { open, upcoming, closed }
}

export default function Trainings(){
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })

  const q = params.get('q') || ''
  const sort = params.get('sort') || 'soonest'
  const page = Number(params.get('page') || '1')

  const apiSort = useMemo(() => {
    if (sort === 'latest') return { sortBy: 'created_at', sortOrder: 'DESC' }
    return { sortBy: 'start_at', sortOrder: 'ASC' }
  }, [sort])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    trainingsApi.list({ page, pageSize: 50, q, status: 'published', ...apiSort })
      .then(res => { if (mounted) { setData(res); setError('') } })
      .catch(() => { if (mounted) setError('Failed to load trainings') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [q, sort, page])

  const groups = useMemo(() => classify(data.items || []), [data.items])

  function updateParam(next){
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k,v]) => {
      if (v === undefined || v === null || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    setParams(p, { replace: true })
  }

  const Section = ({ title, items }) => (
    <section className="tsection">
      <h2 className="tsection__title">{title}</h2>
      {(!items || !items.length) ? <div className="state">No items</div> : (
        <div className="grid">
          {items.map(t => (
            <article key={t.id} className="tcard">
              <div className="tcard__body">
                <h3 className="tcard__title"><Link to={`/training/${t.slug || t.id}`}>{t.title}</Link></h3>
                {t.summary && <p className="tcard__sum">{t.summary}</p>}
                <div className="tcard__meta">
                  <span>{new Date(t.startAt).toLocaleDateString()} → {new Date(t.endAt).toLocaleDateString()}</span>
                  {t.location && <span>{t.location}</span>}
                </div>
              </div>
              <div className="tcard__actions">
                <Link className="btn" to={`/training/${t.slug || t.id}`}>View details</Link>
                <ApplyButton t={t} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )

  function ApplyButton({ t }){
    const now = Date.now()
    const oa = t.applicationOpenAt ? new Date(t.applicationOpenAt).getTime() : null
    const ca = t.applicationCloseAt ? new Date(t.applicationCloseAt).getTime() : null
    const open = oa && ca && now >= oa && now <= ca
    if (open) return <Link className="btn btn--blue" to={`/training/${t.slug || t.id}/apply`}>Apply</Link>
    return <button className="btn" disabled>Closed</button>
  }

  return (
    <div className="training">
      <div className="training__header">
        <h1>Training</h1>
        <div className="filters">
          <input type="search" placeholder="Search" value={q} onChange={e => updateParam({ q: e.target.value, page: 1 })} />
          <select value={sort} onChange={e => updateParam({ sort: e.target.value, page: 1 })}>
            <option value="soonest">Soonest</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>

      {loading && <div className="state">Loading…</div>}
      {error && <div className="state state--error">{error}</div>}

      {!loading && !error && (
        <>
          <Section title="Open For Applications" items={groups.open} />
          <Section title="Upcoming" items={groups.upcoming} />
          <Section title="Closed" items={groups.closed} />
        </>
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

