export default function Services() {
  const services = [
    {
      title: "Package Shipping",
      icon: "📦",
      description: "Reliable delivery for packages of all sizes, from small envelopes to large freight shipments.",
      features: ["Door-to-door delivery", "Real-time tracking", "Insurance coverage", "Flexible pickup options"]
    },
    {
      title: "Freight Forwarding",
      icon: "🚚",
      description: "Heavy cargo and oversized shipments handled with specialized logistics equipment.",
      features: ["Heavy lift capabilities", "Project cargo handling", "Customs clearance", "Global network"]
    },
    {
      title: "International Shipping",
      icon: "🌍",
      description: "Global reach with comprehensive customs clearance and international tracking services.",
      features: ["Customs documentation", "Duty calculation", "Import/export compliance", "Multi-country coverage"]
    },
    {
      title: "Express Delivery",
      icon: "⚡",
      description: "Urgent shipments delivered within hours or same-day service for critical cargo.",
      features: ["Same-day delivery", "Priority handling", "Dedicated couriers", "Real-time updates"]
    },
    {
      title: "Secure Packaging",
      icon: "🔒",
      description: "Professional packing and handling services to protect delicate and high-value shipments.",
      features: ["Custom crating", "Fragile item handling", "Climate-controlled storage", "Security seals"]
    },
    {
      title: "Supply Chain Solutions",
      icon: "📊",
      description: "End-to-end logistics management for businesses with complex shipping requirements.",
      features: ["Inventory management", "Route optimization", "Performance analytics", "Dedicated account management"]
    },
    {
      title: "Warehousing",
      icon: "🏭",
      description: "Secure storage facilities with inventory management and order fulfillment services.",
      features: ["Climate-controlled storage", "Inventory tracking", "Order picking & packing", "Cross-docking"]
    },
    {
      title: "E-commerce Fulfillment",
      icon: "🛒",
      description: "Complete order fulfillment solutions for online retailers and e-commerce businesses.",
      features: ["Order processing", "Multi-channel integration", "Returns management", "Customer service"]
    }
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h1>Our Services</h1>
          <p>Comprehensive shipping and logistics solutions tailored to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card service-detail-card">
              <div className="service-icon-large">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cta-section text-center mt-16">
          <h2>Ready to Get Started?</h2>
          <p>Contact our team to discuss your shipping requirements</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a href="/quote" className="btn btn-primary btn-lg">Get a Quote</a>
            <a href="/contact" className="btn btn-secondary btn-lg">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}