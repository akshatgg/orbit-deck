import { discoveryRelatedMisses, interviewN, surveyN } from './research'

/**
 * Present-mode (pass 2) short phrasings for chapters 03 and 04.
 * Full wording lives in research.ts and is still shown in Explore mode.
 */

/** Short chip labels for the six interview questions (same order as researchQuestions). */
export const questionChips = ['Last missed event', 'How you heard', 'Platforms used', 'Registration open?', 'What stopped you', 'How you track events']

/** One-line "why it matters" per question (condensed from whyTheseQuestions). */
export const questionWhyTag = [
  'Recent behaviour beats hypothetical enthusiasm',
  'Missed events reveal the actual problem',
  'Workarounds are the real competitors',
  'Missed events reveal the actual problem',
  'Negatives show where the opportunity is weaker',
  'Workarounds are the real competitors',
]

/** The four underlying reasons, as 3-word chips (same order as whyTheseQuestions). */
export const reasonChips = ['Behaviour over opinion', 'Find the real problem', 'Workarounds compete', 'Seek the negatives']

export const hypothesisShort = 'Students miss relevant events because discovery is fragmented.'

export const findingLabels = {
  all: 'survey respondents. One dot each.',
  missed: 'missed an event in the last four weeks',
  toomany: 'say there are too many places to check',
  interview: 'interviewees missed an event or heard too late',
  causes: 'misses were discovery-related',
} as const

export const causesCaveat = `A discovery signal, not proof Orbit prevents all ${discoveryRelatedMisses}.`

export const insightShort = { lead: 'Not more events.', accent: 'The right ones, in time, with less effort.' }

export const learningStripCh04 = {
  believed: 'More events, or one app for all',
  learned: 'Late discovery, not forgetting',
  changed: 'Timely, relevant discovery',
}

export const learningStripCh03 = {
  believed: 'Ask students if they would use it',
  investigated: `${interviewN} interviews, ${surveyN} responses`,
  learned: 'Past behaviour beats enthusiasm',
  changed: 'Behaviour-led research, limits stated',
}

export const learningStripCh05 = {
  believed: 'An all-in-one events app',
  learned: 'Timely discovery matters most',
  changed: 'A low-friction discovery layer',
}
