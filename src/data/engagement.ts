import type { EvidenceLabel, Learning } from './evidence'

/**
 * Chapter 11 — market engagement (Stage 4 · Validation).
 * Other universities are shown only as individual student accounts: never as customers,
 * partners or pilot participants.
 */

export const imperialContact = {
  title: 'Imperial Careers demonstration',
  statement:
    'An Imperial Careers team contact welcomed the demonstration and offered to raise Orbit with the executive director.',
  caveat: 'A stakeholder statement, not independently verified, and not a commitment to buy or pilot.',
}

export const otherStudentAccounts = [
  { id: 'lse', name: 'LSE' },
  { id: 'kcl', name: 'King’s College London' },
  { id: 'ucl', name: 'UCL' },
  { id: 'lbs', name: 'London Business School' },
] as const

export const otherStudentDisclaimer =
  'Reported student examples of similar challenges — not evidence of university-wide prevalence or institutional demand.'

export type JourneyState = 'happened' | 'potential' | 'possible' | 'next'

export const journeyStateMeta: Record<JourneyState, { label: string; color: string; dashed: boolean }> = {
  happened: { label: 'Happened', color: 'var(--color-ev-reported)', dashed: false },
  potential: { label: 'Potential', color: 'var(--color-amber)', dashed: true },
  possible: { label: 'Possible', color: 'var(--color-st-untested)', dashed: true },
  next: { label: 'Not yet reached', color: 'var(--color-st-untested)', dashed: true },
}

export const imperialJourney: { id: string; label: string; state: JourneyState; note: string }[] = [
  { id: 'contact', label: 'Initial contact', state: 'happened', note: 'An Imperial Careers team contact.' },
  { id: 'demo', label: 'Product demonstration', state: 'happened', note: 'The contact welcomed the demonstration.' },
  { id: 'champion', label: 'Potential internal champion', state: 'potential', note: 'There may be one; not confirmed.' },
  { id: 'exec', label: 'Possible executive-level discussion', state: 'possible', note: 'Offered to raise Orbit with the executive director.' },
  { id: 'procurement', label: 'Technical and procurement questions', state: 'next', note: 'Expected if the conversation progresses.' },
]

export const whatWeLearned = [
  'There may be an internal champion.',
  'Symplicity reportedly provides live data.',
  'IB Connect may have a one-day feed delay.',
  'Integration could require ICT approval, due diligence and procurement.',
  'Institutional interest does not establish willingness to pay.',
]

export const whatRemainsUnknown = [
  'Budget ownership',
  'Acceptable price',
  'Authorised integration',
  'Security requirements',
  'Supplier permissions and costs',
  'Paid pilot commitment',
  'Renewal conditions',
]

export type RungState = 'observed' | 'partial' | 'reported' | 'not-reached'

export const ladder: { id: string; label: string; state: RungState; tag?: EvidenceLabel; stateText: string; note: string }[] = [
  { id: 'student', label: 'Student reports', state: 'observed', tag: 'observed', stateText: 'Observed', note: 'Survey (n = 42) and interviews (n = 13).' },
  { id: 'walk', label: 'Product walkthrough', state: 'partial', stateText: 'In progress · partial', note: 'Walkthrough testing under way.' },
  { id: 'buyer', label: 'Buyer interest', state: 'reported', tag: 'reported', stateText: 'Reported · early', note: 'One Imperial Careers contact.' },
  { id: 'pilot', label: 'Authorised pilot', state: 'not-reached', stateText: 'Not reached', note: 'No authorised pilot exists.' },
  { id: 'paid', label: 'Paid contract', state: 'not-reached', stateText: 'Not reached', note: 'No price or contract agreed.' },
  { id: 'renew', label: 'Renewal', state: 'not-reached', stateText: 'Not reached', note: 'Nothing yet to renew.' },
]

export const prototypeTesting = {
  status: 'Walkthrough testing in progress',
  task: 'Find an event you would actually attend next week and show us how you would register.',
  measures: [
    { key: 'unaidedCompletion', label: 'Unaided completion' },
    { key: 'relevantEventFound', label: 'Relevant event found' },
    { key: 'availabilityMatch', label: 'Availability match' },
    { key: 'redirectReached', label: 'Original registration page reached' },
    { key: 'friction', label: 'Friction or confusion encountered' },
  ] as const,
  pending: 'Verified results will be inserted when available.',
  caution: 'Successful first-use tasks do not prove weekly retention or increased attendance.',
}

export const engagementLearning: Learning = {
  believed: 'Institutional interest would signal demand.',
  investigated: 'Cross-campus student accounts and an Imperial Careers demonstration.',
  learned: 'A possible champion, real integration and procurement hurdles, and no willingness-to-pay evidence.',
  changed: 'Business-model assumptions revised around budget ownership and authorised data access.',
}
