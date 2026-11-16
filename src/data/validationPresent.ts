/**
 * Present-mode (pitch) phrases for the Validation chapters (11–13). Every long original lives
 * untouched in engagement.ts / walkthroughs.ts / pilot.ts and still appears in Explore mode.
 */

/* ---------- Market engagement ---------- */

export const engagementShort = {
  imperialTitle: 'Imperial Careers',
  imperialLine: 'One contact welcomed a demonstration.',
  imperialTag: 'Not a commitment',
  othersTitle: 'Other London students',
  othersLine: 'Individual accounts of the same frustration.',
  othersTag: 'Not customers or partners',
  ladderNote: 'One contact is interest, not payment. No pilot, contract or renewal exists.',
}

export const engagementStrip = {
  believed: 'Interest signals demand',
  learned: 'Champion possible; no payment evidence',
  changed: 'Model rebuilt around budget owner',
}

/* ---------- Walkthroughs ---------- */

export const walkthroughShort = {
  taskLabel: 'The one neutral task',
  measuresLabel: 'We watched for',
  streamsLabel: 'Four kinds of evidence',
  product: 'Product evidence',
  honestHero: 'Partial support.',
  honestAccent: 'Not proof they will return.',
  pilotNeeded: 'Needs the pilot',
}

/** What kind of evidence each stream is (shown on the strip). */
export const streamKind: Record<string, string> = {
  survey: 'Problem',
  interviews: 'Problem',
  walkthroughs: 'Product',
  institution: 'Buyer',
}

/* ---------- Pilot ---------- */

export const pilotPresent = {
  banner: 'Proposed — not yet run',
  source: 'Proposed design (S3, S4, S6). Not a report of completed pilot results.',
}

/* ---------- Gates ---------- */

export const gatesPresent = {
  illustrativeLine: 'Targets are illustrative, not fixed benchmarks. Final thresholds are set after each university’s baseline and agreed with its stakeholders.',
  framework: 'A structured decision framework, not a guarantee.',
  step1Lead: 'Three outcomes,',
  step1Accent: 'one rule each.',
}

export const verdictShort: Record<'GO' | 'ITERATE' | 'STOP', { label: string; rule: string }> = {
  GO: { label: 'GO', rule: 'Students return, listings hold up, attendance improves, costs work, the buyer renews.' },
  ITERATE: { label: 'ITERATE', rule: 'Inconclusive, or one testable fix: a single controlled retest.' },
  STOP: { label: 'STOP', rule: 'Weak repeat use, no authorised data, or buyers reject viable terms.' },
}

/** Gate tiles: threshold ring (0–100 scale) + label ≤ 4 words including the sub-label. */
export const gateTiles: { id: string; value: string; title: string; sub: string; ring: number | null }[] = [
  { id: 'activation', value: '≥ 40%', title: 'Activation', sub: 'of invited', ring: 40 },
  { id: 'wau', value: '≥ 20%', title: 'Weekly active', sub: 'of activated', ring: 20 },
  { id: 'meaningful', value: '≥ 30%', title: 'Meaningful action', sub: 'of WAU', ring: 30 },
  { id: 'accuracy', value: '≥ 95%', title: 'Listing accuracy', sub: 'sampled', ring: 95 },
  { id: 'attendance', value: '+15%', title: 'Verified attendance', sub: 'vs baseline', ring: 15 },
  { id: 'renewal', value: 'Agreed', title: 'Paid renewal', sub: 'viable price', ring: null },
]
