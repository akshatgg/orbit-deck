import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { AssumptionCard } from '../components/discovery/AssumptionCard'
import { FeatureCloud } from '../components/discovery/FeatureCloud'
import { ChapterHeader, EvidenceTag, IllustrativeBadge, LearningCard, SourceNote, Stage, StageLabel, ease } from '../components/ui'
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

function CompactRow({ i, onPick }: { i: number; onPick: () => void }) {
  const c = assumptionShifts[i]
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onPick()
      }}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-navy/60 px-3.5 py-2 text-left transition-colors hover:border-violet/50"
      aria-label={`Reopen assumption ${c.n}: ${c.hypothesis}`}
    >
      <span className="num text-sm text-dim">{c.n}</span>
      <span className="min-w-0 flex-1 truncate text-[15px] text-silver line-through decoration-st-contradicted/70">{c.hypothesis}</span>
      <span className="text-dim" aria-hidden>→</span>
      <span className="hidden min-w-0 flex-[1.3] truncate text-[15px] text-violet-soft sm:block">{c.decision}</span>
    </button>
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
    <Stage mode={mode}>
      <StageLabel stage={meta.stage} className="mb-3" />
      <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className={`w-full shrink-0 transition-[width] duration-700 ease-out ${step === 0 ? 'lg:w-full' : 'lg:w-[36%]'}`}>
          <CloudLabel>Initial concept</CloudLabel>
          <FeatureCloud resolved={resolved} showCore={closing} large={step === 0} />
          {step === 0 && <p className="mt-4 text-center text-sm text-silver">Concept labels, not a historical feature list. Five assumptions are about to meet the evidence.</p>}
        </div>

        {step >= 1 && !closing && (
          <div className="min-w-0 flex-1 space-y-2">
            {assumptionShifts.slice(0, step).map((c, i) =>
              i === focus ? (
                <motion.div key={`${c.n}-${step}-${focus}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
                  <AssumptionCard card={c} />
                </motion.div>
              ) : (
                <CompactRow key={c.n} i={i} onPick={() => setPick({ step, idx: i })} />
              ),
            )}
          </div>
        )}

        <AnimatePresence>
          {closing && (
            <motion.div key="close" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="min-w-0 flex-1 space-y-4">
              <ul className="flex flex-wrap gap-2" aria-label="Five assumptions challenged">
                {assumptionShifts.map((c) => (
                  <li key={c.n} className="rounded-full border border-st-contradicted/30 bg-st-contradicted/5 px-3 py-1 text-sm text-silver">
                    <span className="num mr-1.5 text-dim">{c.n}</span>
                    <span className="line-through decoration-st-contradicted/70">{c.short}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[clamp(1.4rem,2.4vw,2.4rem)] font-medium leading-tight tracking-tight text-snow">{assumptionClosing.shift}</p>
              <p className="font-serif text-[clamp(1.5rem,2.6vw,2.6rem)] italic text-violet-soft">{assumptionClosing.reframe}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {closing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-5">
          <LearningCard learning={learning} compact />
        </motion.div>
      )}
      {step >= 1 && (
        <p className="mt-3 font-mono text-[11px] text-dim">
          Analytical evolution of the venture, not dated pivots. Concept labels only; no historical feature list is claimed.
        </p>
      )}
    </Stage>
  )
}
