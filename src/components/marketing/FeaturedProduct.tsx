'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FeaturedProduct() {
  return (
    <section className="bg-black py-32 px-10 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <span className="text-[#f5f5f7] text-[17px] font-[600] tracking-widest uppercase mb-4 block">
          Aquatech [News]
        </span>
        <h2 className="text-white text-[56px] md:text-[80px] font-[700] tracking-tighter leading-none mb-4">
          PRO
        </h2>
        <p className="text-[#86868b] text-[19px] md:text-[24px] font-[500] max-w-2xl mx-auto">
          El siguiente paso en innovación hídrica y diseño inteligente.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="relative w-full max-w-[1000px] aspect-square md:aspect-[16/10] overflow-hidden rounded-[40px] shadow-2xl"
      >
        <Image 
          src="https://cesarweb.b-cdn.net/home/s.jpg" 
          alt="Aquatech Pro" 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <div className="absolute bottom-12 inset-x-0 flex justify-center">
             <Link href="/productos/pro" className="bg-white text-black px-10 py-4 rounded-full text-[17px] font-[600] hover:scale-105 transition-transform shadow-lg">
                Más información
             </Link>
        </div>
      </motion.div>
    </section>
  )
}
