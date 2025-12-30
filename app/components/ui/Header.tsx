'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <header
      className="border-b border-wood-dark"
      style={{
        background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
        boxShadow: '0 2px 8px rgba(44, 24, 16, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <Link
            href="/"
            className="text-2xl font-bold text-white transition-transform duration-200 hover:scale-105"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              display: 'inline-block',
            }}
          >
            BoardSaga
          </Link>
          <span
            className="text-sm"
            style={{
              color: '#2C1810',
              opacity: 0.8,
            }}
          >
            Turning moves into myths
          </span>
        </div>
        <nav className="flex gap-6 items-center">
          {[
            { href: '/', label: 'Home' },
            { href: '/stories', label: 'Stories' },
            { href: '/lore', label: 'Lore' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-1 rounded transition-all duration-200 font-medium"
              style={{
                color: hoveredLink === link.href ? '#2C1810' : '#F5F0E6',
                background: hoveredLink === link.href ? 'rgba(245, 240, 230, 0.3)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/BrianMwangi21/boardsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-3 py-1 rounded transition-all duration-200 font-medium"
            style={{
              color: hoveredLink === 'github' ? '#2C1810' : '#F5F0E6',
              background: hoveredLink === 'github' ? 'rgba(245, 240, 230, 0.3)' : 'transparent',
            }}
            onMouseEnter={() => setHoveredLink('github')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
