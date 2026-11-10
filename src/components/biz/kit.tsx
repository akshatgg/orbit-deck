import { useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Kicker, Reveal, SplitHeadline } from '../ui'

/** Shared chart palette (mirrors tokens in src/index.css). */
export const C = {
  violet: '#8066ff',
  violetSoft: '#b7a8ff',
  blue: '#3b82f6',
  cyan: '#3de0ea',
  peach: '#ffa36b',
  amber: '#ffb547',
  lavender: '#d6c8ff',
  snow: '#f7f9fc',
  silver: '#9ca9bc',
  dim: '#5d6a80',
  line: 'rgba(156,169,188,0.14)',
  grid: 'rgba(156,169,188,0.08)',
  pos: '#4fd1a5',
  neg: '#ff7a7a',
}

export const axisProps = {
  stroke: C.dim,
  tick: { fill: C.silver, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' },
  tickLine: false,
  axisLine: { stroke: C.line },
} as const

/** Recharts animation on unless the user prefers reduced motion. */
export function useChartAnim() {
  const reduce = useReducedMotion()
  return !reduce
}

export interface TipRow {
  label: string
  value: string
  color?: string
  muted?: boolean
}

/** Dark glass tooltip body used by all recharts tooltips in these chapters. */
export function TipBox({ title, rows, foot }: { title: ReactNode; rows: TipRow[]; foot?: ReactNode }) {
  return (
    <div className="glass-strong min-w-[200px] rounded-xl px-3.5 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">{title}</div>
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-5 text-[13px]">
            <span className={`flex items-center gap-2 ${r.muted ? 'text-dim' : 'text-silver'}`}>
              {r.color && <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />}
              {r.label}
            </span>
            <span className="num text-snow">{r.value}</span>
          </div>
        ))}
      </div>
      {foot && <div className="mt-2 border-t border-line pt-2 font-mono text-[10.5px] text-dim">{foot}</div>}
    </div>
  )
}

/** Round to the nearest £100 for illustrative outputs (avoid false precision). */
export const r100 = (v: number) => Math.round(v / 100) * 100

export const pct = (v: number, digits = 0) => `${(v * 100).toFixed(digits)}%`

/** Compact header used by dense, dashboard-style chapters. */
export function DenseHeader({
  num,
  kicker,
  title,
  accent,
  show = true,
  size = 'h1',
  right,
}: {
  num: string
  kicker: string
  title: string
  accent?: string
  show?: boolean
  size?: 'h1' | 'h2'
  right?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-5xl">
        <Reveal show={show}>
          <Kicker>
            <span className="text-dim">{num}</span> <span className="mx-2 text-dim">/</span> {kicker}
          </Kicker>
        </Reveal>
        <h2 className={`${size === 'h1' ? 't-h1' : 't-h2'} mt-3`}>
          <SplitHeadline text={title} show={show} delay={0.08} />
          {accent && (
            <>
              {' '}
              <span className="font-serif font-normal italic text-gradient-warm">
                <SplitHeadline text={accent} show={show} delay={0.3} />
              </span>
            </>
          )}
        </h2>
      </div>
      {right}
    </div>
  )
}
