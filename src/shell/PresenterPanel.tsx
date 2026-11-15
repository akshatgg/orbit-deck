import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ease } from '../components/ui'
import { chapters, stages, type StageId } from '../data/chapters'
import { team } from '../data/team'
import { isTypingTarget } from './keys'
import { plannedPaceSec, useRehearsal, useSpeakers } from './useRehearsal'
import { channel, type SyncMsg } from './route'

export const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function PanelBody({ idx, step, elapsed, onResetTimer, onResetAll, onGoto }: { idx: number; step: number; elapsed: number; onResetTimer: () => void; onResetAll: () => void; onGoto: (i: number) => void }) {
  const speakers = useSpeakers()
  const { chapterSec, targetSec, totalSec } = useRehearsal()
  const speakerOf = (slug: string) => {
    const id = speakers[slug]
    return id ? team[id].short : '—'
  }
  const cur = chapters[idx]
  const nxt = chapters[idx + 1]
  const paceMs = plannedPaceSec(chapterSec, idx, step) * 1000
  const chapterStartMs = chapterSec.slice(0, idx).reduce((a, b) => a + b, 0) * 1000
  const delta = elapsed - paceMs
  const behind = delta > 15_000
  return (
    <div className="space-y-5 text-sm">
      <div>
        <div className="t-kicker">Now · {cur.num}</div>
        <div className="mt-1 text-xl font-semibold">{cur.title}</div>
        <div className="mt-1 text-silver">
          Speaker: <span className="text-snow">{speakerOf(cur.slug)}</span> · planned {Math.round(chapterSec[idx])}s · step {step + 1}/{cur.steps}
        </div>
      </div>
      <div>
        <div className="t-kicker mb-2 !text-dim">Click cues</div>
        <ol className="space-y-1.5 rounded-xl border border-line bg-ink/50 p-3 text-[14.5px] leading-snug">
          {cur.cues.map((n, i) => (
            <li
              key={i}
              aria-current={i === step ? 'step' : undefined}
              className={`flex gap-2.5 rounded-lg px-2 py-1.5 ${i === step ? 'bg-violet/20 text-snow ring-1 ring-violet/50' : i < step ? 'text-dim' : 'text-silver'}`}
            >
              <span className="num mt-px w-4 shrink-0 text-right text-xs text-dim">{i + 1}</span>
              {n}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <div className="t-kicker mb-2 !text-dim">Script</div>
        <p className="scrollbar-thin max-h-56 overflow-y-auto rounded-xl border border-line bg-ink/50 p-3 text-[14.5px] leading-relaxed text-snow/90">{cur.script}</p>
      </div>
      {nxt && (
        <div className="rounded-xl border border-line p-3">
          <div className="t-kicker !text-dim">Next · {nxt.num}</div>
          <div className="mt-1 font-medium">{nxt.title}</div>
          <div className="text-silver">Speaker: {speakerOf(nxt.slug)}</div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Elapsed" value={fmtTime(elapsed)} tone={behind ? 'text-amber' : 'text-snow'} />
        <Stat label="Planned now" value={fmtTime(paceMs)} />
        <Stat label="vs plan" value={`${delta >= 0 ? '+' : '−'}${fmtTime(Math.abs(delta))}`} tone={behind ? 'text-amber' : 'text-st-supported'} />
      </div>
      <div className="text-[12px] text-dim">
        Target {fmtTime(targetSec * 1000)} · allocated {fmtTime(totalSec * 1000)} · this chapter starts at {fmtTime(chapterStartMs)} in plan
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${((idx + (step + 1) / cur.steps) / chapters.length) * 100}%`, background: 'var(--grad-orbit)' }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onResetTimer} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
          <RotateCcw size={12} /> Reset timer
        </button>
        <button onClick={onResetAll} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
          Reset to chapter 0
        </button>
        <a href="#/presenter" target="orbit-presenter" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
          Presenter window <ExternalLink size={12} />
        </a>
        <a href="#/rehearse" target="orbit-rehearse" className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 px-3 py-1.5 text-xs text-violet-soft hover:text-snow">
          Rehearsal view <ExternalLink size={12} />
        </a>
      </div>
      <div>
        <div className="t-kicker mb-2 !text-dim">Running order · speakers · planned time</div>
        <ol className="space-y-0.5">
          {chapters.map((c, i) => (
            <li key={c.slug}>
              <button
                onClick={() => onGoto(i)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-left text-[13px] ${i === idx ? 'bg-violet/15 text-snow' : 'text-silver hover:bg-white/5'}`}
              >
                <span className="min-w-0 truncate">
                  <span className="num mr-2 text-dim">{c.num}</span>
                  {c.navLabel}
                </span>
                <span className="shrink-0 text-dim">
                  <span className="num mr-2">{Math.round(chapterSec[i])}s</span>
                  {speakerOf(c.slug)}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[11px] text-dim">Speakers and timings are editable in the Rehearsal view.</p>
      </div>
      <div className="text-[11px] leading-relaxed text-dim">
        Keys: → / Space next · ← back · N notes · J journey · A assumptions · G chapters · P panel · T timer · F fullscreen · I immersive · ? help · Esc close
      </div>
    </div>
  )
}

function Stat({ label, value, tone = 'text-snow' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-line px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-dim">{label}</div>
      <div className={`num text-lg ${tone}`}>{value}</div>
    </div>
  )
}

export function PresenterPanel(props: { open: boolean; onClose: () => void; idx: number; step: number; elapsed: number; onResetTimer: () => void; onResetAll: () => void; onGoto: (i: number) => void }) {
  return (
    <AnimatePresence>
      {props.open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease }}
          className="glass-strong scrollbar-thin fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto p-6"
          aria-label="Presenter panel"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Presenter</div>
            <button onClick={props.onClose} aria-label="Close presenter panel" className="rounded-full p-1 text-silver hover:text-snow">
              <X size={18} />
            </button>
          </div>
          <PanelBody idx={props.idx} step={props.step} elapsed={props.elapsed} onResetTimer={props.onResetTimer} onResetAll={props.onResetAll} onGoto={props.onGoto} />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

/** Stand-alone presenter window (#/presenter) — open on the laptop while the projector shows the pitch. */
export function PresenterWindow() {
  const [state, setState] = useState<{ idx: number; step: number; startedAt: number } | null>(null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!channel) return
    const on = (e: MessageEvent<SyncMsg>) => {
      if (e.data.type === 'state') setState({ idx: e.data.idx, step: e.data.step, startedAt: e.data.startedAt })
    }
    channel.addEventListener('message', on)
    channel.postMessage({ type: 'hello' } satisfies SyncMsg)
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      channel?.removeEventListener('message', on)
      clearInterval(t)
    }
  }, [])
  const send = (m: SyncMsg) => channel?.postMessage(m)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        send({ type: 'cmd', action: 'next' })
      }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) send({ type: 'cmd', action: 'prev' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <div className="atmosphere min-h-full p-6 text-snow">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">ORBIT · Presenter view</h1>
          <div className="flex gap-2">
            <button onClick={() => send({ type: 'cmd', action: 'prev' })} className="rounded-full border border-line px-4 py-2 text-sm">← Prev</button>
            <button onClick={() => send({ type: 'cmd', action: 'next' })} className="rounded-full bg-snow px-4 py-2 text-sm font-medium text-ink">Next →</button>
          </div>
        </div>
        {state ? (
          <PanelBody
            idx={state.idx}
            step={state.step}
            elapsed={now - state.startedAt}
            onResetTimer={() => send({ type: 'cmd', action: 'resetTimer' })}
            onResetAll={() => send({ type: 'cmd', action: 'reset' })}
            onGoto={(i) => send({ type: 'cmd', action: 'goto', idx: i })}
          />
        ) : (
          <p className="text-silver">Waiting for the presentation tab… keep the pitch open in another window of this browser.</p>
        )}
      </div>
    </div>
  )
}

export function ChapterGrid({ open, current, onClose, onPick }: { open: boolean; current: number; onClose: () => void; onPick: (i: number) => void }) {
  const byAct = (Object.keys(stages) as StageId[]).map((a) => ({ act: a, items: chapters.map((c, i) => ({ c, i })).filter(({ c }) => c.stage === a) }))
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 overflow-y-auto bg-ink/90 p-6 backdrop-blur-xl sm:p-12"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          data-no-nav
          aria-label="Chapter navigation"
        >
          <div className="mx-auto max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="t-h2">Chapters</h2>
              <button onClick={onClose} aria-label="Close" className="rounded-full border border-line p-2 text-silver hover:text-snow">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {byAct.map(({ act, items }) => (
                <div key={act}>
                  <div className="t-kicker mb-3">{stages[act].label}</div>
                  <div className="space-y-2">
                    {items.map(({ c, i }) => (
                      <button
                        key={c.slug}
                        onClick={() => onPick(i)}
                        className={`glass block w-full rounded-xl px-4 py-3 text-left transition-colors hover:border-violet/50 ${i === current ? '!border-violet/70' : ''}`}
                      >
                        <div className="num text-xs text-dim">{c.num}</div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-silver">{c.headline}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
