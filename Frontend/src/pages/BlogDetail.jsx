import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { blogsApi, uploadsUrl } from '../lib/api'
import '../styles/blogs.css'

export default function BlogDetail(){
  const { idOrSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    blogsApi.get(idOrSlug)
      .then(res => { if (mounted) { setBlog(res); setError('') } })
      .catch(() => { if (mounted) setError('Blog not found') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [idOrSlug])

  if (loading) return <div className="blogs blogdetail"><div className="state">Loading…</div></div>
  if (error || !blog) return <div className="blogs blogdetail"><div className="state state--error">{error || 'Error'}</div></div>

  return (
    <div className="blogs blogdetail">

      
      <div className="detail__header">
        <Link className="btn-back" to="/blogs">← Back</Link>
        <h1>{blog.title}</h1>
        <div className="meta">Published {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}</div>
      </div>
      {blog.image && (
        <div className="heroimg">
          <img src={uploadsUrl(blog.image)} alt={blog.title} />
        </div>
      )}
      {blog.summary && <p className="lede">{blog.summary}</p>}
      {blog.content && <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />}
    </div>
  )}

