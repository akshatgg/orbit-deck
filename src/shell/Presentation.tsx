import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CircleHelp, ExternalLink, LayoutGrid, ListChecks, Maximize, Minimize, NotebookPen, Orbit, ScrollText, Timer, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { chapterComponents } from '../chapters'
import { JourneyMap } from '../components/journey/JourneyMap'
import { OrbitField } from '../components/OrbitField'
import { AssumptionTracker } from '../components/tracker/AssumptionTracker'
import { Logo, ease } from '../components/ui'
import { chapterIndex, chapters, stages } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { team } from '../data/team'
import { inNoNav, isTypingTarget } from './keys'
import { ModeToggle } from './ModeToggle'
import { ChapterGrid, PresenterPanel, fmtTime } from './PresenterPanel'
import { ResetButton } from './ResetButton'
import { channel, presentHash, type SyncMsg } from './route'
import { StageStrip } from './StageStrip'
import { plannedPaceSec, useRehearsal, useSpeakers } from './useRehearsal'

/** Slack before the timer turns amber (seconds past planned pace). */
const PACE_TOLERANCE_SEC = 15

const SHORTCUTS: [string, string][] = [
  ['→  Space  PageDown', 'Next step / chapter'],
  ['←  PageUp', 'Previous step / chapter'],
  ['Home  End', 'First / last chapter'],
  ['N', 'Presenter notes (script + cue)'],
  ['J', 'Venture Journey Map'],
  ['A', 'Assumption Tracker'],
  ['G', 'Chapter grid'],
  ['P', 'Presenter panel'],
  ['T', 'Timer (elapsed vs target)'],
  ['F', 'Fullscreen'],
  ['I', 'Immersive (hide chrome)'],
  ['?', 'This sheet'],
  ['Esc', 'Close overlay / leave immersive'],
]

export function Presentation({ idx, step, go }: { idx: number; step: number; go: (hash: string, replace?: boolean) => void }) {
  const [panel, setPanel] = useState(false)
  const [grid, setGrid] = useState(false)
  const [tracker, setTracker] = useState(false)
  const [journey, setJourney] = useState(false)
  const [help, setHelp] = useState(false)
  const [notes, setNotes] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [fs, setFs] = useState(false)
  const [immersive, setImmersive] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [now, setNow] = useState(Date.now())
  const dir = useRef(1)

  const speakers = useSpeakers()
  const { chapterSec, targetSec } = useRehearsal()

  const meta = chapters[idx]
  const Chapter = chapterComponents[meta.slug]
  const modal = grid || journey || help

  const goTo = useCallback(
    (i: number, s = 0) => {
      const ni = Math.max(0, Math.min(chapters.length - 1, i))
      dir.current = ni >= idx ? 1 : -1
      go(presentHash(ni, Math.max(0, Math.min(chapters[ni].steps - 1, s))))
    },
    [go, idx],
  )

  const next = useCallback(() => {
    if (step < meta.steps - 1) go(presentHash(idx, step + 1))
    else if (idx < chapters.length - 1) goTo(idx + 1, 0)
  }, [step, meta.steps, idx, go, goTo])

  const prev = useCallback(() => {
    if (step > 0) go(presentHash(idx, step - 1))
    else if (idx > 0) goTo(idx - 1, chapters[idx - 1].steps - 1)
  }, [step, idx, go, goTo])

  const setStep = useCallback(
    (s: number) => {
      if (s >= meta.steps) goTo(idx + 1, 0)
      else go(presentHash(idx, Math.max(0, s)))
    },
    [meta.steps, idx, go, goTo],
  )

  const resetAll = useCallback(() => {
    dir.current = -1
    go(presentHash(0, 0))
    setStartedAt(Date.now())
    setNow(Date.now())
  }, [go])

  const goSlug = useCallback(
    (slug: string) => {
      const i = chapterIndex(slug)
      if (i >= 0) goTo(i, 0)
      setJourney(false)
      setTracker(false)
    },
    [goTo],
  )

  const toggleFs = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
      setImmersive(true)
    } else document.exitFullscreen?.()
  }, [])

  useEffect(() => {
    const on = () => {
      const f = !!document.fullscreenElement
      setFs(f)
      if (!f) setImmersive(false)
    }
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // keyboard — ignored while typing in fields / sliders / selects so those controls keep their own keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const navKey = ['ArrowRight', 'PageDown', ' ', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(e.key)
      if (navKey && modal) return // a full-screen overlay owns the keyboard
      if (e.key === ' ' && inNoNav(e.target)) return // Space activates a focused panel button
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          prev()
          break
        case 'Home':
          goTo(0)
          break
        case 'End':
          goTo(chapters.length - 1)
          break
        case 'f':
        case 'F':
          toggleFs()
          break
        case 'p':
        case 'P':
          setPanel((v) => !v)
          setTracker(false)
          break
        case 'g':
        case 'G':
          setGrid((v) => !v)
          break
        case 't':
        case 'T':
          setShowTimer((v) => !v)
          break
        case 'i':
        case 'I':
          setImmersive((v) => !v)
          break
        case 'n':
        case 'N':
          setNotes((v) => !v)
          break
        case 'j':
        case 'J':
          setJourney((v) => !v)
          break
        case 'a':
        case 'A':
          setTracker((v) => !v)
          setPanel(false)
          break
        case '?':
          setHelp((v) => !v)
          break
        case 'Escape':
          if (help) setHelp(false)
          else if (journey) setJourney(false)
          else if (grid) setGrid(false)
          else if (tracker || panel) {
            setTracker(false)
            setPanel(false)
          } else if (notes) setNotes(false)
          else setImmersive(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goTo, toggleFs, modal, help, journey, grid, tracker, panel, notes])

  // presenter-window sync
  useEffect(() => {
    channel?.postMessage({ type: 'state', idx, step, startedAt } satisfies SyncMsg)
  }, [idx, step, startedAt])
  useEffect(() => {
    if (!channel) return
    const on = (e: MessageEvent<SyncMsg>) => {
      const m = e.data
      if (m.type === 'hello') channel?.postMessage({ type: 'state', idx, step, startedAt } satisfies SyncMsg)
      if (m.type === 'cmd') {
        if (m.action === 'next') next()
        if (m.action === 'prev') prev()
        if (m.action === 'goto' && m.idx != null) goTo(m.idx)
        if (m.action === 'resetTimer') setStartedAt(Date.now())
        if (m.action === 'reset') resetAll()
      }
    }
    channel.addEventListener('message', on)
    return () => channel?.removeEventListener('message', on)
  }, [idx, step, startedAt, next, prev, goTo, resetAll])

  const elapsed = now - startedAt
  const chrome = !immersive
  const paceSec = plannedPaceSec(chapterSec, idx, step)
  const overPace = elapsed / 1000 > paceSec + PACE_TOLERANCE_SEC
  const speakerName = speakers[meta.slug] ? team[speakers[meta.slug]].name : '—'

  const pickStage = (s: keyof typeof stages) => {
    const i = chapters.findIndex((c) => c.stage === s)
    if (i >= 0) goTo(i)
  }

  const openOnly = (which: 'journey' | 'tracker') => {
    if (which === 'journey') {
      setJourney((v) => !v)
    } else {
      setTracker((v) => !v)
      setPanel(false)
    }
  }

  return (
    <div
      className="atmosphere fixed inset-0 overflow-hidden text-snow"
      onPointerMove={(e) => {
        const el = e.currentTarget
        el.style.setProperty('--mx', `${e.clientX}px`)
        el.style.setProperty('--my', `${e.clientY}px`)
      }}
    >
      <div className="grid-faint pointer-events-none absolute inset-0" />
      {/* evolving constellation of evidence: grows with the journey, freezes for the verdict, converges at the finale */}
      {idx > 0 && (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: meta.slug === 'verdict' && step < meta.steps - 1 ? 0.45 : 1 }} transition={{ duration: 1.2 }}>
          <OrbitField
            intensity={0.22 + 0.78 * (idx / (chapters.length - 1))}
            converge={meta.slug === 'verdict' && step === meta.steps - 1 ? 1 : 0}
            freeze={meta.slug === 'verdict' && step < meta.steps - 1}
            labels={false}
            dim={!(meta.slug === 'verdict' && step === meta.steps - 1)}
          />
        </motion.div>
      )}
      <div className="spotlight pointer-events-none absolute inset-0" />

      {/* stage — chapters swing through depth in the direction of travel */}
      <div className="absolute inset-0" style={{ perspective: 1600 }}>
        <AnimatePresence mode="popLayout" custom={dir.current}>
          <motion.main
            key={meta.slug}
            custom={dir.current}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 90 * d, rotateY: -14 * d, scale: 0.92, filter: 'blur(12px)' }),
              center: { opacity: 1, x: 0, rotateY: 0, scale: 1, filter: 'blur(0px)' },
              exit: (d: number) => ({ opacity: 0, x: -90 * d, rotateY: 14 * d, scale: 0.94, filter: 'blur(12px)' }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.75, ease }}
            style={{ transformOrigin: '50% 50%' }}
            className="scrollbar-thin absolute inset-0 overflow-y-auto overflow-x-hidden"
            aria-label={`Chapter ${meta.num}: ${meta.title}`}
          >
            <Chapter mode="present" step={step} setStep={setStep} />
          </motion.main>
        </AnimatePresence>
      </div>

      {/* top chrome */}
      <motion.header
        initial={false}
        animate={{ opacity: chrome ? 1 : 0, y: chrome ? 0 : -12 }}
        className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 ${chrome ? '' : 'pointer-events-none'} hover:!opacity-100`}
      >
        <button onClick={() => goTo(0)} className="shrink-0 rounded-full" aria-label="Back to opening">
          <Logo size={26} />
        </button>
        <div className="hidden min-w-0 md:block">
          <StageStrip meta={meta} onPick={pickStage} />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim md:hidden">
          <span style={{ color: stages[meta.stage].color }}>{stages[meta.stage].n}</span> · {meta.num}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {pitchConfig.prototypeUrl && (
            <a href={pitchConfig.prototypeUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-silver hover:bg-white/5 hover:text-snow 2xl:inline-flex">
              Real prototype <ExternalLink size={12} />
            </a>
          )}
          <TextBtn label="Journey Map (J)" text="Journey" onClick={() => openOnly('journey')} active={journey} icon={<Orbit size={15} />} />
          <TextBtn label="Assumption Tracker (A)" text="Assumptions" onClick={() => openOnly('tracker')} active={tracker} icon={<ListChecks size={15} />} />
          <ModeToggle mode="present" onExplore={() => go('#/explore', false)} />
          <IconBtn label="Chapters (G)" onClick={() => setGrid(true)}>
            <LayoutGrid size={16} />
          </IconBtn>
          <IconBtn label="Presenter notes (N)" onClick={() => setNotes((v) => !v)} active={notes}>
            <ScrollText size={16} />
          </IconBtn>
          <IconBtn label="Presenter panel (P)" onClick={() => { setPanel((v) => !v); setTracker(false) }} active={panel} className="hidden sm:grid">
            <NotebookPen size={16} />
          </IconBtn>
          <ResetButton onReset={resetAll} />
          <IconBtn label="Fullscreen (F)" onClick={toggleFs} className="hidden sm:grid">
            {fs ? <Minimize size={16} /> : <Maximize size={16} />}
          </IconBtn>
          <IconBtn label="Keyboard shortcuts (?)" onClick={() => setHelp(true)} className="hidden lg:grid">
            <CircleHelp size={16} />
          </IconBtn>
        </div>
      </motion.header>

      {/* presenter notes overlay */}
      <AnimatePresence>
        {notes && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease }}
            data-no-nav
            aria-label="Presenter notes"
            className="glass-strong absolute inset-x-3 bottom-14 z-30 mx-auto max-w-4xl rounded-2xl p-4 shadow-2xl sm:inset-x-6 sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-silver">
              <span className="rounded-full border border-violet/40 bg-violet/10 px-2.5 py-0.5 font-medium text-violet-soft">Speaker · {speakerName}</span>
              <span className="num">
                {meta.num} · step {step + 1}/{meta.steps}
              </span>
              <span className="num">planned {Math.round(chapterSec[idx])}s</span>
              <button onClick={() => setNotes(false)} aria-label="Close notes" className="ml-auto rounded-full p-1 text-silver hover:text-snow">
                <X size={16} />
              </button>
            </div>
            <p className="mt-2 text-lg font-semibold leading-snug text-snow">
              <span className="num mr-2 text-sm font-normal text-violet-soft">Cue {step + 1}</span>
              {meta.cues[step] ?? '—'}
            </p>
            <p className="scrollbar-thin mt-2 max-h-36 overflow-y-auto pr-2 text-[15px] leading-relaxed text-snow/85">{meta.script}</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* bottom chrome: stage-grouped progress + controls */}
      <div className={`absolute inset-x-0 bottom-0 z-30 px-4 pb-3 transition-opacity sm:px-6 ${chrome ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
        <div className="flex items-center gap-3">
          <IconBtn label="Previous (←)" onClick={prev}>
            <ChevronLeft size={18} />
          </IconBtn>
          <div className="flex flex-1 items-center" role="tablist" aria-label="Chapters, grouped by stage">
            {chapters.map((c, i) => {
              const col = stages[c.stage].color
              const groupStart = i > 0 && chapters[i - 1].stage !== c.stage
              return (
                <button
                  key={c.slug}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${c.navLabel}, stage ${stages[c.stage].n}`}
                  aria-current={i === idx}
                  className={`group relative h-6 flex-1 ${groupStart ? 'ml-2.5' : 'ml-0.5'} ${i === 0 ? '!ml-0' : ''}`}
                >
                  <span className={`absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-full transition-all ${i === idx ? 'h-1' : 'h-[3px]'}`} style={{ background: `color-mix(in srgb, ${col} 18%, rgb(255 255 255 / 0.06))` }}>
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: col }}
                      initial={false}
                      animate={{ width: i < idx ? '100%' : i === idx ? `${((step + 1) / c.steps) * 100}%` : '0%' }}
                      transition={{ duration: 0.4, ease }}
                    />
                  </span>
                  <span className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[11px] text-silver group-hover:block group-focus-visible:block">
                    <span style={{ color: col }}>{stages[c.stage].n}</span> · {c.num} {c.navLabel}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setShowTimer((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1 hover:text-silver ${showTimer && overPace ? 'text-amber' : 'text-dim'}`}
            aria-label="Toggle timer (T)"
            title={showTimer ? (overPace ? 'Behind planned pace' : 'On planned pace') : 'Show timer (T)'}
          >
            <Timer size={14} />
            {showTimer && (
              <span className={`num text-xs ${overPace ? 'text-amber' : 'text-silver'}`}>
                {fmtTime(elapsed)} <span className="text-dim">/ {fmtTime(targetSec * 1000)}</span>
              </span>
            )}
          </button>
          <IconBtn label="Next (→ / Space)" onClick={next}>
            <ChevronRight size={18} />
          </IconBtn>
        </div>
      </div>

      <ChapterGrid open={grid} current={idx} onClose={() => setGrid(false)} onPick={(i) => { goTo(i); setGrid(false) }} />
      <PresenterPanel
        open={panel}
        onClose={() => setPanel(false)}
        idx={idx}
        step={step}
        elapsed={elapsed}
        onResetTimer={() => setStartedAt(Date.now())}
        onResetAll={resetAll}
        onGoto={(i) => goTo(i)}
      />

      {/* Assumption Tracker side panel */}
      <AnimatePresence>
        {tracker && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
            data-no-nav
            aria-label="Assumption tracker"
            className="glass-strong scrollbar-thin fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="t-kicker">Assumption tracker</div>
                <div className="mt-1 font-semibold">What we believe vs what we can show</div>
              </div>
              <button onClick={() => setTracker(false)} aria-label="Close assumption tracker" className="rounded-full p-1 text-silver hover:text-snow">
                <X size={18} />
              </button>
            </div>
            <AssumptionTracker currentChapterIdx={idx} onGoChapter={goSlug} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Journey Map overlay */}
      <AnimatePresence>
        {journey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Venture Journey Map"
            data-no-nav
            className="scrollbar-thin fixed inset-0 z-[60] overflow-y-auto bg-ink/95 px-4 py-6 backdrop-blur-xl sm:px-10 sm:py-10"
          >
            <div className="mx-auto max-w-[1400px]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="t-kicker">Venture journey · reached so far</div>
                  <h2 className="t-h2 mt-2">From idea to evidence</h2>
                </div>
                <button autoFocus onClick={() => setJourney(false)} aria-label="Close journey map (Esc)" className="rounded-full border border-line p-2 text-silver hover:text-snow">
                  <X size={18} />
                </button>
              </div>
              <JourneyMap currentChapterIdx={idx} onGoChapter={goSlug} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* shortcuts sheet */}
      <AnimatePresence>
        {help && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            data-no-nav
            onClick={() => setHelp(false)}
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          >
            <div onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-md rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Keyboard shortcuts</h2>
                <button autoFocus onClick={() => setHelp(false)} aria-label="Close" className="rounded-full p-1 text-silver hover:text-snow">
                  <X size={18} />
                </button>
              </div>
              <dl className="space-y-2 text-sm">
                {SHORTCUTS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="num rounded-md border border-line bg-ink/60 px-2 py-0.5 text-xs text-snow">{k}</dt>
                    <dd className="text-right text-silver">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11px] text-dim">Shortcuts pause while you type or use a slider, select or text field.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function IconBtn({ children, label, onClick, active = false, className = '' }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
        active ? 'border-violet/60 bg-violet/15 text-snow' : 'border-line bg-ink/40 text-silver hover:border-violet/50 hover:text-snow'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function TextBtn({ label, text, icon, onClick, active }: { label: string; text: string; icon: React.ReactNode; onClick: () => void; active: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors lg:px-3 ${
        active ? 'border-violet/60 bg-violet/15 text-snow' : 'border-line bg-ink/40 text-silver hover:border-violet/50 hover:text-snow'
      }`}
    >
      {icon}
      <span className="hidden lg:inline">{text}</span>
    </button>
  )
}
