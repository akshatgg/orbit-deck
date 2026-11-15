/**
 * SAMPLE events for the in-page Orbit walkthrough (Chapter 07).
 * Entirely fictional titles and organisers. Not live listings, not scraped, not real integrations.
 * Dates are an illustrative week (Mon 16 – Sun 22 Nov).
 */
export const topics = ['Careers', 'Entrepreneurship', 'Networking', 'Technology', 'Competitions', 'Social events', 'Academic workshops'] as const
export type Topic = (typeof topics)[number]

export const formats = ['Talk', 'Workshop', 'Networking', 'Competition', 'Social', 'Panel'] as const
export type EventFormat = (typeof formats)[number]

export const availabilities = ['Weekday evenings', 'Lunchtimes', 'Weekends'] as const
export type Availability = (typeof availabilities)[number]

export const sourceLabels = {
  careers: 'University careers platform (sample)',
  calendar: 'University events calendar (sample)',
  society: 'Society channel (sample)',
  public: 'Public event platform (sample)',
} as const
export type SourceKey = keyof typeof sourceLabels

export const universities = [
  { id: 'imperial', name: 'Imperial College London', short: 'Imperial', note: 'Demo option' },
  { id: 'london-b', name: 'Another London university', short: 'My university', note: 'Demo option only' },
  { id: 'other', name: 'A university outside London', short: 'My university', note: 'Demo option only' },
] as const
export type UniversityId = (typeof universities)[number]['id']

export const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export const dayDates = [16, 17, 18, 19, 20, 21, 22] as const

export interface SampleEvent {
  id: string
  title: string
  organiser: string
  source: SourceKey
  scope: 'university' | 'london'
  topics: Topic[]
  format: EventFormat
  day: number // 0 = Mon … 6 = Sun
  time: string // 24h "HH:MM"
  location: string
  price: string
  description: string
  deadline?: string
  hue: number
}

export const sampleEvents: SampleEvent[] = [
  { id: 's1', title: 'Careers Fair Preparation Clinic', organiser: 'Sample Careers Service', source: 'careers', scope: 'university', topics: ['Careers'], format: 'Workshop', day: 0, time: '12:30', location: 'Careers Centre, Room 2 (sample)', price: 'Free', description: 'Small-group practice on introductions and questions to ask recruiters before a careers fair.', hue: 222 },
  { id: 's2', title: 'Funding Your Venture: Grants Q&A', organiser: 'Sample Enterprise Lab', source: 'calendar', scope: 'university', topics: ['Entrepreneurship', 'Academic workshops'], format: 'Talk', day: 0, time: '18:00', location: 'Lecture Theatre A (sample)', price: 'Free', description: 'A walk-through of typical early-stage funding routes, followed by open questions.', hue: 262 },
  { id: 's3', title: 'Founder Stories: Building Before You Graduate', organiser: 'Sample Enterprise Society', source: 'society', scope: 'university', topics: ['Entrepreneurship', 'Networking'], format: 'Talk', day: 1, time: '18:30', location: 'Student Hub, Level 1 (sample)', price: 'Free', description: 'Three student founders describe what they tested first and what they dropped.', deadline: 'Register by Mon evening', hue: 280 },
  { id: 's4', title: 'Research Methods Drop-in Workshop', organiser: 'Sample Graduate School', source: 'calendar', scope: 'university', topics: ['Academic workshops'], format: 'Workshop', day: 1, time: '12:00', location: 'Library Seminar Room (sample)', price: 'Free', description: 'Drop in with questions on survey design and interview sampling.', hue: 190 },
  { id: 's5', title: 'Data and AI Practitioners Meetup', organiser: 'Sample Tech Meetup Group', source: 'public', scope: 'london', topics: ['Technology', 'Networking'], format: 'Networking', day: 1, time: '19:00', location: 'Central London venue (sample)', price: 'Free', description: 'Lightning talks and an open networking hour for people working with data.', hue: 200 },
  { id: 's6', title: 'Cross-Programme Networking Evening', organiser: 'Sample Student Union', source: 'calendar', scope: 'university', topics: ['Networking', 'Careers'], format: 'Networking', day: 2, time: '18:00', location: 'Student Union Hall (sample)', price: 'Free', description: 'Meet students and alumni from other programmes over an informal evening.', hue: 300 },
  { id: 's7', title: 'Careers in Climate and Energy Panel', organiser: 'Sample Industry Forum', source: 'public', scope: 'london', topics: ['Careers', 'Technology'], format: 'Panel', day: 2, time: '18:30', location: 'East London venue (sample)', price: '£12 (sample)', description: 'Practitioners discuss entry routes into climate and energy roles.', hue: 150 },
  { id: 's8', title: 'Technology Interview Skills Lab', organiser: 'Sample Careers Service', source: 'careers', scope: 'university', topics: ['Technology', 'Careers'], format: 'Workshop', day: 3, time: '13:00', location: 'Careers Centre, Room 4 (sample)', price: 'Free', description: 'Practice structured technical and behavioural interview questions with feedback.', hue: 215 },
  { id: 's9', title: 'London Early-Stage Founders Breakfast', organiser: 'Sample Founders Network', source: 'public', scope: 'london', topics: ['Entrepreneurship', 'Networking'], format: 'Networking', day: 3, time: '08:00', location: 'North London café (sample)', price: '£8 (sample)', description: 'An informal breakfast for early-stage founders and operators.', hue: 40 },
  { id: 's10', title: 'Open Mic and Games Night', organiser: 'Sample Postgraduate Society', source: 'society', scope: 'university', topics: ['Social events'], format: 'Social', day: 3, time: '20:00', location: 'Student Union Bar (sample)', price: 'Free', description: 'Relaxed evening of music, board games and conversation.', hue: 345 },
  { id: 's11', title: 'Student Venture Pitch Heats', organiser: 'Sample Enterprise Lab', source: 'society', scope: 'university', topics: ['Competitions', 'Entrepreneurship'], format: 'Competition', day: 4, time: '17:30', location: 'Innovation Hub (sample)', price: 'Free', description: 'Five-minute pitches to a panel; top teams are invited to a final round.', deadline: 'Team sign-up closes Wed', hue: 20 },
  { id: 's12', title: 'Postgraduate Autumn Social', organiser: 'Sample Postgraduate Society', source: 'society', scope: 'university', topics: ['Social events', 'Networking'], format: 'Social', day: 4, time: '19:30', location: 'Student Union Bar (sample)', price: 'Free', description: 'A relaxed mixer for postgraduates across programmes.', hue: 320 },
  { id: 's13', title: 'Product Case Competition Weekend', organiser: 'Sample Case Challenge', source: 'public', scope: 'london', topics: ['Competitions', 'Technology'], format: 'Competition', day: 5, time: '09:30', location: 'West London venue (sample)', price: '£15 (sample)', description: 'Teams work a product strategy case over a day and present to judges.', deadline: 'Applications close Thu', hue: 170 },
  { id: 's14', title: 'Weekend Design Sprint', organiser: 'Sample Enterprise Lab', source: 'calendar', scope: 'university', topics: ['Entrepreneurship', 'Technology', 'Academic workshops'], format: 'Workshop', day: 6, time: '10:00', location: 'Design Studio, Level 2 (sample)', price: 'Free', description: 'A one-day sprint from problem framing to a testable prototype.', hue: 246 },
]

export interface Prefs {
  topics: Topic[]
  formats: EventFormat[]
  availability: Availability[]
}

export function slotOf(e: SampleEvent): Availability | null {
  if (e.day >= 5) return 'Weekends'
  const [h, m] = e.time.split(':').map(Number)
  const mins = h * 60 + m
  if (mins >= 11 * 60 + 30 && mins <= 14 * 60 + 30) return 'Lunchtimes'
  if (mins >= 17 * 60) return 'Weekday evenings'
  return null
}

export function dateLabel(e: SampleEvent) {
  return `${dayNames[e.day]} ${dayDates[e.day]} Nov`
}

/** Transparent, rule-based relevance: topic overlap ×3, format ×2, availability ×2. */
export function scoreEvent(e: SampleEvent, p: Prefs) {
  const reasons: string[] = []
  let score = 0
  const hits = e.topics.filter((t) => p.topics.includes(t))
  if (hits.length) {
    score += 3 * hits.length
    reasons.push(`Matches ${hits.join(', ')}`)
  }
  if (p.formats.includes(e.format)) {
    score += 2
    reasons.push(`${e.format} format`)
  }
  const slot = slotOf(e)
  if (slot && p.availability.includes(slot)) {
    score += 2
    reasons.push(`Fits your ${slot.toLowerCase()}`)
  }
  return { score, reasons }
}

export const matchBand = (score: number) => (score >= 6 ? 'Strong match' : score >= 3 ? 'Good match' : score > 0 ? 'Partial match' : '')
