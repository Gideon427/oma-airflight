'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TrackPackage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmed = trackingNumber.trim().toUpperCase()

    if (!trimmed) {
      setError('Please enter a tracking number')
      return
    }

    if (trimmed.length < 8) {
      setError('Tracking number should be at least 8 characters')
      return
    }

    setIsLoading(true)

    // Redirect to dynamic tracking page
    router.push(`/tracking/${trimmed}`)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card track-form">
          <div className="card-header">
            <h1>Track Your Package</h1>
            <p className="text-gray-600 mt-2">Enter your tracking number below</p>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="trackingNumber">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value)
                    setError('')
                  }}
                  placeholder="e.g. ABC1234567"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={isLoading}
                >
                  {isLoading ? 'Tracking...' : 'Track Package'}
                </button>
              </div>
            </form>
            
            <div className="track-help mt-6">
              <p className="text-sm text-gray-500 mb-3">Don&apos;t have a tracking number?</p>
              <Link href="/admin" className="btn btn-secondary">
                Go to Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}