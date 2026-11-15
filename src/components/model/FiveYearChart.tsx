import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { finYears, gbp, milestones } from '../../data/financials'
import { ease } from '../ui'

const W = 760
const H = 390
const M = { l: 58, r: 14, t: 34, b: 66 }
const YMIN = -60_000
const YMAX = 700_000
const y = (v: number) => M.t + ((YMAX - v) / (YMAX - YMIN)) * (H - M.t - M.b)
const slot = (W - M.l - M.r) / finYears.length
const cx = (i: number) => M.l + slot * (i + 0.5)
const ticks = [0, 200_000, 400_000, 600_000]

export default function FiveYearChart() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const go = inView
  const path = finYears.map((d, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${y(d.ebitda)}`).join(' ')
  const i29 = finYears.findIndex((d) => d.year === milestones.firstProfitableYear)

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Modelled revenue as bars and modelled EBITDA as a line, 2027 to 2031, with university counts. Modelled EBITDA first turns positive in 2029.">
      {/* legend, direct */}
      <g fontSize="12" className="font-mono">
        <rect x={M.l} y={8} width={12} height={12} rx={2} fill="var(--color-silver)" fillOpacity={0.45} />
        <text x={M.l + 18} y={18} fill="var(--color-silver)">Revenue</text>
        <circle cx={M.l + 100} cy={14} r={4.5} fill="var(--color-ev-modelled)" />
        <line x1={M.l + 90} x2={M.l + 110} y1={14} y2={14} stroke="var(--color-ev-modelled)" strokeWidth={2.5} />
        <text x={M.l + 118} y={18} fill="var(--color-silver)">EBITDA (hollow = negative)</text>
      </g>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="var(--color-silver)" strokeOpacity={t === 0 ? 0.55 : 0.12} />
          <text x={M.l - 8} y={y(t) + 4} textAnchor="end" fontSize="12" className="font-mono" fill="var(--color-dim)">
            {t === 0 ? '£0' : gbp(t, { compact: true }).replace('.0k', 'k')}
          </text>
        </g>
      ))}

      {/* 2029 marker */}
      <line x1={cx(i29)} x2={cx(i29)} y1={M.t + 8} y2={y(0)} stroke="var(--color-ev-modelled)" strokeOpacity={0.5} strokeDasharray="4 4" />
      <text x={cx(i29) - 8} y={M.t + 14} textAnchor="end" fontSize="13" fill="var(--color-snow)" fontWeight={500}>
        Modelled EBITDA turns positive in 2029
      </text>

      {finYears.map((d, i) => (
        <g key={d.year}>
          <motion.rect
            x={cx(i) - 34}
            width={68}
            rx={3}
            fill="var(--color-silver)"
            fillOpacity={0.4}
            initial={{ y: y(0), height: 0 }}
            animate={go ? { y: y(d.revenue), height: y(0) - y(d.revenue) } : { y: y(0), height: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.1 }}
          />
          <motion.text
            x={cx(i)}
            y={y(d.revenue) - 7}
            textAnchor="middle"
            fontSize="13"
            className="font-mono"
            fill="var(--color-snow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: go ? 1 : 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            {gbp(d.revenue, { compact: true })}
          </motion.text>
          <text x={cx(i)} y={H - M.b + 20} textAnchor="middle" fontSize="15" fontWeight={600} fill="var(--color-snow)">
            {d.year}
          </text>
          <text x={cx(i)} y={H - M.b + 38} textAnchor="middle" fontSize="13" fill="var(--color-silver)">
            <tspan className="font-mono" fill="var(--color-snow)">{d.institutions}</tspan> universities
          </text>
        </g>
      ))}

      <motion.path d={path} fill="none" stroke="var(--color-ev-modelled)" strokeWidth={2.5} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: go ? 1 : 0 }} transition={{ duration: 1.1, ease, delay: 0.5 }} />
      {finYears.map((d, i) => {
        const neg = d.ebitda < 0
        return (
          <motion.g key={d.year} initial={{ opacity: 0 }} animate={{ opacity: go ? 1 : 0 }} transition={{ delay: 0.8 + i * 0.15 }}>
            <circle cx={cx(i)} cy={y(d.ebitda)} r={5.5} fill={neg ? 'var(--color-ink)' : 'var(--color-ev-modelled)'} stroke="var(--color-ev-modelled)" strokeWidth={2.2} />
            <text
              x={cx(i) + 10}
              y={y(d.ebitda) + (neg ? 20 : -9)}
              fontSize="13"
              className="font-mono"
              fontWeight={600}
              fill={neg ? 'var(--color-red)' : 'var(--color-snow)'}
              stroke="var(--color-ink)"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {gbp(d.ebitda, { compact: true })}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
