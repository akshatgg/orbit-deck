import { motion, useReducedMotion } from 'framer-motion'
import { criteria, type Criterion } from '../../data/screening'
import { ease } from '../ui'

const CX = 260
const CY = 188
const R = 112
const MAX = 5
const STAGE = '#38bdf8'
const AMBER = 'var(--color-amber)'

const ang = (i: number) => ((-90 + i * (360 / criteria.length)) * Math.PI) / 180
const pt = (i: number, score: number) => {
  const r = (R * score) / MAX
  return { x: CX + Math.cos(ang(i)) * r, y: CY + Math.sin(ang(i)) * r }
}
const f = (n: number) => n.toFixed(1)
const pathFor = (scores: number[]) =>
  scores
    .map((s, i) => {
      const p = pt(i, s)
      return `${i === 0 ? 'M' : 'L'}${f(p.x)} ${f(p.y)}`
    })
    .join(' ') + ' Z'

/** Custom-SVG radar. Vertices appear one at a time (`revealed` = how many), with hover / click / keyboard focus. */
export function ScreeningRadar({
  revealed,
  activeId,
  onHover,
  onPick,
  highlightId,
  className = 'max-w-[520px]',
}: {
  revealed: number
  activeId: string | null
  onHover: (id: string | null) => void
  onPick: (id: string) => void
  highlightId?: string | null
  className?: string
}) {
  const reduce = useReducedMotion()
  const scores = criteria.map((c, i) => (i < revealed ? c.score : 0))
  const label = (c: Criterion, i: number) => {
    const a = ang(i)
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const lines = c.name.split(' ')
    const total = lines.length + 1
    const lh = 19
    const px = CX + cos * (R + 24)
    const py = CY + sin * (R + 24)
    const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
    const y0 = sin < -0.5 ? py - (total - 1) * lh + 2 : sin > 0.5 ? py + 8 : py - ((total - 1) * lh) / 2 + 4
    return { px, anchor, y0, lines, lh }
  }

  return (
    <svg viewBox="0 0 520 390" className={`h-auto w-full ${className}`} role="group" aria-label="Radar chart of the five screening scores, each out of 5">
      {/* rings */}
      {[1, 2, 3, 4, 5].map((r) => (
        <polygon
          key={r}
          points={criteria.map((_, i) => `${f(pt(i, r).x)},${f(pt(i, r).y)}`).join(' ')}
          fill="none"
          stroke="rgb(148 163 184)"
          strokeOpacity={r === 5 ? 0.35 : 0.14}
          strokeWidth={1}
        />
      ))}
      {criteria.map((_, i) => (
        <line key={i} x1={CX} y1={CY} x2={pt(i, MAX).x} y2={pt(i, MAX).y} stroke="rgb(148 163 184)" strokeOpacity={0.18} />
      ))}
      {[1, 3, 5].map((r) => (
        <text key={r} x={CX + 5} y={CY - (R * r) / MAX + 4} fontSize={11} className="fill-dim font-mono" aria-hidden>
          {r}
        </text>
      ))}

      {/* polygon */}
      <motion.path
        initial={false}
        animate={{ d: pathFor(scores), opacity: revealed > 0 ? 1 : 0 }}
        transition={{ duration: 0.8, ease }}
        fill={STAGE}
        fillOpacity={0.16}
        stroke={STAGE}
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 14px rgb(56 189 248 / 0.55))' }}
      />

      {/* vertices + labels */}
      {criteria.map((c, i) => {
        const shown = i < revealed
        const p = pt(i, shown ? c.score : 0)
        const active = activeId === c.id
        const hot = highlightId === c.id
        const col = hot ? AMBER : STAGE
        const l = label(c, i)
        return (
          <g
            key={c.id}
            role={shown ? 'button' : undefined}
            tabIndex={shown ? 0 : -1}
            aria-label={shown ? `${c.name}: ${c.score} out of 5` : undefined}
            aria-hidden={!shown}
            style={{ cursor: shown ? 'pointer' : 'default', outline: 'none' }}
            onMouseEnter={() => shown && onHover(c.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => shown && onHover(c.id)}
            onBlur={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation()
              if (shown) onPick(c.id)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && shown) onPick(c.id)
            }}
          >
            {hot && shown && !reduce && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                fill="none"
                stroke={AMBER}
                strokeWidth={2}
                initial={{ r: 8, opacity: 0.9 }}
                animate={{ r: [8, 26], opacity: [0.9, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <motion.circle initial={false} style={{ filter: `drop-shadow(0 0 8px ${col})` }} animate={{ cx: p.x, cy: p.y, opacity: shown ? 1 : 0, r: active ? 8 : 5.5 }} transition={{ duration: 0.8, ease }} fill={col} stroke="#080d1a" strokeWidth={2} />
            <circle cx={pt(i, MAX).x} cy={pt(i, MAX).y} r={22} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
            <text x={l.px} y={l.y0} textAnchor={l.anchor as 'start' | 'end' | 'middle'} fontSize={16} className="select-none">
              {l.lines.map((w, k) => (
                <tspan key={k} x={l.px} dy={k === 0 ? 0 : l.lh} className={active ? 'fill-snow' : 'fill-silver'} fontWeight={active ? 600 : 500}>
                  {w}
                </tspan>
              ))}
              <tspan x={l.px} dy={l.lh} className="font-mono" fontSize={15} fontWeight={600} fill={shown ? (hot ? AMBER : STAGE) : 'var(--color-dim)'}>
                {shown ? `${c.score}/5` : '–/5'}
              </tspan>
            </text>
          </g>
        )
      })}
    </svg>
  )
}
