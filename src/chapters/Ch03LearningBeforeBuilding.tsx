import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ChapterHeader, Expandable, LearningCard, LearningStrip, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { PresentHeader } from '../components/discovery/pitch'
import { QuestionDeck } from '../components/discovery/QuestionDeck'
import { ResearchOrbit, WallStrip } from '../components/discovery/ResearchOrbit'
import { learningStripCh03 } from '../data/discoveryShort'
import { MethodLoop } from '../components/discovery/MethodLoop'
import { QuestionExplorer } from '../components/discovery/QuestionExplorer'
import { ResearchWall } from '../components/discovery/ResearchWall'
import { chapters } from '../data/chapters'
import type { Learning } from '../data/evidence'
import { limitations } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'learning-before-building')!

const learning: Learning = {
  believed: 'Asking students about Orbit would tell us whether it was needed.',
  investigated: 'Past behaviour, in 13 interviews and 42 survey responses.',
  learned: 'Recent missed events and workarounds are stronger evidence than enthusiasm.',
  changed: 'Research organised around behaviour, with limitations stated up front.',
}

const Limitations = ({ mode }: { mode: ChapterProps['mode'] }) => (
  <Expandable key={mode} defaultOpen={mode === 'explore'} title={<span>Research limitations <span className="ml-2 font-mono text-xs text-amber">{limitations.length} stated</span></span>}>
    <ul className="grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
      {limitations.map((l) => (
        <li key={l} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
          <span>{l}</span>
        </li>
      ))}
    </ul>
  </Expandable>
)

export default function Ch03LearningBeforeBuilding({ mode, step }: ChapterProps) {
  const [sel, setSel] = useState(0)
  const explore = mode === 'explore'
  const s = explore ? meta.steps - 1 : step

  if (explore) {
    return (
      <Stage mode={mode}>
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader
          num={meta.num}
          kicker={meta.title}
          title={meta.headline}
          lead="Week 3 customer-discovery principles (S2) shaped the investigation: it was organised around past behaviour, not around asking people whether they liked Orbit."
        />
        <div className="mt-10 space-y-10">
          <ResearchWall />
          <section>
            <h3 className="t-h2 mb-4">Questions we asked, and why</h3>
            <QuestionExplorer showWhy expandAll />
          </section>
          <section>
            <h3 className="t-h2 mb-4">Method</h3>
            <MethodLoop />
          </section>
          <Limitations mode={mode} />
          <LearningCard learning={learning} />
          <SourceNote>S2 (Week 3 principles) · S3, S4 (research design and evidence appendices). 42 is the survey denominator throughout; some source screenshots show 44, and reconciliation remains required.</SourceNote>
        </div>
      </Stage>
    )
  }

  return (
    <Stage mode={mode} className="!justify-start !pb-8 !pt-20">
      <PresentHeader meta={meta} title="We needed to understand behaviour, *not collect compliments.*" />

      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {s === 0 ? (
            <motion.div key="wall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4, ease }}>
              <ResearchOrbit />
              <SourceNote className="mt-3 justify-center">S2 · Week 3 principle: ask about past behaviour, not opinions.</SourceNote>
            </motion.div>
          ) : (
            <motion.div key="rest" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="space-y-4">
              <WallStrip />
              {(s === 1 || s === 2) && <QuestionDeck sel={sel} onSel={setSel} showWhy={s === 2} />}
              {s === 3 && (
                <div className="space-y-4">
                  <MethodLoop big />
                  <Reveal show delay={0.3}>
                    <LearningStrip {...learningStripCh03} />
                  </Reveal>
                  <Limitations mode={mode} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  )
}
