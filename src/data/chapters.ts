/**
 * Presentation structure — Imperial NVC four-stage venture evaluation framework
 * (Week 2 lecture): Ideation & Screening → Discovery → Business Model Design → Validation.
 *
 * `steps`       = presenter clicks inside the chapter (0 … steps-1). Chapters must render a
 *                 meaningful state at every step.
 * `durationSec` = default speaking time. Sums to 600 s (10 min); the Rehearsal view rescales
 *                 these to whatever total the module allocates.
 * `script`      = hidden presenter script (40–90 words), narrative transitions — not a
 *                 repeat of on-screen text.
 * `cues`        = short click cues for the presenter panel.
 */
export type StageId = 'ideation' | 'discovery' | 'bmd' | 'validation' | 'verdict'

export const stages: Record<StageId, { n: string; label: string; weeks: string; color: string }> = {
  ideation: { n: '1', label: 'Ideation & Screening', weeks: 'Weeks 1–2', color: '#38bdf8' },
  discovery: { n: '2', label: 'Discovery', weeks: 'Week 3', color: '#60a5fa' },
  bmd: { n: '3', label: 'Business Model Design', weeks: 'Weeks 3 & 5', color: '#a78bfa' },
  validation: { n: '4', label: 'Validation', weeks: 'Weeks 6–8', color: '#c084fc' },
  verdict: { n: '✓', label: 'Final Evaluation', weeks: '', color: '#f8fafc' },
}

/** The four framework stages shown in navigation (Final Evaluation sits after Validation). */
export const frameworkStages: StageId[] = ['ideation', 'discovery', 'bmd', 'validation']

export interface ChapterMeta {
  slug: string
  num: string
  stage: StageId
  title: string
  navLabel: string
  headline: string
  steps: number
  durationSec: number
  /** Journey-map node ids (see journey.ts) that become visible once this chapter is reached. */
  journey: number[]
  script: string
  cues: string[]
}

export const chapters: ChapterMeta[] = [
  {
    slug: 'question',
    num: '00',
    stage: 'ideation',
    title: 'The question',
    navLabel: 'The question',
    headline: 'The best opportunities are not always the ones we find.',
    steps: 5,
    durationSec: 25,
    journey: [1],
    script:
      'Before we show you anything we built, we want to show you a moment most of us in this room will recognise. Nothing here is a recording of a participant — it is a reconstruction of a pattern we kept hearing. Watch how quickly the useful becomes the missed. That moment is where our question started, and the rest of this presentation is how we tried to answer it honestly.',
    cues: ['Begin the Journey', 'First notification', 'Notifications flood in', 'Registration closed — freeze, pose the question', 'Reveal ORBIT'],
  },
  {
    slug: 'origin',
    num: '01',
    stage: 'ideation',
    title: 'Where Orbit began',
    navLabel: 'Origin',
    headline: 'It started with a problem we experienced ourselves.',
    steps: 5,
    durationSec: 30,
    journey: [1, 2],
    script:
      'This began with our own inboxes, not a market report. In Drucker’s terms it looked like an incongruity — universities provide plenty, yet students struggle to find it. That makes it demand-pull, not a technology looking for a use. But we were careful: our frustration was a starting point, a sample of six. Before investing anything, we had to ask whether it was worth investigating at all.',
    cues: ['Headline', 'Observation', 'Problem hypothesis', 'Opportunity hypothesis + Drucker', 'Learning card'],
  },
  {
    slug: 'screening',
    num: '02',
    stage: 'ideation',
    title: 'Screening the opportunity',
    navLabel: 'Screening',
    headline: 'Was Orbit worth investigating?',
    steps: 7,
    durationSec: 35,
    journey: [3],
    script:
      'We used the five screening questions from Week 2, each weighted equally. Our strengths were access and feasibility: we are the students, and a discovery interface looked buildable. The weak point stood out immediately — payment scored two out of five, because nobody had shown us they would pay. So the 3.8 is a screening judgement. It told us to investigate further, not to build a company.',
    cues: ['Empty matrix', 'Founder advantage 4/5', 'Customer payment 2/5', 'Market size 4/5', 'Accessibility 5/5', 'Feasibility 4/5', 'Total 3.8 → GO — investigate further'],
  },
  {
    slug: 'learning-before-building',
    num: '03',
    stage: 'discovery',
    title: 'Learning before building',
    navLabel: 'Method',
    headline: 'We needed to understand behaviour, not collect compliments.',
    steps: 4,
    durationSec: 40,
    journey: [4],
    script:
      'Week 3 warned us that people are polite about ideas. So we asked about the last event someone missed, not whether they would like an app. Thirteen interviews gave us stories; forty-two survey responses gave us patterns. We were deliberate about weaknesses too — a convenience sample, mostly Imperial, and one interview where our prompts were leading. Here is what that evidence actually said.',
    cues: ['Research wall', 'Questions we asked', 'Why past behaviour', 'Method sequence + limitations'],
  },
  {
    slug: 'what-students-told-us',
    num: '04',
    stage: 'discovery',
    title: 'What students actually told us',
    navLabel: 'Findings',
    headline: 'The problem was real. But it was not exactly what we expected.',
    steps: 7,
    durationSec: 60,
    journey: [5],
    script:
      'Each dot is one survey respondent. Most had missed something recently, and most felt there were too many places to look. The causes were more interesting: hearing too late, deadlines and full events dominate — forgetting is minor. And look where students actually hear about things: friends and email, not event apps. That shifted our thinking about what Orbit needed to be.',
    cues: ['42 respondents', '35 of 42 missed an event', '31 of 42 too many places', '12 of 13 interviewees', 'Causes — 23 discovery-related', 'Discovery channels', 'Key insight'],
  },
  {
    slug: 'assumptions-changed',
    num: '05',
    stage: 'discovery',
    title: 'The assumptions we had to change',
    navLabel: 'What changed',
    headline: 'The most valuable evidence was the evidence that challenged us.',
    steps: 7,
    durationSec: 50,
    journey: [],
    script:
      'This is the chapter we are proudest of, because it is where we were wrong. Five beliefs went in; each came out narrower. Students did not want one more app. Reminders were not the core job. Some misses — clashes — are not ours to solve. Notice the feature cloud shrinking as each card resolves. What remains is smaller, and much more defensible.',
    cues: ['Broad feature concept', 'Card 1 — one more app', 'Card 2 — public aggregation', 'Card 3 — reminders', 'Card 4 — clashes', 'Card 5 — adoption', 'Core proposition remains'],
  },
  {
    slug: 'jtbd',
    num: '06',
    stage: 'bmd',
    title: 'Jobs-to-be-Done',
    navLabel: 'Jobs-to-be-Done',
    headline: 'We stopped asking what app to build. We asked what job needed doing.',
    steps: 6,
    durationSec: 35,
    journey: [6],
    script:
      'Jobs-to-be-Done forced us to separate who uses Orbit from who might pay for it and who can block it. The student hires Orbit to find things in time. The university wants its existing programmes seen. Organisers want qualified traffic. And IT and procurement hold a veto. Four different jobs — and four different decision rights — which shaped everything after.',
    cues: ['Orbit at the centre', 'Student', 'University', 'Event organiser', 'IT / data owner', 'User vs payer vs gatekeeper → value proposition'],
  },
  {
    slug: 'product',
    num: '07',
    stage: 'bmd',
    title: 'The Orbit product',
    navLabel: 'Product',
    headline: 'Here is the proposition that emerged from our learning.',
    steps: 4,
    durationSec: 50,
    journey: [8],
    script:
      'Let me show you what that learning produced — using sample events, not live listings. A student picks a university and interests, says when they are free, and gets a feed they can trust because every card shows its source and sends them to the original registration page. Orbit sits on top of existing systems; it does not replace them. Everything social is deliberately parked as a future hypothesis.',
    cues: ['Onboarding', 'Personalised feed (interactive)', 'Architecture — a discovery layer', 'MVP vs future hypotheses'],
  },
  {
    slug: 'who-pays',
    num: '08',
    stage: 'bmd',
    title: 'Who pays and why?',
    navLabel: 'Who pays',
    headline: 'One product problem. Three possible revenue models.',
    steps: 4,
    durationSec: 35,
    journey: [9],
    script:
      'The same student proposition could be paid for in three different ways. Students paying directly looked weakest — the events are usually free elsewhere. Organiser commissions need paid-event volume and clean attribution we do not have. A university subscription links institutional value to recurring revenue while keeping students free. That became our working hypothesis — not a proven answer.',
    cues: ['One proposition', 'Three paths', 'Comparison', 'Path A as working hypothesis'],
  },
  {
    slug: 'lean-canvas',
    num: '09',
    stage: 'bmd',
    title: 'The living Lean Canvas',
    navLabel: 'Lean Canvas',
    headline: 'The business model is a collection of assumptions, not a finished blueprint.',
    steps: 3,
    durationSec: 30,
    journey: [7],
    script:
      'Week 3 taught us that the canvas is not a form to complete once. Here is what we first wrote. Now watch what happens when each box is coloured by the evidence we actually have. Very little turns green. One box matters more than the rest, and it is the one our entire model depends on.',
    cues: ['Initial hypotheses', 'Current evidence state', 'Riskiest assumption'],
  },
  {
    slug: 'viability',
    num: '10',
    stage: 'bmd',
    title: 'Market opportunity and financial viability',
    navLabel: 'Viability',
    headline: 'Could this opportunity support a real business?',
    steps: 5,
    durationSec: 60,
    journey: [10],
    script:
      'We built the market bottom-up from HESA enrolment data and our proposed prices — every ring is arithmetic you can check. The model only turns EBITDA-positive in year three, at eighteen universities, and cash is tightest in 2028 at under four thousand pounds. A twenty percent revenue miss in 2029 erases the profit. So the model tells us what must become true, not that it will.',
    cues: ['TAM / SAM / SOM rings', 'Five-year model', 'Minimum success + cash', 'Sensitivity', 'Takeaway'],
  },
  {
    slug: 'market-engagement',
    num: '11',
    stage: 'validation',
    title: 'What happened when we approached the market',
    navLabel: 'Engagement',
    headline: 'We took Orbit beyond our own team.',
    steps: 4,
    durationSec: 30,
    journey: [11],
    script:
      'Validation meant leaving our own cohort. Students at other London universities described similar frustrations — individual accounts, not institutional demand. At Imperial, a Careers contact welcomed a demonstration and offered to raise it with their executive director. That is real, but it is interest. On the evidence ladder, we are honestly only at the third rung.',
    cues: ['Imperial', 'Other London student accounts', 'Imperial engagement journey', 'Evidence ladder'],
  },
  {
    slug: 'coaching',
    num: '12',
    stage: 'validation',
    title: 'The coaching session',
    navLabel: 'Coaching',
    headline: 'The strongest challenge to our idea was not whether people liked it.',
    steps: 7,
    durationSec: 30,
    journey: [12],
    script:
      'Our coaching session asked five uncomfortable questions. The sharpest was whether the university product and the public-events product were even the same business. They are not — different customers, different economics. We also had no definition of success and no reason to stop. Each challenge changed a decision, and together they narrowed us to a university-first model with explicit gates.',
    cues: ['Challenge room', 'Same business?', 'Pilot success?', 'When to stop?', 'Where did assumptions come from?', 'Path to consumer?', 'Earlier vs refined proposition'],
  },
  {
    slug: 'experiment',
    num: '13',
    stage: 'validation',
    title: 'The experiment that matters',
    navLabel: 'Pilot',
    headline: 'What evidence would make us pursue Orbit?',
    steps: 5,
    durationSec: 40,
    journey: [13],
    script:
      'So the next step is not more features — it is one paid, eight-to-twelve-week pilot with thresholds set before we start. For an illustrative thousand invited students, we need roughly eighty weekly users and twenty-four meaningful actions. But clicks are not attendance; the real test is host-verified attendance and a paid renewal. And we have written down, in advance, what would make us stop.',
    cues: ['Pilot sequence', 'Cohort calculator', 'Scorecard', 'GO / ITERATE / STOP simulator', 'Stronger evidence'],
  },
  {
    slug: 'scale',
    num: '14',
    stage: 'validation',
    title: 'From pilot to scale',
    navLabel: 'Scale',
    headline: 'Growth should be earned, not assumed.',
    steps: 5,
    durationSec: 20,
    journey: [],
    script:
      'If the pilot works, growth is still gated. Each year has to prove something before the next is unlocked — repeatability, then sustainability, then network. The public-events idea only appears after year five, and as a separate business with its own evidence to find. One can succeed while the other fails.',
    cues: ['Year 1', 'Year 2', 'Year 3', 'Years 4–5', 'After Year 5 — separate branch'],
  },
  {
    slug: 'verdict',
    num: '15',
    stage: 'verdict',
    title: 'The verdict',
    navLabel: 'Verdict',
    headline: 'So, is Orbit worth pursuing?',
    steps: 6,
    durationSec: 30,
    journey: [14],
    script:
      'So where does that leave us? We know more than we did, and we are clear about what we still do not know. Our verdict is a conditional go: pursue the next experiment, not the expansion plan. It needs a technical and a commercial owner — which is not the same as six of us founding a company. We started believing in an idea. We finish knowing how to test it.',
    cues: ['Headline', 'What we know', 'What we do not know', 'What we should do', 'CONDITIONAL GO + who', 'Return to the question'],
  },
]

export const chapterIndex = (slug: string) => chapters.findIndex((c) => c.slug === slug)
export const totalPlannedSec = chapters.reduce((s, c) => s + c.durationSec, 0)
