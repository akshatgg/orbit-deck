import { EvidenceTag } from '../ui'
import { funnel, funnelNote } from '../../data/market'

export function CustomerFactory() {
  const max = funnel[0].value
  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h4 className="text-xl font-semibold text-snow">Customer factory 2027–2029</h4>
        <EvidenceTag label="modelled" />
      </div>
      <ol className="mt-4 space-y-3">
        {funnel.map((f, i) => (
          <li key={f.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-medium text-snow">{f.label}</span>
              <span className="num text-xl font-semibold text-snow">{f.value}</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/5" aria-hidden>
              <div className="h-full rounded-full" style={{ width: `${(f.value / max) * 100}%`, background: i === funnel.length - 1 ? 'var(--color-ev-modelled)' : 'color-mix(in srgb, var(--color-ev-modelled) 55%, transparent)' }} />
            </div>
            <p className="mt-1 text-[13px] leading-snug text-dim">{f.detail}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-lg border border-ev-unresolved/30 bg-ev-unresolved/5 p-3 text-sm leading-snug text-snow">{funnelNote}</p>
    </div>
  )
}
