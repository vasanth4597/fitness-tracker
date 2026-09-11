// ─── Fitness Tracker · Design Tokens ────────────────────────────────────────

export const colors = {
  // Backgrounds
  bg: '#0A0A0F',
  bgCard: 'rgba(255,255,255,0.05)',
  bgCardHover: 'rgba(255,255,255,0.09)',
  bgInput: 'rgba(255,255,255,0.08)',

  // Borders
  border: 'rgba(255,255,255,0.10)',
  borderFocus: '#00FF87',

  // Accent – neon green
  primary: '#00FF87',
  primaryDark: '#00C853',
  primaryMuted: 'rgba(0,255,135,0.15)',

  // Secondary – vivid purple
  secondary: '#7C4DFF',
  secondaryMuted: 'rgba(124,77,255,0.15)',

  // Semantic
  danger: '#FF5252',
  warning: '#FFB300',
  success: '#00E676',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.60)',
  textMuted: 'rgba(255,255,255,0.35)',

  // Stat colours
  steps: '#00FF87',
  calories: '#FF5252',
  distance: '#7C4DFF',
  duration: '#FFB300',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  full: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const font = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
    black: '900' as const,
  },
};

export const shadow = {
  card: {
    shadowColor: '#00FF87',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: {
    shadowColor: '#00FF87',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  subtle: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
};
