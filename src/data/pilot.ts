import type { Learning } from './evidence'

/**
 * Chapter 13 — the proposed Imperial pilot. EVERYTHING here is PROPOSED: thresholds and decision
 * rules set in advance. No pilot has been run and none of these results exist.
 */

export const pilotDisclaimer = 'This is a proposed decision system, not a report of completed pilot results.'

export type PilotPhaseId = 'yes' | 'before' | 'run' | 'decide'

/** The four phases the journey is grouped into. `from`/`count` index into pilotSequence. */
export const pilotPhases: { id: PilotPhaseId; label: string; from: number; count: number }[] = [
  { id: 'yes', label: 'Get to yes', from: 0, count: 3 },
  { id: 'before', label: 'Before launch', from: 3, count: 1 },
  { id: 'run', label: 'Run', from: 4, count: 2 },
  { id: 'decide', label: 'Decide', from: 6, count: 2 },
]

/** The eight proposed stages, in order. `line` is the one short line shown on the slide. */
export const pilotSequence: { id: string; title: string; line: string; detail: string }[] = [
  { id: 'champion', title: 'Secure a Careers Champion', line: 'An internal sponsor inside Imperial Careers.', detail: 'An internal champion in Imperial Careers who sponsors the initiative.' },
  { id: 'ict', title: 'Obtain ICT Approval', line: 'Technical, data-protection and due-diligence checks.', detail: 'Technical, integration, data protection and due-diligence requirements are met.' },
  { id: 'budget', title: 'Secure Budget Owner Approval', line: 'The budget holder approves the paid pilot.', detail: 'The budget holder approves the paid pilot.' },
  { id: 'baseline', title: 'Establish a Baseline', line: 'Measure current performance before Orbit.', detail: 'Measure current performance before Orbit is introduced.' },
  { id: 'launch', title: 'Launch the Pilot', line: 'Paid and controlled: 8–12 weeks, an agreed cohort.', detail: 'A controlled, paid 8–12 week pilot with an agreed student cohort.' },
  { id: 'measure', title: 'Measure Performance', line: 'Collect data against agreed success metrics.', detail: 'Collect data against the agreed success metrics.' },
  { id: 'evaluate', title: 'Evaluate Results', line: 'Compare with the baseline against agreed criteria.', detail: 'Compare results with the baseline against the agreed success criteria.' },
  { id: 'decision', title: 'Make a Subscription Decision', line: 'One decision, three outcomes.', detail: 'Full subscription, iterate and retest, or discontinue.' },
]

/** The three-way decision fork at the end of the journey (proposed outcomes, not predictions). */
export const pilotDecisions: { id: string; label: string; line: string }[] = [
  { id: 'subscribe', label: 'Subscribe', line: 'Full subscription' },
  { id: 'iterate', label: 'Iterate & retest', line: 'One controlled retest' },
  { id: 'discontinue', label: 'Discontinue', line: 'Stop or pivot' },
]

/** Funnel thresholds (percent, integers). */
export const thresholds = { activation: 40, wau: 20, meaningful: 30, accuracy: 95, uplift: 15 }
export const defaultInvited = 1000

/** ceil(n × p%) computed on integers to avoid floating-point drift. */
export const pctOf = (n: number, p: number) => Math.ceil((n * p) / 100 - 1e-9)

export function funnel(invited: number) {
  const activated = pctOf(invited, thresholds.activation)
  const wau = pctOf(activated, thresholds.wau)
  const meaningful = pctOf(wau, thresholds.meaningful)
  return { invited, activated, wau, meaningful }
}

export const definitions = {
  wau: 'A unique pilot user who returns during a seven-day period and performs a qualifying discovery action.',
  meaningful: 'Saving, sharing or clicking through to the original organiser.',
  caution: 'These are preliminary behavioural signals, not proof of institutional value.',
}

export const scorecard: { id: string; gate: string; value: string; detail: string }[] = [
  { id: 'activation', gate: 'Invited-student activation', value: '≥ 40%', detail: 'of invited students activate' },
  { id: 'wau', gate: 'Weekly active users', value: '≥ 20%', detail: 'of activated users' },
  { id: 'meaningful', gate: 'Meaningful action', value: '≥ 30%', detail: 'of weekly active users' },
  { id: 'accuracy', gate: 'Sampled listing accuracy', value: '≥ 95%', detail: 'of sampled listings' },
  { id: 'attendance', gate: 'Host-verified attendance', value: '+15%', detail: 'relative increase per eligible student vs existing methods' },
  { id: 'renewal', gate: 'Paid renewal', value: 'Agreed', detail: 'at a commercially viable price' },
]

export const attendance = {
  baseline: 0.2,
  target: 0.23,
  uplift: 15,
  notes: ['Comparable measurement periods', 'The same eligible-student denominator'],
}

export const attendanceLadder = [
  { label: 'Click', text: 'A student clicks through to the organiser’s page.', who: 'Visible to Orbit' },
  { label: 'Registration', text: 'The student actually registers on the organiser’s side.', who: 'Needs organiser data' },
  { label: 'Attendance', text: 'The student turns up.', who: 'Needs host verification, where permission allows' },
]

export const evaluationIncludes = [
  'Baseline or matched comparison group',
  'Host-verified attendance where permission allows',
  'User privacy and consent',
  'Event coverage and cancellation checks',
  'Integration and support effort',
  'Purchasing decision',
]

/* ---------- Verdict simulator (example outcomes only) ---------- */

export type Renewal = 'agrees' | 'undecided' | 'rejects'

export interface PilotOutcome {
  activation: number
  wau: number
  meaningful: number
  accuracy: number
  uplift: number
  dataAccess: boolean
  costsViable: boolean
  renewal: Renewal
}

/** Simulator convention (not a team figure): weekly use below half the 20% gate counts as “weak”. */
export const weakUseBelow = thresholds.wau / 2

export const presets: { id: 'go' | 'iterate' | 'stop'; label: string; outcome: PilotOutcome }[] = [
  { id: 'go', label: 'Example GO outcome', outcome: { activation: 46, wau: 24, meaningful: 34, accuracy: 96, uplift: 18, dataAccess: true, costsViable: true, renewal: 'agrees' } },
  { id: 'iterate', label: 'Example ITERATE outcome', outcome: { activation: 43, wau: 17, meaningful: 31, accuracy: 96, uplift: 11, dataAccess: true, costsViable: true, renewal: 'undecided' } },
  { id: 'stop', label: 'Example STOP outcome', outcome: { activation: 32, wau: 6, meaningful: 18, accuracy: 91, uplift: 2, dataAccess: false, costsViable: false, renewal: 'rejects' } },
]

export type VerdictResult = 'GO' | 'ITERATE' | 'STOP'

export interface Gate {
  id: string
  label: string
  actual: string
  met: boolean
}

export interface Verdict {
  result: VerdictResult
  title: string
  rule: string
  stopHits: string[]
  gates: Gate[]
  unmet: string[]
}

export const verdictText: Record<VerdictResult, { title: string; rule: string }> = {
  GO: { title: 'GO', rule: 'Students return, listings are reliable, attendance improvement is credible, costs are viable and the buyer agrees to renew.' },
  ITERATE: { title: 'ITERATE', rule: 'Results are inconclusive or a specific improvement is testable: one controlled retest with a clear hypothesis.' },
  STOP: { title: 'STOP OR PIVOT', rule: 'Repeat use remains weak, authorised data access cannot be achieved, or buyers reject economically viable terms.' },
}

export function evaluate(o: PilotOutcome): Verdict {
  const t = thresholds
  const gates: Gate[] = [
    { id: 'activation', label: 'Activation ≥ 40%', actual: `${o.activation}%`, met: o.activation >= t.activation },
    { id: 'wau', label: 'WAU among activated ≥ 20%', actual: `${o.wau}%`, met: o.wau >= t.wau },
    { id: 'meaningful', label: 'Meaningful action among WAU ≥ 30%', actual: `${o.meaningful}%`, met: o.meaningful >= t.meaningful },
    { id: 'accuracy', label: 'Listing accuracy ≥ 95%', actual: `${o.accuracy}%`, met: o.accuracy >= t.accuracy },
    { id: 'attendance', label: 'Verified attendance ≥ +15%', actual: `${o.uplift > 0 ? '+' : ''}${o.uplift}%`, met: o.uplift >= t.uplift },
    { id: 'data', label: 'Authorised data access achieved', actual: o.dataAccess ? 'Yes' : 'No', met: o.dataAccess },
    { id: 'costs', label: 'Integration and support costs viable', actual: o.costsViable ? 'Yes' : 'No', met: o.costsViable },
    { id: 'renewal', label: 'Buyer agrees to renew at viable terms', actual: o.renewal === 'agrees' ? 'Agrees' : o.renewal === 'rejects' ? 'Rejects' : 'Undecided', met: o.renewal === 'agrees' },
  ]
  const stopHits: string[] = []
  if (!o.dataAccess) stopHits.push('Authorised data access cannot be achieved')
  if (o.renewal === 'rejects') stopHits.push('Buyer rejects economically viable terms')
  if (o.wau < weakUseBelow) stopHits.push('Repeat use remains weak')
  const unmet = gates.filter((g) => !g.met).map((g) => g.label)
  const result: VerdictResult = stopHits.length ? 'STOP' : unmet.length === 0 ? 'GO' : 'ITERATE'
  return { result, ...verdictText[result], stopHits, gates, unmet }
}

export const pilotEndLine = 'The next milestone is not more features. It is stronger evidence.'

export const pilotLearning: Learning = {
  believed: 'Interest and a good demonstration would be enough to justify going on.',
  investigated: 'What evidence would count: thresholds, comparison baselines, attendance measurement and stop rules.',
  learned: 'Evidence has to be defined before the pilot, and a click is not a registration or an attendance.',
  changed: 'The next step is one paid, controlled 8–12-week pilot, with GO / ITERATE / STOP rules written in advance.',
}
