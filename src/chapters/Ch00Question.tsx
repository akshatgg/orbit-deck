import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { FrozenSet } from '../components/ideation/FrozenSet'
import { NoticeCard } from '../components/ideation/NoticeCard'
import { OrbitingQuestion } from '../components/ideation/OrbitingQuestion'
import { OrbitField } from '../components/OrbitField'
import { ChapterHeader, EvidenceTag, IllustrativeBadge, Logo, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { headlineFindings } from '../data/research'
import { centralQuestion, freezeQuestion, freezeShort, handsKicker, handsPrompt, handsSources, heroNotice, orbitSubtitle, otherNotices, scenarioLabel, scenarioShort } from '../data/question'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'question')!

function Scene({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 py-16 text-center sm:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  )
}

const ScenarioBar = () => (
  <div className="absolute inset-x-0 top-[68px] z-10 flex flex-wrap items-center justify-center gap-3 px-6">
    <StageLabel stage={meta.stage} />
    <IllustrativeBadge label={scenarioShort} />
  </div>
)

function HandCount({ count, setCount }: { count: number; setCount: (fn: (n: number) => number) => void }) {
  const f = headlineFindings[0]
  const btn =
    'grid h-16 w-16 place-items-center rounded-full border border-line bg-navy/80 text-snow backdrop-blur transition-colors hover:border-violet/70 hover:bg-violet/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-navy/80'
  const press = (d: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setCount((n) => Math.max(0, n + d))
    e.currentTarget.blur() // keep Space / arrows for presenter navigation
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 sm:gap-8">
        <button type="button" className={btn} onClick={press(-1)} disabled={count === 0} aria-label="One fewer hand">
          <Minus size={28} aria-hidden />
        </button>
        <div className="min-w-[8.5rem] text-center" aria-live="polite">
          <div className="num glow-num text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-none">{count}</div>
          <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.18em] text-silver">{count === 1 ? 'hand in this room' : 'hands in this room'}</div>
        </div>
        <button type="button" className={btn} onClick={press(1)} aria-label="One more hand">
          <Plus size={28} aria-hidden />
        </button>
      </div>
      <div className="mt-5 flex h-[3.4rem] items-center justify-center">
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              key="cmp"
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(1.1rem,1.7vw,1.6rem)] text-snow"
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <EvidenceTag label="observed" />
              <span>
                In our survey: <span className="num font-semibold text-cyan">{f.value} of {f.of}</span> missed at least one event in four weeks
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Cover({ count, setCount }: { count: number; setCount: (fn: (n: number) => number) => void }) {
  return (
    <Scene>
      <OrbitField intensity={0.85} labels />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[90vw] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.18), transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease }}
      />
      <div className="relative z-10 flex max-w-6xl flex-col items-center">
        <motion.div className="flex flex-wrap items-center justify-center gap-3" initial={{ opacity: 0, letterSpacing: '0.5em' }} animate={{ opacity: 1, letterSpacing: '0.18em' }} transition={{ duration: 1.2, ease }}>
          <StageLabel stage={meta.stage} />
        </motion.div>
        <motion.p className="mt-4 font-serif text-[clamp(1rem,1.5vw,1.4rem)] italic text-violet-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease, delay: 0.3 }}>
          {handsKicker}
        </motion.p>
        <h1 className="mt-4 text-balance text-[clamp(2.1rem,4.6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          <SplitHeadline text={handsPrompt} delay={0.4} />
        </h1>
        <motion.ul
          className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          aria-label="Where opportunities reach us"
          initial="h"
          animate="v"
          variants={{ v: { transition: { staggerChildren: 0.09, delayChildren: 1.1 } } }}
        >
          {handsSources.map((c) => (
            <motion.li
              key={c}
              className="rounded-full border border-line bg-navy/70 px-4 py-1.5 text-[clamp(0.95rem,1.25vw,1.2rem)] text-silver backdrop-blur"
              variants={{ h: { opacity: 0, y: 10 }, v: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease }}
            >
              {c}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div className="mt-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1.4 }}>
          <HandCount count={count} setCount={setCount} />
        </motion.div>
      </div>
    </Scene>
  )
}

/** Tiny per-card tilt so the flood of notifications feels chaotic, not gridded. */
const TILT = [-2.2, 1.6, -1.2, 2, -1.6]
/** Cards stagger in, then the whole set freezes ~1.2 s after the last one lands (one click, no waiting on the presenter). */
const FLOOD_STAGGER = 0.13
const FREEZE_AFTER_MS = 1900

function Notifications() {
  const reduce = useReducedMotion()
  const [frozen, setFrozen] = useState<boolean>(!!reduce)
  useEffect(() => {
    if (reduce) {
      setFrozen(true)
      return
    }
    const t = window.setTimeout(() => setFrozen(true), FREEZE_AFTER_MS)
    return () => window.clearTimeout(t)
  }, [reduce])
  return (
    <Scene>
      <ScenarioBar />
      <motion.div
        className="w-full max-w-4xl"
        style={{ transformPerspective: 1100 }}
        animate={frozen ? { scale: 1.06, filter: 'grayscale(1) brightness(0.78) contrast(1.05)' } : { scale: 1, filter: 'grayscale(0) brightness(1) contrast(1)' }}
        transition={frozen ? { scale: { duration: 9, ease: 'easeOut' }, filter: { duration: 1, ease } } : { duration: 0.8, ease }}
      >
        <motion.div
          layout="position"
          className="mx-auto max-w-xl"
          initial={{ opacity: 0, scale: 0.7, y: 50, rotateX: 25, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        >
          <NoticeCard notice={heroNotice} size="lg" closed={frozen} glow />
        </motion.div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherNotices.map((n, i) => (
            <motion.div
              key={n.id}
              style={{ transformPerspective: 900 }}
              initial={{ opacity: 0, x: n.from.x * 2, y: n.from.y * 2 + 30, scale: 0.6, rotateX: -35, rotate: TILT[i] * 3, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotate: frozen ? 0 : TILT[i], filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.25 + i * FLOOD_STAGGER }}
            >
              <NoticeCard notice={n} glow={!frozen} compact />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {frozen && (
          <motion.p
            key="q"
            className="relative mx-auto mt-8 max-w-4xl text-balance text-[clamp(1.6rem,3vw,3rem)] font-semibold leading-[1.12] tracking-tight text-snow"
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            <SplitHeadline text={freezeShort} delay={0.3} />
          </motion.p>
        )}
      </AnimatePresence>
    </Scene>
  )
}

function OrbitReveal() {
  return (
    <Scene>
      <OrbitField intensity={0.8} converge={1} labels={false} />
      <ScenarioBar />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="relative flex h-[420px] w-full max-w-5xl flex-col items-center justify-center">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-[58%] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.5), rgb(56 189 248 / 0.18) 55%, transparent 75%)', filter: 'blur(10px)' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0.75], scale: [0.3, 1.1, 1] }}
            transition={{ duration: 2, ease }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.3, ease, delay: 0.2 }}
            style={{ filter: 'drop-shadow(0 0 40px rgb(139 92 246 / 0.7))' }}
          >
            <Logo size={150} />
          </motion.div>
          <motion.p
            className="mt-6 max-w-xl text-balance text-[clamp(1.1rem,1.6vw,1.6rem)] text-silver"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.9 }}
          >
            {orbitSubtitle}
          </motion.p>
          <OrbitingQuestion rx={420} ry={150} />
        </div>
      </div>
    </Scene>
  )
}

export default function Ch00Question({ mode, step }: ChapterProps) {
  const [count, setCount] = useState(0)
  if (mode === 'explore') {
    return (
      <Stage mode={mode}>
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StageLabel stage={meta.stage} />
          <IllustrativeBadge label={scenarioLabel} className="!text-[11px] !normal-case !tracking-normal" />
        </div>
        <div className="mt-10">
          <FrozenSet />
          <p className="mt-3 text-sm text-silver">
            Seven sources, six events, one deadline that passed: <span className="text-snow">Registration closed.</span> All notification copy is illustrative.
          </p>
        </div>
        <p className="mt-8 flex flex-wrap items-center gap-3 text-lg text-snow">
          <EvidenceTag label="observed" />
          <span>
            In our survey: <span className="num font-semibold text-cyan">{headlineFindings[0].value} of {headlineFindings[0].of}</span> missed at least one event in four weeks
          </span>
        </p>
        <p className="mt-12 max-w-4xl text-balance text-[clamp(1.4rem,2.6vw,2.6rem)] font-semibold leading-[1.15] tracking-tight">{freezeQuestion}</p>
        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-line bg-navy/60 p-6 sm:flex-row sm:items-center sm:gap-8">
          <Logo size={56} />
          <div>
            <p className="text-lg text-snow">{orbitSubtitle}</p>
            <p className="mt-2 font-serif text-lg italic text-violet-soft">{centralQuestion}</p>
          </div>
        </div>
        <SourceNote className="mt-6">
          Scenario only. Source labels are plain text; no platform logos or interfaces are reproduced, and nothing here is a recording or quotation of a research participant.
        </SourceNote>
      </Stage>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && <Cover key="cover" count={count} setCount={setCount} />}
        {step === 1 && <Notifications key="notifs" />}
        {step >= 2 && <OrbitReveal key="reveal" />}
      </AnimatePresence>
    </div>
  )
}
