import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
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
