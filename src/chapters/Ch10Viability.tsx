import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import FiveYearChart from '../components/model/FiveYearChart'
import { LiquidityTiles, MinSuccessNotes, ThresholdBars } from '../components/model/MinimumSuccess'
import ModelHeader from '../components/model/ModelHeader'
import OrbitRings from '../components/model/OrbitRings'
import SensitivityExplorer from '../components/model/SensitivityExplorer'
import { ChapterHeader, EvidenceTag, Expandable, LearningCard, Reveal, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { assumptions, base2029, commentary, finYears, gbp, minimumSuccess, modelLabel, sensitivity, workbookIssues } from '../data/financials'
import { funnel, funnelNote } from '../data/market'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'viability')!

const learning = {
  believed: 'A large market meant a viable business.',
  investigated: 'Bottom-up market sizing and a five-year financial model with sensitivities.',
  learned: 'Viability depends on about 18 paying universities by 2029 and tight early cash.',
  changed: 'We identified the purchasing and renewal evidence the model requires.',
}

const takeaway = 'The model establishes what must become true for Orbit to work. It does not establish that those assumptions will become true.'

function ViewLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">{n}</span>
      <h3 className="text-[clamp(1.15rem,1.7vw,1.7rem)] font-semibold tracking-tight text-snow">{title}</h3>
      <EvidenceTag label="modelled" />
    </div>
  )
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-xl border border-line bg-navy/70 p-3.5">
      <div className="num text-3xl font-semibold leading-none text-snow">{big}</div>
      <div className="mt-1.5 text-[14.5px] leading-snug text-silver">{small}</div>
    </div>
  )
}

function ModelView({ compact }: { compact: boolean }) {
  const d29 = finYears.find((d) => d.year === 2029)!
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-8">
      <div>
        <FiveYearChart />
        <SourceNote className="mt-1">S5 · Orbit financial model V3. {modelLabel}</SourceNote>
      </div>
      <div className="space-y-2.5">
        <Stat big={`${d29.institutions}`} small="modelled paying universities in 2029, up from 3 in 2027" />
        <Stat big={gbp(d29.ebitda)} small="modelled 2029 EBITDA, the first positive year. 2027 and 2028 are modelled losses." />
        {!compact && <p className="text-[14.5px] leading-snug text-silver">{commentary[2029]}</p>}
      </div>
    </div>
  )
}

function MinimumView() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
      <div>
        <p className="text-[15px] text-silver">
          2029 operating expenditure of <span className="num text-snow">{gbp(minimumSuccess.opex2029)}</span> plus a coverage allowance of about {Math.round(minimumSuccess.coverageAllowance * 100)}% gives a planning revenue threshold of{' '}
          <span className="num text-snow">
            ≈ {gbp(minimumSuccess.thresholdLow)}–{gbp(minimumSuccess.thresholdHigh)}
          </span>{' '}
          a year.
        </p>
        <div className="mt-2">
          <ThresholdBars />
        </div>
        <MinSuccessNotes />
      </div>
      <div className="space-y-3">
        <LiquidityTiles />
        <p className="rounded-xl border border-violet/40 bg-violet/10 p-3.5 text-[17px] font-medium leading-snug text-snow">A profitable Year 3 does not remove the risk of running out of cash earlier.</p>
      </div>
    </div>
  )
}

function FunnelBars() {
  return (
    <div className="space-y-2">
      {funnel.map((f) => (
        <div key={f.id}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-snow">{f.label}</span>
            <span className="num text-snow">{f.value}</span>
          </div>
          <div className="mt-1 h-2.5 rounded bg-navy-2">
            <div className="h-full rounded" style={{ width: `${(f.value / funnel[0].value) * 100}%`, background: 'var(--color-ev-modelled)', opacity: 0.8 }} />
          </div>
          <p className="mt-1 text-[13px] leading-snug text-dim">{f.detail}</p>
        </div>
      ))}
      <p className="pt-1 text-[13.5px] leading-snug text-amber">{funnelNote}</p>
    </div>
  )
}

function FinTable() {
  return (
    <div className="overflow-x-auto">
      <table className="num w-full min-w-[480px] text-right text-[14px]">
        <thead>
          <tr className="font-sans text-[12px] uppercase tracking-wider text-dim">
            <th className="py-1.5 text-left font-medium">Year</th>
            <th className="font-medium">Universities</th>
            <th className="font-medium">Revenue</th>
            <th className="font-medium">EBITDA</th>
            <th className="font-medium">Net profit</th>
          </tr>
        </thead>
        <tbody className="text-snow">
          {finYears.map((d) => (
            <tr key={d.year} className="border-t border-line/60">
              <td className="py-1.5 text-left">{d.year}</td>
              <td>{d.institutions}</td>
              <td>{gbp(d.revenue)}</td>
              <td>{gbp(d.ebitda)}</td>
              <td>{gbp(d.netProfit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-sans text-[13px] text-dim">{modelLabel} Source: S5.</p>
    </div>
  )
}

function Takeaway({ size }: { size: 'present' | 'explore' }) {
  const d29 = finYears.find((d) => d.year === 2029)!
  return (
    <div>
      <p className={`font-semibold leading-[1.08] tracking-[-0.02em] text-snow ${size === 'present' ? 'text-[clamp(1.6rem,3.3vw,3.6rem)]' : 'text-[clamp(1.6rem,3.3vw,3.2rem)]'}`}>{takeaway}</p>
      <div className="mt-5 grid max-w-3xl gap-2.5 sm:grid-cols-3">
        <Stat big={`${d29.institutions}`} small="paying universities needed by 2029 (modelled)" />
        <Stat big={gbp(3919)} small="lowest projected year-end cash, in 2028" />
        <Stat big={`${((base2029.ebitda / base2029.revenue) * 100).toFixed(1)}%`} small="revenue shortfall that erases 2029 EBITDA" />
      </div>
    </div>
  )
}

export default function Ch10Viability({ mode, step, setStep }: ChapterProps) {
  const present = mode === 'present'
  void setStep

  if (present) {
    const views: ReactNode[] = [
      <div key="0">
        <ViewLabel n="View 1" title="Bottom-up market sizing" />
        <div className="mt-3">
          <OrbitRings compact />
        </div>
        <SourceNote className="mt-2">S7 · HESA 2024/25 enrolment segmentation × proposed prices. S5 · financial model V3.</SourceNote>
      </div>,
      <div key="1">
        <ViewLabel n="View 2" title="Five-year model: revenue and EBITDA" />
        <div className="mt-3">
          <ModelView compact />
        </div>
      </div>,
      <div key="2">
        <ViewLabel n="Minimum success + liquidity" title="What the business needs, and when cash is tightest" />
        <div className="mt-3">
          <MinimumView />
        </div>
        <SourceNote className="mt-2">S5 · financial model V3.</SourceNote>
      </div>,
      <div key="3">
        <ViewLabel n="View 3" title="Sensitivity explorer: how fragile is 2029?" />
        <div className="mt-3">
          <SensitivityExplorer compact />
        </div>
        <SourceNote className="mt-2">S5 · simplified one-variable sensitivities on modelled 2029 EBITDA.</SourceNote>
      </div>,
      <div key="4" className="space-y-6">
        <Takeaway size="present" />
        <LearningCard learning={learning} compact />
      </div>,
    ]
    return (
      <Stage mode={mode} className="py-[58px]! sm:py-[60px]!">
        <ModelHeader num={meta.num} kicker={meta.title} title={meta.headline} stage={meta.stage} compact>
          <Reveal>
            <p className="mt-1.5 font-mono text-[11.5px] uppercase tracking-wider text-ev-modelled">{modelLabel}</p>
          </Reveal>
        </ModelHeader>
        <div className="mt-3 min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
              {views[Math.min(step, views.length - 1)]}
            </motion.div>
          </AnimatePresence>
        </div>
      </Stage>
    )
  }

  return (
    <Stage mode={mode}>
      <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="The purpose here is to challenge the economics, not to present spectacular returns. Everything below is modelled." />
      <p className="mt-3 font-mono text-[12px] uppercase tracking-wider text-ev-modelled">{modelLabel}</p>
      <div className="mt-2">
        <SourceNote>S5 · Orbit financial model V3. S7 · HESA 2024/25 enrolment data as used in the team’s market-sizing model.</SourceNote>
      </div>

      <section className="mt-12">
        <ViewLabel n="View 1" title="Bottom-up market sizing" />
        <div className="mt-5">
          <OrbitRings />
        </div>
      </section>

      <section className="mt-16">
        <ViewLabel n="View 2" title="Five-year model: revenue and EBITDA" />
        <div className="mt-5">
          <ModelView compact={false} />
        </div>
      </section>

      <section className="mt-16">
        <ViewLabel n="Minimum success + liquidity" title="What the business needs, and when cash is tightest" />
        <div className="mt-5">
          <MinimumView />
        </div>
      </section>

      <section className="mt-16">
        <ViewLabel n="View 3" title="Sensitivity explorer: how fragile is 2029?" />
        <p className="mt-2 max-w-3xl text-silver">Move the sliders to see modelled 2029 EBITDA respond. The red tick on each slider marks where that variable alone wipes out the modelled profit.</p>
        <div className="mt-5">
          <SensitivityExplorer />
        </div>
      </section>

      <section className="mt-16">
        <Takeaway size="explore" />
      </section>

      <section className="mt-14">
        <h3 className="t-h2">Detail</h3>
        <div className="mt-4 grid gap-2.5">
          <Expandable title="Full financial table: revenue, EBITDA, net profit, institutions">
            <FinTable />
          </Expandable>
          <Expandable title="Funding and cost assumptions">
            <div className="grid gap-4 sm:grid-cols-2">
              {assumptions.map((a) => (
                <div key={a.group}>
                  <div className="font-medium text-snow">{a.group}</div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4">
                    {a.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Expandable>
          <Expandable title="Customer factory: 105 contacts to 18 net customers">
            <FunnelBars />
          </Expandable>
          <Expandable title="Worked sensitivity examples">
            <ul className="num space-y-1 text-snow">
              {[10, 20].map((p) => (
                <li key={p}>
                  {p}% revenue reduction: {gbp(base2029.revenue * (p / 100))} less revenue, EBITDA {gbp(base2029.ebitda)} → {gbp(sensitivity.revenueReduction(p / 100))}
                </li>
              ))}
            </ul>
          </Expandable>
          <Expandable title="Known issues in the financial workbook">
            <ul className="list-disc space-y-1 pl-4">
              {workbookIssues.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Expandable>
        </div>
      </section>

      <div className="mt-14">
        <LearningCard learning={learning} />
      </div>
    </Stage>
  )
}
