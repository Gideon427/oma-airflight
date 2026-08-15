'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaShippingFast } from 'react-icons/fa'

import LanguageDropdown from './LanguageDropdown'
import GoogleTranslateProvider from './GoogleTranslateProvider'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [role, setRole] = useState('')

  useEffect(() => {
    setRole(localStorage.getItem('role') || '')
  }, [])

  const canSend = role === 'admin' || role === 'worker'

  return (
    <>
      <GoogleTranslateProvider />

      <nav className="navbar shadow-soft">
        <div className="container nav-container">

          {/* NAV BAR ROW */}
          <div className="flex justify-between h-16 items-center relative">

            {/* LEFT: LOGO */}
            <Link href="/" className="nav-brand flex items-center">
              <FaShippingFast className="h-8 w-8 text-primary mr-2" />
              <span className="gradient-text moving-logo">
                SWIFTSHIP🚛
              </span>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <div className="desktop-nav hidden md:flex items-center space-x-4">

              <Link href="/" className="nav-link">Home</Link>
              <Link href="/services" className="nav-link">Services</Link>
              <Link href="/pricing" className="nav-link">Pricing</Link>
              <Link href="/track" className="nav-link">Track</Link>

              {canSend && (
                <Link href="/send" className="nav-link">Send</Link>
              )}

              <Link href="/admin" className="nav-link">Admin</Link>
              <Link href="/blog" className="nav-link">Blog</Link>
              <Link href="/support" className="nav-link">Support</Link>
              <Link href="/contact" className="nav-link">Contact</Link>

              <Link href="/quote" className="btn btn-primary">
                Get Quote
              </Link>

              {/* 🌐 Desktop Language */}
              <LanguageDropdown />
            </div>

            {/* ================= MOBILE HAMBURGER ================= */}
            <div className="md:hidden flex items-center z-50">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="nav-toggle"
              >
                ☰
              </button>
            </div>

            {/* ================= MOBILE LANGUAGE (TOP RIGHT FIXED) ================= */}
            <div className="mobile-lang-top-right md:hidden">
              <LanguageDropdown />
            </div>

          </div>

          {/* ================= MOBILE MENU ================= */}
          <div
            className={`nav-links md:hidden ${
              isMenuOpen ? 'mobile-active' : ''
            }`}
          >
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link href="/track" onClick={() => setIsMenuOpen(false)}>Track</Link>

            {canSend && (
              <Link href="/send" onClick={() => setIsMenuOpen(false)}>Send</Link>
            )}

            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link href="/support" onClick={() => setIsMenuOpen(false)}>Support</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>

            <Link href="/quote" onClick={() => setIsMenuOpen(false)}>
              Get Quote
            </Link>
          </div>

        </div>
      </nav>
    </>
  )
}