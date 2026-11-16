import type { Status } from './evidence'

/**
 * Orbit's EIGHT key business-model assumptions — wording, numbering and status follow the
 * team report and PPT slide 08 ("Orbit's business model has 8 key assumptions").
 *   Evidence gathered:            A1 (supported), A2 (partial), A5 (partial)
 *   Untested — pilot evidence needed: A3, A4 (partially tested with Imperial), A6, A7, A8
 * Status vocabulary: supported · partial (= 'inconclusive') · untested.
 * Never show 100% validation. A5's outcome may only be filled from verified results.
 */
export interface Assumption {
  id: string
  /** Short report title, e.g. "Fragmented discovery". */
  title: string
  claim: string
  status: Status
  /** Report status line, e.g. "Supported: survey and interviews". */
  statusText: string
  group: 'evidence' | 'pilot'
  /** A3–A4: explored in the Imperial engagement, still to be validated in a pilot. */
  imperial?: boolean
  evidence: string
  nextTest: string
  /** Chapter slug where this assumption first becomes visible. */
  chapter: string
}

export const assumptions: Assumption[] = [
  {
    id: 'A1',
    title: 'Fragmented discovery',
    claim: 'Students experience fragmented event discovery.',
    status: 'supported',
    statusText: 'Supported: survey and interviews',
    group: 'evidence',
    evidence: '31 of 42 survey respondents agreed there were too many places to check; 35 of 42 missed at least one event in four weeks; 12 of 13 interviewees described a missed or late-discovered event.',
    nextTest: 'Baseline the problem within an eligible pilot cohort, outside the team’s networks.',
    chapter: 'what-students-told-us',
  },
  {
    id: 'A2',
    title: 'Problem across universities',
    claim: 'Students at other universities experience the same problem.',
    status: 'inconclusive',
    statusText: 'Partial: cross-campus conversations',
    group: 'evidence',
    evidence: 'Individual students at LSE, King’s College London, UCL and London Business School reported similar challenges. These are individual accounts, not institutional data.',
    nextTest: 'Structured discovery at two or three further institutions before expansion.',
    chapter: 'market-engagement',
  },
  {
    id: 'A3',
    title: 'Universities pay',
    claim: 'Universities will pay for Orbit.',
    status: 'untested',
    statusText: 'Untested: partially tested with Imperial',
    group: 'pilot',
    imperial: true,
    evidence: 'An Imperial Careers contact welcomed a demonstration and offered to raise Orbit with the executive director. Interest does not establish willingness to pay; no budget owner or price has been agreed.',
    nextTest: 'Budget-owner approval of a paid pilot; paid renewal at a viable price.',
    chapter: 'who-pays',
  },
  {
    id: 'A4',
    title: 'Event feeds are reliable',
    claim: 'University event feeds can be integrated reliably.',
    status: 'untested',
    statusText: 'Untested: partially tested with Imperial',
    group: 'pilot',
    imperial: true,
    evidence: 'Symplicity reportedly provides live data; IB Connect may have a one-day feed delay. Integration requires ICT approval and due diligence. No authorised production integration exists.',
    nextTest: 'ICT approval and authorised data access for the pilot; measure sampled listing accuracy.',
    chapter: 'market-engagement',
  },
  {
    id: 'A5',
    title: 'Students find value in Orbit',
    claim: 'Students find value in Orbit.',
    status: 'inconclusive',
    statusText: 'Partial: prototype walkthroughs',
    group: 'evidence',
    evidence: 'Prototype walkthroughs with a neutral task: “Find an event you would actually attend next week and show us how you would register.” First-use value is not repeat use.',
    nextTest: 'Activation and meaningful actions within the pilot cohort.',
    chapter: 'walkthroughs',
  },
  {
    id: 'A6',
    title: 'Students return',
    claim: 'Students return to Orbit week after week.',
    status: 'untested',
    statusText: 'Untested: pilot evidence needed',
    group: 'pilot',
    evidence: 'No pilot has run. First-use success does not prove weekly retention.',
    nextTest: 'Weekly active use among activated pilot users.',
    chapter: 'gates',
  },
  {
    id: 'A7',
    title: 'Attendance improves',
    claim: 'Better discovery improves event attendance.',
    status: 'untested',
    statusText: 'Untested: pilot evidence needed',
    group: 'pilot',
    evidence: 'No pilot has run. A click is not a registration, and a registration is not an attendance.',
    nextTest: 'Host-verified attendance per eligible student, against the pre-pilot baseline.',
    chapter: 'gates',
  },
  {
    id: 'A8',
    title: 'Delivery earns a viable margin',
    claim: 'Orbit can be delivered to universities at a viable margin.',
    status: 'untested',
    statusText: 'Untested: pilot evidence needed',
    group: 'pilot',
    evidence: 'Margins exist only in the financial model (modelled). Integration and support effort per university is unknown.',
    nextTest: 'Measure integration and support cost during the pilot against the agreed price.',
    chapter: 'viability',
  },
]

export const assumptionsFootnote = 'Imperial engagement explored A3–A4. Payment and integration remain to be validated in a pilot, alongside A6–A8.'
export const trackerVerdict = 'Evidence has improved. Critical uncertainty remains.'
