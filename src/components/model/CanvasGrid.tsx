import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { canvasBoxes, riskiest, type CanvasBox, type CanvasId } from '../../data/canvas'
import { statusMeta } from '../../data/evidence'
import { EvidenceTag, StatusPill, ease } from '../ui'

/** Placement on the 10-column Lean Canvas grid (lg and up). Below lg the boxes stack. */
const place: Record<CanvasId, string> = {
  problem: 'lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1',
  solution: 'lg:col-span-2 lg:col-start-3 lg:row-start-1',
  metrics: 'lg:col-span-2 lg:col-start-3 lg:row-start-2',
  uvp: 'lg:col-span-2 lg:col-start-5 lg:row-span-2 lg:row-start-1',
  advantage: 'lg:col-span-2 lg:col-start-7 lg:row-start-1',
  channels: 'lg:col-span-2 lg:col-start-7 lg:row-start-2',
  segments: 'lg:col-span-2 lg:col-start-9 lg:row-span-2 lg:row-start-1',
  cost: 'lg:col-span-5 lg:col-start-1 lg:row-start-3',
  revenue: 'lg:col-span-5 lg:col-start-6 lg:row-start-3',
}
const order: CanvasId[] = ['problem', 'solution', 'metrics', 'uvp', 'advantage', 'channels', 'segments', 'cost', 'revenue']

export type CanvasView = 'initial' | 'current'

export function CanvasGrid({
  view,
  risk,
  ringRisk = false,
  onOpen,
  compact,
}: {
  view: CanvasView
  /** Dim everything except the riskiest-assumption boxes. */
  risk: boolean
  /** Outline the riskiest-assumption boxes without dimming. */
  ringRisk?: boolean
  onOpen: (id: CanvasId) => void
  compact: boolean
}) {
  const current = view === 'current'
  return (
    <div
      className={`grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-10 ${compact ? 'lg:auto-rows-[minmax(112px,auto)]' : 'lg:auto-rows-[minmax(150px,auto)]'}`}
      role="group"
      aria-label="Lean Canvas, nine boxes"
    >
      {order.map((id, i) => {
        const b = canvasBoxes.find((x) => x.id === id)!
        const isRisk = riskiest.linked.includes(id)
        return <Box key={id} b={b} i={i} current={current} dim={risk && !isRisk} ring={(risk || ringRisk) && isRisk} onOpen={onOpen} compact={compact} className={place[id]} />
      })}
    </div>
  )
}

function Box({ b, i, current, dim, ring, onOpen, compact, className }: { b: CanvasBox; i: number; current: boolean; dim: boolean; ring: boolean; onOpen: (id: CanvasId) => void; compact: boolean; className: string }) {
  const colour = statusMeta[b.status].color
  const tint = current ? colour : 'var(--color-silver)'
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onOpen(b.id)
      }}
      aria-label={`${b.n}. ${b.name}: ${current ? `${statusMeta[b.status].label}. ${b.current}` : b.initial}. Open details.`}
      initial={false}
      animate={{ opacity: dim ? 0.28 : 1 }}
      transition={{ duration: 0.5, ease }}
      className={`group relative flex min-h-0 flex-col overflow-hidden rounded-xl border p-3 text-left ${compact ? 'lg:p-3' : 'p-4'} ${className}`}
      style={{
        borderColor: ring ? 'var(--color-ev-proposed)' : `color-mix(in srgb, ${tint} ${current ? 50 : 22}%, transparent)`,
        background: `color-mix(in srgb, ${tint} ${current ? 9 : 4}%, var(--color-navy))`,
        boxShadow: ring ? '0 0 0 1px var(--color-ev-proposed), 0 0 28px -8px var(--color-ev-proposed)' : 'none',
        transition: `border-color .8s ease ${i * 0.07}s, background-color .8s ease ${i * 0.07}s, box-shadow .5s ease`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
          <span className="num text-dim">{b.n}</span> {b.name}
        </span>
        {ring && <span className="rounded-full border border-violet/50 bg-violet/15 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-violet-soft">Riskiest</span>}
      </div>
      <div className={`relative mt-1.5 flex-1 ${compact ? 'min-h-[3.4rem]' : 'min-h-[4.5rem]'}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current ? 'c' : 'i'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease, delay: current ? i * 0.04 : 0 }}
            className={`leading-snug ${current ? 'text-snow' : 'text-silver'} ${compact ? 'text-[14.5px]' : 'text-[15.5px]'}`}
          >
            {current ? b.current : b.initial}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-1.5 flex h-6 items-center justify-between">
        <motion.span initial={false} animate={{ opacity: current ? 1 : 0, y: current ? 0 : 4 }} transition={{ duration: 0.5, ease, delay: current ? 0.15 + i * 0.07 : 0 }} aria-hidden={!current}>
          <StatusPill status={b.status} />
        </motion.span>
        {!current && <span className="font-mono text-[10px] uppercase tracking-wider text-dim">Hypothesis</span>}
        <span className="font-mono text-[10px] uppercase tracking-wider text-dim opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Details</span>
      </div>
    </motion.button>
  )
}

export function DetailFields({ b }: { b: CanvasBox }) {
  const rows: { t: string; body: string; tag?: 'proposed' | 'modelled' }[] = [
    { t: 'Our working hypothesis', body: b.hypothesis },
    { t: 'Evidence currently available', body: b.evidence },
    { t: 'Next experiment', body: b.nextExperiment, tag: 'proposed' },
    { t: 'What would change the assumption', body: b.wouldChange },
  ]
  return (
    <div className="space-y-4">
      <div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Evidence status</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <StatusPill status={b.status} />
          <span className="text-sm text-silver">{statusMeta[b.status].meaning}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-silver">{b.statusWhy}</p>
      </div>
      {rows.map((r) => (
        <div key={r.t}>
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">
            {r.t}
            {r.tag && <EvidenceTag label={r.tag} />}
          </div>
          <p className="mt-1.5 text-[15px] leading-relaxed text-snow">{r.body}</p>
        </div>
      ))}
    </div>
  )
}

export function CanvasDrawer({ id, onClose }: { id: CanvasId | null; onClose: () => void }) {
  const b = id ? canvasBoxes.find((x) => x.id === id)! : null
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!id) return
    closeRef.current?.focus()
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [id, onClose])
  return (
    <AnimatePresence>
      {b && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/60"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label={`${b.name} details`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong scrollbar-thin fixed inset-y-0 right-0 z-[71] w-full max-w-[460px] overflow-y-auto p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Lean Canvas box {b.n} of 9</div>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-snow">{b.name}</h3>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close details" className="rounded-full border border-line p-2 text-silver hover:text-snow">
                <X size={16} />
              </button>
            </div>
            <div className="mt-5">
              <DetailFields b={b} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
