import { motion } from 'framer-motion'
import { finYears, gbp, milestones } from '../../data/financials'
import { ease } from '../ui'

const W = 960
const M = { l: 62, r: 20, t: 22, b: 58 }
const YMIN = -110_000
const YMAX = 700_000
const slot = (W - M.l - M.r) / finYears.length
const cx = (i: number) => M.l + slot * (i + 0.5)
const ticks = [0, 200_000, 400_000, 600_000]

/** Present-mode hero: revenue bars grow, the EBITDA line draws, 2029 lights up. Mounts fresh on each step entry. */
export default function HeroChart({ h: H = 330 }: { h?: number }) {
  const y = (v: number) => M.t + ((YMAX - v) / (YMAX - YMIN)) * (H - M.t - M.b)
  const path = finYears.map((d, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${y(d.ebitda)}`).join(' ')
  const i29 = finYears.findIndex((d) => d.year === milestones.firstProfitableYear)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Modelled revenue as bars and modelled EBITDA as a line, 2027 to 2031, with university counts. Modelled EBITDA first turns positive in 2029.">
      <defs>
        <linearGradient id="hc-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-violet)" stopOpacity={0.75} />
          <stop offset="100%" stopColor="var(--color-violet)" stopOpacity={0.12} />
        </linearGradient>
        <filter id="hc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="var(--color-silver)" strokeOpacity={t === 0 ? 0.55 : 0.1} />
          <text x={M.l - 8} y={y(t) + 4} textAnchor="end" fontSize="13" className="font-mono" fill="var(--color-dim)">
            {t === 0 ? '£0' : gbp(t, { compact: true }).replace('.0k', 'k')}
          </text>
        </g>
      ))}

      {/* 2029 spotlight */}
      <motion.rect
        x={cx(i29) - slot / 2 + 6}
        width={slot - 12}
        y={M.t}
        height={H - M.t - M.b + 6}
        rx={10}
        fill="var(--color-ev-modelled)"
        initial={{ fillOpacity: 0 }}
        animate={{ fillOpacity: 0.11 }}
        transition={{ duration: 0.8, ease, delay: 1.3 }}
      />

      {finYears.map((d, i) => (
        <g key={d.year}>
          <motion.rect
            x={cx(i) - 44}
            width={88}
            rx={5}
            fill="url(#hc-bar)"
            initial={{ y: y(0), height: 0 }}
            animate={{ y: y(d.revenue), height: y(0) - y(d.revenue) }}
            transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.12 }}
          />
          <motion.text x={cx(i)} y={y(d.revenue) - 9} textAnchor="middle" fontSize="15" className="font-mono" fill="var(--color-silver)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.12 }}>
            {gbp(d.revenue, { compact: true })}
          </motion.text>
          <text x={cx(i)} y={H - M.b + 24} textAnchor="middle" fontSize="19" fontWeight={600} fill="var(--color-snow)">
            {d.year}
          </text>
          <text x={cx(i)} y={H - M.b + 44} textAnchor="middle" fontSize="14" fill="var(--color-silver)">
            <tspan className="font-mono" fill="var(--color-snow)">{d.institutions}</tspan> universities
          </text>
        </g>
      ))}

      {/* EBITDA line with glow */}
      <motion.path d={path} fill="none" stroke="var(--color-ev-modelled)" strokeWidth={8} strokeOpacity={0.5} filter="url(#hc-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease, delay: 0.6 }} />
      <motion.path d={path} fill="none" stroke="var(--color-ev-modelled)" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease, delay: 0.6 }} />
      {finYears.map((d, i) => {
        const neg = d.ebitda < 0
        const hero = i === i29
        return (
          <motion.g key={d.year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.16 }}>
            <circle cx={cx(i)} cy={y(d.ebitda)} r={hero ? 9 : 6.5} fill={neg ? 'var(--color-ink)' : 'var(--color-ev-modelled)'} stroke="var(--color-ev-modelled)" strokeWidth={2.6} />
            <text
              x={cx(i) + 14}
              y={y(d.ebitda) + (neg ? 24 : -12)}
              fontSize={hero ? 20 : 15}
              className="font-mono"
              fontWeight={600}
              fill={neg ? 'var(--color-red)' : 'var(--color-snow)'}
              stroke="var(--color-ink)"
              strokeWidth={4}
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
