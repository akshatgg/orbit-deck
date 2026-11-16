/**
 * Chapter 11 — product walkthrough validation (assumption A5, "Students find value in Orbit":
 * PARTIAL). Distinct from interviews and the survey (problem evidence) and from the Imperial
 * engagement (buyer evidence): walkthroughs test the PRODUCT with students.
 *
 * `findings` must come from the team report only. Until they are pasted in, the chapter shows
 * the task, what was observed for and the status — never invented X/N outcomes.
 */
export const walkthroughTask = 'Find an event you would actually attend next week, and show us how you would register.'

export const walkthroughMeasures = ['Completed without help', 'Found a relevant event', 'Event fits their availability', 'Reached the original registration page', 'Points of friction']

/** How walkthroughs differ from the other evidence streams. */
export const evidenceStreams: { id: string; label: string; n?: string; tests: string; current?: boolean }[] = [
  { id: 'survey', label: 'Survey', n: '42', tests: 'How common is the problem?' },
  { id: 'interviews', label: 'Interviews', n: '13', tests: 'Why does it happen?' },
  { id: 'walkthroughs', label: 'Product walkthroughs', tests: 'Does Orbit work for the task?', current: true },
  { id: 'institution', label: 'Imperial Careers', tests: 'Will a buyer engage?' },
]

/** Report findings: { learned, changed }. FILL FROM THE REPORT — leave empty rather than invent. */
export const walkthroughFindings: { learned: string; changed: string }[] = []

export const walkthroughStatus = {
  assumption: 'A5 · Students find value in Orbit',
  status: 'Partial: prototype walkthroughs',
  caveat: 'Value on first use is not repeat use. Retention and attendance need the pilot (A6, A7).',
}
