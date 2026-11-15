import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import CohortCalculator from '../components/validation/CohortCalculator'
import PilotSequence from '../components/validation/PilotSequence'
import { AttendanceCalc, ClickLadder, Gates } from '../components/validation/PilotScorecard'
import VerdictSimulator from '../components/validation/VerdictSimulator'
import { ChapterHeader, EvidenceTag, Expandable, LearningCard, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { defaultInvited, evaluationIncludes, pilotDisclaimer, pilotEndLine, pilotLearning } from '../data/pilot'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'experiment')!

const Disclaimer = ({ large = false }: { large?: boolean }) => (
  <div className="flex flex-wrap items-center gap-3">
    <EvidenceTag label="proposed" />
    <span className={`${large ? 'text-[clamp(1.05rem,1.5vw,1.5rem)]' : 'text-[15px]'} text-snow`}>{pilotDisclaimer}</span>
  </div>
)

const Include = () => (
  <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
    {evaluationIncludes.map((t) => (
      <li key={t} className="flex gap-2 text-[15px] text-snow">
        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ev-proposed" />
        {t}
      </li>
    ))}
  </ul>
)

function Lead() {
  return (
    <p className="t-lead mt-4 max-w-4xl">
      The proposed next step is <span className="text-snow">one paid, controlled, 8–12-week pilot</span> at Imperial.
    </p>
  )
}

function Scorecard({ explore = false }: { explore?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <Gates />
      <div className="grid content-start gap-4">
        <AttendanceCalc />
        <ClickLadder />
        <Expandable title="What the evaluation includes" defaultOpen={explore}>
          <Include />
        </Expandable>
      </div>
    </div>
  )
}

function Slide({ k, children }: { k: string; children: ReactNode }) {
  return (
    <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
      {children}
    </motion.div>
  )
}

export default function Ch13Experiment({ mode, step }: ChapterProps) {
  const [invited, setInvited] = useState(defaultInvited)
  const source = <SourceNote>Proposed design. Thresholds and decision rules are the team’s, set before any pilot (S3, S4, S6). No pilot results exist.</SourceNote>

  if (mode === 'explore') {
    return (
      <Stage mode="explore">
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />
        <Lead />
        <div className="mt-5">
          <Disclaimer large />
        </div>
        <h3 className="t-h2 mt-14">The proposed sequence</h3>
        <div className="mt-5">
          <PilotSequence />
        </div>
        <h3 className="t-h2 mt-16">Pilot cohort calculator</h3>
        <div className="mt-5">
          <CohortCalculator invited={invited} setInvited={setInvited} />
        </div>
        <h3 className="t-h2 mt-16">Pilot scorecard</h3>
        <div className="mt-5">
          <Scorecard explore />
        </div>
        <h3 className="t-h2 mt-16">Verdict simulator</h3>
        <div className="mt-5">
          <VerdictSimulator />
        </div>
        <p className="mt-16 max-w-4xl font-serif text-[clamp(2rem,4.4vw,4.5rem)] italic leading-[1.05] text-snow">{pilotEndLine}</p>
        <LearningCard className="mt-12" learning={pilotLearning} />
        <div className="mt-4">{source}</div>
      </Stage>
    )
  }

  const title = <SplitHeadline text={meta.headline} className="t-h2 block" />
  return (
    <Stage mode="present">
      <StageLabel stage={meta.stage} className="mb-3" />
      <ChapterHeader num={meta.num} kicker={meta.title} title={title} />
      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <Slide key="seq" k="seq">
              <Lead />
              <div className="mb-5 mt-4">
                <Disclaimer large />
              </div>
              <PilotSequence />
            </Slide>
          )}
          {step === 1 && (
            <Slide key="calc" k="calc">
              <div className="mb-4">
                <Disclaimer />
              </div>
              <CohortCalculator invited={invited} setInvited={setInvited} />
            </Slide>
          )}
          {step === 2 && (
            <Slide key="score" k="score">
              <div className="mb-4">
                <Disclaimer />
              </div>
              <Scorecard />
            </Slide>
          )}
          {step === 3 && (
            <Slide key="sim" k="sim">
              <VerdictSimulator />
            </Slide>
          )}
          {step >= 4 && (
            <Slide key="end" k="end">
              <p className="max-w-5xl font-serif text-[clamp(2.2rem,5.2vw,5.6rem)] italic leading-[1.04] text-snow">{pilotEndLine}</p>
              <LearningCard className="mt-8" compact learning={pilotLearning} />
            </Slide>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3">{source}</div>
    </Stage>
  )
}
