/** Chapter 01 — the team's own starting observation. This is NOT research evidence. */
export const originNarrative = [
  'As Imperial students, we encountered academic, professional and social opportunities distributed across numerous disconnected communication channels.',
  'Discovering relevant events required navigating emails, careers platforms, society channels and external event platforms.',
  'The observation created an entrepreneurial hypothesis: if relevant events could be discovered through one personalised interface, students might find more opportunities early enough to act.',
]

export const originNodes = [
  {
    id: 'observation',
    n: '1',
    title: 'Observation',
    text: 'Events are distributed across multiple channels.',
    chips: ['Email', 'Careers platforms', 'Society channels', 'External event platforms'],
    tag: 'Team experience',
  },
  {
    id: 'problem',
    n: '2',
    title: 'Problem hypothesis',
    text: 'Students may be missing relevant events because discovery is fragmented.',
    chips: [],
    tag: 'Untested',
  },
  {
    id: 'opportunity',
    n: '3',
    title: 'Opportunity hypothesis',
    text: 'A unified discovery layer might reduce that friction.',
    chips: [],
    tag: 'Untested',
  },
] as const

export const drucker = {
  category: 'Incongruity',
  detail: 'The mismatch between the opportunities universities provide and students’ ability to discover them efficiently.',
  driver: 'Demand-pull rather than technology-push.',
}

export const originCaveat = 'Our personal frustration was the starting point. It was not yet proof of a widespread market opportunity.'

export const originLearning = {
  believed: 'The problem was relevant to other students too.',
  investigated: 'Only our own experience as six Imperial students.',
  learned: 'We needed evidence beyond our own experience.',
  changed: 'Next decision: screen the opportunity before investing significant resources.',
}

/** Present-mode (short) variants — the full strings above stay in Explore. */
export const originLead = 'It began in our own inboxes.'
export const originShort = {
  observation: 'Events are scattered across channels.',
  problem: 'Students may miss events because discovery is fragmented.',
  opportunity: 'One discovery layer might help.',
} as const
export const caveatShort = 'A starting point — not proof of a market.'
export const originStrip = {
  believed: 'Our problem is shared',
  learned: 'We need evidence beyond ourselves',
  changed: 'Screen the opportunity first',
}

/** Present-mode bridge into screening (step 1 close). */
export const bridgeFrom = 'A hypothesis, not a market.'
export const bridgeTo = 'Screen it.'
export const ideaShort = 'One discovery layer'
