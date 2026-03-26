'use client'

import React, { useState, useRef, useMemo } from 'react'
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText,
  X,
  Filter,
  Trash2
} from 'lucide-react'

export interface ProjectFile {
  url: string
  filename: string
  mimeType: string
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
}

interface ProjectUploaderProps {
  files: ProjectFile[]
  onAddFile: (file: ProjectFile) => void
  onRemoveFile?: (url: string) => void
  readOnly?: boolean
  title?: string
}

type FilterType = 'ALL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'

export default function ProjectUploader({ 
  files, 
  onAddFile, 
  onRemoveFile, 
  readOnly = false,
  title = "Archivos del Proyecto"
}: ProjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [filter, setFilter] = useState<FilterType>('ALL')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredFiles = useMemo(() => {
    if (filter === 'ALL') return files
    return files.filter(f => f.type === filter)
  }, [files, filter])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        if (!isOnline) {
          // Offline Mode: Convert to base64 locally
          const reader = new FileReader()
          const base64: string = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          const localFile = {
            url: base64, // Local preview/base64 for outbox
            filename: file.name,
            mimeType: file.type,
            type: (file.type.startsWith('image/') ? 'IMAGE' : (file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT')) as 'IMAGE' | 'VIDEO' | 'DOCUMENT'
          }
          
          onAddFile(localFile)
          continue
        }

        // Online Mode: Normal upload
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error('Upload failed')
        
        const data = await res.json()
        onAddFile(data)
      }
    } catch (error) {
      console.error('Error handling files:', error)
      if (isOnline) {
        alert('Error al subir archivos. Por favor intente de nuevo.')
      } else {
        alert('Error al procesar archivos offline.')
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return <ImageIcon size={20} className="text-blue-400" />
      case 'VIDEO': return <VideoIcon size={20} className="text-purple-400" />
      default: return <FileText size={20} className="text-gray-400" />
    }
  }

  return (
    <div className="card w-full mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="card-title text-lg">{title}</h3>
          <p className="card-subtitle">Gestiona imágenes, videos y documentos</p>
        </div>

        {!readOnly && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn btn-primary btn-sm"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Subiendo...</span>
              </div>
            ) : (
              <>
                <UploadCloud size={16} />
                <span>Subir Archivos</span>
              </>
            )}
          </button>
        )}
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-text-muted mr-2">
          <Filter size={14} />
          <span>Filtrar:</span>
        </div>
        
        {(['ALL', 'IMAGE', 'VIDEO', 'DOCUMENT'] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === t 
                ? 'bg-primary text-text-inverse shadow-glow scale-105' 
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            {t === 'ALL' ? 'Todos' : t === 'IMAGE' ? 'Fotos' : t === 'VIDEO' ? 'Videos' : 'Docs'}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file, idx) => (
            <div 
              key={file.url + idx} 
              className="group relative aspect-square rounded-xl overflow-hidden bg-bg-deep border border-border hover:border-primary/50 transition-all card-shadow-hover"
            >
              {file.type === 'IMAGE' ? (
                <img 
                  src={file.url} 
                  alt={file.filename} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2">
                  {getIcon(file.type)}
                  <span className="text-[10px] text-text-secondary font-medium truncate w-full px-2">
                    {file.filename}
                  </span>
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  title="Ver archivo"
                >
                  <FileText size={20} />
                </a>
                {!readOnly && onRemoveFile && (
                  <button 
                    onClick={() => onRemoveFile(file.url)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {/* Tag Pin */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                {file.type}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-border rounded-xl">
            <UploadCloud size={40} className="mb-3 opacity-20" />
            <p className="text-sm">No hay archivos {filter !== 'ALL' ? 'de este tipo' : ''}</p>
            {!readOnly && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-primary text-xs font-semibold mt-2 hover:underline"
              >
                Subir ahora
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .card-shadow-hover:hover {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.15);
        }
      `}</style>
    </div>
  )
}
