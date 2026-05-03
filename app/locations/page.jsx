export default function Locations() {
  const locations = [
    {
      city: "New York",
      state: "NY",
      type: "Headquarters",
      address: "123 Shipping Plaza, New York, NY 10001",
      phone: "(212) 555-0123",
      hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM",
      services: ["Full Service Center", "Pickup & Delivery", "Customer Service"]
    },
    {
      city: "Los Angeles",
      state: "CA",
      type: "Distribution Center",
      address: "456 Logistics Way, Los Angeles, CA 90210",
      phone: "(310) 555-0456",
      hours: "Mon-Fri: 7AM-7PM, Sat: 8AM-4PM",
      services: ["Package Sorting", "Freight Handling", "Express Services"]
    },
    {
      city: "Chicago",
      state: "IL",
      type: "Regional Hub",
      address: "789 Transit Street, Chicago, IL 60601",
      phone: "(312) 555-0789",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
      services: ["Local Delivery", "Pickup Services", "Business Solutions"]
    },
    {
      city: "Houston",
      state: "TX",
      type: "Distribution Center",
      address: "321 Cargo Lane, Houston, TX 77001",
      phone: "(713) 555-0321",
      hours: "Mon-Fri: 7AM-7PM, Sat: 8AM-4PM",
      services: ["Freight Forwarding", "Warehousing", "International Shipping"]
    },
    {
      city: "Phoenix",
      state: "AZ",
      type: "Service Center",
      address: "654 Delivery Drive, Phoenix, AZ 85001",
      phone: "(602) 555-0654",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
      services: ["Local Pickup", "Package Drop-off", "Customer Service"]
    },
    {
      city: "Philadelphia",
      state: "PA",
      type: "Service Center",
      address: "987 Express Ave, Philadelphia, PA 19101",
      phone: "(215) 555-0987",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
      services: ["Express Delivery", "Same-day Service", "Business Accounts"]
    },
    {
      city: "San Antonio",
      state: "TX",
      type: "Regional Hub",
      address: "147 Logistics Blvd, San Antonio, TX 78201",
      phone: "(210) 555-0147",
      hours: "Mon-Fri: 7AM-6PM, Sat: 8AM-3PM",
      services: ["Regional Distribution", "Cross-dock Services", "Bulk Shipping"]
    },
    {
      city: "San Diego",
      state: "CA",
      type: "Service Center",
      address: "258 Harbor View, San Diego, CA 92101",
      phone: "(619) 555-0258",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
      services: ["Coastal Shipping", "International Gateway", "Port Services"]
    }
  ]

  const serviceAreas = [
    "All major metropolitan areas",
    "Rural and suburban delivery",
    "Cross-border shipping (US/Canada)",
    "International destinations worldwide",
    "Military base delivery (APO/FPO)",
    "PO Box delivery services"
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h1>Our Locations</h1>
          <p>Find SwiftShip locations near you for pickup, delivery, and customer service</p>
        </div>

        <div className="locations-grid">
          {locations.map((location, index) => (
            <div key={index} className="location-card">
              <div className="location-header">
                <h3>{location.city}, {location.state}</h3>
                <span className={`location-type ${location.type.toLowerCase().replace(' ', '-')}`}>
                  {location.type}
                </span>
              </div>
              <div className="location-details">
                <p className="location-address">📍 {location.address}</p>
                <p className="location-phone">📞 {location.phone}</p>
                <p className="location-hours">🕒 {location.hours}</p>
              </div>
              <div className="location-services">
                <h4>Services:</h4>
                <ul>
                  {location.services.map((service, idx) => (
                    <li key={idx}>✓ {service}</li>
                  ))}
                </ul>
              </div>
              <button className="btn btn-primary">Get Directions</button>
            </div>
          ))}
        </div>

        <div className="service-areas">
          <h2>Service Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceAreas.map((area, index) => (
              <div key={index} className="service-area-item">
                ✓ {area}
              </div>
            ))}
          </div>
        </div>

        <div className="location-finder">
          <h2>Find a Location</h2>
          <p>Use our interactive map or search tool to find the nearest SwiftShip location.</p>
          <div className="location-search">
            <input
              type="text"
              placeholder="Enter city, state, or ZIP code"
              className="location-input"
            />
            <button className="btn btn-primary">Search</button>
          </div>
        </div>

        <div className="location-info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="info-card">
              <h3>🚚 Pickup Services</h3>
              <p>Schedule package pickup from your home or business. Available at most locations with advance booking.</p>
            </div>
            <div className="info-card">
              <h3>📦 Drop-off Locations</h3>
              <p>Drop off packages at any of our service centers. No appointment needed during business hours.</p>
            </div>
            <div className="info-card">
              <h3>🏪 Retail Partners</h3>
              <p>Authorized drop-off locations at participating retail stores and post offices.</p>
            </div>
            <div className="info-card">
              <h3>🚀 Express Services</h3>
              <p>Priority handling and expedited delivery available at all major hubs and distribution centers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}