import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { blogsApi, uploadsUrl } from '../lib/api'
import '../styles/blogs.css'
import { useLanguage, useTranslate, translateFields } from '../lib/i18n'

export default function Blogs(){
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })
  const { lang } = useLanguage()
  const t = useTranslate()

  const q = params.get('q') || ''
  const sort = params.get('sort') || 'newest'
  const page = Number(params.get('page') || '1')

  const apiSort = useMemo(() => {
    if (sort === 'oldest') return { sortBy: 'created_at', sortOrder: 'ASC' }
    if (sort === 'title') return { sortBy: 'title', sortOrder: 'ASC' }
    return { sortBy: 'created_at', sortOrder: 'DESC' }
  }, [sort])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    blogsApi.list({ page, pageSize: 12, q, status: 'published', ...apiSort })
      .then(async (res) => {
        if (!mounted) return
        let items = res.items
        if (lang === 'ne') {
          try { items = await translateFields(res.items, ['title','summary'], 'ne') } catch {}
        }
        setData({ ...res, items })
        setError('')
      })
      .catch(e => { if (mounted) setError('Failed to load blogs') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [q, sort, page, lang])

  function updateParam(next){
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k,v]) => {
      if (v === undefined || v === null || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    setParams(p, { replace: true })
  }

  return (
    <div className="blogs">
      <div className="blogs__header">
        <h1>{t('Blogs')}</h1>
        <div className="filters">
          <input
            type="search"
            placeholder={t('Search')}
            value={q}
            onChange={e => updateParam({ q: e.target.value, page: 1 })}
          />
          <select value={sort} onChange={e => updateParam({ sort: e.target.value, page: 1 })}>
            <option value="newest">{t('Newest first')}</option>
            <option value="oldest">{t('Oldest first')}</option>
            <option value="title">{t('Title A–Z')}</option>
          </select>
        </div>
      </div>

      {loading && <div className="state">{t('Loading')}</div>}
      {error && <div className="state state--error">{error}</div>}

      {!loading && !error && (
        <div className="grid">
          {data.items.map(b => {
            const href = `/blogs/${b.slug || b.id}`
            return (
              <article key={b.id} className="card">
                <div className="card__imgwrap" aria-hidden>
                  {b.image && <img src={uploadsUrl(b.image)} alt="" onError={(e)=>{ e.currentTarget.style.display='none' }} />}
                </div>
                <div className="card__body">
                  <h3 className="card__title">{b.title}</h3>
                  {b.summary && <p className="card__sum">{b.summary}</p>}
                  <div className="card__meta">
                    <span>Added {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link className="card__link" to={href} aria-label={`Open ${b.title}`} />
              </article>
            )
          })}
        </div>
      )}

      {!loading && !error && (
        <div className="pager">
          <button disabled={data.page <= 1} onClick={() => updateParam({ page: Math.max(1, data.page - 1) })}>{t('Prev')}</button>
          <span>{t('Page')} {data.page}</span>
          <button disabled={(data.page * data.pageSize) >= data.total} onClick={() => updateParam({ page: data.page + 1 })}>{t('Next')}</button>
        </div>
      )}
    </div>
  )
}
