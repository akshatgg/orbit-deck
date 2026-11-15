import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'
import { researchQuestions } from '../../data/research'
import { questionChips, questionWhyTag, reasonChips } from '../../data/discoveryShort'
import { ease } from '../ui'

/** Same editorial mapping as QuestionExplorer: which of the four reasons each question serves. */
const QUESTION_WHY: number[][] = [[0, 1], [1], [2], [1], [3], [2]]

/** Present-mode question carousel: one question large, the rest as chips; "why" as a one-line tag. */
export function QuestionDeck({ sel, onSel, showWhy }: { sel: number; onSel: (i: number) => void; showWhy: boolean }) {
  const n = researchQuestions.length
  const step = (d: number) => onSel((sel + d + n) % n)
  return (
    <div>
      <div className="glass glow-ring relative rounded-3xl px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between">
          <span className="t-kicker !text-[11px]">Question {sel + 1} of {n}</span>
          <span className="flex gap-2">
            <button type="button" aria-label="Previous question" onClick={(e) => { e.stopPropagation(); step(-1) }} className="rounded-full border border-line p-2 text-silver hover:text-snow"><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Next question" onClick={(e) => { e.stopPropagation(); step(1) }} className="rounded-full border border-line p-2 text-silver hover:text-snow"><ChevronRight size={18} /></button>
          </span>
        </div>
        <div className="mt-3 min-h-[clamp(7.5rem,18vh,11rem)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={sel}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease }}
              className="font-serif text-[clamp(2rem,4.1vw,3.9rem)] italic leading-[1.06] text-snow"
            >
              {researchQuestions[sel]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-3 min-h-[2.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            {showWhy && (
              <motion.div
                key={sel}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-ev-observed/50 bg-ev-observed/10 px-4 py-1.5 text-base text-snow sm:text-lg"
              >
                <Lightbulb size={16} className="text-ev-observed" aria-hidden />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ev-observed">Why</span>
                {questionWhyTag[sel]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ol className="mt-4 flex flex-wrap gap-2" aria-label="Interview questions">
        {questionChips.map((c, i) => (
          <li key={c}>
            <button
              type="button"
              aria-pressed={sel === i}
              onClick={(e) => { e.stopPropagation(); onSel(i) }}
              className={`rounded-full border px-4 py-2 text-base transition-colors ${sel === i ? 'border-ev-observed bg-ev-observed/15 text-snow' : 'border-line text-silver hover:border-ev-observed/40 hover:text-snow'}`}
            >
              <span className="num mr-2 text-xs text-dim">{i + 1}</span>{c}
            </button>
          </li>
        ))}
      </ol>

      <motion.ul
        initial={false}
        animate={showWhy ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, ease }}
        className="mt-4 flex flex-wrap items-center gap-2"
        aria-label="Why past behaviour"
        aria-hidden={!showWhy}
      >
        <li className="t-kicker !text-[11px] mr-1">Why past behaviour</li>
        {reasonChips.map((r, i) => {
          const on = QUESTION_WHY[sel].includes(i)
          return (
            <li key={r} className={`rounded-full border px-3 py-1 text-sm transition-colors ${on ? 'border-violet/60 bg-violet/15 text-snow' : 'border-line text-dim'}`}>
              {r}
            </li>
          )
        })}
      </motion.ul>
    </div>
  )
}
