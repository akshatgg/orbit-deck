import { indicators } from '../../data/financials'
import { Reveal } from '../ui'

/**
 * The three headline financial indicators shown beside the Revenue & EBITDA chart.
 * All values and the footnote come from financials.indicators. Modelled, illustrative: not guaranteed returns.
 */
export default function Indicators({ big = false }: { big?: boolean }) {
  const rows = [
    { value: indicators.npv.value, label: `${indicators.npv.label} ${indicators.npv.detail}` },
    { value: indicators.payback.value, label: indicators.payback.label },
    { value: indicators.roi.value, label: indicators.roi.label },
  ]
  return (
    <div className="flex flex-col">
      <div className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-navy/60">
        {rows.map((r, i) => (
          <Reveal key={r.label} delay={0.5 + i * 0.18} className="px-5 py-3.5">
            <div className={`num font-semibold leading-none text-snow ${big ? 'text-[clamp(2.6rem,3.8vw,3.6rem)]' : 'text-[clamp(2.2rem,3.2vw,3rem)]'}`}>{r.value}</div>
            <div className="mt-1.5 text-[15.5px] leading-snug text-silver">{r.label}</div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={1.2}>
        <p className="mt-2.5 text-[12.5px] leading-snug text-dim">{indicators.footnote}</p>
      </Reveal>
    </div>
  )
}
