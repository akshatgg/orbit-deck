/**
 * Primary research — figures exactly as stated in the team report.
 * Always render with their denominators.
 */
export const survey = {
  n: 42,
  label: 'Student survey',
  findings: [
    { id: 'missed', value: 35, of: 42, text: 'reported missing an event in the previous four weeks', tone: 'amber' },
    { id: 'too-many', value: 31, of: 42, text: 'agreed there are too many places to check', tone: 'violet' },
    { id: 'too-late', value: 23, of: 42, text: 'attributed their latest missed event to discovering it too late, missing a deadline or the event being full', tone: 'blue' },
    { id: 'clash', value: 10, of: 42, text: 'cited timetable clashes — a cause discovery alone cannot solve', tone: 'silver' },
    { id: 'imperial', value: 27, of: 42, text: 'respondents were Imperial MSc students', tone: 'silver' },
  ],
} as const

export const interviews = {
  n: 13,
  label: 'Qualitative interviews',
  findings: [
    { id: 'late', value: 12, of: 13, text: 'described a missed or late-discovered event' },
    { id: 'friends', value: 12, of: 13, text: 'said friends influenced how they discover events' },
    { id: 'another-app', value: 4, of: 13, text: 'expressed concerns about using another app' },
  ],
} as const

/**
 * Discovery-channel themes. The report does not supply per-channel counts,
 * so this is shown as a qualitative theme list, not a ranked chart.
 */
export const interviewThemes = [
  {
    title: 'Late discovery is common',
    detail: '12 of 13 interviewees described a missed or late-discovered event.',
  },
  {
    title: 'Friends are a discovery channel',
    detail: 'Friends influenced event discovery in 12 of 13 interviews — a social layer matters.',
  },
  {
    title: 'Fragmentation',
    detail: '31 of 42 survey respondents agreed there are too many places to check.',
  },
  {
    title: 'App fatigue is real',
    detail: 'Four interviewees were concerned about adopting yet another app — Orbit must earn its place.',
  },
]

export const methodologyLabel = 'Exploratory convenience sample; not representative of all UK students.'

export const limitations = [
  { title: 'Small sample size', detail: '42 survey responses and 13 interviews support exploration, not statistical generalisation.' },
  { title: 'Imperial-heavy recruitment', detail: '27 of 42 respondents were Imperial MSc students; results may not transfer to other institutions.' },
  { title: 'Potential survey-introduction bias', detail: 'Introducing the survey around event discovery may have primed respondents to recall missed events.' },
  { title: 'Problem ≠ willingness to pay', detail: 'Problem frequency among students says nothing about whether universities will pay to solve it.' },
  { title: 'Not everything is a discovery problem', detail: 'Timetable clashes (10 of 42) cannot be solved by better discovery alone.' },
]

export const discoverySources = [
  'University emails',
  'Careers portals',
  'Student societies',
  'Event platforms',
  'Group chats',
  'Organiser websites',
]

export const discoveryPains = [
  'Missed deadlines',
  'Repeated searching',
  'Information overload',
  'Irrelevant events',
  'Uncertain coverage',
]
