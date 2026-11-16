import { assumptions } from './assumptions'
import { statusMeta, type Status } from './evidence'
import { pricingTiers } from './market'
import { base2029 } from './financials'

/**
 * Living Lean Canvas (Stage 3 · Business Model Design). Source framing: NVC Week 3 (S2).
 * Every box carries a working hypothesis, the evidence we currently hold, an honest
 * evidence status, the next experiment and what would change our mind.
 * Statuses are never upgraded just because a prototype exists.
 */

const A = (id: string) => assumptions.find((a) => a.id === id)!
const k = (n: number) => `£${n / 1000}k`

/** Proposed pilot success thresholds (PROPOSED — not achieved results). */
export const pilotThresholds = [
  { id: 'activation', label: 'Activation', value: '40%', detail: 'of eligible students activate' },
  { id: 'wau', label: 'Weekly active use', value: '20%', detail: 'WAU among activated students' },
  { id: 'action', label: 'Meaningful action', value: '30%', detail: 'of WAU take a meaningful action' },
  { id: 'accuracy', label: 'Listing accuracy', value: '≥ 95%', detail: 'in sampled listings' },
  { id: 'attendance', label: 'Attendance', value: '+15%', detail: 'host-verified, per eligible student' },
  { id: 'renewal', label: 'Renewal', value: 'Paid', detail: 'the university pays to renew' },
] as const

export type CanvasId = 'problem' | 'segments' | 'uvp' | 'solution' | 'channels' | 'revenue' | 'cost' | 'metrics' | 'advantage'

export interface CanvasBox {
  id: CanvasId
  /** Lean Canvas box number (Maurya order used in the brief). */
  n: number
  name: string
  /** Step 0: short first-pass hypothesis shown on the box. */
  initial: string
  /** Step 1: short evidence line shown on the box. */
  current: string
  /** Detail drawer fields. */
  hypothesis: string
  evidence: string
  status: Status
  /** One line justifying the status chosen. */
  statusWhy: string
  nextExperiment: string
  wouldChange: string
}

export const canvasBoxes: CanvasBox[] = [
  {
    id: 'problem',
    n: 1,
    name: 'Problem',
    initial: 'Event discovery is fragmented, so students miss relevant events.',
    current: 'Initial support within the research sample.',
    hypothesis: 'Students find out about events through scattered, uneven channels, so relevant events are missed or found too late.',
    evidence: A('A1').evidence,
    status: 'supported',
    statusWhy: 'Supported only within our own research sample (survey n = 42, interviews n = 13). It is a problem hypothesis, not proof of demand for Orbit.',
    nextExperiment: A('A1').nextTest,
    wouldChange: 'If a baseline in an eligible pilot cohort showed students rarely miss events, or already served well by existing channels, we would downgrade this.',
  },
  {
    id: 'segments',
    n: 2,
    name: 'Customer segments',
    initial: 'Imperial students first; universities as the paying customer.',
    current: 'Imperial students are accessible; wider institutional demand is unquantified.',
    hypothesis: 'Users: students, starting at Imperial, and free to them. Paying customer: a university team that owns student engagement or careers.',
    evidence: `Imperial students are accessible to us. ${A('A2').evidence} Broader institutional demand remains unquantified.`,
    status: 'inconclusive',
    statusWhy: 'Access to one cohort is established; the size and existence of institutional demand beyond it is not.',
    nextExperiment: `${A('A2').nextTest} Also identify the institutional budget owner.`,
    wouldChange: 'If students elsewhere do not report the same problem, or no institution has a clear budget owner for this, the segment would narrow or be dropped.',
  },
  {
    id: 'uvp',
    n: 3,
    name: 'Unique value proposition',
    initial: 'Every relevant opportunity, in one place, early enough to act.',
    current: 'Relevance and timeliness look meaningful; switching and adoption untested.',
    hypothesis: 'One trusted, relevant feed that shows each event’s source and sends students to the original registration page, so they act earlier.',
    evidence: 'Student research suggests relevance and timeliness matter. Whether students would switch from existing habits, or keep using a new feed, has not been tested.',
    status: 'inconclusive',
    statusWhy: 'Some signal on what matters to students; no evidence yet on switching or sustained adoption.',
    nextExperiment: 'Finish neutral walkthrough tests, then measure activation and weekly use in a paid pilot against the proposed thresholds.',
    wouldChange: 'If activation and weekly use fall well short of the thresholds, we would reframe or narrow the proposition.',
  },
  {
    id: 'solution',
    n: 4,
    name: 'Solution',
    initial: 'A personalised feed that links out to each event’s original page.',
    current: 'Prototype shows the interaction; live coverage and repeat use unvalidated.',
    hypothesis: 'A discovery layer that aggregates university events into a personalised feed and redirects to the original registration page. It sits on top of existing systems.',
    evidence: 'A prototype demonstrates the proposed interaction using sample events. Live data coverage, listing accuracy and repeat usage are unvalidated. A prototype existing is not evidence that it works for users.',
    status: 'inconclusive',
    statusWhy: 'Kept at inconclusive: the interaction is demonstrable, but nothing about live operation or usage is verified.',
    nextExperiment: 'Complete walkthroughs with verified outcomes, then obtain authorised data access and sample listing accuracy against the ≥ 95% threshold.',
    wouldChange: 'If listing accuracy is below 95%, or authorised integration is not possible, the live-feed approach would have to be rescoped.',
  },
  {
    id: 'channels',
    n: 5,
    name: 'Channels',
    initial: 'Start via Imperial networks, then reach other universities.',
    current: 'Networks give initial access; institutional acquisition untested.',
    hypothesis: 'Use Imperial networks for discovery and a first pilot, find a student-engagement or careers champion, confirm the budget owner, then use documented pilot results to approach other institutions.',
    evidence: `University networks give us initial access. ${A('A3').evidence} Scalable institutional acquisition has not been attempted.`,
    status: 'untested',
    statusWhy: 'Chosen as untested rather than inconclusive: access to students is not an acquisition channel, and the channel the revenue model needs (institutional sales) has no results yet.',
    nextExperiment: 'Run the acquisition path once end to end at Imperial: champion, budget owner, authorised data access, then a measurable pilot.',
    wouldChange: 'If no institution beyond a first champion engages, or sales take far longer than assumed, the channel and the customer funnel would be rebuilt.',
  },
  {
    id: 'revenue',
    n: 6,
    name: 'Revenue streams',
    initial: `University-funded subscription: ${k(pricingTiers[0].price)} / ${k(pricingTiers[1].price)} / ${k(pricingTiers[2].price)} a year. Free for students.`,
    current: 'No paid university contract is confirmed.',
    hypothesis: `A university-funded SaaS subscription at proposed tiers of ${k(pricingTiers[0].price)}, ${k(pricingTiers[1].price)} and ${k(pricingTiers[2].price)} a year by institution size. Free for students.`,
    evidence: 'No paid university contract is confirmed and no price has been agreed. Prices are proposed, not validated. Interest from a stakeholder does not establish willingness to pay.',
    status: 'untested',
    statusWhy: 'No commercial evidence exists either way.',
    nextExperiment: A('A3').nextTest,
    wouldChange: 'If universities will fund a pilot only at a fraction of the proposed prices, or not at all, the revenue model and pricing would have to be rebuilt.',
  },
  {
    id: 'cost',
    n: 7,
    name: 'Cost structure',
    initial: 'Founder time, development and hosting; integration and support scale with universities.',
    current: 'Modelled, with substantial uncertainty on integration and support.',
    hypothesis: 'Founder salaries, developer costs, hosting and administration, with a contingency. Integration and support effort grow with each university.',
    evidence: `Modelled in the financial workbook (S5). Integration may need ICT approval, due diligence and procurement, and its cost is uncertain. An extra £${base2029.ebitda.toLocaleString('en-GB')} of annual cost would erase the modelled 2029 EBITDA.`,
    status: 'inconclusive',
    statusWhy: 'The costs are modelled, not observed, and the least certain lines (integration, support) are the ones that scale.',
    nextExperiment: 'Cost the real integration, onboarding and support effort during the pilot and feed it back into the model.',
    wouldChange: 'If integration and support take materially more effort than modelled, costs rise and the minimum number of paying universities rises with them.',
  },
  {
    id: 'metrics',
    n: 8,
    name: 'Key metrics',
    initial: 'Pilot measures of activation, repeat use, attendance and renewal.',
    current: 'Proposed pilot measures, not achieved results.',
    hypothesis: 'Success is measured by activation, weekly use, meaningful action, listing accuracy, host-verified attendance and whether the university pays to renew.',
    evidence: 'Thresholds are proposed: 40% activation, 20% WAU among activated, 30% meaningful action among WAU, ≥ 95% listing accuracy, +15% host-verified attendance, paid renewal. No pilot has run, so nothing is achieved.',
    status: 'untested',
    statusWhy: 'These are targets we have set ourselves, not results.',
    nextExperiment: 'Agree the thresholds and how each is measured with the pilot institution before it starts.',
    wouldChange: 'If a measure cannot be collected (for example host-verified attendance), we would redefine it. If results miss the thresholds, we would not expand.',
  },
  {
    id: 'advantage',
    n: 9,
    name: 'Unfair advantage',
    initial: 'Imperial access: students, contacts and a place to pilot.',
    current: 'Imperial access is an initial advantage, not a proven moat.',
    hypothesis: 'Direct access to Imperial students and contacts lets us learn and pilot faster than an outsider could.',
    evidence: 'Imperial access is real but it helps us start; it is not a proven long-term moat. Whether it transfers to other institutions, or compounds into something rivals cannot copy, is unknown.',
    status: 'inconclusive',
    statusWhy: 'A genuine head start, but nothing shows it is durable or hard to copy.',
    nextExperiment: 'Test whether Imperial results transfer to a second institution, and look for advantages that compound, such as integration relationships and pilot data.',
    wouldChange: 'If comparable discovery appears in universities’ own systems, or access does not transfer, we would treat this box as empty.',
  },
]

/** Label used on this chapter: an untested box reads as an untested guess; 'inconclusive' renders as Partial. */
export const statusLabel = (s: Status) => (s === 'untested' ? 'Untested guess' : statusMeta[s].label)

/** Count-aware label for tallies: '1 untested guess', '3 untested guesses'. */
export const tallyLabel = (s: Status, n: number) => (s === 'untested' ? (n === 1 ? 'untested guess' : 'untested guesses') : statusMeta[s].label.toLowerCase())

/** Compute the tally from the data, never hard-coded. */
export const canvasTally = (['supported', 'inconclusive', 'untested', 'contradicted'] as Status[]).map((s) => ({
  status: s,
  count: canvasBoxes.filter((b) => b.status === s).length,
}))

/** Present-mode phrases (3–6 words): what each box said at first, and where the evidence leaves it. */
export const canvasShort: Record<CanvasId, { initial: string; current: string }> = {
  problem: { initial: 'Events scattered, easy to miss', current: 'Real, in our sample only' },
  segments: { initial: 'Students first, universities pay', current: 'Institutional demand unquantified' },
  uvp: { initial: 'Every relevant event, early', current: 'Switching and adoption untested' },
  solution: { initial: 'Personalised feed, links out', current: 'Prototype only, not live' },
  channels: { initial: 'Imperial first, then wider', current: 'Institutional sales untested' },
  revenue: { initial: 'University-funded subscription', current: 'No paid contract confirmed' },
  cost: { initial: 'Team, hosting, scaling support', current: 'Integration cost uncertain' },
  metrics: { initial: 'Activation, repeat use, renewal', current: 'Proposed targets, no results' },
  advantage: { initial: 'Imperial student access', current: 'A head start, not a moat' },
}

export const riskiest = {
  /** Present-mode hero wording (full wording in `statement`). */
  short: 'A university will *pay and renew* for measurable results.',
  statement: 'A university will pay and renew for measurable improvements in student event discovery and participation.',
  linked: ['revenue', 'metrics'] as CanvasId[],
  principle: 'The Week 3 learning principle is not to complete the canvas once. It is to move untested guesses towards evidence.',
}

export const canvasLearning = {
  believed: 'The canvas described our business.',
  investigated: 'The evidence behind each of the nine boxes.',
  learned: 'Most boxes are partial or untested guesses. Only the problem has support, and only within our sample.',
  changed: 'We prioritised testing the riskiest untested guess over completing the plan.',
}
