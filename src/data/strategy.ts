/**
 * Business model, value proposition, risks, pilot, vision and assumption-lab content.
 */
export type Status = 'supported' | 'partial' | 'untested' | 'contradicted'

export const statusMeta: Record<Status, { label: string; color: string }> = {
  supported: { label: 'Supported', color: 'var(--color-st-supported)' },
  partial: { label: 'Partially supported', color: 'var(--color-st-partial)' },
  untested: { label: 'Untested', color: 'var(--color-st-untested)' },
  contradicted: { label: 'Contradicted', color: 'var(--color-st-contradicted)' },
}

export const valueProp = {
  students: {
    title: 'Students',
    role: 'The users',
    jobs: [
      'Find relevant opportunities',
      'Reduce searching across platforms',
      'Discover events before deadlines',
      'Prioritise opportunities aligned with personal goals',
    ],
    price: 'Free',
  },
  universities: {
    title: 'Universities',
    role: 'The potential paying customers',
    jobs: [
      'Improve visibility of student opportunities',
      'Support student engagement',
      'Reduce fragmented communications',
      'Understand discovery and engagement patterns, where appropriate',
    ],
    price: 'Annual institutional subscription (hypothesis)',
  },
  it: {
    title: 'University IT / data owners',
    role: 'Influencers',
    influences: ['Data access', 'Integration', 'Security', 'Procurement', 'Implementation feasibility'],
  },
  caveat: 'Student interest does not prove institutional willingness to pay.',
  exchange: [
    'University subscription',
    'Orbit discovery infrastructure',
    'Student experience',
    'Measurable engagement evidence',
    'Institutional renewal decision',
  ],
}

export const businessModels = [
  {
    id: 'university',
    option: 'A',
    title: 'Universities pay',
    selected: true,
    verdict: 'Proposed core business model',
    rows: {
      'Paying customer': 'University or relevant institutional department',
      'Revenue mechanism': 'Annual institutional subscription',
      'Revenue potential': 'Potential recurring institutional contracts',
      'Acquisition challenge': 'Identifiable budget owner, purchasing process, long sales cycles',
      'Main uncertainty': 'Commercial viability remains unvalidated',
      'Current evidence': 'Student problem evidence only; no institutional purchase commitment',
      'Fit with prototype': 'Strong — prototype is built around a university event feed',
    },
    requires: ['An identifiable budget owner', 'A purchasing process', 'Demonstrable value', 'Authorised data access'],
  },
  {
    id: 'organisers',
    option: 'B',
    title: 'Event organisers pay',
    selected: false,
    verdict: 'Potential later model',
    rows: {
      'Paying customer': 'External event organisers',
      'Revenue mechanism': 'Agreed fees for attributable registrations / ticket sales, or clearly identified promotional campaigns',
      'Revenue potential': 'Scales with audience size and attribution quality',
      'Acquisition challenge': 'Needs an engaged audience first; many fragmented organisers',
      'Main uncertainty': 'Proof that Orbit delivers incremental attendees',
      'Current evidence': 'No demonstrated commercial demand yet',
      'Fit with prototype': 'Partial — requires reliable attribution tracking',
    },
    requires: ['Reliable attribution', 'Proof of incremental attendees'],
  },
  {
    id: 'students',
    option: 'C',
    title: 'Students pay',
    selected: false,
    verdict: 'Possible, lower-confidence option',
    rows: {
      'Paying customer': 'Individual students',
      'Revenue mechanism': 'Consumer subscription',
      'Revenue potential': 'Low per-user value; high churn risk',
      'Acquisition challenge': 'Students already have free discovery alternatives',
      'Main uncertainty': 'Any willingness to pay at all',
      'Current evidence': 'No evidence currently establishes that students will pay',
      'Fit with prototype': 'Technically possible, commercially weak',
    },
    requires: ['Evidence of willingness to pay'],
  },
] as const

export const businessModelRowKeys = [
  'Paying customer',
  'Revenue mechanism',
  'Revenue potential',
  'Acquisition challenge',
  'Main uncertainty',
  'Current evidence',
  'Fit with prototype',
] as const

export const risks = [
  {
    id: 'wtp',
    n: 1,
    title: 'Institutional willingness to pay',
    question: 'Will a university allocate budget to Orbit?',
    status: 'untested' as Status,
    statusText: 'Unvalidated commercially.',
    assumption: 'A university department has budget and motivation to pay an annual subscription for student event discovery.',
    evidenceFor: ['Student-side problem evidence (35 of 42 missed an event in four weeks).', 'Universities already invest in student engagement and careers services.'],
    evidenceAgainst: ['No budget owner identified yet.', 'No paid pilot or purchase commitment.', 'Student interest does not equal institutional willingness to pay.'],
    experiment: 'Identify a budget owner, confirm purchasing conditions and seek a paid pilot or comparable commitment.',
    criterion: 'Documented purchasing interest or a paid pilot from at least one institution.',
  },
  {
    id: 'data',
    n: 2,
    title: 'Integration & data access',
    question: 'Can Orbit obtain reliable, authorised institutional event data?',
    status: 'partial' as Status,
    statusText: 'Technically promising, conditional.',
    assumption: 'Institutional event sources can be accessed through authorised APIs or feeds with acceptable security and procurement effort.',
    evidenceFor: ['Existing prototype aggregates event information technically.', 'Many event platforms expose structured event pages.'],
    evidenceAgainst: ['Technical availability ≠ approved access.', 'Security, procurement and data-protection reviews not yet started.'],
    experiment: 'Confirm API permissions, procurement, security and implementation requirements with IT / data owners.',
    criterion: 'Written confirmation of an authorised data pathway for the pilot cohort; ≥95% accuracy in sampled listings.',
  },
  {
    id: 'retention',
    n: 3,
    title: 'Student retention',
    question: 'Will students repeatedly use Orbit rather than existing channels?',
    status: 'partial' as Status,
    statusText: 'Problem evidence exists; sustained usage unproven.',
    assumption: 'Students will return to Orbit weekly because it surfaces relevant events they would otherwise miss.',
    evidenceFor: ['12 of 13 interviewees described a missed or late-discovered event.', '31 of 42 agreed there are too many places to check.'],
    evidenceAgainst: ['Four interviewees were concerned about using another app.', 'Friends remain a strong discovery channel (12 of 13).'],
    experiment: 'Track onboarding, repeat engagement, relevant-event discovery and perceived usefulness in the pilot.',
    criterion: '20% weekly active usage among enrolled pilot users; 60% report discovering a relevant event they might have missed.',
  },
  {
    id: 'economics',
    n: 4,
    title: 'Scalable economics',
    question: 'Can Orbit serve many universities without excessive integration, support and acquisition costs?',
    status: 'untested' as Status,
    statusText: 'Modelled, not demonstrated.',
    assumption: 'Each new institution can be onboarded with modest incremental integration, support and sales effort.',
    evidenceFor: ['Financial model reaches positive EBITDA in 2029 under its assumptions.'],
    evidenceAgainst: ['No measured integration effort, sales cycle or renewal rate yet.', '2028 year-end cash cushion is narrow (~£3,919).'],
    experiment: 'Measure delivery effort, sales cycle length, renewal economics and operating costs from the first institutions.',
    criterion: 'Observed onboarding cost and sales cycle within the workbook assumptions.',
  },
]

export const pilotPhases = [
  { id: 'prepare', n: 1, title: 'Prepare', weeks: 'Weeks 1–2', detail: 'Confirm cohort, source permissions, event coverage, baseline discovery behaviour and success criteria.' },
  { id: 'launch', n: 2, title: 'Launch', weeks: 'Weeks 3–4', detail: 'Onboard participating students and introduce the product.' },
  { id: 'measure', n: 3, title: 'Measure', weeks: 'Weeks 5–10', detail: 'Track actual usage, relevant event discovery, event-source accuracy and user feedback.' },
  { id: 'decide', n: 4, title: 'Decide', weeks: 'Weeks 11–12', detail: 'Compare results against agreed thresholds and evaluate institutional commercial interest.' },
]

export const pilotThresholds = [
  { id: 'onboard', target: 40, unit: '%', label: 'of invited eligible students onboard' },
  { id: 'wau', target: 20, unit: '%', label: 'weekly active usage among enrolled pilot users' },
  { id: 'action', target: 30, unit: '%', label: 'of weekly active users save, share or click an event' },
  { id: 'discovered', target: 60, unit: '%', label: 'of active users report discovering a relevant event they otherwise might have missed' },
  { id: 'accuracy', target: 95, unit: '%', label: 'accuracy in sampled event listings' },
  { id: 'buyer', target: null, unit: '', label: 'Documented institutional purchasing interest or a paid pilot' },
]

export const pilotOutcomes = [
  {
    id: 'go',
    label: 'GO',
    color: 'var(--color-st-supported)',
    summary: 'Evidence supports expansion.',
    detail: 'Thresholds broadly met and a credible buyer exists. Convert to a subscription and approach the next London institution with documented results.',
  },
  {
    id: 'iterate',
    label: 'ITERATE',
    color: 'var(--color-amber)',
    summary: 'User value exists, but adoption, coverage or delivery needs improvement.',
    detail: 'Fix the weakest metric (e.g. coverage or onboarding), agree revised thresholds, and re-run a shorter test cycle.',
  },
  {
    id: 'stop',
    label: 'STOP / PIVOT',
    color: 'var(--color-st-contradicted)',
    summary: 'Repeated tests fail to establish sufficient value, reliable delivery or a viable buyer.',
    detail: 'Stop the institutional model or pivot — e.g. a different buyer, segment or product scope — rather than spend into an unvalidated plan.',
  },
]

export const visionStages = [
  { n: 1, title: 'Imperial', detail: 'Validate the discovery experience with a focused student cohort.', horizon: 'Pilot' },
  { n: 2, title: 'London universities', detail: 'Replicate the institutional product with other suitable universities.', horizon: 'Core forecast' },
  { n: 3, title: 'UK institutional expansion', detail: 'Develop repeatable university onboarding, integration and commercial processes.', horizon: 'Core forecast' },
  { n: 4, title: 'External events, where we already operate', detail: 'After an established university footprint, explore broader external-event discovery in those cities.', horizon: 'Future option' },
  { n: 5, title: 'Selective city-level scaling', detail: 'Expand external coverage only where organiser partnerships, engagement and economics are evidenced.', horizon: 'Future option' },
]

export const assumptionLab = [
  {
    id: 'h1',
    hypothesis: 'Students experience meaningful friction discovering relevant events.',
    support: ['35 of 42 missed an event in four weeks', '31 of 42: too many places to check', '12 of 13 interviewees described late discovery'],
    contradict: ['Convenience sample, Imperial-heavy', '10 of 42 cited clashes — not a discovery issue'],
    status: 'supported' as Status,
    confidence: 'Moderate',
    next: 'Measure baseline discovery behaviour in the pilot cohort.',
    implication: 'Proceed to test the solution — not yet the business.',
  },
  {
    id: 'h2',
    hypothesis: 'Students will repeatedly use one consolidated discovery feed.',
    support: ['Fragmentation pain is widely reported'],
    contradict: ['4 of 13 wary of another app', 'Friends are a strong existing channel'],
    status: 'untested' as Status,
    confidence: 'Low',
    next: 'Pilot: 20% weekly active usage target.',
    implication: 'If unmet, iterate on social/notification features or integrate into existing channels.',
  },
  {
    id: 'h3',
    hypothesis: 'A university department will pay an annual subscription.',
    support: ['Institutions invest in engagement & careers services (general context)'],
    contradict: ['No budget owner or purchase commitment identified'],
    status: 'untested' as Status,
    confidence: 'Low',
    next: 'Identify budget owner; seek paid pilot or written purchasing interest.',
    implication: 'Core to the business model — failure means pivoting the payer.',
  },
  {
    id: 'h4',
    hypothesis: 'Authorised institutional event data can be obtained reliably.',
    support: ['Prototype technically aggregates events'],
    contradict: ['No approved integration access yet'],
    status: 'partial' as Status,
    confidence: 'Moderate–low',
    next: 'Confirm permissions, security and procurement with IT.',
    implication: 'Determines delivery cost per institution.',
  },
  {
    id: 'h5',
    hypothesis: 'Orbit can serve many institutions at the modelled cost base.',
    support: ['Workbook reaches positive EBITDA in 2029'],
    contradict: ['No observed integration effort or sales cycle data'],
    status: 'untested' as Status,
    confidence: 'Low',
    next: 'Track real onboarding effort from first institutions.',
    implication: 'Re-forecast before raising further capital.',
  },
  {
    id: 'h6',
    hypothesis: 'Event organisers will pay for attributable registrations.',
    support: ['Organisers already pay for promotion elsewhere (general context)'],
    contradict: ['No demonstrated commercial demand; no attribution yet'],
    status: 'untested' as Status,
    confidence: 'Low',
    next: 'Only after a university footprint exists.',
    implication: 'Not included in the five-year forecast.',
  },
]

export const competitorLandscape = [
  { name: 'University emails & newsletters', type: 'Institutional channel', strength: 'Official, universal reach', gap: 'High volume, low personalisation' },
  { name: 'Careers / events portals', type: 'Institutional channel', strength: 'Authoritative listings', gap: 'Siloed by department; must be checked actively' },
  { name: 'Student society pages & group chats', type: 'Social channel', strength: 'Trusted, social', gap: 'Fragmented and ephemeral' },
  { name: 'Eventbrite / Luma / Meetup-type platforms', type: 'External platforms', strength: 'Registration & ticketing', gap: 'Not university-specific; external focus' },
  { name: 'LinkedIn events', type: 'Professional network', strength: 'Professional reach', gap: 'Noisy, not student-curated' },
]

export const teamMembers = [
  { name: 'Swayam Mundada', initials: 'SM' },
  { name: 'Juan Felipe Aljure', initials: 'JA' },
  { name: 'Sabrina Infantino', initials: 'SI' },
  { name: 'Chia Lyn Lee', initials: 'CL' },
  { name: 'Muhammad Rifki Ilham', initials: 'MI' },
  { name: 'Rong Gao', initials: 'RG' },
]

/** Team strengths — framed as advantages, explicitly NOT a moat. */
export const teamStrengths = [
  'Direct access to the initial student audience',
  'Firsthand experience of the discovery problem',
  'Existing prototype work',
  'Research and commercial modelling',
  'Ability to test rapidly within the university ecosystem',
]

export const operatingModel = [
  { role: 'Technical founder', detail: 'Product development and integrations.' },
  { role: 'Business founder', detail: 'Institutional relationships, commercial activity and administration.' },
  { role: 'Additional support', detail: 'Development and operational support as the business grows.' },
]

export const references = [
  { id: 'R1', title: 'Orbit team — New Venture Creation report', detail: 'Student survey (n = 42) and qualitative interviews (n = 13); exploratory convenience sample.' },
  { id: 'R2', title: 'Orbit team — Financial workbook', detail: 'Five-year projections 2027–2031: revenue, EBITDA, net profit, institutions, cash and financing.' },
  { id: 'R3', title: 'Orbit team — Market sizing model', detail: 'UK HE providers with ≥5,000 students; serviceability and pricing-tier assumptions.' },
  { id: 'R4', title: 'Orbit team — Go-to-market funnel model', detail: 'Modelled 2027–2029 institutional acquisition funnel.' },
  { id: 'R5', title: 'Orbit prototype', detail: 'Working prototype at orbit.akshatgg.in — separate from the illustrative in-pitch demo.' },
  { id: 'R6', title: 'Pilot framework (proposed)', detail: 'Provisional thresholds for stakeholder agreement; not industry benchmarks.' },
]
