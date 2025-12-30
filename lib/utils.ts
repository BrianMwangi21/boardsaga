export function normalizePGN(pgn: string): string {
  return pgn.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n')
}
