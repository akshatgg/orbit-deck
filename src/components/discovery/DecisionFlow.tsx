import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, CalendarClock, LayoutList, Sparkles, type LucideIcon } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { productDecisions, valueProps, type ProductDecision, type ValuePropId } from '../../data/productDecisions'
import { ease } from '../ui'

const vpIcon: Record<ValuePropId, LucideIcon> = { feed: LayoutList, interests: Sparkles, schedule: CalendarClock }

/** Column geometry as fractions of the flow width. */
const COL = { l1: 0.26, m0: 0.325, m1: 0.705, r0: 0.77, bus: 0.737 }

const BLUE = '#60a5fa'
const VIOLET = '#8b5cf6'
const SOFT = '#a78bfa'
const GREY = '#64748b'

/**
 * Insight → Evidence → Product decision → Value proposition flow (Present + Explore).
 * `stage` 0: the five insights with their evidence, full width.
 * `stage` 1: insights slide left, decisions and the three value propositions appear, connectors draw.
 * Rows are equal-height grid rows in all three columns so the SVG connectors can be drawn between
 * measured row centres.
 */
export function DecisionFlow({ stage, height = 'clamp(380px, calc(100vh - 286px), 700px)' }: { stage: 0 | 1; height?: string }) {
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<{ w: number; h: number; ys: number[] }>({ w: 0, h: 0, ys: [] })

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const measure = () => {
      // layout coordinates (offset*) are immune to the shell's enter transforms
      const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-mid-row]'))
      setGeo({ w: el.offsetWidth, h: el.offsetHeight, ys: rows.map((r) => { const col = r.offsetParent as HTMLElement | null; return (col && col !== el ? col.offsetTop : 0) + r.offsetTop + r.offsetHeight / 2 }) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const flow = stage === 1
  const { w, ys } = geo
  const ready = w > 0 && ys.length === productDecisions.length

  const xL1 = COL.l1 * w + 5
  const xM0 = COL.m0 * w - 5
  const xM1 = COL.m1 * w + 5
  const xR0 = COL.r0 * w - 4
  const xBus = COL.bus * w
  const dur = reduce ? 0 : 0.7

  return (
    <div ref={wrap} className="relative w-full" style={{ height }}>
      {/* connectors */}
      {ready && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="df-lm" gradientUnits="userSpaceOnUse" x1={xL1} y1={0} x2={xM0} y2={0}>
              <stop offset="0" stopColor={BLUE} />
              <stop offset="1" stopColor={VIOLET} />
            </linearGradient>
            <linearGradient id="df-mr" gradientUnits="userSpaceOnUse" x1={xM1} y1={0} x2={xR0} y2={0}>
              <stop offset="0" stopColor={VIOLET} />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
            <marker id="df-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 1 L9 5 L0 9 Z" fill="#7dd3fc" />
            </marker>
            <marker id="df-arrow-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 1 L9 5 L0 9 Z" fill={GREY} />
            </marker>
          </defs>

          {productDecisions.map((d, i) => {
            const y = ys[i]
            const muted = d.deprioritised
            const dl = 0.15 + i * 0.12
            return (
              <g key={d.id}>
                {/* insight -> decision */}
                <motion.path
                  d={`M ${xL1} ${y} C ${xL1 + (xM0 - xL1) * 0.5} ${y}, ${xL1 + (xM0 - xL1) * 0.5} ${y}, ${xM0} ${y}`}
                  fill="none"
                  stroke={muted ? GREY : 'url(#df-lm)'}
                  strokeWidth={muted ? 1.6 : 2.6}
                  strokeDasharray={muted ? '5 6' : undefined}
                  strokeLinecap="round"
                  markerEnd={muted ? 'url(#df-arrow-g)' : 'url(#df-arrow)'}
                  initial={false}
                  animate={{ pathLength: flow ? 1 : 0, opacity: flow ? 1 : 0 }}
                  transition={{ duration: dur, ease, delay: flow ? dl : 0 }}
                  style={{ filter: muted ? undefined : 'drop-shadow(0 0 5px rgb(139 92 246 / 0.8))' }}
                />
                {/* decision -> value proposition (d1-d3 feed one proposition each) */}
                {d.vp && (
                  <motion.path
                    d={`M ${xM1} ${y} L ${xR0} ${y}`}
                    fill="none"
                    stroke="url(#df-mr)"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    markerEnd="url(#df-arrow)"
                    initial={false}
                    animate={{ pathLength: flow ? 1 : 0, opacity: flow ? 1 : 0 }}
                    transition={{ duration: dur, ease, delay: flow ? 0.6 + i * 0.12 : 0 }}
                    style={{ filter: 'drop-shadow(0 0 5px rgb(56 189 248 / 0.7))' }}
                  />
                )}
                {/* travelling light along the live connectors */}
                {flow && !reduce && !muted && (
                  <>
                    <circle r={3} fill="#e0e7ff" style={{ filter: 'drop-shadow(0 0 5px #8b5cf6)' }}>
                      <animateMotion dur="2.6s" begin={`${1.0 + i * 0.35}s`} repeatCount="indefinite" path={`M ${xL1} ${y} L ${xM0} ${y}`} />
                    </circle>
                    {d.vp && (
                      <circle r={3} fill="#e0f2fe" style={{ filter: 'drop-shadow(0 0 5px #38bdf8)' }}>
                        <animateMotion dur="2.6s" begin={`${1.5 + i * 0.35}s`} repeatCount="indefinite" path={`M ${xM1} ${y} L ${xR0} ${y}`} />
                      </circle>
                    )}
                  </>
                )}
              </g>
            )
          })}

          {/* principle rail: d4 shapes all three propositions */}
          <motion.path
            d={`M ${xM1} ${ys[3]} L ${xBus} ${ys[3]} L ${xBus} ${ys[0]}`}
            fill="none"
            stroke={SOFT}
            strokeWidth={2.2}
            strokeDasharray="2 6"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: flow ? 1 : 0, opacity: flow ? 1 : 0 }}
            transition={{ duration: dur * 1.3, ease, delay: flow ? 1.0 : 0 }}
            style={{ filter: 'drop-shadow(0 0 5px rgb(167 139 250 / 0.9))' }}
          />
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx={xBus} cy={ys[i]} r={4.5} fill={SOFT} initial={false} animate={{ opacity: flow ? 1 : 0, scale: flow ? 1 : 0 }} transition={{ duration: 0.4, ease, delay: flow ? 1.5 + i * 0.1 : 0 }} style={{ transformOrigin: `${xBus}px ${ys[i]}px`, filter: 'drop-shadow(0 0 5px rgb(167 139 250))' }} />
          ))}
        </svg>
      )}

      {/* column 1: insight + evidence */}
      <motion.div
        className="absolute left-0 top-0 flex h-full flex-col"
        initial={false}
        animate={{ width: flow ? `${COL.l1 * 100}%` : '100%' }}
        transition={{ duration: reduce ? 0 : 0.8, ease }}
      >
        <ColHead tone="blue" label="Insight + evidence" tag />
        <div className="grid min-h-0 flex-1 grid-rows-5 gap-2">
          {productDecisions.map((d) => (
            <InsightCard key={d.id} d={d} narrow={flow} />
          ))}
        </div>
      </motion.div>

      {/* column 2: product decision */}
      <motion.div
        className="absolute top-0 flex h-full flex-col"
        style={{ left: `${COL.m0 * 100}%`, width: `${(COL.m1 - COL.m0) * 100}%` }}
        initial={false}
        animate={{ opacity: flow ? 1 : 0 }}
        transition={{ duration: 0.5, ease, delay: flow ? 0.2 : 0 }}
        aria-hidden={!flow}
      >
        <ColHead tone="violet" label="Product decision" />
        <div className="grid min-h-0 flex-1 grid-rows-5 gap-2">
          {productDecisions.map((d, i) => (
            <DecisionCard key={d.id} d={d} i={i} flow={flow} />
          ))}
        </div>
      </motion.div>

      {/* column 3: value propositions */}
      <motion.div
        className="absolute top-0 flex h-full flex-col"
        style={{ left: `${COL.r0 * 100}%`, width: `${(1 - COL.r0) * 100}%` }}
        initial={false}
        animate={{ opacity: flow ? 1 : 0 }}
        transition={{ duration: 0.5, ease, delay: flow ? 0.5 : 0 }}
        aria-hidden={!flow}
      >
        <ColHead tone="cyan" label="Value proposition" />
        <div className="grid min-h-0 flex-1 grid-rows-5 gap-2">
          <motion.div
            className="row-span-3 grid grid-rows-3 gap-2 rounded-2xl border border-dashed border-violet/60 bg-violet/[0.05] p-1.5"
            initial={false}
            animate={{ boxShadow: flow ? '0 0 40px -8px rgba(139,92,246,0.55)' : '0 0 0 0 rgba(139,92,246,0)' }}
            transition={{ duration: 0.8, ease, delay: flow ? 1.4 : 0 }}
          >
            {valueProps.map((v, i) => {
              const Icon = vpIcon[v.id]
              return (
                <motion.div
                  key={v.id}
                  className="flex items-center gap-3 rounded-xl border border-sky-300/40 bg-navy/90 px-3"
                  initial={false}
                  animate={{ opacity: flow ? 1 : 0, scale: flow ? 1 : 0.94 }}
                  transition={{ duration: 0.6, ease, delay: flow ? 0.7 + i * 0.12 : 0 }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan/15 text-cyan">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="num block text-xs text-dim">{v.n}</span>
                    <span className="block text-[clamp(1.05rem,1.45vw,1.35rem)] font-semibold leading-tight text-snow">{v.title}</span>
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/50 bg-violet/10 px-3.5 py-1.5 text-[15px] text-violet-soft">
              <ArrowUp size={15} aria-hidden /> Principle: shapes all three
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-line px-3.5 py-1.5 text-[15px] text-dim">Deprioritised: not a core promise</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ColHead({ tone, label, tag }: { tone: 'blue' | 'violet' | 'cyan'; label: string; tag?: boolean }) {
  const c = tone === 'blue' ? 'text-ev-observed' : tone === 'violet' ? 'text-violet-soft' : 'text-cyan'
  return (
    <div className={`mb-2 flex h-6 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] ${c}`}>
      {label}
      {tag && <span className="rounded-full border border-ev-observed/40 bg-ev-observed/10 px-2 py-px text-[10px]">Observed</span>}
    </div>
  )
}

function InsightCard({ d, narrow }: { d: ProductDecision; narrow: boolean }) {
  const muted = d.deprioritised
  return (
    <div className={`relative flex min-h-0 items-center gap-4 overflow-hidden rounded-2xl border px-4 ${muted ? 'border-dashed border-line bg-navy/40' : 'border-ev-observed/40 bg-navy/80'}`}>
      <div className={`shrink-0 transition-[width] duration-700 ${narrow ? 'w-[68px]' : 'w-[150px]'}`}>
        <div className={`flex items-baseline gap-1.5 leading-none transition-[font-size] duration-700 ${narrow ? 'text-[1.9rem]' : 'text-[clamp(2.6rem,4.2vw,3.8rem)]'}`}>
          <span className={`num font-semibold ${muted ? 'text-silver' : 'glow-num text-snow'}`}>{d.stat.value}</span>
        </div>
        <div className={`num mt-0.5 text-silver transition-[font-size] duration-700 ${narrow ? 'text-[13px]' : 'text-[clamp(1rem,1.3vw,1.2rem)]'}`}>of {d.stat.of}</div>
      </div>
      <div className="min-w-0">
        <div className={`font-semibold leading-tight ${muted ? 'text-silver' : 'text-snow'} ${narrow ? 'text-[clamp(1rem,1.35vw,1.2rem)]' : 'text-[clamp(1.2rem,1.9vw,1.7rem)]'}`}>{d.insight}</div>
        <motion.div initial={false} animate={{ opacity: narrow ? 0 : 1, height: narrow ? 0 : 'auto' }} transition={{ duration: 0.4, ease }} className="overflow-hidden" aria-hidden={narrow}>
          <p className="mt-1 text-[clamp(0.95rem,1.25vw,1.15rem)] leading-snug text-silver">
            {d.statLabel}
            {d.detail ? <span className="text-dim"> · {d.detail}</span> : null}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function DecisionCard({ d, i, flow }: { d: ProductDecision; i: number; flow: boolean }) {
  const muted = d.deprioritised
  const principle = d.vp === null && !muted
  return (
    <motion.div
      data-mid-row
      className={`flex min-h-0 items-center rounded-2xl border px-4 ${muted ? 'border-dashed border-line bg-navy/40' : principle ? 'border-violet/70 bg-violet/[0.12]' : 'border-violet/45 bg-violet/[0.08]'}`}
      initial={false}
      animate={{ opacity: flow ? (muted ? 0.6 : 1) : 0, x: flow ? 0 : -16 }}
      transition={{ duration: 0.6, ease, delay: flow ? 0.35 + i * 0.12 : 0 }}
      style={principle ? { boxShadow: '0 0 30px -10px rgba(139,92,246,0.7)' } : undefined}
    >
      <p className={`leading-snug ${muted ? 'text-silver' : 'text-snow'} text-[clamp(1rem,1.38vw,1.28rem)] ${muted ? '' : 'font-medium'}`}>{d.decision}</p>
    </motion.div>
  )
}
