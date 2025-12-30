'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

const secretTaglines = [
  'The king has left the building',
  'Checkmate is just a matter of time',
  'Every pawn has potential',
  'Knights move in mysterious ways',
  'Queens rule the world',
  'Bishops see everything',
  'Rooks are reliable',
  'Game over? Never.',
  'Your move, grandmaster',
]

export default function Header() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [tagline, setTagline] = useState('Turning moves into myths')
  const clickCount = useRef(0)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const [logoSpinning, setLogoSpinning] = useState(false)

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    clickCount.current += 1

    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
    }

    clickTimer.current = setTimeout(() => {
      if (clickCount.current >= 3) {
        const randomTagline = secretTaglines[Math.floor(Math.random() * secretTaglines.length)]
        setTagline(randomTagline)
        setLogoSpinning(true)
        setTimeout(() => {
          setTagline('Turning moves into myths')
          setLogoSpinning(false)
        }, 3000)
      }
      clickCount.current = 0
    }, 500)
  }

  return (
    <header
      className="border-b border-wood-dark"
      style={{
        background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
        boxShadow: '0 2px 8px rgba(44, 24, 16, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex flex-col cursor-pointer" onClick={handleLogoClick}>
          <Link
            href="/"
            className="text-2xl font-bold text-white transition-transform duration-200 hover:scale-105"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              display: 'inline-block',
            }}
            onClick={(e) => {
              e.preventDefault()
              handleLogoClick(e)
              setTimeout(() => {
                window.location.href = '/'
              }, 100)
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.5s ease-in-out',
                transform: logoSpinning ? 'rotate(360deg)' : 'rotate(0deg)',
              }}
            >
              BoardSaga
            </span>
          </Link>
          <span
            className="text-sm transition-all duration-300"
            style={{
              color: '#2C1810',
              opacity: 0.8,
              fontStyle: logoSpinning ? 'italic' : 'normal',
            }}
          >
            {tagline}
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
