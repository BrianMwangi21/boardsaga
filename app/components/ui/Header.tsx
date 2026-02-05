'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/stories', label: 'Stories' },
    { href: '/lore', label: 'Lore' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled 
          ? 'rgba(15, 15, 26, 0.7)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled 
          ? '1px solid rgba(0, 245, 255, 0.2)' 
          : '1px solid transparent',
        boxShadow: scrolled 
          ? '0 4px 30px rgba(0, 0, 0, 0.3)' 
          : 'none',
        paddingTop: scrolled ? '0.75rem' : '1.25rem',
        paddingBottom: scrolled ? '0.75rem' : '1.25rem',
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col">
          <Link
            href="/"
            className="text-2xl font-bold transition-all duration-300 hover:scale-105 relative group"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            <span className="gradient-text">Board</span>
            <span style={{ color: '#ffd700' }}>Saga</span>
            {/* Glow effect */}
            <span 
              className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          </Link>
          <span
            className="text-xs tracking-widest uppercase"
            style={{
              color: 'var(--moon-glow)',
              opacity: 0.8,
            }}
          >
            Turning moves into myths
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
              style={{
                color: hoveredLink === link.href ? 'var(--neon-cyan)' : 'var(--moon-glow)',
                background: hoveredLink === link.href ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                border: hoveredLink === link.href ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
              }}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.label}
              {hoveredLink === link.href && (
                <span 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--neon-cyan)' }}
                />
              )}
            </Link>
          ))}
          
          <a
            href="https://github.com/BrianMwangi21/boardsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-2"
            style={{
              color: hoveredLink === 'github' ? 'var(--neon-cyan)' : 'var(--moon-glow)',
              background: hoveredLink === 'github' ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
              border: hoveredLink === 'github' ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
            }}
            onMouseEnter={() => setHoveredLink('github')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
