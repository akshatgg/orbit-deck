import { useState } from 'react'
import { base2029, gbp, sensitivity } from '../../data/financials'
import { EvidenceTag } from '../ui'

const avgPerCustomer = base2029.revenue / base2029.customers
const be = {
  r: base2029.ebitda / base2029.revenue,
  c: base2029.ebitda,
  k: base2029.ebitda / avgPerCustomer,
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  breakEven,
  breakEvenText,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (n: number) => void
  display: string
  breakEven: number
  breakEvenText: string
}) {
  const p = Math.min(100, (breakEven / max) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[15px] font-medium text-snow">
          {label}
        </label>
        <span className="num text-xl font-semibold text-snow">{display}</span>
      </div>
      <div className="relative mt-2 h-6">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 z-10 h-6 w-full cursor-pointer accent-[#a5b4fc]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 h-3 w-0.5 rounded bg-red"
          style={{ left: `calc(${p}% + ${8 - p * 0.16}px)` }}
          title={breakEvenText}
        />
      </div>
      <div className="mt-0.5 text-[13.5px] leading-snug text-silver">
        <span className="mr-1.5 inline-block h-2 w-0.5 translate-y-px rounded bg-red" />
        {breakEvenText}
      </div>
    </div>
  )
}

export default function SensitivityExplorer({ compact }: { compact?: boolean }) {
  const [r, setR] = useState(0)
  const [c, setC] = useState(0)
  const [k, setK] = useState(0)

  const dR = base2029.ebitda - sensitivity.revenueReduction(r / 100)
  const dC = base2029.ebitda - sensitivity.integrationCost(c)
  const dK = base2029.ebitda - sensitivity.customersBelow(k)
  const result = base2029.ebitda - dR - dC - dK
  const neg = result < 0

  // diverging bar: −£260k … +£40k
  const lo = -260_000
  const hi = 40_000
  const pos = (v: number) => ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * 100
  const zero = pos(0)

  const ex = [10, 20].map((pc) => ({ pc, cut: base2029.revenue * (pc / 100), out: sensitivity.revenueReduction(pc / 100) }))

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
      <div className="space-y-4">
        <Slider id="sens-r" label="2029 revenue reduction" value={r} min={0} max={40} step={1} onChange={setR} display={`${r}%`} breakEven={be.r * 100} breakEvenText={`Erases 2029 EBITDA at ≈ ${(be.r * 100).toFixed(1)}%`} />
        <Slider id="sens-c" label="Additional annual integration cost" value={c} min={0} max={60_000} step={1000} onChange={setC} display={gbp(c)} breakEven={be.c} breakEvenText={`Erases 2029 EBITDA at ≈ ${gbp(be.c)}`} />
        <Slider id="sens-k" label="Customers below the 18 target" value={k} min={0} max={8} step={1} onChange={setK} display={`${k}`} breakEven={be.k} breakEvenText={`Erases 2029 EBITDA at ≈ ${be.k.toFixed(1)} customers (about ${gbp(avgPerCustomer)} each)`} />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setR(0)
            setC(0)
            setK(0)
          }}
          className="font-mono text-[11px] uppercase tracking-wider text-dim underline-offset-4 hover:text-snow hover:underline"
        >
          Reset to base case
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Revised 2029 EBITDA</span>
          <EvidenceTag label="modelled" />
        </div>
        <div className={`num mt-1 font-semibold leading-none ${compact ? 'text-5xl' : 'text-6xl'} ${neg ? 'text-red' : 'text-snow'}`} aria-live="polite">
          {gbp(result)}
        </div>
        <div className="mt-1 text-sm text-silver">
          Base case {gbp(base2029.ebitda)} · change <span className="num text-snow">{gbp(result - base2029.ebitda, { sign: true })}</span>
        </div>

        <div className="relative mt-3 h-4 rounded bg-navy-2" role="img" aria-label={`Revised EBITDA ${gbp(result)}`}>
          <div className="absolute inset-y-0 rounded-sm" style={{ left: `${Math.min(zero, pos(result))}%`, width: `${Math.abs(pos(result) - zero)}%`, background: neg ? 'var(--color-red)' : 'var(--color-ev-modelled)', opacity: 0.85, transition: 'all .15s' }} />
          <div className="absolute -inset-y-1 w-px bg-snow/70" style={{ left: `${zero}%` }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10.5px] text-dim">
          <span>{gbp(lo)}</span>
          <span>£0</span>
          <span>{gbp(hi)}</span>
        </div>

        <div className="mt-3 rounded-xl border border-line bg-navy/70 p-3.5 text-[14.5px] leading-snug text-silver">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Formula (costs held constant)</div>
          <p className="mt-1.5">
            Revised EBITDA = {gbp(base2029.ebitda)} − ({gbp(base2029.revenue)} × revenue reduction) − additional integration cost − (customers below target × {gbp(base2029.revenue)} ÷ {base2029.customers}).
          </p>
          <p className="num mt-1.5 text-snow">
            = {gbp(base2029.ebitda)} − {gbp(dR)} − {gbp(dC)} − {gbp(dK)} = {gbp(result)}
          </p>
          <p className="mt-2 text-[13.5px]">
            Worked examples:{' '}
            {ex.map((e, i) => (
              <span key={e.pc}>
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation()
                    setR(e.pc)
                    setC(0)
                    setK(0)
                  }}
                  className="rounded border border-line px-1.5 py-0.5 text-snow hover:border-violet/60"
                >
                  {e.pc}% revenue reduction
                </button>{' '}
                <span className="num text-snow">
                  −{gbp(e.cut)} → {gbp(e.out)}
                </span>
                {i === 0 ? '; ' : '.'}{' '}
              </span>
            ))}
          </p>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-snug text-amber">One-variable sensitivities, not a rebuilt cash-flow model. Combining them simply adds the one-variable effects.</p>
      </div>
    </div>
  )
}
