import { Check, Minus } from 'lucide-react'
import { ladder, type RungState } from '../../data/engagement'
import { EvidenceTag, Reveal } from '../ui'

const style: Record<RungState, { color: string; dashed: boolean }> = {
  observed: { color: 'var(--color-ev-observed)', dashed: false },
  partial: { color: 'var(--color-amber)', dashed: false },
  reported: { color: 'var(--color-ev-reported)', dashed: false },
  'not-reached': { color: 'var(--color-st-untested)', dashed: true },
}

/** Six-rung evidence ladder. Only rungs supported by current evidence are highlighted. */
export default function EvidenceLadder({ show = true }: { show?: boolean }) {
  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
        {ladder.map((r, i) => {
          const s = style[r.state]
          const reached = r.state !== 'not-reached'
          return (
            <Reveal key={r.id} as="li" show={show} delay={i * 0.1} className="list-none" >
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: reached ? `color-mix(in srgb, ${s.color} 55%, transparent)` : 'rgb(148 163 184 / 0.28)',
                  borderStyle: s.dashed ? 'dashed' : 'solid',
                  background: reached ? `color-mix(in srgb, ${s.color} 9%, transparent)` : 'transparent',
                  opacity: reached ? 1 : 0.7,
                }}
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                  <span>Rung {i + 1}</span>
                  {reached ? <Check size={14} style={{ color: s.color }} /> : <Minus size={14} />}
                </div>
                <div className={`mt-2 text-[17px] font-semibold leading-tight ${reached ? 'text-snow' : 'text-silver'}`}>{r.label}</div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {r.tag ? <EvidenceTag label={r.tag} text={r.stateText} /> : (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ borderColor: `color-mix(in srgb, ${s.color} 45%, transparent)`, color: s.color }}>
                      {r.stateText}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] leading-snug text-silver">{r.note}</p>
              </div>
            </Reveal>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
        <span>Highlighted = supported by current evidence</span>
        <span className="text-silver">Dashed = not reached</span>
      </div>
    </div>
  )
}
