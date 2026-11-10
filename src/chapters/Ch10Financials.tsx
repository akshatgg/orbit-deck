import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Info } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { C, DenseHeader, TipBox, axisProps, pct, useChartAnim } from '../components/biz/kit'
import { CountUp, Expandable, ProjectionBadge, Reveal, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { assumptions, commentary, costSplit, gbp, milestones, withDerived } from '../data/financials'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'financials')!
const years = withDerived.map((y) => y.year)
type Row = (typeof withDerived)[number]

const SRC = 'Orbit team financial workbook (R2). 2027–2031 values are projections, not operating results.'
const yTick = (v: number) => gbp(v, { compact: true })

const panels = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'ebitda', label: 'Profitability' },
  { id: 'target', label: '£230k challenge' },
  { id: 'cash', label: 'Cash & risk' },
] as const

/** Year the presenter's narration focuses on at each step. */
const stepYear = [2031, milestones.firstProfitableYear, milestones.arrTargetYear, milestones.minCashYear]

/** CHAPTER 10 — Can Orbit become a sustainable business? */
export default function Ch10Financials({ mode, step, setStep }: ChapterProps) {
  const explore = mode === 'explore'
  const [year, setYear] = useState<number>(explore ? 2029 : stepYear[Math.min(step, 3)])

  useEffect(() => {
    if (!explore) setYear(stepYear[Math.min(step, 3)])
  }, [step, explore])

  if (explore) {
    return (
      <Stage mode={mode}>
        <DenseHeader num={meta.num} kicker={meta.actTitle} title="Can Orbit become a" accent="sustainable business?" />
        <p className="t-lead mt-5 max-w-3xl">
          A financial command centre for the team's five-year model. Every figure is a workbook projection; derived values are labelled as such.
        </p>
        <div className="mt-10">
          <YearExplorer year={year} setYear={setYear} layout="wide" />
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <RevenuePanel year={year} setYear={setYear} h={300} />
          <EbitdaPanel year={year} setYear={setYear} h={300} />
          <CostsPanel year={year} setYear={setYear} h={300} />
          <TargetPanel />
          <div className="lg:col-span-2">
            <CashPanel year={year} setYear={setYear} h={300} />
          </div>
        </div>
        <AssumptionsDrawer />
      </Stage>
    )
  }

  const s = Math.min(step, 3)
  return (
    <Stage mode={mode} className="!pt-[74px] !pb-[62px]">
      <DenseHeader
        num={meta.num}
        kicker={meta.actTitle}
        title="Can Orbit become a"
        accent="sustainable business?"
        size="h2"
        right={
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Financial panels">
            {panels.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={s === i}
                onClick={(e) => {
                  e.stopPropagation()
                  setStep(i)
                }}
                className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${s === i ? 'text-snow' : 'text-silver hover:text-snow'}`}
              >
                {s === i && <motion.span layoutId="fin-tab" className="absolute inset-0 -z-10 rounded-full border border-violet/40 bg-violet/15" />}
                <span className="num mr-1 text-dim">{String.fromCharCode(65 + i)}</span>
                {p.label}
              </button>
            ))}
          </div>
        }
      />
      <div className="mt-4 grid min-h-0 gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="min-w-0 lg:col-span-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
              {s === 0 && <RevenuePanel year={year} setYear={setYear} h="min(40vh, 430px)" />}
              {s === 1 && <EbitdaPanel year={year} setYear={setYear} h="min(40vh, 430px)" />}
              {s === 2 && <TargetPanel big />}
              {s === 3 && <CashPanel year={year} setYear={setYear} h="min(27vh, 340px)" />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="min-w-0 lg:col-span-4">
          <YearExplorer year={year} setYear={setYear} layout="side" />
        </div>
      </div>
    </Stage>
  )
}

/* ---------------------------------------------------------------- */
/* Shared bits                                                       */
/* ---------------------------------------------------------------- */

function Panel({ title, sub, children, source, className = '', tag }: { title: ReactNode; sub?: ReactNode; children: ReactNode; source?: ReactNode; className?: string; tag?: ReactNode }) {
  return (
    <section className={`glass rounded-2xl p-4 lg:p-5 ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight lg:text-xl">{title}</h3>
          {sub && <p className="mt-0.5 text-[14px] text-silver">{sub}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {tag}
          <ProjectionBadge />
        </div>
      </header>
      <div className="mt-3">{children}</div>
      <SourceNote className="mt-2">{source ?? SRC}</SourceNote>
    </section>
  )
}

type TipProps = { active?: boolean; payload?: ReadonlyArray<{ payload?: unknown }> }

function FinTip({ active, payload }: TipProps) {
  const r = payload?.[0]?.payload as Row | undefined
  if (!active || !r) return null
  return (
    <TipBox
      title={`${r.year} · projection`}
      rows={[
        { label: 'Revenue', value: gbp(r.revenue), color: C.cyan },
        { label: 'EBITDA', value: gbp(r.ebitda), color: r.ebitda >= 0 ? C.pos : C.neg },
        { label: 'Net profit', value: gbp(r.netProfit), color: C.violetSoft },
        { label: 'Institutions', value: String(r.institutions), color: C.peach },
      ]}
      foot="Workbook (R2)"
    />
  )
}

function useYearClick(setYear: (y: number) => void) {
  return (st: { activeTooltipIndex?: number | string | null } | null | undefined) => {
    const i = st?.activeTooltipIndex
    if (i === undefined || i === null) return
    const row = withDerived[Number(i)]
    if (row) setYear(row.year)
  }
}

interface ChartPanelProps {
  year: number
  setYear: (y: number) => void
  h: number | string
}

/* ---------------------------------------------------------------- */
/* A — Revenue                                                       */
/* ---------------------------------------------------------------- */

function RevenuePanel({ year, setYear, h }: ChartPanelProps) {
  const anim = useChartAnim()
  const onClick = useYearClick(setYear)
  return (
    <Panel title="Revenue, 2027–2031" sub="Hover for EBITDA, net profit and institutions · click a year to explore">
      <div style={{ height: h }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={withDerived} margin={{ top: 16, right: 12, left: 4, bottom: 0 }} onClick={onClick} style={{ cursor: 'pointer' }}>
            <defs>
              <linearGradient id="fin-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cyan} stopOpacity={0.45} />
                <stop offset="100%" stopColor={C.violet} stopOpacity={0.02} />
              </linearGradient>
              <filter id="fin-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={yTick} width={62} />
            <Tooltip content={<FinTip />} cursor={{ stroke: C.line, strokeWidth: 1 }} />
            <ReferenceLine x={year} stroke={C.violetSoft} strokeOpacity={0.5} strokeDasharray="2 4" />
            <Area type="monotone" dataKey="revenue" stroke={C.cyan} strokeWidth={3} fill="url(#fin-rev)" filter="url(#fin-glow)" isAnimationActive={anim} animationDuration={1400} dot={{ r: 4, fill: '#070a12', stroke: C.cyan, strokeWidth: 2 }} activeDot={{ r: 6, fill: C.cyan }} />
            <ReferenceDot x={year} y={withDerived.find((r) => r.year === year)!.revenue} r={7} fill={C.cyan} stroke={C.snow} strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

/* ---------------------------------------------------------------- */
/* B — EBITDA crossover                                              */
/* ---------------------------------------------------------------- */

function EbitdaPanel({ year, setYear, h }: ChartPanelProps) {
  const anim = useChartAnim()
  const onClick = useYearClick(setYear)
  const cross = withDerived.find((r) => r.year === milestones.firstProfitableYear)!
  return (
    <Panel
      title="EBITDA crosses zero in 2029"
      sub="Modelled milestone — not guaranteed profitability"
      tag={
        <span className="rounded-full border border-st-supported/40 bg-st-supported/10 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-st-supported">
          Modelled milestone
        </span>
      }
    >
      <div style={{ height: h }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={withDerived} margin={{ top: 28, right: 16, left: 4, bottom: 0 }} onClick={onClick} style={{ cursor: 'pointer' }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={yTick} width={62} />
            <Tooltip content={<FinTip />} cursor={{ fill: 'rgba(156,169,188,0.05)' }} />
            <ReferenceLine y={0} stroke={C.silver} strokeOpacity={0.6} label={{ value: 'Break-even (EBITDA = 0)', position: 'insideBottomLeft', fill: C.dim, fontSize: 11 }} />
            <Bar dataKey="ebitda" radius={[6, 6, 6, 6]} maxBarSize={56} isAnimationActive={anim} animationDuration={1000}>
              {withDerived.map((r) => (
                <Cell key={r.year} fill={r.ebitda >= 0 ? C.pos : C.neg} fillOpacity={r.year === year ? 0.9 : 0.4} stroke={r.year === year ? C.snow : 'none'} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="ebitda" stroke={C.violetSoft} strokeWidth={2} dot={false} isAnimationActive={anim} animationDuration={1400} />
            <ReferenceDot
              x={cross.year}
              y={cross.ebitda}
              r={8}
              fill={C.pos}
              stroke={C.snow}
              strokeWidth={2}
              label={{ value: `First positive EBITDA · ${gbp(cross.ebitda)}`, position: 'top', fill: C.snow, fontSize: 12, offset: 14 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[14px] leading-snug text-silver">
        EBITDA margin in the model: {withDerived.map((r) => `${r.year} ${pct(r.ebitdaMargin)}`).join(' · ')}. It depends on acquisition and retention holding.
      </p>
    </Panel>
  )
}

/* ---------------------------------------------------------------- */
/* D — Revenue vs costs                                              */
/* ---------------------------------------------------------------- */

function CostsPanel({ year, setYear, h }: ChartPanelProps) {
  const anim = useChartAnim()
  const onClick = useYearClick(setYear)
  const hasSplit = years.some((y) => costSplit[y] != null)
  const data = withDerived.map((r) => ({ ...r, cogs: costSplit[r.year]?.cogs ?? null, opex: costSplit[r.year]?.opex ?? null }))
  return (
    <Panel title="Revenue vs total costs" sub="Total costs = revenue − EBITDA (COGS + OpEx combined, derived)">
      <div style={{ height: h }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 16, right: 12, left: 4, bottom: 0 }} onClick={onClick} style={{ cursor: 'pointer' }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={yTick} width={62} />
            <Tooltip
              cursor={{ fill: 'rgba(156,169,188,0.05)' }}
              content={({ active, payload }) => {
                const r = payload?.[0]?.payload as (typeof data)[number] | undefined
                if (!active || !r) return null
                return (
                  <TipBox
                    title={`${r.year} · projection`}
                    rows={[
                      { label: 'Revenue', value: gbp(r.revenue), color: C.cyan },
                      { label: 'Total costs (derived)', value: gbp(r.totalCosts), color: C.peach },
                      ...(r.cogs != null && r.opex != null
                        ? [
                            { label: 'COGS', value: gbp(r.cogs), color: C.amber },
                            { label: 'OpEx', value: gbp(r.opex), color: C.lavender },
                          ]
                        : []),
                      { label: 'EBITDA', value: gbp(r.ebitda), color: r.ebitda >= 0 ? C.pos : C.neg },
                    ]}
                    foot="Total costs derived as revenue − EBITDA"
                  />
                )
              }}
            />
            <ReferenceLine x={year} stroke={C.violetSoft} strokeOpacity={0.5} strokeDasharray="2 4" />
            <ReferenceLine y={0} stroke={C.line} />
            {hasSplit ? (
              <>
                <Bar dataKey="cogs" stackId="c" fill={C.amber} fillOpacity={0.55} maxBarSize={40} isAnimationActive={anim} />
                <Bar dataKey="opex" stackId="c" fill={C.lavender} fillOpacity={0.45} radius={[5, 5, 0, 0]} maxBarSize={40} isAnimationActive={anim} />
              </>
            ) : (
              <Bar dataKey="ebitda" maxBarSize={40} radius={[5, 5, 5, 5]} isAnimationActive={anim}>
                {withDerived.map((r) => (
                  <Cell key={r.year} fill={r.ebitda >= 0 ? C.pos : C.neg} fillOpacity={0.35} />
                ))}
              </Bar>
            )}
            <Line type="monotone" dataKey="revenue" stroke={C.cyan} strokeWidth={3} dot={{ r: 3, fill: C.cyan }} isAnimationActive={anim} />
            <Line type="monotone" dataKey="totalCosts" stroke={C.peach} strokeWidth={3} dot={{ r: 3, fill: C.peach }} isAnimationActive={anim} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-silver">
        <Legend color={C.cyan} label="Revenue" />
        <Legend color={C.peach} label="Total costs (derived)" />
        {hasSplit ? (
          <>
            <Legend color={C.amber} label="COGS" bar />
            <Legend color={C.lavender} label="OpEx" bar />
          </>
        ) : (
          <Legend color={C.pos} label="EBITDA (gap)" bar />
        )}
      </div>
      {!hasSplit && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-white/[0.03] px-3 py-2 text-[13px] text-silver">
          <Info size={14} className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="text-snow">COGS / OpEx split: awaiting workbook import.</span> Only the combined total is shown; no split has been estimated.
          </span>
        </div>
      )}
    </Panel>
  )
}

function Legend({ color, label, bar = false }: { color: string; label: string; bar?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={bar ? 'h-2.5 w-2.5 rounded-sm' : 'h-[3px] w-4 rounded-full'} style={{ background: color }} />
      {label}
    </span>
  )
}

/* ---------------------------------------------------------------- */
/* E — The £230k challenge                                           */
/* ---------------------------------------------------------------- */

function TargetPanel({ big = false }: { big?: boolean }) {
  const budget = milestones.operatingBudget2029
  const target = milestones.arrTarget
  const allowance = target - budget // derived
  const rev = withDerived.find((r) => r.year === milestones.arrTargetYear)!.revenue
  const headroom = rev - target // derived
  const max = 280_000
  // semicircle gauge geometry
  const cx = 150
  const cy = 150
  const R = 120
  const ang = (v: number) => Math.PI * (1 - v / max) // 0 → left, max → right
  const pt = (v: number, r = R) => [cx + r * Math.cos(ang(v)), cy - r * Math.sin(ang(v))] as const
  const arc = (a: number, b: number, r = R) => {
    const [x1, y1] = pt(a, r)
    const [x2, y2] = pt(b, r)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }
  const [tx1, ty1] = pt(target, R - 22)
  const [tx2, ty2] = pt(target, R + 20)
  const [nx, ny] = pt(rev, R - 34)
  const [lx, ly] = pt(rev, R + 34)

  return (
    <Panel title="The £230k challenge" sub={`Recurring revenue needed in ${milestones.arrTargetYear} to cover the planned operating budget`}>
      <div className={`grid items-center gap-5 ${big ? 'md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]' : 'md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'}`}>
        <div className="relative mx-auto w-full max-w-[460px]">
          <svg viewBox="0 0 300 172" className="w-full overflow-visible" role="img" aria-label={`Gauge: target ${gbp(target)}, 2029 modelled revenue ${gbp(rev)}`}>
            <path d={arc(0, max)} stroke="rgba(156,169,188,0.12)" strokeWidth={18} fill="none" strokeLinecap="round" />
            <motion.path d={arc(0, budget)} stroke={C.violet} strokeWidth={18} fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }} />
            <motion.path d={arc(budget, target)} stroke={C.peach} strokeWidth={18} fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, ease, delay: 1.1 }} />
            <motion.path d={arc(target, rev, R + 16)} stroke={C.cyan} strokeWidth={4} fill="none" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.7 }} style={{ filter: `drop-shadow(0 0 4px ${C.cyan})` }} />
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={C.snow} strokeWidth={2.5} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.cyan} strokeWidth={2} strokeLinecap="round" />
              <circle cx={cx} cy={cy} r={5} fill={C.cyan} />
              <text x={lx} y={ly} textAnchor="middle" fontSize={10} fill={C.cyan} className="font-mono">
                {gbp(rev, { compact: true })}
              </text>
            </motion.g>
            <text x={pt(0)[0]} y={cy + 20} textAnchor="middle" fontSize={9} fill={C.dim} className="font-mono">
              £0
            </text>
            <text x={pt(max)[0]} y={cy + 20} textAnchor="middle" fontSize={9} fill={C.dim} className="font-mono">
              {gbp(max, { compact: true })}
            </text>
          </svg>
          <div className="-mt-1 text-center">
            <div className={`num font-semibold tracking-tight ${big ? 'text-[clamp(2.25rem,4.2vw,4.25rem)]' : 'text-4xl'}`}>
              <CountUp value={target} format={(n) => gbp(n)} />
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-silver">recurring-revenue target · {milestones.arrTargetYear}</div>
          </div>
        </div>
        <div className="space-y-2.5">
          <TargetRow color={C.violet} label={`${milestones.arrTargetYear} operating cash budget`} value={`~${gbp(budget)}`} note="Workbook" />
          <TargetRow color={C.peach} label="Coverage allowance" value={`+ ${gbp(allowance)}`} note="Derived: target − budget" />
          <TargetRow color={C.snow} label="Recurring-revenue target" value={gbp(target)} note="Workbook" strong />
          <TargetRow color={C.cyan} label={`${milestones.arrTargetYear} modelled revenue`} value={gbp(rev)} note={`${gbp(headroom, { sign: true })} vs target (derived)`} />
          <div className="flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/[0.07] px-3.5 py-2.5 text-[14px] leading-snug text-snow/90">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber" />
            <span>
              A planning target, <span className="font-semibold">not the exact accounting break-even</span>. In the model, 2029 revenue clears it with {withDerived.find((r) => r.year === milestones.arrTargetYear)!.institutions} paying
              institutions — a modelled count, not a commitment.
            </span>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function TargetRow({ color, label, value, note, strong = false }: { color: string; label: string; value: string; note: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2 ${strong ? 'border border-snow/25 bg-white/[0.05]' : 'border border-line bg-white/[0.02]'}`}>
      <span className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
        <span>
          <span className={`block text-[15px] leading-tight ${strong ? 'font-semibold text-snow' : 'text-snow/90'}`}>{label}</span>
          <span className="block font-mono text-[10.5px] text-dim">{note}</span>
        </span>
      </span>
      <span className={`num shrink-0 ${strong ? 'text-xl font-semibold' : 'text-lg'}`}>{value}</span>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* F — Funding & cash risk                                           */
/* ---------------------------------------------------------------- */

function CashPanel({ year, setYear, h }: ChartPanelProps) {
  const anim = useChartAnim()
  const onClick = useYearClick(setYear)
  const recovery = withDerived.find((r) => r.year === milestones.cashRecoveryYear)!
  return (
    <Panel title="Funding & liquidity risk" sub="Projected profitability does not eliminate liquidity risk">
      <div className="mb-3 flex flex-wrap gap-2">
        <Chip label="Equity" value={gbp(milestones.equity)} />
        <Chip label="Debt" value={gbp(milestones.debt)} />
        <Chip label={`Min. year-end cash · ${milestones.minCashYear}`} value={`≈ ${gbp(milestones.minCash)}`} warn />
        <Chip label="Cumulative net profit turns positive" value={String(milestones.cashRecoveryYear)} />
      </div>
      <div style={{ height: h }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={withDerived} margin={{ top: 22, right: 16, left: 4, bottom: 0 }} onClick={onClick} style={{ cursor: 'pointer' }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={yTick} width={62} />
            <Tooltip
              cursor={{ fill: 'rgba(156,169,188,0.05)' }}
              content={({ active, payload }) => {
                const r = payload?.[0]?.payload as Row | undefined
                if (!active || !r) return null
                return (
                  <TipBox
                    title={`${r.year} · projection`}
                    rows={[
                      { label: 'Net profit', value: gbp(r.netProfit), color: r.netProfit >= 0 ? C.pos : C.neg },
                      { label: 'Cumulative net (derived)', value: gbp(r.cumulativeNet), color: C.violetSoft },
                      ...(r.year === milestones.minCashYear ? [{ label: 'Year-end cash (workbook)', value: `≈ ${gbp(milestones.minCash)}`, color: C.amber }] : []),
                    ]}
                    foot="Cumulative net = running sum of net profit"
                  />
                )
              }}
            />
            <ReferenceLine y={0} stroke={C.silver} strokeOpacity={0.6} />
            <ReferenceLine x={year} stroke={C.violetSoft} strokeOpacity={0.5} strokeDasharray="2 4" />
            <Bar dataKey="netProfit" maxBarSize={44} radius={[5, 5, 5, 5]} isAnimationActive={anim}>
              {withDerived.map((r) => (
                <Cell key={r.year} fill={r.netProfit >= 0 ? C.pos : C.neg} fillOpacity={r.year === year ? 0.7 : 0.3} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="cumulativeNet" stroke={C.violetSoft} strokeWidth={3} dot={{ r: 4, fill: C.violetSoft }} isAnimationActive={anim} animationDuration={1400} />
            <ReferenceDot
              x={milestones.minCashYear}
              y={milestones.minCash}
              r={8}
              fill={C.amber}
              stroke={C.snow}
              strokeWidth={2}
              label={{ value: `Year-end cash ≈ ${gbp(milestones.minCash)}`, position: 'top', fill: C.amber, fontSize: 12, offset: 12 }}
            />
            <ReferenceDot x={recovery.year} y={recovery.cumulativeNet} r={6} fill={C.violetSoft} stroke={C.snow} strokeWidth={1.5} label={{ value: 'Cumulative turns positive', position: 'left', fill: C.violetSoft, fontSize: 11, offset: 10 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-silver">
        <Legend color={C.pos} label="Net profit (workbook)" bar />
        <Legend color={C.violetSoft} label="Cumulative net profit (derived)" />
        <Legend color={C.amber} label="2028 year-end cash (workbook)" bar />
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div className="flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/[0.07] px-3.5 py-2.5 text-[14px] leading-snug text-snow/90">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber" />
          <span>
            Cash bottoms out at roughly <span className="num font-semibold">{gbp(milestones.minCash)}</span> in {milestones.minCashYear}. A slower sales cycle could exhaust it.
          </span>
        </div>
        <div className="flex items-start gap-2 rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-[13px] leading-snug text-silver">
          <Info size={14} className="mt-0.5 shrink-0 text-cyan" />
          <span>
            Year-end cash differs from cumulative profit (and from financing less losses) because of cash-flow items not in this summary.{' '}
            <span className="text-peach">Flagged for team review.</span>
          </span>
        </div>
      </div>
    </Panel>
  )
}

function Chip({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-1.5 ${warn ? 'border-amber/40 bg-amber/[0.08]' : 'border-line bg-white/[0.03]'}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{label}</div>
      <div className={`num text-lg font-semibold ${warn ? 'text-amber' : 'text-snow'}`}>{value}</div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* C — Year explorer                                                 */
/* ---------------------------------------------------------------- */

function YearExplorer({ year, setYear, layout }: { year: number; setYear: (y: number) => void; layout: 'side' | 'wide' }) {
  const r = withDerived.find((d) => d.year === year)!
  const money = (n: number) => gbp(n)
  const kpis = [
    { label: 'Revenue', value: r.revenue, fmt: money, color: C.cyan },
    { label: 'EBITDA', value: r.ebitda, fmt: money, color: r.ebitda >= 0 ? C.pos : C.neg, sub: `${pct(r.ebitdaMargin)} margin` },
    { label: 'Net profit', value: r.netProfit, fmt: money, color: r.netProfit >= 0 ? C.pos : C.neg },
    { label: 'Institutions', value: r.institutions, fmt: (n: number) => String(Math.round(n)), color: C.peach, sub: `${gbp(r.revenuePerInstitution, { compact: true })} rev / institution` },
  ]
  const wide = layout === 'wide'
  return (
    <div className={wide ? 'glass rounded-2xl p-5' : 'glass h-full rounded-2xl p-4'}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Year explorer</span>
        <ProjectionBadge />
      </div>
      <div className="mt-3 flex gap-1.5" role="radiogroup" aria-label="Select year">
        {years.map((y) => (
          <button
            key={y}
            role="radio"
            aria-checked={y === year}
            onClick={(e) => {
              e.stopPropagation()
              setYear(y)
            }}
            className={`num flex-1 rounded-lg border py-1.5 text-sm transition-all ${
              y === year ? 'border-violet/60 bg-violet/20 text-snow shadow-[0_0_24px_-8px_rgba(128,102,255,0.9)]' : 'border-line text-silver hover:text-snow'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      <div className={`mt-3 grid gap-2 ${wide ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'}`}>
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: k.color }} />
              {k.label}
            </div>
            <div className="mt-1 text-[clamp(1.25rem,1.7vw,1.9rem)] font-semibold leading-tight">
              <CountUp value={k.value} format={k.fmt} duration={0.9} />
            </div>
            {k.sub && <div className="mt-0.5 font-mono text-[11px] text-silver">{k.sub}</div>}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-3 text-[15px] leading-snug text-snow/85">
          {commentary[year]}
        </motion.p>
      </AnimatePresence>
      <SourceNote className="mt-2">Financial workbook (R2). Margin and revenue / institution derived.</SourceNote>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* G — Assumptions                                                   */
/* ---------------------------------------------------------------- */

function AssumptionsDrawer() {
  return (
    <Reveal show className="mt-6">
      <Expandable title={<span className="flex items-center gap-2">Financial assumptions <ProjectionBadge /></span>}>
        <div className="grid gap-4 pt-1 md:grid-cols-2 lg:grid-cols-3">
          {assumptions.map((g) => (
            <div key={g.group}>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet-soft">{g.group}</div>
              <ul className="mt-1.5 space-y-1">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2 text-[14px]">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-silver" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <SourceNote className="mt-4">Financial workbook (R2). Items marked "per workbook" have values held in the workbook and are not reproduced here.</SourceNote>
      </Expandable>
    </Reveal>
  )
}
