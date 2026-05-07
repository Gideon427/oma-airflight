'use client'

import { useState, useEffect, useRef } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'tr', name: 'Türkçe', flag: 'https://flagcdn.com/w40/tr.png' },
  { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w40/de.png' },
  { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w40/sa.png' },
  { code: 'ru', name: 'Русский', flag: 'https://flagcdn.com/w40/ru.png' },

  { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w40/it.png' },
  { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/w40/pt.png' },
  { code: 'zh-CN', name: '中文', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w40/jp.png' },
  { code: 'ko', name: '한국어', flag: 'https://flagcdn.com/w40/kr.png' },
  { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'nl', name: 'Nederlands', flag: 'https://flagcdn.com/w40/nl.png' },
  { code: 'pl', name: 'Polski', flag: 'https://flagcdn.com/w40/pl.png' },
  { code: 'uk', name: 'Українська', flag: 'https://flagcdn.com/w40/ua.png' },
  { code: 'sv', name: 'Svenska', flag: 'https://flagcdn.com/w40/se.png' },
  { code: 'no', name: 'Norsk', flag: 'https://flagcdn.com/w40/no.png' },
  { code: 'da', name: 'Dansk', flag: 'https://flagcdn.com/w40/dk.png' },
  { code: 'fi', name: 'Suomi', flag: 'https://flagcdn.com/w40/fi.png' },
  { code: 'el', name: 'Ελληνικά', flag: 'https://flagcdn.com/w40/gr.png' },
  { code: 'he', name: 'עברית', flag: 'https://flagcdn.com/w40/il.png' },
  { code: 'th', name: 'ไทย', flag: 'https://flagcdn.com/w40/th.png' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'https://flagcdn.com/w40/vn.png' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
  { code: 'ms', name: 'Bahasa Melayu', flag: 'https://flagcdn.com/w40/my.png' },
  { code: 'ro', name: 'Română', flag: 'https://flagcdn.com/w40/ro.png' },
  { code: 'hu', name: 'Magyar', flag: 'https://flagcdn.com/w40/hu.png' },
  { code: 'cs', name: 'Čeština', flag: 'https://flagcdn.com/w40/cz.png' },
  { code: 'sk', name: 'Slovenčina', flag: 'https://flagcdn.com/w40/sk.png' },

  // ===== EXTRA 30+ LANGUAGES =====
  { code: 'bg', name: 'Български', flag: 'https://flagcdn.com/w40/bg.png' },
  { code: 'hr', name: 'Hrvatski', flag: 'https://flagcdn.com/w40/hr.png' },
  { code: 'sr', name: 'Српски', flag: 'https://flagcdn.com/w40/rs.png' },
  { code: 'sl', name: 'Slovenščina', flag: 'https://flagcdn.com/w40/si.png' },
  { code: 'et', name: 'Eesti', flag: 'https://flagcdn.com/w40/ee.png' },
  { code: 'lv', name: 'Latviešu', flag: 'https://flagcdn.com/w40/lv.png' },
  { code: 'lt', name: 'Lietuvių', flag: 'https://flagcdn.com/w40/lt.png' },
  { code: 'ca', name: 'Català', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'eu', name: 'Euskara', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'gl', name: 'Galego', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'af', name: 'Afrikaans', flag: 'https://flagcdn.com/w40/za.png' },
  { code: 'sw', name: 'Kiswahili', flag: 'https://flagcdn.com/w40/ke.png' },
  { code: 'bn', name: 'বাংলা', flag: 'https://flagcdn.com/w40/bd.png' },
  { code: 'ur', name: 'اردو', flag: 'https://flagcdn.com/w40/pk.png' },
  { code: 'fa', name: 'فارسی', flag: 'https://flagcdn.com/w40/ir.png' },
  { code: 'ta', name: 'தமிழ்', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'te', name: 'తెలుగు', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'ml', name: 'മലയാളം', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'my', name: 'မြန်မာ', flag: 'https://flagcdn.com/w40/mm.png' },
  { code: 'km', name: 'ខ្មែរ', flag: 'https://flagcdn.com/w40/kh.png' },
  { code: 'lo', name: 'ລາວ', flag: 'https://flagcdn.com/w40/la.png' },
  { code: 'ka', name: 'ქართული', flag: 'https://flagcdn.com/w40/ge.png' },
  { code: 'am', name: 'አማርኛ', flag: 'https://flagcdn.com/w40/et.png' },
  { code: 'is', name: 'Íslenska', flag: 'https://flagcdn.com/w40/is.png' },
  { code: 'ga', name: 'Gaeilge', flag: 'https://flagcdn.com/w40/ie.png' },
  { code: 'mt', name: 'Malti', flag: 'https://flagcdn.com/w40/mt.png' },
  { code: 'cy', name: 'Cymraeg', flag: 'https://flagcdn.com/w40/gb.png' }
]

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')

  const dropdownRef = useRef(null)

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en'
    setCurrentLang(savedLang)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const changeLanguage = (langCode) => {
    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo')

      if (select) {
        select.value = langCode
        select.dispatchEvent(new Event('change'))

        localStorage.setItem('lang', langCode)
        setCurrentLang(langCode)
        setIsOpen(false)

        clearInterval(interval)
      }
    }, 300)

    setTimeout(() => clearInterval(interval), 5000)
  }

  const current =
    languages.find((l) => l.code === currentLang) || languages[0]

  return (
    <div className="lang-dropdown" ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        className="lang-btn"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((prev) => !prev)
        }}
      >
        <img
          src={current.flag}
          alt={current.name}
          className="lang-flag"
          draggable="false"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="lang-menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-item ${
                currentLang === lang.code ? 'active' : ''
              }`}
              onClick={() => changeLanguage(lang.code)}
            >
              <img
                src={lang.flag}
                alt={lang.name}
                className="lang-flag"
                draggable="false"
              />

              <span>{lang.name}</span>

              {currentLang === lang.code && (
                <span className="check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}