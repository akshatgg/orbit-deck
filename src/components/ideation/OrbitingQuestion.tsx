import { motion, useReducedMotion } from 'framer-motion'
import { centralQuestion } from '../../data/question'

const N = 24
const pts = Array.from({ length: N + 1 }, (_, i) => (i / N) * Math.PI * 2)

/** The single orbiting question: a pill drifting on a slow ellipse around its parent (container must be `relative`). */
export function OrbitingQuestion({ rx = 340, ry = 120, duration = 40 }: { rx?: number; ry?: number; duration?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-10 max-w-[18rem] -translate-x-1/2 -translate-y-1/2"
      initial={false}
      animate={reduce ? { x: 0, y: ry } : { x: pts.map((a) => Math.cos(a) * rx), y: pts.map((a) => Math.sin(a) * ry) }}
      transition={reduce ? { duration: 0 } : { duration, ease: 'linear', repeat: Infinity }}
    >
      <p className="rounded-full border border-violet/40 bg-ink/80 px-4 py-2 text-center font-serif text-[15px] italic leading-snug text-violet-soft">{centralQuestion}</p>
    </motion.div>
  )
}
