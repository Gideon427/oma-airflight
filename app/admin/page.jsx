'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'admin123'
const WORKER_EMAIL = 'worker@example.com'
const WORKER_PASSWORD = 'worker123'

function loadShipments() {
  if (typeof window === 'undefined') return []
  const stored = window.localStorage.getItem('shipments')
  return stored ? JSON.parse(stored) : []
}

function saveShipments(shipments) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('shipments', JSON.stringify(shipments))
}

const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 10; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isWorker, setIsWorker] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [error, setError] = useState('')
  const [shipments, setShipments] = useState([])
  const [selectedTracking, setSelectedTracking] = useState('')
  const [status, setStatus] = useState('processing')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [eventTime, setEventTime] = useState(new Date().toISOString().slice(0, 16))
  const [trackingCode, setTrackingCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    sender: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    receiver: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    package: {
      description: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      value: '',
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.startsWith('dimensions.') || name === 'package.weight' || name === 'package.value'
        ? value === '' ? '' : parseFloat(value) || ''
        : value;

    setFormData((prev) => {
      if (name.startsWith('sender.') || name.startsWith('receiver.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: parsedValue,
          },
        };
      } else if (name.startsWith('package.')) {
        const [, child] = name.split('.');
        return {
          ...prev,
          package: {
            ...prev.package,
            [child]: parsedValue,
          },
        };
      } else if (name.startsWith('dimensions.')) {
        const dim = name.split('.')[1];
        return {
          ...prev,
          package: {
            ...prev.package,
            dimensions: {
              ...prev.package.dimensions,
              [dim]: parsedValue,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleSendPackage = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTrackingNumber = generateTrackingNumber();
      setTrackingCode(newTrackingNumber);

      const shipment = {
        trackingNumber: newTrackingNumber,
        sender: formData.sender,
        receiver: formData.receiver,
        package: formData.package,
        status: 'pending',
        currentLocation: formData.sender.address || 'Origin',
        history: [
          {
            status: 'pending',
            location: formData.sender.address || 'Origin',
            description: 'Package received and ready for shipment',
            date: new Date().toISOString(),
          },
        ],
      };

      const updatedShipments = [...shipments, shipment];
      saveShipments(updatedShipments);
      setShipments(updatedShipments);

      // Reset form
      setFormData({
        sender: { name: '', address: '', email: '', phone: '' },
        receiver: { name: '', address: '', email: '', phone: '' },
        package: { description: '', weight: '', dimensions: { length: '', width: '', height: '' }, value: '' },
      });

      setTimeout(() => {
        setTrackingCode('');
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create shipment');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = window.localStorage.getItem('role') || ''
      setIsAdmin(storedRole === 'admin')
      setIsWorker(storedRole === 'worker')
      setUserRole(storedRole)
      setShipments(loadShipments())
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('role', 'admin')
      }
      setIsAdmin(true)
      setIsWorker(false)
      setUserRole('admin')
      setAdminEmail('')
      setAdminPassword('')
      setError('')
      setShipments(loadShipments())
      return
    }

    if (adminEmail === WORKER_EMAIL && adminPassword === WORKER_PASSWORD) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('role', 'worker')
      }
      setIsAdmin(false)
      setIsWorker(true)
      setUserRole('worker')
      setAdminEmail('')
      setAdminPassword('')
      setError('')
      setShipments(loadShipments())
      return
    }

    setError('Invalid credentials. Use admin@example.com/admin123 or worker@example.com/worker123')
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('role')
    }
    setIsAdmin(false)
    setIsWorker(false)
    setUserRole('')
    setError('')
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setError('')

    if (!selectedTracking) {
      setError('Select a shipment to update.')
      return
    }

    const updatedShipments = shipments.map((shipment) => {
      if (shipment.trackingNumber !== selectedTracking) return shipment

      const newLocation = location || shipment.currentLocation || shipment.receiver.address || 'Updated location'
      const newDescription = description || 'Status update from admin'
      const lastEvent = shipment.history[shipment.history.length - 1]

      // Check if this is just a location update without status change
      const isLocationOnlyUpdate = status === shipment.status && 
        (location !== '' || description === '') && 
        lastEvent && lastEvent.status === status

      let updatedHistory = shipment.history

      if (!isLocationOnlyUpdate) {
        // Add new history event for status change
        const event = {
          status,
          location: newLocation,
          description: newDescription,
          date: new Date(eventTime).toISOString(),
        }
        updatedHistory = [...shipment.history, event]
      } else {
        // Update the last event's location and description if it's the same status
        updatedHistory = shipment.history.map((event, index) => 
          index === shipment.history.length - 1 
            ? { ...event, location: newLocation, description: newDescription, date: new Date(eventTime).toISOString() }
            : event
        )
      }

      return {
        ...shipment,
        status,
        currentLocation: newLocation,
        history: updatedHistory,
      }
    })

    saveShipments(updatedShipments)
    setShipments(updatedShipments)
    setLocation('')
    setDescription('')
    setError('Shipment update saved successfully.')
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card form-container">
          <div className="card-header">
            <h1>Admin Panel</h1>
            <p className="text-sm text-gray-600">
              Only admins and workers can send packages and update tracking history.
            </p>
            {userRole && (
              <p className="text-sm text-gray-400 mt-2">Logged in as: <strong>{userRole}</strong></p>
            )}
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}

            {!(isAdmin || isWorker) ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="adminEmail">User Email</label>
                  <input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="form-input"
                    placeholder="admin@example.com or worker@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="adminPassword">Password</label>
                  <input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="form-input"
                    placeholder="admin123 or worker123"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="form-actions mb-6">
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout Admin
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Existing Shipments</h2>
                  {shipments.length === 0 ? (
                    <p className="text-gray-600">No shipments yet. Use the Send page to create one.</p>
                  ) : (
                    <div className="shipment-list">
                      <table className="table-auto w-full">
                        <thead>
                          <tr>
                            <th>Tracking #</th>
                            <th>Receiver</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipments.map((shipment) => (
                            <tr key={shipment.trackingNumber}>
                              <td>{shipment.trackingNumber}</td>
                              <td>{shipment.receiver.name}</td>
                              <td>{shipment.status}</td>
                              <td>{new Date(shipment.history.at(-1)?.date).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Add Tracking Update</h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="trackingSelect">Shipment</label>
                      <select
                        id="trackingSelect"
                        value={selectedTracking}
                        onChange={(e) => setSelectedTracking(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Choose shipment</option>
                        {shipments.map((shipment) => (
                          <option key={shipment.trackingNumber} value={shipment.trackingNumber}>
                            {shipment.trackingNumber} — {shipment.receiver.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="status">Status</label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-input"
                      >
                        <option value="processing">Processing</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="location">Location</label>
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="form-input"
                        placeholder="Current location"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="description">Description</label>
                      <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-input"
                        placeholder="Update description"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="eventTime">Date & Time</label>
                      <input
                        id="eventTime"
                        type="datetime-local"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary btn-block">
                        Save Tracking Update
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-xl font-semibold mb-3">Send a New Package</h2>
                  {trackingCode && (
                    <div className="alert alert-success mb-4">
                      Tracking code generated: <strong>{trackingCode}</strong>
                      <span className="tracking-note"> Package created successfully!</span>
                    </div>
                  )}
                  <form onSubmit={handleSendPackage}>
                    <div className="form-section">
                      <h3 className="text-lg font-semibold mb-3">Sender Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label" htmlFor="sender-name">Full Name</label>
                          <input
                            type="text"
                            id="sender-name"
                            name="sender.name"
                            value={formData.sender.name}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="sender-address">Address</label>
                          <input
                            type="text"
                            id="sender-address"
                            name="sender.address"
                            value={formData.sender.address}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="sender-email">Email</label>
                          <input
                            type="email"
                            id="sender-email"
                            name="sender.email"
                            value={formData.sender.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="sender-phone">Phone</label>
                          <input
                            type="tel"
                            id="sender-phone"
                            name="sender.phone"
                            value={formData.sender.phone}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="text-lg font-semibold mb-3">Receiver Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label" htmlFor="receiver-name">Full Name</label>
                          <input
                            type="text"
                            id="receiver-name"
                            name="receiver.name"
                            value={formData.receiver.name}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="receiver-address">Address</label>
                          <input
                            type="text"
                            id="receiver-address"
                            name="receiver.address"
                            value={formData.receiver.address}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="receiver-email">Email</label>
                          <input
                            type="email"
                            id="receiver-email"
                            name="receiver.email"
                            value={formData.receiver.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="receiver-phone">Phone</label>
                          <input
                            type="tel"
                            id="receiver-phone"
                            name="receiver.phone"
                            value={formData.receiver.phone}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="text-lg font-semibold mb-3">Package Details</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label" htmlFor="package-description">Description</label>
                          <input
                            type="text"
                            id="package-description"
                            name="package.description"
                            value={formData.package.description}
                            onChange={handleChange}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="package-weight">Weight (kg)</label>
                          <input
                            type="number"
                            id="package-weight"
                            name="package.weight"
                            value={formData.package.weight}
                            onChange={handleChange}
                            className="form-input"
                            min="0"
                            step="0.1"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="dimensions-length">Dimensions (cm)</label>
                          <div className="dimensions-grid">
                            <input
                              type="number"
                              id="dimensions-length"
                              placeholder="Length"
                              name="dimensions.length"
                              value={formData.package.dimensions.length}
                              onChange={handleChange}
                              className="form-input"
                              min="0"
                              step="0.1"
                              required
                            />
                            <input
                              type="number"
                              id="dimensions-width"
                              placeholder="Width"
                              name="dimensions.width"
                              value={formData.package.dimensions.width}
                              onChange={handleChange}
                              className="form-input"
                              min="0"
                              step="0.1"
                              required
                            />
                            <input
                              type="number"
                              id="dimensions-height"
                              placeholder="Height"
                              name="dimensions.height"
                              value={formData.package.dimensions.height}
                              onChange={handleChange}
                              className="form-input"
                              min="0"
                              step="0.1"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="package-value">Declared Value ($)</label>
                          <input
                            type="number"
                            id="package-value"
                            name="package.value"
                            value={formData.package.value}
                            onChange={handleChange}
                            className="form-input"
                            min="0"
                            step="0.1"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Create & Ship Package'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
