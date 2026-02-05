'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  width: string
  height: string
  left: string
  top: string
  animationDelay: string
  animationDuration: string
}

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Generate stars only on client side
    const generatedStars = [...Array(50)].map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 'px',
      height: Math.random() * 3 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDelay: Math.random() * 3 + 's',
      animationDuration: (Math.random() * 3 + 2) + 's',
    }))
    setStars(generatedStars)
  }, [])

  if (stars.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: star.width,
            height: star.height,
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
          }}
        />
      ))}
    </div>
  )
}
