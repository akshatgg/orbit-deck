import { pilotSequence } from '../../data/pilot'
import { Reveal } from '../ui'

/** Proposed eight-stage pilot sequence. Violet = proposed. */
export default function PilotSequence({ show = true }: { show?: boolean }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {pilotSequence.map((s, i) => (
        <Reveal key={s} as="li" show={show} delay={i * 0.08} className="list-none">
          <div className="relative h-full rounded-2xl border border-dashed p-4" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 55%, transparent)', background: 'color-mix(in srgb, var(--color-ev-proposed) 7%, transparent)' }}>
            <div className="num text-[13px] text-violet-soft">{String(i + 1).padStart(2, '0')}</div>
            <div className="mt-1 text-[clamp(1rem,1.3vw,1.3rem)] font-semibold leading-tight text-snow">{s}</div>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}
