import { NextRequest, NextResponse } from 'next/server'
import { parsePGN, validatePGN } from '@/lib/pgn-parser'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.pgn || typeof body.pgn !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: PGN content is required' },
        { status: 400 }
      )
    }

    const trimmedPgn = body.pgn.trim()

    if (trimmedPgn.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: PGN content cannot be empty' },
        { status: 400 }
      )
    }

    const validation = validatePGN(trimmedPgn)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid PGN format' },
        { status: 400 }
      )
    }

    const parsedGame = parsePGN(trimmedPgn)

    if (!parsedGame) {
      return NextResponse.json(
        { error: 'Failed to parse PGN' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: parsedGame,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error parsing PGN:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
