'use client'

import { useEffect, useState } from 'react'

export default function TranslationLoader({ children }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const lang = localStorage.getItem('lang')

    // English = no need to translate
    if (!lang || lang === 'en') {
      setReady(true)
      return
    }

    let attempts = 0

    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo')

      if (select) {
        select.value = lang
        select.dispatchEvent(new Event('change'))

        clearInterval(interval)

        // small delay so translation finishes
        setTimeout(() => {
          setReady(true)
        }, 1200)
      }

      attempts++

      // stop trying after 10 attempts
      if (attempts > 10) {
        clearInterval(interval)
        setReady(true)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {!ready && (
        <div className="translate-loader">
          🌐 Preparing your language...
        </div>
      )}

      <div style={{ visibility: ready ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  )
}