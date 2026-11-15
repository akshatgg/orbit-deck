import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

/**
 * "Product shot" wrapper: the phone floats, tilts in 3D toward the pointer (tracked on the
 * whole window, no React state per frame), catches a moving glare, and sits on a soft glow.
 * Decorative motion only; with reduced motion it renders a static, slightly angled phone.
 */
export function PhoneHero({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 15, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 70, damping: 15, mass: 0.8 })
  const rotY = useTransform(sx, [-1, 1], [-22, 10])
  const rotX = useTransform(sy, [-1, 1], [12, -12])
  const glare = useTransform(
    [sx, sy] as never,
    ([x, y]: number[]) => `linear-gradient(${115 + x * 40 + y * 20}deg, transparent ${30 + x * 12}%, rgba(255,255,255,0.13) ${44 + x * 12}%, transparent ${58 + x * 12}%)`,
  )
  const shadowX = useTransform(sx, [-1, 1], [26, -26])

  useEffect(() => {
    if (reduce) return
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2)
      my.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [reduce, mx, my])

  return (
    <div className="relative flex flex-col items-center" style={{ perspective: 1400 }}>
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[44%] h-[130%] w-[170%] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,0.42), rgba(56,189,248,0.12) 55%, transparent 75%)' }}
      />
      <motion.div initial={{ y: 0 }} animate={reduce ? undefined : { y: [0, -12, 0] }} transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }} className="relative">
        <motion.div style={{ rotateY: reduce ? -12 : rotY, rotateX: reduce ? 4 : rotX, transformStyle: 'preserve-3d' }} className="relative">
          {children}
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[13%/6.2%]" style={{ background: glare, mixBlendMode: 'screen' }} />
        </motion.div>
      </motion.div>
      {/* floor reflection */}
      <motion.div
        aria-hidden
        className="pointer-events-none -mt-1 h-5 w-[80%] rounded-[50%]"
        style={{ x: reduce ? 0 : shadowX, background: 'radial-gradient(closest-side, rgba(139,92,246,0.55), rgba(56,189,248,0.15) 60%, transparent)', filter: 'blur(8px)' }}
        initial={{ scaleX: 1, opacity: 0.9 }}
        animate={reduce ? undefined : { scaleX: [1, 0.86, 1], opacity: [0.9, 0.55, 0.9] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />
      {caption && <div className="relative mt-1.5">{caption}</div>}
    </div>
  )
}
