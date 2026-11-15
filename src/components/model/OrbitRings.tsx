import { motion } from 'framer-motion'
import { useState } from 'react'
import { marketAssumptions, marketLayers, pricingTiers } from '../../data/market'
import { gbp } from '../../data/financials'
import { EvidenceTag, ease } from '../ui'

type LayerId = (typeof marketLayers)[number]['id']

const CX = 180
const R = 172
const total = marketLayers[0].institutions
/** Ring AREA is proportional to institution count, so the radius scales with its square root. */
const radius = (n: number) => R * Math.sqrt(n / total)
const money = (v: number) => (v >= 1_000_000 ? `£${(v / 1_000_000).toFixed(3)}m` : gbp(v))

const fills: Record<LayerId, number> = { tam: 0.09, sam: 0.16, som: 0.3 }

export default function OrbitRings({ compact, initial = 'tam' }: { compact?: boolean; initial?: LayerId }) {
  const [sel, setSel] = useState<LayerId>(initial)
  const layer = marketLayers.find((l) => l.id === sel)!
  const tamSum = pricingTiers.reduce((s, t) => s + t.potential, 0)
  const tamInst = pricingTiers.reduce((s, t) => s + t.institutions, 0)

  const labelY: Record<LayerId, number> = {
    tam: CX - R + 21,
    sam: CX - radius(88) + 21,
    som: CX + 4,
  }

  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
      <div className="mx-auto w-full" style={{ maxWidth: compact ? 340 : 380 }}>
        <svg viewBox="0 0 360 360" className="w-full" role="group" aria-label="Concentric rings: TAM, SAM, SOM. Ring area is proportional to institution count.">
          {marketLayers.map((l, i) => {
            const r = radius(l.institutions)
            const active = l.id === sel
            return (
              <motion.circle
                key={l.id}
                cx={CX}
                cy={CX}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.12 }}
                fill="var(--color-ev-modelled)"
                fillOpacity={active ? fills[l.id] + 0.12 : fills[l.id]}
                stroke="var(--color-ev-modelled)"
                strokeOpacity={active ? 1 : 0.45}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? undefined : '3 4'}
                style={{ cursor: 'pointer', transition: 'fill-opacity .3s, stroke-opacity .3s' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(l.id)
                }}
              />
            )
          })}
          {marketLayers.map((l) => (
            <g key={l.id} pointerEvents="none" textAnchor="middle" fill="var(--color-snow)">
              <text x={CX} y={labelY[l.id]} className="font-mono" fontSize={l.id === 'som' ? 15 : 13} fontWeight={600} letterSpacing="0.08em">
                {l.id.toUpperCase()}
              </text>
              <text x={CX} y={labelY[l.id] + (l.id === 'som' ? 17 : 15)} className="font-mono" fontSize={l.id === 'som' ? 13 : 11.5} fill="var(--color-silver)">
                {l.institutions}
                {l.id === 'som' ? ' by 2029' : ' institutions'}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-1 text-center font-mono text-[10.5px] uppercase tracking-wider text-dim">Ring area is proportional to institution count</p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Market layer">
          {marketLayers.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={l.id === sel}
              onClick={(e) => {
                e.stopPropagation()
                setSel(l.id)
              }}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${l.id === sel ? 'border-ev-modelled bg-ev-modelled/15 text-snow' : 'border-line text-silver hover:text-snow'}`}
            >
              {l.label}
            </button>
          ))}
          <EvidenceTag label="modelled" className="ml-auto" />
        </div>

        <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className={`num font-semibold leading-none text-snow ${compact ? 'text-4xl' : 'text-5xl'}`}>{money(layer.value)}</span>
            <span className="text-lg text-silver">
              <span className="num text-snow">{layer.institutions}</span> institutions
            </span>
          </div>
          <p className="mt-2 text-[15px] leading-snug text-silver">{layer.definition}</p>

          <div className="mt-3 rounded-xl border border-line bg-navy/70 p-3.5 text-[15px]">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Calculation</div>
            {sel === 'tam' && (
              <table className="mt-2 w-full num text-[14.5px]">
                <tbody>
                  {pricingTiers.map((t) => (
                    <tr key={t.id} className="border-t border-line/60 first:border-0">
                      <td className="py-1 pr-2 font-sans text-silver">{t.label}</td>
                      <td className="py-1 pr-2 text-right text-snow">
                        {t.institutions} × {gbp(t.price)}
                      </td>
                      <td className="py-1 text-right text-snow">{gbp(t.potential)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-silver/40">
                    <td className="py-1 pr-2 font-sans font-medium text-snow">Total</td>
                    <td className="py-1 pr-2 text-right text-snow">{tamInst}</td>
                    <td className="py-1 text-right font-semibold text-snow">{gbp(tamSum)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            {sel === 'sam' && (
              <p className="mt-1.5 leading-snug text-snow">
                <span className="num">{layer.institutions}</span> of <span className="num">{total}</span> institutions ({Math.round((layer.institutions / total) * 100)}%) meet provisional serviceability assumptions, valued at the same proposed price tiers: <span className="num">{money(layer.value)}</span>.
              </p>
            )}
            {sel === 'som' && (
              <p className="mt-1.5 leading-snug text-snow">
                <span className="num">{layer.institutions}</span> institutions in the 2029 model scenario, valued at <span className="num">{gbp(layer.value)}</span> undiscounted subscription potential. Undiscounted, so it is not the same measure as modelled 2029 revenue (<span className="num">{gbp(241_600)}</span>).
              </p>
            )}
            <p className="mt-2 text-[13.5px] leading-snug text-dim">{layer.note} Prices are proposed, not validated willingness to pay.</p>
          </div>
        </motion.div>

        <div className="mt-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Limits of this sizing</div>
          <ul className={`mt-1.5 space-y-0.5 text-silver ${compact ? 'text-[13.5px]' : 'text-[14.5px]'}`}>
            {marketAssumptions.map((a) => (
              <li key={a} className="flex gap-2 leading-snug">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-dim" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
