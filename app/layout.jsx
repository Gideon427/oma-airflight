import '../css/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
//import Blog from '@/components/Blog'

export const metadata = {
  title: 'SwiftShip - Fast & Reliable Shipping',
  description: 'Track, send, and manage packages with our shipping service',
}

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  )
}