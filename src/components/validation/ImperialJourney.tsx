import { CheckCircle2, Circle, CircleDashed } from 'lucide-react'
import { imperialJourney, journeyStateMeta } from '../../data/engagement'
import { Reveal } from '../ui'

/** Imperial engagement journey — marks what actually happened versus what is potential, possible or still to come. */
export default function ImperialJourney({ show = true }: { show?: boolean }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {imperialJourney.map((j, i) => {
        const m = journeyStateMeta[j.state]
        const happened = j.state === 'happened'
        const Icon = happened ? CheckCircle2 : j.state === 'potential' ? CircleDashed : Circle
        return (
          <Reveal key={j.id} as="li" show={show} delay={i * 0.12} className="list-none">
            <div
              className="h-full rounded-2xl border p-4"
              style={{
                borderColor: `color-mix(in srgb, ${m.color} ${happened ? 55 : 40}%, transparent)`,
                borderStyle: m.dashed ? 'dashed' : 'solid',
                background: happened ? `color-mix(in srgb, ${m.color} 9%, transparent)` : 'transparent',
              }}
            >
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: m.color }}>
                <Icon size={15} /> {m.label}
              </div>
              <div className={`mt-2 text-[17px] font-semibold leading-tight ${happened ? 'text-snow' : 'text-silver'}`}>{j.label}</div>
              <p className="mt-2 text-[14px] leading-snug text-silver">{j.note}</p>
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}
