import { discoveryRelatedMisses, missCauses, otherInterviewSignals } from './research'

const forgot = missCauses.find((c) => c.id === 'forgot')!.value
const clash = missCauses.find((c) => c.id === 'clash')!.value
const wary = otherInterviewSignals[0].value

/**
 * Analytical evolution of the venture's assumptions (Chapter 05).
 * These cards describe how the evidence narrowed the concept — they are NOT dated pivots
 * and the feature labels are concept labels, not a historical feature list.
 */
export interface AssumptionShift {
  n: number
  short: string
  hypothesis: string
  evidence: string
  decision: string
  /** Present-mode phrasings (≤ 12 words each). Full wording above is kept for Explore. */
  p: { believed: string; evidence: string; decision: string }
}

export const assumptionShifts: AssumptionShift[] = [
  {
    n: 1,
    short: 'One more event app',
    hypothesis: 'Students need one more event app.',
    evidence: `${wary} interviewees were wary of adopting another system.`,
    decision: 'Orbit must reduce effort rather than create another task.',
    p: { believed: 'Students need one more event app.', evidence: `${wary} of 13 interviewees wary of another system.`, decision: 'Reduce effort. Do not add a task.' },
  },
  {
    n: 2,
    short: 'Public aggregation',
    hypothesis: 'Public event-platform aggregation could be enough.',
    evidence: 'University email, peers and social channels were more commonly reported than Luma or Fatsoma.',
    decision: 'Prioritise authorised university-event coverage and relevant sources.',
    p: { believed: 'Public-platform aggregation is enough.', evidence: 'Email, peers and social beat Luma and Fatsoma.', decision: 'Prioritise authorised university-event coverage.' },
  },
  {
    n: 3,
    short: 'Reminders',
    hypothesis: 'Reminders could prevent missed events.',
    evidence: `Only ${forgot} survey respondents identified forgetting as the main reason for their latest miss; ${discoveryRelatedMisses} cited late discovery, deadlines or full events.`,
    decision: 'Make timely discovery the core value proposition; keep reminders secondary.',
    p: { believed: 'Reminders will prevent missed events.', evidence: `Forgot: ${forgot} of 42. Discovery-related: ${discoveryRelatedMisses} of 42.`, decision: 'Timely discovery is core. Reminders are secondary.' },
  },
  {
    n: 4,
    short: 'Discovery is enough',
    hypothesis: 'Better discovery solves the missed-event problem.',
    evidence: `${clash} respondents reported timetable clashes.`,
    decision: 'Availability filters may help, but Orbit cannot eliminate conflicting commitments.',
    p: { believed: 'Better discovery solves missed events.', evidence: `${clash} of 42 missed events through timetable clashes.`, decision: 'Filters may help. Orbit cannot remove clashes.' },
  },
  {
    n: 5,
    short: 'Adoption will follow',
    hypothesis: 'Students experiencing fragmentation will adopt Orbit.',
    evidence: 'Existing workarounds are familiar and some interviewees reported little difficulty.',
    decision: 'Measure switching behaviour and weekly return use rather than assume adoption.',
    p: { believed: 'Fragmentation means students will adopt Orbit.', evidence: 'Workarounds are familiar; some reported little difficulty.', decision: 'Measure switching and weekly return. Do not assume.' },
  },
]

export type CoreKey = 'coverage' | 'relevance' | 'transparency' | 'redirect'

/** Concept labels for the "initial concept" cloud. `fadesAt` = card number after which it recedes. */
export const conceptFeatures: { label: string; fadesAt: number | null; core?: CoreKey }[] = [
  { label: 'Event feed', fadesAt: 1 },
  { label: 'Friend groups', fadesAt: 1 },
  { label: 'Interest communities', fadesAt: 1 },
  { label: 'Public event aggregation', fadesAt: 2 },
  { label: 'University sources', fadesAt: null, core: 'coverage' },
  { label: 'Reminders', fadesAt: 3 },
  { label: 'Availability filters', fadesAt: null, core: 'relevance' },
  { label: 'Calendar sync', fadesAt: 4 },
  { label: 'Social recommendations', fadesAt: 5 },
  { label: 'Source transparency', fadesAt: null, core: 'transparency' },
  { label: 'Ticketing', fadesAt: 5 },
  { label: 'Registration redirect', fadesAt: null, core: 'redirect' },
]

export const coreProposition: { key: CoreKey; label: string }[] = [
  { key: 'coverage', label: 'Accurate coverage' },
  { key: 'relevance', label: 'Relevant discovery' },
  { key: 'transparency', label: 'Source transparency' },
  { key: 'redirect', label: 'Original registration redirect' },
]

export const assumptionClosing = {
  shift: 'We moved from imagining an all-in-one events app to prioritising an accurate, low-friction discovery layer.',
  reframe: 'This is not failure. This is entrepreneurial learning.',
  note: 'These cards represent the analytical evolution of the venture, not dated pivots. Feature labels are concept labels, not a historical feature list.',
}
