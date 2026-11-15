import { motion } from 'framer-motion'
import { conceptFeatures, coreProposition, type CoreKey } from '../../data/assumptionShifts'
import { ease } from '../ui'

/** Scattered cloud positions (% of the container) — same order as `conceptFeatures`. */
const POS: [number, number][] = [
  [17, 8], // Event feed
  [36, 26], // Friend groups
  [20, 44], // Interest communities
  [62, 8], // Public event aggregation
  [46, 62], // University sources (core)
  [72, 44], // Reminders
  [24, 82], // Availability filters (core)
  [16, 62], // Calendar sync
  [80, 62], // Social recommendations
  [52, 82], // Source transparency (core)
  [84, 26], // Ticketing
  [83, 82], // Registration redirect (core)
]

/** Where the four core labels crystallise (2 × 2 cluster). */
const CORE_POS: Record<CoreKey, [number, number]> = {
  coverage: [28, 41],
  relevance: [72, 41],
  transparency: [28, 59],
  redirect: [72, 59],
}

/**
 * Present-mode hero: concept labels scattered in a cloud that dissolves card by card.
 * `resolved` = assumption cards resolved (0–5). `crystal` pulls the survivors together in a glow ring.
 */
export function FeatureField({ resolved, crystal = false, large = false, className = '' }: { resolved: number; crystal?: boolean; large?: boolean; className?: string }) {
  return (
    <div className={`relative w-full ${className}`}>
      <ul className="absolute inset-0" aria-label="Initial concept labels (analytical reconstruction)">
        {conceptFeatures.map((f, i) => {
          const faded = f.fadesAt !== null && resolved >= f.fadesAt
          const core = !!f.core
          const [x, y] = crystal && f.core ? CORE_POS[f.core] : POS[i]
          const label = crystal && f.core ? coreProposition.find((c) => c.key === f.core)!.label : f.label
          const hot = crystal && core
          return (
            <motion.li
              key={f.label}
              initial={false}
              style={{ x: '-50%', y: '-50%' }}
              animate={{
                left: `${x}%`,
                top: `${y}%`,
                opacity: crystal && !core ? 0 : faded ? [1, 1, 0.17] : 1,
                scale: faded ? [1, 1.07, 0.82] : hot ? 1.06 : 1,
                filter: faded ? ['blur(0px)', 'blur(0px)', 'blur(4px)'] : 'blur(0px)',
              }}
              transition={{
                left: { duration: 1.1, ease },
                top: { duration: 1.1, ease },
                default: { duration: 1.1, ease, times: faded ? [0, 0.22, 1] : undefined },
              }}
              className={`absolute whitespace-nowrap rounded-full border ${
                large ? 'px-5 py-2.5 text-[clamp(1rem,1.7vw,1.5rem)]' : hot ? 'px-4 py-2 text-base' : 'px-3.5 py-1.5 text-[15px]'
              } ${
                hot
                  ? 'border-violet bg-violet/25 font-medium text-snow shadow-[0_0_34px_-8px_rgba(139,92,246,0.9)]'
                  : faded
                    ? 'border-dashed border-st-contradicted/40 text-dim line-through decoration-st-contradicted/70'
                    : core
                      ? 'border-violet/50 bg-violet/10 text-snow'
                      : 'border-line bg-navy/80 text-snow'
              }`}
            >
              {label}
            </motion.li>
          )
        })}
      </ul>
      <motion.div
        aria-hidden
        initial={false}
        animate={crystal ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.9, ease, delay: crystal ? 0.7 : 0 }}
        className="pointer-events-none absolute left-[50%] top-[50%] h-[46%] w-[96%] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="glow-ring h-full w-full rounded-3xl bg-violet/[0.07]" />
      </motion.div>
    </div>
  )
}
