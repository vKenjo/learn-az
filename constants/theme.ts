export const COLORS = {
  pink: {
    hot: '#f72585',
    deep: '#b5179e',
  },
  purple: {
    vivid: '#7209b7',
    dark: '#560bad',
  },
  indigo: {
    deep: '#480ca8',
    DEFAULT: '#3a0ca3',
  },
  blue: {
    vivid: '#3f37c9',
    DEFAULT: '#4361ee',
    light: '#4895ef',
  },
  cyan: '#4cc9f0',
  bg: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a2e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255,255,255,0.7)',
    muted: 'rgba(255,255,255,0.4)',
  },
  // Semantic
  correct: '#4cc9f0',
  incorrect: '#f72585',
  warning: '#ffc107',
  orange: '#fb8500',
  white: '#ffffff',
} as const;

export const Fonts = {
  rounded: 'System',
  mono: 'Courier',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: COLORS.pink.hot,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: COLORS.pink.hot,
  },
  dark: {
    text: '#ECEDEE',
    background: COLORS.bg.primary,
    tint: COLORS.white || '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: COLORS.white || '#fff',
  },
};
