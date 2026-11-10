import { AnimatePresence, motion } from 'framer-motion'
import { FlaskConical, MousePointerClick, Scale, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Expandable, Kicker, Reveal, SourceNote, SplitHeadline, Stage, StatusPill, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { risks, statusMeta, type Status } from '../data/strategy'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'risks')!

/** Node positions on the constellation (percent of the square canvas). */
const positions: Record<string, { x: number; y: number }> = {
  wtp: { x: 22, y: 22 },
  data: { x: 80, y: 26 },
  retention: { x: 76, y: 80 },
  economics: { x: 20, y: 76 },
}

const statusOrder: Status[] = ['supported', 'partial', 'untested', 'contradicted']

/** CHAPTER 11 — The biggest risks, as an honest evidence constellation. */
export default function Ch11Risks({ mode, step }: ChapterProps) {
  const [selected, setSelected] = useState<string | null>(step >= 1 ? 'wtp' : null)

  // Step 1 auto-opens willingness to pay; stepping back closes the panel.
  useEffect(() => {
    setSelected(step >= 1 ? 'wtp' : null)
  }, [step])

  const risk = risks.find((r) => r.id === selected) ?? null

  return (
    <Stage mode={mode}>
      <div className="max-w-5xl">
        <Reveal>
          <Kicker>
            <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle} · {meta.title}
          </Kicker>
        </Reveal>
        <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
          <SplitHeadline text="A compelling idea is not the same as a" delay={0.08} />{' '}
          <span className="font-serif font-normal italic text-gradient-warm">
            <SplitHeadline text="validated business." delay={0.4} />
          </span>
        </h2>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:mt-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        {/* Constellation */}
        <div>
          <Constellation selected={selected} onSelect={setSelected} />
          <Legend />
        </div>

        {/* Detail panel */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            {risk ? (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease }}
              >
                <RiskDetail risk={risk} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="glass flex h-full min-h-[420px] flex-col justify-center rounded-2xl p-8"
              >
                <MousePointerClick className="text-violet-soft" size={28} />
                <p className="mt-4 text-2xl font-semibold tracking-tight">Four assumptions the business depends on.</p>
                <p className="mt-3 max-w-md text-lg text-silver">
                  Select a node to see the assumption, the evidence on both sides, the next experiment and the decision criterion.
                </p>
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-dim">None is rated validated.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {mode === 'explore' && (
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {risks.map((r) => (
            <Expandable key={r.id} title={`Risk ${r.n} · ${r.title} — full detail`}>
              <RiskBody risk={r} />
            </Expandable>
          ))}
          <SourceNote className="md:col-span-2">
            Evidence drawn from the team’s New Venture Creation report (R1) and financial workbook (R2). Status ratings are the team’s current assessment of
            evidence, not outcomes of completed experiments. Decision criteria are provisional (R6).
          </SourceNote>
        </div>
      )}
    </Stage>
  )
}

function Constellation({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(100%,48vh)] lg:max-w-[min(100%,50vh)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="risk-link" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8066ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3de0ea" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="risk-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8066ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8066ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* orbit rings */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgb(156 169 188 / 0.18)"
          strokeWidth="0.25"
          strokeDasharray="0.8 1.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        <circle cx="50" cy="50" r="24" fill="none" stroke="rgb(156 169 188 / 0.1)" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="16" fill="url(#risk-core)" />
        {/* ring of links between neighbouring risks */}
        {risks.map((r, i) => {
          const a = positions[r.id]
          const b = positions[risks[(i + 1) % risks.length].id]
          return (
            <motion.line
              key={`ring-${r.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgb(183 168 255 / 0.16)"
              strokeWidth="0.25"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease }}
            />
          )
        })}
        {/* spokes from Orbit to each risk */}
        {risks.map((r, i) => {
          const p = positions[r.id]
          const active = selected === r.id
          return (
            <motion.line
              key={`spoke-${r.id}`}
              x1={50}
              y1={50}
              x2={p.x}
              y2={p.y}
              stroke="url(#risk-link)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: active ? 1 : selected ? 0.25 : 0.55, strokeWidth: active ? 0.7 : 0.35 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease }}
            />
          )
        })}
      </svg>

      {/* centre node */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="grid h-[5.2rem] w-[5.2rem] place-items-center rounded-full border border-violet/40 bg-navy/80 shadow-[0_0_60px_-10px_rgba(128,102,255,0.8)]">
          <img src="/brand/orbit-logo.webp" alt="" className="h-11 w-11 select-none" draggable={false} />
        </div>
        <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-silver">Orbit</span>
      </div>

      {/* risk nodes */}
      {risks.map((r, i) => {
        const p = positions[r.id]
        const m = statusMeta[r.status]
        const active = selected === r.id
        return (
          <motion.button
            key={r.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(r.id)
            }}
            aria-pressed={active}
            aria-label={`Risk ${r.n}: ${r.title} — ${m.label}`}
            className="group absolute flex w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 + i * 0.12, ease }}
          >
            <span
              className="relative grid h-14 w-14 place-items-center rounded-full border-2 bg-ink/90 transition-all duration-300 group-hover:scale-110"
              style={{
                borderColor: m.color,
                boxShadow: active ? `0 0 0 6px color-mix(in srgb, ${m.color} 18%, transparent), 0 0 40px -4px ${m.color}` : `0 0 24px -8px ${m.color}`,
              }}
            >
              <span className="num text-lg font-semibold" style={{ color: m.color }}>
                {String(r.n).padStart(2, '0')}
              </span>
              {active && (
                <motion.span
                  layoutId="risk-ring"
                  className="absolute -inset-2.5 rounded-full border"
                  style={{ borderColor: `color-mix(in srgb, ${m.color} 50%, transparent)` }}
                  transition={{ duration: 0.45, ease }}
                />
              )}
            </span>
            <span className={`mt-2 text-[15px] font-semibold leading-tight transition-colors sm:text-base ${active ? 'text-snow' : 'text-silver group-hover:text-snow'}`}>
              {r.title}
            </span>
            <span className="mt-0.5 text-[12px] font-medium" style={{ color: m.color }}>
              {m.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {statusOrder.map((s) => (
        <StatusPill key={s} status={s} />
      ))}
      <span className="w-full text-center font-mono text-[11px] text-dim">Evidence status legend · no assumption is labelled “validated”</span>
    </div>
  )
}

type Risk = (typeof risks)[number]

function RiskDetail({ risk }: { risk: Risk }) {
  return (
    <div className="glass rounded-2xl p-6 lg:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="num text-sm text-dim">RISK {String(risk.n).padStart(2, '0')}</span>
        <StatusPill status={risk.status} />
        <span className="text-sm text-silver">{risk.statusText}</span>
      </div>
      <h3 className="mt-3 text-[clamp(1.4rem,2vw,2rem)] font-semibold leading-tight tracking-tight">{risk.question}</h3>
      <RiskBody risk={risk} />
    </div>
  )
}

function RiskBody({ risk }: { risk: Risk }) {
  return (
    <div className="mt-4 space-y-4 text-base leading-snug">
      <div>
        <div className="t-kicker !text-[10.5px] !text-silver">Assumption</div>
        <p className="mt-1 text-snow">{risk.assumption}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <EvidenceList icon={<ThumbsUp size={14} />} title="Evidence supporting" items={risk.evidenceFor} color="var(--color-st-supported)" />
        <EvidenceList icon={<ThumbsDown size={14} />} title="Evidence against" items={risk.evidenceAgainst} color="var(--color-st-contradicted)" />
      </div>
      <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
        <div className="flex gap-3">
          <FlaskConical size={18} className="mt-0.5 shrink-0 text-cyan" />
          <div>
            <div className="t-kicker !text-[10.5px] !text-cyan">Next experiment</div>
            <p className="mt-1 text-[15px] text-silver">{risk.experiment}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Scale size={18} className="mt-0.5 shrink-0 text-peach" />
          <div>
            <div className="t-kicker !text-[10.5px] !text-peach">Decision criterion</div>
            <p className="mt-1 text-[15px] text-silver">{risk.criterion}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EvidenceList({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ color }}>
        {icon} {title}
      </div>
      <ul className="mt-1.5 space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-[15px] text-silver">
            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
