import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button, ChapterHeader, Expandable, LearningCard, Logo, Reveal, SourceNote, SplitHeadline, Stage, StageLabel, StatusPill, ease } from '../components/ui'
import { AssumptionsSlide, Finale, FinaleStatic, OwnersCompact, ThreeColumns, TrackerSummary, VerdictHero, VerdictStamp, WhoPursues } from '../components/verdict/VerdictParts'
import { assumptions } from '../data/assumptions'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { journeyNodes } from '../data/journey'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'verdict')!
const openingQuestion = journeyNodes[0].question
const closing = 'Orbit is not the story of an idea we wanted to prove. It is the story of an opportunity we learned how to evaluate.'

const goEvidence = () => {
  window.location.hash = '#/explore/evidence'
}

function CallToAction() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Logo size={44} />
      <p className="text-xl text-snow">{pitchConfig.tagline}</p>
      <Button size="lg" onClick={goEvidence}>
        Explore our evidence <ArrowRight size={18} />
      </Button>
    </div>
  )
}

const swap = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.4, ease } }

export default function Ch15Verdict({ mode, step }: ChapterProps) {
  if (mode === 'explore') return <Explore mode={mode} />

  // Present: three steps — the final assumptions slide, CONDITIONAL GO, the return to the opening question.
  return (
    <Stage mode={mode} center={step !== 0}>
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 && (
          <motion.div key="assumptions" {...swap} className="w-full">
            <div className="mb-2">
              <StageLabel stage={meta.stage} />
            </div>
            <ChapterHeader num={meta.num} kicker={meta.title} title={<SplitHeadline className="text-[clamp(1.8rem,3.5vw,3.5rem)]" text="Orbit’s business model has *8 key assumptions*" delay={0.08} />} />
            <div className="mt-5">
              <AssumptionsSlide animate />
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="verdict" {...swap} className="w-full">
            <VerdictHero />
            <div className="mt-8">
              <OwnersCompact />
            </div>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div key="finale" {...swap} className="w-full">
            <FinaleStatic openingQuestion={openingQuestion} onEvidence={goEvidence} tagline={pitchConfig.tagline} />
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  )
}

function Explore({ mode }: { mode: 'explore' }) {
  return (
    <Stage mode={mode}>
      <div className="mb-3">
        <StageLabel stage={meta.stage} />
      </div>
      <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />
      <div className="mt-10">
        <h3 className="t-h2 mb-4">Orbit’s business model has 8 key assumptions</h3>
        <AssumptionsSlide />
      </div>

      <div className="mt-16">
        <h3 className="t-h2 mb-4">What we know, what we do not know, what we should do</h3>
        <ThreeColumns s1 s2 s3 />
      </div>

      <div className="mt-16">
        <VerdictStamp show />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <WhoPursues show />
          <TrackerSummary show detail />
        </div>
        <Expandable title="Assumption tracker in full — evidence and next test" className="mt-4">
          <ul className="space-y-4">
            {assumptions.map((a) => (
              <li key={a.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="num font-semibold text-snow">{a.id}</span>
                  <StatusPill status={a.status} />
                  <span className="text-snow">{a.title}</span>
                  <span className="text-sm text-silver">{a.statusText}</span>
                </div>
                <p className="mt-1.5">{a.evidence}</p>
                <p className="mt-1 text-dim">
                  <span className="text-ev-proposed">Next test:</span> {a.nextTest}
                </p>
              </li>
            ))}
          </ul>
        </Expandable>
        <div className="mt-3">
          <SourceNote>Assumption statuses are the team’s own assessment (S3, S4). A5 reports walkthrough results only as far as they are verified.</SourceNote>
        </div>
      </div>

      <Reveal className="mt-14">
        <LearningCard
          learning={{
            believed: 'Orbit was an opportunity worth believing in.',
            investigated: 'Whether the evidence supports pursuing it, by whom, and under what conditions.',
            learned: 'Evidence has improved; critical uncertainty remains. Willingness to pay, repeat use and integration economics are untested.',
            changed: 'From “build Orbit” to “run one paid, measurable university pilot before any wider expansion.”',
          }}
        />
      </Reveal>

      <div className="mt-20 border-t border-line pt-16">
        <Finale openingQuestion={openingQuestion} closing={closing} />
        <div className="text-center">
          <CallToAction />
        </div>
      </div>
    </Stage>
  )
}
