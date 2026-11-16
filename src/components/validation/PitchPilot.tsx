import { motion, useReducedMotion } from 'framer-motion'
import { Check, Repeat, X } from 'lucide-react'
import { pilotDecisions, pilotPhases, pilotSequence } from '../../data/pilot'
import { gateTiles, verdictShort } from '../../data/validationPresent'
import { ease } from '../ui'

const V = 'var(--color-ev-proposed)'

/* ---------------------------------------------------------------------------------------------
 * Pilot journey: eight proposed stages on one horizontal path, grouped into four phases and
 * ending in a three-way decision fork. Everything is PROPOSED (violet).
 * Geometry is expressed in "units" (one stage column = 1 unit) so the path, nodes, text and
 * fork pills share a single coordinate system.
 * ------------------------------------------------------------------------------------------- */

const LEAD = 0.45 // left gutter so the first caption never leaves the container
const N = pilotSequence.length
const FORK = 2.25 // width of the fork column
const U = LEAD + N + FORK
const pct = (u: number) => `${(u / U) * 100}%`
const nodeX = (i: number) => LEAD + i + 0.5

// vertical rhythm in rem (16 px), mirrored in the SVG viewBox
const ROW_LABEL = 2.25
const ROW_TEXT = 7.6
const ROW_NODE = 3.5
const H = ROW_LABEL + ROW_TEXT + ROW_NODE + ROW_TEXT
const yNode = ROW_LABEL + ROW_TEXT + ROW_NODE / 2
const yUp = ROW_LABEL + ROW_TEXT / 2 + 0.3
const yDown = ROW_LABEL + ROW_TEXT + ROW_NODE + ROW_TEXT / 2 - 0.3

const decisionIcon = { subscribe: Check, iterate: Repeat, discontinue: X } as const

export function PilotJourney() {
  const reduce = useReducedMotion()
  const vb = (u: number) => (u / U) * 1000
  const x1 = vb(nodeX(0))
  const x8 = vb(nodeX(N - 1))
  const xp = vb(LEAD + N + 0.45)
  const y = (r: number) => r * 16
  const fork = (yEnd: number) => {
    const dx = (xp - x8) * 0.55
    return `M ${x8} ${y(yNode)} C ${x8 + dx} ${y(yNode)}, ${xp - dx} ${y(yEnd)}, ${xp} ${y(yEnd)}`
  }
  const yPill = [yUp, yNode, yDown]
  return (
    <div className="relative w-full" style={{ height: `${H}rem` }} role="group" aria-label="Proposed pilot journey: eight stages from securing a Careers champion to a subscription decision, grouped as Get to yes, Before launch, Run and Decide, ending in subscribe, iterate and retest, or discontinue.">
      {/* phase bands */}
      {pilotPhases.map((p, k) => {
        const last = p.id === 'decide'
        const left = LEAD + p.from
        const width = p.count + (last ? FORK : 0)
        return (
          <motion.div
            key={p.id}
            className="absolute inset-y-0 rounded-2xl"
            style={{ left: `calc(${pct(left)} + 3px)`, width: `calc(${pct(width)} - 6px)`, background: `linear-gradient(to bottom, color-mix(in srgb, ${V} ${9 + k * 2}%, transparent), color-mix(in srgb, ${V} 2%, transparent))` }}
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: k * 0.1 }}
          >
            <span className="absolute inset-x-3 top-0 h-[3px] rounded-full" style={{ background: V, opacity: 0.55 + k * 0.1 }} />
            <span className="absolute inset-x-0 top-3 px-1 text-center font-mono text-[11.5px] uppercase tracking-[0.08em] whitespace-nowrap text-violet-soft">{p.label}</span>
          </motion.div>
        )
      })}

      {/* the path that draws itself */}
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 1000 ${y(H)}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="pj-grad" gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x8} y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path d={`M ${x1} ${y(yNode)} L ${xp} ${y(yNode)}`} stroke="rgb(148 163 184 / 0.16)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <motion.path d={`M ${x1} ${y(yNode)} L ${x8} ${y(yNode)}`} stroke="url(#pj-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 7px rgb(139 92 246 / 0.8))' }} initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.1 }} />
        {yPill.map((yy, i) => (
          <motion.path key={i} d={fork(yy)} stroke="#38bdf8" strokeOpacity={0.85} strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgb(56 189 248 / 0.6))' }} initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: 'easeOut', delay: 1.05 }} />
        ))}
      </svg>

      {/* stages */}
      {pilotSequence.map((s, i) => {
        const above = i % 2 === 0
        const last = i === N - 1
        const w = last ? 1.65 : 1.9
        const delay = 0.12 + i * 0.12
        return (
          <div key={s.id}>
            <motion.span
              className={`num absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-semibold text-snow ${last ? 'h-[3.4rem] w-[3.4rem] border-snow text-xl' : 'h-12 w-12 text-lg'}`}
              style={{ left: pct(nodeX(i)), top: `${yNode}rem`, background: last ? 'radial-gradient(circle at 35% 30%, #c4b5fd, #8b5cf6)' : '#0d1224', borderColor: last ? undefined : V, boxShadow: `0 0 ${last ? 40 : 22}px ${last ? 6 : 1}px rgb(139 92 246 / ${last ? 0.65 : 0.4})` }}
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease, delay }}
            >
              {i + 1}
            </motion.span>
            <motion.div
              className={`absolute flex -translate-x-1/2 flex-col items-center text-center ${above ? 'justify-end' : 'justify-start'}`}
              style={{ left: pct(nodeX(i)), width: pct(w), height: `${ROW_TEXT}rem`, top: above ? `${ROW_LABEL}rem` : `${ROW_LABEL + ROW_TEXT + ROW_NODE}rem` }}
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : above ? 8 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: delay + 0.08 }}
            >
              {!above && <span className="mb-1 mt-0 h-3 w-px shrink-0 bg-violet/50" />}
              <div className="px-0.5">
                <div className="text-[clamp(1rem,1.3vw,1.25rem)] font-semibold leading-tight text-snow">{s.title}</div>
                <div className="mt-1 text-[clamp(0.88rem,1.05vw,1rem)] leading-snug text-silver">{s.line}</div>
              </div>
              {above && <span className="mt-1 h-3 w-px shrink-0 bg-violet/50" />}
            </motion.div>
          </div>
        )
      })}

      {/* decision fork */}
      {pilotDecisions.map((d, i) => {
        const Icon = decisionIcon[d.id as keyof typeof decisionIcon]
        return (
          <motion.div
            key={d.id}
            className="absolute flex -translate-y-1/2 items-center gap-2.5 rounded-xl border px-3 py-2"
            style={{ left: pct(LEAD + N + 0.45), width: pct(FORK - 0.5), top: `${yPill[i]}rem`, borderColor: 'color-mix(in srgb, #38bdf8 55%, transparent)', background: '#0b1426', boxShadow: '0 0 26px -8px rgb(56 189 248 / 0.55)' }}
            initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease, delay: 1.25 + i * 0.08 }}
          >
            <Icon size={20} className="shrink-0 text-cyan" strokeWidth={2.5} />
            <span className="min-w-0 leading-tight">
              <span className="block text-[clamp(1rem,1.25vw,1.3rem)] font-semibold text-snow">{d.label}</span>
              <span className="block text-[clamp(0.8rem,0.95vw,0.95rem)] text-silver">{d.line}</span>
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------
 * Gates
 * ------------------------------------------------------------------------------------------- */

function Ring({ pct: p }: { pct: number | null }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="h-[4.5rem] w-[4.5rem] shrink-0" aria-hidden>
      <g transform="rotate(-90 40 40)">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(148 163 184 / 0.18)" strokeWidth="7" />
        <motion.circle cx="40" cy="40" r={r} fill="none" stroke="#a78bfa" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: p === null ? 0 : c * (1 - p / 100) }} transition={{ duration: 1, ease, delay: 0.3 }} style={{ filter: 'drop-shadow(0 0 6px rgb(167 139 250 / 0.9))' }} />
      </g>
      {p === null && <path d="M28 41 l8 8 l16 -18" fill="none" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

/** Six gate tiles: ring gauge + giant threshold + a short label. Every tile is marked ILLUSTRATIVE. */
export function GateTiles() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {gateTiles.map((g, i) => (
        <motion.li key={g.id} className="relative flex list-none items-center gap-4 rounded-2xl border border-dashed px-4 py-4" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 50%, transparent)', background: 'color-mix(in srgb, var(--color-ev-proposed) 7%, transparent)' }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: i * 0.08 }}>
          <span className="absolute right-3 top-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber">Illustrative</span>
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

const verdictColor = { GO: '#34d399', ITERATE: '#fbbf24', STOP: '#f87171' } as const

/** Static GO / ITERATE / STOP rule cards (no operation needed by the presenter). */
export function VerdictCards() {
  const ids = ['GO', 'ITERATE', 'STOP'] as const
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ids.map((id, i) => {
        const c = verdictColor[id]
        return (
          <motion.div key={id} className="rounded-3xl border-2 px-6 py-6" style={{ borderColor: c, background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${c} 20%, transparent), color-mix(in srgb, ${c} 4%, transparent))`, boxShadow: `0 0 60px -14px color-mix(in srgb, ${c} 70%, transparent)` }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease, delay: i * 0.15 }}>
            <div className="num text-[clamp(2.4rem,4.6vw,4.4rem)] font-bold leading-none tracking-tight" style={{ color: c, textShadow: `0 0 40px ${c}` }}>
              {verdictShort[id].label}
            </div>
            <p className="mt-4 text-[clamp(1.05rem,1.4vw,1.4rem)] leading-snug text-snow">{verdictShort[id].rule}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

