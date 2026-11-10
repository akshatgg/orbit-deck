/**
 * Global pitch configuration. Edit freely — nothing else needs to change.
 */
export const pitchConfig = {
  startup: 'Orbit',
  tagline: 'Discover your next opportunity.',
  valueProposition: 'Every opportunity that matters, in one place — personalised to you.',
  course: 'New Venture Creation · MSc Innovation, Entrepreneurship & Management',
  school: 'Imperial College Business School, London',

  /** Target pitch length in minutes (used by presenter timing). */
  targetDurationMin: 11,

  /** Live working prototype. Set to null to hide the "Launch real prototype" button. */
  prototypeUrl: 'https://orbit.akshatgg.in/' as string | null,

  /**
   * Optional 30-second product video (mp4/webm URL or a file placed in /public).
   * Leave null to show the interactive demonstration instead. Never point this
   * at a mock-up passed off as a real recording.
   */
  productVideoUrl: null as string | null,

  /** Optional ambient sound — muted by default; set a file in /public to enable the toggle. */
  ambientAudioUrl: null as string | null,
} as const
