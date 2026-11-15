import { motion } from 'framer-motion'
import { conceptFeatures, coreProposition } from '../../data/assumptionShifts'
import { ease } from '../ui'

/**
 * Concept-label cloud. `resolved` = number of assumption cards resolved (0–5).
 * `showCore` highlights the remaining core proposition.
 */
export function FeatureCloud({ resolved, showCore = false, large = false }: { resolved: number; showCore?: boolean; large?: boolean }) {
  return (
    <div>
      <ul className={`flex flex-wrap justify-center ${large ? 'gap-3 sm:gap-4' : 'gap-2'}`} aria-label="Initial concept labels (analytical reconstruction)">
        {conceptFeatures.map((f, i) => {
          const faded = f.fadesAt !== null && resolved >= f.fadesAt
          const core = showCore && f.core
          return (
            <motion.li
              key={f.label}
              initial={false}
              animate={{
                opacity: faded ? 0.16 : 1,
                scale: faded ? 0.94 : core ? 1.04 : 1,
              }}
              transition={{ duration: 0.8, ease, delay: faded ? i * 0.03 : 0 }}
              className={`rounded-full border ${large ? 'px-5 py-2.5 text-lg sm:text-xl' : 'px-3.5 py-1.5 text-[15px]'} ${
                core
                  ? 'border-violet bg-violet/20 font-medium text-snow shadow-[0_0_30px_-10px_rgba(139,92,246,0.8)]'
                  : faded
                    ? 'border-dashed border-line text-dim'
                    : 'border-line bg-navy/70 text-snow'
              } ${faded ? 'line-through decoration-dim/60' : ''}`}
            >
              {f.label}
            </motion.li>
          )
        })}
      </ul>
      {showCore && (
        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-violet-soft">
          {coreProposition.map((c) => (
            <li key={c.key} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
