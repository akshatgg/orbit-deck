import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, HelpCircle } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { FrozenSet } from '../components/ideation/FrozenSet'
import { NoticeCard } from '../components/ideation/NoticeCard'
import { OrbitingQuestion } from '../components/ideation/OrbitingQuestion'
import { OrbitField } from '../components/OrbitField'
import { Button, ChapterHeader, IllustrativeBadge, Logo, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { centralQuestion, freezeQuestion, heroNotice, orbitSubtitle, otherNotices, scenarioLabel, sourceLabels } from '../data/question'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'question')!

/** How many of the seven sources the student has "noted" — wobbles up and down while step 2 is live. */
const TRACK_SEQUENCE = [1, 2, 3, 2, 3, 2, 3, 2]

function Tracker({ live }: { live: boolean }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!live || reduce) return
    const id = window.setInterval(() => setI((v) => (v + 1) % TRACK_SEQUENCE.length), 1100)
    return () => window.clearInterval(id)
  }, [live, reduce])
  const noted = TRACK_SEQUENCE[reduce ? 1 : i]
  return (
    <div className="rounded-xl border border-line bg-ink/60 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver">Tracking by hand</span>
        <span className="num text-sm text-silver">
          <span className="text-snow">{noted}</span> of {sourceLabels.length} sources noted
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {sourceLabels.map((s, k) => {
          const done = k < noted
          return (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[12px] transition-colors duration-500 ${done ? 'border-line text-silver' : 'border-dashed border-line text-dim'}`}
            >
              {done ? <Check size={12} aria-hidden /> : <HelpCircle size={12} aria-hidden />}
              {s}
            </span>
          )
        })}
      </div>
    </div>
  )
}

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
  <div className="absolute inset-x-0 top-6 z-10 flex flex-wrap items-center justify-center gap-3 px-6 sm:top-8">
    <StageLabel stage={meta.stage} />
    <IllustrativeBadge label={scenarioLabel} className="!text-[11px] !normal-case !tracking-normal" />
  </div>
)

function Cover({ setStep }: { setStep: (n: number) => void }) {
  return (
    <Scene>
      <OrbitField intensity={0.28} labels={false} dim />
      <div className="relative z-10 max-w-6xl">
        <StageLabel stage={meta.stage} />
        <h1 className="t-display mt-6">
          <SplitHeadline text={meta.headline} />
        </h1>
        <div className="mt-10">
          <Button size="lg" onClick={() => setStep(1)}>
            Begin the Journey
          </Button>
        </div>
      </div>
    </Scene>
  )
}

function Notifications({ step }: { step: number }) {
  const frozen = step >= 3
  const showOthers = step >= 2
  return (
    <Scene>
      <ScenarioBar />
      <motion.div className="w-full max-w-4xl" animate={{ opacity: frozen ? 0.7 : 1, filter: frozen ? 'grayscale(0.7)' : 'grayscale(0)' }} transition={{ duration: 0.8, ease }}>
        <motion.div layout="position" transition={{ duration: 0.7, ease }} className="mx-auto max-w-xl">
          <NoticeCard notice={heroNotice} size="lg" closed={frozen} />
        </motion.div>
        <AnimatePresence initial={false}>
          {showOthers && (
            <motion.div key="more" className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherNotices.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: n.from.x, y: n.from.y, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease, delay: frozen ? 0 : 0.15 + i * 0.28 }}
                  >
                    <NoticeCard notice={n} />
                  </motion.div>
                ))}
              </div>
              {!frozen && (
                <div className="mx-auto mt-4 max-w-2xl text-left">
                  <Tracker live />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {frozen && (
          <motion.p
            key="q"
            className="relative mx-auto mt-6 max-w-4xl text-balance text-[clamp(1.4rem,2.6vw,2.6rem)] font-semibold leading-[1.15] tracking-tight text-snow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            {freezeQuestion}
          </motion.p>
        )}
      </AnimatePresence>
    </Scene>
  )
}

function OrbitReveal() {
  return (
    <Scene>
      <OrbitField intensity={0.18} labels={false} dim />
      <ScenarioBar />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="relative flex h-[300px] w-full max-w-5xl flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.2 }}>
            <Logo size={96} />
          </motion.div>
          <motion.p
            className="mt-5 max-w-xl text-balance text-[clamp(1.05rem,1.5vw,1.5rem)] text-silver"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
          >
            {orbitSubtitle}
          </motion.p>
          <OrbitingQuestion rx={380} ry={120} />
        </div>
        <div className="mt-6 w-full max-w-5xl">
          <FrozenSet />
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">The frozen moment, in miniature (illustrative)</p>
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
