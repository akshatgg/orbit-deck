import type { Status } from './evidence'
import type { StageId } from './chapters'
import { walkthroughTask } from './walkthroughs'

/**
 * Venture Journey Map (master prompt §6). 14 nodes across the four stages.
 * `kind` distinguishes completed learning activities from proposed / pending ones —
 * proposed nodes must ALWAYS render visually different (dashed, violet), never green.
 * `status` = evidence status of the node's central claim; several remain amber/grey on purpose.
 */
export interface JourneyNode {
  id: number
  label: string
  stage: StageId
  chapter: string // chapter slug that explains it
  kind: 'completed' | 'proposed'
  status: Status
  question: string
  activity: string
  learned: string
  decision: string
}

export const journeyNodes: JourneyNode[] = [
  {
    id: 1, label: 'Initial observation', stage: 'ideation', chapter: 'origin', kind: 'completed', status: 'inconclusive',
    question: 'Why are students missing opportunities that already exist?',
    activity: 'Reflection on our own experience as Imperial students.',
    learned: 'Opportunities are spread across many disconnected channels — but this was six people’s experience.',
    decision: 'Frame it as a hypothesis, not a fact.',
  },
  {
    id: 2, label: 'Opportunity hypothesis', stage: 'ideation', chapter: 'origin', kind: 'completed', status: 'inconclusive',
    question: 'Is there an opportunity in the mismatch?',
    activity: 'Applied Drucker’s sources of innovation: incongruity, demand-pull.',
    learned: 'A unified discovery layer might reduce friction — if the problem is shared.',
    decision: 'Screen the opportunity before investing resources.',
  },
  {
    id: 3, label: 'Screening', stage: 'ideation', chapter: 'screening', kind: 'completed', status: 'supported',
    question: 'Is Orbit worth investigating?',
    activity: 'Five Week 2 screening questions, equally weighted. Score 3.80 / 5.',
    learned: 'Strong access and feasibility; willingness to pay is the weakest criterion (2/5).',
    decision: 'GO — investigate further (not “build the company”).',
  },
  {
    id: 4, label: 'Customer discovery', stage: 'discovery', chapter: 'what-students-told-us', kind: 'completed', status: 'supported',
    question: 'How do students actually discover — and miss — events?',
    activity: '13 semi-structured interviews (26–29 Oct 2026) and 42 analysed survey responses.',
    learned: 'Past-behaviour questions surface real misses and existing workarounds.',
    decision: 'Compare interview and survey evidence before revising assumptions.',
  },
  {
    id: 5, label: 'Evidence synthesis', stage: 'discovery', chapter: 'what-students-told-us', kind: 'completed', status: 'supported',
    question: 'What does the evidence say — and what does it contradict?',
    activity: 'Synthesised survey counts with interview themes.',
    learned: '35/42 missed an event; 23/42 misses were late discovery, deadlines or full events; forgetting only 5/42.',
    decision: 'Revise product priorities: timely discovery is core, reminders secondary.',
  },
  {
    id: 6, label: 'Jobs-to-be-Done', stage: 'bmd', chapter: 'jtbd', kind: 'completed', status: 'inconclusive',
    question: 'What job does each stakeholder need done?',
    activity: 'Week 3 JTBD mapping for students, universities, organisers and IT/data owners.',
    learned: 'User, payer and gatekeeper are different people with different decision rights.',
    decision: 'Refined value proposition: every relevant opportunity, in one place, early enough to act.',
  },
  {
    id: 7, label: 'Lean Canvas', stage: 'bmd', chapter: 'lean-canvas', kind: 'completed', status: 'inconclusive',
    question: 'Which parts of the business model are evidence and which are assumptions?',
    activity: 'Nine-box Lean Canvas with an evidence status per box.',
    learned: 'Only the problem box is supported; revenue has no confirmed paid contract.',
    decision: 'Riskiest untested guess: a university will pay and renew.',
  },
  {
    id: 8, label: 'Product prototype', stage: 'bmd', chapter: 'product', kind: 'completed', status: 'inconclusive',
    question: 'What is the smallest product that tests discovery?',
    activity: 'Built a working prototype focused on coverage, relevance, source transparency and redirect.',
    learned: 'The interaction is demonstrable; live coverage and repeat usage are unvalidated.',
    decision: 'Keep social features as future hypotheses, not MVP.',
  },
  {
    id: 9, label: 'Business model choice', stage: 'bmd', chapter: 'who-pays', kind: 'completed', status: 'untested',
    question: 'Who pays, and why?',
    activity: 'Compared university SaaS, organiser referrals and student subscription.',
    learned: 'University subscription remains an untested guess; no payment has been tested.',
    decision: 'University-funded SaaS as the working hypothesis; organiser model a separate future test.',
  },
  {
    id: 10, label: 'Market & financial evaluation', stage: 'bmd', chapter: 'viability', kind: 'completed', status: 'untested',
    question: 'Could this support a real business?',
    activity: 'HESA-based bottom-up sizing and a five-year financial model (V3).',
    learned: 'Modelled EBITDA turns positive in 2029; cash is tightest in 2028 (£3,919).',
    decision: 'Identify the purchasing and renewal evidence the model requires.',
  },
  {
    id: 11, label: 'Institutional engagement', stage: 'validation', chapter: 'market-engagement', kind: 'completed', status: 'inconclusive',
    question: 'Will an institution engage beyond politeness?',
    activity: 'Product demonstration with an Imperial Careers team contact.',
    learned: 'Possible internal champion; integration needs ICT approval, due diligence and procurement.',
    decision: 'Revise business-model assumptions around budget ownership and data access.',
  },
  {
    id: 12, label: 'Product walkthroughs', stage: 'validation', chapter: 'walkthroughs', kind: 'completed', status: 'inconclusive',
    question: 'Do students find value in Orbit when they use the prototype?',
    activity: `Prototype walkthroughs with a neutral task: “${walkthroughTask}”`,
    learned: 'Partial evidence (A5): first-use value is not repeat use. Retention and attendance need the pilot (A6, A7).',
    decision: 'Refine the product from what the walkthroughs show; test repeat use and attendance in the pilot.',
  },
  {
    id: 13, label: 'Proposed pilot', stage: 'validation', chapter: 'experiment', kind: 'proposed', status: 'untested',
    question: 'What evidence would make us pursue Orbit?',
    activity: 'PROPOSED — one paid, measurable 8–12 week university pilot. Not yet run.',
    learned: 'Not yet run — thresholds are set in advance.',
    decision: 'Run it before any wider expansion.',
  },
  {
    id: 14, label: 'Conditional verdict', stage: 'verdict', chapter: 'verdict', kind: 'completed', status: 'inconclusive',
    question: 'Is Orbit worth pursuing, by whom, and under what conditions?',
    activity: 'Weighed what we know against what remains untested.',
    learned: 'Evidence has improved. Critical uncertainty remains.',
    decision: 'CONDITIONAL GO — one paid, measurable pilot before wider expansion.',
  },
]

/** Feedback loops — evidence sending the team back to reconsider earlier decisions. */
export const journeyLoops: { from: number; to: number; label: string }[] = [
  { from: 5, to: 8, label: 'Discovery → revised product priorities' },
  { from: 11, to: 9, label: 'Institutional engagement → revised business-model assumptions' },
  { from: 12, to: 8, label: 'Walkthroughs → product refinement' },
  { from: 10, to: 13, label: 'Financial model → required purchasing & renewal evidence' },
]
