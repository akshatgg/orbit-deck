import { ArrowRight, GitBranch, Lock } from 'lucide-react'
import { EvidenceTag, Reveal } from '../ui'
import { externalBranch, type Phase } from '../../data/roadmap'

/** One phase of the gated roadmap. `compact` collapses it to a title + target strip. */
export function PhaseCard({ phase, show, compact }: { phase: Phase; show: boolean; compact: boolean }) {
  return (
    <Reveal show={show} className="flex h-full flex-col">
      <div className={`glass flex h-full flex-col rounded-2xl ${compact ? 'p-4' : 'p-5'}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="t-kicker">{phase.years}</span>
          <EvidenceTag label="modelled" />
        </div>
        <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-snow">{phase.title}</h3>

        <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-1">
          {phase.target.map((t) => (
            <div key={t.label}>
              <span className={`num font-semibold text-snow ${compact ? 'text-3xl' : 'text-4xl'}`}>{t.value}</span>
              <span className="ml-2 text-sm text-silver">{t.label}</span>
            </div>
          ))}
        </div>
        {phase.modelledNote && <p className="mt-1 text-sm text-ev-modelled">{phase.modelledNote}</p>}

        {!compact && (
          <ul className="mt-4 space-y-1.5 text-[15px] leading-snug text-silver">
            {phase.actions.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-silver" />
                {a}
              </li>
            ))}
          </ul>
        )}

        {phase.gate && !compact && (
          <div className="mt-auto pt-4">
            <div className="rounded-xl border border-dashed border-ev-proposed/60 bg-ev-proposed/5 p-3">
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ev-proposed">
                <Lock size={12} /> {phase.gate.title}
              </div>
              <p className="mt-1.5 text-xs text-dim">To unlock the next phase, we must show:</p>
              <ul className="mt-1 space-y-1 text-[13.5px] leading-snug text-snow">
                {phase.gate.mustProve.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ev-proposed" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

/** The separate, risk-bearing branch that follows Year 5. NOT shown as the automatic next step. */
export function ExternalBranch({ show, compact = false }: { show: boolean; compact?: boolean }) {
  const b = externalBranch
  return (
    <Reveal show={show}>
      <div className="relative">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ev-proposed">
            <GitBranch size={14} /> {b.when} · a new branch, not the next step
          </span>
          <EvidenceTag label="unresolved" text="Own evidence required" />
        </div>
        <div className="rounded-2xl border border-dashed border-ev-proposed/50 bg-ev-proposed/[0.04] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1.25fr] lg:gap-8">
            <div>
              <h3 className="t-h2">{b.title}</h3>
              <p className="mt-2 text-base leading-snug text-snow">{b.idea}</p>
              <p className="mt-3 flex gap-2 text-[15px] leading-snug text-silver">
                <ArrowRight size={16} className="mt-0.5 shrink-0 text-ev-proposed" />
                {b.condition}
              </p>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ev-observed">Potential advantages inherited</div>
              <ul className="mt-2 space-y-1.5 text-[15px] leading-snug text-snow">
                {b.advantages.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ev-observed" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-red">New risks</div>
              <ul className={`mt-2 grid gap-x-4 gap-y-1.5 text-[15px] leading-snug text-snow ${compact ? 'sm:grid-cols-2' : ''}`}>
                {b.risks.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-red" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
            <p className="text-[15px] leading-snug text-snow">
              <strong className="font-semibold">{b.notIncluded}</strong>
            </p>
            <p className="font-serif text-xl italic leading-snug text-violet-soft">“{b.independence}”</p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
