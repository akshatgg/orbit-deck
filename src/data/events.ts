/**
 * ILLUSTRATIVE demo events — fictional sample data for the in-pitch simulation.
 * Not live feeds, not real listings, no real organiser endorsement implied.
 */
export type Interest =
  | 'Consulting'
  | 'Startups'
  | 'Technology'
  | 'Finance'
  | 'Marketing'
  | 'Networking'
  | 'Social'
  | 'Entrepreneurship'
  | 'Design'
  | 'AI'

export const interests: Interest[] = [
  'Consulting',
  'Startups',
  'Technology',
  'Finance',
  'Marketing',
  'Networking',
  'Social',
  'Entrepreneurship',
  'Design',
  'AI',
]

export type Scope = 'university' | 'london'

export interface DemoEvent {
  id: string
  title: string
  tags: Interest[]
  category: string
  location: string
  date: string
  day: number // day offset in the illustrative week (0 = Mon)
  time: string
  source: string // generic source type, never a real account
  scope: Scope
  description: string
  deadline?: string
  hue: number
}

export const demoEvents: DemoEvent[] = [
  { id: 'e1', title: 'Founders’ Fireside: From MSc Project to Seed', tags: ['Startups', 'Entrepreneurship'], category: 'Talk', location: 'Business School, Lecture Theatre 2', date: 'Tue 18 Nov', day: 1, time: '18:30', source: 'Entrepreneurship society', scope: 'university', description: 'Two alumni founders on validating a venture while studying.', deadline: 'Registration closes Mon 17 Nov', hue: 258 },
  { id: 'e2', title: 'Consulting Case Workshop', tags: ['Consulting', 'Finance'], category: 'Workshop', location: 'Careers Centre, Room 3.1', date: 'Wed 19 Nov', day: 2, time: '13:00', source: 'Careers portal', scope: 'university', description: 'Hands-on market-sizing case practice in small groups.', hue: 220 },
  { id: 'e3', title: 'Venture Networking Evening', tags: ['Networking', 'Entrepreneurship', 'Startups'], category: 'Networking', location: 'Student Hub, Level 1', date: 'Thu 20 Nov', day: 3, time: '18:00', source: 'University events calendar', scope: 'university', description: 'Meet founders, investors-in-residence and fellow students building ventures.', deadline: 'Limited places · RSVP by Wed', hue: 280 },
  { id: 'e4', title: 'AI Product Teardown Night', tags: ['AI', 'Technology', 'Design'], category: 'Meetup', location: 'Shoreditch, London', date: 'Tue 18 Nov', day: 1, time: '19:00', source: 'External event platform', scope: 'london', description: 'Product leads dissect three AI launches — what worked and what didn’t.', hue: 190 },
  { id: 'e5', title: 'Startup Pitch Competition — Heats', tags: ['Startups', 'Entrepreneurship'], category: 'Competition', location: 'Innovation Hub', date: 'Fri 21 Nov', day: 4, time: '10:00', source: 'Enterprise lab newsletter', scope: 'university', description: 'Five-minute pitches; top teams progress to the final.', deadline: 'Team sign-up closes Wed 19 Nov', hue: 30 },
  { id: 'e6', title: 'London Founders Breakfast', tags: ['Networking', 'Entrepreneurship'], category: 'Networking', location: 'King’s Cross, London', date: 'Thu 20 Nov', day: 3, time: '08:00', source: 'External event platform', scope: 'london', description: 'Informal breakfast for early-stage founders and operators.', hue: 300 },
  { id: 'e7', title: 'Fintech Careers Panel', tags: ['Finance', 'Technology', 'Networking'], category: 'Panel', location: 'City of London', date: 'Wed 19 Nov', day: 2, time: '18:30', source: 'Professional network event', scope: 'london', description: 'Practitioners on breaking into fintech product and strategy roles.', hue: 210 },
  { id: 'e8', title: 'Brand Strategy Masterclass', tags: ['Marketing', 'Design'], category: 'Masterclass', location: 'Business School, Room 140', date: 'Mon 17 Nov', day: 0, time: '17:00', source: 'Marketing society', scope: 'university', description: 'How challenger brands position against incumbents.', hue: 340 },
  { id: 'e9', title: 'Postgrad Social: Autumn Mixer', tags: ['Social', 'Networking'], category: 'Social', location: 'Student Union Bar', date: 'Fri 21 Nov', day: 4, time: '19:30', source: 'Student society group chat', scope: 'university', description: 'Meet postgraduates across programmes.', hue: 45 },
  { id: 'e10', title: 'Design Thinking Sprint', tags: ['Design', 'Entrepreneurship'], category: 'Workshop', location: 'Design studio, Level 2', date: 'Sat 22 Nov', day: 5, time: '10:00', source: 'University events calendar', scope: 'university', description: 'A one-day sprint from problem framing to prototype.', hue: 170 },
  { id: 'e11', title: 'Climate-Tech Hackathon', tags: ['Technology', 'AI', 'Startups'], category: 'Hackathon', location: 'South Kensington, London', date: 'Sat 22 Nov', day: 5, time: '09:00', source: 'External event platform', scope: 'london', description: '24-hour build sprint on climate data challenges.', deadline: 'Applications close Thu 20 Nov', hue: 150 },
  { id: 'e12', title: 'Strategy Consulting Coffee Chats', tags: ['Consulting', 'Networking'], category: 'Networking', location: 'Careers Centre', date: 'Mon 17 Nov', day: 0, time: '12:30', source: 'Careers portal', scope: 'university', description: 'Small-group chats with alumni in strategy roles.', hue: 240 },
  { id: 'e13', title: 'Growth Marketing Meetup', tags: ['Marketing', 'Startups'], category: 'Meetup', location: 'Soho, London', date: 'Thu 20 Nov', day: 3, time: '18:30', source: 'External event platform', scope: 'london', description: 'Operators share experiments that moved acquisition numbers.', hue: 320 },
  { id: 'e14', title: 'Investor Office Hours', tags: ['Entrepreneurship', 'Finance', 'Startups'], category: 'Office hours', location: 'Innovation Hub', date: 'Wed 19 Nov', day: 2, time: '15:00', source: 'Entrepreneurship society', scope: 'university', description: '20-minute slots with investors-in-residence.', deadline: 'Book by Tue 18 Nov', hue: 265 },
]

/** Labels used by opening / closing particle fields. */
export const opportunityLabels = [
  'Networking dinner',
  'Startup competition',
  'Consulting workshop',
  'Society event',
  'Career fair',
  'Founder meetup',
  'Guest lecture',
  'Hackathon',
  'Industry conference',
  'Alumni panel',
  'Case competition',
  'Design sprint',
  'Investor office hours',
  'Fintech panel',
  'Coffee chats',
  'Pitch night',
]

/** The event Sam misses in Chapter 01 and finds in Chapter 15. */
export const heroEvent = demoEvents.find((e) => e.id === 'e3')!
