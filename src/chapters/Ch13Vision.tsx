import { AnimatePresence, motion } from 'framer-motion'
import { GitFork } from 'lucide-react'
import { useState } from 'react'
import { Badge, Expandable, Kicker, Reveal, SourceNote, SplitHeadline, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { visionStages } from '../data/strategy'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'vision')!

const DISTINCTION =
  'The university SaaS business and the organiser-funded external-events model are different commercial hypotheses. University success may create a useful audience and distribution base, but it does not automatically validate organiser willingness to pay.'
const NOT_IN_FORECAST = 'External-event revenue is not included in the five-year institutional forecast.'

const isFuture = (horizon: string) => horizon === 'Future option'

/** Ring radius per stage (viewBox 0–100). Stage 1 is the core dot. */
const radius = (n: number) => (n === 1 ? 9 : 9 + (n - 1) * 10)
/** Angle (deg) where each stage's marker sits on its ring, staggered to avoid collisions. */
const angle: Record<number, number> = { 2: -30, 3: 40, 4: 115, 5: -100 }

const pos = (n: number) => {
  if (n === 1) return { x: 50, y: 50 }
  const a = (angle[n] * Math.PI) / 180
  return { x: 50 + radius(n) * Math.cos(a), y: 50 + radius(n) * Math.sin(a) }
}

/** CHAPTER 13 — Start with universities; expand where the network already exists. */
export default function Ch13Vision({ mode, step }: ChapterProps) {
  const explore = mode === 'explore'
  const [focus, setFocus] = useState<number | null>(null)

  return (
    <Stage mode={mode}>
      <div className="max-w-5xl">
        <Reveal>
          <Kicker>
            <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle} · {meta.title}
          </Kicker>
        </Reveal>
        <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
          <SplitHeadline text="Start with universities." delay={0.08} />{' '}
          <span className="font-serif font-normal italic text-gradient">
            <SplitHeadline text="Expand where the network already exists." delay={0.3} />
          </span>
        </h2>
      </div>

      <div className="mt-6 grid items-center gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <Rings focus={focus} setFocus={setFocus} />

        <div className="min-h-[360px]">
          <AnimatePresence mode="wait" initial={false}>
            {(explore || step === 0) && (
              <motion.div
                key="stages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease }}
              >
                <StageList focus={focus} setFocus={setFocus} />
              </motion.div>
            )}
            {!explore && step >= 1 && (
              <motion.div
                key="distinction"
                initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                <DistinctionCard />
              </motion.div>
            )}
          </AnimatePresence>
          {explore && (
            <div className="mt-6">
              <DistinctionCard />
            </div>
          )}
        </div>
      </div>

      {explore && (
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <Expandable title="Why universities first?">
            The institutional product is what the prototype is built around and what the five-year forecast models. Each stage depends on evidence from the
            one before it: a validated Imperial pilot, then repeatable onboarding with other London universities, then wider UK processes.
          </Expandable>
          <Expandable title="What would have to be true for external events?">
            An established university footprint in a city, reliable attribution of registrations, organiser partnerships and evidence that Orbit delivers
            incremental attendees. None of this is yet demonstrated — it is a future option, not a plan of record.
          </Expandable>
          <SourceNote className="md:col-span-2">
            Stages 1–3 correspond to the institutional path in the financial workbook (R2) and go-to-market model (R4). Stages 4–5 are not modelled.
            Abstract diagram — rings do not represent real geography or partners.
          </SourceNote>
        </div>
      )}
    </Stage>
  )
}

function Rings({ focus, setFocus }: { focus: number | null; setFocus: (n: number | null) => void }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(100%,50vh)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="vision-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8066ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vision-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8066ff" />
            <stop offset="100%" stopColor="#3de0ea" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="18" fill="url(#vision-core)" />
        {visionStages
          .filter((s) => s.n > 1)
          .map((s, i) => {
            const future = isFuture(s.horizon)
            const active = focus === s.n
            return (
              <motion.circle
                key={s.n}
                cx="50"
                cy="50"
                r={radius(s.n)}
                fill="none"
                stroke={future ? 'rgb(255 163 107 / 0.55)' : 'url(#vision-ring)'}
                strokeDasharray={future ? '1.2 1.6' : undefined}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: active ? 1 : future ? 0.45 : 0.75, strokeWidth: active ? 0.7 : 0.35 }}
                style={{ transformOrigin: '50px 50px' }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.22, ease }}
              />
            )
          })}
      </svg>

      {visionStages.map((s, i) => {
        const p = pos(s.n)
        const future = isFuture(s.horizon)
        const active = focus === s.n
        const core = s.n === 1
        return (
          <motion.button
            key={s.n}
            type="button"
            onMouseEnter={() => setFocus(s.n)}
            onMouseLeave={() => setFocus(null)}
            onFocus={() => setFocus(s.n)}
            onBlur={() => setFocus(null)}
            onClick={(e) => {
              e.stopPropagation()
              setFocus(active ? null : s.n)
            }}
            aria-label={`Stage ${s.n}: ${s.title} — ${s.horizon}`}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: future && !active ? 0.6 : 1, scale: active ? 1.08 : 1 }}
            transition={{ duration: 0.5, delay: active ? 0 : 0.35 + i * 0.22, ease }}
          >
            <span
              className={`grid place-items-center rounded-full border ${core ? 'h-16 w-16 bg-navy' : 'h-8 w-8 bg-ink'} ${future ? 'border-dashed' : ''}`}
              style={{
                borderColor: future ? 'rgb(255 163 107 / 0.7)' : 'rgb(183 168 255 / 0.8)',
                boxShadow: future ? 'none' : '0 0 30px -6px rgba(128,102,255,0.9)',
              }}
            >
              {core ? (
                <img src="/brand/orbit-logo.webp" alt="" className="h-9 w-9 select-none" draggable={false} />
              ) : (
                <span className={`num text-xs ${future ? 'text-peach' : 'text-lavender'}`}>{s.n}</span>
              )}
            </span>
            <span
              className={`mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[13px] font-medium backdrop-blur sm:text-sm ${
                future ? 'bg-ink/60 text-peach/90' : 'bg-ink/60 text-snow'
              }`}
            >
              {s.title.replace(', where we already operate', '')}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

function StageList({ focus, setFocus }: { focus: number | null; setFocus: (n: number | null) => void }) {
  const core = visionStages.filter((s) => !isFuture(s.horizon))
  const future = visionStages.filter((s) => isFuture(s.horizon))
  const row = (s: (typeof visionStages)[number]) => {
    const f = isFuture(s.horizon)
    return (
      <li
        key={s.n}
        onMouseEnter={() => setFocus(s.n)}
        onMouseLeave={() => setFocus(null)}
        className={`flex gap-3 rounded-xl px-3 py-2 transition-colors ${focus === s.n ? 'bg-white/5' : ''}`}
      >
        <span className={`num mt-0.5 text-sm ${f ? 'text-peach/80' : 'text-violet-soft'}`}>0{s.n}</span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-lg font-semibold ${f ? 'text-silver' : 'text-snow'}`}>{s.title}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{s.horizon}</span>
          </div>
          <p className={`text-[15px] leading-snug ${f ? 'text-dim' : 'text-silver'}`}>{s.detail}</p>
        </div>
      </li>
    )
  }
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-violet/30 bg-violet/5 p-2">
        <div className="px-3 pt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">Core institutional forecast</div>
        <ul>
          {core.map(row)}
        </ul>
      </div>
      <div className="rounded-2xl border border-dashed border-peach/30 p-2">
        <div className="px-3 pt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-peach/80">Future option · not forecast</div>
        <ul>
          {future.map(row)}
        </ul>
      </div>
    </div>
  )
}

function DistinctionCard() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6 lg:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-peach/10 blur-3xl" />
      <div className="flex items-center gap-2">
        <GitFork size={18} className="text-peach" />
        <span className="t-kicker !text-peach">A strategic distinction</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-violet/40 bg-violet/10 p-3">
          <div className="text-xs text-silver">Hypothesis 1</div>
          <div className="mt-0.5 text-base font-semibold">University SaaS</div>
          <div className="mt-1 text-xs text-violet-soft">In five-year forecast</div>
        </div>
        <div className="rounded-xl border border-dashed border-peach/40 p-3">
          <div className="text-xs text-silver">Hypothesis 2</div>
          <div className="mt-0.5 text-base font-semibold">Organiser-funded events</div>
          <div className="mt-1 text-xs text-peach/90">Separate, untested</div>
        </div>
      </div>
      <p className="mt-5 text-[clamp(1rem,1.25vw,1.25rem)] leading-snug text-snow">{DISTINCTION}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Badge tone="amber">Not in forecast</Badge>
        <p className="text-base font-medium text-silver">{NOT_IN_FORECAST}</p>
      </div>
    </div>
  )
}
