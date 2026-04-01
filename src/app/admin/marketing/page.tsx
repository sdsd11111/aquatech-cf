'use client'

import React from 'react'

export default function MarketingPage() {
  return (
    <div className="marketing-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Módulo de Marketing</h1>
          <p className="page-description">Gestiona tus campañas, leads y estrategias de marketing desde aquí.</p>
        </div>
      </div>

      <div className="marketing-content" style={{ marginTop: '2rem' }}>
        <div className="grid-container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {/* Tarjetas de ejemplo - Antigravity las expandirá en la nueva ventana */}
          <div className="card shadow-sm p-4" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Campañas</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configura y monitorea tus campañas de marketing activas.</p>
            <div style={{ marginTop: '1rem', height: '4px', background: 'var(--border-color)', borderRadius: '2px' }}>
              <div style={{ width: '45%', height: '100%', background: 'var(--primary-color)', borderRadius: '2px' }}></div>
            </div>
          </div>

          <div className="card shadow-sm p-4" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>Leads / Clientes Potenciales</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Visualiza y segmenta tus leads capturados recientemente.</p>
            <button className="btn btn-outline-primary w-100" style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid var(--primary-color)', background: 'none', color: 'var(--primary-color)', borderRadius: '6px', cursor: 'pointer' }}>
              Ver Todos
            </button>
          </div>

          <div className="card shadow-sm p-4" style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#10b981' }}>WhatsApp Marketing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Automatización y envíos masivos por WhatsApp.</p>
            <div className="badge" style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', marginTop: '1rem' }}>
              ACTIVO
            </div>
          </div>

          <div className="card shadow-sm p-4" onClick={() => window.location.href='/admin/blog'} style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } } as React.CSSProperties}>
            <h3 style={{ marginBottom: '0.5rem', color: '#eab308' }}>Gestor de Blog (SEO)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Redacta, previsualiza y publica artículos para el portal público.</p>
            <button className="btn btn-outline-primary w-100" style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid #eab308', background: 'none', color: '#eab308', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>
              Administrar Blog
            </button>
          </div>
        </div>

        <div style={{ 
          marginTop: '3rem', 
          padding: '4rem', 
          textAlign: 'center', 
          background: 'rgba(var(--primary-rgb), 0.05)', 
          borderRadius: '20px', 
          border: '2px dashed var(--border-color)' 
        }}>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Listo para despegar 🚀</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Este es el punto de partida de tu nuevo módulo. Abre una nueva ventana de Antigravity y dile: 
            <br />
            <strong>"Desarrollemos las herramientas de Marketing en este archivo"</strong>.
          </p>
        </div>
      </div>

      <style jsx>{`
        .marketing-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }
        .page-description {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
