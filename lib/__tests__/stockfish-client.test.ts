import { StockfishClient } from '@/lib/stockfish-client'

describe('Stockfish Client', () => {
  describe('StockfishClient initialization', () => {
    it('should create client instance', () => {
      if (typeof window === 'undefined') {
        const client = new StockfishClient()
        expect(client).toBeInstanceOf(StockfishClient)
        client.terminate()
      }
    })
  })
  
  describe('classifyMove (browser-only)', () => {
    let client: StockfishClient
    
    beforeEach(() => {
      if (typeof window !== 'undefined') {
        client = new StockfishClient()
      }
    })
    
    afterEach(() => {
      if (typeof window === 'undefined' && client) {
        client.terminate()
      }
    })
    
    it('should classify blunder (>200 centipawn loss)', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 100, depth: 15 }
      const after = { score: -150, depth: 15 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('blunder')
    })
    
    it('should classify mistake (100-200 centipawn loss)', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 50, depth: 15 }
      const after = { score: -80, depth: 15 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('mistake')
    })
    
    it('should classify inaccuracy (50-99 centipawn loss)', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 20, depth: 15 }
      const after = { score: -60, depth: 15 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('inaccuracy')
    })
    
    it('should classify good move (<50 centipawn loss)', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 10, depth: 15 }
      const after = { score: -30, depth: 15 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('good')
    })
    
    it('should classify brilliancy (>200 centipawn gain)', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: -50, depth: 15 }
      const after = { score: 200, depth: 15 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('brilliancy')
    })
    
    it('should classify mate as brilliancy for positive side', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 100, depth: 15 }
      const after = { score: 0, depth: 15, mate: 2 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('brilliancy')
    })
    
    it('should classify mate as blunder for negative side', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 100, depth: 15 }
      const after = { score: 0, depth: 15, mate: -2 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('blunder')
    })
    
    it('should classify book move when scores are equal', () => {
      if (typeof window === 'undefined') {
        return
      }
      
      const before = { score: 50, depth: 10 }
      const after = { score: 50, depth: 12 }
      
      const classification = client['classifyMove'](before, after)
      
      expect(classification).toBe('book')
    })
  })
})
