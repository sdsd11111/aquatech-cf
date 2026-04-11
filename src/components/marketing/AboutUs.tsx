'use client'

import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, Zap, Heart, ArrowRight } from 'lucide-react'

export default function AboutUs() {
  const cards = [
    {
      title: "Matriz Regional",
      icon: <MapPin size={32} />,
      points: ["Loja (Matriz Central)", "Malacatos (Riego Ornamental)", "Vilcabamba (Sistemas Premium)", "Yantzaza (Amazonía Industrial)"],
      desc: "Cobertura total en el sur del Ecuador."
    },
    {
      title: "Filosofía Llave en Mano",
      icon: <Zap size={32} />,
      points: ["Diseño Arquitectónico", "Construcción Hidráulica", "Equipamiento de Lujo", "Soporte Post-Venta"],
      desc: "Usted imagina, nosotros construimos."
    },
    {
      title: "Ingeniería de Vanguardia",
      icon: <ShieldCheck size={32} />,
      points: ["Piscinas Residenciales", "Sistemas de Riego", "Potabilización Avanzada", "Tratamiento de Agua"],
      desc: "Certificación de clase mundial."
    },
    {
      title: "Misión Aquatech",
      icon: <Heart size={32} />,
      points: ["Bienestar en el Hogar", "Tecnología Sustentable", "Experiencia de 10+ años", "Compromiso de por vida"],
      desc: "Vender tranquilidad absoluta."
    }
  ]

  return (
    <section className="bg-white py-32 md:py-48 border-t border-gray-100" id="nosotros">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header - Center Aligned Editorial Style */}
        <div className="max-w-[1000px] mb-28">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-1 lg:h-[3px] bg-[#004A87]" />
                <span className="text-[#004A87] text-[14px] font-[900] uppercase tracking-[0.4em]">Propósito y Presencia</span>
            </div>
            <h2 className="text-[42px] md:text-[76px] font-[900] text-black leading-[0.95] tracking-tight mb-10">
                Líderes en el ciclo <br/> 
                <span className="text-[#004A87]">integral del agua.</span>
            </h2>
            <p className="text-[20px] md:text-[24px] text-gray-500 font-[400] max-w-[700px] leading-relaxed">
                Aquatech nace de profesionales con larga trayectoria, consolidando el soporte técnico más avanzado del país con un modelo de boutique de ingeniería.
            </p>
        </div>

        {/* Card Grid - High Gravity Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
           {cards.map((card, idx) => (
             <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-[#f9f9f9] border border-gray-100 p-12 lg:p-16 hover:bg-white hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.12)] transition-all duration-700"
             >
                {/* Visual Label */}
                <div className="text-[#004A87] mb-10 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 origin-left">
                    {card.icon}
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-[26px] font-[900] text-black tracking-tight">{card.title}</h3>
                        <p className="text-[14px] text-gray-400 font-[500] italic">{card.desc}</p>
                    </div>

                    <ul className="grid grid-cols-1 gap-4">
                        {card.points.map((point, i) => (
                            <li key={i} className="flex items-center gap-4 text-[15px] font-[600] text-gray-700">
                                <div className="w-2 h-2 bg-[#004A87]" />
                                {point}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between group-hover:text-[#004A87] transition-colors">
                        <span className="text-[12px] font-[900] uppercase tracking-[0.3em]">Explorar detalle</span>
                        <ArrowRight size={20} className="transform group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Global Slogan - Integrated Authority */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-40 pt-40 border-t border-gray-100 text-center space-y-16"
        >
            <div className="relative inline-block">
                <h3 className="text-[36px] md:text-[60px] font-[900] text-[#004A87] italic tracking-tighter">
                   "El Paraíso en Tu Hogar"
                </h3>
                <div className="absolute -bottom-4 left-0 w-full h-[6px] bg-[#004A87]/10" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                <button className="px-14 py-6 bg-black text-white text-[13px] font-[900] uppercase tracking-[0.4em] hover:bg-[#004A87] transition-all duration-500 rounded-none">
                    Nuestra Historia
                </button>
                <button className="px-14 py-6 bg-white border-2 border-black text-black text-[13px] font-[900] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500 rounded-none">
                    Contactar Experto
                </button>
            </div>
        </motion.div>

      </div>
    </section>
  )
}
