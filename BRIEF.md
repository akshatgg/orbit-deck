# Orbit pitch — build brief for chapter authors

Project: /Users/akshat/projects/orbits/orbit-pitch (Vite + React 19 + TS + Tailwind v4 + framer-motion + recharts + lucide-react). No new dependencies.

An interactive venture-pitch website for ORBIT, a university event-discovery startup by six MSc students at Imperial College Business School. It replaces a PowerPoint for a live classroom pitch (16:9 projector) and doubles as a scrollable "Explore" site for judges.

## Read first
- src/index.css — tokens. Tailwind colour classes: ink (#070A12 bg), navy, navy-2, violet, violet-soft, blue, cyan, peach, amber (missed-opportunity moments only), lavender, snow (text), silver (secondary), dim (tertiary), line (borders), st-supported/st-partial/st-untested/st-contradicted. Fonts: font-sans (Inter Tight), font-serif (Instrument Serif — use italic for expressive accents), font-mono. Helpers: .t-display .t-h1 .t-h2 .t-lead .t-kicker .num (mono tabular numerals) .glass .glass-strong .text-gradient .text-gradient-warm.
- src/components/ui.tsx — Stage, ChapterHeader, Reveal (step-gated fade), SplitHeadline, Badge, IllustrativeBadge, ProjectionBadge, SourceNote, StatusPill, Card, Expandable, Button, CountUp, ease, Logo.
- src/components/OrbitField.tsx — canvas particle "opportunity universe" (props intensity, converge, labels, dim).
- src/shell/types.ts — ChapterProps contract { mode, step, setStep }.
- src/chapters/Ch00Opening.tsx — a finished exemplar chapter.
- src/data/*.ts — ALL content/figures. Import from here; never hard-code figures that exist in data. chapters.ts defines each chapter's `steps` count (presenter clicks) — your chapter must render a meaningful state at every step 0..steps-1.

## Chapter contract
- present mode: rendered inside a full-viewport, scrollable <main>. Use <Stage mode={mode}> (fills h-full, vertically centred). Must fit a 1920×1080 and 1366×768 viewport without scrolling where at all possible; top 64px and bottom 56px are taken by chrome. Text must be readable from the back of a classroom: body ≥ 16px, key numbers large.
- `step` is driven by the presenter (→/Space). Gate reveals on `step` (e.g. <Reveal show={step >= 1}>). Never block advancing; no timed auto-advance of important content. Animations must be skippable (any long sequence gets a "Skip animation" control and should jump to its end state if step moves past it).
- In-chapter interactive buttons may call setStep(n) to advance (like the keyboard would). Stop propagation on clicks.
- explore mode: `step` = last step. Show the full final state, plus extra depth (Expandable panels, methodology, assumptions, source notes) that you hide in present mode. Explore sections flow normally (no h-full).
- Interactive local state is fine (useState). Interactions must be genuinely functional, not decorative.
- Respect reduced motion (MotionConfig reducedMotion="user" is already global; avoid JS loops that ignore it).
- Keep performance projector-friendly: no heavy WebGL; avoid huge DOM counts or per-frame React state for many elements.

## Visual direction
Dark-first, premium, Apple-launch editorial. Large expressive headlines, generous whitespace, restrained glass, soft glows, luminous connecting lines, orbiting-node motif. Use the logo palette (violet → blue → cyan, with lavender and warm peach accents). Avoid: outer-space clichés, rockets, astronauts, excessive neon, generic SaaS gradients, childish visuals, slide-like bullet walls. Short powerful headlines; long explanations go into Expandables or explore-only blocks.

## Mandatory accuracy rules
- Do not invent survey respondents, quotations, testimonials, partnerships, revenue, customers, API integrations, pilot results, job titles, credentials, logos.
- 2027–2031 figures are workbook PROJECTIONS — label them (ProjectionBadge / SourceNote).
- Distinguish: student interest vs recurring usage; university interest vs willingness to pay; API availability vs approved access; clicks vs attendance. Never imply Orbit has improved attendance or engagement.
- Demo events, Sam the student, personas and scenario calculations must be visibly labelled Illustrative.
- Do not impersonate real services (no Gmail/WhatsApp/Eventbrite/Luma/LinkedIn names, logos or exact look). Use generic, clearly fictional "inbox", "group chat", "event platform", "professional network" styles.
- Missing evidence → show "Not yet validated" rather than making things up.
- Always show denominators (e.g. "35 of 42").
- Add SourceNote under data visualisations citing the report/workbook (see references in src/data/strategy.ts, ids R1–R6).

## Rules for working in parallel
Other agents are editing other chapter files at the same time.
- ONLY create/edit the files you are assigned, plus new files you create under src/components/<your-prefix>/ or new src/data/<new-file>.ts. Do NOT edit src/components/ui.tsx, src/index.css, src/shell/*, existing src/data/*.ts, or other agents' chapters. If you need a helper, make it local.
- Verify with `npx tsc -b` (fix errors in YOUR files only; ignore others' in-progress errors) and `npx vite build`. Do not add test files. Do not start long-running dev servers.
- When done, report: files written, how each step behaves, any content you flagged as needing team confirmation.
