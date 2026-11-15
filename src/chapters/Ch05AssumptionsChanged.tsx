import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { AssumptionCard, AssumptionCardShort } from '../components/discovery/AssumptionCard'
import { FeatureCloud } from '../components/discovery/FeatureCloud'
import { FeatureField } from '../components/discovery/FeatureField'
import { PresentHeader } from '../components/discovery/pitch'
import { Accent, ChapterHeader, EvidenceTag, IllustrativeBadge, LearningCard, LearningStrip, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { learningStripCh05 } from '../data/discoveryShort'
import { assumptionClosing, assumptionShifts } from '../data/assumptionShifts'
import { chapters } from '../data/chapters'
import type { Learning } from '../data/evidence'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'assumptions-changed')!

const learning: Learning = {
  believed: 'Students need one more event app; reminders, aggregation and better discovery would fix missed events and adoption would follow.',
  investigated: 'Interview (n = 13) and survey (n = 42) evidence against each of five assumptions.',
  learned: 'Timely discovery matters more than reminders, existing channels are familiar, and some misses are not Orbit’s to solve.',
  changed: 'From an all-in-one events app to an accurate, low-friction discovery layer, with adoption measured rather than assumed.',
}

const CloudLabel = ({ children }: { children: string }) => (
  <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
    <span className="t-kicker !text-[11px]">{children}</span>
    <IllustrativeBadge label="Analytical reconstruction" />
  </div>
)

function BeliefChips({ upto, focus, onPick }: { upto: number; focus: number; onPick: (i: number) => void }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Assumptions challenged so far">
      {assumptionShifts.slice(0, upto).map((c, i) => (
        <li key={c.n}>
          <button
            type="button"
            aria-pressed={i === focus}
            aria-label={`Show assumption ${c.n}: ${c.hypothesis}`}
            onClick={(e) => {
              e.stopPropagation()
              onPick(i)
            }}
            className={`rounded-full border px-2.5 py-0.5 text-[13px] transition-colors ${i === focus ? 'border-st-contradicted/60 bg-st-contradicted/10 text-snow' : 'border-line text-dim hover:text-silver'}`}
          >
            <span className="num mr-1.5 text-xs">{c.n}</span>
            <span className="line-through decoration-st-contradicted/70">{c.short}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function Ch05AssumptionsChanged({ mode, step }: ChapterProps) {
  const [pick, setPick] = useState<{ step: number; idx: number } | null>(null)

  if (mode === 'explore') {
    return (
      <Stage mode={mode}>
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader
          num={meta.num}
          kicker={meta.title}
          title={meta.headline}
          lead="Five assumptions went into the research. Each came out narrower. Select Replay on a card to watch hypothesis, evidence and decision resolve in turn."
        />
        <div className="mt-10 space-y-12">
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <CloudLabel>Initial concept</CloudLabel>
              <FeatureCloud resolved={0} />
            </div>
            <div className="glass rounded-2xl p-5">
              <CloudLabel>After five challenges</CloudLabel>
              <FeatureCloud resolved={5} showCore />
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h3 className="t-h2">Before and after</h3>
              <EvidenceTag label="observed" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {assumptionShifts.map((c) => (
                <AssumptionCard key={c.n} card={c} animateIn={false} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <p className="t-h2 max-w-4xl">{assumptionClosing.shift}</p>
            <p className="font-serif text-3xl italic text-violet-soft">{assumptionClosing.reframe}</p>
          </section>

          <LearningCard learning={learning} />
          <SourceNote>S3, S4 (survey n = 42, interviews n = 13). {assumptionClosing.note} “Challenged” means the evidence qualifies or contradicts the hypothesis; it does not mean the idea has failed.</SourceNote>
        </div>
      </Stage>
    )
  }

  const resolved = Math.min(step, 5)
  const focus = pick && pick.step === step ? pick.idx : step - 1
  const closing = step === 6

  return (
    <Stage mode={mode} className="!justify-start !pb-6 !pt-[72px]">
      <PresentHeader meta={meta} title="The most valuable evidence was *the evidence that challenged us.*" />

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className={`w-full shrink-0 transition-[width] duration-[900ms] ease-out ${step === 0 ? 'lg:w-full' : 'lg:w-[52%]'}`}>
          <CloudLabel>{closing ? 'Core proposition' : 'Initial concept'}</CloudLabel>
          <FeatureField resolved={resolved} crystal={closing} large={step === 0} className={step === 0 ? 'h-[min(46vh,360px)]' : 'h-[min(48vh,370px)]'} />
          {step === 0 && <p className="mt-3 text-center text-lg text-silver">12 concept labels. 5 assumptions about to be tested.</p>}
          {step >= 1 && <SourceNote className="mt-2">S3, S4 · Analytical reconstruction, not dated pivots. Concept labels only.</SourceNote>}
        </div>

        {step >= 1 && !closing && (
          <div className="min-w-0 flex-1 space-y-3">
            <BeliefChips upto={step} focus={focus} onPick={(i) => setPick({ step, idx: i })} />
            <motion.div key={`${assumptionShifts[focus].n}-${step}-${focus}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
              <AssumptionCardShort card={assumptionShifts[focus]} />
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {closing && (
            <motion.div key="close" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.5 }} className="min-w-0 flex-1 space-y-5">
              <p className="text-[clamp(1.4rem,2.3vw,2.2rem)] font-medium leading-tight tracking-tight text-snow">From an all-in-one events app to a low-friction discovery layer.</p>
              <p className="text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[1.02]"><Accent>This is entrepreneurial learning.</Accent></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {closing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.9 }} className="mt-5">
          <LearningStrip {...learningStripCh05} />
        </motion.div>
      )}

    </Stage>
  )
}
