import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { evaluate, funnel, presets, thresholds, type PilotOutcome, type Renewal, type VerdictResult } from '../../data/pilot'
import { gateTiles, pilotTrackLabels } from '../../data/validationPresent'
import { Badge, GlowNumber, ease } from '../ui'

const V = 'var(--color-ev-proposed)'

/** Eight-stage pilot sequence as a compact glowing track. Violet = proposed. */
export function PilotTrack() {
  const reduce = useReducedMotion()
  return (
    <div className="relative pt-1">
      <div className="absolute left-[6.25%] right-[6.25%] top-[1.7rem] h-[3px] rounded-full bg-silver/15" />
      <motion.div
        className="absolute left-[6.25%] right-[6.25%] top-[1.7rem] h-[3px] origin-left rounded-full"
        style={{ background: 'linear-gradient(90deg, #8b5cf6, #6d8bfa 60%, #38bdf8)', boxShadow: '0 0 22px 2px rgb(139 92 246 / 0.7)' }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.3, ease, delay: 0.15 }}
      />
      <ol className="relative grid grid-cols-8">
        {pilotTrackLabels.map((s, i) => {
          const last = i === pilotTrackLabels.length - 1
          return (
            <motion.li key={s} className="flex list-none flex-col items-center text-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.09 }}>
              <span
                className={`num grid place-items-center rounded-full border-2 text-lg font-semibold text-snow ${last ? 'h-14 w-14 border-snow' : 'mt-1 h-12 w-12'}`}
                style={{ background: last ? 'radial-gradient(circle at 35% 30%, #c4b5fd, #8b5cf6)' : '#0d1224', borderColor: last ? undefined : V, boxShadow: `0 0 ${last ? 46 : 26}px ${last ? 8 : 2}px rgb(139 92 246 / ${last ? 0.7 : 0.45})` }}
              >
                {i + 1}
              </span>
              <span className={`mt-3 px-1 text-[clamp(0.95rem,1.3vw,1.3rem)] font-semibold leading-tight ${last ? 'text-snow' : 'text-silver'}`}>{s}</span>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

const fmt = (n: number) => n.toLocaleString('en-GB')

/** Cohort funnel with giant glowing numbers (1,000 → 400 → 80 → 24) and the editable input. */
export function FunnelHero({ invited, setInvited }: { invited: number; setInvited: (n: number) => void }) {
  const f = funnel(invited)
  const clamp = (v: number) => Math.max(1, Math.min(100000, Math.round(v) || 1))
  const stages = [
    { label: 'Invited', n: f.invited, rule: null },
    { label: 'Activated', n: f.activated, rule: `× ${thresholds.activation}%` },
    { label: 'Weekly active', n: f.wau, rule: `× ${thresholds.wau}%` },
    { label: 'Meaningful action', n: f.meaningful, rule: `× ${thresholds.meaningful}%` },
  ]
  const H = [100, 88, 76, 64]
  return (
    <div>
      <div className="flex items-stretch" style={{ height: '16.5rem' }} aria-label="Narrowing funnel">
        {stages.map((s, i) => {
          const h = H[i]
          const nh = H[i + 1] ?? h
          const d = ((h - nh) / 2 / h) * 100
          const last = i === stages.length - 1
          return (
            <div key={s.label} className="relative flex flex-1 items-center" style={{ filter: `drop-shadow(0 0 ${last ? 26 : 12}px rgb(139 92 246 / ${last ? 0.55 : 0.3}))` }}>
              <div
                className="flex w-full flex-col items-center justify-center text-center"
                style={{
                  height: `${h}%`,
                  clipPath: `polygon(0 0, 100% ${d}%, 100% ${100 - d}%, 0 100%)`,
                  background: `linear-gradient(135deg, rgb(139 92 246 / ${0.12 + i * 0.07}), rgb(56 189 248 / ${0.05 + i * 0.05}))`,
                }}
              >
                <GlowNumber value={s.n} format={(n) => fmt(Math.round(n))} className="num text-[clamp(2.8rem,6.4vw,6.2rem)] leading-none" />
                <div className="mt-2 text-[clamp(0.95rem,1.25vw,1.2rem)] font-medium text-snow">{s.label}</div>
                <div className="mt-1 h-5 font-mono text-[12px] tracking-wider text-violet-soft">{s.rule ?? ' '}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <label htmlFor="invited-count" className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">
          Invited students
        </label>
        <input
          id="invited-count"
          type="number"
          inputMode="numeric"
          min={1}
          max={100000}
          value={invited}
          onChange={(e) => setInvited(clamp(Number(e.target.value)))}
          className="num w-32 rounded-xl border border-violet/50 bg-navy px-3 py-1.5 text-2xl text-snow focus-visible:outline-2 focus-visible:outline-violet"
        />
        <input type="range" aria-label="Invited students" min={100} max={5000} step={50} value={Math.min(5000, Math.max(100, invited))} onChange={(e) => setInvited(Number(e.target.value))} className="w-full max-w-md flex-1 accent-violet" />
      </div>
    </div>
  )
}

function Ring({ pct }: { pct: number | null }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="h-[4.5rem] w-[4.5rem] shrink-0" aria-hidden>
      <g transform="rotate(-90 40 40)">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(148 163 184 / 0.18)" strokeWidth="7" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: pct === null ? 0 : c * (1 - pct / 100) }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 6px rgb(167 139 250 / 0.9))' }}
        />
      </g>
      {pct === null && <path d="M28 41 l8 8 l16 -18" fill="none" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

/** Six gate tiles: ring gauge + giant threshold + a ≤ 4-word label. */
export function GateTiles() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {gateTiles.map((g, i) => (
        <motion.li key={g.id} className="flex list-none items-center gap-4 rounded-2xl border border-dashed px-4 py-4" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 50%, transparent)', background: 'color-mix(in srgb, var(--color-ev-proposed) 7%, transparent)' }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: i * 0.08 }}>
          <Ring pct={g.ring} />
          <div className="min-w-0">
            <div className="num glow-num text-[clamp(1.9rem,3.2vw,3.2rem)] font-semibold leading-none text-snow">{g.value}</div>
            <div className="mt-1.5 text-[clamp(1rem,1.3vw,1.25rem)] font-medium leading-tight text-snow">{g.title}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-violet-soft">{g.sub}</div>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

/* ---------- Simulator (compact) ---------- */

const resultColor: Record<VerdictResult, string> = {
  GO: '#34d399',
  ITERATE: '#fbbf24',
  STOP: '#f87171',
}

function Mini({ id, label, value, min, max, gate, onChange, plus = false }: { id: string; label: string; value: number; min: number; max: number; gate: string; onChange: (n: number) => void; plus?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[15px] text-snow">
          {label} <span className="font-mono text-[11px] text-dim">{gate}</span>
        </label>
        <span className="num text-lg text-snow">
          {plus && value > 0 ? '+' : ''}
          {value}%
        </span>
      </div>
      <input id={id} type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-violet" />
    </div>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-violet ${on ? 'border-violet bg-violet/25 text-snow' : 'border-line text-silver hover:border-violet/60 hover:text-snow'}`}
    >
      {children}
    </button>
  )
}

const renewalOptions: { v: Renewal; t: string }[] = [
  { v: 'agrees', t: 'Renews' },
  { v: 'undecided', t: 'Undecided' },
  { v: 'rejects', t: 'Rejects' },
]

/** Compact simulator: presets + controls on the left, the verdict as a big glowing badge on the right. */
export function MiniSimulator() {
  const [o, setO] = useState<PilotOutcome>(presets[1].outcome)
  const [active, setActive] = useState<string | null>('iterate')
  const set = (patch: Partial<PilotOutcome>) => {
    setActive(null)
    setO((p) => ({ ...p, ...patch }))
  }
  const v = evaluate(o)
  const c = resultColor[v.result]
  const met = v.gates.filter((g) => g.met).length
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Example outcome presets">
          <Badge tone="amber">Sample data</Badge>
          {presets.map((p) => (
            <Chip
              key={p.id}
              on={active === p.id}
              onClick={() => {
                setActive(p.id)
                setO(p.outcome)
              }}
            >
              {p.id.toUpperCase()} example
            </Chip>
          ))}
        </div>
        <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <Mini id="sim-activation" label="Activation" gate={`≥${thresholds.activation}`} value={o.activation} min={0} max={100} onChange={(n) => set({ activation: n })} />
          <Mini id="sim-wau" label="Weekly active" gate={`≥${thresholds.wau}`} value={o.wau} min={0} max={60} onChange={(n) => set({ wau: n })} />
          <Mini id="sim-meaningful" label="Meaningful" gate={`≥${thresholds.meaningful}`} value={o.meaningful} min={0} max={100} onChange={(n) => set({ meaningful: n })} />
          <Mini id="sim-accuracy" label="Accuracy" gate={`≥${thresholds.accuracy}`} value={o.accuracy} min={80} max={100} onChange={(n) => set({ accuracy: n })} />
          <Mini id="sim-uplift" label="Attendance" gate={`≥+${thresholds.uplift}`} value={o.uplift} min={-10} max={40} plus onChange={(n) => set({ uplift: n })} />
          <div className="flex flex-wrap content-end items-center gap-2">
            <Chip on={o.dataAccess} onClick={() => set({ dataAccess: !o.dataAccess })}>
              Data access
            </Chip>
            <Chip on={o.costsViable} onClick={() => set({ costsViable: !o.costsViable })}>
              Costs viable
            </Chip>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Buyer renewal decision">
          <span className="mr-1 text-[15px] text-snow">Buyer</span>
          {renewalOptions.map((r) => (
            <Chip key={r.v} on={o.renewal === r.v} onClick={() => set({ renewal: r.v })}>
              {r.t}
            </Chip>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Example verdict</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={v.result}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.35, ease }}
            className="mx-auto mt-3 inline-block rounded-[2rem] border-2 px-10 py-6"
            style={{ borderColor: c, background: `radial-gradient(circle at 50% 40%, color-mix(in srgb, ${c} 28%, transparent), color-mix(in srgb, ${c} 6%, transparent))`, boxShadow: `0 0 90px -8px color-mix(in srgb, ${c} 75%, transparent), inset 0 0 40px -10px color-mix(in srgb, ${c} 60%, transparent)` }}
          >
            <span className="num block text-[clamp(3rem,7vw,6.6rem)] font-bold leading-none tracking-tight" style={{ color: c, textShadow: `0 0 50px ${c}` }}>
              {v.result}
            </span>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[13px] tracking-wider text-silver">
          <Check size={14} className="text-st-supported" /> {met} of {v.gates.length} gates met
        </div>
      </div>
    </div>
  )
}
