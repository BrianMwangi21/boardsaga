const pieces = [
  {
    name: 'Pawn',
    symbol: '♟',
    characteristics: 'Humble yet ambitious, the pawn is the soul of the chess army. They march forward with unwavering determination, sacrificing themselves for greater goals. Each pawn dreams of promotion—of transcending their humble origins to become something greater.',
    catchPhrases: [
      '"One step at a time, toward glory."',
      '"The smallest stone can start the greatest avalanche."',
      '"We are many, and we are relentless."'
    ],
    lore: 'Pawns are the heart of the kingdom. They form the living wall, the first line of defense and offense. Though individually weak, their collective strength can topple empires. When a pawn reaches the eighth rank, their transformation is more than promotion—it\'s ascension to legend.'
  },
  {
    name: 'Rook',
    symbol: '♜',
    characteristics: 'The castle stands firm. Rooks are guardians of territory, masters of straight lines and unwavering resolve. They command the files and ranks with authority, their presence felt across the entire board.',
    catchPhrases: [
      '"I hold the line."',
      '"Straight and true, my aim never falters."',
      '"The castle stands while foundations remain."'
    ],
    lore: 'Rooks are the ancient sentinels of the board, forged from the stone of fortresses past. They communicate in silent vibrations through the board, coordinating defenses and crushing advances alike. When rooks connect (the "rooks\' alliance"), their power becomes nearly unstoppable.'
  },
  {
    name: 'Knight',
    symbol: '♞',
    characteristics: 'The unpredictable warrior. Knights dance through chaos, their L-shaped movements defying the laws of straight lines. Strategic, cunning, and always appearing where least expected, they are the masters of surprise attack.',
    catchPhrases: [
      '"Two steps forward, one to the side—always an angle."',
      '"Predictability is for the slow."',
      '"The path to victory is never a straight line."'
    ],
    lore: 'Knights are the tricksters of the board, riding on nightmares that leap over obstacles. Their strange gait confuses enemies, allowing them to strike from unexpected quarters. They are immune to the crushing lines of rooks and queens, existing in the spaces between.'
  },
  {
    name: 'Bishop',
    symbol: '♝',
    characteristics: 'The spiritual guide. Bishops glide diagonally like spirits through the material world, their movements elegant and swift. They are pieces of light and shadow, each bound to their color since birth.',
    catchPhrases: [
      '"I walk the diagonal path to truth."',
      '"Light and shadow, forever intertwined."',
      '"My sight pierces through all obstructions."'
    ],
    lore: 'Bishops are the mystics of the chess realm, seeing patterns invisible to others. Though each bishop is confined to half the board, their wisdom flows through the diagonals like rivers of insight. When the two bishops unite ("the bishop pair"), they create a web of influence that few can escape.'
  },
  {
    name: 'Queen',
    symbol: '♛',
    characteristics: 'The sovereign of all. The Queen commands every direction, combining the rook\'s straight lines with the bishop\'s diagonal grace. She is the most powerful piece, but also the most critical to protect.',
    catchPhrases: [
      '"My reach knows no boundaries."',
      '"The queen protects her own, but must also be protected."',
      '"All paths lead to me, and I to them."'
    ],
    lore: 'The Queen is the embodiment of chess itself—flexible, powerful, and irreplaceable. Her presence transforms the board, her movements a dance of calculated destruction. Losing a queen is not just losing a piece; it\'s losing the kingdom\'s heart.'
  },
  {
    name: 'King',
    symbol: '♚',
    characteristics: 'The crown that must not fall. Though his movement is slow, his survival is the only objective that truly matters. The King is the prize that all other pieces exist to protect or capture.',
    catchPhrases: [
      '"The battle is lost when I fall."',
      '"Small steps to safety, surrounded by loyal guardians."',
      '"The weight of the kingdom rests on my shoulders."'
    ],
    lore: 'The King is the purpose behind every move, every sacrifice, every strategy. His castling with the rook is a sacred ritual—a desperate flight to safety when danger looms. The checkmate is not just capturing a piece; it\'s ending the war.'
  }
]

const openingConcepts = [
  {
    title: 'The Open Game',
    description: 'When the center becomes a battlefield, the brave souls advance. e4 and e5—they are the gateways to chaos and glory.'
  },
  {
    title: 'The Closed Game',
    description: 'Queens and kings stand their ground. d4 and d5—fortresses built before the first shot is fired.'
  },
  {
    title: 'The Sacrifice',
    description: 'The greatest victories require the greatest risks. When a piece falls for future gain, the board remembers.'
  },
  {
    title: 'The Gambit',
    description: 'Give a pawn to gain a position, a tempo, an advantage. The bold player understands that sometimes you must lose to win.'
  }
]

const specialMoments = [
  {
    title: 'The Back Rank Mate',
    description: 'The castle crumbles when the king has nowhere to hide. The rook\'s final checkmate—swift, merciless, inevitable.'
  },
  {
    title: 'The Fork',
    description: 'A knight\'s deadly gift—two pieces threatened, one saved at best. The cruel mathematics of war.'
  },
  {
    title: 'The Pin',
    description: 'Bound by duty, a piece cannot move. The sniper\'s aim holds more than the soldier can bear.'
  },
  {
    title: 'The Discovery',
    description: 'When one piece moves, another reveals its deadly purpose. The shadow that was always there, waiting.'
  }
]

const storyThemes = [
  { name: 'Sacrifice and Redemption', description: 'Pieces give themselves for the greater good' },
  { name: 'Strategy and Foresight', description: 'Plans unfold across moves, patience rewarded' },
  { name: 'The Underdog\'s Journey', description: 'Pawns dreaming of promotion' },
  { name: 'Tragedy of Overextension', description: 'Ambition leading to downfall' },
  { name: 'The Beauty of Combination', description: 'Multiple pieces working in harmony' },
  { name: 'The King\'s Lonely Burden', description: 'All depends on one' }
]

export default function LorePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
      }}
    >
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="mb-4"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-5xl)',
                fontWeight: 700,
                color: '#2C1810',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              The World of BoardSaga
            </h1>
            <p
              className="max-w-2xl mx-auto"
              style={{
                fontSize: 'var(--text-xl)',
                color: '#6B3410',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              In the eternal struggle across the sixty-four squares, each piece possesses its own spirit, purpose, and voice.
              Their stories intertwine through countless battles, creating legends whispered by masters and novices alike.
            </p>
          </div>

          <div className="space-y-8 mb-16">
            {pieces.map((piece) => (
              <div
                key={piece.name}
                className="rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #E8C9A0',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="text-6xl transition-transform duration-300 hover:scale-110"
                    style={{
                      color: '#8B4513',
                    }}
                  >
                    {piece.symbol}
                  </div>
                  <h2
                    className="transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-serif), Georgia, serif',
                      fontSize: 'var(--text-3xl)',
                      fontWeight: 700,
                      color: '#2C1810',
                    }}
                  >
                    {piece.name}
                  </h2>
                </div>

                <div className="mb-4">
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: '#6B3410',
                    }}
                  >
                    Characteristics
                  </h3>
                  <p style={{ color: '#6B3410' }}>{piece.characteristics}</p>
                </div>

                <div className="mb-4">
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: '#6B3410',
                    }}
                  >
                    Catch-phrases
                  </h3>
                  <ul className="space-y-1">
                    {piece.catchPhrases.map((phrase, index) => (
                      <li
                        key={index}
                        className="transition-all duration-200 hover:translate-x-2 cursor-default"
                        style={{
                          color: '#6B3410',
                          fontStyle: 'italic',
                        }}
                      >
                        {phrase}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: '#6B3410',
                    }}
                  >
                    Lore
                  </h3>
                  <p style={{ color: '#6B3410' }}>{piece.lore}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2
              className="mb-6 text-center"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              Opening Concepts
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {openingConcepts.map((concept) => (
                <div
                  key={concept.title}
                  className="rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #F5F0E6 0%, #EEE8D3 100%)',
                    border: '2px solid #E8C9A0',
                  }}
                >
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 600,
                      color: '#2C1810',
                    }}
                  >
                    {concept.title}
                  </h3>
                  <p
                    className="italic"
                    style={{
                      color: '#6B3410',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {concept.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2
              className="mb-6 text-center"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              Special Moments
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {specialMoments.map((moment) => (
                <div
                  key={moment.title}
                  className="rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #F5F0E6 0%, #EEE8D3 100%)',
                    border: '2px solid #E8C9A0',
                  }}
                >
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 600,
                      color: '#2C1810',
                    }}
                  >
                    {moment.title}
                  </h3>
                  <p
                    className="italic"
                    style={{
                      color: '#6B3410',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {moment.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2
              className="mb-6 text-center"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              Themes for Story Generation
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {storyThemes.map((theme) => (
                <div
                  key={theme.name}
                  className="rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    background: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(44, 24, 16, 0.08)',
                    border: '2px solid #E8C9A0',
                  }}
                >
                  <h3
                    className="mb-2 transition-colors duration-300"
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 600,
                      color: '#2C1810',
                    }}
                  >
                    {theme.name}
                  </h3>
                  <p
                    style={{
                      color: '#6B3410',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {theme.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
