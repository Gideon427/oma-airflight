export default function Support() {
  const supportOptions = [
    {
      title: "Track Your Package",
      icon: "📦",
      description: "Real-time tracking updates and delivery information",
      link: "/track",
      color: "blue"
    },
    {
      title: "Customer Service",
      icon: "📞",
      description: "Speak with our support team for assistance",
      link: "/contact",
      color: "green"
    },
    {
      title: "File a Claim",
      icon: "📋",
      description: "Report damaged or lost packages",
      link: "/contact",
      color: "red"
    },
    {
      title: "Schedule Pickup",
      icon: "🚚",
      description: "Arrange package collection from your location",
      link: "/send",
      color: "purple"
    }
  ]

  const quickLinks = [
    { title: "Shipping Rates", link: "/pricing" },
    { title: "Service Areas", link: "/services" },
    { title: "Prohibited Items", link: "/terms" },
    { title: "Insurance Options", link: "/pricing" },
    { title: "International Shipping", link: "/services" },
    { title: "Bulk Shipping", link: "/contact" }
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h1>Customer Support</h1>
          <p>We're here to help with all your shipping needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map((option, index) => (
            <a key={index} href={option.link} className={`support-card support-${option.color}`}>
              <div className="support-icon">{option.icon}</div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <span className="support-link">Learn More →</span>
            </a>
          ))}
        </div>

        <div className="support-contact-info">
          <h2>Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="contact-method">
              <h3>📞 Phone Support</h3>
              <p>1-800-SHIP-FAST</p>
              <p>Mon-Fri: 8AM - 8PM EST</p>
              <p>Sat-Sun: 9AM - 5PM EST</p>
            </div>
            <div className="contact-method">
              <h3>💬 Live Chat</h3>
              <p>Available 24/7</p>
              <p>Instant support for tracking and quotes</p>
              <button className="btn btn-primary">Start Chat</button>
            </div>
            <div className="contact-method">
              <h3>📧 Email Support</h3>
              <p>support@swiftship.com</p>
              <p>Response within 24 hours</p>
              <p>For detailed inquiries and claims</p>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <h2>Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <a key={index} href={link.link} className="quick-link-card">
                {link.title}
              </a>
            ))}
          </div>
        </div>

        <div className="support-resources">
          <h2>Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="resource-card">
              <h3>📖 User Guide</h3>
              <p>Step-by-step instructions for using our services</p>
              <a href="/blog/tracking-your-packages-guide" className="resource-link">Read Guide →</a>
            </div>
            <div className="resource-card">
              <h3>🎥 Video Tutorials</h3>
              <p>Visual guides for common shipping tasks</p>
              <a href="/blog" className="resource-link">Watch Videos →</a>
            </div>
            <div className="resource-card">
              <h3>📋 Shipping Checklist</h3>
              <p>Ensure your packages are ready for shipment</p>
              <a href="/blog/10-tips-for-safe-package-shipping" className="resource-link">View Checklist →</a>
            </div>
            <div className="resource-card">
              <h3>💡 Tips & Tricks</h3>
              <p>Expert advice for better shipping experiences</p>
              <a href="/blog" className="resource-link">Read Tips →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}