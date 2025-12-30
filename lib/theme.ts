export const COLORS = {
  lightWood: '#D4A373',
  goldenWood: '#C19A6B',
  darkWood: '#8B4513',
  deepBrown: '#6B3410',
  veryDarkBrown: '#2C1810',
  mediumBrown: '#A0522D',
  cream: '#F5F0E6',
  parchment: '#EEE8D3',
  lightParchment: '#E8C9A0',
  red: '#DC2626',
  green: '#22C55E',
  blue: '#3B82F6',
  purple: '#A855F7',
  yellow: '#EAB308',
  white: '#FFFFFF',
} as const

export const GRADIENTS = {
  header: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
  footer: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
  button: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
  cardLight: 'linear-gradient(135deg, #F5F0E6 0%, #EEE8D3 100%)',
  cardMedium: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
  cardDark: 'linear-gradient(135deg, #C19A6B 0%, #8B4513 100%)',
  cardBishop: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
  cardQueen: 'linear-gradient(135deg, #D4A373 0%, #8B4513 100%)',
  background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
  board: 'linear-gradient(135deg, #C19A6B 0%, #8B4513 100%)',
} as const

export const FONTS = {
  serif: 'var(--font-serif), Georgia, serif',
} as const

export const SHADOWS = {
  small: '0 4px 16px rgba(44, 24, 16, 0.1)',
  medium: '0 8px 32px rgba(44, 24, 16, 0.15)',
  large: '0 8px 32px rgba(44, 24, 16, 0.2)',
} as const
