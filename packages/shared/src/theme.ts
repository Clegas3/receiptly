import type { ReceiptCategory } from './types'

export const theme = {
  colors: {
    background: '#0b1320',
    surface: '#111a2b',
    surfaceAlt: '#141f33',
    border: '#1f2a3d',
    text: '#f5f7ff',
    muted: '#9aa4b2',
    accent: '#d8a84d',
    accentSoft: '#f3cf8b',
    danger: '#e46c6c',
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const

export const categoryColors: Record<ReceiptCategory, string> = {
  Food: '#f3cf8b',
  Travel: '#8bc4ff',
  Transport: '#7dd7c4',
  Office: '#c6a2ff',
  Entertainment: '#ff9bb3',
  Other: '#9aa4b2',
}
