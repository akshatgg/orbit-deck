import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { assumptions } from '../../data/assumptions'
import { pitchConfig } from '../../data/config'
import { evidenceStreams, walkthroughFindings, walkthroughMeasures, walkthroughStatus, walkthroughTask } from '../../data/walkthroughs'
import { streamKind, walkthroughShort as W } from '../../data/validationPresent'
import { Card, EvidenceTag, StatusPill, ease } from '../ui'

const HI = 'var(--color-cyan)'

/** Four evidence streams side by side; product walkthroughs are highlighted, the rest are dimmed context. */
export function StreamStrip({ compact = false }: { compact?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4" aria-label="Evidence streams">
      {evidenceStreams.map((s, i) => {
        const on = !!s.current
        return (
          <motion.li
            key={s.id}
            className="relative list-none rounded-2xl border px-4 py-3"
            style={on ? { borderColor: HI, background: 'color-mix(in srgb, var(--color-cyan) 12%, #080d1a)', boxShadow: '0 0 40px -6px rgb(56 189 248 / 0.55)' } : { borderColor: 'rgb(148 163 184 / 0.25)', borderStyle: 'dashed', background: 'rgb(8 13 26 / 0.45)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: on ? 1 : 0.72, y: 0 }}
            transition={{ duration: 0.5, ease, delay: i * 0.08 }}
          >
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: on ? HI : 'var(--color-dim)' }}>
              {streamKind[s.id]} evidence{on ? ' · this chapter' : ''}
            </div>
            <div className={`mt-1 font-semibold leading-tight ${on ? 'text-snow' : 'text-silver'} ${compact ? 'text-[clamp(1.05rem,1.4vw,1.4rem)]' : 'text-[clamp(1.15rem,1.55vw,1.55rem)]'}`}>
              {s.label}
              {s.n && <span className="num ml-2 text-[0.8em] font-normal text-dim">n = {s.n}</span>}
            </div>
            <div className={`mt-0.5 text-[15px] leading-snug ${on ? 'text-snow' : 'text-dim'}`}>{s.tests}</div>
          </motion.li>
        )
      })}
    </ul>
  )
}

export function TaskQuote({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  return (
    <Card glow className="p-6 sm:p-7">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: HI }}>
        {W.taskLabel}
      </div>
      <p className={`mt-3 font-serif italic leading-[1.15] text-snow ${size === 'lg' ? 'text-[clamp(1.6rem,2.6vw,2.7rem)]' : 'text-[clamp(1.35rem,2vw,2rem)]'}`}>“{walkthroughTask}”</p>
    </Card>
  )
}

export function MeasureChips() {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">{W.measuresLabel}</div>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {walkthroughMeasures.map((m, i) => (
          <motion.li key={m} className="list-none rounded-full border border-ev-observed/50 bg-ev-observed/10 px-4 py-1.5 text-[clamp(1rem,1.25vw,1.2rem)] text-snow" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease, delay: 0.4 + i * 0.07 }}>
            {m}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export function PrototypeLink({ className = '' }: { className?: string }) {
  if (!pitchConfig.prototypeUrl) return null
  return (
    <a
      href={pitchConfig.prototypeUrl}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 font-mono text-[12px] text-silver underline decoration-dim underline-offset-4 hover:text-snow focus-visible:outline-2 focus-visible:outline-violet ${className}`}
    >
      Try the real prototype <ExternalLink size={12} />
    </a>
  )
}

type Verified = { participants: number; unaidedCompletion: number; relevantEventFound: number; availabilityMatch: number; redirectReached: number; notes?: string }

/** Verified counts, rendered ONLY if the team has supplied them in config. Never invented. */
export function VerifiedResults() {
  const r = pitchConfig.verifiedPrototypeResults as Verified | null
  if (!r) return null
  const rows = [
    { l: 'Completed without help', n: r.unaidedCompletion },
    { l: 'Found a relevant event', n: r.relevantEventFound },
    { l: 'Event fits availability', n: r.availabilityMatch },
    { l: 'Reached the registration page', n: r.redirectReached },
  ]
  return (
    <div>
      <EvidenceTag label="observed" text="Verified walkthrough results" />
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {rows.map((x) => (
          <li key={x.l} className="list-none rounded-xl border border-ev-observed/40 bg-ev-observed/5 px-4 py-3">
            <div className="num text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none text-snow">
              {x.n} <span className="text-[0.55em] text-silver">of {r.participants}</span>
            </div>
            <div className="mt-1 text-[15px] leading-snug text-silver">{x.l}</div>
          </li>
        ))}
      </ul>
      {r.notes && <p className="mt-2 text-[15px] text-silver">{r.notes}</p>}
    </div>
  )
}

/** learned → changed rows from the report. Empty array renders nothing (see HonestState). */
export function FindingsRows() {
  if (walkthroughFindings.length === 0) return null
  return (
    <ul className="space-y-2.5">
      {walkthroughFindings.map((f, i) => (
        <motion.li key={i} className="list-none grid items-center gap-3 rounded-xl border border-line bg-navy/60 px-4 py-3 sm:grid-cols-[1fr_auto_1fr]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: i * 0.1 }}>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-st-supported">Learned</div>
            <div className="text-[clamp(1rem,1.3vw,1.3rem)] leading-snug text-snow">{f.learned}</div>
          </div>
          <ArrowRight className="hidden text-dim sm:block" size={20} />
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ev-proposed">Changed</div>
            <div className="text-[clamp(1rem,1.3vw,1.3rem)] leading-snug text-snow">{f.changed}</div>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

const a5 = assumptions.find((a) => a.id === 'A5')
const needPilot = assumptions.filter((a) => a.id === 'A6' || a.id === 'A7')

/** The honest state: A5 is PARTIAL; first use is not repeat use; A6/A7 need the pilot. */
export function HonestState() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <Card className="h-full border-amber/40 p-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="num rounded-md border border-line px-2 py-0.5 text-sm text-silver">{a5?.id ?? 'A5'}</span>
            <StatusPill status="inconclusive" />
            <span className="text-[15px] text-silver">{walkthroughStatus.status.replace(/^Partial: /, '').replace(/^./, (c) => c.toUpperCase())}</span>
          </div>
          <h3 className="mt-3 text-[clamp(1.5rem,2.3vw,2.3rem)] font-semibold leading-tight text-snow">{a5?.title ?? 'Students find value in Orbit'}</h3>
          <p className="mt-3 text-[clamp(1rem,1.3vw,1.3rem)] leading-snug text-silver">{walkthroughStatus.caveat}</p>
        </Card>
      </motion.div>
      <motion.div className="grid content-start gap-2.5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.15 }}>
        {needPilot.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border border-dashed border-silver/35 px-4 py-3">
            <span className="num rounded-md border border-line px-2 py-0.5 text-sm text-silver">{a.id}</span>
            <span className="flex-1 text-[clamp(1rem,1.3vw,1.25rem)] text-snow">{a.title}</span>
            <StatusPill status="untested" />
          </div>
        ))}
        <p className="px-1 font-mono text-[11.5px] uppercase tracking-[0.14em] text-violet-soft">{W.pilotNeeded}</p>
      </motion.div>
    </div>
  )
}

export function NoResultsNote() {
  if (pitchConfig.verifiedPrototypeResults) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      <EvidenceTag label="unresolved" text="No counts shown" />
      <span className="text-[15px] text-silver">Verified walkthrough results will be added when the team confirms them.</span>
    </div>
  )
}
