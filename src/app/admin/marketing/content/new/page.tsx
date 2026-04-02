'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createContentPipelineAction } from '@/actions/marketing'

export default function NewPipelinePage() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    setError('')

    const result = await createContentPipelineAction(idea, context)
    
    if (result.success && result.pipelineId) {
      router.push(`/admin/marketing/content/${result.pipelineId}`)
    } else {
      setError(result.error || 'Ocurrió un error inesperado al conectar con GROQ.')
      setLoading(false)
    }
  }

  return (
    <div className="new-pipeline-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <button 
        onClick={() => router.back()} 
        className="btn btn-outline-secondary mb-4"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver
      </button>

      <div className="card shadow-sm p-5" style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
          Nueva Idea de Contenido
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Ingresa la temática general. La Inteligencia Artificial analizará la intención de búsqueda y te propondrá 5 opciones de títulos SEO ganadores para arrancar la maquinaria.
        </p>

        {error && (
          <div className="alert alert-danger mb-4" style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="idea" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
              ¿De qué quieres hablar? (Tema Principal) *
            </label>
            <input 
              type="text" 
              id="idea" 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ej: Bombas de calor para piscinas en clima frío"
              disabled={loading}
              required
              className="form-control"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--app-bg)', color: 'var(--text-color)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="context" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
              Contexto Adicional (Opcional)
            </label>
            <textarea 
              id="context" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ej: Concéntrate en el ahorro de energía y el modelo SPIN. Útil para clientes de la sierra ecuatoriana."
              disabled={loading}
              rows={4}
              className="form-control"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--app-bg)', color: 'var(--text-color)', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !idea.trim()}
            className="btn btn-primary w-100"
            style={{ 
              padding: '1rem', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Generando Opciones SEO con IA...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Generar Títulos (H1)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
