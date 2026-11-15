/**
 * Chapter 14 — gated expansion roadmap. All customer counts are MODELLED targets
 * (financial model V3, S5); nothing here is an achieved result. Customer counts come
 * from financials.finYears so they cannot drift from the model.
 */
import { finYears } from './financials'

const inst = (year: number) => finYears.find((y) => y.year === year)!.institutions

export interface Phase {
  id: string
  years: string
  title: string
  /** One short line for Present mode. */
  short: string
  /** Short gate name for the lock label. */
  gateShort?: string
  /** Hero number for Present mode (modelled). */
  big: { value: number; label: string }
  /** Presenter step at which this phase is revealed. */
  step: number
  actions: string[]
  /** Modelled target headline numbers. */
  target: { value: string; label: string }[]
  /** Extra modelled note, e.g. EBITDA. */
  modelledNote?: string
  /** Gate that must be passed to unlock the NEXT phase. */
  gate?: { title: string; mustProve: string[] }
}

export const phases: Phase[] = [
  {
    id: 'y1',
    big: { value: inst(2027), label: 'universities' },
    short: 'Pilot, paid renewal, reusable onboarding.',
    gateShort: 'Is the model real?',
    years: 'Year 1',
    title: 'Prove the model',
    step: 0,
    actions: ['Imperial pilot', 'Paid renewal', 'Develop reusable onboarding and integration processes'],
    target: [{ value: String(inst(2027)), label: 'university customers by year end' }],
    gate: {
      title: 'Gate 1 · Is the model real?',
      mustProve: ['The pilot meets its pre-set thresholds', 'The institution renews on a paid basis', 'Onboarding and integration can be reused'],
    },
  },
  {
    id: 'y2',
    big: { value: inst(2028), label: 'universities' },
    short: 'Repeat acquisition and deployment.',
    gateShort: 'Can it be repeated?',
    years: 'Year 2',
    title: 'Establish repeatability',
    step: 1,
    actions: ['Test whether institutional acquisition can be repeated', 'Test whether deployment can be repeated'],
    target: [{ value: String(inst(2028)), label: 'university customers' }],
    gate: {
      title: 'Gate 2 · Can it be repeated?',
      mustProve: ['A second institution is won without bespoke effort', 'Deployment time and cost are predictable'],
    },
  },
  {
    id: 'y3',
    big: { value: inst(2029), label: 'universities' },
    short: 'First positive EBITDA — modelled.',
    gateShort: 'Does it pay for itself?',
    years: 'Year 3',
    title: 'Demonstrate commercial sustainability',
    step: 2,
    actions: ['Validate renewal economics', 'Validate support economics'],
    target: [{ value: String(inst(2029)), label: 'universities' }],
    modelledNote: 'Modelled positive EBITDA (£37,492 in the base case)',
    gate: {
      title: 'Gate 3 · Does it pay for itself?',
      mustProve: ['Renewals and support costs behave as modelled', 'EBITDA is positive on observed, not assumed, figures'],
    },
  },
  {
    id: 'y45',
    big: { value: inst(2031), label: 'universities by Year 5' },
    short: 'Standardise integrations across UK universities.',
    years: 'Years 4–5',
    title: 'Expand the university network',
    step: 3,
    actions: ['Expand from London across suitable UK universities', 'Standardise institutional integrations', 'Standardise service delivery'],
    target: [
      { value: String(inst(2030)), label: 'modelled customers, Year 4' },
      { value: String(inst(2031)), label: 'modelled customers, Year 5' },
    ],
  },
]

export const externalBranch = {
  title: 'A separate strategic opportunity',
  when: 'After Year 5',
  idea: 'External-only city event discovery, in cities where Orbit already operates.',
  advantages: [
    'Familiarity with local event ecosystems',
    'Existing discovery infrastructure',
    'Potential organiser relationships',
    'Knowledge of local user behaviour',
  ],
  risks: [
    'Acquiring users beyond the university segment',
    'Competing for attention with established consumer platforms',
    'Obtaining organiser partnerships',
    'Attributable paid registrations',
    'Sustainable commission economics',
    'Separate retention and acquisition costs',
  ],
  notIncluded: 'External-event commissions are not included in the five-year university forecast.',
  independence: 'The university business can succeed while the external-events business fails, or vice versa.',
  condition: 'Pursue it only if its own evidence justifies it.',
}

/** Present-mode chips for the post-Year-5 branch (full lists stay in Explore). */
export const branchChips = {
  title: 'External city events',
  advantages: ['Local event knowledge', 'Existing discovery layer', 'Possible organiser ties'],
  risks: ['Users beyond universities', 'Organiser partnerships', 'Commission economics'],
  line: 'One can succeed while the other fails.',
}
