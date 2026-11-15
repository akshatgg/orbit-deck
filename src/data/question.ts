/**
 * Chapter 00 — illustrative notification reconstruction.
 * Every item here is ILLUSTRATIVE: a reconstruction of a pattern, not a recording of any
 * research participant. Source labels are plain text only (no third-party logos or UI).
 */
export interface Notice {
  id: string
  /** Source label as plain text. */
  source: string
  event: string
  /** Short generic notification body. */
  body: string
  /** Direction the card emerges from in step 2 (px offsets). */
  from: { x: number; y: number }
}

/** The first notification — the one that closes in step 3. */
export const heroNotice: Notice = {
  id: 'careers',
  source: 'Symplicity',
  event: 'Careers workshop',
  body: 'Registration closes today.',
  from: { x: 0, y: 0 },
}

/** Additional notifications that emerge from different sources in step 2. */
export const otherNotices: Notice[] = [
  { id: 'founder', source: 'Luma', event: 'Founder networking event', body: 'Registration open', from: { x: -90, y: 40 } },
  { id: 'society', source: 'WhatsApp', event: 'Society meeting', body: 'Reminder in a group chat', from: { x: 0, y: 70 } },
  { id: 'competition', source: 'IB Connect', event: 'Entrepreneurship competition', body: 'Applications open', from: { x: 90, y: 40 } },
  { id: 'lecture', source: 'University email', event: 'Guest lecture', body: 'Listed in a weekly mailing', from: { x: -70, y: -30 } },
  { id: 'public', source: 'Eventbrite / Meetup', event: 'Public networking event', body: 'Tickets available', from: { x: 70, y: -30 } },
]

/** All seven source labels named in the brief, in display order. */
export const sourceLabels = ['University email', 'Symplicity', 'IB Connect', 'WhatsApp', 'Luma', 'Eventbrite', 'Meetup']

export const scenarioLabel = 'Illustrative reconstruction — not a recording of a research participant.'
export const freezeQuestion = 'What if the problem is not a lack of opportunities, but how students discover them?'
export const centralQuestion = 'Why are students missing opportunities that already exist?'
export const orbitSubtitle = 'A New Venture Creation journey from observation to evidence.'
