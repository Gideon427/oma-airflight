'use client'

import { useEffect, useMemo, useState } from 'react'
import './admin.css'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'Omar123@'

const WORKER_EMAIL = 'worker@gmail.com'
const WORKER_PASSWORD = 'Children123@'

// ======================================================
// TRACKING NUMBER
// ======================================================

const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return code
}

// ======================================================
// CITY COORDINATES
// ======================================================

const getCoordinatesFromLocation = (location) => {
  if (!location) {
    return {
      lat: 40.7128,
      lng: -74.0060,
    }
  }

  const loc = location.toString().toLowerCase().trim()

  const cityMap = {
    // Turkey
    istanbul: [41.0138, 28.9497],
    ankara: [39.9334, 32.8597],
    izmir: [38.4237, 27.1428],
    bursa: [40.1885, 29.0601],
    antalya: [36.8969, 30.7133],
    konya: [37.8719, 32.4846],
    adana: [36.9914, 35.3300],
    gaziantep: [37.0658, 37.3772],
    diyarbakir: [37.9140, 40.2369],
    mersin: [36.8121, 34.6410],
    eskisehir: [39.7767, 30.5210],
    samsun: [41.2925, 36.3310],
    denizli: [37.7765, 29.0864],
    kahramanmaras: [37.5858, 36.9269],
    malatya: [38.3555, 38.3095],
    erzurum: [39.9055, 41.2767],
    van: [38.4891, 43.4089],
    trabzon: [41.0027, 39.7168],
    balikesir: [39.6484, 27.8823],
    aydin: [37.8560, 27.8411],
    tekirdag: [40.9833, 27.5167],
    sakarya: [40.6930, 30.4358],
    manisa: [38.6191, 27.4289],
    hatay: [36.4018, 36.1678],
    kayseri: [38.7223, 35.4875],
    ordu: [40.9833, 37.8767],
    elazig: [38.6810, 39.2264],
    afyon: [38.7565, 30.5387],
    kutahya: [39.4167, 29.9833],
    isparta: [37.7648, 30.5522],
    canakkale: [40.1553, 26.4142],

    // USA
    'new york': [40.7128, -74.0060],
    manhattan: [40.7128, -74.0060],
    brooklyn: [40.6782, -73.9442],
    bronx: [40.8448, -73.8648],
    jfk: [40.6413, -73.7781],
    'los angeles': [34.0522, -118.2437],
    chicago: [41.8781, -87.6298],
    miami: [25.7617, -80.1918],

    // Europe
    london: [51.5074, -0.1278],
    paris: [48.8566, 2.3522],
    berlin: [52.5200, 13.4050],
    rome: [41.9028, 12.4964],

    // Asia / Others
    dubai: [25.2048, 55.2708],
    lagos: [6.5244, 3.3792],
    tokyo: [35.6762, 139.6503],
    singapore: [1.3521, 103.8198],
    sydney: [-33.8688, 151.2093],
  }

  for (const [city, coords] of Object.entries(cityMap)) {
    if (loc.includes(city)) {
      return {
        lat: coords[0],
        lng: coords[1],
      }
    }
  }

  return {
    lat: 40.7128,
    lng: -74.0060,
  }
}

// ======================================================
// HELPERS
// ======================================================

const getRouteIndexForStatus = (status, route) => {
  const routeLength = route?.length || 1

  const statusMap = {
    pending: 0,
    processing: 0,
    'in-transit': Math.max(0, Math.min(1, routeLength - 2)),
    'out-for-delivery': Math.max(0, routeLength - 2),
    delivered: Math.max(0, routeLength - 1),
  }

  return statusMap[status] ?? 0
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    processing: 'Processing',
    'in-transit': 'In Transit',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
  }

  return labels[status] || status || 'Unknown'
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-slate-50 text-slate-700 border-slate-200',
    'in-transit': 'bg-blue-50 text-blue-700 border-blue-200',
    'out-for-delivery': 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
  }

  return classes[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const formatDate = (value) => {
  if (!value) return '—'

  try {
    if (value?.toDate) {
      return value.toDate().toLocaleString()
    }

    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

const getRelativeTime = (value) => {
  if (!value) return '—'

  try {
    const date = value?.toDate ? value.toDate() : new Date(value)
    const diff = Date.now() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString()
  } catch {
    return '—'
  }
}

const createEmptyForm = () => ({
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
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    value: '',
  },
})

// ======================================================
// INPUT COMPONENT
// ======================================================

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  step,
}) {
  return (
    <div className="admin-form-group">
      <label className="admin-label">
        {label}
        {required && (
          <span className="admin-required">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className="admin-input"
      />
    </div>
  )
}

// ======================================================
// MAIN ADMIN PAGE
// ======================================================

export default function AdminPage() {
  // Authentication
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isWorker, setIsWorker] = useState(false)
  const [userRole, setUserRole] = useState('')

  // UI
  const [activeTab, setActiveTab] = useState('create')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Shipments
  const [shipments, setShipments] = useState([])
  const [selectedTracking, setSelectedTracking] = useState(null)

  // Search / filter
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // New package
  const [formData, setFormData] = useState(createEmptyForm())
  const [trackingCode, setTrackingCode] = useState('')

  // Update
  const [status, setStatus] = useState('processing')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [eventTime, setEventTime] = useState(
    new Date().toISOString().slice(0, 16)
  )
  const [updateDeclaredValue, setUpdateDeclaredValue] = useState('')
  const [showEventSection, setShowEventSection] = useState(true)

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // EDIT DATA (full editable copy)
  const [editData, setEditData] = useState(null)

  // ======================================================
  // FETCH
  // ======================================================

  const fetchShipments = async () => {
    setLoading(true)

    try {
      const q = query(
        collection(db, 'shipments'),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setShipments(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load shipments.')
    } finally {
      setLoading(false)
    }
  }

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (
      adminEmail === ADMIN_EMAIL &&
      adminPassword === ADMIN_PASSWORD
    ) {
      setIsAdmin(true)
      setUserRole('admin')
      setActiveTab('create')
    } else if (
      adminEmail === WORKER_EMAIL &&
      adminPassword === WORKER_PASSWORD
    ) {
      setIsWorker(true)
      setUserRole('worker')
      setActiveTab('create')
    } else {
      setError('Invalid email or password.')
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
    setSelectedTracking(null)
    setEditData(null)
    setError('')
    setToast('')
  }

  // ======================================================
  // FETCH AFTER LOGIN
  // ======================================================

  useEffect(() => {
    if (isAdmin || isWorker) {
      fetchShipments()
    }
  }, [isAdmin, isWorker])

  // ======================================================
  // FORM CHANGE (for create)
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    let parsedValue = value

    if (
      name.startsWith('dimensions.') ||
      name === 'package.weight' ||
      name === 'package.value'
    ) {
      parsedValue =
        value === '' ? '' : parseFloat(value) || ''
    }

    setFormData((prev) => {
      if (
        name.startsWith('sender.') ||
        name.startsWith('receiver.')
      ) {
        const [parent, child] = name.split('.')

        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: parsedValue,
          },
        }
      }

      if (name.startsWith('package.')) {
        const [, child] = name.split('.')

        return {
          ...prev,
          package: {
            ...prev.package,
            [child]: parsedValue,
          },
        }
      }

      if (name.startsWith('dimensions.')) {
        const [, dimension] = name.split('.')

        return {
          ...prev,
          package: {
            ...prev.package,
            dimensions: {
              ...prev.package.dimensions,
              [dimension]: parsedValue,
            },
          },
        }
      }

      return prev
    })
  }

  // ======================================================
  // EDIT CHANGE (for editData)
  // ======================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target

    let parsedValue = value

    if (
      name.startsWith('dimensions.') ||
      name === 'package.weight' ||
      name === 'package.value'
    ) {
      parsedValue =
        value === '' ? '' : parseFloat(value) || ''
    }

    setEditData((prev) => {
      if (!prev) return prev

      if (
        name.startsWith('sender.') ||
        name.startsWith('receiver.')
      ) {
        const [parent, child] = name.split('.')

        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: parsedValue,
          },
        }
      }

      if (name.startsWith('package.')) {
        const [, child] = name.split('.')

        return {
          ...prev,
          package: {
            ...prev.package,
            [child]: parsedValue,
          },
        }
      }

      if (name.startsWith('dimensions.')) {
        const [, dimension] = name.split('.')

        return {
          ...prev,
          package: {
            ...prev.package,
            dimensions: {
              ...prev.package.dimensions,
              [dimension]: parsedValue,
            },
          },
        }
      }

      // fallback for top-level fields (if any)
      return {
        ...prev,
        [name]: parsedValue,
      }
    })
  }

  // ======================================================
  // CREATE SHIPMENT
  // ======================================================

  const handleSendPackage = async (e) => {
    e.preventDefault()

    setIsSubmitting(true)
    setError('')
    setToast('')
    setTrackingCode('')

    try {
      const newTrackingNumber = generateTrackingNumber()

      const origin =
        formData.sender.address || 'New York, NY'

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
          formData.receiver.address || 'Receiver Location',
        ],

        routeIndex: 0,

        currentLocation: origin,
        currentLat: coords.lat,
        currentLng: coords.lng,

        history: [
          {
            status: 'pending',
            location: origin,
            description:
              'Package received at origin facility',
            date: new Date().toISOString(),
          },
        ],

        createdAt: serverTimestamp(),
      }

      await addDoc(
        collection(db, 'shipments'),
        shipment
      )

      await fetchShipments()

      setTrackingCode(newTrackingNumber)

      setToast(
        `Shipment created successfully — ${newTrackingNumber}`
      )

      setFormData(createEmptyForm())

      setTimeout(() => {
        setToast('')
      }, 5000)
    } catch (err) {
      console.error(err)
      setError('Failed to create shipment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ======================================================
  // SELECT SHIPMENT
  // ======================================================

  const handleSelectShipment = (shipment) => {
    setSelectedTracking(shipment.trackingNumber)

    // Deep clone the shipment into editData
    const cloned = {
      ...shipment,
      sender: { ...shipment.sender },
      receiver: { ...shipment.receiver },
      package: {
        ...shipment.package,
        dimensions: { ...shipment.package?.dimensions },
      },
    }
    setEditData(cloned)

    // Pre-fill the status/location fields for the quick update
    setStatus(shipment.status || 'processing')
    setLocation(shipment.currentLocation || '')
    setDescription('')
    setUpdateDeclaredValue('')
    setEventTime(
      new Date().toISOString().slice(0, 16)
    )

    setError('')
    setToast('')
  }

  // ======================================================
  // UPDATE SHIPMENT
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!selectedTracking || !editData) {
      setError('Please select a shipment first.')
      return
    }

    setError('')
    setToast('')

    try {
      const shipment = shipments.find(
        (item) =>
          item.trackingNumber === selectedTracking
      )

      if (!shipment) {
        throw new Error('Shipment not found')
      }

      // Compute new route index and location based on status
      const newRouteIndex =
        getRouteIndexForStatus(
          status,
          shipment.route
        )

      const newLocation =
        location ||
        shipment.route?.[newRouteIndex] ||
        shipment.currentLocation

      const coords =
        getCoordinatesFromLocation(newLocation)

      const newDescription =
        description ||
        `Package ${status.replace(
          '-',
          ' '
        )} at ${newLocation}`

      const newEvent = {
        status,
        location: newLocation,
        description: newDescription,
        date: new Date(eventTime).toISOString(),
      }

      const updatedHistory = [
        ...(shipment.history || []),
      ]

      const lastEvent =
        updatedHistory[updatedHistory.length - 1]

      if (
        lastEvent &&
        lastEvent.status === status
      ) {
        updatedHistory[
          updatedHistory.length - 1
        ] = newEvent
      } else {
        updatedHistory.push(newEvent)
      }

      // Start with the full editData (all editable fields)
      let updatedShipment = { ...editData }

      // Override status, location, history, and tracking-related fields
      updatedShipment = {
        ...updatedShipment,
        status,
        currentLocation: newLocation,
        currentLat: coords.lat,
        currentLng: coords.lng,
        routeIndex: newRouteIndex,
        history: updatedHistory,
        lastUpdated: serverTimestamp(),
      }

      // Override package.value if updateDeclaredValue is provided
      if (updateDeclaredValue !== '') {
        updatedShipment.package = {
          ...updatedShipment.package,
          value: parseFloat(updateDeclaredValue) || 0,
        }
      }

      // Find the document and update
      const q = query(
        collection(db, 'shipments'),
        where(
          'trackingNumber',
          '==',
          selectedTracking
        )
      )

      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        throw new Error('Shipment not found')
      }

      await updateDoc(
        snapshot.docs[0].ref,
        updatedShipment
      )

      await fetchShipments()

      setToast(
        `Shipment ${selectedTracking} updated successfully.`
      )

      // Reset selection and editData
      setSelectedTracking(null)
      setEditData(null)
      setLocation('')
      setDescription('')
      setStatus('processing')
      setUpdateDeclaredValue('')

      setTimeout(() => {
        setToast('')
      }, 5000)
    } catch (err) {
      console.error(err)
      setError('Failed to update shipment.')
    }
  }

  // ======================================================
  // DELETE
  // ======================================================

  const handleDeleteShipment = async () => {
    if (!selectedTracking) return

    setIsDeleting(true)

    try {
      const q = query(
        collection(db, 'shipments'),
        where(
          'trackingNumber',
          '==',
          selectedTracking
        )
      )

      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        throw new Error('Shipment not found')
      }

      await deleteDoc(snapshot.docs[0].ref)

      await fetchShipments()

      setSelectedTracking(null)
      setEditData(null)
      setShowDeleteModal(false)

      setToast(
        `Shipment ${selectedTracking} deleted successfully.`
      )

      setTimeout(() => {
        setToast('')
      }, 5000)
    } catch (err) {
      console.error(err)
      setError('Failed to delete shipment.')
    } finally {
      setIsDeleting(false)
    }
  }

  // ======================================================
  // FILTERED SHIPMENTS
  // ======================================================

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const searchValue = search.toLowerCase().trim()

      const matchesSearch =
        !searchValue ||
        shipment.trackingNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        shipment.receiver?.name
          ?.toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === 'all' ||
        shipment.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [shipments, search, statusFilter])

  const selectedShipment = shipments.find(
    (shipment) =>
      shipment.trackingNumber === selectedTracking
  )

  // ======================================================
  // LOGIN SCREEN
  // ======================================================
  if (!isAdmin && !isWorker) {
  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-icon">
          📦
        </div>

        <div className="admin-login-heading">
          <span>SECURE ACCESS</span>
          <h1>Admin Portal</h1>
          <p>
            Sign in to manage shipments, tracking,
            and package deliveries.
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            <span>!</span>
            <div>
              <strong>Sign in failed</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="admin-login-form"
        >

          <div className="admin-form-group">
            <label className="admin-label">
              Email address
            </label>

            <div className="admin-input-wrapper">
              <span className="admin-input-icon">
                ✉
              </span>

              <input
                type="email"
                value={adminEmail}
                onChange={(e) =>
                  setAdminEmail(e.target.value)
                }
                className="admin-input admin-input-with-icon"
                placeholder="admin@example.com"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">
              Password
            </label>

            <div className="admin-input-wrapper">
              <span className="admin-input-icon">
                🔒
              </span>

              <input
                type="password"
                value={adminPassword}
                onChange={(e) =>
                  setAdminPassword(e.target.value)
                }
                className="admin-input admin-input-with-icon"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
          >
            <span>Sign In</span>
            <span>→</span>
          </button>

        </form>

        <div className="admin-login-footer">
          <span className="admin-security-dot" />
          Secure administrator access
        </div>

      </div>
    </main>
  )
}

  return (
  <main className="admin-page">


    {/* HEADER */}
    <header className="admin-header">
      <div className="admin-container">

        <div className="admin-header-content">

          <div className="admin-brand">
            <div className="admin-brand-icon">
              📦
            </div>

            <div>
              <h1>Shipment Admin</h1>

              <p>
                Logged in as{' '}
                <strong>{userRole}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="admin-logout"
          >
            Logout
          </button>

        </div>

      </div>
    </header>

    <div className="admin-container">

      {/* TOAST */}
      {toast && (
        <div className="admin-toast">
          <div className="admin-toast-content">

            <div className="admin-toast-icon">
              ✓
            </div>

            <div>
              <strong>Success</strong>
              <p>{toast}</p>
            </div>

          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {/* PAGE HEADING */}
      <div className="admin-page-heading">
        <span>ADMIN DASHBOARD</span>

        <h2>
          Manage your shipments
        </h2>

        <p>
          Create new packages, monitor shipments and
          update tracking information from one place.
        </p>
      </div>

      {/* TWO TABS */}
      <div className="admin-tabs">

        <button
          type="button"
          onClick={() => {
            setActiveTab('create')
            setSelectedTracking(null)
            setEditData(null)
          }}
          className={`admin-tab ${
            activeTab === 'create'
              ? 'active'
              : ''
          }`}
        >
          📦 Send New Package
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('manage')
            setTrackingCode('')
            fetchShipments()
          }}
          className={`admin-tab ${
            activeTab === 'manage'
              ? 'active'
              : ''
          }`}
        >
          📋 Manage Shipments
        </button>

      </div>

      {/* =====================================================
          CREATE TAB
      ===================================================== */}

      {activeTab === 'create' && (
        <div>

          {trackingCode && (
            <div className="admin-tracking-success">

              <div>
                <div className="admin-tracking-success-label">
                  ✓ Shipment created successfully
                </div>

                <span className="admin-tracking-number">
                  {trackingCode}
                </span>
              </div>

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => setTrackingCode('')}
              >
                Dismiss
              </button>

            </div>
          )}

          <form onSubmit={handleSendPackage}>

            {/* SENDER */}
            <div className="admin-card admin-form-section">

              <div className="admin-section-heading">

                <div className="admin-section-icon">
                  ↑
                </div>

                <div>
                  <h3>Sender Information</h3>
                  <p>
                    Details of the person sending the package.
                  </p>
                </div>

              </div>

              <div className="admin-form-grid">

                <Field
                  label="Full Name"
                  name="sender.name"
                  value={formData.sender.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />

                <Field
                  label="Address"
                  name="sender.address"
                  value={formData.sender.address}
                  onChange={handleChange}
                  placeholder="New York, NY"
                  required
                />

                <Field
                  label="Email"
                  name="sender.email"
                  type="email"
                  value={formData.sender.email}
                  onChange={handleChange}
                  placeholder="sender@example.com"
                  required
                />

                <Field
                  label="Phone"
                  name="sender.phone"
                  type="tel"
                  value={formData.sender.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  required
                />

              </div>

            </div>

            {/* RECEIVER */}
            <div className="admin-card admin-form-section">

              <div className="admin-section-heading">

                <div className="admin-section-icon">
                  ↓
                </div>

                <div>
                  <h3>Receiver Information</h3>
                  <p>
                    Where the package is being delivered.
                  </p>
                </div>

              </div>

              <div className="admin-form-grid">

                <Field
                  label="Full Name"
                  name="receiver.name"
                  value={formData.receiver.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />

                <Field
                  label="Address"
                  name="receiver.address"
                  value={formData.receiver.address}
                  onChange={handleChange}
                  placeholder="Los Angeles, CA"
                  required
                />

                <Field
                  label="Email"
                  name="receiver.email"
                  type="email"
                  value={formData.receiver.email}
                  onChange={handleChange}
                  placeholder="receiver@example.com"
                  required
                />

                <Field
                  label="Phone"
                  name="receiver.phone"
                  type="tel"
                  value={formData.receiver.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  required
                />

              </div>

            </div>

            {/* PACKAGE */}
            <div className="admin-card admin-form-section">

              <div className="admin-section-heading">

                <div className="admin-section-icon">
                  📦
                </div>

                <div>
                  <h3>Package Details</h3>
                  <p>
                    Information about the shipment.
                  </p>
                </div>

              </div>

              <div className="admin-form-grid">

                <Field
                  label="Package Description"
                  name="package.description"
                  value={formData.package.description}
                  onChange={handleChange}
                  placeholder="Electronics, documents..."
                  required
                />

                <Field
                  label="Weight (kg)"
                  name="package.weight"
                  type="number"
                  value={formData.package.weight}
                  onChange={handleChange}
                  placeholder="0.0"
                  step="0.1"
                  required
                />

                <div className="admin-form-group">

                  <label className="admin-label">
                    Dimensions (cm)
                    <span className="admin-required">*</span>
                  </label>

                  <div className="admin-dimensions">

                    <input
                      type="number"
                      name="dimensions.length"
                      placeholder="Length"
                      value={
                        formData.package.dimensions.length
                      }
                      onChange={handleChange}
                      step="0.1"
                      required
                      className="admin-input"
                    />

                    <input
                      type="number"
                      name="dimensions.width"
                      placeholder="Width"
                      value={
                        formData.package.dimensions.width
                      }
                      onChange={handleChange}
                      step="0.1"
                      required
                      className="admin-input"
                    />

                    <input
                      type="number"
                      name="dimensions.height"
                      placeholder="Height"
                      value={
                        formData.package.dimensions.height
                      }
                      onChange={handleChange}
                      step="0.1"
                      required
                      className="admin-input"
                    />

                  </div>

                </div>

                <Field
                  label="Declared Value ($)"
                  name="package.value"
                  type="number"
                  value={formData.package.value}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.1"
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-button admin-button-primary admin-button-full"
              style={{
                minHeight: '56px',
                marginTop: '24px',
                fontSize: '15px',
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="admin-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  📦 Create & Ship Package
                </>
              )}
            </button>

          </form>

        </div>
      )}

      {/* =====================================================
          MANAGE TAB
      ===================================================== */}

      {activeTab === 'manage' && (
        <div>

          {/* SEARCH */}
          <div className="admin-card">

            <div className="admin-toolbar">

              <div className="admin-search">

                <span className="admin-search-icon">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search tracking number or receiver..."
                  className="admin-input"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="admin-select"
              >
                <option value="all">
                  All statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="in-transit">
                  In Transit
                </option>

                <option value="out-for-delivery">
                  Out for Delivery
                </option>

                <option value="delivered">
                  Delivered
                </option>
              </select>

            </div>

          </div>

          {/* SHIPMENT TABLE */}
          {!selectedShipment && (
            <div
              className="admin-card"
              style={{ padding: 0, overflow: 'hidden' }}
            >

              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">
                    Shipments
                  </h3>

                  <p className="admin-card-description">
                    {filteredShipments.length} shipment
                    {filteredShipments.length !== 1
                      ? 's'
                      : ''}{' '}
                    found
                  </p>
                </div>

                <button
                  onClick={fetchShipments}
                  className="admin-button admin-button-secondary"
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div className="admin-loading">
                  <div className="admin-skeleton admin-skeleton-row" />
                  <div className="admin-skeleton admin-skeleton-row" />
                  <div className="admin-skeleton admin-skeleton-row" />
                  <div className="admin-skeleton admin-skeleton-row" />
                </div>
              ) : filteredShipments.length === 0 ? (

                <div className="admin-empty">

                  <div className="admin-empty-icon">
                    📦
                  </div>

                  <h3>
                    No shipments found
                  </h3>

                  <p>
                    Try changing your search or filter.
                  </p>

                </div>

              ) : (

                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>Tracking #</th>
                        <th>Receiver</th>
                        <th>Status</th>
                        <th>Current Location</th>
                        <th>Last Update</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredShipments.map(
                        (shipment) => {

                          const lastEvent =
                            shipment.history?.[
                              shipment.history.length - 1
                            ]

                          return (
                            <tr
                              key={
                                shipment.trackingNumber
                              }
                            >

                              <td>
                                <div className="admin-tracking">
                                  {
                                    shipment.trackingNumber
                                  }
                                </div>

                                <small>
                                  {formatDate(
                                    shipment.createdAt
                                  )}
                                </small>
                              </td>

                              <td>
                                <strong>
                                  {
                                    shipment.receiver?.name
                                  }
                                </strong>

                                <small>
                                  {
                                    shipment.receiver?.email
                                  }
                                </small>
                              </td>

                              <td>
                                <span
                                  className={`admin-status ${
                                    shipment.status ===
                                    'pending'
                                      ? 'admin-status-pending'
                                      : shipment.status ===
                                        'processing'
                                      ? 'admin-status-processing'
                                      : shipment.status ===
                                        'in-transit'
                                      ? 'admin-status-transit'
                                      : shipment.status ===
                                        'out-for-delivery'
                                      ? 'admin-status-delivery'
                                      : shipment.status ===
                                        'delivered'
                                      ? 'admin-status-delivered'
                                      : ''
                                  }`}
                                >
                                  {getStatusLabel(
                                    shipment.status
                                  )}
                                </span>
                              </td>

                              <td>
                                <div className="admin-location">
                                  {
                                    shipment.currentLocation
                                  }
                                </div>
                              </td>

                              <td>
                                {getRelativeTime(
                                  shipment.lastUpdated ||
                                    lastEvent?.date
                                )}
                              </td>

                              <td>
                                <button
                                  onClick={() =>
                                    handleSelectShipment(
                                      shipment
                                    )
                                  }
                                  className="admin-select-button"
                                >
                                  Select
                                </button>
                              </td>

                            </tr>
                          )
                        }
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

          {/* UPDATE PANEL (full edit form) */}
          {selectedShipment && editData && (
            <div className="admin-update-layout">

              <div>

                <button
                  onClick={() => {
                    setSelectedTracking(null)
                    setEditData(null)
                  }}
                  className="admin-button admin-button-secondary"
                  style={{
                    marginBottom: '20px',
                  }}
                >
                  ← Back to shipments
                </button>

                {/* EDIT FORM */}
                <form onSubmit={handleUpdate}>

                  {/* Heading with tracking and status */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <small>EDIT SHIPMENT</small>
                        <h2 className="admin-card-title">
                          {selectedShipment.trackingNumber}
                        </h2>
                      </div>
                      <span
                        className={`admin-status ${
                          selectedShipment.status === 'pending'
                            ? 'admin-status-pending'
                            : selectedShipment.status === 'processing'
                            ? 'admin-status-processing'
                            : selectedShipment.status === 'in-transit'
                            ? 'admin-status-transit'
                            : selectedShipment.status === 'out-for-delivery'
                            ? 'admin-status-delivery'
                            : 'admin-status-delivered'
                        }`}
                      >
                        {getStatusLabel(selectedShipment.status)}
                      </span>
                    </div>
                  </div>

                  {/* SENDER EDIT */}
                  <div className="admin-card admin-form-section" style={{ marginTop: '24px' }}>
                    <div className="admin-section-heading">
                      <div className="admin-section-icon">↑</div>
                      <div>
                        <h3>Sender Information</h3>
                        <p>Edit sender details.</p>
                      </div>
                    </div>
                    <div className="admin-form-grid">
                      <Field
                        label="Full Name"
                        name="sender.name"
                        value={editData.sender?.name || ''}
                        onChange={handleEditChange}
                        placeholder="John Doe"
                        required
                      />
                      <Field
                        label="Address"
                        name="sender.address"
                        value={editData.sender?.address || ''}
                        onChange={handleEditChange}
                        placeholder="New York, NY"
                        required
                      />
                      <Field
                        label="Email"
                        name="sender.email"
                        type="email"
                        value={editData.sender?.email || ''}
                        onChange={handleEditChange}
                        placeholder="sender@example.com"
                        required
                      />
                      <Field
                        label="Phone"
                        name="sender.phone"
                        type="tel"
                        value={editData.sender?.phone || ''}
                        onChange={handleEditChange}
                        placeholder="+1 234 567 890"
                        required
                      />
                    </div>
                  </div>

                  {/* RECEIVER EDIT */}
                  <div className="admin-card admin-form-section" style={{ marginTop: '24px' }}>
                    <div className="admin-section-heading">
                      <div className="admin-section-icon">↓</div>
                      <div>
                        <h3>Receiver Information</h3>
                        <p>Edit receiver details.</p>
                      </div>
                    </div>
                    <div className="admin-form-grid">
                      <Field
                        label="Full Name"
                        name="receiver.name"
                        value={editData.receiver?.name || ''}
                        onChange={handleEditChange}
                        placeholder="Jane Doe"
                        required
                      />
                      <Field
                        label="Address"
                        name="receiver.address"
                        value={editData.receiver?.address || ''}
                        onChange={handleEditChange}
                        placeholder="Los Angeles, CA"
                        required
                      />
                      <Field
                        label="Email"
                        name="receiver.email"
                        type="email"
                        value={editData.receiver?.email || ''}
                        onChange={handleEditChange}
                        placeholder="receiver@example.com"
                        required
                      />
                      <Field
                        label="Phone"
                        name="receiver.phone"
                        type="tel"
                        value={editData.receiver?.phone || ''}
                        onChange={handleEditChange}
                        placeholder="+1 234 567 890"
                        required
                      />
                    </div>
                  </div>

                  {/* PACKAGE EDIT */}
                  <div className="admin-card admin-form-section" style={{ marginTop: '24px' }}>
                    <div className="admin-section-heading">
                      <div className="admin-section-icon">📦</div>
                      <div>
                        <h3>Package Details</h3>
                        <p>Edit package information.</p>
                      </div>
                    </div>
                    <div className="admin-form-grid">
                      <Field
                        label="Package Description"
                        name="package.description"
                        value={editData.package?.description || ''}
                        onChange={handleEditChange}
                        placeholder="Electronics, documents..."
                        required
                      />
                      <Field
                        label="Weight (kg)"
                        name="package.weight"
                        type="number"
                        value={editData.package?.weight || ''}
                        onChange={handleEditChange}
                        placeholder="0.0"
                        step="0.1"
                        required
                      />
                      <div className="admin-form-group">
                        <label className="admin-label">
                          Dimensions (cm)
                          <span className="admin-required">*</span>
                        </label>
                        <div className="admin-dimensions">
                          <input
                            type="number"
                            name="dimensions.length"
                            placeholder="Length"
                            value={editData.package?.dimensions?.length || ''}
                            onChange={handleEditChange}
                            step="0.1"
                            required
                            className="admin-input"
                          />
                          <input
                            type="number"
                            name="dimensions.width"
                            placeholder="Width"
                            value={editData.package?.dimensions?.width || ''}
                            onChange={handleEditChange}
                            step="0.1"
                            required
                            className="admin-input"
                          />
                          <input
                            type="number"
                            name="dimensions.height"
                            placeholder="Height"
                            value={editData.package?.dimensions?.height || ''}
                            onChange={handleEditChange}
                            step="0.1"
                            required
                            className="admin-input"
                          />
                        </div>
                      </div>
                      <Field
                        label="Declared Value ($)"
                        name="package.value"
                        type="number"
                        value={editData.package?.value || ''}
                        onChange={handleEditChange}
                        placeholder="0.00"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  {/* STATUS / LOCATION / EVENT */}
                  <div className="admin-card" style={{ marginTop: '24px' }}>
                    <div className="admin-card-header">
                      <div>
                        <h2 className="admin-card-title">Update Status & Location</h2>
                        <p className="admin-card-description">
                          Change the current status and location. This will also add a new tracking event.
                        </p>
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label className="admin-label">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="admin-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in-transit">In Transit</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>

                      <Field
                        label="Current Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={selectedShipment.currentLocation}
                      />
                    </div>

                    {/* Optional event section */}
                    <div className="admin-event-section">
                      <button
                        type="button"
                        onClick={() => setShowEventSection(!showEventSection)}
                        className="admin-event-toggle"
                      >
                        <div>
                          <strong>Add Tracking Event</strong>
                          <span>Add an optional history entry.</span>
                        </div>
                        <span>{showEventSection ? '−' : '+'}</span>
                      </button>

                      {showEventSection && (
                        <div className="admin-form-grid">
                          <div className="admin-form-group admin-form-full">
                            <Field
                              label="Event Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Package arrived at sorting facility"
                            />
                          </div>
                          <Field
                            label="Date & Time"
                            type="datetime-local"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                          />
                          <Field
                            label="Declared Value Override ($)"
                            type="number"
                            value={updateDeclaredValue}
                            onChange={(e) => setUpdateDeclaredValue(e.target.value)}
                            placeholder="Optional"
                            step="0.1"
                          />
                        </div>
                      )}
                    </div>

                    <div className="admin-actions">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="admin-button admin-button-danger"
                      >
                        Delete Shipment
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTracking(null)
                          setEditData(null)
                        }}
                        className="admin-button admin-button-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="admin-button admin-button-primary"
                      >
                        Update Shipment
                      </button>
                    </div>
                  </div>

                </form>

                {/* HISTORY */}
                <div
                  className="admin-card"
                  style={{ marginTop: '24px' }}
                >

                  <div className="admin-card-header">

                    <div>
                      <h2 className="admin-card-title">
                        Tracking History
                      </h2>

                      <p className="admin-card-description">
                        Complete shipment journey.
                      </p>
                    </div>

                  </div>

                  {!selectedShipment.history ||
                  selectedShipment.history.length === 0 ? (
                    <div className="admin-empty">
                      <p>
                        No tracking events available.
                      </p>
                    </div>
                  ) : (

                    <div className="admin-timeline">

                      {[
                        ...selectedShipment.history,
                      ]
                        .reverse()
                        .map((event, index) => (

                          <div
                            key={`${event.date}-${index}`}
                            className="admin-timeline-item"
                          >

                            <div className="admin-timeline-dot">
                            </div>

                            <h4 className="admin-timeline-status">
                              {getStatusLabel(
                                event.status
                              )}
                            </h4>

                            <p className="admin-timeline-location">
                              📍 {event.location}
                            </p>

                            <p className="admin-timeline-description">
                              {event.description}
                            </p>

                            <div className="admin-timeline-date">
                              {formatDate(event.date)}
                            </div>

                          </div>

                        ))}

                    </div>

                  )}

                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>

    {/* DELETE MODAL */}
    {showDeleteModal && (
      <div className="admin-modal-overlay">

        <div className="admin-modal">

          <div className="admin-modal-icon">
            ⚠
          </div>

          <h2>
            Delete shipment?
          </h2>

          <p>
            You are about to permanently delete shipment{' '}
            <strong>
              {selectedTracking}
            </strong>
            . This action cannot be undone.
          </p>

          <div className="admin-modal-actions">

            <button
              type="button"
              onClick={() =>
                setShowDeleteModal(false)
              }
              disabled={isDeleting}
              className="admin-button admin-button-secondary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDeleteShipment}
              disabled={isDeleting}
              className="admin-button admin-button-danger"
            >
              {isDeleting
                ? 'Deleting...'
                : 'Yes, Delete Shipment'}
            </button>

          </div>

        </div>

      </div>
    )}

  </main>

  )
}