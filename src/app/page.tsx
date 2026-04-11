import type { Metadata } from 'next'
import Hero from '@/components/marketing/Hero'
import FeaturedProduct from '@/components/marketing/FeaturedProduct'
import CategoryGrid from '@/components/marketing/CategoryGrid'
import Footer from '@/components/marketing/Footer'
import ScrollArrowDivider from '@/components/marketing/ScrollArrowDivider'

// metadataBase is required in Next.js 14+ to resolve relative URLs for social sharing
export const metadata: Metadata = {
  metadataBase: new URL('https://aquatech.com.ec'),
  title: 'Aquatech | Piscinas, Hidromasajes y Riego en Loja',
  description: 'Ingeniería hidráulica de vanguardia. Diseñamos y construimos piscinas, saunas y sistemas de riego premium en el sur del Ecuador.',
  keywords: ['piscinas loja', 'hidromasajes ecuador', 'riego automatico loja', 'aquatech', 'saunas ecuador', 'construccion de piscinas'],
  openGraph: {
    title: 'Aquatech | El Paraíso en tu Hogar',
    description: 'Tecnología hidráulica para transformar tu espacio.',
    images: ['/images/jacuzzi-spotlight.png'],
    type: 'website',
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-[#0070C0] selection:text-white">
      {/* Hero Section: Banner Principal (95vh) */}
      <Hero />

      {/* Spacing with Clickable Black Arrows */}
      <ScrollArrowDivider />

      {/* Spacing before next section */}
      <div className="h-20 bg-white" />

      {/* Featured Focus: Horizontal Banner Sin Texto */}
      <FeaturedProduct />

      {/* Service Grid: 2x2 side-by-side (50/50 Squares Rect Borders) */}
      <CategoryGrid />

      {/* Espaciador de Seguridad */}
      <div className="h-40 bg-white" />

      {/* Footer */}
      <Footer />
    </main>
  )
}
