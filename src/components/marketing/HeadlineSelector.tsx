'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { selectHeadlineAction } from '@/actions/marketing'

export default function HeadlineSelector({ pipeline }: { pipeline: any }) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const options = pipeline.headlineOptions || []

  const handleConfirm = async () => {
    if (!selectedId) return

    setLoading(true)
    setError('')

    const res = await selectHeadlineAction(pipeline.id, selectedId)
    if (res.success) {
      router.refresh()
    } else {
      setError(res.error || 'Error al guardar el título.')
      setLoading(false)
    }
  }

  if (options.length === 0) {
    return (
      <div className="alert alert-warning">
        No se generaron opciones de título. Por favor, intenta crear una nueva idea.
      </div>
    )
  }

  return (
    <div className="card shadow-sm p-4" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
        Selecciona el Título Principal (H1)
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        La IA ha generado las siguientes opciones optimizadas para SEO. El artículo pilar se redactará basándose en el título que elijas.
      </p>

      {error && (
        <div className="alert alert-danger mb-4" style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {options.map((opt: any) => (
          <label 
            key={opt.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem', 
              padding: '1rem', 
              border: selectedId === opt.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
              borderRadius: '8px',
              background: selectedId === opt.id ? 'rgba(8, 145, 178, 0.05)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <input 
              type="radio" 
              name="headline" 
              value={opt.id} 
              checked={selectedId === opt.id}
              onChange={() => setSelectedId(opt.id)}
              disabled={loading}
              style={{ marginTop: '0.3rem', width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary-color)' }}
            />
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '1.1rem' }}>
                {opt.headline}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Keyword focal: <strong style={{ color: 'var(--primary-color)' }}>{opt.keyword}</strong>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={{ textAlign: 'right' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleConfirm}
          disabled={!selectedId || loading}
          style={{ 
            padding: '0.8rem 2rem', 
            fontSize: '1rem', 
            fontWeight: '600', 
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Generando Artículo Pilar (Tardará 1-2 min)...
            </>
          ) : (
            <>
              Continuar y Generar Artículo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </button>
      </div>

    </div>
  )
}
