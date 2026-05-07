'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa'
import Map from '@/components/Map'

export default function TrackingResult() {
  const { trackingNumber } = useParams()

  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchShipment = async () => {
      if (!trackingNumber) {
        setError('No tracking number provided')
        setLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, 'shipments'),
          where('trackingNumber', '==', trackingNumber.toUpperCase())
        )

        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          setError(`No shipment found with tracking number: ${trackingNumber}`)
        } else {
          setShipment({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() })
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load tracking information')
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()
  }, [trackingNumber])

  // Calculate Progress
  const progress = shipment?.route && shipment?.routeIndex !== undefined
    ? Math.round(((shipment.routeIndex + 1) / shipment.route.length) * 100)
    : 30

  if (loading) {
    return (
      <div className="tracking-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="tracking-page">
        <div className="container text-center py-20">
          <h2 className="text-3xl font-bold mb-4 text-red-600">Tracking Not Found</h2>
          <p className="mb-8 text-lg">{error || 'Shipment not found'}</p>
          <a href="/track" className="btn btn-primary">
            Try Another Tracking Number
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="tracking-page">
      <div className="container">
        {/* Header */}
        <div className="tracking-header">
          <h1>Tracking #: <span className="font-mono text-2xl">{trackingNumber}</span></h1>

          <div className="status-badge">
            {shipment.status === 'delivered' ? (
              <FaCheckCircle className="icon delivered" />
            ) : shipment.status === 'in-transit' ? (
              <FaTruck className="icon in-transit" />
            ) : (
              <FaBox className="icon processing" />
            )}
            <span className="capitalize">{shipment.status.replace('-', ' ')}</span>
          </div>

          <div className="current-location">
            <FaMapMarkerAlt className="icon" />
            <strong>{shipment.currentLocation}</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container mb-10">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span>Shipment Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Shipment Details */}
          <div className="shipment-info">
            <h2>Shipment Details</h2>
            <div className="info-grid">
              <div>
                <h3>Sender</h3>
                <p>{shipment.sender?.name}</p>
                <p className="text-sm text-gray-600">{shipment.sender?.address}</p>
              </div>
              <div>
                <h3>Receiver</h3>
                <p>{shipment.receiver?.name}</p>
                <p className="text-sm text-gray-600">{shipment.receiver?.address}</p>
              </div>
              <div>
                <h3>Package</h3>
                <p>{shipment.package?.description}</p>
                <p>Weight: {shipment.package?.weight} kg</p>
                <p>Value: ${shipment.package?.value}</p>
              </div>
            </div>
          </div>

          {/* Route */}
          {shipment.route && (
            <div>
              <h2>Route</h2>
              <div className="route-list">
                {shipment.route.map((stop, index) => (
                  <div
                    key={index}
                    className={`route-stop ${
                      index <= (shipment.routeIndex || 0) ? 'completed' : ''
                    } ${index === shipment.routeIndex ? 'current' : ''}`}
                  >
                    <div className="stop-dot" />
                    <p>{stop}</p>
                    {index === shipment.routeIndex && <span className="current-badge">Current</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Map - Uses coordinates from Admin Panel */}
        <div className="map-section mt-12">
          <h2>Live Location</h2>
          <p className="text-gray-600 mb-4">📍 {shipment.currentLocation}</p>
          <Map 
            lat={shipment.currentLat || 40.7128} 
            lng={shipment.currentLng || -74.0060}
            locationName={shipment.currentLocation}
          />
        </div>

        {/* Timeline */}
        <div className="timeline mt-12">
          <h2>Shipment History</h2>
          {shipment.history?.map((event, index) => (
            <div key={index} className="timeline-event">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3 className="capitalize">{event.status.replace('-', ' ')}</h3>
                  <span>{new Date(event.date).toLocaleString()}</span>
                </div>
                <p className="location">
                  <FaMapMarkerAlt /> {event.location}
                </p>
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            Print Tracking Details
          </button>
        </div>
      </div>
    </div>
  )
}