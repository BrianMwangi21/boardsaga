'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface PGNUploaderProps {
  onFileSelect: (file: File) => void
}

export default function PGNUploader({ onFileSelect }: PGNUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-chess-pgn': ['.pgn'],
      'text/plain': ['.pgn'],
    },
    maxFiles: 1,
  })

  return (
    <div className="relative group">
      {/* Animated glow ring */}
      <div 
        className={`absolute -inset-1 rounded-2xl transition-all duration-500 blur-sm ${
          isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
        }`}
        style={{
          background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 50%, var(--neon-gold) 100%)',
        }}
      />
      
      {/* Rotating border effect */}
      <div 
        className={`absolute -inset-[2px] rounded-2xl overflow-hidden transition-opacity duration-500 ${
          isDragActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, transparent, var(--neon-cyan), var(--neon-purple), var(--neon-cyan), transparent)',
            animation: 'spin 4s linear infinite',
          }}
        />
      </div>

      <div
        {...getRootProps()}
        className={`
          relative rounded-xl p-12 text-center cursor-pointer transition-all duration-500 z-10
          ${isDragActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
        `}
        style={{
          background: isDragActive
            ? 'rgba(26, 26, 46, 0.9)'
            : 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: isDragActive 
            ? '2px solid rgba(0, 245, 255, 0.5)' 
            : '2px solid rgba(0, 245, 255, 0.2)',
          boxShadow: isDragActive
            ? '0 0 60px rgba(0, 245, 255, 0.3), inset 0 0 60px rgba(0, 245, 255, 0.1)'
            : '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <input {...getInputProps()} />
        
        {/* Icon Container with floating animation */}
        <div className={`flex flex-col items-center gap-6 ${isDragActive ? '' : 'float'}`}>
          {/* Upload Icon */}
          <div 
            className="relative"
            style={{
              transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            {/* Outer glow */}
            <div 
              className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                isDragActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)',
                transform: 'scale(2)',
              }}
            />
            
            <svg
              className="w-16 h-16 relative z-10"
              style={{
                color: isDragActive ? 'var(--neon-cyan)' : 'var(--neon-purple)',
                filter: isDragActive ? 'drop-shadow(0 0 20px var(--neon-cyan))' : 'none',
                transition: 'all 0.3s ease',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V4.5m0 0L7.5 9M12 4.5l4.5 4.5M3 16.5v1.125A2.625 2.625 0 005.625 20.25h12.75A2.625 2.625 0 0021 17.625V16.5"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <p
              className="text-xl font-semibold transition-all duration-300"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: isDragActive ? 'var(--neon-cyan)' : 'var(--starlight)',
                textShadow: isDragActive ? '0 0 20px rgba(0, 245, 255, 0.5)' : 'none',
              }}
            >
              {isDragActive ? 'Release to Upload' : 'Drop your PGN file here'}
            </p>
            <p
              className="text-sm transition-all duration-300"
              style={{
                color: 'var(--moon-glow)',
                opacity: 0.8,
              }}
            >
              or click to browse your files
            </p>
          </div>

          {/* File Type Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(0, 245, 255, 0.1)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              color: 'var(--neon-cyan)',
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            .pgn files only
          </div>
        </div>

        {/* Corner decorations */}
        <div 
          className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg transition-colors duration-300"
          style={{
            borderColor: isDragActive ? 'var(--neon-cyan)' : 'rgba(0, 245, 255, 0.2)',
          }}
        />
        <div 
          className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 rounded-tr-lg transition-colors duration-300"
          style={{
            borderColor: isDragActive ? 'var(--neon-cyan)' : 'rgba(0, 245, 255, 0.2)',
          }}
        />
        <div 
          className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 rounded-bl-lg transition-colors duration-300"
          style={{
            borderColor: isDragActive ? 'var(--neon-cyan)' : 'rgba(0, 245, 255, 0.2)',
          }}
        />
        <div 
          className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-lg transition-colors duration-300"
          style={{
            borderColor: isDragActive ? 'var(--neon-cyan)' : 'rgba(0, 245, 255, 0.2)',
          }}
        />
      </div>
    </div>
  )
}
