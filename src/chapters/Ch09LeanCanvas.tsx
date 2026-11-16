import { AnimatePresence, motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { useCallback, useState } from 'react'
import { CanvasDrawer, CanvasGrid, DetailFields, GuessPill, type CanvasView } from '../components/model/CanvasGrid'
import { FlipCanvas, StatusNumber } from '../components/model/FlipCanvas'
import ModelHeader from '../components/model/ModelHeader'
import { Button, ChapterHeader, CountUp, EvidenceTag, Expandable, LearningCard, SourceNote, SplitHeadline, Stage, ease } from '../components/ui'
import { canvasBoxes, canvasLearning, canvasTally, riskiest, tallyLabel, type CanvasId } from '../data/canvas'
import { chapters } from '../data/chapters'
import { statusMeta } from '../data/evidence'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'lean-canvas')!

function ViewToggle({ view, onChange }: { view: CanvasView; onChange: (v: CanvasView) => void }) {
  const opts: { v: CanvasView; label: string }[] = [
    { v: 'initial', label: 'Initial hypotheses' },
    { v: 'current', label: 'Current evidence state' },
  ]
  return (
    <div className="inline-flex rounded-full border border-line bg-navy/80 p-1" role="group" aria-label="Canvas view">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={view === o.v}
          onClick={(e) => {
            e.stopPropagation()
            onChange(o.v)
          }}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${view === o.v ? 'bg-snow text-ink' : 'text-silver hover:text-snow'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Tally computed from the data: what we thought vs what we currently know. */
function Tally({ current }: { current: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {current ? (
          <motion.div key="t" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {canvasTally.map((t) => (
              <span key={t.status} className="inline-flex items-center gap-1.5 text-[15px] text-silver">
                <span className="h-2 w-2 rounded-full" style={{ background: statusMeta[t.status].color }} />
                <span className="num text-lg font-semibold text-snow">{t.count}</span> {tallyLabel(t.status, t.count)}
              </span>
            ))}
          </motion.div>
        ) : (
          <motion.span key="h" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="text-[15px] text-silver">
            <span className="num text-lg font-semibold text-snow">{canvasBoxes.length}</span> initial guesses, none yet tested against evidence
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

function RiskCallout({ compact }: { compact: boolean }) {
  return (
    <div className={`rounded-xl border border-violet/50 bg-violet/10 ${compact ? 'p-3' : 'p-5'}`}>
      <div className="flex items-center gap-2">
        <EvidenceTag label="proposed" text="Riskiest untested guess" />
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-dim">Revenue streams + Key metrics</span>
      </div>
      <p className={`mt-1.5 font-medium leading-snug text-snow ${compact ? 'text-[17px]' : 'text-xl'}`}>{riskiest.statement}</p>
      <p className={`mt-1.5 leading-snug text-silver ${compact ? 'text-[14.5px]' : 'text-base'}`}>{riskiest.principle}</p>
    </div>
  )
}


/** Present mode: one hero row over the flipping canvas. Step 0 = initial guesses, step 1 = evidence state + riskiest untested guess. */
function PresentCanvas({ step, onOpen }: { step: number; onOpen: (id: CanvasId) => void }) {
  return (
    <>
      <div className="mt-3 flex min-h-[112px] items-center" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div key="s0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }} className="flex items-baseline gap-4">
              <span className="glow-num text-[clamp(3rem,5.2vw,4.8rem)] font-semibold leading-none text-snow">
                <CountUp value={canvasBoxes.length} duration={0.8} />
              </span>
              <span className="text-[clamp(1.1rem,1.6vw,1.6rem)] text-silver">initial guesses, none tested yet</span>
            </motion.div>
          ) : (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease }} className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
                {canvasTally.map((t) => (
                  <StatusNumber key={t.status} count={t.count} status={t.status} small />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <EvidenceTag label="proposed" text="Riskiest untested guess" />
                <p className="text-[clamp(1.3rem,2.4vw,2.2rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-snow">
                  <SplitHeadline text={riskiest.short} />
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3">
        <FlipCanvas current={step >= 1} risk={step >= 1} onOpen={onOpen} rowHeight={108} />
      </div>
      <div className="mt-2.5 min-h-[38px]">
        <p className="font-mono text-[11px] text-dim">S2 · click a box for detail</p>
      </div>
    </>
  )
}

export default function Ch09LeanCanvas({ mode, step }: ChapterProps) {
  const present = mode === 'present'
  const [exploreView, setExploreView] = useState<CanvasView>('current')
  const [exploreRisk, setExploreRisk] = useState(false)
  const [open, setOpen] = useState<CanvasId | null>(null)
  const close = useCallback(() => setOpen(null), [])

  const view: CanvasView = exploreView
  const risk = exploreRisk
  const setView = setExploreView
  const toggleRisk = () => setExploreRisk((r) => !r)

  return (
    <Stage mode={mode} className={present ? 'py-[58px]! sm:py-[60px]!' : ''}>
      {present ? (
        <ModelHeader num={meta.num} kicker={meta.title} title={meta.headline.replace('not a finished blueprint.', '*not a finished blueprint.*')} stage={meta.stage} compact />
      ) : (
        <>
          <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="Week 3 taught us that the canvas is not a form to complete once. Each box below is a working hypothesis with an honest evidence status." />
          <div className="mt-3">
            <SourceNote>S2 · Week 3 lecture, Discovery and Business Model Design. Statuses are our own assessment of the evidence in this presentation.</SourceNote>
          </div>
        </>
      )}

      {present ? (
        <PresentCanvas step={step} onOpen={setOpen} />
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <ViewToggle view={view} onChange={setView} />
              <Tally current={view === 'current'} />
            </div>
            {view === 'current' && (
              <Button variant={risk ? 'primary' : 'outline'} size="sm" onClick={toggleRisk} aria-pressed={risk}>
                <Target size={14} /> {risk ? 'Show all nine boxes' : 'Show our riskiest untested guess'}
              </Button>
            )}
          </div>
          <div className="mt-4">
            <CanvasGrid view={view} risk={risk} ringRisk={view === 'current'} onOpen={setOpen} compact={false} />
          </div>
          <div className="mt-6">
            <RiskCallout compact={false} />
          </div>
          <div className="mt-10">
            <h3 className="t-h2">Every box, in full</h3>
            <p className="mt-2 max-w-3xl text-silver">Each of the nine boxes carries the same five fields. Statuses are never upgraded because a prototype exists.</p>
            <div className="mt-5 grid gap-2.5 lg:grid-cols-2">
              {canvasBoxes.map((b) => (
                <Expandable
                  key={b.id}
                  title={
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="num text-dim">{b.n}</span> {b.name} <GuessPill status={b.status} />
                    </span>
                  }
                >
                  <DetailFields b={b} />
                </Expandable>
              ))}
            </div>
          </div>
          <div className="mt-12">
            <LearningCard learning={canvasLearning} />
          </div>
        </>
      )}

      <CanvasDrawer id={open} onClose={close} />
    </Stage>
  )
}
