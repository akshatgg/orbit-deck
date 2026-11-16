import { discoveryChannels, discoveryRelatedMisses, missCauses, otherInterviewSignals, quotes, headlineFindings } from './research'

/**
 * Chapter 04 — discovery insight → evidence → product decision.
 * Replaces the former "assumptions we had to change" cards.
 *
 * WORDING TO ALIGN: the team asked for the product decisions on Juanfe's PPT Slide 4. That slide
 * was not available when this file was written, so every row below is built ONLY from evidence
 * already in research.ts. Replace `insight` / `decision` text with the slide's exact wording;
 * keep the evidence figures (all denominators are 42 survey responses / 13 interviews).
 */
export type ValuePropId = 'feed' | 'interests' | 'schedule'

export const valueProps: { id: ValuePropId; n: number; title: string; line: string }[] = [
  { id: 'feed', n: 1, title: 'Browse in one feed', line: 'Discover relevant events across multiple platforms in one place.' },
  { id: 'interests', n: 2, title: 'Match your interests', line: 'Personalised event recommendations based on individual preferences and interests.' },
  { id: 'schedule', n: 3, title: 'Fit your schedule', line: 'Discover events that align with personal availability and scheduling preferences.' },
]

// Row wording (insight / decision) awaits alignment with Juanfe's PPT Slide 4 (see header note).
const v = (id: string) => missCauses.find((c) => c.id === id)!.value
const tooMany = headlineFindings.find((f) => f.id === 'too-many')!
const ch = (label: string) => discoveryChannels.find((c) => c.label.startsWith(label))!.value

export interface ProductDecision {
  id: string
  insight: string
  evidence: string
  /** Present-mode hero figure for the evidence (same counts as `evidence`). */
  stat: { value: number; of: number; unit: 'survey' | 'interviews' }
  /** What the hero figure counts, in a short phrase. */
  statLabel: string
  /** Optional one-line breakdown shown under the hero figure. */
  detail?: string
  decision: string
  /** Value proposition this decision delivers; null = a principle that shapes all three. */
  vp: ValuePropId | null
  /** Decision deprioritises something (shown muted, not as a feature). */
  deprioritised?: boolean
}

export const productDecisions: ProductDecision[] = [
  {
    id: 'd1',
    insight: 'Too many places to check',
    stat: { value: tooMany.value, of: tooMany.of, unit: 'survey' },
    statLabel: 'say there are too many places to check',
    detail: `Friends ${ch('Friends')}, email ${ch('University emails')}, social ${ch('WhatsApp')} vs Luma ${ch('Luma')}`,
    evidence: `${tooMany.value} of ${tooMany.of} survey respondents · friends ${ch('Friends')}, email ${ch('University emails')}, social ${ch('WhatsApp')} vs Luma ${ch('Luma')}`,
    decision: 'One feed across university and external sources, starting with authorised university events',
    vp: 'feed',
  },
  {
    id: 'd2',
    insight: 'Students hear too late',
    stat: { value: discoveryRelatedMisses, of: 42, unit: 'survey' },
    statLabel: 'latest misses were discovery-related',
    detail: `Heard too late ${v('late')}, deadline ${v('deadline')}, event full ${v('full')}`,
    evidence: `${discoveryRelatedMisses} of 42 latest misses: heard too late (${v('late')}), deadline (${v('deadline')}), full (${v('full')})`,
    decision: 'Personalise the feed so relevant events surface early enough to act',
    vp: 'interests',
  },
  {
    id: 'd3',
    insight: 'Timetables clash',
    stat: { value: v('clash'), of: 42, unit: 'survey' },
    statLabel: 'missed an event through a timetable clash',
    evidence: `${v('clash')} of 42 missed an event through a timetable clash`,
    decision: 'Filter by availability, accepting Orbit cannot remove the clash itself',
    vp: 'schedule',
  },
  {
    id: 'd4',
    insight: 'No appetite for another app',
    stat: { value: otherInterviewSignals[0].value, of: 13, unit: 'interviews' },
    statLabel: 'interviewees wary of another system',
    detail: `“${quotes[1].text}”`,
    evidence: `${otherInterviewSignals[0].value} of 13 interviewees wary of another system · “${quotes[1].text}”`,
    decision: 'Show every source and send students to the original registration page',
    vp: null,
  },
  {
    id: 'd5',
    insight: 'Forgetting is minor',
    stat: { value: v('forgot'), of: 42, unit: 'survey' },
    statLabel: 'simply forgot',
    evidence: `Only ${v('forgot')} of 42 simply forgot`,
    decision: 'Reminders become secondary, not the core product',
    vp: null,
    deprioritised: true,
  },
]

export const decisionsSource = 'S3 · interviews (n = 13) and survey (n = 42). Decisions: team synthesis of the discovery evidence.'
