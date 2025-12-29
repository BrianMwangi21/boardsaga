'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <footer
      className="border-t border-wood-dark mt-auto"
      style={{
        background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
        boxShadow: '0 -2px 8px rgba(44, 24, 16, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 py-6 text-center">
        <p
          className="text-white transition-all duration-200"
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'var(--text-base)',
          }}
        >
          &copy; {new Date().getFullYear()} BoardSaga. Turning moves into myths.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link
            href="https://github.com/BrianMwangi21/boardsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-4 py-2 rounded transition-all duration-200 font-medium"
            style={{
              color: hoveredLink === 'github' ? '#2C1810' : '#F5F0E6',
              background: hoveredLink === 'github' ? 'rgba(245, 240, 230, 0.3)' : 'transparent',
            }}
            onMouseEnter={() => setHoveredLink('github')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            View on GitHub
          </Link>
          <Link
            href="/"
            className="relative px-4 py-2 rounded transition-all duration-200 font-medium"
            style={{
              color: hoveredLink === 'home' ? '#2C1810' : '#F5F0E6',
              background: hoveredLink === 'home' ? 'rgba(245, 240, 230, 0.3)' : 'transparent',
            }}
            onMouseEnter={() => setHoveredLink('home')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
          </Link>
        </div>
      </div>
    </footer>
  )
}
