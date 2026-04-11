'use client'

import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    title: 'Nuestros locales',
    subtitle: 'Loja • Zamora • Machala',
    image: 'https://cesarweb.b-cdn.net/home/locales-lifestyle.webp',
    link: '/tiendas',
  },
  {
    title: 'Hidromasajes',
    subtitle: 'El paraíso de la relajación',
    image: 'https://cesarweb.b-cdn.net/home/hidromasaje-card.webp',
    link: '/productos/jacuzzis',
  },
  {
    title: 'Piletas & Cascadas',
    subtitle: 'El arte del agua en movimiento',
    image: 'https://cesarweb.b-cdn.net/home/piletas-card.webp',
    link: '/servicios/piletas',
  },
  {
    title: 'Insumos',
    subtitle: 'Ingeniería técnica y mantenimiento',
    image: 'https://cesarweb.b-cdn.net/home/accesorios-card.webp',
    link: '/servicios/accesorios',
  }
]

export default function CategoryGrid() {
  return (
    <section className="bg-white py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-32 w-full">
        {categories.map((cat, i) => (
          <div 
            key={i}
            className="flex flex-col items-center w-full"
          >
            {/* Rectangular Image Container - 50/50 Full Width per column */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f5f5f7]">
                <Image 
                    src={cat.image} 
                    alt={cat.title} 
                    fill
                    className="object-cover"
                />
            </div>
            
            {/* Text Outside - Centered below */}
            <div className="text-center mt-12 px-6 max-w-2xl">
                <h3 className="text-[#1d1d1f] text-[32px] md:text-[42px] font-[700] tracking-tight mb-2 uppercase">
                    {cat.title}
                </h3>
                <p className="text-[#86868b] text-[18px] md:text-[22px] font-[400] mb-8">
                    {cat.subtitle}
                </p>
                <Link href={cat.link} className="bg-black text-white px-10 py-4 text-[14px] font-[600] uppercase tracking-widest hover:bg-gray-800 transition-all">
                    Explorar ahora
                </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
