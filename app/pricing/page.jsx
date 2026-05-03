export default function Pricing() {
  const pricingPlans = [
    {
      name: "Standard",
      price: "From $9.99",
      period: "per shipment",
      description: "Perfect for occasional shippers",
      features: [
        "Up to 5 lbs package weight",
        "Standard delivery (3-5 days)",
        "Basic tracking",
        "Email notifications",
        "Insurance up to $100"
      ],
      popular: false
    },
    {
      name: "Express",
      price: "From $19.99",
      period: "per shipment",
      description: "Fast and reliable delivery",
      features: [
        "Up to 10 lbs package weight",
        "Express delivery (1-2 days)",
        "Real-time GPS tracking",
        "SMS notifications",
        "Insurance up to $500",
        "Signature required"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "From $39.99",
      period: "per shipment",
      description: "For high-value and urgent shipments",
      features: [
        "Up to 50 lbs package weight",
        "Same-day delivery",
        "Premium tracking & support",
        "Dedicated courier",
        "Insurance up to $5,000",
        "White glove service",
        "24/7 customer support"
      ],
      popular: false
    }
  ]

  const additionalServices = [
    {
      name: "Insurance",
      price: "$2.99",
      description: "per $100 of declared value"
    },
    {
      name: "Secure Packaging",
      price: "$15.99",
      description: "professional crating service"
    },
    {
      name: "Pickup Service",
      price: "$9.99",
      description: "scheduled pickup from your location"
    },
    {
      name: "Storage",
      price: "$4.99",
      description: "per day, per cubic foot"
    }
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h1>Shipping Rates & Pricing</h1>
          <p>Transparent pricing with no hidden fees</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`card pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3 className="pricing-plan-name">{plan.name}</h3>
              <div className="pricing-amount">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <p className="pricing-description">{plan.description}</p>
              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <a href="/quote" className="btn btn-primary w-full">Get Started</a>
            </div>
          ))}
        </div>

        <div className="additional-services">
          <h2>Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="card service-addon">
                <h4>{service.name}</h4>
                <div className="addon-price">{service.price}</div>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-info mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="info-card">
              <h3>💰 No Hidden Fees</h3>
              <p>What you see is what you pay. No fuel surcharges, no handling fees, no surprise charges.</p>
            </div>
            <div className="info-card">
              <h3>📊 Volume Discounts</h3>
              <p>Business customers can save up to 30% with our volume shipping programs.</p>
            </div>
            <div className="info-card">
              <h3>🌍 International Rates</h3>
              <p>Competitive rates for international shipping with customs clearance included.</p>
            </div>
            <div className="info-card">
              <h3>⚡ Express Options</h3>
              <p>Same-day and next-day delivery available in select areas.</p>
            </div>
          </div>
        </div>

        <div className="cta-section text-center mt-16">
          <h2>Need a Custom Quote?</h2>
          <p>Contact our sales team for personalized pricing and special requirements</p>
          <a href="/quote" className="btn btn-primary btn-lg mt-6">Request Quote</a>
        </div>
      </div>
    </div>
  )
}