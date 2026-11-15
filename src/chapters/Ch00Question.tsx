import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { FrozenSet } from '../components/ideation/FrozenSet'
import { NoticeCard } from '../components/ideation/NoticeCard'
import { OrbitingQuestion } from '../components/ideation/OrbitingQuestion'
import { OrbitField } from '../components/OrbitField'
import { Button, ChapterHeader, IllustrativeBadge, Logo, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { centralQuestion, freezeQuestion, freezeShort, heroNotice, orbitSubtitle, otherNotices, scenarioLabel, scenarioShort } from '../data/question'
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

function Cover({ setStep }: { setStep: (n: number) => void }) {
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
      <div className="relative z-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 1, letterSpacing: '0.18em' }} transition={{ duration: 1.6, ease }}>
          <StageLabel stage={meta.stage} />
        </motion.div>
        <h1 className="t-display mt-6">
          <SplitHeadline text="The best opportunities are *not always the ones we find.*" delay={0.3} />
        </h1>
        <motion.div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-violet to-transparent" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 1.4, ease, delay: 1.2 }} />
        <motion.div className="mt-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.5 }}>
          <Button size="lg" onClick={() => setStep(1)}>
            Begin the Journey
          </Button>
        </motion.div>
      </div>
    </Scene>
  )
}

/** Tiny per-card tilt so the flood of notifications feels chaotic, not gridded. */
const TILT = [-2.2, 1.6, -1.2, 2, -1.6]

function Notifications({ step }: { step: number }) {
  const frozen = step >= 3
  const showOthers = step >= 2
  return (
    <Scene>
      <ScenarioBar />
      <motion.div
        className="w-full max-w-4xl"
        style={{ transformPerspective: 1100 }}
        animate={frozen ? { scale: 1.1, filter: 'grayscale(1) brightness(0.78) contrast(1.05)' } : { scale: 1, filter: 'grayscale(0) brightness(1) contrast(1)' }}
        transition={frozen ? { scale: { duration: 9, ease: 'easeOut' }, filter: { duration: 1.1, ease } } : { duration: 0.8, ease }}
      >
        <motion.div
          layout="position"
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          className="mx-auto max-w-xl"
          initial={{ opacity: 0, scale: 0.7, y: 50, rotateX: 25, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
        >
          <NoticeCard notice={heroNotice} size="lg" closed={frozen} glow />
        </motion.div>
        <AnimatePresence initial={false}>
          {showOthers && (
            <motion.div key="more" className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherNotices.map((n, i) => (
                  <motion.div
                    key={n.id}
                    style={{ transformPerspective: 900 }}
                    initial={{ opacity: 0, x: n.from.x * 2, y: n.from.y * 2 + 30, scale: 0.6, rotateX: -35, rotate: TILT[i] * 3, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotate: frozen ? 0 : TILT[i], filter: 'blur(0px)' }}
                    transition={{ type: 'spring', stiffness: 150, damping: 15, delay: frozen ? 0 : 0.1 + i * 0.22 }}
                  >
                    <NoticeCard notice={n} glow={!frozen} compact />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {frozen && (
          <motion.p
            key="q"
            className="relative mx-auto mt-9 max-w-4xl text-balance text-[clamp(1.6rem,3vw,3rem)] font-semibold leading-[1.12] tracking-tight text-snow"
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease, delay: 0.5 }}
          >
            <SplitHeadline text={freezeShort} delay={0.5} />
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

export default function Ch00Question({ mode, step, setStep }: ChapterProps) {
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
        {step === 0 && <Cover key="cover" setStep={setStep} />}
        {step >= 1 && step <= 3 && <Notifications key="notifs" step={step} />}
        {step >= 4 && <OrbitReveal key="reveal" />}
      </AnimatePresence>
    </div>
  )
}
