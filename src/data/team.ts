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
  // ≈ 2 min each for a 12 min 15 s talk (see chapters.ts durationSec)
  question: 'swayam', // 55
  origin: 'swayam', // 25
  screening: 'swayam', // 40  → 120 s
  'what-students-told-us': 'lyn', // 70
  'product-decisions': 'lyn', // 55  → 125 s
  jtbd: 'ilham', // 30
  product: 'ilham', // 60
  'who-pays': 'ilham', // 30  → 120 s
  'lean-canvas': 'juan', // 35
  viability: 'juan', // 85  → 120 s
  'market-engagement': 'sabrina', // 40
  walkthroughs: 'sabrina', // 40
  experiment: 'sabrina', // 45  → 125 s
  gates: 'rong', // 35
  scale: 'rong', // 20
  verdict: 'rong', // 70  → 125 s
}
