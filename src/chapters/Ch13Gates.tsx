import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import CohortCalculator from '../components/validation/CohortCalculator'
import VerdictSimulator from '../components/validation/VerdictSimulator'
import { AttendanceCalc, ClickLadder, Gates } from '../components/validation/PilotScorecard'
import { GateTiles, VerdictCards } from '../components/validation/PitchPilot'
import { Hero, PresentHeader } from '../components/validation/PitchKit'
import { Accent, ChapterHeader, IllustrativeBadge, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { defaultInvited, pilotDisclaimer, pilotEndLine, verdictText } from '../data/pilot'
import { gatesPresent as G } from '../data/validationPresent'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'gates')!

const IllustrativeNote = ({ large = false }: { large?: boolean }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-amber/50 bg-amber/10 px-4 py-3">
    <IllustrativeBadge label="Illustrative" className="mt-0.5 shrink-0" />
    <p className={`${large ? 'text-[clamp(1.05rem,1.35vw,1.35rem)]' : 'text-[16px]'} leading-snug text-snow`}>{G.illustrativeLine}</p>
  </div>
)

function Slide({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
      {children}
    </motion.div>
  )
}

export default function Ch13Gates({ mode, step }: ChapterProps) {
  const [invited, setInvited] = useState(defaultInvited)

  if (mode === 'explore') {
    return (
      <Stage mode="explore">
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="Six gates give the pilot a structured decision framework. They are proposed and illustrative, not guarantees." />
        <div className="mt-6">
          <IllustrativeNote large />
        </div>
        <h3 className="t-h2 mt-14">The six gates</h3>
        <div className="mt-5">
          <GateTiles />
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Gates />
          <div className="grid content-start gap-4">
            <AttendanceCalc />
            <ClickLadder />
          </div>
        </div>
        <h3 className="t-h2 mt-16">Pilot cohort calculator</h3>
        <p className="mt-2 max-w-3xl text-[15px] text-silver">Illustrative: how a cohort narrows through the funnel gates, with the definitions the gates use. The cohort size is yours to change.</p>
        <div className="mt-5">
          <CohortCalculator invited={invited} setInvited={setInvited} />
        </div>
        <h3 className="t-h2 mt-16">GO, ITERATE or STOP</h3>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {(['GO', 'ITERATE', 'STOP'] as const).map((id) => (
            <li key={id} className="glass rounded-2xl p-5">
              <div className="num text-2xl font-semibold text-snow">{verdictText[id].title}</div>
              <p className="mt-2 text-[16px] leading-snug text-silver">{verdictText[id].rule}</p>
            </li>
          ))}
        </ul>
        <h3 className="t-h2 mt-16">Verdict simulator</h3>
        <div className="mt-5">
          <VerdictSimulator />
        </div>
        <p className="mt-16 max-w-4xl font-serif text-[clamp(2rem,4.4vw,4.5rem)] italic leading-[1.05] text-snow">{pilotEndLine}</p>
        <SourceNote className="mt-6">Proposed design (S3, S4, S6). {pilotDisclaimer} Thresholds are illustrative until set against each university’s baseline.</SourceNote>
      </Stage>
    )
  }

  return (
    <Stage mode="present">
      <PresentHeader stage={meta.stage} num={meta.num} kicker={meta.title} title="We decide what success means *before the pilot starts.*" banner={<IllustrativeBadge label="Illustrative targets" />} />
      <div className="mt-6 min-h-[22rem]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <Slide key="gates" k="gates">
              <GateTiles />
              <Reveal delay={0.7} className="mt-5">
                <IllustrativeNote large />
              </Reveal>
            </Slide>
          )}
          {step >= 1 && (
            <Slide key="rules" k="rules">
              <Hero className="mb-6">
                {G.step1Lead} <Accent>{G.step1Accent}</Accent>
              </Hero>
              <VerdictCards />
              <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-dim">{G.framework}</p>
            </Slide>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  )
}
