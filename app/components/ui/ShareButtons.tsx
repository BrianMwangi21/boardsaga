'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url?: string
  summary?: string
  size?: 'card' | 'page' | 'icon'
}

export default function ShareButtons({ title, url, summary, size = 'card' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShareNative = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'BoardSaga Chess Story',
          text: summary || `Check out this chess story: ${title}`,
          url: currentUrl,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this chess story: ${title}`)}&url=${encodeURIComponent(currentUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(title)}`

  const canUseNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  if (size === 'icon') {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {canUseNativeShare && (
          <button
            onClick={handleShareNative}
            className="p-2 rounded transition-all duration-200 hover:scale-110 hover:shadow-md"
            style={{
              background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
              color: '#F5F0E6',
              border: 'none',
              cursor: 'pointer',
            }}
            title="Share"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        )}

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded transition-all duration-200 hover:scale-110 hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
            color: '#F5F0E6',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          title="Share on X"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded transition-all duration-200 hover:scale-110 hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
            color: '#F5F0E6',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          title="Share on Facebook"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <button
          onClick={handleCopyLink}
          className="p-2 rounded transition-all duration-200 hover:scale-110 hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
            color: '#F5F0E6',
            border: 'none',
            cursor: 'pointer',
          }}
          title="Copy link"
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  const buttonStyle = {
    padding: size === 'page' ? '0.75rem 1.25rem' : '0.5rem 0.875rem',
    fontSize: size === 'page' ? '0.875rem' : '0.75rem',
    borderRadius: '8px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    color: '#F5F0E6',
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {canUseNativeShare && (
        <button
          onClick={handleShareNative}
          className="transition-all duration-200 hover:scale-105 hover:shadow-md"
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
          }}
          title="Share"
        >
          Share
        </button>
      )}

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all duration-200 hover:scale-105 hover:shadow-md"
        style={{
          ...buttonStyle,
          background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
          textDecoration: 'none',
          display: 'inline-block',
        }}
        title="Share on X"
      >
        𝕏
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all duration-200 hover:scale-105 hover:shadow-md"
        style={{
          ...buttonStyle,
          background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
          textDecoration: 'none',
          display: 'inline-block',
        }}
        title="Share on Facebook"
      >
        f
      </a>

      <button
        onClick={handleCopyLink}
        className="transition-all duration-200 hover:scale-105 hover:shadow-md"
        style={{
          ...buttonStyle,
          background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
        }}
        title="Copy link"
      >
        {copied ? '✓ Copied!' : '🔗 Copy'}
      </button>
    </div>
  )
}
