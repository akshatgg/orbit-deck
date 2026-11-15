import { pitchConfig } from '../../data/config'
import { prototypeTesting } from '../../data/engagement'
import { Badge, Expandable, EvidenceTag } from '../ui'

/**
 * Prototype testing drawer. Shows verified counts ONLY when pitchConfig.verifiedPrototypeResults is set;
 * otherwise a placeholder. Never invents X/N outcomes.
 */
export default function PrototypeDrawer({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const r = pitchConfig.verifiedPrototypeResults as null | {
    participants: number
    unaidedCompletion: number
    relevantEventFound: number
    availabilityMatch: number
    redirectReached: number
    notes?: string
  }
  const value = (key: string): string | null => {
    if (!r) return null
    if (key === 'friction') return r.notes ?? null
    const n = (r as unknown as Record<string, number>)[key]
    return `${n} of ${r.participants}`
  }
  return (
    <Expandable
      defaultOpen={defaultOpen}
      title={
        <span className="flex flex-wrap items-center gap-3">
          Prototype testing <Badge tone="amber">{prototypeTesting.status}</Badge>
        </span>
      }
    >
      <p className="text-[15px] text-snow">
        Neutral task: <span className="font-serif text-[1.15em] italic">“{prototypeTesting.task}”</span>
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {prototypeTesting.measures.map((m) => {
          const v = value(m.key)
          return (
            <li key={m.key} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-[15px]">
              <span className="text-silver">{m.label}</span>
              {v ? <span className="num text-snow">{v}</span> : <span className="font-mono text-[11px] uppercase tracking-wider text-dim">Pending</span>}
            </li>
          )
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {r ? <EvidenceTag label="observed" text="Verified results" /> : <EvidenceTag label="unresolved" text="No results yet" />}
        <span className="text-[14px] text-silver">{r ? 'Verified by the team.' : prototypeTesting.pending}</span>
      </div>
      <p className="mt-3 text-[14px] text-amber">{prototypeTesting.caution}</p>
    </Expandable>
  )
}
