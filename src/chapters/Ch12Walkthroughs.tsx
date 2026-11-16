import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import PrototypeDrawer from '../components/validation/PrototypeDrawer'
import { Hero, PresentHeader } from '../components/validation/PitchKit'
import { FindingsRows, HonestState, MeasureChips, NoResultsNote, PrototypeLink, StreamStrip, TaskQuote, VerifiedResults } from '../components/validation/PitchWalkthrough'
import { Accent, Card, ChapterHeader, EvidenceTag, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { prototypeTesting } from '../data/engagement'
import { walkthroughFindings } from '../data/walkthroughs'
import { walkthroughShort as W } from '../data/validationPresent'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'walkthroughs')!

function Panel({ k, children }: { k: string; children: ReactNode }) {
  return (
    <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
      {children}
    </motion.div>
  )
}

const hasFindings = walkthroughFindings.length > 0

/** What the audience sees for "what we learned": findings if the report supplied them, otherwise the honest state. */
function Learned() {
  return (
    <div className="space-y-4">
      <VerifiedResults />
      {hasFindings && <FindingsRows />}
      {!hasFindings && <HonestState />}
      {!hasFindings && <NoResultsNote />}
    </div>
  )
}

export default function Ch12Walkthroughs({ mode, step }: ChapterProps) {
  if (mode === 'explore') {
    return (
      <Stage mode="explore">
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="Interviews and the survey told us about the problem. Walkthroughs tested the product: partial support for A5, not proof of repeat use." />
        <h3 className="t-h2 mt-12">Four kinds of evidence</h3>
        <p className="mt-2 max-w-3xl text-[16px] text-silver">Each stream answers a different question. Product walkthroughs are the only one that tests Orbit itself with students.</p>
        <div className="mt-5">
          <StreamStrip />
        </div>
        <h3 className="t-h2 mt-14">What we tested</h3>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <TaskQuote size="md" />
          <MeasureChips />
        </div>
        <div className="mt-6">
          <PrototypeDrawer defaultOpen />
        </div>
        <h3 className="t-h2 mt-14">What we learned, and what it changed</h3>
        <div className="mt-5">
          <Learned />
        </div>
        <Card className="mt-6 p-5">
          <EvidenceTag label="unresolved" text="Limits" />
          <p className="mt-2 text-[16px] leading-snug text-snow">{prototypeTesting.caution}</p>
          <p className="mt-2 text-[15px] text-silver">A6 (students return) and A7 (attendance improves) need the pilot: first-use success is not repeat use, and a click is not an attendance.</p>
          {pitchConfig.prototypeUrl && <PrototypeLink className="mt-3" />}
        </Card>
        <SourceNote className="mt-6">Walkthroughs follow assumption A5 in the team report (S3, S4). Results are shown only when verified; none are invented.</SourceNote>
      </Stage>
    )
  }

  return (
    <Stage mode="present">
      <PresentHeader stage={meta.stage} num={meta.num} kicker={meta.title} title="We put the prototype in *students’ hands.*" />
      <div className="mt-5 min-h-[25rem]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <Panel key="tested" k="tested">
              <StreamStrip compact />
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
                <TaskQuote />
                <MeasureChips />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
                <PrototypeLink />
                <SourceNote>Neutral task, no help given · A5</SourceNote>
              </div>
            </Panel>
          )}
          {step >= 1 && (
            <Panel key="learned" k="learned">
              <Hero className="mb-5">
                {hasFindings ? (
                  <>
                    What we learned <Accent>changed the product.</Accent>
                  </>
                ) : (
                  <>
                    {W.honestHero} <Accent>{W.honestAccent}</Accent>
                  </>
                )}
              </Hero>
              <Learned />
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  )
}
