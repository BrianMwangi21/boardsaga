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
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
      `}
      style={{
        background: isDragActive
          ? 'linear-gradient(135deg, rgba(193, 154, 107, 0.2) 0%, rgba(212, 163, 115, 0.2) 100%)'
          : 'linear-gradient(135deg, #F5F0E6 0%, #EEE8D3 100%)',
        borderColor: isDragActive ? '#8B4513' : '#C19A6B',
        boxShadow: isDragActive
          ? '0 8px 32px rgba(139, 69, 19, 0.2)'
          : '0 4px 16px rgba(44, 24, 16, 0.1)',
      }}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <svg
          className="w-12 h-12 transition-all duration-300"
          style={{
            color: isDragActive ? '#8B4513' : '#C19A6B',
            transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div>
          <p
            className="transition-all duration-200"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: isDragActive ? '#2C1810' : '#8B4513',
            }}
          >
            {isDragActive ? 'Drop your PGN file here' : 'Drag and drop your PGN file'}
          </p>
          <p
            className="transition-all duration-200"
            style={{
              fontSize: 'var(--text-sm)',
              color: '#6B3410',
              marginTop: '0.25rem',
            }}
          >
            or click to browse your files
          </p>
        </div>
        <p
          className="transition-all duration-200"
          style={{
            fontSize: 'var(--text-xs)',
            color: '#8B4513',
            opacity: 0.7,
          }}
        >
          .pgn files only
        </p>
      </div>
    </div>
  )
}
