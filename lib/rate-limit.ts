interface RequestLogEntry {
  timestamp: number
  endpoint: string
}

export class RateLimiter {
  private requestLog: RequestLogEntry[] = []
  private readonly window: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 20) {
    this.window = windowMs
    this.maxRequests = maxRequests
  }

  check(endpoint: string): boolean {
    const now = Date.now()
    const recentRequests = this.requestLog.filter(
      r => now - r.timestamp < this.window
    )

    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    this.requestLog.push({ timestamp: now, endpoint })
    return true
  }

  cleanup(): void {
    const now = Date.now()
    this.requestLog = this.requestLog.filter(
      r => now - r.timestamp < this.window
    )
  }

  getRecentCount(endpoint: string): number {
    const now = Date.now()
    return this.requestLog.filter(
      r => r.endpoint === endpoint && now - r.timestamp < this.window
    ).length
  }
}

export const DEFAULT_RATE_LIMITER = new RateLimiter()
