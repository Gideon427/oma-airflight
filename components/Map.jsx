'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

// Fix default marker icons (important for Next.js)
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function Map({ 
  lat = 40.7128, 
  lng = -74.0060,
  locationName = "Current Location" 
}) {
  
  // Force re-render when coordinates change
  const key = `${lat}-${lng}`

  return (
    <MapContainer
      key={key}                    // Important: forces map to update when coords change
      center={[lat, lng]}
      zoom={11}
      style={{ 
        height: '450px', 
        width: '100%', 
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={[lat, lng]}>
        <Popup>
          <strong>{locationName}</strong><br />
          Latitude: {lat.toFixed(4)}<br />
          Longitude: {lng.toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  )
}