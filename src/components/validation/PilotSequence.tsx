import { pilotDecisions, pilotPhases, pilotSequence } from '../../data/pilot'
import { Reveal } from '../ui'

/** Proposed eight-stage pilot, grouped by phase, with full stage descriptions. Violet = proposed. Wraps cleanly at 375 px. */
export default function PilotSequence({ show = true }: { show?: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {pilotPhases.map((p, k) => (
        <Reveal key={p.id} show={show} delay={k * 0.08}>
          <div className="h-full rounded-2xl border border-dashed p-4" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 50%, transparent)', background: 'color-mix(in srgb, var(--color-ev-proposed) 6%, transparent)' }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">{p.label}</div>
            <ol className="mt-3 space-y-3">
              {pilotSequence.slice(p.from, p.from + p.count).map((s, j) => (
                <li key={s.id} className="flex gap-3">
                  <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-violet text-sm text-snow">{p.from + j + 1}</span>
                  <span className="min-w-0 leading-snug">
                    <span className="block text-[17px] font-semibold text-snow">{s.title}</span>
                    <span className="block text-[15px] text-silver">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            {p.id === 'decide' && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {pilotDecisions.map((d) => (
                  <li key={d.id} className="rounded-full border border-cyan/50 bg-navy px-3 py-1 text-[15px] text-snow">
                    {d.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
