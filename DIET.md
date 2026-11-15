# Pass 2 — "less text, more pitch" (Present mode)

Feedback from the team: **there is far too much text on screen.** Balance *pitch* and *process*: keep the process story (what we believed → learned → changed, evidence labels, honesty), but deliver it with pitch energy — one bold idea per step, big visuals, short punchy lines. The presenter speaks the detail (scripts in `src/data/chapters.ts`, do not edit).

## Rules for Present mode (`mode === 'present'`)
- Per step: **one hero statement (≤ ~12 words) + one visual**. Supporting copy at most 1–2 short lines (≤ ~20 words total). Kill paragraphs, bullet walls and repeated explanations.
- Cut on-screen word count by **at least half** per chapter. Count before/after and report it.
- Turn text lists into visuals: chips, icons (lucide-react), glyph rows, big numbers, small diagrams.
- Keep mandatory honesty cues but make them compact: `EvidenceTag`s, denominators ("35 of 42"), "Sample data", "Modelled — not achieved", "Proposed". A long caveat becomes a short tag or a one-line footnote (`SourceNote`).
- Replace the four-paragraph `LearningCard` in present mode with the new one-line **`LearningStrip`** (`believed`, `learned`, `changed`, optional `investigated` — each ≤ 8 words). Keep the full `LearningCard` in explore mode.
- **Nothing is deleted from the site**: every removed sentence, caveat, rationale or table must still appear in Explore mode (`mode === 'explore'`) or inside an `Expandable` drawer. Accuracy rules in BRIEF.md still apply in full.
- Do not change step counts or the meaning of each step (`cues` in chapters.ts). Must still fit 1366×768 without scrolling.

## Creative / pitch toolkit (already in `src/components/ui.tsx` + `src/index.css`)
- `ChapterHeader` headlines now flip in word-by-word in 3D and auto-accent the second sentence / last two words. Control the accent explicitly by wrapping words in `*asterisks*` in the string you pass (e.g. `title={'The problem was real. *But not what we expected.*'}`) — only in your component, keep `chapters.ts` untouched (strip asterisks never needed: SplitHeadline handles them).
- `SplitHeadline` (`autoAccent`, `*accent*` markers) for any big hero statement.
- `Accent` / `.accent` / `.accent-warm` — serif italic animated-gradient glowing phrase. Use once or twice per chapter for the payoff phrase.
- `GlowNumber` — big count-up luminous number for hero stats. `.glow-num` for static numbers.
- `TiltCard` (`glow` prop adds an animated conic ring) — for the ONE hero card per step. `.glow-ring` class, `.lift` hover lift for clickable cards.
- `Reveal` now rises out of depth (3D + blur) — use it for progressive reveals.
- Background: an evolving orbit-particle field + pointer spotlight now runs behind every chapter (shell). Don't add opaque full-screen backgrounds that hide it; prefer translucent panels.
- framer-motion `layout`/`layoutId` morphs, staggered reveals and `AnimatePresence` cross-fades between step states are encouraged. Respect reduced motion.

## Verify visually (you CAN see your work)
1. Build to your own folder and serve it on your own port (another agent uses others):
   `npx vite build --outDir /tmp/orbit-<you> --emptyOutDir` then once: `npx vite preview --outDir /tmp/orbit-<you> --port <your port> --strictPort &` (vite preview re-reads files, so rebuilds show up; kill it when done).
2. `PORT=<your port> node tools/fitcheck.cjs /tmp/orbit-<you>-shots <slug>/<step> <slug>/<step> ...` prints vertical overflow px per step at 1366×768 (aim ≤ 8) and saves JPEG screenshots to `/tmp/orbit-<you>-shots/shots/`. **Read the screenshots** and iterate until each step looks like a premium pitch slide, not a document.
3. `npx tsc -b` must be clean for your files.

Only edit your assigned chapter files and their helpers under `src/components/<prefix>/` and their own data files under `src/data/` (e.g. shorter present-mode phrases). Do not edit ui.tsx, index.css, shell/*, chapters.ts or other agents' chapters. Do not commit. Report: before/after on-screen word counts per chapter, what you moved to explore, screenshots reviewed.
