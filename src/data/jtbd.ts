/** Jobs-to-be-Done content for Chapter 06 (framework: NVC Week 3, S2). */
export type StakeholderId = 'student' | 'university' | 'organiser' | 'it'
export type RoleKind = 'user' | 'payer' | 'gatekeeper' | 'supplier'

export interface Stakeholder {
  id: StakeholderId
  name: string
  short: string
  role: RoleKind
  job: string
  /** label for the second block */
  detailLabel: string
  detail: string
  alternatives?: string
  /** angle position in the diagram, % of container */
  pos: { x: number; y: number }
}

export const stakeholders: Stakeholder[] = [
  {
    id: 'student',
    name: 'Student',
    short: 'Student',
    role: 'user',
    job: 'When I have limited time and many event sources, help me discover relevant opportunities early enough to decide whether to attend.',
    alternatives: 'Emails, group chats, calendars, university platforms and external discovery apps.',
    detailLabel: 'Desired outcome',
    detail: 'Less search effort, more timely awareness and better event relevance.',
    pos: { x: 50, y: 11 },
  },
  {
    id: 'university',
    name: 'University',
    short: 'University',
    role: 'payer',
    job: 'Help our students discover and participate in the opportunities we already provide, without creating significant additional administration.',
    detailLabel: 'Potential value',
    detail: 'Better visibility of existing programmes and potentially greater participation.',
    pos: { x: 88, y: 50 },
  },
  {
    id: 'organiser',
    name: 'Event organiser',
    short: 'Organiser',
    role: 'supplier',
    job: 'Help relevant students discover my events and reach the original registration page.',
    detailLabel: 'Potential value',
    detail: 'Additional attributable discovery and referral traffic.',
    pos: { x: 50, y: 89 },
  },
  {
    id: 'it',
    name: 'University IT / data owner',
    short: 'IT / data owner',
    role: 'gatekeeper',
    job: 'Enable any integration to operate within our technical, security, data-protection and procurement requirements.',
    detailLabel: 'Potential value',
    detail: 'A controlled complementary discovery layer rather than replacement of existing systems.',
    pos: { x: 12, y: 50 },
  },
]

export const roles = {
  user: { badge: 'User', color: 'var(--color-cyan)', right: 'Decides whether Orbit is worth their attention.', who: 'The student' },
  payer: { badge: 'Hypothesised payer', color: 'var(--color-ev-proposed)', right: 'Would decide whether to fund a subscription. Not yet tested.', who: 'The university' },
  gatekeeper: { badge: 'Gatekeepers', color: 'var(--color-silver)', right: 'Can approve or block any integration on security, data-protection and procurement grounds.', who: 'IT, procurement and data owners' },
  supplier: { badge: 'Event supplier', color: 'var(--color-dim)', right: 'Controls the listing and the original registration page.', who: 'The event organiser' },
} as const
