'use client'

import { useState, useEffect, useMemo } from 'react'
import { getLocalNow, formatForDateTimeInput, forceEcuadorTZ } from '@/lib/date-utils'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  onDelete?: (id: number) => Promise<void>
  initialData?: any
  userId: number
  projects: any[]
  operators?: any[]
  isAdminView?: boolean
}

type AssignMode = 'UNO' | 'VARIOS' | 'TODOS'

export default function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  userId,
  projects,
  operators = [],
  isAdminView = false
}: AppointmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [assignMode, setAssignMode] = useState<AssignMode>('UNO')
  const [selectedOperatorIds, setSelectedOperatorIds] = useState<number[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>(projects)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    projectId: '',
    userId: userId > 0 ? userId.toString() : '',
    status: 'PENDIENTE'
  })

  useEffect(() => {
    if (isOpen) {
      setLoading(false) // Force reset loading on open
      if (initialData) {
        // Editing mode — always single
        setAssignMode('UNO')
        setSelectedOperatorIds(initialData.userId ? [initialData.userId] : [])
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          startTime: formatForDateTimeInput(initialData.startTime),
          endTime: formatForDateTimeInput(initialData.endTime),
          projectId: initialData.projectId?.toString() || '',
          userId: initialData.userId?.toString() || (userId > 0 ? userId.toString() : ''),
          status: initialData.status || 'PENDIENTE'
        })
      } else {
        const now = getLocalNow()
        now.setMinutes(0)
        const inOneHour = new Date(now)
        inOneHour.setHours(now.getHours() + 1)

        setAssignMode('UNO')
        setSelectedOperatorIds([])
        setFormData({
          title: '',
          description: '',
          startTime: formatForDateTimeInput(now),
          endTime: formatForDateTimeInput(inOneHour),
          projectId: '',
          userId: userId > 0 ? userId.toString() : '',
          status: 'PENDIENTE'
        })
      }
    }
  }, [isOpen, initialData, userId])

  // Fetch projects filtered by selected operators
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      let targetIds: number[] = []

      if (assignMode === 'TODOS') {
        targetIds = operators.map(op => op.id)
      } else if (assignMode === 'VARIOS') {
        targetIds = selectedOperatorIds
      } else {
        // UNO
        const singleId = Number(formData.userId)
        targetIds = singleId > 0 ? [singleId] : []
      }

      if (targetIds.length === 0) {
        setFilteredProjects(projects) // No filter, show all
        return
      }

      try {
        const res = await fetch(`/api/admin/calendar/projects-by-operators?operatorIds=${targetIds.join(',')}`)
        if (res.ok) {
          const data = await res.json()
          setFilteredProjects(data)
        } else {
          setFilteredProjects(projects)
        }
      } catch {
        setFilteredProjects(projects) // fallback
      }
    }

    if (isAdminView && isOpen) {
      fetchFilteredProjects()
    }
  }, [assignMode, selectedOperatorIds, formData.userId, isAdminView, isOpen])

  if (!isOpen) return null

  const toggleOperator = (id: number) => {
    setSelectedOperatorIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const getTargetUserIds = (): number[] => {
    if (assignMode === 'TODOS') {
      return operators.map(op => op.id)
    }
    if (assignMode === 'VARIOS') {
      return selectedOperatorIds
    }
    // UNO
    const singleId = Number(formData.userId)
    return singleId > 0 ? [singleId] : []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que fin > inicio
    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)
    
    if (end <= start) {
      alert('Error: La fecha de fin debe ser posterior a la fecha de inicio.')
      return
    }

    const targetUserIds = getTargetUserIds()
    if (targetUserIds.length === 0) {
      alert('Debes seleccionar al menos un operador.')
      return
    }

    setLoading(true)
    try {
      if (initialData?.id) {
        // Editing — single save
        await onSave({
          ...formData,
          startTime: forceEcuadorTZ(formData.startTime),
          endTime: forceEcuadorTZ(formData.endTime),
          userId: Number(formData.userId),
          id: initialData.id
        })
      } else {
        // Creating — send all target user IDs  
        await onSave({
          ...formData,
          startTime: forceEcuadorTZ(formData.startTime),
          endTime: forceEcuadorTZ(formData.endTime),
          userIds: targetUserIds,
          userId: targetUserIds[0], // fallback for single
        })
      }
      onClose()
    } catch (error) {
      alert('Error al guardar el agendamiento')
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!initialData?.id

  return (
    <div className="modal-overlay">
      <div className="modal-container card">
        {/* Header fijo */}
        <div className="modal-header card-header">
          <h3 className="card-title">{isEditing ? 'Editar Agendamiento' : 'Nuevo Agendamiento'}</h3>
          <button className="btn btn-ghost" onClick={onClose} type="button">✕</button>
        </div>

        {/* Form: scrollable body + fixed footer */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Scrollable content area */}
          <div className="modal-scroll">
            <div className="modal-grid">
              {/* COLUMNA IZQUIERDA */}
              <div className="modal-col">
                <div className="form-group">
                  <label className="form-label">Título de la Actividad</label>
                  <input 
                    className="form-input"
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Mantenimiento Preventivo"
                  />
                </div>

                {isAdminView && (
                  <div className="form-group">
                    <label className="form-label">Asignar a Operador</label>

                    {!isEditing && (
                      <div className="assign-mode-selector">
                        {[
                          { mode: 'TODOS' as AssignMode, label: '👥 Todos', desc: 'Todo el equipo' },
                          { mode: 'VARIOS' as AssignMode, label: '✋ Varios', desc: 'Seleccionar varios' },
                          { mode: 'UNO' as AssignMode, label: '👤 Uno', desc: 'Un operador' }
                        ].map(item => (
                          <button
                            key={item.mode}
                            type="button"
                            className={`assign-mode-btn ${assignMode === item.mode ? 'active' : ''}`}
                            onClick={() => {
                              setAssignMode(item.mode)
                              setSelectedOperatorIds([])
                              setFormData(prev => ({ ...prev, projectId: '' }))
                            }}
                          >
                            <span className="assign-mode-label">{item.label}</span>
                            <span className="assign-mode-desc">{item.desc}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {assignMode === 'TODOS' && !isEditing && (
                      <div className="assign-summary">
                        <span className="assign-badge all">✓ {operators.length} operadores seleccionados</span>
                        <div className="assign-avatars">
                          {operators.map(op => (
                            <span key={op.id} className="assign-chip">{op.name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {assignMode === 'VARIOS' && !isEditing && (
                      <div className="assign-multi-list">
                        {operators.map(op => (
                          <label key={op.id} className={`assign-multi-item ${selectedOperatorIds.includes(op.id) ? 'checked' : ''}`}>
                            <input
                              type="checkbox"
                              checked={selectedOperatorIds.includes(op.id)}
                              onChange={() => {
                                toggleOperator(op.id)
                                setFormData(prev => ({ ...prev, projectId: '' }))
                              }}
                            />
                            <span className="assign-multi-name">{op.name}</span>
                          </label>
                        ))}
                        {selectedOperatorIds.length > 0 && (
                          <p className="assign-count">{selectedOperatorIds.length} seleccionado{selectedOperatorIds.length > 1 ? 's' : ''}</p>
                        )}
                      </div>
                    )}

                    {(assignMode === 'UNO' || isEditing) && (
                      <select 
                        className="form-select"
                        required
                        value={formData.userId}
                        onChange={e => {
                          setFormData({...formData, userId: e.target.value, projectId: ''})
                        }}
                      >
                        <option value="" disabled>Seleccionar operador...</option>
                        {operators.map(op => (
                          <option key={op.id} value={op.id}>{op.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Proyecto Relacionado (Opcional)</label>
                  <select 
                    className="form-select"
                    value={formData.projectId}
                    onChange={e => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">No vinculado a proyecto</option>
                    {filteredProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.status === 'LEAD' ? 'Negociando' : p.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div className="modal-col">
                <div className="datetime-row">
                  <div className="form-group">
                    <label className="form-label">Inicio</label>
                    <input 
                      className="form-input"
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={e => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fin</label>
                    <input 
                      className="form-input"
                      type="datetime-local"
                      required
                      value={formData.endTime}
                      onChange={e => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select 
                    className="form-select"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notas / Instrucciones</label>
                  <textarea 
                    className="form-textarea modal-textarea"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Detalles adicionales para el operador..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer FIJO — nunca scrollea */}
          <div className="modal-footer">
            {initialData?.id && onDelete && (
              <button 
                type="button" 
                className="btn modal-btn" 
                style={{ backgroundColor: 'var(--status-danger)', color: 'white' }} 
                onClick={async () => {
                  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
                    setLoading(true);
                    try { 
                      onDelete(initialData.id); 
                      onClose(); 
                    } catch (error) { 
                      alert('Error eliminando'); 
                      setLoading(false); 
                    }
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
            <button type="button" className="btn btn-secondary modal-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary modal-btn" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        /* ========== OVERLAY ========== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999; /* Alto para sobreescribir navs y footers */
          padding: 24px;
        }

        /* ========== CONTAINER — fullscreen en desktop ========== */
        .modal-container {
          width: 100%;
          max-width: 960px;
          max-height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border-active);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        /* ========== HEADER ========== */
        .modal-header {
          flex-shrink: 0;
          border-bottom: 1px solid var(--border);
        }

        /* ========== FORM ========== */
        .modal-form {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        /* ========== SCROLLABLE BODY ========== */
        .modal-scroll {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: var(--space-lg);
        }

        /* ========== GRID 2-COL ========== */
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }

        .modal-col {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .modal-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .datetime-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-sm);
        }

        /* ========== FOOTER — SIEMPRE FIJO ABAJO ========== */
        .modal-footer {
          display: flex;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--bg-card);
        }

        .modal-btn {
          flex: 1;
          min-width: 0;
        }

        /* ========== ASSIGN MODE ========== */
        .assign-mode-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .assign-mode-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 10px 6px;
          border-radius: var(--radius-md);
          border: 2px solid var(--border);
          background: var(--bg-surface);
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text);
        }
        .assign-mode-btn:hover {
          border-color: var(--primary);
          background: var(--bg-card-hover);
        }
        .assign-mode-btn.active {
          border-color: var(--primary);
          background: var(--primary-glow);
          box-shadow: 0 0 0 1px var(--primary);
        }
        .assign-mode-label {
          font-weight: 700;
          font-size: 0.85rem;
        }
        .assign-mode-desc {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-align: center;
        }
        .assign-summary {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .assign-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 600;
        }
        .assign-badge.all {
          background: var(--primary-glow);
          color: var(--primary);
        }
        .assign-avatars {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .assign-chip {
          padding: 3px 8px;
          border-radius: 20px;
          background: var(--bg-deep);
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .assign-multi-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-height: 150px;
          overflow-y: auto;
          padding: 2px;
        }
        .assign-multi-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.15s ease;
          border: 1px solid transparent;
        }
        .assign-multi-item:hover {
          background: var(--bg-card-hover);
        }
        .assign-multi-item.checked {
          background: var(--primary-glow);
          border-color: var(--primary);
        }
        .assign-multi-item input[type="checkbox"] {
          accent-color: var(--primary);
          width: 15px;
          height: 15px;
        }
        .assign-multi-name {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text);
        }
        .assign-count {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
          font-weight: 600;
        }

        /* ========== MOBILE ========== */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0;
            z-index: 99999; /* Sobre-escribe cualquier header/footer */
          }
          .modal-container {
            width: 100vw;
            max-width: 100vw;
            height: 100vh;
            height: 100dvh;
            max-height: 100vh;
            max-height: 100dvh;
            border-radius: 0;
            border: none;
            margin: 0;
          }
          .modal-scroll {
            padding: var(--space-md);
            padding-bottom: var(--space-lg);
          }
          .modal-grid {
            grid-template-columns: 1fr;
            gap: var(--space-sm);
          }
          .modal-col {
            gap: var(--space-sm);
          }
          .modal-textarea {
            min-height: 50px;
          }
          .datetime-row {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-xs);
          }
          .modal-footer {
            padding: var(--space-sm) var(--space-md);
          }
          .assign-mode-selector {
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
          }
          .assign-mode-btn {
            padding: 8px 4px;
          }
          .assign-mode-label {
            font-size: 0.75rem;
          }
          .assign-mode-desc {
            font-size: 0.6rem;
          }
        }

        @media (max-width: 400px) {
          .datetime-row {
            grid-template-columns: 1fr;
          }
          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
