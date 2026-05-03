'use client'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open('https://wa.me/16503020768', '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="whatsapp-button"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
      <span className="whatsapp-text">Chat with us</span>
    </button>
  )
}