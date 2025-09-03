import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { noticesApi, uploadsUrl } from '../lib/api'
import '../styles/notices.css'

export default function NoticeDetail(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    noticesApi.get(id)
      .then(res => { if (mounted) { setNotice(res); setError('') } })
      .catch(() => { if (mounted) setError('Notice not found') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="notices noticedetail"><div className="state">Loading…</div></div>
  if (error || !notice) return <div className="notices noticedetail"><div className="state state--error">{error || 'Error'}</div></div>

  return (
    <div className="notices noticedetail">
      <div className="detail__header">
        <Link className="btn-back" to="/notices">← Back</Link>
        <h1>{notice.title}</h1>
        <div className="meta">Posted {new Date(notice.createdAt).toLocaleDateString()}</div>
      </div>
      {notice.attachment && (
        <div className="heroimg">
          <img src={uploadsUrl(notice.attachment)} alt={notice.title} />
        </div>
      )}
      {notice.summary && <p className="lede">{notice.summary}</p>}
      {notice.body && <div className="content" dangerouslySetInnerHTML={{ __html: notice.body }} />}
      {notice.linkUrl && <p className="linkwrap"><a className="cta" href={notice.linkUrl} target="_blank" rel="noreferrer">Open Link</a></p>}
    </div>
  )
}

