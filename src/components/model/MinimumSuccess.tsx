import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { finYears, gbp, milestones, minimumSuccess, withDerived } from '../../data/financials'
import { EvidenceTag, ease } from '../ui'

const W = 700
const L = 190
const MAX = 260_000
const x = (v: number) => L + (v / MAX) * (W - L - 20)
const opex = minimumSuccess.opex2029
const allowance = opex * minimumSuccess.coverageAllowance
const rev29 = finYears.find((d) => d.year === 2029)!.revenue

export function ThresholdBars() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <svg ref={ref} viewBox={`0 0 ${W} 150`} className="w-full" role="img" aria-label={`2029 operating expenditure ${gbp(opex)} plus about 15% allowance gives a planning revenue threshold of about ${gbp(minimumSuccess.thresholdLow)} to ${gbp(minimumSuccess.thresholdHigh)}; modelled 2029 revenue is ${gbp(rev29)}.`}>
      <rect x={x(minimumSuccess.thresholdLow)} y={6} width={x(minimumSuccess.thresholdHigh) - x(minimumSuccess.thresholdLow)} height={108} fill="var(--color-ev-proposed)" fillOpacity={0.3} />
      <text x={x(minimumSuccess.thresholdLow) - 6} y={20} textAnchor="end" fontSize="12.5" fill="var(--color-violet-soft)" className="font-mono">
        threshold ≈ £230k–£235k
      </text>
      {[0, 100_000, 200_000].map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={28} y2={114} stroke="var(--color-silver)" strokeOpacity={0.14} />
          <text x={x(t)} y={132} textAnchor="middle" fontSize="12" fill="var(--color-dim)" className="font-mono">
            {t === 0 ? '£0' : `£${t / 1000}k`}
          </text>
        </g>
      ))}
      <text x={L - 12} y={50} textAnchor="end" fontSize="13.5" fill="var(--color-silver)">
        2029 operating spend
      </text>
      <text x={L - 12} y={96} textAnchor="end" fontSize="13.5" fill="var(--color-silver)">
        Modelled 2029 revenue
      </text>
      <motion.rect x={x(0)} y={36} height={22} rx={3} fill="var(--color-silver)" fillOpacity={0.5} initial={{ width: 0 }} animate={{ width: inView ? x(opex) - x(0) : 0 }} transition={{ duration: 0.8, ease }} />
      <motion.rect x={x(opex)} y={36} height={22} rx={3} fill="var(--color-ev-proposed)" fillOpacity={0.5} initial={{ width: 0 }} animate={{ width: inView ? x(opex + allowance) - x(opex) : 0 }} transition={{ duration: 0.6, ease, delay: 0.7 }} />
      <motion.rect x={x(0)} y={84} height={22} rx={3} fill="var(--color-ev-modelled)" fillOpacity={0.5} initial={{ width: 0 }} animate={{ width: inView ? x(rev29) - x(0) : 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }} />
      <text x={x(opex) - 6} y={51} textAnchor="end" fontSize="13" fill="var(--color-snow)" className="font-mono" fontWeight={600}>
        {gbp(opex)}
      </text>
      <text x={x(rev29) - 6} y={99} textAnchor="end" fontSize="13" fill="var(--color-snow)" className="font-mono" fontWeight={600}>
        {gbp(rev29)}
      </text>
      <text x={x(opex + allowance) + 6} y={51} fontSize="12" fill="var(--color-violet-soft)" className="font-mono">
        +15%
      </text>
    </svg>
  )
}

export function LiquidityTiles() {
  const cum29 = withDerived.find((d) => d.year === 2029)!.cumulativeNet
  const tiles = [
    { big: `${gbp(milestones.equity)} + ${gbp(milestones.debt)}`, small: 'Assumed funding: equity plus debt' },
    { big: gbp(milestones.minCash), small: `Lowest projected year-end company cash, in ${milestones.minCashYear}` },
    { big: gbp(cum29), small: 'Cumulative modelled net profit at the end of 2029, even in the first profitable year' },
  ]
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {tiles.map((t) => (
        <div key={t.small} className="rounded-xl border border-line bg-navy/70 p-3.5">
          <div className="num text-2xl font-semibold leading-tight text-snow">{t.big}</div>
          <div className="mt-1 text-[14px] leading-snug text-silver">{t.small}</div>
        </div>
      ))}
    </div>
  )
}

export function MinSuccessNotes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <EvidenceTag label="modelled" />
      <span className="text-[14px] text-silver">An approximate recurring-revenue target, not the exact accounting break-even point.</span>
    </div>
  )
}
