'use client'

import { ChevronDown } from 'lucide-react'

export default function ScrollArrowDivider() {
  const handleScroll = () => {
    const featured = document.getElementById('featured-section')
    if (featured) {
      featured.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-24 flex flex-col items-center justify-center">
      <button 
        onClick={handleScroll}
        className="flex gap-6 hover:scale-110 transition-transform cursor-pointer group"
      >
        <ChevronDown size={40} strokeWidth={3} className="text-black animate-bounce" />
        <ChevronDown size={40} strokeWidth={3} className="text-black animate-bounce [animation-delay:0.1s]" />
        <ChevronDown size={40} strokeWidth={3} className="text-black animate-bounce [animation-delay:0.2s]" />
      </button>
    </div>
  )
}
