import type { Learning } from './evidence'

/** Chapter 12 — the coaching session (source S6). A source of critique, not proof of validation. */

export interface CoachingChallenge {
  id: string
  question: string
  challenge: string
  implication: string
  decision: string
}

export const coachingChallenges: CoachingChallenge[] = [
  {
    id: 'same-business',
    question: 'Are the university product and public-events product actually the same business?',
    challenge: 'The university and organiser-funded models have different customers and economics.',
    implication: 'Two different payers cannot share one set of assumptions or one validation plan.',
    decision:
      'Keep B2B university SaaS as the core model; treat organiser-funded external discovery as a separate future hypothesis.',
  },
  {
    id: 'pilot-success',
    question: 'What would make the pilot a success?',
    challenge: 'Pilot success was not specific enough.',
    implication: 'Without a specific definition, almost any pilot outcome could be described as success.',
    decision:
      'Define an eligible student cohort, weekly engagement, source accuracy, attendance measurement and paid renewal criteria.',
  },
  {
    id: 'stop',
    question: 'What would make you stop?',
    challenge: 'There was no clear failure condition.',
    implication: 'With no stop rule, evidence could only ever confirm the idea, never end it.',
    decision: 'Introduce GO / ITERATE / STOP rules before testing.',
  },
  {
    id: 'financials',
    question: 'Where did your financial assumptions come from?',
    challenge: 'Forecasts need evidence and challengeable assumptions.',
    implication: 'Every figure needs a visible source and a way for others to change it.',
    decision:
      'Expose market-sizing arithmetic, acquisition mechanics, discounting, integration costs and sensitivities.',
  },
  {
    id: 'consumer',
    question: 'Can institutional growth realistically lead to wider consumer discovery?',
    challenge: 'The pathway from university expansion to external events was unclear.',
    implication: 'A consumer outcome cannot be assumed to follow from university growth; it has to be earned separately.',
    decision:
      'Complete five years of university-focused growth in the base strategy; only then investigate external-only discovery in cities where Orbit already operates.',
  },
]

export const versionComparison = {
  earlier: {
    label: 'Earlier proposition',
    text: 'Broad event aggregation and multiple monetisation possibilities.',
  },
  refined: {
    label: 'Refined proposition',
    text: 'University-first discovery SaaS with defined validation gates.',
  },
  note: 'The coaching session is a source of critique and refinement, not proof of market validation.',
  endLine: 'The coaching session did not tell us the venture would succeed. It clarified what we needed to prove.',
}

export const coachingLearning: Learning = {
  believed: 'A well-liked, broad event product with several revenue routes was a coherent venture.',
  investigated: 'Five coaching questions: business model, pilot success, failure conditions, financial assumptions, route to consumers.',
  learned: 'We had no defined success, no stop rule, and two different businesses described as one.',
  changed: 'University-first SaaS with defined validation gates and GO / ITERATE / STOP rules; external discovery held as a separate future hypothesis.',
}
