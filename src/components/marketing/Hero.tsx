'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    image: 'https://cesarweb.b-cdn.net/home/hero-slider-1.webp',
    mobileImage: 'https://cesarweb.b-cdn.net/home/hero-mobile-1.webp',
    title: 'Construye hoy,',
    highlight: 'disfruta siempre.',
    promo: 'Difiérelo a 12 meses',
    gracia: '+6 meses de gracia',
  },
  {
    image: 'https://cesarweb.b-cdn.net/home/hero-slider-2.webp',
    mobileImage: 'https://cesarweb.b-cdn.net/home/hero-mobile-2.webp',
    title: 'El arte del',
    highlight: 'agua en movimiento.',
    promo: 'Piletas & Cascadas Pro',
    gracia: 'Ingeniería de Vanguardia',
  },
  {
    image: 'https://cesarweb.b-cdn.net/home/hero-slider-3.webp',
    mobileImage: 'https://cesarweb.b-cdn.net/home/hero-mobile-3.webp',
    title: 'Tu paraíso',
    highlight: 'de relajación.',
    promo: 'Hidromasajes Premium',
    gracia: 'Tecnología Apple-Style',
  }
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative w-full h-[100vh] bg-black overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={slides[index].mobileImage} />
            <Image 
              src={slides[index].image} 
              alt="Aquatech Slide" 
              fill 
              className="object-cover object-center"
              priority
            />
          </picture>
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full w-full px-6 md:px-20 flex flex-col justify-end pb-32 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl"
          >
            <h1 className="text-white text-[48px] md:text-[80px] lg:text-[100px] font-[700] tracking-tighter leading-[0.9] mb-8">
              {slides[index].title} <br />
              <span className="text-white/70">{slides[index].highlight}</span>
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-white text-black px-8 py-4 rounded-full text-[17px] font-[600] cursor-pointer hover:bg-white/90 transition-all">
                {slides[index].promo}
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-[17px] font-[600]">
                {slides[index].gracia}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control UI */}
      <div className="absolute bottom-12 left-6 md:left-20 flex items-center gap-6 z-20">
        <div className="flex gap-2">
            <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all">
                <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all">
                <ChevronRight size={24} />
            </button>
        </div>
        
        <div className="flex gap-3">
            {slides.map((_, i) => (
            <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                index === i ? 'w-12 bg-white' : 'w-4 bg-white/30'
                }`}
            />
            ))}
        </div>
      </div>
    </section>
  )
}
