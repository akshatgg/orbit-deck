import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Badge, IllustrativeBadge, Kicker, ProjectionBadge, SourceNote, StatusPill, ease } from '../components/ui'
import { assumptions as finAssumptions, costSplit, gbp, milestones, withDerived } from '../data/financials'
import { marketAssumptions, marketLayers, pricingTiers } from '../data/market'
import { interviewThemes, interviews, limitations, methodologyLabel, survey, discoverySources } from '../data/research'
import {
  businessModelRowKeys,
  businessModels,
  competitorLandscape,
  pilotOutcomes,
  pilotPhases,
  pilotThresholds,
  references,
  risks,
  valueProp,
} from '../data/strategy'

/* ---------- shared bits ---------- */

const NOT_VALIDATED = 'Not yet validated'
const TO_SUPPLY = 'To be supplied by team'

function Missing({ children = TO_SUPPLY }: { children?: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-dashed border-amber/40 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber">{children}</span>
}

function H3({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-2xl font-semibold tracking-tight">{children}</h3>
      {right && <div className="flex flex-wrap gap-2">{right}</div>}
    </div>
  )
}

const tableCls = 'w-full border-collapse text-left text-sm'
const thCls = 'border-b border-line px-3 py-2.5 font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-silver'
const tdCls = 'border-b border-line/70 px-3 py-2.5 align-top text-silver'

function TableWrap({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="glass scrollbar-thin overflow-x-auto rounded-2xl">
      <table className={tableCls}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  )
}

/**
 * Generic category names for the competitor landscape. The data file uses
 * familiar brand names as shorthand; the brief asks us not to name or
 * imitate real services, so they are shown generically here.
 */
const genericCompetitorName: Record<string, string> = {
  'Eventbrite / Luma / Meetup-type platforms': 'General event & ticketing platforms',
  'LinkedIn events': 'Professional-network events',
}

/* ---------- tab content ---------- */

function ResearchSummary() {
  const headline = survey.findings.find((f) => f.id === 'missed')!
  return (
    <div>
      <H3 right={<Badge tone="silver">{methodologyLabel}</Badge>}>Research summary</H3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{survey.label}</div>
          <div className="num mt-2 text-4xl font-semibold">n = {survey.n}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{interviews.label}</div>
          <div className="num mt-2 text-4xl font-semibold">n = {interviews.n}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Headline finding</div>
          <div className="mt-2 text-lg leading-snug">
            <span className="num text-2xl font-semibold text-amber">
              {headline.value} of {headline.of}
            </span>{' '}
            <span className="text-silver">{headline.text}.</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="text-base font-semibold">What the evidence supports</div>
          <p className="mt-2 text-sm leading-relaxed text-silver">
            Students in this exploratory sample report meaningful friction discovering relevant events: fragmentation across channels and late discovery
            are recurring themes.
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-base font-semibold">
            What it does not yet show <Missing>{NOT_VALIDATED}</Missing>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-silver">
            <li>Recurring usage of Orbit (student interest ≠ recurring usage).</li>
            <li>Institutional willingness to pay ({valueProp.caveat.toLowerCase()})</li>
            <li>Approved access to institutional data (API availability ≠ approved access).</li>
            <li>Any effect on event attendance (clicks ≠ attendance).</li>
          </ul>
        </div>
      </div>
      <SourceNote className="mt-4">R1 — Orbit team, New Venture Creation report.</SourceNote>
    </div>
  )
}

function Methodology() {
  return (
    <div>
      <H3>Methodology & limitations</H3>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="glass rounded-2xl p-5 text-sm text-silver">
          <dl className="space-y-3">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Design</dt>
              <dd className="mt-0.5 text-snow">{methodologyLabel}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Instruments</dt>
              <dd className="mt-0.5">
                Online student survey (n = {survey.n}); semi-structured interviews (n = {interviews.n}).
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Discovery channels explored</dt>
              <dd className="mt-0.5">{discoverySources.join(' · ')}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Fieldwork dates, questionnaire & interview guide</dt>
              <dd className="mt-1">
                <Missing />
              </dd>
            </div>
          </dl>
        </div>
        <ul className="space-y-2">
          {limitations.map((l) => (
            <li key={l.title} className="glass rounded-xl px-4 py-3">
              <div className="text-sm font-semibold text-snow">{l.title}</div>
              <div className="mt-0.5 text-sm text-silver">{l.detail}</div>
            </li>
          ))}
        </ul>
      </div>
      <SourceNote className="mt-4">R1 — methodology and limitations as stated in the team report.</SourceNote>
    </div>
  )
}

function SurveyResults() {
  return (
    <div>
      <H3 right={<Badge tone="silver">n = {survey.n}</Badge>}>Survey results</H3>
      <figure className="glass rounded-2xl p-5">
        <figcaption className="mb-4 text-sm text-silver">Respondents agreeing / reporting, out of {survey.n}</figcaption>
        <ul className="space-y-3">
          {survey.findings.map((f) => (
            <li key={f.id}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-snow">{f.text}</span>
                <span className="num shrink-0 text-silver">
                  {f.value} / {f.of}
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/5" aria-hidden>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: f.tone === 'amber' ? 'var(--color-amber)' : f.tone === 'silver' ? 'var(--color-silver)' : 'var(--grad-orbit)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(f.value / f.of) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease }}
                />
              </div>
            </li>
          ))}
        </ul>
      </figure>
      <div className="mt-4">
        <TableWrap caption="Student survey findings with denominators">
          <thead>
            <tr>
              <th scope="col" className={thCls}>
                Finding
              </th>
              <th scope="col" className={`${thCls} text-right`}>
                Count
              </th>
              <th scope="col" className={`${thCls} text-right`}>
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {survey.findings.map((f) => (
              <tr key={f.id}>
                <th scope="row" className={`${tdCls} font-normal text-snow`}>
                  {f.text}
                </th>
                <td className={`${tdCls} num text-right`}>
                  {f.value} of {f.of}
                </td>
                <td className={`${tdCls} num text-right`}>{Math.round((f.value / f.of) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
      <SourceNote className="mt-4">R1 — student survey, n = {survey.n}. Exploratory convenience sample; percentages rounded and shown alongside counts.</SourceNote>
    </div>
  )
}

function InterviewThemes() {
  return (
    <div>
      <H3 right={<Badge tone="silver">n = {interviews.n}</Badge>}>Interview themes</H3>
      <div className="grid gap-4 md:grid-cols-2">
        {interviewThemes.map((t) => (
          <div key={t.title} className="glass rounded-2xl p-5">
            <div className="text-base font-semibold">{t.title}</div>
            <p className="mt-1 text-sm text-silver">{t.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <TableWrap caption="Interview findings with denominators">
          <thead>
            <tr>
              <th scope="col" className={thCls}>
                Interview finding
              </th>
              <th scope="col" className={`${thCls} text-right`}>
                Interviewees
              </th>
            </tr>
          </thead>
          <tbody>
            {interviews.findings.map((f) => (
              <tr key={f.id}>
                <th scope="row" className={`${tdCls} font-normal text-snow`}>
                  {f.text}
                </th>
                <td className={`${tdCls} num text-right`}>
                  {f.value} of {f.of}
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
      <p className="mt-3 text-sm text-silver">
        Per-channel counts and anonymised interview excerpts: <Missing />
      </p>
      <SourceNote className="mt-3">R1 — qualitative interviews, n = {interviews.n}. No quotations are reproduced here.</SourceNote>
    </div>
  )
}

function ScreeningMatrix() {
  return (
    <div>
      <H3 right={<Badge tone="violet">Team assessment</Badge>}>Business-model screening matrix</H3>
      <TableWrap caption="Screening of three candidate business models against criteria (team assessment)">
        <thead>
          <tr>
            <th scope="col" className={thCls}>
              Criterion
            </th>
            {businessModels.map((m) => (
              <th key={m.id} scope="col" className={`${thCls} min-w-[220px]`}>
                <span className="text-violet-soft">Option {m.option}</span> · <span className="normal-case tracking-normal text-snow">{m.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {businessModelRowKeys.map((k) => (
            <tr key={k}>
              <th scope="row" className={`${tdCls} whitespace-nowrap font-medium text-snow`}>
                {k}
              </th>
              {businessModels.map((m) => (
                <td key={m.id} className={tdCls}>
                  {m.rows[k]}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className={`${tdCls} font-medium text-snow`}>
              Requires
            </th>
            {businessModels.map((m) => (
              <td key={m.id} className={tdCls}>
                {m.requires.join(' · ')}
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className={`${tdCls} font-medium text-snow`}>
              Team verdict
            </th>
            {businessModels.map((m) => (
              <td key={m.id} className={tdCls}>
                <span className={m.selected ? 'font-semibold text-cyan' : 'text-silver'}>{m.verdict}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </TableWrap>
      <SourceNote className="mt-4">
        Qualitative team assessment from R1. No numeric scores are assigned; the selected model is the one chosen to test, not a validated revenue stream.
      </SourceNote>
    </div>
  )
}

function BusinessModelAssumptions() {
  const chosen = businessModels.find((m) => m.selected)!
  const wtp = risks.find((r) => r.id === 'wtp')!
  return (
    <div>
      <H3>Business model assumptions</H3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{valueProp.students.role}</div>
          <div className="mt-1 text-lg font-semibold">{valueProp.students.title}</div>
          <div className="mt-1 text-sm text-silver">Price: {valueProp.students.price}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{valueProp.universities.role}</div>
          <div className="mt-1 text-lg font-semibold">{valueProp.universities.title}</div>
          <div className="mt-1 text-sm text-silver">{valueProp.universities.price}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{valueProp.it.role}</div>
          <div className="mt-1 text-lg font-semibold">{valueProp.it.title}</div>
          <div className="mt-1 text-sm text-silver">{valueProp.it.influences.join(' · ')}</div>
        </div>
      </div>
      <div className="glass mt-4 rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base font-semibold">
            Option {chosen.option} — {chosen.title}
          </span>
          <StatusPill status={wtp.status} />
        </div>
        <p className="mt-2 text-sm text-silver">{wtp.assumption}</p>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">Must be true</div>
        <ul className="mt-1 grid gap-1 text-sm text-silver sm:grid-cols-2">
          {chosen.requires.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-violet-soft" /> {r} — <Missing>{NOT_VALIDATED}</Missing>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-amber/90">{valueProp.caveat}</p>
      </div>
      <SourceNote className="mt-4">R1 and R2. See the Assumption Lab for the full hypothesis register.</SourceNote>
    </div>
  )
}

function MarketSizing() {
  return (
    <div>
      <H3 right={<Badge tone="amber">Model-derived estimates</Badge>}>Market-sizing assumptions</H3>
      <TableWrap caption="Market layers: TAM, SAM and SOM scenario">
        <thead>
          <tr>
            <th scope="col" className={thCls}>
              Layer
            </th>
            <th scope="col" className={thCls}>
              Definition
            </th>
            <th scope="col" className={`${thCls} text-right`}>
              Institutions
            </th>
            <th scope="col" className={`${thCls} text-right`}>
              Indicative value / yr
            </th>
            <th scope="col" className={thCls}>
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {marketLayers.map((l) => (
            <tr key={l.id}>
              <th scope="row" className={`${tdCls} whitespace-nowrap font-medium text-snow`}>
                {l.label}
              </th>
              <td className={tdCls}>{l.definition}</td>
              <td className={`${tdCls} num text-right`}>{l.institutions}</td>
              <td className={`${tdCls} num text-right text-snow`}>{gbp(l.value)}</td>
              <td className={tdCls}>{l.note}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TableWrap caption="Assumed annual list prices by institution size">
          <thead>
            <tr>
              <th scope="col" className={thCls}>
                Pricing tier
              </th>
              <th scope="col" className={thCls}>
                Student population
              </th>
              <th scope="col" className={`${thCls} text-right`}>
                Assumed list price / yr
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingTiers.map((t) => (
              <tr key={t.id}>
                <th scope="row" className={`${tdCls} font-medium text-snow`}>
                  {t.label}
                </th>
                <td className={tdCls}>{t.range}</td>
                <td className={`${tdCls} num text-right`}>{gbp(t.price)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <ul className="glass space-y-2 rounded-2xl p-5 text-sm text-silver">
          {marketAssumptions.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-amber" />
              {a}
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-2 pt-1">
            Price acceptance by institutions: <Missing>{NOT_VALIDATED}</Missing>
          </li>
        </ul>
      </div>
      <SourceNote className="mt-4">R3 — Orbit team market sizing model. Values multiply institution counts by assumed list prices; they are not contracted demand.</SourceNote>
    </div>
  )
}

function Competitors() {
  return (
    <div>
      <H3 right={<Badge tone="silver">Generic categories</Badge>}>Competitor & alternatives landscape</H3>
      <TableWrap caption="How students currently discover events, by channel category">
        <thead>
          <tr>
            <th scope="col" className={thCls}>
              Alternative
            </th>
            <th scope="col" className={thCls}>
              Type
            </th>
            <th scope="col" className={thCls}>
              Strength
            </th>
            <th scope="col" className={thCls}>
              Gap Orbit targets
            </th>
          </tr>
        </thead>
        <tbody>
          {competitorLandscape.map((c) => (
            <tr key={c.name}>
              <th scope="row" className={`${tdCls} font-medium text-snow`}>
                {genericCompetitorName[c.name] ?? c.name}
              </th>
              <td className={tdCls}>{c.type}</td>
              <td className={tdCls}>{c.strength}</td>
              <td className={tdCls}>{c.gap}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <p className="mt-3 text-sm text-silver">
        Detailed feature / pricing comparison with named direct competitors: <Missing />
      </p>
      <SourceNote className="mt-3">R1 — team analysis. Gaps describe the hypothesis Orbit tests, not a demonstrated advantage.</SourceNote>
    </div>
  )
}

function Financials() {
  return (
    <div>
      <H3 right={<ProjectionBadge />}>Financial forecast (projection)</H3>
      <TableWrap caption="Five-year financial projection, 2027 to 2031, from the team workbook">
        <thead>
          <tr>
            <th scope="col" className={thCls}>
              Metric
            </th>
            {withDerived.map((y) => (
              <th key={y.year} scope="col" className={`${thCls} text-right`}>
                {y.year}P
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(
            [
              ['Paying institutions (modelled)', (y) => String(y.institutions)],
              ['Revenue', (y) => gbp(y.revenue)],
              ['Total costs (derived: revenue − EBITDA)', (y) => gbp(y.totalCosts)],
              ['EBITDA', (y) => gbp(y.ebitda)],
              ['EBITDA margin', (y) => `${Math.round(y.ebitdaMargin * 100)}%`],
              ['Net profit', (y) => gbp(y.netProfit)],
              ['Cumulative net profit', (y) => gbp(y.cumulativeNet)],
              ['Revenue per institution', (y) => gbp(y.revenuePerInstitution)],
            ] as [string, (y: (typeof withDerived)[number]) => string][]
          ).map(([label, fmt]) => (
            <tr key={label}>
              <th scope="row" className={`${tdCls} whitespace-nowrap font-medium text-snow`}>
                {label}
              </th>
              {withDerived.map((y) => (
                <td key={y.year} className={`${tdCls} num whitespace-nowrap text-right`}>
                  {fmt(y)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className={`${tdCls} font-medium text-snow`}>
              COGS / OpEx split
            </th>
            {withDerived.map((y) => (
              <td key={y.year} className={`${tdCls} text-right`}>
                {costSplit[y.year] ? `${gbp(costSplit[y.year]!.cogs)} / ${gbp(costSplit[y.year]!.opex)}` : <Missing />}
              </td>
            ))}
          </tr>
        </tbody>
      </TableWrap>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['First modelled EBITDA-positive year', String(milestones.firstProfitableYear)],
          [`ARR target (${milestones.arrTargetYear})`, gbp(milestones.arrTarget)],
          [`Lowest year-end cash (${milestones.minCashYear})`, `≈ ${gbp(milestones.minCash)}`],
          ['Initial financing', `${gbp(milestones.equity)} equity · ${gbp(milestones.debt)} debt`],
        ].map(([k, v]) => (
          <div key={k} className="glass rounded-xl p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">{k}</div>
            <div className="num mt-1 text-lg text-snow">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {finAssumptions.map((g) => (
          <div key={g.group} className="glass rounded-xl p-4">
            <div className="text-sm font-semibold text-snow">{g.group}</div>
            <ul className="mt-1 space-y-1 text-sm text-silver">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <SourceNote className="mt-4">
        R2 — Orbit team financial workbook. All 2027–2031 values are projections, not operating results. Total costs are derived as revenue minus EBITDA.
      </SourceNote>
    </div>
  )
}

function PilotSummary() {
  return (
    <div>
      <H3 right={<IllustrativeBadge label="Proposed — not run" />}>Pilot design summary</H3>
      <p className="mb-4 text-sm text-amber/90">Proposed pilot framework — not an approved or completed Imperial pilot. No pilot results exist yet.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <TableWrap caption="Proposed pilot phases">
          <thead>
            <tr>
              <th scope="col" className={thCls}>
                Phase
              </th>
              <th scope="col" className={thCls}>
                Timing & activity
              </th>
            </tr>
          </thead>
          <tbody>
            {pilotPhases.map((p) => (
              <tr key={p.id}>
                <th scope="row" className={`${tdCls} font-medium text-snow`}>
                  {p.title}
                </th>
                <td className={tdCls}>
                  <span className="num text-xs text-dim">{p.weeks}</span>
                  <br />
                  {p.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <TableWrap caption="Provisional pilot thresholds">
          <thead>
            <tr>
              <th scope="col" className={thCls}>
                Proposed target
              </th>
              <th scope="col" className={thCls}>
                Measure
              </th>
            </tr>
          </thead>
          <tbody>
            {pilotThresholds.map((t) => (
              <tr key={t.id}>
                <th scope="row" className={`${tdCls} num font-medium text-snow`}>
                  {t.target !== null ? `≥ ${t.target}${t.unit}` : 'Gate'}
                </th>
                <td className={tdCls}>{t.label}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <TableWrap caption="Pilot decision outcomes">
          <thead>
            <tr>
              <th scope="col" className={thCls}>
                Outcome
              </th>
              <th scope="col" className={thCls}>
                Meaning & next step
              </th>
            </tr>
          </thead>
          <tbody>
            {pilotOutcomes.map((o) => (
              <tr key={o.id}>
                <th scope="row" className={`${tdCls} whitespace-nowrap font-semibold`} style={{ color: o.color }}>
                  {o.label}
                </th>
                <td className={tdCls}>
                  <span className="text-snow">{o.summary}</span> {o.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
      <SourceNote className="mt-4">R6 — thresholds are proposed targets requiring stakeholder agreement and refinement, not established industry benchmarks.</SourceNote>
    </div>
  )
}

function Sources() {
  return (
    <div>
      <H3>Sources & references</H3>
      <TableWrap caption="Sources and references">
        <thead>
          <tr>
            <th scope="col" className={thCls}>
              ID
            </th>
            <th scope="col" className={thCls}>
              Source
            </th>
            <th scope="col" className={thCls}>
              Scope
            </th>
          </tr>
        </thead>
        <tbody>
          {references.map((r) => (
            <tr key={r.id} id={`ref-${r.id}`}>
              <th scope="row" className={`${tdCls} num font-medium text-violet-soft`}>
                {r.id}
              </th>
              <td className={`${tdCls} text-snow`}>{r.title}</td>
              <td className={tdCls}>{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-silver">
        Full report, workbook files, raw survey data and external citations: <Missing />
      </p>
    </div>
  )
}

/* ---------- tabs ---------- */

const tabs: { id: string; label: string; C: () => ReactNode }[] = [
  { id: 'summary', label: 'Research summary', C: ResearchSummary },
  { id: 'method', label: 'Methodology & limitations', C: Methodology },
  { id: 'survey', label: 'Survey results', C: SurveyResults },
  { id: 'interviews', label: 'Interview themes', C: InterviewThemes },
  { id: 'screening', label: 'Screening matrix', C: ScreeningMatrix },
  { id: 'bm', label: 'Business model assumptions', C: BusinessModelAssumptions },
  { id: 'market', label: 'Market sizing', C: MarketSizing },
  { id: 'competitors', label: 'Competitor landscape', C: Competitors },
  { id: 'financials', label: 'Financial forecast', C: Financials },
  { id: 'pilot', label: 'Pilot design', C: PilotSummary },
  { id: 'sources', label: 'Sources & references', C: Sources },
]

export default function EvidenceRoom() {
  const [active, setActive] = useState(tabs[0].id)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const current = tabs.find((t) => t.id === active)!

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active)
    let n = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = tabs.length - 1
    if (n < 0) return
    e.preventDefault()
    setActive(tabs[n].id)
    refs.current[tabs[n].id]?.focus()
  }

  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16" aria-labelledby="evidence-room-title">
      <Kicker>Explore · Reference hub</Kicker>
      <h2 id="evidence-room-title" className="t-h2 mt-4">
        The Evidence Room
      </h2>
      <p className="t-lead mt-4 max-w-3xl">
        Everything behind the pitch in one place — research, assumptions, models and sources — with denominators shown and gaps labelled honestly.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <div
          role="tablist"
          aria-label="Evidence Room sections"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="scrollbar-thin -mx-1 flex gap-1 overflow-x-auto px-1 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
        >
          {tabs.map((t, i) => {
            const on = t.id === active
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[t.id] = el
                }}
                role="tab"
                id={`er-tab-${t.id}`}
                aria-selected={on}
                aria-controls={`er-panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={`relative flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  on ? 'text-snow' : 'text-silver hover:bg-white/5 hover:text-snow'
                }`}
              >
                {on && <motion.span layoutId="er-tab-bg" className="absolute inset-0 -z-10 rounded-lg border border-violet/40 bg-violet/10" transition={{ duration: 0.3, ease }} />}
                <span className="num text-[11px] text-dim">{String(i + 1).padStart(2, '0')}</span>
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              role="tabpanel"
              id={`er-panel-${current.id}`}
              aria-labelledby={`er-tab-${current.id}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              <current.C />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
