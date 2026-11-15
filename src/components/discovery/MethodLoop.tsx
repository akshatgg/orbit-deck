import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { methodSequence } from '../../data/research'
import { ease } from '../ui'

/** Method as a visual sequence with a loop arrow back to the hypothesis. */
export function MethodLoop({ show = true }: { show?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-navy/50 p-4 sm:p-5" aria-label="Research method sequence">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {methodSequence.map((m, i) => {
          const last = i === methodSequence.length - 1
          return (
            <motion.li
              key={m}
              initial={false}
              animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease, delay: show ? i * 0.12 : 0 }}
              className="flex items-center gap-2"
            >
              <span
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[17px] ${
                  last ? 'border-violet/60 bg-violet/15 text-snow' : 'border-ev-observed/40 bg-ev-observed/10 text-snow'
                }`}
              >
                <span className="num text-xs text-dim">{i + 1}</span>
                {m}
              </span>
              {!last && <span className="text-dim" aria-hidden>→</span>}
            </motion.li>
          )
        })}
        <li className="flex items-center gap-2 text-sm text-violet-soft">
          <RotateCcw size={18} aria-hidden />
          <span>Loop back to the hypothesis</span>
        </li>
      </ol>
    </div>
  )
}
