const pieces = [
  {
    name: 'Pawn',
    symbol: '♟',
    characteristics: 'Humble yet ambitious, the pawn is the soul of the chess army. They march forward with unwavering determination, sacrificing themselves for greater goals. Each pawn dreams of promotion—of transcending their humble origins to become something greater. Though individually the weakest, they are the most numerous, their collective strength capable of toppling empires.',
    catchPhrases: [
      '"One step at a time, toward glory."',
      '"The smallest stone can start the greatest avalanche."',
      '"We are many, and we are relentless."',
      '"My promotion is not a dream—it is destiny."',
      '"The first rank is my beginning, not my end."'
    ],
    lore: 'Pawns are the heart of the kingdom. They form the living wall, the first line of defense and offense. Though individually weak, their collective strength can topple empires. When a pawn reaches the eighth rank, their transformation is more than promotion—it\'s ascension to legend. The pawn\'s march is the most heroic journey in all of chess.'
  },
  {
    name: 'Rook',
    symbol: '♜',
    characteristics: 'The castle stands firm. Rooks are guardians of territory, masters of straight lines and unwavering resolve. They command the files and ranks with authority, their presence felt across the entire board. Slow but unstoppable, the rook is the embodiment of absolute power.',
    catchPhrases: [
      '"I hold the line."',
      '"Straight and true, my aim never falters."',
      '"The castle stands while foundations remain."',
      '"Patience is the rook\'s greatest weapon."',
      '"When I move, the board trembles."'
    ],
    lore: 'Rooks are the ancient sentinels of the board, forged from the stone of fortresses past. They communicate in silent vibrations through the board, coordinating defenses and crushing advances alike. When rooks connect (the "rooks\' alliance"), their power becomes nearly unstoppable. The rook is the only piece that can survive on the board until the very end, always threatening, always dangerous.'
  },
  {
    name: 'Knight',
    symbol: '♞',
    characteristics: 'The unpredictable warrior. Knights dance through chaos, their L-shaped movements defying the laws of straight lines. Strategic, cunning, and always appearing where least expected, they are the masters of the surprise attack. Where other pieces march, the knight rides nightmares.',
    catchPhrases: [
      '"Two steps forward, one to the side—always an angle."',
      '"Predictability is for the slow."',
      '"The path to victory is never a straight line."',
      '"I don\'t see obstacles—I see opportunities."',
      '"While you march, I dance."'
    ],
    lore: 'Knights are the tricksters of the board, riding on nightmares that leap over obstacles. Their strange gait confuses enemies, allowing them to strike from unexpected quarters. They are immune to the crushing lines of rooks and queens, existing in the spaces between. A knight in the center of the board is a force of nature, controlling eight squares and threatening pieces that feel safe.'
  },
  {
    name: 'Bishop',
    symbol: '♝',
    characteristics: 'The spiritual guide. Bishops glide diagonally like spirits through the material world, their movements elegant and swift. They are pieces of light and shadow, each bound to their color since birth. While rooks control territory and knights create chaos, bishops operate on the invisible lines of influence.',
    catchPhrases: [
      '"I walk the diagonal path to truth."',
      '"Light and shadow, forever intertwined."',
      '"My sight pierces through all obstructions."',
      '"The diagonal is my kingdom."',
      '"While others see squares, I see futures."'
    ],
    lore: 'Bishops are the mystics of the chess realm, seeing patterns invisible to others. Though each bishop is confined to half the board, their wisdom flows through the diagonals like rivers of insight. When the two bishops unite ("the bishop pair"), they create a web of influence that few can escape. The bishop\'s greatest weapon is their range—a well-placed bishop can threaten squares that seem unreachable.'
  },
  {
    name: 'Queen',
    symbol: '♛',
    characteristics: 'The sovereign of all. The Queen commands every direction, combining the rook\'s straight lines with the bishop\'s diagonal grace. She is the most powerful piece, but also the most critical to protect. Her movements are a dance of calculated destruction—elegant, efficient, and utterly devastating.',
    catchPhrases: [
      '"My reach knows no boundaries."',
      '"The queen protects her own, but must also be protected."',
      '"All paths lead to me, and I to them."',
      '"When I strike, the board remembers."',
      '"Power requires responsibility."',
      '"I am the war."'
    ],
    lore: 'The Queen is the embodiment of chess itself—flexible, powerful, and irreplaceable. Her presence transforms the board, her movements a dance of calculated destruction. Losing a queen is not just losing a piece; it\'s losing the kingdom\'s heart. The queen\'s paradox is that she is both the most powerful piece and the one that must be most carefully protected. A queen in the open field is a force that can end games.'
  },
  {
    name: 'King',
    symbol: '♚',
    characteristics: 'The crown that must not fall. Though his movement is slow, his survival is the only objective that truly matters. The King is the prize that all other pieces exist to protect or capture. Every move on the board—every attack, every sacrifice, every strategy—ultimately revolves around the king.',
    catchPhrases: [
      '"The battle is lost when I fall."',
      '"Small steps to safety, surrounded by loyal guardians."',
      '"The weight of the kingdom rests on my shoulders."',
      '"I am the reason for all this."',
      '"Survival is the only victory that matters."',
      '"Every sacrifice is for me."'
    ],
    lore: 'The King is the purpose behind every move, every sacrifice, every strategy. His castling with the rook is a sacred ritual—a desperate flight to safety when danger looms. The checkmate is not just capturing a piece; it\'s ending the war. The king\'s paradox is that he is both the most important piece and the least powerful—he must survive through the efforts of all others. In the endgame, when most pieces are gone, the king becomes active, finally fighting for himself.'
  }
]

const openingConcepts = [
  {
    title: 'The Open Game',
    description: 'When the center becomes a battlefield, the brave souls advance. e4 and e5—they are the gateways to chaos and glory. The open game rewards those who strike first and strike hard.'
  },
  {
    title: 'The Closed Game',
    description: 'Queens and kings stand their ground. d4 and d5—fortresses built before the first shot is fired. The closed game is a war of attrition, won by those who can endure.'
  },
  {
    title: 'The Sacrifice',
    description: 'The greatest victories require the greatest risks. When a piece falls for future gain, the board remembers. Sacrifice is the language of legends.'
  },
  {
    title: 'The Gambit',
    description: 'Give a pawn to gain a position, a tempo, an advantage. The bold player understands that sometimes you must lose to win. The gambit is the brave soldier\'s declaration.'
  }
]

const specialMoments = [
  {
    title: 'The Back Rank Mate',
    description: 'The castle crumbles when the king has nowhere to hide. The rook\'s final checkmate—swift, merciless, inevitable. The back rank is where dreams go to die.'
  },
  {
    title: 'The Fork',
    description: 'A knight\'s deadly gift—two pieces threatened, one saved at best. The cruel mathematics of war. The fork teaches that numbers favor the clever.'
  },
  {
    title: 'The Pin',
    description: 'Bound by duty, a piece cannot move. The sniper\'s aim holds more than the soldier can bear. The pin is psychological warfare—the art of trapping your enemy in their own loyalty.'
  },
  {
    title: 'The Discovery',
    description: 'When one piece moves, another reveals its deadly purpose. The shadow that was always there, waiting. The discovery is the art of surprise.'
  },
  {
    title: 'The Checkmate',
    description: 'The war ends when the king falls. All sacrifices, all plans, all courage leads to this moment. Checkmate is both the end and the beginning of memory.'
  }
]

const storyThemes = [
  { name: 'War and Sacrifice', description: 'Pieces give themselves for the greater good. Every death serves a purpose, every fall is an offering to the king.' },
  { name: 'Strategy and Foresight', description: 'Plans unfold across moves, patience rewarded. The master sees five moves ahead, the apprentice sees only the next square.' },
  { name: 'The Underdog\'s Journey', description: 'Pawns dreaming of promotion, knights proving their worth against queens, kings fighting alone in the endgame.' },
  { name: 'Tragedy of Overextension', description: 'Ambition leading to downfall, pieces advancing too far and falling. The war teaches that pride comes before destruction.' },
  { name: 'The Beauty of Combination', description: 'Multiple pieces working in harmony, the perfect sequence where each piece contributes to checkmate. The symphony of war.' },
  { name: 'The King\'s Lonely Burden', description: 'All depends on one—the king who must survive while everyone else can die. The weight of being the reason for all this bloodshed.' },
  { name: 'Redemption Through Sacrifice', description: 'A piece that once failed finding redemption in a final sacrifice. The last chance to prove worth.' },
  { name: 'Honor in Defeat', description: 'A game played well even when lost. Some wars are more about dignity than victory.' },
  { name: 'The Legend Born', description: 'A single move that defines a piece for eternity. The moment when a soldier becomes a hero.' },
  { name: 'The Art of the Attack', description: 'The beautiful dance of attacking pieces, the rhythm of threats and counter-threats, the poetry of aggression.' },
  { name: 'Patience and Position', description: 'The quiet beauty of positional play, where every piece finds its perfect square. Not all wars are won with fireworks.' },
  { name: 'The Endgame\'s Mercy', description: 'When most pieces are gone and the king finally joins the fight. The final act of the drama.' }
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
