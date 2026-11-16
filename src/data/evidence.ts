/**
 * Evidence conventions (master prompt §27) and evidence-status vocabulary (§16).
 * Colours are semantic — never use them decoratively:
 *   blue = observed · amber = unresolved · green = supported · red = contradicted/risk · violet = proposed
 */

/** Where a claim comes from. */
export type EvidenceLabel = 'observed' | 'reported' | 'modelled' | 'proposed' | 'unresolved'

export const labelMeta: Record<EvidenceLabel, { label: string; color: string; meaning: string }> = {
  observed: { label: 'Observed', color: 'var(--color-ev-observed)', meaning: 'Reported student research findings (survey n = 42, interviews n = 13).' },
  reported: { label: 'Reported', color: 'var(--color-ev-reported)', meaning: 'Stakeholder statements not independently verified.' },
  modelled: { label: 'Modelled', color: 'var(--color-ev-modelled)', meaning: 'Financial and market assumptions or forecasts.' },
  proposed: { label: 'Proposed', color: 'var(--color-ev-proposed)', meaning: 'Future experiments and success thresholds.' },
  unresolved: { label: 'Unresolved', color: 'var(--color-ev-unresolved)', meaning: 'Conflicting or incomplete supporting evidence.' },
}

/** How strong the evidence for a hypothesis currently is. */
export type Status = 'supported' | 'inconclusive' | 'untested' | 'contradicted'

export const statusMeta: Record<Status, { label: string; color: string; meaning: string }> = {
  supported: { label: 'Supported', color: 'var(--color-st-supported)', meaning: 'Evidence points in this direction.' },
  inconclusive: { label: 'Partial', color: 'var(--color-st-inconclusive)', meaning: 'Some signals exist but the claim is not established.' },
  untested: { label: 'Untested', color: 'var(--color-st-untested)', meaning: 'Evidence is not yet sufficient: an untested guess.' },
  contradicted: { label: 'Contradicted', color: 'var(--color-st-contradicted)', meaning: 'Available evidence challenges the stated hypothesis.' },
}

/** The recurring storytelling device closing every chapter. */
export interface Learning {
  believed: string
  investigated: string
  learned: string
  changed: string
}
