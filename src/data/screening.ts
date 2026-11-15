import type { Learning } from './evidence'

/**
 * Chapter 02 — Week 2 NVC screening (S1). Five questions, each weighted 20%.
 * Scores are the team's own screening judgements — not validated measurements.
 */
export const SCREEN_WEIGHT = 0.2

export interface Criterion {
  id: string
  q: number
  question: string
  name: string
  score: number
  rationale: string
}

export const criteria: Criterion[] = [
  {
    id: 'founder',
    q: 1,
    question: 'Am I the right person to do this?',
    name: 'Founder advantage',
    score: 4,
    rationale: 'Experience in entrepreneurship, business development and programme management; direct access to Imperial students; familiarity with the education ecosystem.',
  },
  {
    id: 'payment',
    q: 2,
    question: 'Will someone pay for it?',
    name: 'Customer payment',
    score: 2,
    rationale: 'University subscriptions were an initial possibility; no institutional purchasing evidence at this stage.',
  },
  {
    id: 'market',
    q: 3,
    question: 'Is the market large enough?',
    name: 'Market size',
    score: 4,
    rationale: 'Potential applicability beyond Imperial; commercial market size still needed investigation.',
  },
  {
    id: 'access',
    q: 4,
    question: 'Can customers be reached?',
    name: 'Customer accessibility',
    score: 5,
    rationale: 'Student cohorts and university networks enabled initial discovery.',
  },
  {
    id: 'tech',
    q: 5,
    question: 'Can the product or service be built?',
    name: 'Technical feasibility',
    score: 4,
    rationale: 'A discovery interface appeared buildable; data rights, coverage and integration scalability remained uncertain.',
  },
]

export const weighted = (c: Criterion) => c.score * SCREEN_WEIGHT
export const screeningTotal = criteria.reduce((s, c) => s + weighted(c), 0)
export const lowest = criteria.reduce((a, b) => (b.score < a.score ? b : a))

export const verdict = 'GO — INVESTIGATE FURTHER'
export const verdictNote = 'The 3.8 score is a screening judgement, not a validated commercial success score.'
export const closingLine = 'Our access to students justified research. It did not yet justify a business.'

export const screeningLearning: Learning = {
  believed: 'The opportunity looked attractive from the inside.',
  investigated: 'Five Week 2 screening questions, equally weighted.',
  learned: 'Access and feasibility were strong; willingness to pay was weakest.',
  changed: 'Proceed to discovery, focused on whether the problem is shared and who might pay.',
}

/** Present-mode one-line rationales — the full rationale above stays in Explore. */
export const shortRationale: Record<string, string> = {
  founder: 'Direct student access plus venture experience.',
  payment: 'No institutional purchasing evidence yet.',
  market: 'Applies beyond Imperial; size still unproven.',
  access: 'Student cohorts and university networks.',
  tech: 'Buildable; data rights and coverage uncertain.',
}
export const weakShort = 'Willingness to pay is the weak link.'
