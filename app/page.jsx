'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Blog from '@/components/Blog'
export default function Home() {
  const features = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Guaranteed on-time shipments with our optimized delivery network'
    },
    {
      icon: '📍',
      title: 'Real-Time Tracking',
      description: 'Know exactly where your package is at all times with live updates'
    },
    {
      icon: '💰',
      title: 'Affordable Prices',
      description: 'Competitive rates without compromising on service quality'
    }
  ]

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Safe Package Shipping",
    excerpt: "Learn how to properly package your items to ensure they arrive safely at their destination.",
    date: "May 15, 2023",
    image: "/blog1.jpg",
    slug: "10-tips-for-safe-package-shipping"
  },
  {
    id: 2,
    title: "Understanding Shipping Costs",
    excerpt: "A comprehensive guide to how shipping costs are calculated and how you can save money.",
    date: "June 2, 2023",
    image: "/blog2.jpg",
    slug: "understanding-shipping-costs"
  },
  {
    id: 3,
    title: "International Shipping Made Easy",
    excerpt: "Everything you need to know about shipping packages internationally without hassle.",
    date: "June 18, 2023",
    image: "/blog3.jpg",
    slug: "international-shipping-made-easy"
  },
  {
    id: 4,
    title: "Tracking Your Packages: A Complete Guide",
    excerpt: "How to effectively use our tracking system to monitor your shipments in real-time.",
    date: "July 5, 2023",
    image: "/blog4.jpg",
    slug: "tracking-your-packages-guide"
  },
  {
    id: 5,
    title: "Eco-Friendly Shipping Options",
    excerpt: "Discover our green shipping initiatives and how you can reduce your carbon footprint.",
    date: "July 22, 2023",
    image: "/blog5.jpg",
    slug: "eco-friendly-shipping-options"
  }
]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length)
    }, 3000) // change slide every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="hero home-hero">
        <div className="hero-content animate-slide-up">
          <h1 className="hero-title animate-fade-in">Fast & Reliable Shipping Solution</h1>
          <p className="hero-subtitle animate-fade-in delay-200">
            Track, send, and manage your packages with our state-of-the-art shipping platform
          </p>
          <div className="hero-buttons animate-pop delay-400">
           
            <Link href="/track" className="btn btn-secondary">Track Your Order</Link>
          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Oma-Airflight?</h2>
            <p>We provide the best shipping experience with our innovative solutions</p>
          </div>

          {/* SLIDESHOW */}
          <div className="slideshow">
            <div
              className="slide-wrapper"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {features.map((feature, i) => (
                <div key={i} className="slide">
                  <div className="card feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* dots */}
          <div className="dots">
            {features.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="section-title">
            <h2>Ready to Ship?</h2>
            <p>Get an instant quote and see how much you can save with Oma-Airflight</p>
            <Link href="/quote" className="btn btn-primary btn-lg">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-title">
            <h2>Our Comprehensive Services</h2>
            <p>From local deliveries to international shipping, we handle it all</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card service-card animate-pop">
              <img src="/images.jpg" alt="Package Shipping" className="feature-image" />
              <h3>Package Shipping</h3>
              <p>Reliable delivery for packages of all sizes, from small envelopes to freight.</p>
            </div>
            <div className="card service-card animate-pop delay-200">
              <img src="/globe.svg" alt="Freight Forwarding" className="feature-image" />
              <h3>Freight Forwarding</h3>
              <p>Heavy cargo and oversized shipments handled with dedicated logistics equipment.</p>
            </div>
            <div className="card service-card animate-pop delay-400">
              <img src="/hero-image.jpg" alt="International Shipping" className="feature-image feature-image-bold" />
              <h3>International Shipping</h3>
              <p>Global reach with customs clearance, duty support, and multi-country tracking.</p>
            </div>
            <div className="card service-card animate-pop">
              <img src="/fil.jpg" alt="Express Delivery" className="feature-image" />
              <h3>Express Delivery</h3>
              <p>Urgent shipments delivered within hours or same-day service for critical cargo.</p>
            </div>
            <div className="card service-card animate-pop delay-200">
              <img src="/download.jpg" alt="Secure Packaging" className="feature-image" />
              <h3>Secure Packaging</h3>
              <p>Professional packing and handling to protect delicate or high-value shipments.</p>
            </div>
            <div className="card service-card animate-pop delay-400">
              <img src="/hero-imge.jpg" alt="Supply Chain Solutions" className="feature-image" />
              <h3>Supply Chain Solutions</h3>
              <p>End-to-end logistics management for businesses with complex shipping needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>What Our Customers Say</h2>
            <p>Trusted by thousands of satisfied customers worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card testimonial-card">
              <div className="testimonial-content">
                <p>"Oma-Airflight has revolutionized our shipping process. Their real-time tracking and reliable service have saved us countless hours."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div>
                  <p className="font-medium">John Davis</p>
                  <p className="text-sm text-gray-600">CEO, TechCorp</p>
                </div>
              </div>
            </div>
            <div className="card testimonial-card">
              <div className="testimonial-content">
                <p>"Exceptional customer service and lightning-fast delivery. We've been using Oma-Airflight for 3 years and couldn't be happier."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div>
                  <p className="font-medium">Sarah Miller</p>
                  <p className="text-sm text-gray-600">Operations Manager, RetailPlus</p>
                </div>
              </div>
            </div>
            <div className="card testimonial-card">
              <div className="testimonial-content">
                <p>"The international shipping service is outstanding. Customs clearance was handled seamlessly, and our packages arrived on time."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div>
                  <p className="font-medium">Mike Rodriguez</p>
                  <p className="text-sm text-gray-600">Import Manager, Global Imports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Packages Delivered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">On-Time Delivery</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Countries Served</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common shipping questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card faq-card">
              <h3>How long does shipping take?</h3>
              <p>Delivery times vary by destination and service level. Standard shipping takes 3-5 business days, while express service delivers within 1-2 days.</p>
            </div>
            <div className="card faq-card">
              <h3>Do you offer insurance?</h3>
              <p>Yes, we provide comprehensive shipping insurance for valuable packages. Coverage is available for up to $5,000 per shipment.</p>
            </div>
            <div className="card faq-card">
              <h3>What items cannot be shipped?</h3>
              <p>Hazardous materials, perishable goods, and illegal items cannot be shipped. Please review our prohibited items list for complete details.</p>
            </div>
            <div className="card faq-card">
              <h3>How do I track my package?</h3>
              <p>Use our tracking page with your tracking number for real-time updates. You'll receive email notifications at key milestones.</p>
            </div>
            <div className="card faq-card">
              <h3>What are your rates?</h3>
              <p>Rates depend on package weight, dimensions, and destination. Use our quote calculator for instant pricing or contact us for custom quotes.</p>
            </div>
            <div className="card faq-card">
              <h3>Do you ship internationally?</h3>
              <p>Yes, we provide international shipping to over 50 countries with customs clearance and duty calculation services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Need Help?</h2>
            <p>Our expert team is here to assist you with all your shipping needs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-secondary btn-lg">
                Contact Support
              </Link>
              <Link href="/quote" className="btn btn-primary btn-lg">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Blog posts={blogPosts} />
    </>
  )
}