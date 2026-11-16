import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState } from 'react'
import FiveYearChart from '../components/model/FiveYearChart'
import HeroChart from '../components/model/HeroChart'
import Indicators from '../components/model/Indicators'
import { LiquidityTiles, MinSuccessNotes, ThresholdBars } from '../components/model/MinimumSuccess'
import ModelHeader from '../components/model/ModelHeader'
import OrbitRings, { LayerCalc, LayerTabs, RingsSvg, SizingLimits, money, type LayerId } from '../components/model/OrbitRings'
import SensitivityExplorer from '../components/model/SensitivityExplorer'
import { ChapterHeader, EvidenceTag, Expandable, GlowNumber, LearningCard, LearningStrip, Reveal, SourceNote, SplitHeadline, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { assumptions, base2029, commentary, finYears, gbp, milestones, minimumSuccess, modelLabel, sensitivity, workbookIssues } from '../data/financials'
import { funnel, funnelNote, marketLayers } from '../data/market'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'viability')!

const learning = {
  believed: 'A large market meant a viable business.',
  investigated: 'Bottom-up market sizing and a five-year financial model with sensitivities.',
  learned: 'Viability depends on about 18 paying universities by 2029 and tight early cash.',
  changed: 'We identified the purchasing and renewal evidence the model requires.',
}

const takeaway = 'The model establishes what must become true for Orbit to work. It does not establish that those untested guesses will come true.'

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
        <Indicators />
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


/* ---------- Present-mode hero views (one idea per step) ---------- */

function Title({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <h3 className="text-[clamp(1.4rem,2.5vw,2.4rem)] font-semibold leading-tight tracking-tight text-snow">
        <SplitHeadline text={text} />
      </h3>
      <EvidenceTag label="modelled" text="Modelled — not achieved" />
    </div>
  )
}

const ringShort: Record<string, string> = { tam: 'UK providers, 5,000+ students', sam: 'serviceable by Orbit', som: 'our 2029 scenario' }

function RingsStep() {
  const [sel, setSel] = useState<LayerId>('tam')
  return (
    <div>
      <Title text="Bottom-up: *every ring is arithmetic*" />
      <div className="mt-4 grid items-center gap-8 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-14">
        <RingsSvg sel={sel} onSel={setSel} maxWidth={330} caption={false} />
        <div className="space-y-3">
          {marketLayers.map((l, i) => {
            const active = sel === l.id
            return (
              <Reveal key={l.id} delay={0.25 + i * 0.15}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSel(l.id)
                  }}
                  aria-pressed={active}
                  className={`lift flex w-full items-center gap-5 rounded-2xl border px-5 py-3 text-left ${active ? 'border-ev-modelled/70 bg-ev-modelled/10' : 'border-line bg-navy/50'}`}
                >
                  <span className="w-[4.5rem] shrink-0 font-mono text-lg font-semibold tracking-[0.1em] text-ev-modelled">{l.id.toUpperCase()}</span>
                  <GlowNumber value={l.value} format={money} className="text-[clamp(2.4rem,4.6vw,4.2rem)] leading-none" />
                  <span className="ml-auto text-right text-[15px] leading-tight text-silver">
                    <span className="num block text-lg text-snow">{l.institutions} institutions</span>
                    {ringShort[l.id]}
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Expandable title={<span className="text-[14px]">Show the calculation and its limits</span>} className="min-w-[280px] max-w-xl">
          <div className="space-y-3">
            <LayerTabs sel={sel} onSel={setSel} />
            <LayerCalc sel={sel} />
            <SizingLimits compact />
          </div>
        </Expandable>
        <SourceNote>S7 · HESA 2024/25 × proposed prices</SourceNote>
      </div>
    </div>
  )
}

function ChartStep() {
  return (
    <div>
      <p className="text-[clamp(1.5rem,2.8vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-snow">
        <SplitHeadline text="EBITDA turns positive in *2029* (modelled)" />
      </p>
      <div className="mt-3 grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-7">
        <div>
          <HeroChart h={360} />
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-silver">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm bg-violet/60" /> Revenue</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-ev-modelled" /> EBITDA</span>
            <EvidenceTag label="modelled" text="Modelled — not achieved" />
            <span className="text-dim">S5</span>
          </div>
          <p className="mt-1 text-[12.5px] text-dim">{modelLabel}</p>
        </div>
        <Indicators />
      </div>
    </div>
  )
}

function MustBecomeTrueStep() {
  const miss = 0.2
  const after = sensitivity.revenueReduction(miss)
  const d29 = finYears.find((d) => d.year === 2029)!
  const tiles: { v: number; f: (n: number) => string; l: string }[] = [
    { v: d29.institutions, f: (n) => `${Math.round(n)}`, l: 'paying universities by 2029' },
    { v: milestones.arrTarget, f: (n) => `≈£${Math.round(n / 1000)}k`, l: 'recurring revenue (ARR) needed in 2029' },
  ]
  return (
    <div className="space-y-6">
      <p className="max-w-5xl text-[clamp(1.9rem,4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-snow">
        <SplitHeadline text="The model shows what *must become true* — not that it will." />
      </p>
      <div className="grid gap-5 sm:grid-cols-3">
        {tiles.map((st, i) => (
          <Reveal key={st.l} delay={0.4 + i * 0.15} className="rounded-2xl border border-line bg-navy/55 px-6 py-5">
            <div className="text-[clamp(2.6rem,4.6vw,4.4rem)] leading-none">
              <GlowNumber value={st.v} format={st.f} className="text-[1em]" />
            </div>
            <div className="mt-2 text-[16px] leading-snug text-silver">{st.l}</div>
          </Reveal>
        ))}
        <Reveal delay={0.7} className="rounded-2xl border border-st-contradicted/40 bg-st-contradicted/[0.07] px-6 py-5">
          <div className="num whitespace-nowrap text-[clamp(1.4rem,2.2vw,2.4rem)] font-semibold leading-none text-snow">
            {gbp(base2029.ebitda, { compact: true, sign: true })} <span className="text-silver">→</span> <span className="text-red">{gbp(after, { compact: true })}</span>
          </div>
          <div className="mt-2 text-[16px] leading-snug text-silver">2029 EBITDA after a {miss * 100}% revenue miss: the profit is erased</div>
        </Reveal>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <EvidenceTag label="modelled" text="Modelled — not achieved" />
        <SourceNote>S5 · one-variable sensitivity, costs held constant</SourceNote>
      </div>
      <LearningStrip believed="A big market meant a viable business." learned="It needs ~18 paying universities." changed="We named the purchase evidence it requires." />
    </div>
  )
}

export default function Ch10Viability({ mode, step, setStep }: ChapterProps) {
  const present = mode === 'present'
  void setStep

  if (present) {
    const views: ReactNode[] = [<RingsStep key="0" />, <ChartStep key="1" />, <MustBecomeTrueStep key="2" />]
    return (
      <Stage mode={mode} className="py-[58px]! sm:py-[60px]!">
        <ModelHeader num={meta.num} kicker={meta.title} title={meta.headline.replace('a real business?', '*a real business?*')} stage={meta.stage} compact />
        <div className="mt-4 min-h-[470px]">
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
