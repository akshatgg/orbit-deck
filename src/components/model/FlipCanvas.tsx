import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { canvasBoxes, canvasShort, riskiest, statusLabel, tallyLabel, type CanvasBox, type CanvasId } from '../../data/canvas'
import { statusMeta } from '../../data/evidence'
import { CountUp, ease } from '../ui'

/** Placement on the 10-column Lean Canvas grid. */
const place: Record<CanvasId, string> = {
  problem: 'col-span-2 col-start-1 row-span-2 row-start-1',
  solution: 'col-span-2 col-start-3 row-start-1',
  metrics: 'col-span-2 col-start-3 row-start-2',
  uvp: 'col-span-2 col-start-5 row-span-2 row-start-1',
  advantage: 'col-span-2 col-start-7 row-start-1',
  channels: 'col-span-2 col-start-7 row-start-2',
  segments: 'col-span-2 col-start-9 row-span-2 row-start-1',
  cost: 'col-span-5 col-start-1 row-start-3',
  revenue: 'col-span-5 col-start-6 row-start-3',
}
const order: CanvasId[] = ['problem', 'solution', 'metrics', 'uvp', 'advantage', 'channels', 'segments', 'cost', 'revenue']

const hidden = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as const

function Card({ b, i, current, dim, hot, onOpen }: { b: CanvasBox; i: number; current: boolean; dim: boolean; hot: boolean; onOpen: (id: CanvasId) => void }) {
  const colour = statusMeta[b.status].color
  const phrase = canvasShort[b.id]
  const delay = i * 0.11
  const tall = place[b.id].includes('row-span-2')
  const txt = tall ? 'text-[21px]' : 'text-[17px]'
  return (
    <motion.div
      className={`relative min-h-0 ${place[b.id]}`}
      style={{ perspective: 1100, zIndex: hot ? 2 : 1 }}
      initial={false}
      animate={{ opacity: dim ? 0.4 : 1, scale: hot ? 1.02 : 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpen(b.id)
        }}
        aria-label={`${b.n}. ${b.name}: ${current ? `${statusLabel(b.status)}. ${phrase.current}` : phrase.initial}. Open details.`}
        className="relative block h-full w-full text-left transition-[filter] hover:brightness-125"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: current ? 180 : 0 }}
        transition={{ duration: 0.85, ease, delay: dim ? 0 : delay }}
      >
        {/* front: first-pass hypothesis */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl border border-silver/25 bg-[#131a2b] p-3.5"
          style={hidden}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver">{b.name}</span>
          <p className={`mt-2 font-medium leading-snug text-snow ${txt}`}>{phrase.initial}</p>
        </div>
        {/* back: where the evidence leaves it */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border p-3.5"
          style={{
            ...hidden,
            transform: 'rotateY(180deg)',
            borderColor: hot ? 'var(--color-violet)' : `color-mix(in srgb, ${colour} 60%, transparent)`,
            background: `color-mix(in srgb, ${colour} 14%, #0f1626)`,
            boxShadow: hot
              ? '0 0 0 1px var(--color-violet), 0 0 46px -4px rgb(139 92 246 / 0.85), inset 0 0 30px -10px rgb(139 92 246 / 0.6)'
              : `inset 0 1px 0 rgb(255 255 255 / 0.06), 0 0 26px -14px ${colour}`,
          }}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: colour }} />
          <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
            <span>{b.name}</span>
            {hot && <Target size={14} className="text-violet-soft" aria-label="Riskiest untested guess" />}
          </span>
          <p className={`mt-2 font-medium leading-snug text-snow ${txt}`}>{phrase.current}</p>
          <span className="mt-auto flex items-center gap-1.5 pt-1 text-[13px] font-medium" style={{ color: colour }}>
            <span className="h-2 w-2 rounded-full" style={{ background: colour, boxShadow: `0 0 10px ${colour}` }} />
            {statusLabel(b.status)}
          </span>
        </div>
      </motion.button>
    </motion.div>
  )
}

/** Present-mode canvas: cards turn over one after another (rotateY) from first hypothesis to evidence state. */
export function FlipCanvas({ current, risk, onOpen, rowHeight = 116 }: { current: boolean; risk: boolean; onOpen: (id: CanvasId) => void; rowHeight?: number }) {
  return (
    <div className="grid grid-cols-10 gap-2.5" style={{ gridAutoRows: rowHeight }} role="group" aria-label="Lean Canvas, nine boxes">
      {order.map((id, i) => {
        const b = canvasBoxes.find((x) => x.id === id)!
        const isRisk = riskiest.linked.includes(id)
        return <Card key={id} b={b} i={i} current={current} dim={risk && !isRisk} hot={risk && isRisk} onOpen={onOpen} />
      })}
    </div>
  )
}

/** Big glowing status number for the tally. */
export function StatusNumber({ count, status, small = false }: { count: number; status: keyof typeof statusMeta; small?: boolean }) {
  const colour = statusMeta[status].color
  return (
    <span className="inline-flex items-baseline gap-2.5">
      <span style={{ textShadow: `0 0 34px color-mix(in srgb, ${colour} 75%, transparent), 0 0 80px color-mix(in srgb, ${colour} 30%, transparent)` }}>
        <CountUp value={count} duration={0.9} className={`${small ? 'text-[clamp(1.8rem,2.8vw,2.6rem)]' : 'text-[clamp(2.6rem,4.6vw,4.2rem)]'} font-semibold leading-none tracking-tight text-snow`} />
      </span>
      <span className="inline-flex items-center gap-1.5 text-[17px] font-medium" style={{ color: colour }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: colour, boxShadow: `0 0 14px ${colour}` }} />
        {tallyLabel(status, count)}
      </span>
    </span>
  )
}
