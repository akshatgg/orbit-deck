import type { Status } from './evidence'

/**
 * Critical-assumption tracker (master prompt §24).
 * Never show 100% validation. A5's outcome may only be filled from verified results
 * (see config.verifiedPrototypeResults).
 */
export interface Assumption {
  id: string
  claim: string
  status: Status
  statusText: string
  evidence: string
  nextTest: string
  /** Chapter slug where this assumption first becomes visible. */
  chapter: string
}

export const assumptions: Assumption[] = [
  {
    id: 'A1',
    claim: 'Students experience fragmented discovery.',
    status: 'supported',
    statusText: 'Supported within the research sample',
    evidence: '31 of 42 survey respondents agreed there were too many places to check; 35 of 42 missed at least one event in four weeks; 12 of 13 interviewees described a missed or late-discovered event.',
    nextTest: 'Baseline the problem within an eligible pilot cohort, outside the team’s networks.',
    chapter: 'what-students-told-us',
  },
  {
    id: 'A2',
    claim: 'Other universities experience similar issues.',
    status: 'inconclusive',
    statusText: 'Limited support from cross-campus student accounts; wider prevalence unvalidated',
    evidence: 'Individual students at LSE, King’s College London, UCL and London Business School reported similar challenges. These are individual accounts, not institutional data.',
    nextTest: 'Structured discovery at two or three further institutions before expansion.',
    chapter: 'market-engagement',
  },
  {
    id: 'A3',
    claim: 'Universities will pay for Orbit.',
    status: 'untested',
    statusText: 'Untested commercially',
    evidence: 'An Imperial Careers contact welcomed a demonstration and offered to raise Orbit with the executive director. Interest does not establish willingness to pay; no budget owner or price has been agreed.',
    nextTest: 'Identify the budget owner and agree a pilot fee with paid-renewal criteria.',
    chapter: 'who-pays',
  },
  {
    id: 'A4',
    claim: 'University event data can be integrated reliably and economically.',
    status: 'inconclusive',
    statusText: 'Technically plausible; authorisation and production reliability unvalidated',
    evidence: 'Symplicity reportedly provides live data; IB Connect may have a one-day feed delay. Integration could require ICT approval, due diligence and procurement. No authorised production integration exists.',
    nextTest: 'Obtain authorised data access for the pilot and measure ≥ 95% sampled listing accuracy.',
    chapter: 'market-engagement',
  },
  {
    id: 'A5',
    claim: 'Students can efficiently find relevant events using Orbit.',
    status: 'inconclusive',
    statusText: 'Prototype testing in progress; insert verified outcomes only when available',
    evidence: 'Neutral walkthrough task under way: “Find an event you would actually attend next week and show us how you would register.” No verified results are reported here yet.',
    nextTest: 'Complete walkthroughs; record unaided completion, relevance, availability match, redirect reached, friction.',
    chapter: 'product',
  },
  {
    id: 'A6',
    claim: 'Better discovery produces repeat usage, attendance improvement and institutional renewal.',
    status: 'untested',
    statusText: 'Untested',
    evidence: 'No pilot has run. First-use success would not prove weekly retention or increased attendance.',
    nextTest: 'Paid pilot: 20% WAU among activated users, +15% host-verified attendance per eligible student, paid renewal.',
    chapter: 'experiment',
  },
]

export const trackerVerdict = 'Evidence has improved. Critical uncertainty remains.'
