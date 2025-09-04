import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { hotelsApi, uploadsUrl } from '../lib/api'
import '../styles/hotels.css'

export default function HotelDetail(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hotel, setHotel] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    hotelsApi.get(id)
      .then(res => { if (mounted) { setHotel(res); setError('') } })
      .catch(() => { if (mounted) setError('Hotel not found') })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="hotels hoteldetail"><div className="state">Loading…</div></div>
  if (error || !hotel) return <div className="hotels hoteldetail"><div className="state state--error">{error || 'Error'}</div></div>

  const cover = (hotel.images && hotel.images[0]) ? uploadsUrl(hotel.images[0]) : null

  return (
    <div className="hotels hoteldetail">
      <div className="detail__header">
        <Link className="btn-back" to="/hotels">← Back</Link>
        <h1>{hotel.name}</h1>
        {(hotel.city || hotel.country) && (
          <div className="meta">{hotel.city || ''}{hotel.country ? `, ${hotel.country}` : ''}</div>
        )}
      </div>
      {cover && (
        <div className="heroimg">
          <img src={cover} alt={hotel.name} />
        </div>
      )}
      {hotel.description && <p className="lede">{hotel.description}</p>}
      <div className="hinfo">
        {hotel.address && <div><strong>Address:</strong> {hotel.address}</div>}
        {hotel.contactPhone && <div><strong>Phone:</strong> <a href={`tel:${hotel.contactPhone}`}>{hotel.contactPhone}</a></div>}
        {hotel.contactEmail && <div><strong>Email:</strong> <a href={`mailto:${hotel.contactEmail}`}>{hotel.contactEmail}</a></div>}
      </div>
    </div>
  )
}

