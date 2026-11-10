/**
 * Market model — all values are MODEL-DERIVED ESTIMATES, not proven demand.
 */
export const marketLayers = [
  {
    id: 'tam',
    label: 'TAM',
    institutions: 133,
    value: 1_865_000,
    definition: 'UK higher-education providers with at least 5,000 students.',
    note: 'Illustrative annual subscription opportunity.',
  },
  {
    id: 'sam',
    label: 'SAM',
    institutions: 88,
    value: 1_290_000,
    definition: 'Institutions meeting provisional serviceability assumptions.',
    note: 'Illustrative annual subscription opportunity.',
  },
  {
    id: 'som',
    label: 'SOM · 2029 scenario',
    institutions: 18,
    value: 255_000,
    definition: 'Institutions in the 2029 model scenario.',
    note: 'Undiscounted indicative subscription value.',
  },
] as const

export const pricingTiers = [
  { id: 'standard', label: 'Standard', range: '5,000–14,999 students', price: 10_000 },
  { id: 'large', label: 'Large', range: '15,000–29,999 students', price: 15_000 },
  { id: 'very-large', label: 'Very large', range: '30,000+ students', price: 20_000 },
] as const

export const marketAssumptions = [
  'The 5,000-student threshold is a segmentation assumption, not an observed purchasing boundary.',
  'Serviceability percentages (TAM → SAM) are provisional assumptions about integration feasibility and fit.',
  'Values multiply institution counts by assumed list prices; they are not survey-based or contracted demand.',
  'Tier-level institution counts are held in the workbook segmentation sheet.',
]

export const expansionPath = [
  { id: 'imperial', label: 'Imperial', detail: 'Validate with a focused student cohort.' },
  { id: 'london', label: 'London universities', detail: 'Replicate with other suitable institutions.' },
  { id: 'uk', label: 'Wider UK', detail: 'Repeatable onboarding, integration and sales.' },
]

export const funnel = [
  { id: 'contacts', label: 'Institutional contacts', value: 105, detail: 'Outreach to student-engagement, careers and digital-experience leads across target institutions.' },
  { id: 'meetings', label: 'Qualified meetings', value: 54, detail: 'Conversations where a relevant champion and plausible budget owner are identified.' },
  { id: 'pilots', label: 'Paid-pilot opportunities', value: 31, detail: 'Opportunities in the planning funnel where a measurable, paid pilot is proposed.' },
  { id: 'conversions', label: 'Subscription conversions', value: 25, detail: 'Pilots converting to an annual institutional subscription.' },
  { id: 'net', label: 'Net customer additions', value: 18, detail: 'Modelled net additions after churn by 2029.' },
] as const

export const funnelNote =
  'Modelled 2027–2029 totals. Planning estimates, not historical achievements. Stage totals count opportunities and are not necessarily unique institutions.'

export const acquisitionSteps = [
  'Leverage Imperial access for discovery and a possible pilot.',
  'Identify a relevant student-engagement or careers champion.',
  'Confirm the institutional budget owner.',
  'Secure authorised data-access and integration pathways.',
  'Conduct a measurable pilot.',
  'Convert successful pilots into subscriptions.',
  'Use documented results to approach other institutions.',
]
