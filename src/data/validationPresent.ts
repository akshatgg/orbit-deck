/**
 * Present-mode (pitch) phrases for chapters 11–13. Every long original lives untouched in
 * engagement.ts / coaching.ts / pilot.ts and still appears in Explore mode.
 */

/* ---------- Ch11 ---------- */

export const engagementShort = {
  step0: 'One Imperial contact welcomed the demonstration.',
  step0Tag: 'Not a commitment',
  step1: 'Same problem, elsewhere.',
  step1Line: 'Student accounts, not customers, partners or demand.',
  step2: 'Two things happened. Everything after is still open.',
  step3: 'Three rungs lit. Three still dark.',
}

export const journeyShortLabels: Record<string, string> = {
  contact: 'Contact',
  demo: 'Demo',
  champion: 'Champion?',
  exec: 'Executive talk?',
  procurement: 'Procurement',
}

export const engagementStrip = {
  believed: 'Interest signals demand',
  learned: 'Champion possible; no payment evidence',
  changed: 'Model rebuilt around budget owner',
}

/* ---------- Ch12 ---------- */

export const coachingShort: { id: string; tag: string; challenge: string; decision: string }[] = [
  { id: 'same-business', tag: 'Same business?', challenge: 'Different customers, different economics.', decision: 'University SaaS is the core; organiser model waits.' },
  { id: 'pilot-success', tag: 'Pilot success?', challenge: 'Success was too vague to ever fail.', decision: 'Define cohort, engagement, accuracy, attendance, renewal criteria.' },
  { id: 'stop', tag: 'When to stop?', challenge: 'No failure condition existed.', decision: 'Write GO / ITERATE / STOP rules before testing.' },
  { id: 'financials', tag: 'Assumptions?', challenge: 'Forecasts need sources others can challenge.', decision: 'Expose the arithmetic, discounting and sensitivities.' },
  { id: 'consumer', tag: 'Path to consumer?', challenge: 'No proven path from universities to consumers.', decision: 'Universities first; external discovery stays a hypothesis.' },
]

export const coachingPresent = {
  intro: 'Five questions. Each one changed a decision.',
  endLead: 'It did not say we would succeed.',
  endAccent: 'It clarified what to prove.',
  source: 'S6 · critique, not validation.',
}

export const coachingStrip = {
  believed: 'A broad event product was coherent',
  learned: 'No success definition, no stop rule',
  changed: 'University-first SaaS with GO / ITERATE / STOP gates',
}

/* ---------- Ch13 ---------- */

export const pilotTrackLabels = ['Budget owner', 'Fee & renewal', 'Data access', 'Baseline', 'Cohort', 'Observe', 'Evaluate', 'Decide']

export const pilotPresent = {
  banner: 'Proposed — not run',
  step0Lead: 'One paid, controlled',
  step0Accent: '8–12-week pilot',
  step0Tail: 'at Imperial.',
  step1Lead: 'What would',
  step1Accent: 'real engagement',
  step1Tail: 'look like?',
  step1Note: 'Illustrative cohort, not a university-wide requirement.',
  step2Lead: 'Six gates, set',
  step2Accent: 'before any result.',
  step2Chip: 'A click is not attendance.',
  endLead: 'The next milestone is not more features.',
  endAccent: 'It is stronger evidence.',
  source: 'Proposed design (S3, S4, S6). No pilot results exist.',
}

/** Gate tiles: threshold ring (0–100 scale) + label ≤ 4 words including the sub-label. */
export const gateTiles: { id: string; value: string; title: string; sub: string; ring: number | null }[] = [
  { id: 'activation', value: '≥ 40%', title: 'Activation', sub: 'of invited', ring: 40 },
  { id: 'wau', value: '≥ 20%', title: 'Weekly active', sub: 'of activated', ring: 20 },
  { id: 'meaningful', value: '≥ 30%', title: 'Meaningful action', sub: 'of WAU', ring: 30 },
  { id: 'accuracy', value: '≥ 95%', title: 'Listing accuracy', sub: 'sampled', ring: 95 },
  { id: 'attendance', value: '+15%', title: 'Attendance uplift', sub: 'verified, relative', ring: 15 },
  { id: 'renewal', value: 'Agreed', title: 'Paid renewal', sub: 'viable price', ring: null },
]

export const pilotStrip = {
  believed: 'A good demo would justify going on',
  learned: 'Evidence must be defined before the pilot',
  changed: 'One paid, controlled pilot with stop rules',
}
