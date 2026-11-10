import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Building2, Check, GraduationCap, ServerCog } from 'lucide-react'
import { Badge, Expandable, Kicker, Reveal, SourceNote, SplitHeadline, Stage, StatusPill, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { valueProp } from '../data/strategy'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'value-prop')!
const { students, universities, it, caveat, exchange } = valueProp

const CYAN = '#3de0ea'
const PEACH = '#ffa36b'
const VIOLET = '#8066ff'
const BLUE = '#3b82f6'

/* ---------------- Customer cards ---------------- */

function CustomerCard({ side, compact = false }: { side: 'students' | 'universities'; compact?: boolean }) {
  const d = side === 'students' ? students : universities
  const color = side === 'students' ? CYAN : PEACH
  const Icon = side === 'students' ? GraduationCap : Building2
  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl border ${compact ? 'p-5' : 'p-6 lg:p-7'}`}
      style={{ borderColor: `color-mix(in srgb, ${color} 35%, transparent)`, background: `linear-gradient(160deg, color-mix(in srgb, ${color} 10%, transparent), rgba(16,23,42,0.65) 55%)` }}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ background: color, opacity: 0.18 }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}>
            <Icon size={24} />
          </span>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color }}>
              {d.role}
            </div>
            <div className="text-3xl font-semibold tracking-tight text-snow">{d.title}</div>
          </div>
        </div>
      </div>
      <ul className={`mt-5 flex flex-col ${compact ? 'gap-1.5' : 'gap-2.5'}`}>
        {d.jobs.map((j) => (
          <li key={j} className="flex items-start gap-2.5 text-base leading-snug text-snow/90 lg:text-lg">
            <Check size={18} className="mt-1 shrink-0" style={{ color }} />
            {j}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <span className="text-sm text-silver">Price</span>
        <span className="text-lg font-semibold text-snow">{side === 'students' ? d.price : 'Annual institutional subscription'}</span>
        {side === 'universities' && <Badge tone="amber">Hypothesis</Badge>}
      </div>
    </div>
  )
}

function ITCard({ show = true }: { show?: boolean }) {
  return (
    <Reveal show={show}>
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white/[0.025] px-5 py-4 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet/15 text-violet-soft">
            <ServerCog size={20} />
          </span>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">Third stakeholder · {it.role}</div>
            <div className="text-xl font-semibold text-snow">{it.title}</div>
          </div>
        </div>
        <div className="hidden h-10 w-px bg-line lg:block" />
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-silver">Influence</span>
          {it.influences.map((x, i) => (
            <motion.span
              key={x}
              initial={false}
              animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ delay: show ? 0.25 + i * 0.07 : 0, duration: 0.4, ease }}
              className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-sm text-lavender"
            >
              {x}
            </motion.span>
          ))}
        </div>
        <span className="text-sm text-dim lg:max-w-[14rem]">They don’t buy — but they can make or break implementation.</span>
      </div>
    </Reveal>
  )
}

function SplitView({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative grid gap-4 md:grid-cols-2 md:gap-6">
        <Reveal delay={0.2}>
          <CustomerCard side="students" />
        </Reveal>
        <Reveal delay={0.35}>
          <CustomerCard side="universities" />
        </Reveal>
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-line bg-ink shadow-[0_0_50px_-10px_rgba(128,102,255,0.8)]">
            <img src="/brand/orbit-logo.webp" alt="" className="h-9 w-9" />
          </div>
        </div>
      </div>
      <ITCard show={step >= 1} />
    </div>
  )
}

/* ---------------- Value-exchange loop ---------------- */

const nodeMeta = [
  { color: PEACH, sub: 'Annual fee — hypothesis' },
  { color: VIOLET, sub: 'Aggregated, personalised discovery' },
  { color: CYAN, sub: 'Free for students' },
  { color: BLUE, sub: 'e.g. saves & clicks — not attendance' },
  { color: PEACH, sub: 'Renew only if value is evidenced' },
]

const VW = 1000
const VH = 560
const RX = 370
const RY = 205
const pts = exchange.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / exchange.length
  return { x: VW / 2 + RX * Math.cos(a), y: VH / 2 + RY * Math.sin(a) }
})

function LoopDiagram({ show = true }: { show?: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[980px]" style={{ aspectRatio: `${VW} / ${VH}` }}>
      <style>{`@keyframes vp-flow { to { stroke-dashoffset: -64; } } .vp-flow { animation: vp-flow 2.4s linear infinite; }`}</style>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="vp-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#8066ff" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3de0ea" />
          </linearGradient>
          <marker id="vp-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#b7a8ff" />
          </marker>
        </defs>
        <ellipse cx={VW / 2} cy={VH / 2} rx={RX} ry={RY} fill="none" stroke="rgba(156,169,188,0.12)" strokeWidth="1" />
        {pts.map((p, i) => {
          const q = pts[(i + 1) % pts.length]
          return (
            <motion.path
              key={i}
              d={`M ${p.x} ${p.y} A ${RX} ${RY} 0 0 1 ${q.x} ${q.y}`}
              fill="none"
              stroke="url(#vp-grad)"
              strokeWidth="2.5"
              markerEnd="url(#vp-arrow)"
              initial={false}
              animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: show ? 0.3 + i * 0.35 : 0 }}
            />
          )
        })}
        <ellipse className="vp-flow" cx={VW / 2} cy={VH / 2} rx={RX} ry={RY} fill="none" stroke="#d6c8ff" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="4 60" strokeLinecap="round" />
      </svg>

      {/* centre */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        <img src="/brand/orbit-logo.webp" alt="" className="h-14 w-14 drop-shadow-[0_0_30px_rgba(128,102,255,0.8)]" />
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-silver">Hypothesised</div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver">value loop</div>
      </div>

      {exchange.map((label, i) => {
        const p = pts[i]
        const m = nodeMeta[i]
        return (
          <motion.div
            key={label}
            className="absolute w-[22%] min-w-[150px] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(p.x / VW) * 100}%`, top: `${(p.y / VH) * 100}%` }}
            initial={false}
            animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5, ease, delay: show ? 0.15 + i * 0.35 : 0 }}
          >
            <div className="rounded-2xl border bg-ink/90 px-3.5 py-2.5 text-center backdrop-blur" style={{ borderColor: `color-mix(in srgb, ${m.color} 50%, transparent)`, boxShadow: `0 0 40px -18px ${m.color}` }}>
              <div className="num text-[11px]" style={{ color: m.color }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="text-base font-semibold leading-tight text-snow lg:text-lg">{label}</div>
              <div className="mt-0.5 text-xs leading-snug text-silver lg:text-sm">{m.sub}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function Caveat({ show = true }: { show?: boolean }) {
  return (
    <Reveal show={show} delay={show ? 2 : 0}>
      <div className="flex flex-col gap-2 rounded-2xl border border-amber/40 bg-amber/[0.07] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <AlertTriangle size={20} className="shrink-0 text-amber" />
          <StatusPill status="untested" />
        </div>
        <div className="text-lg font-semibold leading-snug text-snow lg:text-xl">{caveat}</div>
        <div className="text-sm text-silver">Improved attendance or retention has not been demonstrated. The loop is what a pilot must test.</div>
      </div>
    </Reveal>
  )
}

function LoopView({ show = true }: { show?: boolean }) {
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[0.42fr_1fr] lg:gap-10">
      <div className="flex flex-col gap-3">
        {[
          { c: CYAN, t: students.title, r: `${students.role} · ${students.price}` },
          { c: PEACH, t: universities.title, r: `${universities.role} · subscription (hypothesis)` },
          { c: VIOLET, t: it.title, r: `${it.role} · feasibility` },
        ].map((s) => (
          <div key={s.t} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.c, boxShadow: `0 0 12px ${s.c}` }} />
            <div>
              <div className="text-base font-semibold text-snow">{s.t}</div>
              <div className="text-sm text-silver">{s.r}</div>
            </div>
          </div>
        ))}
        <div className="mt-2 hidden lg:block">
          <Caveat show={show} />
        </div>
      </div>
      <div>
        <LoopDiagram show={show} />
        <div className="mt-4 lg:hidden">
          <Caveat show={show} />
        </div>
      </div>
    </div>
  )
}

/* ---------------- Chapter ---------------- */

function Title({ small }: { small: boolean }) {
  return (
    <div>
      <Kicker>
        <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle}
      </Kicker>
      <h2 className={`${small ? 't-h2' : 't-h1'} mt-3 transition-all`}>
        <SplitHeadline text="One experience." delay={0.05} />{' '}
        <span className="font-serif font-normal italic text-gradient-warm">
          <SplitHeadline text="Two different customers." delay={0.2} />
        </span>
      </h2>
    </div>
  )
}

export default function Ch06ValueProp({ mode, step }: ChapterProps) {
  if (mode === 'explore')
    return (
      <Stage mode="explore">
        <Title small={false} />
        <div className="mt-10">
          <SplitView step={2} />
        </div>
        <div className="mt-16">
          <Kicker className="mb-6">Value exchange</Kicker>
          <LoopView />
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Expandable title="Why universities, not students, are the hypothesised payer">
            Students are the users and the product stays free for them. The proposed business model asks a university department to pay an annual institutional
            subscription. No budget owner, purchase commitment or paid pilot exists yet — this is a hypothesis to be tested.
          </Expandable>
          <Expandable title="What “measurable engagement evidence” can and cannot show">
            Orbit can measure discovery behaviour such as saves and click-throughs to original event pages. Clicks are not attendance, and neither proves improved
            retention or wellbeing. Any renewal case would rest on evidence agreed with the institution during a pilot.
          </Expandable>
        </div>
        <SourceNote className="mt-6">Source: R1 — Orbit team New Venture Creation report (value proposition and business model). Pricing is a hypothesis; see Chapter 07.</SourceNote>
      </Stage>
    )

  return (
    <Stage mode={mode}>
      <Title small={step >= 2} />
      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {step < 2 ? (
            <motion.div key="split" exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }} transition={{ duration: 0.4, ease }}>
              <SplitView step={step} />
            </motion.div>
          ) : (
            <motion.div key="loop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
              <LoopView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SourceNote className="mt-4">Source: R1 — Orbit team report. University pricing is a hypothesis; no institutional purchase commitment exists.</SourceNote>
    </Stage>
  )
}
