/**
 * Narrative structure: 16 screens (Chapter 00 pre-show + 15 chapters), five acts.
 * `steps` = number of presenter clicks inside the chapter before advancing.
 * `durationSec` = suggested speaking time (sums to ~11 minutes).
 */
export type Act = 'Prologue' | 'I' | 'II' | 'III' | 'IV' | 'V'

export interface ChapterMeta {
  slug: string
  num: string
  act: Act
  actTitle: string
  title: string
  navLabel: string
  question: string
  steps: number
  durationSec: number
  notes: string[]
}

export const acts: Record<Act, string> = {
  Prologue: 'Pre-show',
  I: 'The Invisible Problem',
  II: 'The Evidence',
  III: 'The Solution',
  IV: 'The Business',
  V: 'The Decision',
}

export const chapters: ChapterMeta[] = [
  {
    slug: 'opening',
    num: '00',
    act: 'Prologue',
    actTitle: acts.Prologue,
    title: 'The Opportunity Universe',
    navLabel: 'Opening',
    question: 'Why does this problem matter?',
    steps: 2,
    durationSec: 25,
    notes: [
      'Let the field fill for a few seconds in silence.',
      '“Your university is full of opportunities.” — click — “But how many do you actually discover?”',
      'Press BEGIN (or →) to enter Act I.',
    ],
  },
  {
    slug: 'student',
    num: '01',
    act: 'I',
    actTitle: acts.I,
    title: 'Meet Sam',
    navLabel: 'Meet Sam',
    question: 'What does discovery feel like today?',
    steps: 3,
    durationSec: 45,
    notes: [
      'Sam is fictional and illustrative — say so.',
      'Click “Find opportunities”: windows open one after another.',
      'Pause on REGISTRATION CLOSED. Let the freeze land: “The opportunity existed. The discovery didn’t happen in time.”',
    ],
  },
  {
    slug: 'reframe',
    num: '02',
    act: 'I',
    actTitle: acts.I,
    title: 'Reframe the Problem',
    navLabel: 'Reframe',
    question: 'What exactly is broken?',
    steps: 3,
    durationSec: 35,
    notes: [
      'Not a lack of opportunities — fragmented discovery.',
      'Be explicit: Orbit addresses discovery friction, not every reason people skip events (e.g. timetable clashes).',
    ],
  },
  {
    slug: 'research',
    num: '03',
    act: 'II',
    actTitle: acts.II,
    title: 'We Investigated',
    navLabel: 'Research',
    question: 'Is there evidence?',
    steps: 4,
    durationSec: 65,
    notes: [
      '42 survey responses, 13 interviews. Always say the denominator.',
      '35 of 42 missed an event in the previous four weeks.',
      'Name the counter-evidence: four interviewees were wary of another app.',
      'Close: “The problem has evidence. The business still needs validation.”',
    ],
  },
  {
    slug: 'reveal',
    num: '04',
    act: 'III',
    actTitle: acts.III,
    title: 'Introducing Orbit',
    navLabel: 'Orbit Reveal',
    question: 'Why might Orbit solve it?',
    steps: 2,
    durationSec: 35,
    notes: [
      'Let the scattered cards converge. Then: “Introducing Orbit.”',
      'Orbit simplifies discovery; it links out to original registration pages rather than replacing them.',
    ],
  },
  {
    slug: 'product',
    num: '05',
    act: 'III',
    actTitle: acts.III,
    title: 'Experience the Product',
    navLabel: 'Product Demo',
    question: 'Will students actually use it?',
    steps: 3,
    durationSec: 60,
    notes: [
      'All events here are illustrative sample data, not live feeds.',
      'Pick interests → toggle University / London → “Show me networking and entrepreneurship”.',
      'Save an event, then show “View original event”.',
      'Mention the real prototype exists separately (button top-right).',
    ],
  },
  {
    slug: 'value-prop',
    num: '06',
    act: 'IV',
    actTitle: acts.IV,
    title: 'Two Customers',
    navLabel: 'Value Proposition',
    question: 'Who benefits — and who pays?',
    steps: 3,
    durationSec: 40,
    notes: [
      'Students use it free; universities are the hypothesised payer.',
      'Student interest does not prove institutional willingness to pay.',
      'IT / data owners shape feasibility.',
    ],
  },
  {
    slug: 'business-model',
    num: '07',
    act: 'IV',
    actTitle: acts.IV,
    title: 'Who Pays for Discovery?',
    navLabel: 'Business Model',
    question: 'Who would pay?',
    steps: 2,
    durationSec: 45,
    notes: [
      'Three options compared openly. We chose university subscriptions as the model to TEST.',
      '“We chose a model to test — not a revenue stream to assume.”',
    ],
  },
  {
    slug: 'market',
    num: '08',
    act: 'IV',
    actTitle: acts.IV,
    title: 'The Market Opportunity',
    navLabel: 'Market',
    question: 'How large is the opportunity?',
    steps: 3,
    durationSec: 50,
    notes: [
      'All three figures are model-derived estimates, not demand.',
      'The 5,000-student cutoff and serviceability % are segmentation assumptions.',
    ],
  },
  {
    slug: 'gtm',
    num: '09',
    act: 'IV',
    actTitle: acts.IV,
    title: 'Go-to-Market Engine',
    navLabel: 'Go-to-Market',
    question: 'What must happen to reach the forecast?',
    steps: 2,
    durationSec: 40,
    notes: [
      'Funnel totals 2027–29 are planning estimates, not history.',
      'Imperial access helps discovery — it is not a signed agreement.',
    ],
  },
  {
    slug: 'financials',
    num: '10',
    act: 'IV',
    actTitle: acts.IV,
    title: 'The Five-Year Financial Story',
    navLabel: 'Financials',
    question: 'Can Orbit become a sustainable business?',
    steps: 4,
    durationSec: 80,
    notes: [
      'All 2027–2031 numbers are workbook projections.',
      'EBITDA crosses zero in 2029 — a modelled milestone.',
      '£230k ARR target = ~£204k operating budget + coverage allowance. Not the accounting break-even.',
      'Liquidity: 2028 year-end cash ≈ £3,919. Profitability on paper ≠ no cash risk.',
    ],
  },
  {
    slug: 'risks',
    num: '11',
    act: 'V',
    actTitle: acts.V,
    title: 'The Biggest Risks',
    navLabel: 'Risks',
    question: 'What could go wrong?',
    steps: 2,
    durationSec: 45,
    notes: [
      'Four risks, honestly rated. Nothing is “validated” because we find it reasonable.',
      'Open willingness-to-pay as the example.',
    ],
  },
  {
    slug: 'pilot',
    num: '12',
    act: 'V',
    actTitle: acts.V,
    title: 'The Imperial Pilot',
    navLabel: 'Pilot',
    question: 'How will we test the biggest assumptions?',
    steps: 3,
    durationSec: 50,
    notes: [
      'Proposed framework — not approved or completed.',
      'Thresholds are provisional, to be agreed with stakeholders.',
      'Click GO / ITERATE / STOP to show disciplined decision-making.',
    ],
  },
  {
    slug: 'vision',
    num: '13',
    act: 'V',
    actTitle: acts.V,
    title: 'The Long-Term Vision',
    navLabel: 'Vision',
    question: 'What does success unlock?',
    steps: 2,
    durationSec: 35,
    notes: [
      'Universities first; external events only where the footprint exists.',
      'Organiser-funded model is a separate hypothesis, not in the five-year forecast.',
    ],
  },
  {
    slug: 'team',
    num: '14',
    act: 'V',
    actTitle: acts.V,
    title: 'The Team',
    navLabel: 'Team',
    question: 'Why us?',
    steps: 1,
    durationSec: 30,
    notes: [
      'Six students who live the problem.',
      'Proposed operating model: one technical + one business founder. Not final ownership.',
    ],
  },
  {
    slug: 'closing',
    num: '15',
    act: 'V',
    actTitle: acts.V,
    title: 'The Final Moment',
    navLabel: 'Closing',
    question: 'Why Orbit deserves the next experiment.',
    steps: 4,
    durationSec: 35,
    notes: [
      'Sam returns — this time the event is found before its deadline.',
      '“Opportunities change lives. But only when people discover them.”',
      '“The problem is worth solving. Our next job is proving the business.” — Thank you.',
    ],
  },
]

export const chapterIndex = (slug: string) => chapters.findIndex((c) => c.slug === slug)
