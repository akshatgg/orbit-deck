# ORBIT: From Idea to Evidence — build brief for chapter authors

Project: /Users/akshat/projects/orbits/orbit-pitch — Vite + React 19 + TS + Tailwind v4 + framer-motion + recharts + lucide-react. **No new dependencies.**

A process-led, cinematic **academic venture evaluation** for the Imperial College Business School *New Venture Creation* module (professor + classmates). NOT an investor pitch. Central question: *"How did we move from believing in an idea to understanding whether it is actually worth pursuing?"* Final answer: **CONDITIONAL GO — pursue one paid, measurable university pilot before committing to wider expansion.** Tone: a live entrepreneurial investigation — uncertainty, imperfect evidence, constraints, narrowing decisions. Never imply every stage succeeded.

## Read first
- `src/index.css` — tokens. Classes: `bg-ink` (#080D1A), `bg-navy` (graphite #111827), `navy-2`, `violet` (#8B5CF6), `violet-soft`, `blue`/`cyan` (ice blue #38BDF8), `snow` (#F8FAFC), `silver` (muted slate), `dim`, `line`. Semantic colours — **use only with their meaning**: `ev-observed` (blue, observed evidence), `ev-reported`, `ev-modelled`, `ev-proposed` (violet, future experiments/decisions), `ev-unresolved`/`amber` (unresolved/inconclusive), `st-supported`/`green` (supported), `st-contradicted`/`red` (contradicted/material risk), `st-untested` (grey). Fonts: `font-sans` (Inter Tight), `font-serif` (Instrument Serif — italic for expressive accents, sparingly), `font-mono`. Helpers: `.t-display .t-h1 .t-h2 .t-lead .t-kicker .num .glass`.
- `src/components/ui.tsx` — Stage, ChapterHeader, Reveal (step-gated), SplitHeadline, **EvidenceTag** (observed/reported/modelled/proposed/unresolved), **StatusPill** (supported/inconclusive/untested/contradicted), **StageLabel**, **LearningCard** (believed → investigated → learned → changed), IllustrativeBadge, SourceNote, Card, Expandable, Button, CountUp, Logo, ease.
- `src/data/*.ts` — ALL shared content/figures: `chapters.ts` (slug, stage, headline, **steps**, script, cues), `evidence.ts`, `research.ts`, `financials.ts`, `market.ts`, `journey.ts`, `assumptions.ts`, `references.ts` (S1–S7), `team.ts`, `config.ts`, `events.ts` (old illustrative demo events). Import figures from data; never re-type a figure that exists there. Put chapter-specific new content in a NEW data file you own (e.g. `src/data/canvas.ts`).
- `src/shell/types.ts` — ChapterProps `{ mode, step, setStep }`.
- Existing reusable components: `src/components/OrbitField.tsx` (canvas particle field), `src/components/product/OrbitUI.tsx` + `Scenes.tsx` (phone UI from an earlier deck), `src/components/biz/kit.tsx`. Reuse/adapt via copies under your own prefix if helpful; do not edit them in place.

## Chapter contract
- Each chapter is the file already stubbed at `src/chapters/ChNN*.tsx` (default export). Keep the file name/export.
- Present mode: rendered inside a full-viewport scrollable `<main>`; wrap in `<Stage mode={mode}>`. Must fit 1920×1080 and 1366×768 **without scrolling** wherever possible; top 64px and bottom 56px are chrome. Projector-readable: body ≥ 16px, key numbers large. ONE central idea per chapter; big headline + concise content; deeper analysis in `Expandable` drawers or explore-only blocks.
- Show the stage with `<StageLabel stage={meta.stage} />` near the chapter header (use `ChapterHeader` with `kicker` and `title={meta.headline}`; get `meta` from `chapters.find(c => c.slug === '…')`).
- `step` runs 0…`meta.steps-1` (presenter → / Space). Gate reveals on `step`. The step count in `chapters.ts` is fixed — design to it (the `cues` array describes what each step should show). Every step must render a meaningful state. Never auto-advance; no forced waits. Long animations must be skippable / jump to their end state when `step` moves past them, and replay when stepping back.
- In-chapter interactive buttons may call `setStep(n)`. Always `e.stopPropagation()` on clicks (Button already does).
- Explore mode: `step` = last step. Show the full final state with no presenter gating, PLUS extra depth (Expandables, methodology, calculations, source notes) hidden in present mode. Explore sections flow normally (no `h-full`). Must be responsive down to 375px wide with no horizontal overflow.
- End every major chapter with a `<LearningCard>` (compact in present mode is fine) unless the brief for your chapter says otherwise.
- Sources: a subtle `SourceNote` citing S-ids from `references.ts` under data visuals. Main view stays clean.

## Motion & accessibility
- framer-motion; global `MotionConfig reducedMotion="user"`. With reduced motion everything must still be readable/complete (no content that only exists mid-animation). Avoid per-frame React state; canvas loops must stop under `prefers-reduced-motion` and when unmounted.
- Keyboard: interactive controls are real `<button>`s / inputs with visible focus. Don't capture ArrowLeft/ArrowRight/Space (presenter navigation) — except inside text/number inputs/range sliders where the shell already ignores keys from INPUT elements.
- Subtle transitions: morphing shapes, connecting nodes, progressive reveals. No random floating gradients, glass cards everywhere, spaceships, cartoons, sparkles, gimmicks, or marketing language.

## Mandatory accuracy rules (academic integrity — the most important section)
- Do not fabricate: quotes, testimonials, participants, commercial commitments, live user numbers, pilot results, partnerships, customers, integrations, rejected ideas, dated pivots, lecture activities, citations, X/N prototype outcomes.
- Use 42 as the survey denominator everywhere. Always show denominators ("35 of 42").
- Label consistently with EvidenceTag: OBSERVED (student research), REPORTED (stakeholder statements), MODELLED (financial/market forecasts), PROPOSED (future experiments, thresholds), UNRESOLVED (conflicting/incomplete).
- Distinguish: idea vs opportunity; screening vs validation; problem vs demand for this solution; user vs paying customer; assumption vs evidence; prototype vs product-market fit; viability on paper vs traction; clicks vs registration vs attendance; interest vs willingness to pay.
- Sample/demo data must be visibly labelled (IllustrativeBadge "Sample data" / "Illustrative reconstruction"). Do not use real third-party logos or imitate their exact UI; plain text names of platforms are fine where the research names them.
- Universities other than Imperial are never shown as customers, partners or pilot participants.

## Working in parallel
Several agents edit at the same time.
- ONLY edit the files you are assigned, plus NEW files under `src/components/<your-prefix>/` and new `src/data/<new-file>.ts`. Do NOT edit `src/components/ui.tsx`, `src/index.css`, `src/shell/*` (unless you are the shell agent), existing `src/data/*.ts`, or other agents' chapters. Need a helper? Make it local.
- Verify with `npx tsc -b` (fix errors in YOUR files; ignore others' in-progress errors) and `npx vite build`. No test files. Do not start long-running dev servers. Do not commit — the lead integrates.
- Report back: files written, what each step shows, anything you flagged as needing team confirmation, and any data you would have liked but did not have.
