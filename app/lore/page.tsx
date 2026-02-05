'use client'

const pieces = [
  {
    name: 'Pawn',
    symbol: '♟',
    characteristics: 'From the depths of the void, we ascend. The humble souls who dream of becoming stars. Each pawn carries the weight of possibility, marching forward with unwavering determination. They sacrifice themselves for greater goals, their collective strength capable of reshaping the cosmic order.',
    catchPhrases: [
      '"One step at a time, toward glory."',
      '"The smallest star can illuminate the darkest void."',
      '"We are many, and we are relentless."',
      '"My ascension is not a dream—it is destiny."',
      '"The first rank is my beginning, not my end."'
    ],
    lore: 'Pawns are the quantum particles of chess—small yet essential, each carrying the potential for transformation. They form the living constellation, the first line of both defense and offense. When a pawn reaches the eighth rank, their promotion is more than metamorphosis—it\'s ascension to a higher plane of existence.',
    color: 'cyan'
  },
  {
    name: 'Rook',
    symbol: '♜',
    characteristics: 'Guardians of cosmic order, masters of infinite straight lines. They command the orthogonal dimensions with absolute authority, their presence felt across entire regions of the board. Like ancient monoliths, they stand firm while empires crumble around them.',
    catchPhrases: [
      '"I hold the line against entropy."',
      '"Straight and true, my aim never falters."',
      '"The castle stands while foundations remain."',
      '"Patience is the rook\'s greatest weapon."',
      '"When I move, the spacetime trembles."'
    ],
    lore: 'Rooks are the ancient sentinels of the chess cosmos, forged from the fabric of space itself. They communicate in silent resonances across the board, coordinating defenses and crushing advances. When two rooks connect, they form a quantum entanglement—a bond that multiplies their power exponentially.',
    color: 'purple'
  },
  {
    name: 'Knight',
    symbol: '♞',
    characteristics: 'Quantum dancers moving through probability space. Their L-shaped leaps defy conventional geometry, appearing where least expected like particles tunneling through barriers. They exist in superposition, threatening multiple squares simultaneously.',
    catchPhrases: [
      '"Two steps forward, one to the side—always an angle."',
      '"Predictability is for those bound by classical physics."',
      '"The path to victory follows no straight line."',
      '"I don\'t see obstacles—I see probability waves."',
      '"While you march, I quantum leap."'
    ],
    lore: 'Knights are the tricksters of the chess multiverse, riding on probability waves that leap over obstacles. Their strange gait confuses classical calculation, allowing them to strike from dimensions unseen. They are immune to the crushing lines of rooks and queens, existing in the spaces between conventional paths.',
    color: 'gold'
  },
  {
    name: 'Bishop',
    symbol: '♝',
    characteristics: 'Mystics who walk the diagonal paths between dimensions. They glide through the board like light through prisms, each bound to their color since the dawn of the game. While others control territory, bishops operate on the invisible wavelengths of influence.',
    catchPhrases: [
      '"I walk the diagonal path to transcendence."',
      '"Light and shadow, forever entangled."',
      '"My sight pierces through dimensional barriers."',
      '"The diagonal is my sacred geometry."',
      '"While others see squares, I see spectral lines."'
    ],
    lore: 'Bishops are the mystics of the chess cosmos, seeing patterns invisible to classical observers. Though each bishop is confined to half the chromatic spectrum, their wisdom flows through the diagonals like photons through space. When the bishop pair unites, they create a web of influence that spans the entire color wheel.',
    color: 'cyan'
  },
  {
    name: 'Queen',
    symbol: '♛',
    characteristics: 'Sovereign of all dimensions, combining the rook\'s spatial authority with the bishop\'s diagonal transcendence. She is the most powerful force in the known chess universe, her movements a dance of calculated destruction across every possible vector.',
    catchPhrases: [
      '"My reach spans all dimensions."',
      '"The queen protects her own, but must also be protected."',
      '"All paths lead to me, and I to all paths."',
      '"When I strike, the cosmos remembers."',
      '"I am not just power—I am potential itself."'
    ],
    lore: 'The Queen embodies the unified forces of chess—orthogonal and diagonal, a perfect synthesis of movement. Her presence transforms the board into a field of infinite possibility. Losing a queen is not merely losing a piece; it\'s losing the universal constant that holds the game together.',
    color: 'gold'
  },
  {
    name: 'King',
    symbol: '♚',
    characteristics: 'The singularity around which all orbits. Though his movement is limited, his survival is the only objective that transcends all others. Every move, every sacrifice, every strategy ultimately revolves around this gravitational center.',
    catchPhrases: [
      '"The universe ends when I fall."',
      '"Small steps to safety, surrounded by loyal guardians."',
      '"The weight of the cosmos rests on my shoulders."',
      '"I am the reason for all existence."',
      '"Survival is the only victory that matters."'
    ],
    lore: 'The King is the gravitational singularity of chess—the purpose behind every move, every sacrifice, every strategy. His castling is a quantum tunnel to safety, a desperate shift through spacetime when danger looms. Checkmate is not just capturing a piece; it\'s the collapse of the wavefunction, the end of all possible futures.',
    color: 'purple'
  }
]

const openingConcepts = [
  {
    title: 'The Open Game',
    icon: '🌅',
    description: 'When the center becomes a dimensional battlefield, the brave advance through the e-file. e4 and e5—these are the portals to chaos and glory, where space opens and pieces find their true vectors.',
    color: 'cyan'
  },
  {
    title: 'The Closed Game',
    icon: '🏰',
    description: 'Fortresses built before the first quantum fluctuation. d4 and d5—structures that define the spacetime of the battle. The closed game is a war of positional accumulation, won by those who can build the strongest dimensional barriers.',
    color: 'purple'
  },
  {
    title: 'The Sacrifice',
    icon: '💫',
    description: 'The greatest victories require the greatest energy expenditure. When matter converts to tactical advantage, the board remembers. Sacrifice is the alchemy of chess—transmuting pieces into position.',
    color: 'gold'
  },
  {
    title: 'The Gambit',
    icon: '🎲',
    description: 'Offer a pawn to gain the initiative, a tempo, an advantage in spacetime. The bold player understands that sometimes you must give to receive. The gambit is the quantum gambit—probability favoring the brave.',
    color: 'cyan'
  }
]

const specialMoments = [
  {
    title: 'The Back Rank Mate',
    icon: '⚡',
    description: 'The castle crumbles when the king has nowhere to tunnel. The rook\'s final checkmate—swift, merciless, inevitable. The back rank is where royal dreams collapse into singularities.',
    color: 'gold'
  },
  {
    title: 'The Fork',
    icon: '🔱',
    description: 'A knight\'s quantum superposition—two pieces threatened, one saved at best. The cruel mathematics of probability. The fork teaches that positioning creates multiplicative force.',
    color: 'cyan'
  },
  {
    title: 'The Pin',
    icon: '📌',
    description: 'Bound by quantum entanglement, a piece cannot move. The sniper\'s aim holds more than the target can bear. The pin is dimensional warfare—the art of freezing enemies in their tracks.',
    color: 'purple'
  },
  {
    title: 'The Discovery',
    icon: '🔭',
    description: 'When one piece moves, another reveals its hidden potential. The shadow that was always there, waiting to strike. The discovery is the art of unveiling hidden dimensions.',
    color: 'cyan'
  },
  {
    title: 'The Checkmate',
    icon: '👑',
    description: 'The war ends when the king collapses. All sacrifices, all plans, all courage lead to this moment. Checkmate is both the end and the beginning—the resolution of all quantum states.',
    color: 'gold'
  }
]

const storyThemes = [
  { name: 'Ascension and Sacrifice', icon: '⬆️', description: 'Pieces give themselves for the greater dimensional harmony. Every conversion of matter serves the ultimate geometry of victory.', color: 'cyan' },
  { name: 'Strategy and Foresight', icon: '🔮', description: 'Plans unfold across moves like wavefunctions evolving. The master sees five moves ahead, the novice sees only the present position.', color: 'purple' },
  { name: 'The Underdog\'s Journey', icon: '🌟', description: 'Pawns dreaming of promotion, knights proving their worth against queens, kings fighting alone in the endgame vacuum.', color: 'gold' },
  { name: 'The Beauty of Combination', icon: '🔗', description: 'Multiple pieces working in quantum harmony, the perfect sequence where each contributes to checkmate. The symphony of force.', color: 'cyan' },
  { name: 'The King\'s Lonely Burden', icon: '👑', description: 'All depends on one—the king who must survive while others can transform. The weight of being the universal constant.', color: 'purple' },
  { name: 'Honor in Defeat', icon: '🛡️', description: 'A game played with dignity even when lost. Some battles are more about the journey than the outcome.', color: 'gold' },
  { name: 'The Legend Born', icon: '⚔️', description: 'A single move that defines a piece for eternity. The moment when a particle becomes a wave, a soldier becomes a hero.', color: 'cyan' },
]

function getColorStyle(color: string) {
  const colors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
    cyan: {
      text: 'var(--neon-cyan)',
      border: 'rgba(0, 245, 255, 0.3)',
      bg: 'rgba(0, 245, 255, 0.1)',
      glow: '0 0 20px rgba(0, 245, 255, 0.2)'
    },
    purple: {
      text: 'var(--neon-purple)',
      border: 'rgba(184, 41, 221, 0.3)',
      bg: 'rgba(184, 41, 221, 0.1)',
      glow: '0 0 20px rgba(184, 41, 221, 0.2)'
    },
    gold: {
      text: 'var(--neon-gold)',
      border: 'rgba(255, 215, 0, 0.3)',
      bg: 'rgba(255, 215, 0, 0.1)',
      glow: '0 0 20px rgba(255, 215, 0, 0.2)'
    }
  }
  return colors[color] || colors.cyan
}

export default function LorePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <main className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1
              className="mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 50%, var(--neon-gold) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(0, 245, 255, 0.2)',
              }}
            >
              The Cosmic Codex
            </h1>
            <p
              className="max-w-2xl mx-auto text-xl"
              style={{
                color: 'var(--moon-glow)',
                lineHeight: '1.8',
              }}
            >
              In the eternal dance across the sixty-four squares of spacetime, each piece possesses its own quantum signature, purpose, and voice. 
              Their stories intertwine through countless dimensional battles, creating legends whispered across the multiverse.
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div 
                className="h-px w-24"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--neon-cyan))',
                }}
              />
              <div 
                className="w-3 h-3 rotate-45"
                style={{
                  background: 'var(--neon-cyan)',
                  boxShadow: '0 0 15px var(--neon-cyan)',
                }}
              />
              <div 
                className="h-px w-24"
                style={{
                  background: 'linear-gradient(90deg, var(--neon-cyan), transparent)',
                }}
              />
            </div>
          </div>

          {/* Pieces Section */}
          <div className="space-y-8 mb-20">
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-cyan)',
                textShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
              }}
            >
              ✨ The Six Quantum Forces
            </h2>
            
            {pieces.map((piece) => {
              const colors = getColorStyle(piece.color)
              return (
                <div
                  key={piece.name}
                  className="rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 10px 40px rgba(0, 0, 0, 0.3), ${colors.glow}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.text
                    e.currentTarget.style.boxShadow = `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px ${colors.text.replace('var(', 'rgba(').replace(')', ', 0.3)')}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border
                    e.currentTarget.style.boxShadow = `0 10px 40px rgba(0, 0, 0, 0.3), ${colors.glow}`
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="text-6xl transition-transform duration-300"
                      style={{
                        color: colors.text,
                        filter: `drop-shadow(0 0 20px ${colors.text.replace('var(', 'rgba(').replace(')', ', 0.5)')})`,
                      }}
                    >
                      {piece.symbol}
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: colors.text,
                      }}
                    >
                      {piece.name}
                    </h2>
                  </div>

                  <div className="mb-6">
                    <h3
                      className="mb-3 text-lg font-semibold"
                      style={{
                        color: 'var(--neon-cyan)',
                      }}
                    >
                      Quantum Characteristics
                    </h3>
                    <p style={{ color: 'var(--moon-glow)', lineHeight: '1.7' }}>
                      {piece.characteristics}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3
                      className="mb-3 text-lg font-semibold"
                      style={{
                        color: 'var(--neon-gold)',
                      }}
                    >
                      Sacred Mantras
                    </h3>
                    <ul className="space-y-2">
                      {piece.catchPhrases.map((phrase, index) => (
                        <li
                          key={index}
                          className="transition-all duration-300 pl-4 border-l-2 hover:pl-6"
                          style={{
                            color: 'var(--moon-glow)',
                            fontStyle: 'italic',
                            borderColor: colors.border,
                          }}
                        >
                          {phrase}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3
                      className="mb-3 text-lg font-semibold"
                      style={{
                        color: 'var(--neon-purple)',
                      }}
                    >
                      Cosmic Lore
                    </h3>
                    <p style={{ color: 'var(--moon-glow)', lineHeight: '1.7' }}>
                      {piece.lore}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Opening Concepts Section */}
          <div className="mb-20">
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-gold)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              }}
            >
              🌌 Opening Portals
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {openingConcepts.map((concept) => {
                const colors = getColorStyle(concept.color)
                return (
                  <div
                    key={concept.title}
                    className="rounded-xl p-6 transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(26, 26, 46, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.text
                      e.currentTarget.style.boxShadow = colors.glow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.border
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <h3
                      className="mb-3 text-xl font-bold flex items-center gap-2"
                      style={{
                        color: colors.text,
                      }}
                    >
                      <span>{concept.icon}</span> {concept.title}
                    </h3>
                    <p
                      className="italic"
                      style={{
                        color: 'var(--moon-glow)',
                        lineHeight: '1.7',
                      }}
                    >
                      {concept.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Special Moments Section */}
          <div className="mb-20">
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-cyan)',
                textShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
              }}
            >
              ⚡ Critical Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialMoments.map((moment) => {
                const colors = getColorStyle(moment.color)
                return (
                  <div
                    key={moment.title}
                    className="rounded-xl p-6 transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(26, 26, 46, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.text
                      e.currentTarget.style.boxShadow = colors.glow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.border
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <h3
                      className="mb-3 text-lg font-bold flex items-center gap-2"
                      style={{
                        color: colors.text,
                      }}
                    >
                      <span>{moment.icon}</span> {moment.title}
                    </h3>
                    <p
                      className="italic text-sm"
                      style={{
                        color: 'var(--moon-glow)',
                        lineHeight: '1.6',
                      }}
                    >
                      {moment.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Story Themes Section */}
          <div>
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-purple)',
                textShadow: '0 0 20px rgba(184, 41, 221, 0.3)',
              }}
            >
              🎭 Cosmic Narratives
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {storyThemes.map((theme) => {
                const colors = getColorStyle(theme.color)
                return (
                  <div
                    key={theme.name}
                    className="rounded-xl p-6 transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(26, 26, 46, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.text
                      e.currentTarget.style.boxShadow = colors.glow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.border
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <h3
                      className="mb-3 text-lg font-bold flex items-center gap-2"
                      style={{
                        color: colors.text,
                      }}
                    >
                      <span>{theme.icon}</span> {theme.name}
                    </h3>
                    <p
                      style={{
                        color: 'var(--moon-glow)',
                        lineHeight: '1.6',
                      }}
                    >
                      {theme.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer decoration */}
          <div className="flex justify-center gap-2 mt-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i === 2 ? 'var(--neon-gold)' : 'var(--neon-cyan)',
                  opacity: i === 2 ? 1 : 0.5,
                  boxShadow: i === 2 ? '0 0 15px var(--neon-gold)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
