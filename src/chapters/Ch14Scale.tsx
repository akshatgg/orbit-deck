import { ChevronRight } from 'lucide-react'
import { ChapterHeader, Expandable, LearningCard, Reveal, SourceNote, Stage, StageLabel } from '../components/ui'
import { ExternalBranch, PhaseCard } from '../components/verdict/Roadmap'
import { chapters } from '../data/chapters'
import { finYears, gbp, modelLabel } from '../data/financials'
import { phases } from '../data/roadmap'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'scale')!

export default function Ch14Scale({ mode, step }: ChapterProps) {
  const present = mode === 'present'
  const s = present ? step : meta.steps - 1
  // In present mode the final step condenses the four phases to make room for the new branch.
  const compact = present && s >= 4

  return (
    <Stage mode={mode}>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <StageLabel stage={meta.stage} />
      </div>
      <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} />

      <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]'} lg:gap-x-2 lg:gap-y-3`}>
        {phases.map((p, i) => (
          <PhaseSlot key={p.id} i={i} s={s} compact={compact} />
        ))}
      </div>

      <div className={compact ? 'mt-5' : 'mt-6'}>
        <ExternalBranch show={s >= 4} compact={compact} />
      </div>

      <div className="mt-4">
        <SourceNote>
          {modelLabel} Customer counts are modelled targets from financial model V3 (S5) — not achieved results, and no university other than Imperial is a customer or partner. Gates are PROPOSED decision criteria.
        </SourceNote>
      </div>

      {!present && (
        <div className="mt-8 space-y-3">
          <Expandable title="Modelled institutions and finance by year (S5)" defaultOpen>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="font-mono text-[11px] uppercase tracking-wider text-dim">
                  <tr>
                    <th className="py-2 pr-3">Year</th>
                    <th className="py-2 pr-3">Institutions</th>
                    <th className="py-2 pr-3">Revenue</th>
                    <th className="py-2">EBITDA</th>
                  </tr>
                </thead>
                <tbody className="num text-snow">
                  {finYears.map((y) => (
                    <tr key={y.year} className="border-t border-line">
                      <td className="py-2 pr-3">{y.year}</td>
                      <td className="py-2 pr-3">{y.institutions}</td>
                      <td className="py-2 pr-3">{gbp(y.revenue)}</td>
                      <td className={`py-2 ${y.ebitda < 0 ? 'text-red' : 'text-snow'}`}>{gbp(y.ebitda)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Modelled base-case forecasts only. Renewal behaviour, acquisition rates and institutional willingness to pay are unvalidated (assumptions A3 and A6). The external-event opportunity contributes no revenue to these figures.
            </p>
          </Expandable>
          <Expandable title="Why the external-events idea is a separate business">
            <p>
              The coaching session challenged whether a university product and a public-events product are the same business. They have different customers and different economics, so we treat them as separate: the university business is gated on its own evidence, and external-event discovery would need its own — users beyond the university segment, organiser partnerships, attributable paid registrations and sustainable commission economics.
            </p>
          </Expandable>
        </div>
      )}

      {(!present || s >= 4) && (
        <Reveal show={s >= 4} className="mt-6">
          <LearningCard
            compact
            show={s >= 4}
            learning={{
              believed: 'If one university works, the plan is to scale.',
              investigated: 'What each year would have to prove before the next phase is unlocked.',
              learned: 'Growth can be gated on repeatability, then sustainability, then network. The external-events idea is a different business with different risks.',
              changed: 'Expansion is a series of evidence gates, and external events sit outside the forecast until their own evidence justifies them.',
            }}
          />
        </Reveal>
      )}
    </Stage>
  )
}

/** Grid slot: a phase card, followed (on wide screens) by a gate connector chevron. */
function PhaseSlot({ i, s, compact }: { i: number; s: number; compact: boolean }) {
  const p = phases[i]
  const show = s >= p.step
  return (
    <>
      <PhaseCard phase={p} show={show} compact={compact} />
      {i < phases.length - 1 && !compact && (
        <div className="hidden items-center justify-center lg:flex" aria-hidden>
          <Reveal show={s >= phases[i + 1].step} className="text-ev-proposed">
            <ChevronRight size={22} />
          </Reveal>
        </div>
      )}
    </>
  )
}
