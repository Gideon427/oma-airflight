'use client'

import { useEffect } from 'react'

export default function TranslationLoader({ children }) {
  useEffect(() => {
    const lang = localStorage.getItem('lang')

    // If English, no translation needed
    if (!lang || lang === 'en') return

    let attempts = 0

    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo')

      if (select) {
        select.value = lang
        select.dispatchEvent(new Event('change'))
        clearInterval(interval)
      }

      attempts++
      if (attempts > 10) clearInterval(interval)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Simply render children – no loader, no visibility delay
  return <>{children}</>
}