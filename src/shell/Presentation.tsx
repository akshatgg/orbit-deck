import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, LayoutGrid, Maximize, Minimize, NotebookPen, Timer } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { chapterComponents } from '../chapters'
import { Logo, ease } from '../components/ui'
import { chapters, stages } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { ModeToggle } from './ModeToggle'
import { ChapterGrid, PresenterPanel, fmtTime } from './PresenterPanel'
import { channel, presentHash, type SyncMsg } from './route'

export function Presentation({ idx, step, go }: { idx: number; step: number; go: (hash: string, replace?: boolean) => void }) {
  const [panel, setPanel] = useState(false)
  const [grid, setGrid] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [fs, setFs] = useState(false)
  const [immersive, setImmersive] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [now, setNow] = useState(Date.now())
  const dir = useRef(1)

  const meta = chapters[idx]
  const Chapter = chapterComponents[meta.slug]

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

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement
      if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
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
        case 'Escape':
          if (grid || panel) {
            setGrid(false)
            setPanel(false)
          } else setImmersive(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goTo, toggleFs, grid, panel])

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
        if (m.action === 'reset') setStartedAt(Date.now())
      }
    }
    channel.addEventListener('message', on)
    return () => channel?.removeEventListener('message', on)
  }, [idx, step, startedAt, next, prev, goTo])

  const elapsed = now - startedAt
  const chrome = !immersive

  return (
    <div className="atmosphere fixed inset-0 overflow-hidden text-snow">
      <div className="grid-faint pointer-events-none absolute inset-0" />

      {/* stage */}
      <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
        <motion.main
          key={meta.slug}
          custom={dir.current}
          initial={{ opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.01, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease }}
          className="scrollbar-thin absolute inset-0 overflow-y-auto overflow-x-hidden"
          aria-label={`Chapter ${meta.num}: ${meta.title}`}
        >
          <Chapter mode="present" step={step} setStep={setStep} />
        </motion.main>
      </AnimatePresence>

      {/* top chrome */}
      <motion.header
        initial={false}
        animate={{ opacity: chrome ? 1 : 0, y: chrome ? 0 : -12 }}
        className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 ${chrome ? '' : 'pointer-events-none'} hover:!opacity-100`}
      >
        <button onClick={() => goTo(0)} className="rounded-full" aria-label="Back to opening">
          <Logo size={26} />
        </button>
        <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-dim md:flex">
          <span className="text-silver">{meta.num}</span>
          <span>·</span>
          <span>{stages[meta.stage].label}</span>
          <span>·</span>
          <span className="text-silver">{meta.navLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {pitchConfig.prototypeUrl && (
            <a href={pitchConfig.prototypeUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-silver hover:bg-white/5 hover:text-snow lg:inline-flex">
              Real prototype <ExternalLink size={12} />
            </a>
          )}
          <ModeToggle mode="present" onExplore={() => go('#/explore', false)} />
          <IconBtn label="Chapters (G)" onClick={() => setGrid(true)}>
            <LayoutGrid size={16} />
          </IconBtn>
          <IconBtn label="Presenter panel (P)" onClick={() => setPanel((v) => !v)} active={panel}>
            <NotebookPen size={16} />
          </IconBtn>
          <IconBtn label="Fullscreen (F)" onClick={toggleFs}>
            {fs ? <Minimize size={16} /> : <Maximize size={16} />}
          </IconBtn>
        </div>
      </motion.header>

      {/* bottom chrome: progress + controls */}
      <div className={`absolute inset-x-0 bottom-0 z-30 px-4 pb-3 sm:px-6 transition-opacity ${chrome ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
        <div className="flex items-center gap-3">
          <IconBtn label="Previous (←)" onClick={prev}>
            <ChevronLeft size={18} />
          </IconBtn>
          <div className="flex flex-1 items-center gap-1" role="tablist" aria-label="Chapters">
            {chapters.map((c, i) => (
              <button
                key={c.slug}
                onClick={() => goTo(i)}
                title={`${c.num} ${c.navLabel}`}
                aria-label={`Go to ${c.navLabel}`}
                aria-current={i === idx}
                className="group relative h-5 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: 'var(--grad-orbit)' }}
                    initial={false}
                    animate={{ width: i < idx ? '100%' : i === idx ? `${((step + 1) / c.steps) * 100}%` : '0%' }}
                    transition={{ duration: 0.4, ease }}
                  />
                </span>
                <span className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-[11px] text-silver group-hover:block">
                  {c.num} {c.navLabel}
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowTimer((v) => !v)} className="flex items-center gap-1.5 rounded-full px-2 py-1 text-dim hover:text-silver" aria-label="Toggle timer (T)">
            <Timer size={14} />
            {showTimer && <span className="num text-xs text-silver">{fmtTime(elapsed)}</span>}
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
        onReset={() => setStartedAt(Date.now())}
        onGoto={(i) => goTo(i)}
      />
    </div>
  )
}

export function IconBtn({ children, label, onClick, active = false }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${
        active ? 'border-violet/60 bg-violet/15 text-snow' : 'border-line bg-ink/40 text-silver hover:border-violet/50 hover:text-snow'
      }`}
    >
      {children}
    </button>
  )
}
