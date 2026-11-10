import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { OrbitField } from '../components/OrbitField'
import { Kicker, Logo, Reveal, SplitHeadline, ease } from '../components/ui'
import { pitchConfig } from '../data/config'
import type { ChapterProps } from '../shell/types'

/** CHAPTER 00 — Pre-show: the opportunity universe. */
export default function Ch00Opening({ mode, step, setStep }: ChapterProps) {
  const [intensity, setIntensity] = useState(mode === 'explore' ? 1 : 0.05)
  const [count, setCount] = useState(0)

  // nodes emerge slowly over ~9s
  useEffect(() => {
    if (mode === 'explore') return
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 9000)
      setIntensity(0.05 + p * 0.95)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  const h = mode === 'present' ? 'h-full' : 'min-h-[80vh]'

  return (
    <div className={`relative ${h} w-full overflow-hidden bg-ink`}>
      <OrbitField intensity={intensity} onCount={setCount} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_50%_50%,rgba(7,10,18,0.85),transparent_70%)]" />

      <div className="relative flex h-full min-h-[inherit] flex-col items-center justify-center px-6 text-center">
        <Reveal show>
          <Kicker className="!text-silver/80">Imperial College Business School · New Venture Creation</Kicker>
        </Reveal>

        <div className="relative mt-6 grid min-h-[2.4em] place-items-center">
          <motion.h1
            className="t-display col-start-1 row-start-1 max-w-5xl"
            initial={false}
            animate={{ opacity: step === 0 ? 1 : 0, y: step === 0 ? 0 : -20, filter: step === 0 ? 'blur(0px)' : 'blur(8px)' }}
            transition={{ duration: 0.8, ease }}
          >
            <SplitHeadline text="Your university is full of opportunities." show={step === 0} delay={0.4} />
          </motion.h1>
          <motion.h1
            className="t-display col-start-1 row-start-1 max-w-5xl"
            initial={false}
            animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 20 }}
            transition={{ duration: 0.8, ease }}
            aria-hidden={step < 1}
          >
            <SplitHeadline text="But how many do you" show={step >= 1} delay={0.1} />{' '}
            <span className="font-serif font-normal italic text-gradient-warm">
              <SplitHeadline text="actually discover?" show={step >= 1} delay={0.35} />
            </span>
          </motion.h1>
        </div>

        <div className="mt-8 flex items-center gap-3 font-mono text-sm text-silver">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
          <span className="num text-snow">{count.toString().padStart(3, '0')}</span> opportunities in view
        </div>

        <Reveal show={step >= 1} delay={0.6} className="mt-12">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setStep(2)
            }}
            className="group relative inline-flex items-center gap-3 rounded-full border border-violet/50 bg-violet/10 px-8 py-4 text-sm font-semibold tracking-[0.25em] text-snow backdrop-blur transition-all hover:bg-violet/25 hover:shadow-[0_0_60px_-10px_rgba(128,102,255,0.8)]"
            disabled={mode === 'explore'}
          >
            BEGIN THE EXPERIENCE
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 opacity-80">
        <Logo size={22} />
      </div>
      <p className="sr-only">{pitchConfig.tagline}</p>
    </div>
  )
}
