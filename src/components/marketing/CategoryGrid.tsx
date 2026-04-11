'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    title: 'Nuestros locales',
    subtitle: 'Loja • Zamora • Machala',
    image: 'https://cesarweb.b-cdn.net/home/locales-lifestyle.webp',
    link: '/tiendas',
    darkText: false
  },
  {
    title: 'Hidromasajes',
    subtitle: 'El paraíso de la relajación',
    image: 'https://cesarweb.b-cdn.net/home/hidromasaje-card.webp',
    link: '/productos/jacuzzis',
    darkText: true
  },
  {
    title: 'Piletas',
    subtitle: 'El arte del agua en movimiento',
    image: 'https://cesarweb.b-cdn.net/home/piletas-card.webp',
    link: '/servicios/piletas',
    darkText: false
  },
  {
    title: 'Insumos',
    subtitle: 'Ingeniería técnica y mantenimiento',
    image: 'https://cesarweb.b-cdn.net/home/accesorios-card.webp',
    link: '/servicios/accesorios',
    darkText: true
  }
]

export default function CategoryGrid() {
  return (
    <section className="bg-[#f5f5f7] py-4 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[2000px] mx-auto">
        {categories.map((cat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="relative aspect-square md:aspect-auto md:h-[700px] lg:h-[800px] w-full bg-white rounded-[28px] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-700"
          >
            {/* Background Image */}
            <Image 
              src={cat.image} 
              alt={cat.title} 
              fill
              className="object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
            />
            
            {/* Overlay Gradient for readability */}
            <div className={`absolute inset-0 ${cat.darkText ? 'bg-black/[0.02]' : 'bg-black/10'}`} />

            {/* Content */}
            <div className="absolute inset-x-0 top-16 text-center px-10 z-10">
              <h3 className={`text-[32px] md:text-[48px] font-[700] tracking-tight mb-2 leading-tight ${cat.darkText ? 'text-[#1d1d1f]' : 'text-white'}`}>
                {cat.title}
              </h3>
              <p className={`text-[19px] md:text-[21px] font-[400] mb-8 ${cat.darkText ? 'text-[#86868b]' : 'text-white/90'}`}>
                {cat.subtitle}
              </p>
              
              <div className="flex justify-center gap-4">
                <Link 
                  href={cat.link}
                  className={`px-7 py-3 rounded-full text-[15px] font-[600] transition-all
                    ${cat.darkText 
                      ? 'bg-[#0071e3] text-white hover:bg-[#0077ed]' 
                      : 'bg-white text-black hover:bg-gray-100'}`}
                >
                  Más información
                </Link>
                <Link 
                  href={cat.link}
                  className={`px-7 py-3 rounded-full text-[15px] font-[600] border transition-all
                    ${cat.darkText 
                      ? 'border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white' 
                      : 'border-white text-white hover:bg-white hover:text-black'}`}
                >
                  Comprar
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
