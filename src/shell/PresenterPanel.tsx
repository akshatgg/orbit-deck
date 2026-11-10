import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ease } from '../components/ui'
import { acts, chapters, type Act } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { speakerAssignments, team } from '../data/presenters'
import { channel, type SyncMsg } from './route'

export const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const speakerOf = (slug: string) => {
  const id = speakerAssignments[slug]
  return id ? team[id].short : '—'
}

const plannedUntil = (idx: number) => chapters.slice(0, idx).reduce((s, c) => s + c.durationSec, 0) * 1000

function PanelBody({ idx, step, elapsed, onReset, onGoto }: { idx: number; step: number; elapsed: number; onReset: () => void; onGoto: (i: number) => void }) {
  const cur = chapters[idx]
  const nxt = chapters[idx + 1]
  const target = pitchConfig.targetDurationMin * 60_000
  const planned = plannedUntil(idx)
  const delta = elapsed - planned
  return (
    <div className="space-y-5 text-sm">
      <div>
        <div className="t-kicker">Now · {cur.num}</div>
        <div className="mt-1 text-xl font-semibold">{cur.title}</div>
        <div className="mt-1 text-silver">
          Speaker: <span className="text-snow">{speakerOf(cur.slug)}</span> · ~{cur.durationSec}s · step {step + 1}/{cur.steps}
        </div>
      </div>
      <ul className="space-y-2 rounded-xl border border-line bg-ink/50 p-4 text-[15px] leading-relaxed text-snow">
        {cur.notes.map((n, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
            {n}
          </li>
        ))}
      </ul>
      {nxt && (
        <div className="rounded-xl border border-line p-3">
          <div className="t-kicker !text-dim">Next · {nxt.num}</div>
          <div className="mt-1 font-medium">{nxt.title}</div>
          <div className="text-silver">Speaker: {speakerOf(nxt.slug)}</div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Elapsed" value={fmtTime(elapsed)} />
        <Stat label="Target" value={fmtTime(target)} />
        <Stat label="vs plan" value={`${delta >= 0 ? '+' : '−'}${fmtTime(Math.abs(delta))}`} tone={delta > 30_000 ? 'text-amber' : 'text-st-supported'} />
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${((idx + (step + 1) / cur.steps) / chapters.length) * 100}%`, background: 'var(--grad-orbit)' }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onReset} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
          <RotateCcw size={12} /> Reset timer
        </button>
        <button onClick={() => onGoto(0)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
          Restart pitch
        </button>
        <a href="#/presenter" target="orbit-presenter" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
          Presenter window <ExternalLink size={12} />
        </a>
      </div>
      <div>
        <div className="t-kicker mb-2 !text-dim">Running order · speakers</div>
        <ol className="space-y-0.5">
          {chapters.map((c, i) => (
            <li key={c.slug}>
              <button
                onClick={() => onGoto(i)}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-[13px] ${i === idx ? 'bg-violet/15 text-snow' : 'text-silver hover:bg-white/5'}`}
              >
                <span>
                  <span className="num mr-2 text-dim">{c.num}</span>
                  {c.navLabel}
                </span>
                <span className="text-dim">{speakerOf(c.slug)}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[11px] text-dim">Allocation is provisional — edit src/data/presenters.ts.</p>
      </div>
      <div className="text-[11px] leading-relaxed text-dim">
        Keys: → / Space next · ← back · G chapters · P panel · F fullscreen · I immersive · T timer · Esc close
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

export function PresenterPanel(props: { open: boolean; onClose: () => void; idx: number; step: number; elapsed: number; onReset: () => void; onGoto: (i: number) => void }) {
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
          <PanelBody {...props} />
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
          <h1 className="text-lg font-semibold">Orbit · Presenter view</h1>
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
            onReset={() => send({ type: 'cmd', action: 'reset' })}
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
  const byAct = (Object.keys(acts) as Act[]).map((a) => ({ act: a, items: chapters.map((c, i) => ({ c, i })).filter(({ c }) => c.act === a) }))
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
                  <div className="t-kicker mb-3">{act === 'Prologue' ? 'Prologue' : `Act ${act}`} · {acts[act]}</div>
                  <div className="space-y-2">
                    {items.map(({ c, i }) => (
                      <button
                        key={c.slug}
                        onClick={() => onPick(i)}
                        className={`glass block w-full rounded-xl px-4 py-3 text-left transition-colors hover:border-violet/50 ${i === current ? '!border-violet/70' : ''}`}
                      >
                        <div className="num text-xs text-dim">{c.num}</div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-silver">{c.question}</div>
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
