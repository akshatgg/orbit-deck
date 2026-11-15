import { motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { AssumptionShift } from '../../data/assumptionShifts'
import { EvidenceTag, ease } from '../ui'

const RED = 'var(--color-st-contradicted)'
const BLUE = 'var(--color-ev-observed)'
const VIOLET = 'var(--color-ev-proposed)'

function Block({ label, color, children, show, delay, tag, fresh }: { label: string; color: string; children: string; show: boolean; delay: number; tag?: boolean; fresh: boolean }) {
  return (
    <motion.div
      initial={fresh ? { opacity: 0, x: -10 } : false}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.55, ease, delay: show ? delay : 0 }}
      className="rounded-xl border-l-[3px] bg-white/[0.03] py-2 pl-3.5 pr-3"
      style={{ borderColor: color }}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color }}>
        {label}
        {tag && <EvidenceTag label="observed" />}
      </div>
      <p className="mt-1 text-[17px] leading-snug text-snow">{children}</p>
    </motion.div>
  )
}

/** Hypothesis → Evidence → Decision. Click to replay. `show` is the presenter gate. */
export function AssumptionCard({ card, show = true, animateIn = true, className = '' }: { card: AssumptionShift; show?: boolean; animateIn?: boolean; className?: string }) {
  const [run, setRun] = useState(0)
  const fresh = animateIn || run > 0
  return (
    <article className={`glass relative rounded-2xl p-4 ${className}`}
      aria-label={`Assumption ${card.n}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-dim">Assumption {card.n} of 5</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setRun((r) => r + 1)
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-silver hover:text-snow"
          aria-label={`Replay assumption ${card.n}`}
        >
          <RotateCcw size={12} /> Replay
        </button>
      </div>
      <div key={run} className="space-y-2">
        <Block label="Initial hypothesis · challenged" color={RED} show={show} delay={0} fresh={fresh}>
          {card.hypothesis}
        </Block>
        <Block label="Evidence" color={BLUE} show={show} delay={0.45} tag fresh={fresh}>
          {card.evidence}
        </Block>
        <Block label="Decision" color={VIOLET} show={show} delay={0.9} fresh={fresh}>
          {card.decision}
        </Block>
      </div>
    </article>
  )
}

/** Old belief with a crisp strike-through and a small "crumble" of the words once it lands. */
function StruckText({ text }: { text: string }) {
  const [struck, setStruck] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setStruck(true), 650)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <p className="text-[clamp(1.2rem,1.85vw,1.65rem)] font-medium leading-snug">
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={struck ? { opacity: 0.5, y: [0, -3, 2], rotate: (i % 2 ? 1 : -1) * 1.6, color: '#94a3b8' } : { opacity: 1, y: 0, rotate: 0, color: '#f8fafc' }}
          transition={{ duration: 0.45, ease, delay: struck ? i * 0.04 : 0 }}
          className={`inline-block ${struck ? 'line-through decoration-st-contradicted decoration-[3px]' : ''}`}
          style={{ marginRight: '0.28em' }}
        >
          {w}
        </motion.span>
      ))}
    </p>
  )
}

/** Present-mode card: three short lines — Believed ✕ / Evidence / Decision. Full wording stays in Explore. */
export function AssumptionCardShort({ card }: { card: AssumptionShift }) {
  const [run, setRun] = useState(0)
  return (
    <article className="glass relative rounded-2xl p-4 sm:p-5" aria-label={`Assumption ${card.n}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-dim">Assumption {card.n} of 5</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setRun((r) => r + 1)
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-silver hover:text-snow"
          aria-label={`Replay assumption ${card.n}`}
        >
          <RotateCcw size={12} /> Replay
        </button>
      </div>
      <div key={run} className="space-y-3">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease }} className="border-l-[3px] pl-4" style={{ borderColor: RED }}>
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: RED }}>
            Believed <X size={14} strokeWidth={3} aria-label="challenged" />
          </div>
          <StruckText text={card.p.believed} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease, delay: 1.15 }} className="border-l-[3px] pl-4" style={{ borderColor: BLUE }}>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: BLUE }}>
            Evidence <EvidenceTag label="observed" />
          </div>
          <p className="mt-0.5 text-[clamp(1.1rem,1.65vw,1.5rem)] leading-snug text-snow">{card.p.evidence}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease, delay: 1.7 }} className="border-l-[3px] pl-4" style={{ borderColor: VIOLET }}>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: VIOLET }}>Decision</div>
          <p className="mt-0.5 text-[clamp(1.2rem,1.8vw,1.65rem)] font-semibold leading-snug text-snow">{card.p.decision}</p>
        </motion.div>
      </div>
    </article>
  )
}
