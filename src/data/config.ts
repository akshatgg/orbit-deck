/**
 * Global configuration — edit freely; nothing else needs to change.
 */
export const pitchConfig = {
  startup: 'Orbit',
  tagline: 'Discover your next opportunity.',
  subtitle: 'A New Venture Creation journey from observation to evidence.',
  valueProposition: 'Every relevant opportunity, in one place, early enough to act.',
  course: 'New Venture Creation · MSc Innovation, Entrepreneurship & Management',
  school: 'Imperial College Business School',
  teamName: 'Team 2S',

  /** Default presentation length in minutes (editable live in the Rehearsal view). */
  targetDurationMin: 10,

  /** Existing real prototype. null hides every link to it. */
  prototypeUrl: 'https://orbit.akshatgg.in/' as string | null,

  /**
   * The team's 30-second Orbit video (mp4/webm URL, YouTube/Vimeo embed URL, or a file in /public).
   * null shows a placeholder and falls back to the interactive walkthrough.
   */
  productVideoUrl: null as string | null,

  /**
   * VERIFIED prototype walkthrough results (A5). Leave null until the team supplies real counts.
   * Never invent X/N outcomes.
   */
  verifiedPrototypeResults: null as null | {
    participants: number
    unaidedCompletion: number
    relevantEventFound: number
    availabilityMatch: number
    redirectReached: number
    notes?: string
  },
} as const
