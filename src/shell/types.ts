export type Mode = 'present' | 'explore'

/**
 * Contract every chapter implements.
 * - present mode: `step` runs 0 … meta.steps-1, driven by the presenter (→ / Space).
 *   Chapters must render something meaningful at every step and must never
 *   block advancing (no forced waits).
 * - explore mode: `step` is the final step; chapters show their full state and
 *   may add detail panels that are hidden in present mode.
 * - `setStep` lets an in-chapter button (e.g. "Find opportunities") advance
 *   the same step the keyboard would.
 */
export interface ChapterProps {
  mode: Mode
  step: number
  setStep: (n: number) => void
}
