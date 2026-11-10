import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, CircleDashed, Handshake, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Badge, Expandable, Kicker, Reveal, SourceNote, SplitHeadline, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { pilotOutcomes, pilotPhases, pilotThresholds } from '../data/strategy'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'pilot')!

const FRAMEWORK_LABEL = 'Proposed pilot framework — not an approved or completed Imperial pilot.'
const THRESHOLD_NOTE = 'Proposed targets requiring stakeholder agreement and refinement, not established industry benchmarks.'

/** Parse "Weeks 1–2" → [1, 2] so the timeline is driven by data. */
const span = (weeks: string): [number, number] => {
  const m = weeks.match(/(\d+)\D+(\d+)/)
  return m ? [Number(m[1]), Number(m[2])] : [1, 1]
}
const phases = pilotPhases.map((p) => ({ ...p, span: span(p.weeks) }))
const totalWeeks = Math.max(...phases.map((p) => p.span[1]))
const phaseColors = ['#8066ff', '#3b82f6', '#3de0ea', '#ffa36b']

/** CHAPTER 12 — The proposed Imperial pilot: a test, not another forecast. */
export default function Ch12Pilot({ mode, step }: ChapterProps) {
  const explore = mode === 'explore'
  return (
    <Stage mode={mode}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="max-w-4xl">
          <Reveal>
            <Kicker>
              <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle} · {meta.title}
            </Kicker>
          </Reveal>
          <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
            <SplitHeadline text="The next step isn’t another forecast." delay={0.08} />{' '}
            <span className="font-serif font-normal italic text-gradient">
              <SplitHeadline text="It’s a test." delay={0.4} />
            </span>
          </h2>
        </div>
        <Reveal delay={0.3}>
          <div className="flex items-center gap-2 rounded-xl border border-amber/40 bg-amber/10 px-4 py-2.5 text-sm font-medium text-amber">
            <CircleDashed size={16} className="shrink-0" />
            {FRAMEWORK_LABEL}
          </div>
        </Reveal>
      </div>

      <div className="mt-6 lg:mt-8">
        <Timeline compact={!explore && step > 0} />
      </div>

      {explore ? (
        <div className="mt-10 space-y-12">
          <Thresholds />
          <Decision />
          <div className="grid gap-3 md:grid-cols-2">
            <Expandable title="Why a pilot before more forecasting?">
              The five-year model rests on untested assumptions — institutional willingness to pay, authorised data access, student retention and delivery cost.
              A short, measurable pilot tests the riskiest of these with real users and a real potential buyer before any further capital is committed.
            </Expandable>
            <Expandable title="What this pilot can and cannot show">
              It can show whether a focused cohort uses Orbit repeatedly, whether listings are accurate, and whether an institution expresses documented
              purchasing interest. It cannot show long-run renewal, multi-institution economics or attendance impact — those need later evidence.
            </Expandable>
          </div>
          <SourceNote>Pilot framework and thresholds are the team’s proposal (R6). No pilot has been run; no pilot results exist yet.</SourceNote>
        </div>
      ) : (
        <div className="mt-6 lg:mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease }}
            >
              {step === 0 && <PhaseCards />}
              {step === 1 && <Thresholds />}
              {step >= 2 && <Decision />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </Stage>
  )
}

/* ---------- Step 0: timeline ---------- */

function Timeline({ compact }: { compact: boolean }) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
        <span>Proposed timeline · ~{totalWeeks} weeks</span>
        <span className="hidden sm:inline">Week</span>
      </div>
      {/* week ticks */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))` }}>
        {Array.from({ length: totalWeeks }, (_, i) => (
          <div key={i} className="num border-l border-line pb-1 pl-1.5 text-[11px] text-dim">
            {i + 1}
          </div>
        ))}
      </div>
      {/* phase bar */}
      <div className="relative grid gap-1" style={{ gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))` }}>
        {phases.map((p, i) => (
          <motion.div
            key={p.id}
            className={`relative overflow-hidden rounded-lg border ${compact ? 'py-2' : 'py-3.5'} px-3`}
            style={{
              gridColumn: `${p.span[0]} / ${p.span[1] + 1}`,
              borderColor: `${phaseColors[i]}66`,
              background: `linear-gradient(90deg, ${phaseColors[i]}33, ${phaseColors[i]}12)`,
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.18, ease }}
          >
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="num text-xs" style={{ color: phaseColors[i] }}>
                0{p.n}
              </span>
              <span className={`font-semibold ${compact ? 'text-base' : 'text-lg'}`}>{p.title}</span>
              <span className="hidden truncate text-xs text-silver md:inline">{p.weeks}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PhaseCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {phases.map((p, i) => (
        <div key={p.id} className="glass relative rounded-2xl p-5">
          <div className="absolute inset-x-5 top-0 h-px" style={{ background: `linear-gradient(90deg, ${phaseColors[i]}, transparent)` }} />
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">{p.title}</span>
            <span className="num text-xs text-silver">{p.weeks}</span>
          </div>
          <p className="mt-3 text-base leading-snug text-silver">{p.detail}</p>
        </div>
      ))}
      <SourceNote className="sm:col-span-2 lg:col-span-4">Proposed framework (R6). Timing to be agreed with Imperial stakeholders; nothing has been scheduled or approved.</SourceNote>
    </div>
  )
}

/* ---------- Step 1: thresholds ---------- */

function Gauge({ value, color }: { value: number; color: string }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 -rotate-90" aria-hidden>
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgb(156 169 188 / 0.14)" strokeWidth="5" />
      <motion.circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 1, ease }}
      />
    </svg>
  )
}

function Thresholds() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold">Provisional success thresholds</h3>
        <Badge tone="amber">Proposed targets</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pilotThresholds.map((t, i) => (
          <motion.div
            key={t.id}
            className="glass flex items-center gap-4 rounded-2xl p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease }}
          >
            {t.target !== null ? (
              <div className="relative grid place-items-center">
                <Gauge value={t.target} color={i % 2 ? '#3de0ea' : '#8066ff'} />
                <span className="num absolute text-[15px] font-semibold">
                  {t.target}
                  {t.unit}
                </span>
              </div>
            ) : (
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[5px] border-peach/50 text-peach">
                <Handshake size={22} />
              </div>
            )}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{t.target !== null ? `Target ≥ ${t.target}${t.unit}` : 'Commercial gate'}</div>
              <p className="mt-0.5 text-base leading-snug text-snow">{t.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-sm text-amber/90">{THRESHOLD_NOTE}</p>
    </div>
  )
}

/* ---------- Step 2: decision ---------- */

type Val = 'met' | 'unmet' | null
type OutcomeId = (typeof pilotOutcomes)[number]['id']

/** User-value metrics whose failure means the core proposition isn't working. */
const CORE_VALUE = ['wau', 'discovered']

/**
 * Transparent hypothetical rule:
 *  - all thresholds met (including the buyer gate) → GO
 *  - core user-value metrics met, anything else not met → ITERATE
 *  - a core user-value metric not met → STOP / PIVOT (after repeated tests)
 */
function suggest(vals: Record<string, Val>): OutcomeId | null {
  if (pilotThresholds.some((t) => vals[t.id] == null)) return null
  if (pilotThresholds.every((t) => vals[t.id] === 'met')) return 'go'
  if (CORE_VALUE.some((id) => vals[id] === 'unmet')) return 'stop'
  return 'iterate'
}

const presets: { label: string; vals: (id: string) => Val }[] = [
  { label: 'Everything met', vals: () => 'met' },
  { label: 'Students engage, no buyer yet', vals: (id) => (id === 'buyer' || id === 'onboard' ? 'unmet' : 'met') },
  { label: 'Low repeat usage', vals: (id) => (id === 'wau' || id === 'discovered' || id === 'buyer' ? 'unmet' : 'met') },
]

const shortLabel: Record<string, string> = {
  onboard: 'Onboarding',
  wau: 'Weekly active usage',
  action: 'Save / share / click',
  discovered: 'Relevant event discovered',
  accuracy: 'Listing accuracy',
  buyer: 'Institutional buyer',
}

function Decision() {
  const [chosen, setChosen] = useState<OutcomeId>('go')
  const [vals, setVals] = useState<Record<string, Val>>({})
  const suggestion = suggest(vals)
  const shown = pilotOutcomes.find((o) => o.id === (suggestion ?? chosen))!

  const cycle = (id: string) =>
    setVals((v) => {
      const cur = v[id] ?? null
      const next: Val = cur === null ? 'met' : cur === 'met' ? 'unmet' : null
      return { ...v, [id]: next }
    })

  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Outcomes */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-xl font-semibold">After week {totalWeeks}: a disciplined decision</h3>
        </div>
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Pilot decision outcome">
          {pilotOutcomes.map((o) => {
            const active = shown.id === o.id
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={(e) => {
                  stop(e)
                  setChosen(o.id)
                  setVals({})
                }}
                className="relative rounded-2xl border px-3 py-4 text-center transition-all"
                style={{
                  borderColor: active ? o.color : 'var(--color-line)',
                  background: active ? `color-mix(in srgb, ${o.color} 14%, transparent)` : 'rgb(16 23 42 / 0.6)',
                  boxShadow: active ? `0 0 40px -14px ${o.color}` : 'none',
                }}
              >
                <div className="text-[clamp(1.1rem,1.7vw,1.7rem)] font-semibold tracking-tight" style={{ color: o.color }}>
                  {o.label}
                </div>
                {suggestion === o.id && <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">suggested</div>}
              </button>
            )
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={shown.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease }}
            className="glass mt-3 rounded-2xl p-5"
            style={{ borderColor: `color-mix(in srgb, ${shown.color} 35%, transparent)` }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: shown.color }}>
              What it means
            </div>
            <p className="mt-1 text-lg font-medium leading-snug text-snow">{shown.summary}</p>
            <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
              <ArrowRight size={12} /> What happens next
            </div>
            <p className="mt-1 text-base leading-snug text-silver">{shown.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hypothetical simulator */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-base font-semibold">Try a hypothetical result</span>
          <Badge tone="amber">Hypothetical — no pilot results exist yet</Badge>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={(e) => {
                stop(e)
                setVals(Object.fromEntries(pilotThresholds.map((t) => [t.id, p.vals(t.id)])))
              }}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-silver transition-colors hover:border-violet/60 hover:text-snow"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => {
              stop(e)
              setVals({})
            }}
            className="rounded-full px-2.5 py-1 text-xs text-dim hover:text-snow"
          >
            Reset
          </button>
        </div>
        <ul className="mt-3 space-y-1.5">
          {pilotThresholds.map((t) => {
            const v = vals[t.id] ?? null
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={(e) => {
                    stop(e)
                    cycle(t.id)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-1.5 text-left transition-colors hover:border-violet/40"
                  aria-label={`${shortLabel[t.id] ?? t.label}: ${v === 'met' ? 'met' : v === 'unmet' ? 'not met' : 'not set'} (click to change)`}
                >
                  <StateIcon v={v} />
                  <span className="flex-1 text-[15px] text-snow">
                    {shortLabel[t.id] ?? t.label}
                    {CORE_VALUE.includes(t.id) && <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] text-violet-soft">core value</span>}
                  </span>
                  <span className="num text-xs text-dim">{t.target !== null ? `≥${t.target}${t.unit}` : 'gate'}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-dim">
          Rule: all met incl. buyer → GO · core value met, others not → ITERATE · core value not met → STOP / PIVOT (after repeated tests).
          {suggestion === null && ' Set all six to see a suggestion.'}
        </p>
      </div>
    </div>
  )
}

function StateIcon({ v }: { v: Val }): ReactNode {
  if (v === 'met')
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-st-supported/20 text-st-supported">
        <Check size={14} />
      </span>
    )
  if (v === 'unmet')
    return (
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-st-contradicted/20 text-st-contradicted">
        <X size={14} />
      </span>
    )
  return <span className="h-6 w-6 shrink-0 rounded-full border border-dashed border-silver/40" />
}
