'use client'
import { useState } from 'react'

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: "How do I track my package?",
      answer: "You can track your package by entering the tracking number on our tracking page. You'll receive real-time updates on your shipment's location and status."
    },
    {
      question: "What are your delivery timeframes?",
      answer: "Standard delivery takes 3-5 business days, Express delivery takes 1-2 business days, and Premium service offers same-day delivery in select areas."
    },
    {
      question: "How much does shipping cost?",
      answer: "Shipping costs vary based on package weight, dimensions, destination, and service level. Use our quote tool for accurate pricing or contact our sales team."
    },
    {
      question: "What items cannot be shipped?",
      answer: "We cannot ship hazardous materials, illegal substances, perishable items, live animals (except day-old poultry), cash, or any items prohibited by law."
    },
    {
      question: "Do you offer insurance?",
      answer: "Yes, we offer insurance coverage up to $500 for standard shipments. Additional coverage is available for higher-value items."
    },
    {
      question: "How do I file a claim for a damaged package?",
      answer: "Claims must be filed within 30 days of delivery. Contact our customer service team with your tracking number and photos of the damage."
    },
    {
      question: "Can I change the delivery address after shipping?",
      answer: "Address changes are possible within 24 hours of pickup for an additional fee. Contact customer service immediately if you need to change the delivery address."
    },
    {
      question: "What if I'm not home for delivery?",
      answer: "If you're not home, we'll leave a notice with pickup instructions. You can reschedule delivery or pick up at a nearby location."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we provide international shipping services with customs clearance and documentation assistance."
    },
    {
      question: "How do I get a quote for multiple packages?",
      answer: "For bulk shipments or multiple packages, contact our sales team for volume discounts and customized quotes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, debit cards, bank transfers, and cash payments at authorized locations."
    },
    {
      question: "Can I ship on weekends or holidays?",
      answer: "Weekend and holiday pickup is available for an additional fee. Delivery schedules may vary during holidays."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our shipping services</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className={`faq-toggle ${openFAQ === index ? 'open' : ''}`}>+</span>
              </button>
              <div className={`faq-answer ${openFAQ === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-section text-center mt-16">
          <h2>Still have questions?</h2>
          <p>Our customer service team is here to help</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a href="/contact" className="btn btn-primary">Contact Support</a>
            <a href="/track" className="btn btn-secondary">Track Package</a>
          </div>
        </div>
      </div>
    </div>
  )
}