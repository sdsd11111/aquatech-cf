'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, UploadCloud, CheckCircle2, Loader2, Info } from 'lucide-react'

export interface DynamicFormProps {
  categoryName: string;
  whatsappNumber?: string;
  showDimensions?: boolean;
  showReferences?: boolean;
}

export default function DynamicQuoteForm({ 
  categoryName, 
  whatsappNumber = '59300000000', // Default fallback si no se pasa uno
  showDimensions = true, 
  showReferences = true 
}: DynamicFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    dimensions: '',
    details: ''
  })

  // Manejo de carga de archivos (Sube al API que conecta con Bunny.net)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })

      const json = await res.json()
      if (res.ok) {
        setUploadedUrl(json.url)
      } else {
        alert("Hubo un error subiendo el archivo: " + json.error)
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión al cargar la referencia.")
    } finally {
      setLoading(false)
    }
  }

  // Generador del Mensaje de WhatsApp
  const handleWhatsAppSend = () => {
    if(!formData.name || !formData.location) {
        alert("Por favor ingresa al menos tu nombre y ciudad.");
        return;
    }

    let message = `*Cotización: ${categoryName}*\n\n`
    message += `Hola Ingeniería Aquatech. Soy ${formData.name} desde la ciudad de ${formData.location}.\n\n`
    
    if (showDimensions && formData.dimensions) {
      message += `📏 *Medidas/Área:* ${formData.dimensions}\n`
    }
    if (formData.details) {
      message += `📝 *Detalles:* ${formData.details}\n`
    }
    if (uploadedUrl) {
      message += `📸 *Referencia Arquitectónica adjunta:* ${uploadedUrl}\n`
    }
    
    message += `\nQuedo atento a su asesoría técnica.`

    const wpUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(wpUrl, '_blank')
  }

  return (
    <div className="w-full bg-white p-0">
      <style jsx>{`
        .square-input {
          border-radius: 0px !important;
          border: 1px solid #E5E7EB;
          background-color: white;
          color: black;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 16px 20px;
          outline: none;
          transition: all 0.3s ease;
          width: 100%;
        }
        .square-input:focus { border-color: #004A87; }
        .square-input::placeholder { color: #9CA3AF; }
        .btn-aquatech {
          border-radius: 0px !important;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 900;
          font-size: 11px;
          padding: 20px;
          width: 100%;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          font-family: var(--font-brand) !important;
        }
        h3, span { font-family: var(--font-brand); }
        label, input, textarea, p { font-family: var(--font-body); }
      `}</style>

      <div className="mb-10 text-center md:text-left">
         <span className="text-[#004A87] font-black uppercase tracking-[0.4em] text-[9px] mb-2 block">Cotización Dinámica</span>
         <h3 className="text-xl md:text-3xl font-black text-black tracking-tighter uppercase leading-tight mb-3">
           Ingeniería<br />para {categoryName}
         </h3>
         <p className="text-gray-400 text-[10px] md:text-[11px] font-medium leading-relaxed">Configura los parámetros técnicos de tu proyecto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
           <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2 flex items-center gap-2">Nombre del Cliente <span className="text-[#004A87]">*</span></label>
           <input type="text" className="square-input" placeholder="INGRESA TU NOMBRE" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
           <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2 flex items-center gap-2">Ciudad / Ubicación <span className="text-[#004A87]">*</span></label>
           <input type="text" className="square-input" placeholder="EJ: QUITO, VALLE DE CUMBAYÁ" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>
      </div>

      {showDimensions && (
        <div className="mb-6">
           <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2 flex items-center justify-between">
              <span>Medidas o Área Estimada</span>
              <span className="text-gray-400 font-normal tracking-normal lowercase">(opcional)</span>
           </label>
           <input type="text" className="square-input" placeholder="EJ: 2M X 2M O 15 METROS CUADRADOS" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} />
        </div>
      )}

      {showReferences && (
        <div className="mb-6">
           <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2">Imagen de Referencia o Plano</label>
           <div className={`border-2 border-dashed ${uploadedUrl ? 'border-[#004A87] bg-[#004A87]/5' : 'border-gray-200 bg-white'} p-6 flex flex-col items-center justify-center relative transition-all`}>
              <input 
                 type="file" 
                 accept="image/*,.pdf" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                 onChange={handleFileUpload}
                 disabled={loading}
              />
              {loading ? (
                 <div className="flex flex-col items-center text-[#004A87]">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Asegurando archivo...</span>
                 </div>
              ) : uploadedUrl ? (
                 <div className="flex flex-col items-center text-[#004A87]">
                    <CheckCircle2 size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#004A87]">Referencia Cargada Exitosamente</span>
                    <span className="text-[8px] text-gray-500 mt-2 tracking-widest uppercase">Haz clic para cambiar de imagen</span>
                 </div>
              ) : (
                 <div className="flex flex-col items-center text-gray-400">
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black">Cargar Archivo al Servidor</span>
                    <span className="text-[8px] font-medium tracking-widest uppercase mt-2">Formatos: JPG, PNG, WEBP, PDF (Max 5MB)</span>
                 </div>
              )}
           </div>
        </div>
      )}

      <div className="mb-8">
         <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2 text-left">Detalles adicionales del Proyecto</label>
         <textarea className="square-input min-h-[100px] resize-none" placeholder="CUÉNTANOS MÁS SOBRE MATERIALES, ESTÉTICA O PLAZOS..." value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}></textarea>
      </div>

      <button 
        onClick={handleWhatsAppSend}
        className="btn-aquatech bg-black text-white hover:bg-[#004A87]"
      >
        Enviar Solicitud al Experto <Send size={16} />
      </button>

      <div className="mt-4 flex items-start gap-2 justify-center text-gray-400">
        <Info size={12} className="shrink-0 mt-0.5" />
        <p className="text-[8px] uppercase tracking-widest leading-relaxed text-center">La información y archivos serán canalizados directamente a nuestra terminal de ingeniería vía WhatsApp de forma segura.</p>
      </div>
    </div>
  )
}
