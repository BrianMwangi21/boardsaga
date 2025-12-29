import { POST } from '@/app/api/analyze-game/route'
import { NextRequest } from 'next/server'

describe.skip('Analyze Game API', () => {
  describe('POST endpoint validation', () => {
    it('should return 400 when PGN is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze-game', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('PGN is required')
    })

    it('should return 400 when PGN is not a string', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze-game', {
        method: 'POST',
        body: JSON.stringify({ pgn: 123 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })

    it('should return 400 for invalid PGN format', async () => {
      const request = new NextRequest('http://localhost:3000/api/analyze-game', {
        method: 'POST',
        body: JSON.stringify({ pgn: 'invalid pgn content here' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Failed to parse PGN')
    })
  })

  describe('GET endpoint', () => {
    it('should return API documentation', async () => {
      const { GET } = await import('@/app/api/analyze-game/route')
      const response = await GET()

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.endpoint).toBe('Analyze Game')
      expect(data.method).toBe('POST')
      expect(data.model).toBeDefined()
      expect(data.rateLimit).toBeDefined()
      expect(data.cache).toBeDefined()
    })
  })
})
