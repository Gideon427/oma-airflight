import '../css/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import GoogleTranslateProvider from '@/components/GoogleTranslateProvider'
import TranslationLoader from '@/components/TranslationLoader' // ✅ new
import 'core-js/stable'
import 'regenerator-runtime/runtime'

export const metadata = {
  title: 'SwiftShip - Fast & Reliable Shipping',
  description: 'Track, send, and manage packages with our shipping service',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* Load translation system */}
        <GoogleTranslateProvider />

        {/* Handle no-flicker logic */}
        <TranslationLoader>
          <Navbar />
          <main>{children}</main>
          <WhatsAppButton />
          <Footer />
        </TranslationLoader>

      </body>
    </html>
  )
}