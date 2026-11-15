/**
 * The six-member ACADEMIC project team. This is not the proposed operating-company
 * founder structure (see Chapter 15) — do not imply all six will found the company.
 */
export const team = {
  swayam: { name: 'Swayam Mundada', short: 'Swayam' },
  juan: { name: 'Juan Felipe Aljure', short: 'Juan' },
  sabrina: { name: 'Sabrina Infantino', short: 'Sabrina' },
  lyn: { name: 'Chia Lyn Lee', short: 'Chia Lyn' },
  ilham: { name: 'Muhammad Rifki Ilham', short: 'Rifki' },
  rong: { name: 'Rong Gao', short: 'Rong' },
} as const

export type PresenterId = keyof typeof team
export const presenterIds = Object.keys(team) as PresenterId[]

/**
 * DEFAULT speaker per chapter slug (master prompt §25). Editable live in the
 * Rehearsal view; overrides are stored per browser (localStorage) — see useSpeakers().
 */
export const defaultSpeakers: Record<string, PresenterId> = {
  question: 'swayam',
  origin: 'swayam',
  screening: 'sabrina',
  'learning-before-building': 'lyn',
  'what-students-told-us': 'lyn',
  'assumptions-changed': 'rong',
  jtbd: 'ilham',
  product: 'swayam',
  'who-pays': 'sabrina',
  'lean-canvas': 'sabrina',
  viability: 'juan',
  'market-engagement': 'sabrina',
  coaching: 'rong',
  experiment: 'rong',
  scale: 'ilham',
  verdict: 'swayam',
}
