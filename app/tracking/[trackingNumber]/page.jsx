'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa'

export default function TrackingResult() {
  const { trackingNumber } = useParams()
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('shipments') : null;
    const shipments = stored ? JSON.parse(stored) : [];
    const found = shipments.find((item) => item.trackingNumber === trackingNumber);

    if (!found) {
      setError('Tracking number not found.');
      setLoading(false);
      return;
    }

    setShipment(found);
    setLoading(false);
  }, [trackingNumber])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaBox className="icon pending" />
      case 'processing': return <FaBox className="icon processing" />
      case 'in-transit': return <FaTruck className="icon in-transit" />
      case 'delivered': return <FaCheckCircle className="icon delivered" />
      default: return <FaBox className="icon" />
    }
  }

  if (loading) return <div className="loading">Loading tracking information...</div>
  if (error) return <div className="error">{error}</div>
  if (!shipment) return <div className="not-found">Shipment not found</div>

  return (
    <div className="tracking-page">
      <div className="container">
        <div className="tracking-header">
          <h1>Tracking #: {trackingNumber}</h1>
          <div className="status-badge">
            {getStatusIcon(shipment.status)}
            <span>{shipment.status}</span>
          </div>
          <div className="current-location">
            <FaMapMarkerAlt className="icon" />
            <span>Current Location: {shipment.currentLocation || 'Unknown'}</span>
          </div>
        </div>
        
        <div className="tracking-details">
          <div className="shipment-info">
            <h2>Shipment Details</h2>
            <div className="info-grid">
              <div>
                <h3>Sender</h3>
                <p>{shipment.sender.name}</p>
                <p>{shipment.sender.address}</p>
              </div>
              <div>
                <h3>Receiver</h3>
                <p>{shipment.receiver.name}</p>
                <p>{shipment.receiver.address}</p>
              </div>
              <div>
                <h3>Package</h3>
                <p>{shipment.package.description}</p>
                <p>Weight: {shipment.package.weight} kg</p>
              </div>
            </div>
          </div>
          
          <div className="timeline">
            <h2>Shipment Progress</h2>
            {(() => {
              // Group events by status and keep only the latest for each status
              const statusGroups = {}
              shipment.history.forEach((event) => {
                if (!statusGroups[event.status] || new Date(event.date) > new Date(statusGroups[event.status].date)) {
                  statusGroups[event.status] = event
                }
              })
              
              return Object.values(statusGroups).map((event, index) => (
                <div key={index} className="timeline-event">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>{event.status}</h3>
                      <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                    <p><FaMapMarkerAlt /> {event.location}</p>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
        
        <div className="actions">
          <button className="btn btn-primary" onClick={() => window.print()}>
            Print Shipping Label
          </button>
        </div>
      </div>
    </div>
  )
}