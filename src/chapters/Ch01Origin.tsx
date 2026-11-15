import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Fragment } from 'react'
import {
  Badge,
  ChapterHeader,
  Expandable,
  Kicker,
  LearningCard,
  Reveal,
  SourceNote,
  Stage,
  StageLabel,
  StatusPill,
  ease,
} from '../components/ui'
import { chapters } from '../data/chapters'
import { drucker, originCaveat, originLearning, originNarrative, originNodes } from '../data/origin'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'origin')!

function FlowNode({ node, show }: { node: (typeof originNodes)[number]; show: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0.28 }}
      transition={{ duration: 0.6, ease }}
      className={`relative rounded-2xl border p-5 ${show ? 'glass border-line' : 'border-dashed border-line'}`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">
          <span className="num mr-2 text-dim">{node.n}</span>
          {node.title}
        </span>
        {show && (node.tag === 'Untested' ? <StatusPill status="untested" /> : <Badge tone="silver">{node.tag}</Badge>)}
      </div>
      <Reveal show={show} delay={0.15} y={10}>
        <p className="mt-3 text-[clamp(1.1rem,1.55vw,1.5rem)] font-medium leading-snug text-snow">{node.text}</p>
        {node.chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {node.chips.map((c) => (
              <span key={c} className="rounded-md border border-line px-2 py-1 text-[13px] text-silver">
                {c}
              </span>
            ))}
          </div>
        )}
      </Reveal>
    </motion.div>
  )
}

function Arrow({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0.2, scale: show ? 1 : 0.8 }}
      transition={{ duration: 0.5, ease }}
      className="flex items-center justify-center text-violet-soft"
      aria-hidden
    >
      <ArrowRight size={26} className="rotate-90 lg:rotate-0" />
    </motion.div>
  )
}

function Flow({ visible }: { visible: number }) {
  return (
    <div className="grid items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-3">
      {originNodes.map((n, i) => (
        <Fragment key={n.id}>
          <FlowNode node={n} show={visible > i} />
          {i < originNodes.length - 1 && <Arrow show={visible > i + 1} />}
        </Fragment>
      ))}
    </div>
  )
}

function DruckerPanel() {
  return (
    <div className="glass rounded-2xl p-5">
      <Kicker>Drucker’s innovation framework, applied</Kicker>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Opportunity category</div>
          <div className="mt-1 text-xl font-semibold text-snow">{drucker.category}</div>
          <p className="mt-1.5 text-[15px] leading-snug text-silver">{drucker.detail}</p>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Driver</div>
          <div className="mt-1 text-xl font-semibold text-snow">{drucker.driver}</div>
        </div>
      </div>
    </div>
  )
}

function Caveat() {
  return (
    <div className="rounded-xl border-l-2 border-amber bg-amber/5 px-4 py-3 text-[clamp(1rem,1.3vw,1.25rem)] leading-snug text-snow">{originCaveat}</div>
  )
}

export default function Ch01Origin({ mode, step }: ChapterProps) {
  const present = mode === 'present'
  const s = present ? step : meta.steps - 1
  const visible = Math.max(0, Math.min(3, s)) // observation at step 1, problem 2, opportunity 3

  if (!present) {
    return (
      <Stage mode={mode}>
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />
        <div className="mt-4">
          <StageLabel stage={meta.stage} />
        </div>
        <div className="mt-8 max-w-3xl space-y-3 text-lg leading-relaxed text-silver">
          {originNarrative.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-10">
          <Flow visible={3} />
        </div>
        <div className="mt-6">
          <Caveat />
        </div>
        <div className="mt-6">
          <DruckerPanel />
        </div>
        <SourceNote className="mt-4">The observation is the team’s own experience as Imperial students. It is not research evidence; the research follows in later chapters.</SourceNote>
        <LearningCard learning={originLearning} className="mt-10" />
        <Expandable title="Idea Bank" className="mt-8">
          <p>
            The team has not yet supplied its earlier venture concepts or brainstorm records. They will appear here once supplied. Nothing in this presentation claims that Orbit was chosen over
            other ideas through a documented comparison.
          </p>
        </Expandable>
      </Stage>
    )
  }

  return (
    <Stage mode={mode}>
      <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />
      <div className="mt-3">
        <StageLabel stage={meta.stage} />
      </div>
      <AnimatePresence initial={false}>
        {s === 0 && (
          <motion.p
            key="lead"
            className="t-lead mt-5 max-w-3xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {originNarrative[0]} {originNarrative[1]}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="mt-6">
        <Flow visible={visible} />
      </div>
      <AnimatePresence initial={false}>
        {s >= 3 && (
          <motion.div key="below" className="mt-4 space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
            <Caveat />
            {s === 3 && <DruckerPanel />}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {s >= 4 && (
          <motion.div key="lc" className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LearningCard learning={originLearning} compact />
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  )
}
