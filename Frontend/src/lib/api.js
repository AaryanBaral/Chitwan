// Simple API helper for the frontend
// Configure via VITE_API_BASE (e.g., http://localhost:3000/api/v1)
// and VITE_API_ORIGIN for non-API assets (e.g., http://localhost:3000)

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:3000/api/v1'
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN?.replace(/\/$/, '') || API_BASE.replace(/\/?api\/.*/, '') || 'http://localhost:3000'

function buildQuery(params = {}) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue
    if (Array.isArray(v)) {
      if (v.length) q.set(k, v.join(','))
    } else {
      q.set(k, String(v))
    }
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

async function get(path, params) {
  const url = `${API_BASE}${path}${buildQuery(params)}`
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const uploadsUrl = (relPath) => {
  if (!relPath) return null
  const clean = String(relPath).replace(/^\/+/, '')
  return `${API_ORIGIN}/uploads/${clean}`
}

export const guidesApi = {
  list: (params) => get('/guide', params),
  get: (id) => get(`/guide/${id}`),
}

export { API_BASE, API_ORIGIN }

