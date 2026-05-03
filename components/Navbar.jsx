'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaShippingFast } from 'react-icons/fa'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [role, setRole] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(window.localStorage.getItem('role') || '')
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const closeMenu = () => setIsMenuOpen(false)
  const canSend = role === 'admin' || role === 'worker'

  return (
    <nav className="navbar shadow-soft">
      <div className="container nav-container">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="nav-brand">
              <FaShippingFast className="h-8 w-8 text-primary mr-2" />
              <div className="logo-container">
  <span className="gradient-text moving-logo">Oma-Airflight🚛</span>
</div>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="desktop-nav hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/track" className="nav-link">Track</Link>
            {canSend && <Link href="/send" className="nav-link">Send</Link>}
            <Link href="/admin" className="nav-link">Admin</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/support" className="nav-link">Support</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            <Link href="/quote" className="btn btn-primary">
              Get Quote
            </Link>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="nav-toggle"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`nav-links md:hidden ${isMenuOpen ? 'mobile-active' : ''}`}>
          <Link href="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link href="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          <Link href="/pricing" className="nav-link" onClick={closeMenu}>Pricing</Link>
          <Link href="/track" className="nav-link" onClick={closeMenu}>Track</Link>
          {canSend && <Link href="/send" className="nav-link" onClick={closeMenu}>Send</Link>}
          <Link href="/admin" className="nav-link" onClick={closeMenu}>Admin</Link>
          <Link href="/blog" className="nav-link" onClick={closeMenu}>Blog</Link>
          <Link href="/support" className="nav-link" onClick={closeMenu}>Support</Link>
          <Link href="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
          <Link href="/quote" className="btn btn-primary" onClick={closeMenu}>
            Get Quote
          </Link>
        </div>
      </div>
    </nav>
  )
}