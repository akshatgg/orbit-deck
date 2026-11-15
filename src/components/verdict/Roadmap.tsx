import { ArrowRight, GitBranch, Lock } from 'lucide-react'
import { EvidenceTag, Reveal } from '../ui'
import { externalBranch, type Phase } from '../../data/roadmap'

/** One phase of the gated roadmap. `compact` collapses it to a title + target strip. */
export function PhaseCard({ phase, show, compact }: { phase: Phase; show: boolean; compact: boolean }) {
  return (
    <Reveal show={show} className="flex h-full flex-col">
      <div className={`glass flex h-full flex-col rounded-2xl ${compact ? 'p-4' : 'p-5'}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="t-kicker">{phase.years}</span>
          <EvidenceTag label="modelled" />
        </div>
        <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-snow">{phase.title}</h3>

        <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-1">
          {phase.target.map((t) => (
            <div key={t.label}>
              <span className={`num font-semibold text-snow ${compact ? 'text-3xl' : 'text-4xl'}`}>{t.value}</span>
              <span className="ml-2 text-sm text-silver">{t.label}</span>
            </div>
          ))}
        </div>
        {phase.modelledNote && <p className="mt-1 text-sm text-ev-modelled">{phase.modelledNote}</p>}

        {!compact && (
          <ul className="mt-4 space-y-1.5 text-[15px] leading-snug text-silver">
            {phase.actions.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-silver" />
                {a}
              </li>
            ))}
          </ul>
        )}

        {phase.gate && !compact && (
          <div className="mt-auto pt-4">
            <div className="rounded-xl border border-dashed border-ev-proposed/60 bg-ev-proposed/5 p-3">
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ev-proposed">
                <Lock size={12} /> {phase.gate.title}
              </div>
              <p className="mt-1.5 text-xs text-dim">To unlock the next phase, we must show:</p>
              <ul className="mt-1 space-y-1 text-[13.5px] leading-snug text-snow">
                {phase.gate.mustProve.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ev-proposed" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

/** The separate, risk-bearing branch that follows Year 5. NOT shown as the automatic next step. */
export function ExternalBranch({ show, compact = false }: { show: boolean; compact?: boolean }) {
  const b = externalBranch
  return (
    <Reveal show={show}>
      <div className="relative">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ev-proposed">
            <GitBranch size={14} /> {b.when} · a new branch, not the next step
          </span>
          <EvidenceTag label="unresolved" text="Own evidence required" />
        </div>
        <div className="rounded-2xl border border-dashed border-ev-proposed/50 bg-ev-proposed/[0.04] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1.25fr] lg:gap-8">
            <div>
              <h3 className="t-h2">{b.title}</h3>
              <p className="mt-2 text-base leading-snug text-snow">{b.idea}</p>
              <p className="mt-3 flex gap-2 text-[15px] leading-snug text-silver">
                <ArrowRight size={16} className="mt-0.5 shrink-0 text-ev-proposed" />
                {b.condition}
              </p>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ev-observed">Potential advantages inherited</div>
              <ul className="mt-2 space-y-1.5 text-[15px] leading-snug text-snow">
                {b.advantages.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ev-observed" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-red">New risks</div>
              <ul className={`mt-2 grid gap-x-4 gap-y-1.5 text-[15px] leading-snug text-snow ${compact ? 'sm:grid-cols-2' : ''}`}>
                {b.risks.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-red" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
            <p className="text-[15px] leading-snug text-snow">
              <strong className="font-semibold">{b.notIncluded}</strong>
            </p>
            <p className="font-serif text-xl italic leading-snug text-violet-soft">“{b.independence}”</p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ---------- Pass 2: Present-mode glowing path ---------- */

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Accent, GlowNumber, ease } from '../ui'
import { branchChips, phases } from '../../data/roadmap'

const yearLabel = ['1', '2', '3', '4–5']

/** Roadmap as a glowing path: year nodes, lock icons for gates (criteria on hover / click). */
export function RoadmapPath({ s, compact }: { s: number; compact: boolean }) {
  const [hov, setHov] = useState<number | null>(null)
  const [sel, setSel] = useState<number | null>(null)
  const open = hov ?? sel
  const reduce = useReducedMotion()
  const progress = Math.min(s, 3) / 3
  return (
    <div className="relative">
      {/* track + glowing progress */}
      <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-[3px] lg:block" aria-hidden>
        <div className="absolute inset-0 rounded-full bg-white/10" />
        <motion.div
          className="absolute inset-0 origin-left rounded-full"
          style={{ background: 'linear-gradient(90deg,#8b5cf6,#6d8bfa,#38bdf8)', boxShadow: '0 0 14px 2px rgb(139 92 246 / 0.7), 0 0 34px 6px rgb(56 189 248 / 0.3)' }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.9, ease }}
        />
      </div>

      <div className="grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((p, i) => {
          const show = s >= p.step
          const current = s === p.step
          return (
            <Reveal key={p.id} show={show} className="flex flex-col items-center text-center">
              <div className="relative flex h-[44px] w-[44px] items-center justify-center">
                {current && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-violet/40" aria-hidden />}
                <span
                  className="num relative flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 border-violet bg-ink text-sm font-semibold text-snow"
                  style={{ boxShadow: '0 0 22px rgb(139 92 246 / 0.7), inset 0 0 12px rgb(139 92 246 / 0.35)' }}
                >
                  {yearLabel[i]}
                </span>
              </div>
              <div className="t-kicker mt-3">{p.years}</div>
              <h3 className={`mt-1 font-semibold leading-tight tracking-tight text-snow ${compact ? 'text-lg' : 'text-xl'}`}>{p.title}</h3>
              <div className="mt-2">
                <GlowNumber
                  value={p.big.value}
                  className={compact ? '[&_.glow-num]:text-5xl' : '[&_.glow-num]:text-6xl'}
                  suffix={<span className="text-sm text-silver">{p.big.label}</span>}
                />
              </div>
              <div className="mt-1.5">
                <EvidenceTag label="modelled" />
              </div>
              {!compact && <p className="mt-2 max-w-[17rem] text-[15px] leading-snug text-silver">{p.short}</p>}
            </Reveal>
          )
        })}
      </div>

      {/* gate locks sit on the path between phases */}
      {phases.slice(0, -1).map((p, i) => {
        const show = s >= p.step
        const isOpen = open === i && show
        return (
          <div key={p.id} className="absolute top-[4px] z-20 hidden -translate-x-1/2 lg:block" style={{ left: `${(i + 1) * 25}%` }}>
            <Reveal show={show} delay={0.3}>
              <button
                type="button"
                aria-label={`${p.gate?.title ?? 'Gate'} — show criteria`}
                aria-expanded={isOpen}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(sel === i ? null : i)
                }}
                className="lift flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-ev-proposed/80 bg-ink text-ev-proposed"
                style={{ boxShadow: '0 0 16px rgb(139 92 246 / 0.45)' }}
              >
                <Lock size={15} />
              </button>
            </Reveal>
            {isOpen && p.gate && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease }}
                className="glass-strong absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-xl p-3.5 text-left"
              >
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ev-proposed">
                  <Lock size={12} /> {p.gate.title}
                </div>
                <ul className="mt-2 space-y-1 text-[14px] leading-snug text-snow">
                  {p.gate.mustProve.map((m) => (
                    <li key={m} className="flex gap-2">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ev-proposed" />
                      {m}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <EvidenceTag label="proposed" text="Proposed gate" />
                </div>
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const chip = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[14px] leading-tight text-snow'

/** Present-mode branch: a separate dashed orbit hanging off the Year 4–5 node. */
export function BranchPresent({ show }: { show: boolean }) {
  const b = branchChips
  const reduce = useReducedMotion()
  // Mount hidden, then reveal, so the branch rises in when the step arrives.
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 60)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <Reveal show={show && on} className="relative mt-7">
      {/* dashed connector from the Year 4–5 node into the branch */}
      <div className="pointer-events-none absolute -top-7 hidden h-7 border-l-2 border-dashed border-ev-proposed/70 lg:block" style={{ left: '87.5%' }} aria-hidden />
      <span
        className="absolute -top-3.5 z-10 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-dashed border-ev-proposed bg-ink text-ev-proposed lg:flex"
        style={{ left: '87.5%', boxShadow: '0 0 14px rgb(139 92 246 / 0.5)' }}
        aria-hidden
      >
        <GitBranch size={14} />
      </span>
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-ev-proposed/50 bg-ev-proposed/[0.04] px-6 py-5 sm:px-8">
        {/* dashed orbit ellipses */}
        <motion.svg
          aria-hidden
          viewBox="0 0 400 200"
          className="pointer-events-none absolute -right-16 top-1/2 h-[260px] w-[520px] -translate-y-1/2 opacity-40"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
        >
          <ellipse cx="200" cy="100" rx="190" ry="80" fill="none" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="4 8" />
          <ellipse cx="200" cy="100" rx="130" ry="52" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 9" />
        </motion.svg>
        <div className="relative grid items-center gap-5 lg:grid-cols-[1.8fr_1fr] lg:gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ev-proposed">
                <GitBranch size={13} /> After Year 5 · a separate branch
              </span>
              <EvidenceTag label="unresolved" text="Own evidence required" />
            </div>
            <h3 className="t-h2 mt-2">{b.title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="w-[4.5rem] font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">Inherited</span>
              {b.advantages.map((a) => (
                <span key={a} className={`${chip} border-line bg-white/[0.04]`}>
                  <Check size={13} className="text-silver" /> {a}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="w-[4.5rem] font-mono text-[10.5px] uppercase tracking-[0.12em] text-red">New risks</span>
              {b.risks.map((r) => (
                <span key={r} className={`${chip} border-red/40 bg-red/[0.07]`}>
                  <X size={13} className="text-red" /> {r}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-[clamp(1.6rem,2.8vw,2.9rem)] leading-[1.1]">
              <Accent>{b.line}</Accent>
            </p>
            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">Not in the five-year forecast</p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
