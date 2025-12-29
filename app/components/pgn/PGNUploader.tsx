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
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <svg
          className="w-16 h-16 text-muted-foreground"
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
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your PGN file here' : 'Drag and drop your PGN file'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse your files
          </p>
        </div>
        <p className="text-xs text-muted-foreground">.pgn files only</p>
      </div>
    </div>
  )
}
