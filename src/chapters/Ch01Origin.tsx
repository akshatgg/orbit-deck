import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, HelpCircle, Lightbulb, type LucideIcon } from 'lucide-react'
import { Fragment } from 'react'
import {
  Badge,
  ChapterHeader,
  Expandable,
  Kicker,
  Accent,
  LearningCard,
  LearningStrip,
  Reveal,
  SourceNote,
  Stage,
  StageLabel,
  StatusPill,
  ease,
} from '../components/ui'
import { chapters } from '../data/chapters'
import { caveatShort, drucker, originCaveat, originLead, originLearning, originNarrative, originNodes, originShort, originStrip } from '../data/origin'
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

const NODE_ICON: Record<string, LucideIcon> = { observation: Eye, problem: HelpCircle, opportunity: Lightbulb }
const NODE_COLOR: Record<string, string> = { observation: '#38bdf8', problem: '#fbbf24', opportunity: '#8b5cf6' }

/** Present-mode glowing nodes: one short line each, joined by a drawn connector. */
function GlowFlow({ visible }: { visible: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3 sm:gap-0">
      {originNodes.map((n, i) => {
        const show = visible > i
        const Icon = NODE_ICON[n.id]
        const c = NODE_COLOR[n.id]
        return (
          <div key={n.id} className="relative flex flex-col items-center px-3 text-center">
            {i > 0 && (
              <div className="absolute left-[-50%] right-[50%] top-[35px] hidden h-px sm:block" aria-hidden>
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-violet/20 via-violet to-violet/20"
                  initial={false}
                  animate={{ scaleX: show ? 1 : 0, opacity: show ? 1 : 0 }}
                  transition={{ duration: 0.9, ease }}
                  style={{ boxShadow: '0 0 14px rgb(139 92 246 / 0.9)' }}
                />
              </div>
            )}
            <motion.div
              initial={false}
              animate={{ opacity: show ? 1 : 0.22, scale: show ? 1 : 0.8 }}
              transition={{ duration: 0.8, ease }}
              className="relative grid h-[72px] w-[72px] place-items-center rounded-full border bg-ink/80"
              style={{ borderColor: `color-mix(in srgb, ${c} 60%, transparent)`, color: c, boxShadow: show ? `0 0 0 6px color-mix(in srgb, ${c} 10%, transparent), 0 0 50px -4px ${c}, inset 0 0 24px -8px ${c}` : 'none' }}
            >
              <Icon size={30} aria-hidden />
              <span className="num absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border border-line bg-navy text-[12px] text-snow">{n.n}</span>
            </motion.div>
            <Reveal show={show} delay={0.2} y={12} className="mt-4">
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: c }}>{n.title}</span>
                {n.tag === 'Untested' ? <StatusPill status="untested" /> : <Badge tone="silver">{n.tag}</Badge>}
              </div>
              <p className="mx-auto mt-2 max-w-[17rem] text-balance text-[clamp(1.1rem,1.6vw,1.5rem)] font-medium leading-snug text-snow">{originShort[n.id]}</p>
            </Reveal>
          </div>
        )
      })}
    </div>
  )
}

const DruckerChips = () => (
  <div className="flex flex-wrap items-center justify-center gap-2.5">
    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">Drucker</span>
    {[drucker.category, 'Demand-pull'].map((c) => (
      <span key={c} className="rounded-full border border-violet/40 bg-violet/10 px-4 py-1.5 text-[17px] font-medium text-violet-soft" style={{ boxShadow: '0 0 28px -8px rgb(139 92 246 / 0.7)' }}>
        {c}
      </span>
    ))}
  </div>
)

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
      <ChapterHeader num={meta.num} kicker={meta.title} title="It started with *a problem we experienced ourselves.*" />
      <div className="mt-3">
        <StageLabel stage={meta.stage} />
      </div>
      <AnimatePresence initial={false}>
        {s === 0 && (
          <motion.p
            key="lead"
            className="mt-6 text-[clamp(1.4rem,2.2vw,2.2rem)] text-silver"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Accent>{originLead}</Accent>
          </motion.p>
        )}
      </AnimatePresence>
      <div className="mt-7">
        <GlowFlow visible={visible} />
      </div>
      <AnimatePresence initial={false}>
        {s >= 3 && (
          <motion.div key="below" className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
            <DruckerChips />
            <p className="border-l-2 border-amber pl-4 text-left text-[clamp(1rem,1.3vw,1.25rem)] leading-snug text-snow">{caveatShort}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {s >= 4 && (
          <motion.div key="lc" className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LearningStrip {...originStrip} className="justify-center" />
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  )
}
