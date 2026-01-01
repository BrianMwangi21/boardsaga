import { createHash } from 'crypto'

export const CACHE_TTL = 60 * 60 * 1000

export interface CachedEntry<T> {
  data: T
  timestamp: number
}

export class Cache<T> {
  private cache: Map<string, CachedEntry<T>>

  constructor() {
    this.cache = new Map()
  }

  get(key: string): T | null {
    const now = Date.now()
    const cached = this.cache.get(key)

    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    return null
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

export function generateHash(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function generateHashFromObject(obj: unknown): string {
  return generateHash(JSON.stringify(obj))
}
