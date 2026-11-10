# Orbit — Interactive Venture Pitch

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (deploy anywhere)
```

## Modes
- **Present** (`#/present/<chapter>`) — 16 full-screen chapters, presenter-paced.
- **Explore** (`#/explore/<section>`) — scrollable site for judges: Evidence Room, Assumption Lab, Scenario Explorer, Chaos Simulator.
- **Presenter window** (`#/presenter`) — open on the laptop; stays in sync with the projector tab.

## Keys (Present)
→ / Space / PageDown next · ← / PageUp back · G chapters · P presenter panel · F fullscreen · I immersive · T timer · Home / End · Esc close

## Editing content
Everything lives in `src/data/`:
| File | What |
|---|---|
| `config.ts` | prototype URL, product video URL, target duration |
| `presenters.ts` | speaker allocation (provisional) |
| `chapters.ts` | chapter titles, steps, timings, speaker notes |
| `research.ts` | survey / interview figures and limitations |
| `financials.ts` | workbook figures, COGS/OpEx split (`costSplit`, currently awaiting import), scenario formula |
| `market.ts` | TAM/SAM/SOM, pricing tiers, funnel |
| `strategy.ts` | business models, risks, pilot, vision, assumption lab, team, references |
| `events.ts` | illustrative demo events |

Team photos: add files to `public/team/` and map them in `src/chapters/Ch14Team.tsx` (`photos`).
