/**
 * Presentation structure — Imperial NVC four-stage venture evaluation framework
 * (Week 2 lecture): Ideation & Screening → Discovery → Business Model Design → Validation.
 *
 * `steps`       = presenter clicks inside the chapter (0 … steps-1). Chapters must render a
 *                 meaningful state at every step.
 * `durationSec` = default speaking time. Sums to 735 s (12 min 15 s) for a 13-minute slot; the Rehearsal view rescales
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
    steps: 3,
    durationSec: 55,
    journey: [1],
    script:
      'Quick show of hands: who has found out about a talk, a careers event or a society night only after registration had closed? Keep it up if it happened this term. [Count the hands.] That moment is where Orbit started. Opportunities reach us through email, WhatsApp, careers portals and societies, and by the time we see them, the deadline has passed. So our question was never “can we build an app?” It was: is this problem real, and is Orbit worth pursuing?',
    cues: ['Audience: show of hands (tap + to count)', 'Notification flood → “Registration closed”', 'Reveal ORBIT'],
  },
  {
    slug: 'origin',
    num: '01',
    stage: 'ideation',
    title: 'From problem to idea',
    navLabel: 'Idea',
    headline: 'It started with a problem we experienced ourselves.',
    steps: 2,
    durationSec: 25,
    journey: [1, 2],
    script:
      'It began with our own inboxes. In Drucker’s terms it is an incongruity: universities provide plenty, yet students struggle to find it. That gave us an idea, one place to discover what is already on offer. But six frustrated students is a hypothesis, not a market.',
    cues: ['Observation → problem hypothesis', 'Idea: one discovery layer (Drucker: incongruity)'],
  },
  {
    slug: 'screening',
    num: '02',
    stage: 'ideation',
    title: 'Screening the opportunity',
    navLabel: 'Screening',
    headline: 'Was Orbit worth investigating?',
    steps: 2,
    durationSec: 40,
    journey: [3],
    script:
      'We screened the idea on the five Week 2 questions, equally weighted. Access and feasibility were strong: we are the users, and the product looked buildable. Payment scored two out of five, because nobody had yet shown they would pay. Overall 3.8: a go to investigate further, not a go to build a company. That is why we selected Orbit, and why discovery came next.',
    cues: ['Full matrix: five criteria', 'Total 3.8 → GO, investigate further; payment is the weak point'],
  },
  {
    slug: 'what-students-told-us',
    num: '03',
    stage: 'discovery',
    title: 'What students told us',
    navLabel: 'Findings',
    headline: 'The problem was real. But it was not exactly what we expected.',
    steps: 3,
    durationSec: 70,
    journey: [4, 5],
    script:
      'We ran thirteen interviews and a survey with forty-two responses, asking about the last event people actually missed, not whether they liked our idea. Thirty-five of forty-two had missed one in four weeks; thirty-one said there were too many places to look. Why they missed it mattered more: twenty-three were discovery problems, hearing too late, a deadline, a full event. Only five simply forgot. And students hear through friends and email, not event apps.',
    cues: ['Method in one line + 35/42 · 31/42 · 12/13', 'Why they missed it: 23 discovery vs 5 forgot', 'Where they hear + key insight'],
  },
  {
    slug: 'product-decisions',
    num: '04',
    stage: 'discovery',
    title: 'From insight to product decision',
    navLabel: 'Decisions',
    headline: 'Every product decision traces back to evidence.',
    steps: 2,
    durationSec: 55,
    journey: [],
    script:
      'Here is how those insights turned into decisions. Too many places to check became one feed. Hearing too late became relevance, so the right events surface early. Timetable clashes became schedule fit, while accepting we cannot remove clashes. And because students are wary of yet another app, Orbit has to cost less effort than today, sending people straight to the original registration page. Reminders, which we once thought were central, became secondary.',
    cues: ['Insight + evidence', 'Product decisions → three value propositions'],
  },
  {
    slug: 'jtbd',
    num: '05',
    stage: 'bmd',
    title: 'Jobs-to-be-Done',
    navLabel: 'Jobs-to-be-Done',
    headline: 'We stopped asking what app to build. We asked what job needed doing.',
    steps: 2,
    durationSec: 30,
    journey: [6],
    script:
      'Jobs-to-be-Done separated who uses Orbit from who might pay and who can block it. Students want to find things in time. The university wants its programmes seen. Organisers want the right audience. IT and procurement hold a veto. The user is not the payer, and that shaped the business model.',
    cues: ['Four jobs around Orbit', 'User ≠ payer ≠ gatekeeper'],
  },
  {
    slug: 'product',
    num: '06',
    stage: 'bmd',
    title: 'The Orbit product',
    navLabel: 'Product',
    headline: 'Three promises. One minimum viable product.',
    steps: 3,
    durationSec: 60,
    journey: [8],
    script:
      'The MVP does three things, one for each value proposition, shown here with sample events. First, browse in one feed: events from several sources in one place, each with its source. Second, match your interests: the feed is personalised, so relevant events surface first. Third, fit your schedule: filter by when you are actually free, then go straight to the organiser’s own registration page. Everything social stays a future hypothesis.',
    cues: ['1 · Browse in one feed', '2 · Match your interests', '3 · Fit your schedule'],
  },
  {
    slug: 'who-pays',
    num: '07',
    stage: 'bmd',
    title: 'Who pays and why?',
    navLabel: 'Who pays',
    headline: 'One product problem. Three possible revenue models.',
    steps: 2,
    durationSec: 30,
    journey: [9],
    script:
      'The same proposition could be paid for three ways. Students paying looked weakest, because the events are free elsewhere. Organiser commissions need paid-event volume and attribution we do not have. A university subscription keeps students free and links institutional value to recurring revenue. That is our working hypothesis, an untested guess we still have to prove.',
    cues: ['Three paths compared', 'University subscription = working hypothesis'],
  },
  {
    slug: 'lean-canvas',
    num: '08',
    stage: 'bmd',
    title: 'The living Lean Canvas',
    navLabel: 'Lean Canvas',
    headline: 'The business model is a set of untested guesses, not a finished blueprint.',
    steps: 2,
    durationSec: 35,
    journey: [7],
    script:
      'This is our Lean Canvas, coloured by evidence rather than confidence. Only the problem is supported. Most boxes are still untested guesses. And the riskiest one is the one the whole model rests on: that a university will pay for Orbit and renew.',
    cues: ['Canvas: initial guesses', 'Evidence state + riskiest untested guess'],
  },
  {
    slug: 'viability',
    num: '09',
    stage: 'bmd',
    title: 'Market opportunity and financial viability',
    navLabel: 'Viability',
    headline: 'Could this opportunity support a real business?',
    steps: 3,
    durationSec: 85,
    journey: [10],
    script:
      'We sized the market bottom-up from HESA enrolment data and our proposed prices. In the base case, EBITDA turns positive in 2029 at eighteen universities, and project cash is recovered in 2030. At a 9.27 percent discount rate that is an NPV of about 240 thousand pounds. The 121 percent investor return is illustrative only: it assumes an eight-times-EBITDA exit. And a twenty percent revenue miss in 2029 erases the profit, so the model tells us what must become true, not that it will.',
    cues: ['Market: TAM / SAM / SOM', 'Revenue & EBITDA + NPV · cash recovery · ROI', 'What must become true'],
  },
  {
    slug: 'market-engagement',
    num: '10',
    stage: 'validation',
    title: 'Taking Orbit to the market',
    navLabel: 'Engagement',
    headline: 'We took Orbit beyond our own team.',
    steps: 2,
    durationSec: 40,
    journey: [11],
    script:
      'Validation meant leaving our cohort. Students at other London universities described the same frustration, as individual accounts, not institutional demand. At Imperial, a Careers contact welcomed a demonstration and offered to raise Orbit with the executive director. That is real interest, and it showed us the path runs through ICT approval and a budget owner. But interest is not payment.',
    cues: ['Other London students + Imperial Careers', 'Evidence ladder: where we are'],
  },
  {
    slug: 'walkthroughs',
    num: '11',
    stage: 'validation',
    title: 'Product walkthroughs',
    navLabel: 'Walkthroughs',
    headline: 'We put the prototype in students’ hands.',
    steps: 2,
    durationSec: 40,
    journey: [12],
    script:
      'Interviews and the survey told us about the problem. Walkthroughs tested the product. We gave students one neutral task: find an event you would actually attend next week, and show us how you would register. We watched, without helping. What we learned fed straight back into the product, and it gives us partial support that students find value in Orbit, not proof that they will keep using it.',
    cues: ['What we tested (and how it differs from interviews, survey, institution)', 'What we learned → what we changed'],
  },
  {
    slug: 'experiment',
    num: '12',
    stage: 'validation',
    title: 'The Imperial pilot',
    navLabel: 'Pilot',
    headline: 'One paid, controlled 8–12 week pilot at Imperial.',
    steps: 1,
    durationSec: 45,
    journey: [13],
    script:
      'The next step is not more features. It is one journey. First we get to yes: a Careers champion, ICT approval, and a budget owner who signs off a paid pilot. Then we measure a baseline before Orbit exists. Then we run eight to twelve weeks with an agreed cohort, measure, compare against the baseline, and make one decision: subscribe, iterate and retest, or stop.',
    cues: ['End-to-end pilot journey: champion → decision'],
  },
  {
    slug: 'gates',
    num: '13',
    stage: 'validation',
    title: 'Six validation gates',
    navLabel: 'Gates',
    headline: 'We decide what success means before the pilot starts.',
    steps: 2,
    durationSec: 35,
    journey: [],
    script:
      'The pilot is judged against six gates: activation, weekly use, meaningful action, listing accuracy, verified attendance and a paid renewal. The numbers you see are illustrative. The real thresholds will be agreed with each university once we have its baseline. What is fixed is the framework: pass, and we go; mixed, we iterate once; fail on use, data or price, and we stop.',
    cues: ['Six gates (illustrative targets)', 'GO / ITERATE / STOP'],
  },
  {
    slug: 'scale',
    num: '14',
    stage: 'validation',
    title: 'From pilot to scale',
    navLabel: 'Scale',
    headline: 'Growth should be earned, not assumed.',
    steps: 1,
    durationSec: 20,
    journey: [],
    script:
      'If the pilot works, growth is still gated: repeatability, then sustainability, then network. Public events are a different business with different customers, so they sit outside the plan until they earn their own evidence.',
    cues: ['Gated roadmap + separate external-events branch'],
  },
  {
    slug: 'verdict',
    num: '15',
    stage: 'verdict',
    title: 'The verdict',
    navLabel: 'Verdict',
    headline: 'So, is Orbit worth pursuing?',
    steps: 3,
    durationSec: 70,
    journey: [14],
    script:
      'Here is where our eight key assumptions stand. We have evidence that discovery is fragmented, partial evidence that the problem crosses universities and that students find value in Orbit. Imperial engagement explored payment and data feeds, but those, along with repeat use, attendance and margin, need a pilot. So our verdict is a conditional go: run one paid, measurable pilot before any expansion. We started believing in an idea. We finish knowing how to test it.',
    cues: ['Eight key assumptions: evidence vs untested', 'CONDITIONAL GO', 'Return to the question'],
  },
]

export const chapterIndex = (slug: string) => chapters.findIndex((c) => c.slug === slug)
export const totalPlannedSec = chapters.reduce((s, c) => s + c.durationSec, 0)
