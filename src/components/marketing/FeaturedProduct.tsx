'use client'

import Image from 'next/image'

export default function FeaturedProduct() {
  return (
    <section id="featured-section" className="bg-black w-full pb-20">
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <Image 
          src="https://cesarweb.b-cdn.net/home/s.jpg" 
          alt="Aquatech Pro Banner" 
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  )
}
