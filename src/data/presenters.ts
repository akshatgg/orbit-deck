/**
 * Speaker allocation — PROVISIONAL. Edit this one file to reassign chapters.
 * Keys are chapter slugs from src/data/chapters.ts.
 */
export const team = {
  swayam: { name: 'Swayam Mundada', short: 'Swayam' },
  juan: { name: 'Juan Felipe Aljure', short: 'Juan' },
  sabrina: { name: 'Sabrina Infantino', short: 'Sabrina' },
  lyn: { name: 'Chia Lyn Lee', short: 'Lyn' },
  ilham: { name: 'Muhammad Rifki Ilham', short: 'Ilham' },
  rong: { name: 'Rong Gao', short: 'Romy' },
} as const

export type PresenterId = keyof typeof team

export const speakerAssignments: Record<string, PresenterId> = {
  opening: 'swayam',
  student: 'swayam',
  reframe: 'swayam',
  research: 'sabrina',
  reveal: 'swayam',
  product: 'swayam',
  'value-prop': 'lyn',
  'business-model': 'sabrina',
  market: 'ilham',
  gtm: 'ilham',
  financials: 'juan',
  risks: 'rong',
  pilot: 'rong',
  vision: 'swayam',
  team: 'rong',
  closing: 'swayam',
}
