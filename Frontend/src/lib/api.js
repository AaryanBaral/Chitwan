// Simple API helper for the frontend (axios-based)
// Configure via VITE_API_BASE (e.g., http://localhost:3000/api/v1)
// and VITE_API_ORIGIN for non-API assets (e.g., http://localhost:3000)
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:3000/api/v1'
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN?.replace(/\/$/, '') || API_BASE.replace(/\/?api\/.*/, '') || 'http://localhost:3000'

const api = axios.create({ baseURL: API_BASE, withCredentials: true })

async function get(path, params) {
  const res = await api.get(path, { params })
  return res.data
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

export const blogsApi = {
  list: (params) => get('/blog', params),
  get: (idOrSlug) => get(`/blog/${idOrSlug}`),
}

export const noticesApi = {
  list: (params) => get('/notice', params),
  get: (id) => get(`/notice/${id}`),
  popups: (limit = 10) => get('/notice/popups', { limit }),
}

export { API_BASE, API_ORIGIN, api }
