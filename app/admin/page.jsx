'use client'
import { useEffect, useState } from 'react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'Omar123@'
const WORKER_EMAIL = 'worker@gmail.com'
const WORKER_PASSWORD = 'Children123@'

const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 🔥 GLOBAL CITY COORDINATES DATABASE
const getCoordinatesFromLocation = (location) => {
  if (!location) return { lat: 40.7128, lng: -74.0060 }

  const loc = location.toString().toLowerCase().trim()

  const cityMap = {
        // ==================== TURKEY ====================
    'istanbul': [41.0138, 28.9497],
    'ankara': [39.9334, 32.8597],
    'izmir': [38.4237, 27.1428],
    'bursa': [40.1885, 29.0601],
    'antalya': [36.8969, 30.7133],
    'konya': [37.8719, 32.4846],
    'adana': [36.9914, 35.3300],
    'gaziantep': [37.0658, 37.3772],
    'diyarbakir': [37.9140, 40.2369],
    'mersin': [36.8121, 34.6410],
    'eskisehir': [39.7767, 30.5210],
    'samsun': [41.2925, 36.3310],
    'denizli': [37.7765, 29.0864],
    'kahramanmaras': [37.5858, 36.9269],
    'malatya': [38.3555, 38.3095],
    'erzurum': [39.9055, 41.2767],
    'van': [38.4891, 43.4089],
    'trabzon': [41.0027, 39.7168],
    'balikesir': [39.6484, 27.8823],
    'aydın': [37.8560, 27.8411],
    'tekirdag': [40.9833, 27.5167],
    'sakarya': [40.6930, 30.4358],
    'manisa': [38.6191, 27.4289],
    'hatay': [36.4018, 36.1678],           // Antakya
    'kayseri': [38.7223, 35.4875],
    'ordu': [40.9833, 37.8767],
    'elazig': [38.6810, 39.2264],
    'afyon': [38.7565, 30.5387],           // Afyonkarahisar
    'kutahya': [39.4167, 29.9833],
    'isparta': [37.7648, 30.5522],
    'canakkale': [40.1553, 26.4142],
    // USA
    'new york': [40.7128, -74.0060],
    'manhattan': [40.7128, -74.0060],
    'brooklyn': [40.6782, -73.9442],
    'bronx': [40.8448, -73.8648],
    'jfk': [40.6413, -73.7781],
    'los angeles': [34.0522, -118.2437],
    'chicago': [41.8781, -87.6298],
    'miami': [25.7617, -80.1918],

    // Europe
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'berlin': [52.5200, 13.4050],
    'rome': [41.9028, 12.4964],

    // Asia & Others
    'dubai': [25.2048, 55.2708],
    'lagos': [6.5244, 3.3792],
    'tokyo': [35.6762, 139.6503],
    'singapore': [1.3521, 103.8198],
    'sydney': [-33.8688, 151.2093],
  }

  for (const [city, coords] of Object.entries(cityMap)) {
    if (loc.includes(city)) {
      return { lat: coords[0], lng: coords[1] }
    }
  }

  return { lat: 40.7128, lng: -74.0060 } // Default New York
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
  const [loading, setLoading] = useState(false)
  const [updateDeclaredValue, setUpdateDeclaredValue] = useState('')

  const [formData, setFormData] = useState({
    sender: { name: '', address: '', email: '', phone: '' },
    receiver: { name: '', address: '', email: '', phone: '' },
    package: {
      description: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      value: '',
    },
  })

  // Fetch Shipments
  const fetchShipments = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setShipments(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load shipments')
    } finally {
      setLoading(false)
    }
  }

  const saveShipment = async (shipment) => {
    await addDoc(collection(db, 'shipments'), shipment)
  }

  const updateShipment = async (trackingNumber, updateData) => {
    const q = query(collection(db, 'shipments'), where('trackingNumber', '==', trackingNumber))
    const snapshot = await getDocs(q)

    if (snapshot.empty) throw new Error('Shipment not found')

    const docRef = snapshot.docs[0].ref
    await updateDoc(docRef, updateData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const parsedValue = name.startsWith('dimensions.') || 
                       name === 'package.weight' || 
                       name === 'package.value'
      ? (value === '' ? '' : parseFloat(value) || '')
      : value

    setFormData((prev) => {
      if (name.startsWith('sender.') || name.startsWith('receiver.')) {
        const [parent, child] = name.split('.')
        return { ...prev, [parent]: { ...prev[parent], [child]: parsedValue } }
      } else if (name.startsWith('package.')) {
        const [, child] = name.split('.')
        return { ...prev, package: { ...prev.package, [child]: parsedValue } }
      } else if (name.startsWith('dimensions.')) {
        const dim = name.split('.')[1]
        return {
          ...prev,
          package: {
            ...prev.package,
            dimensions: { ...prev.package.dimensions, [dim]: parsedValue }
          }
        }
      }
      return prev
    })
  }

  // CREATE SHIPMENT
  const handleSendPackage = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const newTrackingNumber = generateTrackingNumber()
      setTrackingCode(newTrackingNumber)

      const origin = formData.sender.address || 'New York, NY'
      const coords = getCoordinatesFromLocation(origin)

      const shipment = {
        trackingNumber: newTrackingNumber,
        sender: formData.sender,
        receiver: formData.receiver,
        package: formData.package,
        status: 'pending',

        route: [
          origin,
          'JFK International Airport',
          'New York City Hub (Manhattan)',
          formData.receiver.address || 'Receiver Location'
        ],
        routeIndex: 0,

        currentLocation: origin,
        currentLat: coords.lat,
        currentLng: coords.lng,

        history: [
          {
            status: 'pending',
            location: origin,
            description: 'Package received at origin facility',
            date: new Date().toISOString(),
          }
        ],

        createdAt: serverTimestamp()
      }

      await saveShipment(shipment)
      await fetchShipments()

      setFormData({
        sender: { name: '', address: '', email: '', phone: '' },
        receiver: { name: '', address: '', email: '', phone: '' },
        package: { description: '', weight: '', dimensions: { length: '', width: '', height: '' }, value: '' }
      })
    } catch (err) {
      console.error(err)
      setError('Failed to create shipment')
    } finally {
      setTimeout(() => {
        setTrackingCode('')
        setIsSubmitting(false)
      }, 2000)
    }
  }

  // UPDATE SHIPMENT WITH COORDINATES
// UPDATE SHIPMENT WITH SMART HISTORY LOGIC
const handleUpdate = async (e) => {
  e.preventDefault()
  setError('')

  if (!selectedTracking) {
    setError('Please select a shipment to update')
    return
  }

  try {
    const shipment = shipments.find(s => s.trackingNumber === selectedTracking)
    if (!shipment) return

    const newRouteIndex = getRouteIndexForStatus(status, shipment.route)
    const newLocation = location || shipment.route?.[newRouteIndex] || shipment.currentLocation
    const coords = getCoordinatesFromLocation(newLocation)
    const newDescription = description || `Package ${status.replace('-', ' ')} at ${newLocation}`

    const newEvent = {
      status,
      location: newLocation,
      description: newDescription,
      date: new Date(eventTime).toISOString()
    }

    let updatedHistory = [...shipment.history]
    const lastEvent = updatedHistory[updatedHistory.length - 1]

    if (lastEvent && lastEvent.status === status) {
      updatedHistory[updatedHistory.length - 1] = newEvent
    } else {
      updatedHistory.push(newEvent)
    }

    const updateData = {
      status,
      currentLocation: newLocation,
      currentLat: coords.lat,
      currentLng: coords.lng,
      routeIndex: newRouteIndex,
      history: updatedHistory,
      lastUpdated: serverTimestamp()
    }

    // ✅ Update declared value if provided
    if (updateDeclaredValue !== '') {
      updateData['package.value'] = parseFloat(updateDeclaredValue) || 0
    }

    await updateShipment(selectedTracking, updateData)
    await fetchShipments()

    // Reset form fields
    setLocation('')
    setDescription('')
    setSelectedTracking('')
    setStatus('processing')
    setUpdateDeclaredValue('')   // ← reset the new field
    setError('✅ Shipment updated successfully!')

  } catch (err) {
    console.error(err)
    setError('Failed to update shipment')
  }
}

// Status to RouteIndex mapping
const getRouteIndexForStatus = (statusValue, route) => {
  const routeLength = route?.length || 1
  const statusMap = {
    'pending': 0,
    'processing': 0,
    'in-transit': Math.max(0, Math.min(1, routeLength - 2)),
    'out-for-delivery': Math.max(0, routeLength - 2),
    'delivered': Math.max(0, routeLength - 1),
  }
  return statusMap[statusValue] || 0
}

const handleLogin = (e) => {
  e.preventDefault()
  setError('')

  if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
    setIsAdmin(true)
    setUserRole('admin')
  } else if (adminEmail === WORKER_EMAIL && adminPassword === WORKER_PASSWORD) {
    setIsWorker(true)
    setUserRole('worker')
  } else {
    setError('Invalid credentials')
    return
  }

  setAdminEmail('')
  setAdminPassword('')
}

const handleLogout = () => {
  setIsAdmin(false)
  setIsWorker(false)
  setUserRole('')
  setShipments([])
  setError('')
}

useEffect(() => {
  if (isAdmin || isWorker) fetchShipments()
}, [isAdmin, isWorker])

return (
  <section className="section">
    <div className="container">
      <div className="card form-container">
        <div className="card-header">
          <h1>Admin Panel</h1>
          <p className="text-sm text-gray-600">Manage shipments and tracking updates</p>
          {userRole && <p className="text-sm text-gray-400 mt-2">Logged in as: <strong>{userRole}</strong></p>}
        </div>

        <div className="card-body">
          <div className="card-body">
            {error && <div className="alert alert-error">{error}</div>}

            {!(isAdmin || isWorker) ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="form-input"
                    placeholder="admin@example.com or worker@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="form-input"
                    placeholder="admin123 or worker123"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Sign In</button>
              </form>
            ) : (
              <>
                <div className="mb-4">
                  <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                </div>

                {/* Existing Shipments */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Existing Shipments {loading && '(Loading...)'}</h2>
                  {shipments.length === 0 ? (
                    <p>No shipments yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead>
                          <tr>
                            <th>Tracking #</th>
                            <th>Receiver</th>
                            <th>Status</th>
                            <th>Current Location</th>
                            <th>Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipments.map((shipment) => (
                            <tr key={shipment.trackingNumber}>
                              <td>{shipment.trackingNumber}</td>
                              <td>{shipment.receiver.name}</td>
                              <td>{shipment.status}</td>
                              <td>{shipment.currentLocation}</td>
                              <td>
  {shipment.history && shipment.history.length > 0
    ? new Date(shipment.history[shipment.history.length - 1].date).toLocaleString()
    : '—'}
</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Update Tracking */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4">Add Tracking Update</h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Shipment</label>
                      <select value={selectedTracking} onChange={(e) => setSelectedTracking(e.target.value)} className="form-input" required>
                        <option value="">Select shipment</option>
                        {shipments.map((s) => (
                          <option key={s.trackingNumber} value={s.trackingNumber}>
                            {s.trackingNumber} — {s.receiver.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="in-transit">In Transit</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="form-input" placeholder="Current location" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" placeholder="Update description" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date & Time</label>
                      <input type="datetime-local" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="form-input" />
                    </div>
                    <div className="form-group">
  <label className="form-label">Declared Value ($)</label>
  <input
    type="number"
    value={updateDeclaredValue}
    onChange={(e) => setUpdateDeclaredValue(e.target.value)}
    className="form-input"
    placeholder="Update declared value"
    step="0.1"
  />
</div>

                    <button type="submit" className="btn btn-primary btn-block">Save Tracking Update</button>
                  </form>
                </div>
                

                {/* Send New Package */}
                <div className="pt-8 border-t border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Send New Package</h2>

                  {trackingCode && (
                    <div className="alert alert-success mb-4">
                      Tracking Number: <strong>{trackingCode}</strong>
                    </div>
                  )}

                  <form onSubmit={handleSendPackage}>
                    {/* Sender, Receiver, and Package forms remain exactly as you had them */}
                    {/* Sender Information */}
                    <div className="form-section">
                      <h3 className="text-lg font-semibold mb-3">Sender Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" name="sender.name" value={formData.sender.name} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <input type="text" name="sender.address" value={formData.sender.address} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" name="sender.email" value={formData.sender.email} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input type="tel" name="sender.phone" value={formData.sender.phone} onChange={handleChange} className="form-input" required />
                        </div>
                      </div>
                    </div>

                    {/* Receiver Information */}
                    <div className="form-section">
                      <h3 className="text-lg font-semibold mb-3">Receiver Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" name="receiver.name" value={formData.receiver.name} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Address</label>
                          <input type="text" name="receiver.address" value={formData.receiver.address} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" name="receiver.email" value={formData.receiver.email} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input type="tel" name="receiver.phone" value={formData.receiver.phone} onChange={handleChange} className="form-input" required />
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="form-section">
                      <h3 className="text-lg font-semibold mb-3">Package Details</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Description</label>
                          <input type="text" name="package.description" value={formData.package.description} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                          <label>Weight (kg)</label>
                          <input type="number" name="package.weight" value={formData.package.weight} onChange={handleChange} className="form-input" step="0.1" required />
                        </div>
                        <div className="form-group">
                          <label>Dimensions (cm)</label>
                          <div className="dimensions-grid">
                            <input type="number" name="dimensions.length" placeholder="Length" value={formData.package.dimensions.length} onChange={handleChange} className="form-input" step="0.1" required />
                            <input type="number" name="dimensions.width" placeholder="Width" value={formData.package.dimensions.width} onChange={handleChange} className="form-input" step="0.1" required />
                            <input type="number" name="dimensions.height" placeholder="Height" value={formData.package.dimensions.height} onChange={handleChange} className="form-input" step="0.1" required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Declared Value ($)</label>
                          <input type="number" name="package.value" value={formData.package.value} onChange={handleChange} className="form-input" step="0.1" required />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block mt-6" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create & Ship Package'}
                    </button>
                  </form>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}