/**
 * Evidence Room content. Every card uses ONLY facts that appear in src/data/*.ts or the
 * project brief. Where the honest answer is "we do not know yet", the card says so.
 * Source ids refer to references.ts (S1–S7).
 */
import type { EvidenceLabel, Status } from './evidence'
import type { RefId } from './references'

export const categories = [
  { id: 'origin', label: 'Venture origin and screening' },
  { id: 'method', label: 'Research methodology' },
  { id: 'interviews', label: 'Interview themes' },
  { id: 'survey', label: 'Survey findings' },
  { id: 'jtbd', label: 'Jobs-to-be-Done' },
  { id: 'canvas', label: 'Lean Canvas' },
  { id: 'revenue', label: 'Revenue model alternatives' },
  { id: 'competitors', label: 'Competitor analysis' },
  { id: 'tech', label: 'Technical architecture' },
  { id: 'market', label: 'Market sizing' },
  { id: 'acquisition', label: 'Customer acquisition' },
  { id: 'financial', label: 'Financial model' },
  { id: 'engagement', label: 'Market engagement' },
  { id: 'coaching', label: 'Coaching feedback' },
  { id: 'pilot', label: 'Pilot protocol' },
  { id: 'risks', label: 'Risks and stop conditions' },
  { id: 'expansion', label: 'Expansion strategy' },
  { id: 'references', label: 'References' },
] as const

export type CategoryId = (typeof categories)[number]['id']

export interface EvidenceCard {
  id: string
  category: CategoryId
  claim: string
  evidence: string
  sources: RefId[]
  label: EvidenceLabel
  status: Status
  limitations: string
  nextTest: string
  /** Chapter slug (links to #/present/<slug>). */
  chapter: string
}

const sampleLimit = 'Small convenience sample recruited through team networks; Imperial-heavy; self-reported.'

export const cards: EvidenceCard[] = [
  /* ---- Venture origin and screening ---- */
  {
    id: 'origin-1', category: 'origin', chapter: 'origin',
    claim: 'Orbit began as a problem the team experienced as Imperial students.',
    evidence: 'The starting point was the team’s own experience of fragmented event communication — a sample of six people, not a market report.',
    sources: ['S3'], label: 'unresolved', status: 'inconclusive',
    limitations: 'Six people’s experience; a starting hypothesis, not evidence of a shared problem.',
    nextTest: 'Test the problem outside the team’s networks (see the survey and interviews, then the pilot baseline).',
  },
  {
    id: 'origin-2', category: 'origin', chapter: 'origin',
    claim: 'There may be an opportunity in the mismatch between what universities provide and what students find.',
    evidence: 'Framed with Drucker’s sources of innovation: incongruity (plenty is provided, yet students struggle to find it) and demand-pull. A unified discovery layer might reduce friction — if the problem is shared.',
    sources: ['S1', 'S3'], label: 'unresolved', status: 'inconclusive',
    limitations: 'An opportunity hypothesis. It does not show students would use a new layer or that anyone would pay for it.',
    nextTest: 'Evidence from discovery research (below), then a measurable paid pilot.',
  },
  {
    id: 'origin-3', category: 'origin', chapter: 'screening',
    claim: 'Orbit scored 3.80 / 5 on the Week 2 screening questions: GO to investigate further, not to build a company.',
    evidence: 'Five equally weighted criteria: founder advantage 4/5, customer payment 2/5, market size 4/5, accessibility 5/5, feasibility 4/5 (19 ÷ 5 = 3.80).',
    sources: ['S1', 'S3'], label: 'reported', status: 'supported',
    limitations: 'A team self-assessment. Screening is not validation, and the score does not test demand.',
    nextTest: 'Superseded by discovery and validation work; re-screen if evidence changes materially.',
  },
  {
    id: 'origin-4', category: 'origin', chapter: 'screening',
    claim: 'Willingness to pay was the weakest screening criterion from the start.',
    evidence: 'Customer payment scored 2/5 because no one had shown they would pay. It remains untested (assumption A3).',
    sources: ['S3'], label: 'reported', status: 'supported',
    limitations: 'A team score; a low score is not itself evidence about willingness to pay.',
    nextTest: 'Identify the budget owner and agree a pilot fee with paid-renewal criteria.',
  },

  /* ---- Research methodology ---- */
  {
    id: 'method-1', category: 'method', chapter: 'learning-before-building',
    claim: 'Discovery combined 13 interviews and 42 analysed survey responses.',
    evidence: 'Interviews were held 26–29 October 2026. Sequence: hypothesis, interviews, survey, compare findings, revise assumptions.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: sampleLimit,
    nextTest: 'Baseline the problem within an eligible pilot cohort outside the team’s networks.',
  },
  {
    id: 'method-2', category: 'method', chapter: 'learning-before-building',
    claim: 'We asked about past behaviour, not hypothetical enthusiasm.',
    evidence: 'Questions included: the last event you wanted to attend but missed; how you first heard about it; what platforms you used; whether registration was still open; what prevented attendance; how you keep track of events. Recent behaviour is stronger evidence than enthusiasm; negative responses show where the opportunity may be weaker.',
    sources: ['S2', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Recall of past events is self-reported and may be imperfect.',
    nextTest: 'Replace self-report with measured behaviour in the pilot (verified attendance).',
  },
  {
    id: 'method-3', category: 'method', chapter: 'learning-before-building',
    claim: 'The sample has material limitations that bound every research claim.',
    evidence: 'Small convenience sample; 27 of 42 respondents were Imperial Business School MSc students; self-reported; no representative population estimate; the survey introduction named Orbit; one interview involved leading prompts.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'inconclusive',
    limitations: 'These limits apply to all findings in the Interview themes and Survey findings categories.',
    nextTest: 'Structured discovery at two or three further institutions, with an unbranded instrument.',
  },

  /* ---- Interview themes ---- */
  {
    id: 'int-1', category: 'interviews', chapter: 'what-students-told-us',
    claim: '12 of 13 interviewees described missing an event, or finding out about it too late.',
    evidence: 'Reported by interviewees in 13 semi-structured interviews.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: sampleLimit + ' One interview involved leading prompts.',
    nextTest: 'Repeat with students from other institutions and with an unbranded script.',
  },
  {
    id: 'int-2', category: 'interviews', chapter: 'assumptions-changed',
    claim: 'Students did not ask for one more app; the tool would need to be quicker than current habits.',
    evidence: '4 of 13 interviewees were wary of adopting another system. Anonymised quote: “It would need to be quicker than what I do now, otherwise there’s not much point.”',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Wariness is an attitude, not measured behaviour; n = 13.',
    nextTest: 'Pilot activation and weekly-use thresholds (20% WAU among activated users).',
  },
  {
    id: 'int-3', category: 'interviews', chapter: 'what-students-told-us',
    claim: 'Existing workarounds such as WhatsApp are useful but messy.',
    evidence: 'Anonymised interview quote: “WhatsApp is handy, but the chat is chaos half the time.”',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'A single illustrative quote from an anonymised interviewee; not a prevalence estimate.',
    nextTest: 'Observe what students stop using once Orbit is available (pilot).',
  },
  {
    id: 'int-4', category: 'interviews', chapter: 'assumptions-changed',
    claim: 'Several early beliefs were narrowed by the evidence: more apps, public aggregation, reminders, clash solving, adoption.',
    evidence: 'Five beliefs entered and each came out narrower: students did not want one more app; reminders were not the core job; some misses, such as timetable clashes, are not ours to solve.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Narrowing reflects a small sample; some assumptions may widen again with more evidence.',
    nextTest: 'Re-check the narrowed scope against pilot behaviour.',
  },

  /* ---- Survey findings ---- */
  {
    id: 'sv-1', category: 'survey', chapter: 'what-students-told-us',
    claim: '35 of 42 respondents missed at least one event in the previous four weeks.',
    evidence: 'Survey, 42 analysed responses.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: sampleLimit + ' The survey introduction named Orbit, which may have primed responses.',
    nextTest: 'Baseline the same measure in an eligible pilot cohort.',
  },
  {
    id: 'sv-2', category: 'survey', chapter: 'what-students-told-us',
    claim: '31 of 42 respondents agreed there were too many places to check.',
    evidence: 'Survey, 42 analysed responses.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Agreement with a statement is not evidence that students would switch to a new tool.',
    nextTest: 'Measure repeat use rather than agreement (pilot).',
  },
  {
    id: 'sv-3', category: 'survey', chapter: 'what-students-told-us',
    claim: '23 of 42 most-recent misses were discovery-related: heard too late (13), missed registration deadline (5), event full (5).',
    evidence: 'Other listed causes: timetable clash 10, forgot 5. The listed categories account for 38 of 42 responses; the remaining 4 are not categorised here.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Cause of the most recent miss only; the “discovery-related” grouping is the team’s classification.',
    nextTest: 'Track missed-event causes before and during the pilot.',
  },
  {
    id: 'sv-4', category: 'survey', chapter: 'what-students-told-us',
    claim: 'Students hear about events through friends and email more than through event apps.',
    evidence: 'Multiple-response question (counts do not sum to 42): friends or course-mates 26; university emails 24; WhatsApp or social media 23; careers platforms 17; Students’ Union or societies 16; Eventbrite 7; Luma 6; Fatsoma 2; Handshake 2.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Multiple response; category definitions are the survey’s own.',
    nextTest: 'Compare channel mix in a wider, non-Imperial sample.',
  },
  {
    id: 'sv-5', category: 'survey', chapter: 'assumptions-changed',
    claim: 'Reminders are secondary; timely discovery is the core need.',
    evidence: 'Forgetting accounted for 5 of 42 most-recent misses; hearing too late, deadlines and full events accounted for 23 of 42.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Based on the most recent missed event only.',
    nextTest: 'Check in the pilot whether discovery changes registrations and verified attendance.',
  },
  {
    id: 'sv-6', category: 'survey', chapter: 'what-students-told-us',
    claim: 'Students need relevant opportunities to reach them in time, with less effort than their current habits.',
    evidence: 'Synthesis of survey and interview evidence (key insight): students are not simply searching for more events.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'A synthesis from a small sample; problem evidence is not demand for this solution.',
    nextTest: 'Prototype walkthrough (A5), then the paid pilot.',
  },

  /* ---- Jobs-to-be-Done ---- */
  {
    id: 'jtbd-1', category: 'jtbd', chapter: 'jtbd',
    claim: 'The user, the payer and the gatekeeper are different people with different jobs and decision rights.',
    evidence: 'Week 3 JTBD mapping: students hire Orbit to find things in time; universities want existing programmes seen; organisers want qualified traffic; IT and procurement hold a veto.',
    sources: ['S2', 'S3'], label: 'unresolved', status: 'inconclusive',
    limitations: 'Stakeholder jobs are mapped from research and one institutional conversation, not from interviews with every stakeholder type.',
    nextTest: 'Identify the budget owner and the data-access approver at the pilot institution.',
  },
  {
    id: 'jtbd-2', category: 'jtbd', chapter: 'jtbd',
    claim: 'The refined value proposition is: every relevant opportunity, in one place, early enough to act.',
    evidence: 'Derived from the JTBD mapping and discovery findings.',
    sources: ['S2', 'S3'], label: 'proposed', status: 'untested',
    limitations: 'A proposition, not evidence that it delivers value.',
    nextTest: 'Measure coverage, relevance and availability match in the prototype walkthrough and pilot.',
  },

  /* ---- Lean Canvas ---- */
  {
    id: 'canvas-1', category: 'canvas', chapter: 'lean-canvas',
    claim: 'The Lean Canvas is a collection of assumptions; only the problem box is currently supported by evidence.',
    evidence: 'Each of the nine boxes carries an evidence status. Revenue has no confirmed paid contract.',
    sources: ['S2', 'S3'], label: 'unresolved', status: 'inconclusive',
    limitations: 'Box statuses are the team’s own judgement.',
    nextTest: 'Update the canvas after the pilot; promote assumptions only on verified results.',
  },
  {
    id: 'canvas-2', category: 'canvas', chapter: 'lean-canvas',
    claim: 'The riskiest assumption is that a university will pay and renew.',
    evidence: 'Assumption A3 is untested commercially; A6 (repeat use, attendance improvement and institutional renewal) is untested.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'untested',
    limitations: 'Rank of “riskiest” is a team judgement.',
    nextTest: 'Paid pilot with paid-renewal criteria.',
  },

  /* ---- Revenue model alternatives ---- */
  {
    id: 'rev-1', category: 'revenue', chapter: 'who-pays',
    claim: 'University-funded SaaS is the working hypothesis, not a proven answer.',
    evidence: 'A university subscription links institutional value to recurring revenue while keeping the product free for students. No path has purchasing evidence yet.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'untested',
    limitations: 'An Imperial Careers contact welcomed a demonstration; interest does not establish willingness to pay and no price has been agreed.',
    nextTest: 'Agree a pilot fee with a named budget owner.',
  },
  {
    id: 'rev-2', category: 'revenue', chapter: 'who-pays',
    claim: 'Charging students directly looked weakest.',
    evidence: 'The events are usually free elsewhere.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'untested',
    limitations: 'No student willingness-to-pay data was collected; this is a reasoned judgement, not a measured result.',
    nextTest: 'No test is planned in this evaluation; student-paid models would need their own evidence.',
  },
  {
    id: 'rev-3', category: 'revenue', chapter: 'who-pays',
    claim: 'Organiser commissions need paid-event volume and clean attribution that we do not yet have.',
    evidence: 'Treated as a separate, later business model after the coaching session distinguished university and organiser products.',
    sources: ['S3', 'S6'], label: 'unresolved', status: 'untested',
    limitations: 'No organiser commitments are recorded in the evidence supplied.',
    nextTest: 'Evidence of attributable paid registrations and commission economics, in the separate external-events evaluation.',
  },

  /* ---- Competitor analysis ---- */
  {
    id: 'comp-1', category: 'competitors', chapter: 'product',
    claim: 'Students already use many sources; Orbit’s proposed differentiation is cross-source discovery and relevance.',
    evidence: 'Survey channels: friends 26, university emails 24, WhatsApp or social media 23, careers platforms 17, Students’ Union or societies 16, Eventbrite 7, Luma 6, Fatsoma 2, Handshake 2 (n = 42, multiple response). See the interactive comparison below.',
    sources: ['S3', 'S4'], label: 'proposed', status: 'untested',
    limitations: 'Capability descriptions are high-level and configuration-dependent, not a feature audit. We do not claim competitors lack personalisation or recommendations.',
    nextTest: 'Pilot test of whether students find relevant events faster with Orbit than with their current mix of sources (A5).',
  },
  {
    id: 'comp-2', category: 'competitors', chapter: 'assumptions-changed',
    claim: 'Public event aggregation was narrowed out of the core proposition.',
    evidence: 'Eventbrite and Luma were used by few survey respondents (7 and 6 of 42); the dominant channels were people and university communications.',
    sources: ['S3', 'S4'], label: 'observed', status: 'supported',
    limitations: 'Small Imperial-heavy sample; usage counts do not measure unmet need.',
    nextTest: 'Check source coverage requested by pilot students.',
  },

  /* ---- Technical architecture ---- */
  {
    id: 'tech-1', category: 'tech', chapter: 'product',
    claim: 'Orbit is designed as a discovery layer on top of existing systems, not a replacement.',
    evidence: 'Every card shows its source and redirects to the original registration page. Social features are parked as future hypotheses, not MVP.',
    sources: ['S3', 'S4'], label: 'proposed', status: 'untested',
    limitations: 'Demonstration uses sample events, not live listings.',
    nextTest: 'Authorised data access for the pilot, with measured listing accuracy.',
  },
  {
    id: 'tech-2', category: 'tech', chapter: 'market-engagement',
    claim: 'University event data may be accessible, but authorised, reliable production integration is unvalidated (A4).',
    evidence: 'Symplicity reportedly provides live data; IB Connect may have a one-day feed delay. Integration could require ICT approval, due diligence and procurement. No authorised production integration exists.',
    sources: ['S3', 'S4'], label: 'reported', status: 'inconclusive',
    limitations: 'Statements are reported, not independently verified.',
    nextTest: 'Obtain authorised access for the pilot and measure at least 95% sampled listing accuracy.',
  },
  {
    id: 'tech-3', category: 'tech', chapter: 'product',
    claim: 'The prototype demonstrates the interaction; it does not yet show students can efficiently find relevant events (A5).',
    evidence: 'A neutral walkthrough task is under way: “Find an event you would actually attend next week and show us how you would register.” No verified results are reported here.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'inconclusive',
    limitations: 'A prototype is not a product, and first-use success would not show retention.',
    nextTest: 'Record unaided completion, relevance, availability match, redirect reached and friction.',
  },

  /* ---- Market sizing ---- */
  {
    id: 'mkt-1', category: 'market', chapter: 'viability',
    claim: 'TAM: 133 UK institutions with at least 5,000 students, about £1,865,000 in illustrative annual subscription value.',
    evidence: 'HESA 2024/25 segmentation × proposed prices: 50 Standard institutions × £10,000 + 59 Large × £15,000 + 24 Very large × £20,000.',
    sources: ['S5', 'S7'], label: 'modelled', status: 'untested',
    limitations: 'Prices are proposed, not validated willingness to pay. Market size is not proven demand.',
    nextTest: 'Pilot fee and renewal outcome at one institution.',
  },
  {
    id: 'mkt-2', category: 'market', chapter: 'viability',
    claim: 'SAM: 88 institutions meeting provisional serviceability assumptions (about £1,290,000).',
    evidence: 'Serviceability rates between TAM and SAM are estimated.',
    sources: ['S5', 'S7'], label: 'modelled', status: 'untested',
    limitations: 'Serviceability is an estimate, not an observed rate.',
    nextTest: 'Structured discovery at further institutions to check serviceability.',
  },
  {
    id: 'mkt-3', category: 'market', chapter: 'viability',
    claim: 'SOM: 18 institutions in the 2029 model scenario (about £255,000, undiscounted and indicative).',
    evidence: 'The 18 is a modelled target, not a customer count.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'No purchasing evidence exists for any institution.',
    nextTest: 'Gate 1 to Gate 3 of the expansion roadmap.',
  },
  {
    id: 'mkt-4', category: 'market', chapter: 'viability',
    claim: 'The 5,000-student threshold is a strategic targeting assumption.',
    evidence: 'The model targets UK higher-education providers with at least 5,000 students, then segments price tiers by size (5,000–14,999; 15,000–29,999; 30,000+).',
    sources: ['S5', 'S7'], label: 'modelled', status: 'untested',
    limitations: 'Not derived from customer evidence; smaller institutions may or may not be viable customers.',
    nextTest: 'Test whether institutional size predicts willingness to pay at the pilot and the next institutions.',
  },

  /* ---- Customer acquisition ---- */
  {
    id: 'acq-1', category: 'acquisition', chapter: 'viability',
    claim: 'The 2027–2029 customer factory is a back-calculated planning assumption: 105 contacts to 18 net customers.',
    evidence: 'Funnel: 105 institutional contacts, 54 qualified meetings, 31 pilots, 25 subscription conversions, 18 net customer additions. See the funnel below.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Not observed sales results; contacts may include repeat outreach.',
    nextTest: 'Track real conversion at each step from the first institution onwards.',
  },
  {
    id: 'acq-2', category: 'acquisition', chapter: 'viability',
    claim: 'Acquisition would start from Imperial access and a named institutional champion.',
    evidence: 'Sequence: leverage Imperial access; identify a champion; confirm the budget owner; secure authorised data access; run a measurable pilot; convert to subscription; use documented results to approach others.',
    sources: ['S3', 'S5'], label: 'proposed', status: 'untested',
    limitations: 'A plan. No institution beyond an interested Imperial Careers contact has engaged.',
    nextTest: 'Complete steps 1–4 at Imperial before outreach elsewhere.',
  },
  {
    id: 'acq-3', category: 'acquisition', chapter: 'scale',
    claim: 'London is the initial access point; the SAM covers the UK.',
    evidence: 'Expansion path: Imperial, London universities, wider UK, each stage gated.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Other universities are not customers, partners or pilot participants.',
    nextTest: 'Gate 2: repeat acquisition and deployment at a second institution.',
  },

  /* ---- Financial model ---- */
  {
    id: 'fin-1', category: 'financial', chapter: 'viability',
    claim: 'The base case turns EBITDA-positive in 2029 (about £37,492) with 18 modelled institutions.',
    evidence: 'Modelled revenue £22,500 (2027), £97,110 (2028), £241,600 (2029), £445,325 (2030), £658,345 (2031). EBITDA −£36,724, −£11,666, £37,492, £197,720, £327,383.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Modelled base-case forecasts, not achieved performance. They depend on acquisition, renewal and pricing assumptions that are untested.',
    nextTest: 'Replace modelled inputs with pilot actuals.',
  },
  {
    id: 'fin-2', category: 'financial', chapter: 'viability',
    claim: 'Cash is tightest in 2028 at about £3,919, against £50,000 equity and £10,000 debt.',
    evidence: 'Financial model V3 outputs; modelled cash recovery in 2030.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Very thin cash headroom; any delay in conversion would stress the plan.',
    nextTest: 'Stress-test conversion timing with pilot data.',
  },
  {
    id: 'fin-3', category: 'financial', chapter: 'viability',
    claim: 'A 20% revenue shortfall in 2029 erases the modelled profit.',
    evidence: 'Simplified one-variable sensitivity (costs held constant): −10% revenue gives EBITDA of about £13,332; −20% gives about −£10,828.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Simplified; not a rebuilt cash-flow model.',
    nextTest: 'Re-run the model with observed renewal and pricing.',
  },
  {
    id: 'fin-4', category: 'financial', chapter: 'viability',
    claim: 'Minimum success is roughly £230,000–£235,000 of recurring revenue in 2029.',
    evidence: '2029 operating budget £204,108 plus a 15% coverage allowance. This is an approximate planning target, not the exact break-even point.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Planning threshold only.',
    nextTest: 'Track ARR against the target at each gate.',
  },
  {
    id: 'fin-5', category: 'financial', chapter: 'viability',
    claim: 'First-year pricing includes an introductory discount.',
    evidence: '2027 modelled revenue per institution is £7,500, below the lowest list price of £10,000.',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'The discount rate is in the workbook and not restated here.',
    nextTest: 'Agree real pilot pricing and renewal terms.',
  },

  /* ---- Market engagement ---- */
  {
    id: 'eng-1', category: 'engagement', chapter: 'market-engagement',
    claim: 'An Imperial Careers contact welcomed a demonstration and offered to raise Orbit with the executive director.',
    evidence: 'A single stakeholder conversation. Possible internal champion identified.',
    sources: ['S3', 'S4'], label: 'reported', status: 'inconclusive',
    limitations: 'Interest is not willingness to pay. No budget owner, price or commitment has been agreed.',
    nextTest: 'Identify the budget owner and agree a pilot fee.',
  },
  {
    id: 'eng-2', category: 'engagement', chapter: 'market-engagement',
    claim: 'Students at other London universities described similar frustrations.',
    evidence: 'Individual students at LSE, King’s College London, UCL and London Business School reported similar challenges.',
    sources: ['S3', 'S4'], label: 'reported', status: 'inconclusive',
    limitations: 'Individual accounts, not institutional data. Wider prevalence is unvalidated (A2).',
    nextTest: 'Structured discovery at two or three further institutions before expansion.',
  },
  {
    id: 'eng-3', category: 'engagement', chapter: 'market-engagement',
    claim: 'On the evidence ladder we are honestly only at the third rung.',
    evidence: 'We have problem evidence and an interested contact; we have no pilot, no commitment and no paid renewal.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'inconclusive',
    limitations: 'The ladder is the team’s own framing.',
    nextTest: 'The paid pilot is the next rung.',
  },

  /* ---- Coaching feedback ---- */
  {
    id: 'coach-1', category: 'coaching', chapter: 'coaching',
    claim: 'The coaching session challenged our reasoning on five points.',
    evidence: 'Whether the university and public-events products are the same business; how pilot success is defined; when to stop; where model assumptions came from; the path to a consumer product.',
    sources: ['S6'], label: 'reported', status: 'supported',
    limitations: 'Feedback from a single session.',
    nextTest: 'Each challenge led to a decision; see the next cards.',
  },
  {
    id: 'coach-2', category: 'coaching', chapter: 'coaching',
    claim: 'The university and organiser products are different businesses.',
    evidence: 'Different customers and different economics. The team narrowed to a university-first model with explicit gates.',
    sources: ['S6'], label: 'reported', status: 'supported',
    limitations: 'Coaching feedback, not market evidence.',
    nextTest: 'Evaluate external events separately and only after Year 5.',
  },
  {
    id: 'coach-3', category: 'coaching', chapter: 'coaching',
    claim: 'We lacked success and stop criteria; we now define GO / ITERATE / STOP gates before the pilot.',
    evidence: 'Success thresholds and stop conditions are set in advance of the pilot.',
    sources: ['S6'], label: 'reported', status: 'supported',
    limitations: 'Defined, not yet exercised.',
    nextTest: 'Apply the gates to pilot data.',
  },

  /* ---- Pilot protocol ---- */
  {
    id: 'pilot-1', category: 'pilot', chapter: 'experiment',
    claim: 'The next step is one paid, measurable 8–12 week university pilot, not more features.',
    evidence: 'Thresholds are set in advance. It has not been run.',
    sources: ['S3', 'S6'], label: 'proposed', status: 'untested',
    limitations: 'A proposal. No pilot has run, no institution has agreed, no fee is set.',
    nextTest: 'Agree scope, fee and data access with a budget owner.',
  },
  {
    id: 'pilot-2', category: 'pilot', chapter: 'experiment',
    claim: 'Success is defined by repeat use, host-verified attendance and paid renewal.',
    evidence: 'Proposed thresholds: 20% weekly active users among activated users; +15% host-verified attendance per eligible student; at least 95% sampled listing accuracy; paid renewal.',
    sources: ['S3', 'S6'], label: 'proposed', status: 'untested',
    limitations: 'Thresholds are chosen by the team and are not benchmarked externally.',
    nextTest: 'Run the pilot and report against these thresholds, whichever way they fall.',
  },
  {
    id: 'pilot-3', category: 'pilot', chapter: 'experiment',
    claim: 'Clicks are not registrations and registrations are not attendance.',
    evidence: 'For an illustrative 1,000 invited students, roughly 80 weekly users and 24 meaningful actions are needed. The real test is host-verified attendance.',
    sources: ['S3'], label: 'proposed', status: 'untested',
    limitations: 'The cohort figures are illustrative, not a real cohort.',
    nextTest: 'Obtain host attendance records for pilot events.',
  },

  /* ---- Risks and stop conditions ---- */
  {
    id: 'risk-1', category: 'risks', chapter: 'verdict',
    claim: 'Willingness to pay (A3) and repeat usage with renewal (A6) are untested; this is the material risk.',
    evidence: 'No budget owner or price has been agreed; no pilot has run. First-use success would not prove weekly retention or increased attendance.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'untested',
    limitations: 'Applies to the whole venture; the verdict is conditional because of it.',
    nextTest: 'The pilot is designed to test A3 and A6.',
  },
  {
    id: 'risk-2', category: 'risks', chapter: 'verdict',
    claim: 'The assumption tracker does not show full validation: one supported, three inconclusive, two untested.',
    evidence: 'A1 supported within the sample; A2, A4 and A5 inconclusive; A3 and A6 untested. Evidence has improved. Critical uncertainty remains.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'inconclusive',
    limitations: 'Statuses are the team’s assessment.',
    nextTest: 'Update each status only from verified results.',
  },
  {
    id: 'risk-3', category: 'risks', chapter: 'experiment',
    claim: 'We would stop or iterate if pre-set pilot thresholds are not met.',
    evidence: 'GO / ITERATE / STOP gates are defined before the pilot. The thresholds that matter most are listed on the Pilot protocol cards and in the assumption tracker.',
    sources: ['S6'], label: 'proposed', status: 'untested',
    limitations: 'The full scorecard lives in the experiment chapter; it is not duplicated or extended here.',
    nextTest: 'Apply the scorecard at the end of the pilot.',
  },

  /* ---- Expansion strategy ---- */
  {
    id: 'exp-1', category: 'expansion', chapter: 'scale',
    claim: 'Growth is gated: each year must prove something before the next is unlocked.',
    evidence: 'Year 1 prove the model (3 modelled customers); Year 2 repeatability (8); Year 3 commercial sustainability (18, modelled positive EBITDA); Years 4–5 network (31, then 45).',
    sources: ['S5'], label: 'modelled', status: 'untested',
    limitations: 'Customer counts are modelled targets. Gate criteria are proposed.',
    nextTest: 'Gate 1: pilot thresholds met and a paid renewal.',
  },
  {
    id: 'exp-2', category: 'expansion', chapter: 'scale',
    claim: 'External-only city event discovery is a separate opportunity after Year 5, not the automatic next step.',
    evidence: 'Potential inherited advantages: local event ecosystem familiarity, discovery infrastructure, potential organiser relationships, local user behaviour. New risks: users beyond the university segment, established consumer platforms, organiser partnerships, attributable paid registrations, commission economics, separate retention and acquisition costs.',
    sources: ['S6'], label: 'proposed', status: 'untested',
    limitations: 'External-event commissions are not included in the five-year university forecast. The university business can succeed while this one fails, or vice versa.',
    nextTest: 'Pursue only if its own evidence justifies it.',
  },

  /* ---- References ---- */
  {
    id: 'ref-1', category: 'references', chapter: 'question',
    claim: 'Every figure is traceable to seven supplied sources.',
    evidence: 'S1–S7: course lectures (Weeks 2 and 3), the team’s reports, financial model V3, the coaching session feedback and HESA 2024/25 enrolment data. See the reference list below.',
    sources: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'], label: 'observed', status: 'supported',
    limitations: 'No further academic citations are made beyond this list.',
    nextTest: 'Add independent sources as the pilot generates them.',
  },
  {
    id: 'ref-2', category: 'references', chapter: 'question',
    claim: 'Survey figures use 42 responses throughout.',
    evidence: 'Some source screenshots display 44 responses while the analysed dataset reports 42; 42 is used as the denominator everywhere. See Known data issues.',
    sources: ['S3', 'S4'], label: 'unresolved', status: 'inconclusive',
    limitations: 'Reconciliation of 44 vs 42 remains required.',
    nextTest: 'Reconcile the raw export before any further use of the survey.',
  },
]

/* ---------- Competitor comparison ---------- */

export interface Alternative {
  id: string
  name: string
  /** What it is primarily for. */
  primary: string
  /** Where its events come from. */
  events: string
  /** Cross-source view for a student. */
  crossSource: string
  /** Personalisation / recommendations. */
  relevance: string
  /** Mention in the survey (n = 42), where the survey named it. */
  survey: string
  overlap: string
  orbitTest: string
}

const varies = 'Varies — configuration-dependent'

export const alternatives: Alternative[] = [
  {
    id: 'symplicity', name: 'Symplicity',
    primary: 'An institution’s own careers events and opportunities.',
    events: 'Published by the institution and its employers.',
    crossSource: 'Within one institution’s platform.',
    relevance: varies,
    survey: 'Careers platforms (category): 17 of 42; not broken out by product.',
    overlap: 'Careers events at the same university.',
    orbitTest: 'Whether authorised data access (reportedly live) gives accurate listings in Orbit (A4).',
  },
  {
    id: 'campusgroups', name: 'CampusGroups / IB Connect',
    primary: 'An institution’s own clubs, societies and campus events.',
    events: 'Published by the institution’s groups and departments.',
    crossSource: 'Within one institution’s platform.',
    relevance: varies,
    survey: 'Students’ Union or societies (category): 16 of 42; not broken out by product.',
    overlap: 'Society and campus events at the same university.',
    orbitTest: 'Whether a feed delay of up to one day (IB Connect, reported) affects usefulness.',
  },
  {
    id: 'eventbrite', name: 'Eventbrite',
    primary: 'Organiser-published public events and ticketing.',
    events: 'Published by organisers.',
    crossSource: 'Public events from many organisers, not tied to a university.',
    relevance: varies,
    survey: '7 of 42.',
    overlap: 'External and public events.',
    orbitTest: 'Not part of the university pilot; relevant only to the separate external-events opportunity.',
  },
  {
    id: 'meetup', name: 'Meetup',
    primary: 'Organiser-published group and community events.',
    events: 'Published by group organisers.',
    crossSource: 'Public groups, not tied to a university.',
    relevance: varies,
    survey: 'Not separately counted.',
    overlap: 'External community events.',
    orbitTest: 'Not part of the university pilot.',
  },
  {
    id: 'luma', name: 'Luma',
    primary: 'Organiser-published public events and registration.',
    events: 'Published by organisers.',
    crossSource: 'Public events from many organisers, not tied to a university.',
    relevance: varies,
    survey: '6 of 42.',
    overlap: 'External and public events.',
    orbitTest: 'Not part of the university pilot.',
  },
  {
    id: 'newsletters', name: 'University newsletters',
    primary: 'The sender’s curated announcements.',
    events: 'Selected by each sender (department, careers, society).',
    crossSource: 'One list at a time; students subscribe to several.',
    relevance: 'Depends on how each sender segments.',
    survey: 'University emails: 24 of 42.',
    overlap: 'The second-most used discovery route in the sample.',
    orbitTest: 'Whether Orbit surfaces events earlier than the emails students already receive.',
  },
  {
    id: 'whatsapp', name: 'WhatsApp',
    primary: 'Peer sharing between friends and course-mates; unstructured.',
    events: 'Whatever members share.',
    crossSource: 'Per chat; no shared index.',
    relevance: 'Depends on who is in the chat.',
    survey: 'WhatsApp or social media: 23 of 42; friends or course-mates: 26 of 42.',
    overlap: 'The most used discovery route in the sample.',
    orbitTest: 'Whether students keep using Orbit weekly rather than reverting to chat.',
  },
]

export const competitorNote =
  'Capability descriptions are high-level and configuration-dependent, not a feature audit. We do not claim that these tools lack personalisation or recommendations; the proposed difference is combining sources across channels with relevance to the individual student, which is untested.'

export const orbitRow = {
  name: 'Orbit (proposed)',
  primary: 'Cross-source discovery and relevance for students at one institution.',
  events: 'Aggregated from authorised institutional and other sources; every card links to the original.',
  crossSource: 'Intended: one view across sources.',
  relevance: 'Intended: relevance to the student’s interests and availability.',
}

/* ---------- Questions we anticipate ---------- */

export interface Anticipated {
  q: string
  a: string
  /** True where the honest answer is that we do not know yet. */
  unknown?: boolean
  nextTest?: string
  chapter?: string
}

export const anticipated: Anticipated[] = [
  {
    q: 'Why would universities buy rather than build this themselves?',
    a: 'We do not know yet. Our untested hypothesis is that an institution’s platforms cover its own listings while a student’s discovery spans several sources. We have no evidence on build-versus-buy. The only institutional signal so far is an interested Imperial Careers contact; no buy-or-build evidence exists.',
    unknown: true,
    nextTest: 'Ask the budget owner at the pilot institution how they would otherwise meet this need and what it would cost them.',
    chapter: 'who-pays',
  },
  {
    q: 'What is the real problem if students already use calendars and WhatsApp?',
    a: 'In our sample, 35 of 42 missed at least one event in four weeks and 23 of 42 most-recent misses were discovery-related (heard too late, missed deadline, event full); forgetting accounted for 5 of 42. The problem is reaching people in time, not remembering. WhatsApp is also the most used route (23 of 42), with interviewees describing it as handy but chaotic.',
    nextTest: 'Baseline missed events in an eligible pilot cohort outside the team’s networks.',
    chapter: 'what-students-told-us',
  },
  {
    q: 'Why do you believe 18 institutions will subscribe?',
    a: 'We do not hold that belief as a finding. 18 institutions is a modelled target back-calculated from a planning funnel (105 contacts, 54 meetings, 31 pilots, 25 conversions, 18 net). There is no purchasing evidence for any institution.',
    unknown: true,
    nextTest: 'Observe real conversion at each funnel step, starting with one paid pilot.',
    chapter: 'viability',
  },
  {
    q: 'Why is the minimum target institution size 5,000 students?',
    a: 'It is a strategic targeting assumption, used to define 133 UK providers in the TAM and the pricing tiers. It is not derived from customer evidence.',
    unknown: true,
    nextTest: 'Test whether institutional size predicts willingness to pay at the pilot and the next institutions.',
    chapter: 'viability',
  },
  {
    q: 'What evidence supports willingness to pay?',
    a: 'None yet beyond an interested Imperial Careers contact who welcomed a demonstration and offered to raise Orbit with the executive director. Interest is not willingness to pay: no budget owner, price or commitment has been agreed. Assumption A3 is untested commercially, and willingness to pay was the weakest screening criterion (2/5).',
    unknown: true,
    nextTest: 'Identify the budget owner and agree a pilot fee with paid-renewal criteria.',
    chapter: 'who-pays',
  },
  {
    q: 'What if Imperial does not provide API access?',
    a: 'Then the pilot cannot run as designed. Integration could require ICT approval, due diligence and procurement, and no authorised production integration exists today. Symplicity reportedly provides live data and IB Connect may have a one-day feed delay, but these are reported, not verified.',
    unknown: true,
    nextTest: 'Obtain authorised data access for the pilot and measure at least 95% sampled listing accuracy; if access cannot be obtained, that is itself a finding against the model.',
    chapter: 'market-engagement',
  },
  {
    q: 'Why is the survey sample limited?',
    a: 'It was a small convenience sample recruited through team networks, 27 of 42 respondents were Imperial Business School MSc students, behaviour was self-reported, and the survey introduction named Orbit. We treat results as signals of a problem within the sample, not a population estimate.',
    nextTest: 'Structured discovery at two or three further institutions with an unbranded instrument.',
    chapter: 'learning-before-building',
  },
  {
    q: 'Why not monetise through students?',
    a: 'The events are usually free elsewhere, which made direct student payment look weakest. We collected no student willingness-to-pay data, so this is a reasoned judgement rather than a measured result.',
    nextTest: 'No test is planned in this evaluation; student-paid models would need their own evidence.',
    chapter: 'who-pays',
  },
  {
    q: 'How will you measure actual attendance?',
    a: 'Through host-verified attendance records, not clicks or redirects. The proposed threshold is +15% host-verified attendance per eligible student. Clicks, registrations and attendance are distinct measures. This depends on pilot hosts being willing to share attendance data, which is not yet agreed.',
    nextTest: 'Agree an attendance-verification method with pilot hosts before launch.',
    chapter: 'experiment',
  },
  {
    q: 'What if engagement is strong but the university refuses to renew?',
    a: 'Then the pilot has not succeeded. Paid renewal is a success criterion in its own right: students using Orbit would show product usage but not institutional willingness to pay, and the venture’s economics depend on renewal (A6). We would iterate or stop rather than expand.',
    nextTest: 'Agree paid-renewal criteria with the budget owner before the pilot starts.',
    chapter: 'experiment',
  },
  {
    q: 'Why should the external-events product wait?',
    a: 'The coaching session showed the university and public-events products are different businesses with different customers and economics. External events bring new risks (users beyond the university segment, competing consumer platforms, organiser partnerships, attributable paid registrations, commission economics). It is excluded from the five-year forecast and pursued only if its own evidence justifies it.',
    nextTest: 'Evaluate it as a separate opportunity after Year 5.',
    chapter: 'scale',
  },
  {
    q: 'What would make you abandon the venture?',
    a: 'Stop conditions are defined before the pilot through GO / ITERATE / STOP gates. Missing the proposed thresholds recorded here would count against the venture: 20% weekly active users among activated users, +15% host-verified attendance per eligible student, at least 95% sampled listing accuracy, and paid renewal. The full scorecard is in the experiment chapter.',
    nextTest: 'Apply the pre-set scorecard at the end of the pilot.',
    chapter: 'experiment',
  },
]
