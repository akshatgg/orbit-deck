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

/** HESA 2024/25-based segmentation × PROPOSED prices (not validated willingness to pay). */
export const pricingTiers = [
  { id: 'standard', label: 'Standard', range: '5,000–14,999 students', price: 10_000, institutions: 50, potential: 500_000 },
  { id: 'large', label: 'Large', range: '15,000–29,999 students', price: 15_000, institutions: 59, potential: 885_000 },
  { id: 'very-large', label: 'Very large', range: '30,000+ students', price: 20_000, institutions: 24, potential: 480_000 },
] as const

export const marketAssumptions = [
  'The 5,000-student threshold is a strategic targeting assumption.',
  'Serviceability rates (TAM → SAM) are estimated.',
  'Market size is not proven demand.',
  'London is the initial access point; SAM covers the UK.',
  '18 customers is a modelled target, not an achieved customer count.',
]

export const expansionPath = [
  { id: 'imperial', label: 'Imperial', detail: 'Validate with a focused student cohort.' },
  { id: 'london', label: 'London universities', detail: 'Replicate with other suitable institutions.' },
  { id: 'uk', label: 'Wider UK', detail: 'Repeatable onboarding, integration and sales.' },
]

export const funnel = [
  { id: 'contacts', label: 'Institutional contacts', value: 105, detail: 'Outreach to student-engagement, careers and digital-experience leads across target institutions.' },
  { id: 'meetings', label: 'Qualified meetings', value: 54, detail: 'Conversations where a relevant champion and plausible budget owner are identified.' },
  { id: 'pilots', label: 'Pilots', value: 31, detail: 'Opportunities in the planning funnel where a measurable, paid pilot is proposed.' },
  { id: 'conversions', label: 'Subscription conversions', value: 25, detail: 'Pilots converting to an annual institutional subscription.' },
  { id: 'net', label: 'Net customer additions', value: 18, detail: 'Modelled net additions after churn by 2029.' },
] as const

export const funnelNote =
  'Customer factory 2027–2029: back-calculated planning assumptions. Contacts may include repeat outreach. They are not observed sales results.'

export const acquisitionSteps = [
  'Leverage Imperial access for discovery and a possible pilot.',
  'Identify a relevant student-engagement or careers champion.',
  'Confirm the institutional budget owner.',
  'Secure authorised data-access and integration pathways.',
  'Conduct a measurable pilot.',
  'Convert successful pilots into subscriptions.',
  'Use documented results to approach other institutions.',
]
