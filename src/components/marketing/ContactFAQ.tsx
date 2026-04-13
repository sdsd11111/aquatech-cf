'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Navigation, Info, Search } from 'lucide-react'

// Dynamic import for Leaflet (No SSR)
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando Ecuador...</div>
})

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const locations = [
    {
      id: 0,
      name: "Matriz principal Loja",
      address: "Av. Salvador Bustamante Celi",
      city: "Loja, Ecuador",
      lat: -3.9931,
      lng: -79.2042,
      link: "https://maps.app.goo.gl/Vg2MnWtjjGtWmuxZ7"
    },
    {
      id: 1,
      name: "Sucursal Vilcabamba",
      address: "San Joaquín, Calle Principal",
      city: "Loja, Ecuador",
      lat: -4.2625,
      lng: -79.2228,
      link: "https://maps.app.goo.gl/aEwmp8TZ439LjB4B7"
    },
    {
      id: 2,
      name: "Sucursal Malacatos",
      address: "Valle de Malacatos",
      city: "Loja, Ecuador",
      lat: -4.2238,
      lng: -79.2561,
      link: "https://maps.app.goo.gl/h9hQpTDxu6exDvX48"
    },
    {
      id: 3,
      name: "Sucursal Yantzaza",
      address: "Amazonía Ecuatoriana",
      city: "Zamora Chinchipe, Ecuador",
      lat: -3.8291,
      lng: -78.7610,
      link: "https://maps.app.goo.gl/XDFYbd5ewy5DFkXL9"
    }
  ]

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const faqs = [
    {
      question: "¿Realizan proyectos fuera de la provincia de Loja?",
      answer: "Sí, realizamos envíos de equipos a todo el Ecuador y ejecutamos proyectos de ingeniería hidráulica a nivel nacional con soporte técnico certificado."
    },
    {
      question: "¿Qué garantía ofrecen en la construcción de piscinas?",
      answer: "Nuestras construcciones cuentan con garantía estructural y de impermeabilización extendida. Además, los equipos técnicos (bombas, filtros) tienen respaldo directo de marca alemana."
    },
    {
      question: "¿Ofrecen asesoría técnica personalizada?",
      answer: "Absolutamente. Contamos con un equipo de ingenieros expertos que le acompañarán desde el diseño conceptual hasta la puesta en marcha de su sistema de riego, piscina o spa."
    },
    {
      question: "¿Cuáles son sus formas de pago?",
      answer: "Aceptamos todas las tarjetas de crédito, transferencias bancarias y planes de financiamiento directo para proyectos integrales."
    },
    {
      question: "¿Cómo puedo solicitar un presupuesto para un proyecto a medida?",
      answer: "Puede solicitar una visita técnica o cotización directamente a través de nuestro botón de WhatsApp o visitando cualquiera de nuestras agencias. Entregamos propuestas detalladas en menos de 48 horas."
    }
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .c-section { background-color: #FFFFFF; padding-top: 48px; padding-bottom: 64px; border-top: 1px solid #EEEEEE; }
        .c-wrapper { max-width: 1440px; margin: 0 auto; padding: 0 20px; }
        .c-main-grid { display: flex; flex-direction: column; gap: 40px; align-items: stretch; }
        .c-heading-group { order: 2; margin-bottom: 24px; }
        .c-heading { font-size: 36px; font-weight: 900; color: #000000; margin-bottom: 0px; }
        
        .c-locator-grid { display: flex; flex-direction: column; position: relative; }
        .c-map { order: 1; position: relative; overflow: hidden; background-color: #F9FAFB; height: 400px; border: 1px solid #E5E7EB; margin-bottom: 1px; }
        .c-info-box { background-color: white; padding: 16px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 1px solid #EEEEEE; width: 100%; order: 1.5; margin-bottom: 8px; }
        .c-search-bar { order: 3; background-color: #111827; padding: 16px; display: flex; flex-direction: column; align-items: stretch; gap: 12px; border: 1px solid #000; margin-bottom: -1px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .c-sidebar { order: 4; overflow-y: auto; background-color: #FFFFFF; border: 1px solid #E5E7EB; max-height: 300px; }

        .c-search-input { width: 100%; flex: 1; }
        .c-search-btn { width: 100%; }

        @media (min-width: 1024px) {
          .c-section { padding-top: 100px; padding-bottom: 120px; }
          .c-wrapper { padding: 0 40px; }
          .c-main-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 60px; }
          
          .c-heading-group { order: 1; margin-bottom: 40px; }
          .c-heading { font-size: 48px; }
          
          .c-locator-grid { 
            display: grid; 
            grid-template-columns: 1fr 2.5fr; 
            grid-template-areas: 
              "search search"
              "sidebar map";
          }
          
          .c-search-bar { grid-area: search; flex-direction: row; align-items: center; padding: 24px; gap: 16px; order: unset; }
          .c-search-input { width: auto; }
          .c-search-btn { width: auto; }
          
          .c-sidebar { grid-area: sidebar; border-top: none; border-right: none; max-height: 680px; order: unset; }
          .c-map { grid-area: map; height: 100%; min-height: 680px; border-top: none; order: unset; margin-bottom: 0; }
          .c-info-box { position: absolute; top: 20px; right: 20px; width: auto; max-width: 220px; z-index: 1000; margin-bottom: 0; order: unset; }
        }
      `}} />
    <section id="agencias-faq" className="c-section">
      <div className="c-wrapper">
        <div className="c-main-grid">
          
          {/* --- COLUMN 1: STORE LOCATOR --- */}
          <div className="c-locator-grid-parent" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="c-heading-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ width: '32px', height: '2px', backgroundColor: '#004A87' }} />
                 <span className="font-brand" style={{ fontSize: '11px', fontWeight: '900', color: '#004A87', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
                    Nuestras Agencias
                 </span>
              </div>
              
              <h2 className="font-brand c-heading">
                Encuéntranos
              </h2>
            </div>

            <div className="c-locator-grid">

              {/* Functional Search Bar */}
              <div className="c-search-bar">
                <Search size={20} color="#6B7280" />
                <input 
                  type="text" 
                  placeholder="Busca por ciudad o nombre de sede..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="c-search-input"
                  style={{
                    padding: '14px 18px',
                    border: '1px solid #374151',
                    borderRadius: '0px',
                    fontSize: '15px',
                    outline: 'none',
                    backgroundColor: '#1F2937',
                    color: 'white',
                    fontWeight: '500'
                  }}
                />
                <button className="c-search-btn hover:bg-[#0070C0] transition-colors" style={{
                  backgroundColor: '#004A87',
                  color: 'white',
                  padding: '14px 32px',
                  border: 'none',
                  borderRadius: '0px',
                  fontWeight: '900',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}>
                  Buscar
                </button>
              </div>
              
              {/* Sidebar List - Dynamic filtering */}
              <div className="c-sidebar">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => (
                    <div 
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      style={{
                        padding: '28px 20px',
                        borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer',
                        backgroundColor: selectedLocation === loc.id ? '#F9FAFB' : 'transparent',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      {selectedLocation === loc.id && (
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#004A87' }} />
                      )}
                      <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#111827', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{loc.name}</h4>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 16px 0', lineHeight: '1.4' }}>{loc.address}</p>
                      
                      <a 
                        href={loc.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '10px', fontWeight: '900', color: '#004A87', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                        className="hover:underline"
                      >
                        Ver en Google Maps 
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Navigation size={8} />
                        </motion.div>
                      </a>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                    No se encontraron sedes con ese nombre.
                  </div>
                )}
              </div>

              {/* Map Holder */}
              <div className="c-map">
                <MapComponent locations={locations} selectedId={selectedLocation} />
              </div>

              {/* Visual Label - Responsive box */}
              <div className="c-info-box">
                 <div style={{ fontSize: '10px', fontWeight: '900', color: '#004A87', marginBottom: '4px', textTransform: 'uppercase' }}>Sede Activa</div>
                 <div style={{ fontSize: '13px', fontWeight: '900', color: '#111827' }}>
                   {selectedLocation !== null ? locations.find(l => l.id === selectedLocation)?.name : "Nacional - Ecuador"}
                 </div>
                 <div style={{ fontSize: '11px', color: '#BBB', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <Info size={10} /> {selectedLocation !== null ? "Haz clic en el pin para ir a Google" : "Selecciona una sede para ver detalle"}
                 </div>
              </div>
            </div>
          </div>

          {/* --- COLUMN 2: FAQ --- */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
               <div style={{ width: '32px', height: '2px', backgroundColor: '#004A87' }} />
               <span className="font-brand" style={{ fontSize: '11px', fontWeight: '900', color: '#004A87', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
                  FAQ
               </span>
            </div>
            
            <h2 className="font-brand c-heading">
              Preguntas Frecuentes
            </h2>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EEEEEE',
                    }}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '24px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#111827' }}>
                        {faq.question}
                      </span>
                      {openIndex === idx ? <Minus size={18} color="#004A87" /> : <Plus size={18} color="#000" />}
                    </button>
                    
                    <AnimatePresence>
                      {openIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div style={{ padding: '0 20px 24px 20px', fontSize: '14px', color: '#4B5563', lineHeight: '1.6' }}>
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Support Card */}
              <div style={{ 
                marginTop: 'auto', 
                padding: '40px', 
                backgroundColor: '#004A87', 
                color: 'white'
              }}>
                <h4 className="font-brand" style={{ fontSize: '20px', fontWeight: '900', marginBottom: '12px' }}>
                  ¿Necesita soporte?
                </h4>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', lineHeight: '1.5' }}>
                  Ingenieros expertos listos para brindarle soluciones.
                </p>
                <button style={{
                  backgroundColor: 'white',
                  color: '#004A87',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '0px',
                  fontWeight: '900',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}>
                  WhatsApp Técnico
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  )
}
