/**
 * Supplied source materials (master prompt §27). Cite by id (S1–S7). Do not add
 * academic citations that are not in this list.
 */
export const references = [
  { id: 'S1', short: 'NVC Week 2', title: 'Imperial College Business School, New Venture Creation, Week 2 — The Evaluation of New Venture Ideas', author: 'David Lefevre', year: 2026 },
  { id: 'S2', short: 'NVC Week 3', title: 'Imperial College Business School, New Venture Creation, Week 3 — Discovery and Business Model Design', author: 'David Lefevre', year: 2026 },
  { id: 'S3', short: 'Team 2S report', title: 'Orbit Team 2S revised group report', author: 'Orbit Team 2S', year: 2026 },
  { id: 'S4', short: 'Definitive report', title: 'Orbit definitive report and evidence appendices', author: 'Orbit Team 2S', year: 2026 },
  { id: 'S5', short: 'Financial model V3', title: 'Orbit financial model V3', author: 'Orbit Team 2S', year: 2026 },
  { id: 'S6', short: 'Coaching session', title: 'Orbit coaching session feedback', author: 'NVC coaching session', year: 2026 },
  { id: 'S7', short: 'HESA 2024/25', title: 'HESA 2024/25 higher-education enrolment data (as used in the team’s market-sizing model)', author: 'HESA', year: 2025 },
] as const

export type RefId = (typeof references)[number]['id']
export const ref = (id: RefId) => references.find((r) => r.id === id)!
