import { ArrowDown } from 'lucide-react'
import type { CoachingChallenge } from '../../data/coaching'

/** Challenge → Implication → Our revised decision. */
export default function ChallengeDetail({ c, compact = false }: { c: CoachingChallenge; compact?: boolean }) {
  const rows = [
    { t: 'Challenge', text: c.challenge, color: 'var(--color-amber)' },
    { t: 'Implication', text: c.implication, color: 'var(--color-silver)' },
    { t: 'Our revised decision', text: c.decision, color: 'var(--color-violet-soft)' },
  ]
  return (
    <div>
      {rows.map((r, i) => (
        <div key={r.t}>
          <div className={`rounded-xl border border-line bg-navy/70 ${compact ? 'p-3.5' : 'p-4 sm:p-5'}`} style={i === 2 ? { borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 45%, transparent)' } : undefined}>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: r.color }}>
              {r.t}
            </div>
            <p className={`mt-1.5 leading-snug text-snow ${compact ? 'text-[16px]' : 'text-[clamp(1.05rem,1.45vw,1.45rem)]'}`}>{r.text}</p>
          </div>
          {i < 2 && (
            <div className="flex justify-center py-1 text-dim">
              <ArrowDown size={16} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
