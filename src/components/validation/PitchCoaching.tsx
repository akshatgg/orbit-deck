import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { coachingChallenges, versionComparison } from '../../data/coaching'
import { coachingShort } from '../../data/validationPresent'
import { SplitHeadline, TiltCard, ease } from '../ui'

/** One spotlighted question: HUGE serif, then Challenge → Decision as two short lines. */
export function QuestionRoom({ index }: { index: number }) {
  const q = coachingChallenges[index]
  const s = coachingShort[index]
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute -inset-x-16 -inset-y-10" style={{ background: 'radial-gradient(60% 70% at 38% 40%, rgb(196 181 253 / 0.16), transparent 70%)' }} />
      <span aria-hidden className="num pointer-events-none absolute -right-2 -top-8 select-none font-serif text-[clamp(9rem,22vw,20rem)] italic leading-none text-snow/[0.05]">
        {index + 1}
      </span>
      <div className="relative">
        <div className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">
          <span className="h-px w-8 bg-violet-soft/60" /> Q{index + 1} / 5
        </div>
        <h3 className="max-w-[18ch] font-serif text-[clamp(2.2rem,4.7vw,4.9rem)] italic leading-[1.04] text-snow sm:max-w-[22ch]" style={{ textShadow: '0 0 60px rgb(196 181 253 / 0.35)' }}>
          <SplitHeadline text={`“${q.question}”`} />
        </h3>
        <motion.div className="mt-7 grid max-w-3xl gap-2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.55 }}>
          <div className="flex items-baseline gap-4 border-l-2 border-amber pl-4">
            <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-amber">Challenge</span>
            <span className="text-[clamp(1.1rem,1.65vw,1.6rem)] leading-snug text-snow">{s.challenge}</span>
          </div>
          <ArrowDown size={16} className="ml-1 text-dim" />
          <div className="flex items-baseline gap-4 border-l-2 border-violet pl-4">
            <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Decision</span>
            <span className="text-[clamp(1.1rem,1.65vw,1.6rem)] leading-snug text-snow">{s.decision}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/** Five glowing orbs, one per question. `active` = -1 when none is selected. Clickable. */
export function QuestionOrbs({ active, onPick, large = false }: { active: number; onPick: (i: number) => void; large?: boolean }) {
  return (
    <div role="list" aria-label="Coaching questions" className={`relative grid grid-cols-5 ${large ? 'gap-2' : 'mx-auto max-w-xl gap-1'}`}>
      <div aria-hidden className={`absolute left-[10%] right-[10%] border-t border-dashed border-silver/30 ${large ? 'top-[2.25rem]' : 'top-[1rem]'}`} />
      {coachingShort.map((c, i) => {
        const on = i === active
        return (
          <button
            key={c.id}
            type="button"
            role="listitem"
            aria-pressed={on}
            aria-label={`Question ${i + 1}: ${coachingChallenges[i].question}`}
            onClick={(e) => {
              e.stopPropagation()
              onPick(i + 1)
            }}
            className="group relative flex flex-col items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
          >
            <span
              className={`num grid place-items-center rounded-full border transition-all duration-300 ${large ? 'h-[4.5rem] w-[4.5rem] text-3xl' : 'h-8 w-8 text-sm'} ${on || large ? 'border-violet-soft text-snow' : 'border-line text-dim group-hover:border-silver group-hover:text-snow'}`}
              style={{
                background: on || large ? 'radial-gradient(circle at 35% 30%, rgb(196 181 253 / 0.45), rgb(139 92 246 / 0.12))' : '#080d1a',
                boxShadow: on || large ? '0 0 34px 2px rgb(167 139 250 / 0.5)' : 'none',
              }}
            >
              {i + 1}
            </span>
            {large && <span className="text-center text-[clamp(0.95rem,1.25vw,1.2rem)] font-medium leading-tight text-snow">{c.tag}</span>}
          </button>
        )
      })}
    </div>
  )
}

/** Earlier → refined proposition as a before/after morph (earlier recedes, refined grows out of it). */
export function PropositionMorph() {
  const reduce = useReducedMotion()
  const { earlier, refined } = versionComparison
  return (
    <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1.25fr]">
      <motion.div className="rounded-2xl border border-dashed border-silver/40 p-6" initial={reduce ? false : { opacity: 1, scale: 1.06 }} animate={{ opacity: 0.6, scale: 0.97 }} transition={{ duration: 1.1, ease, delay: 0.25 }}>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{earlier.label}</div>
        <p className="mt-2 text-[clamp(1.2rem,1.9vw,1.9rem)] leading-snug text-silver">{earlier.text}</p>
      </motion.div>
      <motion.div className="flex items-center justify-center" initial={reduce ? false : { opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.6, ease, delay: 0.7 }}>
        <span className="block h-[3px] w-16 rounded-full lg:w-20" style={{ background: 'linear-gradient(90deg, rgb(148 163 184 / 0.3), #a78bfa)', boxShadow: '0 0 20px rgb(167 139 250 / 0.8)' }} />
      </motion.div>
      <motion.div initial={reduce ? false : { opacity: 0, x: -50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.9, ease, delay: 0.7 }}>
        <TiltCard glow className="p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">{refined.label}</div>
          <p className="mt-2 text-[clamp(1.4rem,2.4vw,2.4rem)] font-semibold leading-tight text-snow">{refined.text}</p>
        </TiltCard>
      </motion.div>
    </div>
  )
}
