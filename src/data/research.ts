/**
 * Primary research (master prompt §10–11). OBSERVED evidence.
 * Denominator is 42 analysed survey responses throughout. Some source screenshots show 44;
 * that reconciliation is acknowledged in limitations — never substitute 44-response figures.
 */
export const surveyN = 42
export const interviewN = 13

export const researchMeta = {
  interviews: 13,
  surveyResponses: 42,
  interviewDates: '26–29 October 2026',
  recruitment: 'Participants recruited through team networks.',
  imperialMsc: 27, // of 42 survey respondents were Imperial Business School MSc students
}

export const headlineFindings = [
  { id: 'missed', value: 35, of: 42, text: 'reported missing at least one event in the previous four weeks', source: 'survey' },
  { id: 'too-many', value: 31, of: 42, text: 'agreed that there were too many places to check', source: 'survey' },
  { id: 'interview-missed', value: 12, of: 13, text: 'interviewees described missing an event or finding out about it too late', source: 'interviews' },
] as const

/**
 * Cause of the MOST RECENT missed event. These listed categories account for 38 of 42
 * responses — do not invent categories for the remaining 4.
 */
export const missCauses = [
  { id: 'late', label: 'Heard too late', value: 13, discovery: true },
  { id: 'clash', label: 'Timetable clash', value: 10, discovery: false },
  { id: 'deadline', label: 'Missed registration deadline', value: 5, discovery: true },
  { id: 'full', label: 'Event full', value: 5, discovery: true },
  { id: 'forgot', label: 'Forgot', value: 5, discovery: false },
] as const
export const missCausesListedTotal = 38
export const discoveryRelatedMisses = 23 // late + deadline + full

/** Multiple-response question — counts do NOT sum to 42 or 100%. */
export const discoveryChannels = [
  { label: 'Friends or course-mates', value: 26 },
  { label: 'University emails', value: 24 },
  { label: 'WhatsApp or social media', value: 23 },
  { label: 'Careers platforms', value: 17 },
  { label: 'Students’ Union or societies', value: 16 },
  { label: 'Eventbrite', value: 7 },
  { label: 'Luma', value: 6 },
  { label: 'Fatsoma', value: 2 },
  { label: 'Handshake', value: 2 },
] as const

/** Genuine anonymised interview quotes from the report. Do not add others unless supplied. */
export const quotes = [
  { text: 'WhatsApp is handy, but the chat is chaos half the time.', who: 'Interviewee (anonymised)' },
  { text: 'It would need to be quicker than what I do now, otherwise there’s not much point.', who: 'Interviewee (anonymised)' },
] as const

export const otherInterviewSignals = [
  { value: 4, of: 13, text: 'interviewees were wary of adopting another system' },
] as const

export const researchQuestions = [
  'Tell us about the last event you wanted to attend but missed.',
  'How did you first hear about it?',
  'What platforms did you use?',
  'Was registration still open?',
  'What prevented you from attending?',
  'How do you currently keep track of events?',
]

export const whyTheseQuestions = [
  'Recent behaviour is stronger evidence than hypothetical enthusiasm.',
  'Missed events help identify the actual problem.',
  'Existing workarounds reveal competitors for student attention.',
  'Negative responses reveal where the opportunity may be weaker.',
]

export const methodSequence = ['Hypothesis', 'Interviews', 'Survey', 'Compare findings', 'Revise assumptions']

export const limitations = [
  'Small convenience sample.',
  'Imperial-heavy sample (27 of 42 respondents were Imperial Business School MSc students).',
  'Self-reported behaviour.',
  'No representative population estimate.',
  'The survey introduction named Orbit.',
  'One interview involved leading prompts.',
  'Some source screenshots display 44 responses, while the analysed dataset reports 42; reconciliation remains required. 42 is used as the denominator throughout.',
]

export const keyInsight =
  'Students are not simply searching for more events. They need relevant opportunities to reach them in time, with less effort than their current habits.'
