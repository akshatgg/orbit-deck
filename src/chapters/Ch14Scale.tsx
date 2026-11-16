import { motion } from 'framer-motion'
import { ChapterHeader, Expandable, LearningCard, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { ExternalBranch, PhaseCard, RoadmapPath, TwoBusinesses, useRamp } from '../components/verdict/Roadmap'
import { chapters } from '../data/chapters'
import { finYears, gbp, modelLabel } from '../data/financials'
import { phases } from '../data/roadmap'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'scale')!

export default function Ch14Scale({ mode }: ChapterProps) {
  const present = mode === 'present'
  // One step: the four phases appear in sequence on arrival (~1 s), then the separate branch. No clicks needed.
  const ramp = useRamp(4)
  const s = present ? ramp : 3
  const showBranch = !present || ramp >= 4

  return (
    <Stage mode={mode} className={present ? 'sm:py-[68px]!' : ''}>
      <motion.div layout="position" transition={{ duration: 0.7, ease }}>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <StageLabel stage={meta.stage} />
        </div>
        <ChapterHeader num={meta.num} kicker={meta.title} title="Growth should be *earned, not assumed.*" />
      </motion.div>

      <div className={present ? 'mt-4' : 'mt-12'}>
        <RoadmapPath s={s} />
      </div>

      {present && <TwoBusinesses show={showBranch} />}

      <div className="mt-3">
        <SourceNote>{present ? 'Modelled customer counts, not achieved (S5). Gates are proposed; hover a lock for its criteria.' : `${modelLabel} Customer counts are modelled targets from financial model V3 (S5) — not achieved results, and no university other than Imperial is a customer or partner. Gates are PROPOSED decision criteria.`}</SourceNote>
      </div>

      {!present && (
        <div className="mt-8">
          <h3 className="t-kicker mb-3">Phases and gate criteria</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((p) => (
              <PhaseCard key={p.id} phase={p} show compact={false} />
            ))}
          </div>
          <div className="mt-8">
            <ExternalBranch show />
          </div>
        </div>
      )}

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
              A university product and a public-events product are different businesses. They have different customers and different economics, so we treat them as separate: the university business is gated on its own evidence, and external-event discovery would need its own — users beyond the university segment, organiser partnerships, attributable paid registrations and sustainable commission economics.
            </p>
          </Expandable>
        </div>
      )}

      {!present && (
        <Reveal className="mt-6">
          <LearningCard
            compact
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
