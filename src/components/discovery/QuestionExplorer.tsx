import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { researchQuestions, whyTheseQuestions } from '../../data/research'
import { ease } from '../ui'

/**
 * Which of the four "why" principles each interview question serves. This mapping is an
 * editorial reading of the supplied lists (research.ts has 6 questions and 4 reasons, not 1:1).
 */
const QUESTION_WHY: number[][] = [[0, 1], [1], [2], [1], [3], [2]]

export function QuestionExplorer({ showWhy, expandAll = false }: { showWhy: boolean; expandAll?: boolean }) {
  const [sel, setSel] = useState<number | null>(0)
  const active = sel === null ? [] : QUESTION_WHY[sel]
  return (
    <div className={`grid gap-4 ${showWhy ? 'lg:grid-cols-[1.25fr_1fr]' : ''}`}>
      <ol className="space-y-2" aria-label="Interview questions">
        {researchQuestions.map((q, i) => {
          const on = sel === i
          return (
            <li key={q}>
              <button
                type="button"
                aria-expanded={on}
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(on ? null : i)
                }}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors ${
                  on ? 'border-ev-observed/60 bg-ev-observed/10' : 'border-line bg-navy/50 hover:border-ev-observed/40'
                }`}
              >
                <span className="num mt-0.5 text-sm text-dim">{i + 1}</span>
                <span className="flex-1">
                  <span className="block text-[17px] leading-snug text-snow">{q}</span>
                  <AnimatePresence initial={false}>
                    {(on || expandAll) && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="block overflow-hidden"
                      >
                        <span className="mt-1.5 block text-sm leading-snug text-ev-observed">
                          Why it matters: {QUESTION_WHY[i].map((w) => whyTheseQuestions[w]).join(' ')}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {showWhy && (
        <div className="flex flex-col justify-center rounded-2xl border border-line bg-navy/50 p-5">
          <div className="t-kicker !text-[11px]">Why past behaviour</div>
          <ul className="mt-3 space-y-3">
            {whyTheseQuestions.map((w, i) => (
              <li
                key={w}
                className={`border-l-2 pl-3 text-[17px] leading-snug transition-colors ${active.includes(i) ? 'border-ev-observed text-snow' : 'border-line text-silver'}`}
              >
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-dim">Select a question to see which reasons it serves.</p>
        </div>
      )}
    </div>
  )
}
