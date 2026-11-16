# Pass 3 — the 13-minute revision

The team now has **13 minutes** in total, for six presenters and an opening audience interaction. Target speaking time is 12 min 15 s (735 s, see `durationSec` in `src/data/chapters.ts`). The deck must be **shorter, more concise and quicker to click through**. It should stay process-led (what we did → what we learned → what we decided next), not an investor pitch.

## What changed in the foundation (already done, do not redo)
- **`src/data/chapters.ts`** holds the new order, step counts, durations, scripts and cues. **The step counts are fixed: design to them.** There are 35 clicks in total, down from 83. The `cues` say what each step shows; the `script` says what the presenter says (do not edit chapters.ts).
- **Removed:** the coaching chapter (all files deleted) and the stand-alone method chapter. `Ch03LearningBeforeBuilding.tsx` is no longer registered: its Explore depth must be absorbed into the Findings chapter, and then the file can be deleted.
- **Renamed:** `Ch05AssumptionsChanged.tsx` → `Ch04ProductDecisions.tsx` (slug `product-decisions`); `Ch04WhatStudentsToldUs.tsx` → `Ch03WhatStudentsToldUs.tsx`.
- **New stubs:** `Ch12Walkthroughs.tsx` (slug `walkthroughs`) and `Ch13Gates.tsx` (slug `gates`).
- **New data:** `src/data/productDecisions.ts`, `src/data/walkthroughs.ts`, `indicators` in `src/data/financials.ts`, and the **8 assumptions A1–A8** in `src/data/assumptions.ts` (from the team report).
- **Terminology:** `statusMeta.inconclusive.label` is now **"Partial"**, the report's word. In the **Business Model** chapters, say **"untested guess"** where we used to say "assumption" (e.g. "Riskiest untested guess", "a set of untested guesses"). The final A1–A8 slide keeps the word "assumptions", because that is the report's title.

## Rules (on top of BRIEF.md accuracy rules and DIET.md present-mode text diet; read both)
- **Fewer clicks.** One step may reveal several elements automatically with a stagger. That is fine and encouraged; it just must not need extra clicks. Long animations must finish in ≤ ~1.5 s, so the presenter is never waiting. Remove any in-chapter interaction that the presenter must operate to get through the story. Calculators and simulators can stay, but only in **Explore** mode.
- **Consolidate.** Where two old steps said the same thing, show them as one view.
- **Visual over text:** one hero line per step, plus a visual.
- Keep everything you cut available in **Explore** mode or in `Expandable` drawers. Nothing academically important is deleted, except the coaching section (deleted on purpose).
- Each chapter must render a complete, meaningful state at every step, fit **1366×768 and 1920×1080 with no vertical overflow**, and work in Explore at **375 px** with no horizontal overflow.
- Present mode ends with at most a one-line `LearningStrip`, and only where it adds something. Don't repeat what the slide already says.
- Never invent data: quotes, results, X/N counts, partners, dates. If something you need is missing, render it as data-driven (empty array → honest state) and report it.

## Verify (you can see your work)
1. `npx vite build --outDir <scratch>/dist-<you> --emptyOutDir`, then once: `npx vite preview --outDir <scratch>/dist-<you> --port <your port> --strictPort &`. Rebuilds are picked up. Kill it at the end.
2. `PORT=<port> node tools/fitcheck.cjs <scratch>/shots-<you> <slug>/<step> ...` prints the overflow in px per step at 1366×768 (aim ≤ 8) and saves JPEGs. **Look at the screenshots.** Iterate until every step looks like a premium pitch slide.
3. `npx tsc -b` must be clean for your files.

`<scratch>` = `/private/tmp/claude-501/-Users-akshat-projects/3f207161-42b5-4507-a4e8-8c6b599f159f/scratchpad`

Only edit your assigned files, plus helpers under `src/components/<your area>/` and new data files. Do not edit `ui.tsx`, `index.css`, `shell/*`, `chapters.ts`, `assumptions.ts`, `financials.ts` or other agents' chapters (ask the lead in your report instead). Do not commit. Report: what each step shows now, what moved to Explore, anything that needs team confirmation, and any data you needed but did not have.
