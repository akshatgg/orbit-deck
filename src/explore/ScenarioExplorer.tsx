import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { C, TipBox, axisProps, r100, useChartAnim } from '../components/biz/kit'
import { Expandable, IllustrativeBadge, Kicker, ProjectionBadge, SourceNote } from '../components/ui'
import { gbp, runScenario, scenarioPresets, withDerived, type ScenarioInputs } from '../data/financials'

type PresetId = keyof typeof scenarioPresets

const sliders: {
  key: keyof ScenarioInputs
  label: string
  help: string
  min: number
  max: number
  step: number
  fmt: (v: number) => string
}[] = [
  { key: 'acquisition', label: 'New-institution acquisition', help: 'Multiplier on the workbook’s net new institutions each year.', min: 0.4, max: 1.6, step: 0.05, fmt: (v) => `× ${v.toFixed(2)}` },
  { key: 'retention', label: 'Retention', help: 'Share of last year’s scenario customers kept, on top of the workbook path (100% = workbook).', min: 0.7, max: 1, step: 0.01, fmt: (v) => `${Math.round(v * 100)}%` },
  { key: 'acvChange', label: 'Average contract value', help: 'Change in average revenue per institution vs the workbook.', min: -0.3, max: 0.3, step: 0.01, fmt: (v) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(Math.round(v * 100))}%` },
  { key: 'costMultiplier', label: 'Operating costs', help: 'Multiplier on workbook total costs (revenue − EBITDA).', min: 0.7, max: 1.4, step: 0.05, fmt: (v) => `× ${v.toFixed(2)}` },
]

const presetLabels: Record<PresetId, string> = { base: 'Base', downside: 'Downside', upside: 'Upside' }

const eq = (a: ScenarioInputs, b: ScenarioInputs) => (Object.keys(a) as (keyof ScenarioInputs)[]).every((k) => Math.abs(a[k] - b[k]) < 1e-9)

/** Financial Scenario Explorer — illustrative sensitivity on top of the imported workbook forecast. */
export default function ScenarioExplorer() {
  const [inputs, setInputs] = useState<ScenarioInputs>(scenarioPresets.base)
  const anim = useChartAnim()
  const rows = useMemo(
    () =>
      runScenario(inputs).map((r) => ({
        ...r,
        sRevenue: r100(r.revenue),
        sEbitda: r100(r.ebitda),
        sCustomers: Math.round(r.customers * 10) / 10,
      })),
    [inputs],
  )
  const activePreset = (Object.keys(scenarioPresets) as PresetId[]).find((p) => eq(scenarioPresets[p], inputs))

  const firstPos = (k: 'baseEbitda' | 'sEbitda') => rows.find((r) => r[k] >= 0)?.year ?? null
  const cum = (k: 'baseEbitda' | 'sEbitda') => rows.reduce((s, r) => s + r[k], 0)
  const last = rows[rows.length - 1]

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-10">
        <Kicker>Explore · Financial sensitivity</Kicker>
        <h2 className="t-h2 mt-3">
          Financial Scenario <span className="font-serif font-normal italic text-gradient">Explorer</span>
        </h2>
        <p className="t-lead mt-4 max-w-3xl">
          Stress-test the workbook forecast. The solid lines are the team's imported workbook projections; the dashed lines are a simple, transparent
          sensitivity calculated here in your browser — not a re-run of the workbook.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <ProjectionBadge />
          <span className="font-mono text-[11px] text-dim">= imported model results</span>
          <span className="mx-2 h-4 w-px bg-line" />
          <IllustrativeBadge label="Illustrative scenario" />
          <span className="font-mono text-[11px] text-dim">= newly calculated sensitivity</span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          {/* Controls */}
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(scenarioPresets) as PresetId[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={activePreset === p}
                  onClick={(e) => {
                    e.stopPropagation()
                    setInputs(scenarioPresets[p])
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activePreset === p ? 'border-violet/60 bg-violet/20 text-snow' : 'border-line text-silver hover:text-snow'
                  }`}
                >
                  {presetLabels[p]}
                </button>
              ))}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setInputs(scenarioPresets.base)
                }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-silver hover:text-snow"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <p className="mt-2 font-mono text-[11px] text-dim">Downside / Upside presets are illustrative settings, not workbook scenarios.</p>

            <div className="mt-5 space-y-5">
              {sliders.map((s) => {
                const v = inputs[s.key]
                const id = `scn-${s.key}`
                return (
                  <div key={s.key}>
                    <div className="flex items-baseline justify-between gap-3">
                      <label htmlFor={id} className="text-[15px] font-medium text-snow">
                        {s.label}
                      </label>
                      <span className="num text-base text-cyan">{s.fmt(v)}</span>
                    </div>
                    <input
                      id={id}
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={v}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setInputs((prev) => ({ ...prev, [s.key]: Number(e.target.value) }))}
                      className="mt-2 w-full accent-[#8066ff]"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-dim">
                      <span>{s.fmt(s.min)}</span>
                      <span>{s.fmt(s.max)}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-silver">{s.help}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Outputs */}
          <div className="min-w-0 space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="First positive EBITDA year" base={String(firstPos('baseEbitda') ?? 'None by 2031')} scen={String(firstPos('sEbitda') ?? 'None by 2031')} />
              <Stat label="2031 revenue" base={gbp(last.baseRevenue, { compact: true })} scen={gbp(last.sRevenue, { compact: true })} />
              <Stat label="Cumulative EBITDA 2027–31" base={gbp(cum('baseEbitda'), { compact: true })} scen={gbp(cum('sEbitda'), { compact: true })} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <MiniChart title="Revenue" rows={rows} baseKey="baseRevenue" scenKey="sRevenue" color={C.cyan} anim={anim} />
              <MiniChart title="EBITDA" rows={rows} baseKey="baseEbitda" scenKey="sEbitda" color={C.pos} anim={anim} zero />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[720px] text-right text-[14px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.12em]">
                    <th className="px-3 py-2.5 text-left font-mono font-normal text-dim" rowSpan={2}>
                      Year
                    </th>
                    <th className="border-l border-line px-3 pt-2.5 text-center font-mono font-normal text-cyan" colSpan={3}>
                      Workbook forecast (imported)
                    </th>
                    <th className="border-l border-line px-3 pt-2.5 text-center font-mono font-normal text-amber" colSpan={3}>
                      Illustrative scenario (calculated)
                    </th>
                  </tr>
                  <tr className="font-mono text-[10.5px] font-normal text-dim">
                    <th className="border-l border-line px-3 pb-2 font-normal">Institutions</th>
                    <th className="px-3 pb-2 font-normal">Revenue</th>
                    <th className="px-3 pb-2 font-normal">EBITDA</th>
                    <th className="border-l border-line px-3 pb-2 font-normal">Customers</th>
                    <th className="px-3 pb-2 font-normal">Revenue</th>
                    <th className="px-3 pb-2 font-normal">EBITDA</th>
                  </tr>
                </thead>
                <tbody className="num">
                  {rows.map((r) => (
                    <tr key={r.year} className="border-t border-line">
                      <td className="px-3 py-2 text-left text-silver">{r.year}</td>
                      <td className="border-l border-line px-3 py-2 text-snow/90">{instAt(r.year)}</td>
                      <td className="px-3 py-2 text-snow/90">{gbp(r.baseRevenue)}</td>
                      <td className={`px-3 py-2 ${r.baseEbitda >= 0 ? 'text-st-supported' : 'text-st-contradicted'}`}>{gbp(r.baseEbitda)}</td>
                      <td className="border-l border-line px-3 py-2 text-snow/90">{r.sCustomers.toFixed(1)}</td>
                      <td className="px-3 py-2 text-snow/90">{gbp(r.sRevenue)}</td>
                      <td className={`px-3 py-2 ${r.sEbitda >= 0 ? 'text-st-supported' : 'text-st-contradicted'}`}>{gbp(r.sEbitda)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SourceNote>
              Workbook columns: Orbit team financial workbook (R2), projections. Scenario columns: calculated here, rounded to the nearest £100 and 0.1 customer. Not
              a forecast; no WAU, CAC or LTV is modelled.
            </SourceNote>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">The formula (transparent, illustrative)</div>
            <pre className="scrollbar-thin mt-3 overflow-x-auto font-mono text-[13px] leading-relaxed text-snow/90">
              {`n_t       = workbook net new institutions in year t
C'_t      = C'_{t−1} × retention + n_t × acquisition
Rev'_t    = WorkbookRevenue_t × (C'_t ÷ C_t) × (1 + ACV change)
Cost'_t   = WorkbookTotalCosts_t × cost multiplier
EBITDA'_t = Rev'_t − Cost'_t`}
            </pre>
            <p className="mt-3 text-[13px] text-silver">C_t = workbook institutions. With base inputs the scenario reproduces the workbook exactly.</p>
          </div>
          <Expandable title="What this explorer does not do" defaultOpen>
            <ul className="space-y-1.5">
              <li>It does not re-run the workbook: costs scale with one multiplier and do not respond to customer numbers.</li>
              <li>It does not model cash, financing, tax or working capital — so it cannot show liquidity risk (see the 2028 cash low in the chapter above).</li>
              <li>Retention below 100% is applied on top of churn already embedded in the workbook path.</li>
              <li>It introduces no new metrics: no weekly active users, customer acquisition cost or lifetime value.</li>
            </ul>
          </Expandable>
        </div>
      </div>
    </section>
  )
}

/** Workbook institutions for a year (imported, not recalculated). */
const instAt = (year: number) => withDerived.find((r) => r.year === year)?.institutions ?? '—'

function Stat({ label, base, scen }: { label: string; base: string; scen: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{label}</div>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[12px] text-silver">Workbook</span>
        <span className="num text-lg text-snow">{base}</span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] text-amber">Scenario</span>
        <span className="num text-lg text-amber">{scen}</span>
      </div>
    </div>
  )
}

type ScRow = { year: number } & Record<string, number>

function MiniChart({ title, rows, baseKey, scenKey, color, anim, zero = false }: { title: string; rows: ScRow[]; baseKey: string; scenKey: string; color: string; anim: boolean; zero?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="flex items-center gap-3 font-mono text-[10.5px] text-silver">
          <span className="flex items-center gap-1.5">
            <span className="h-[3px] w-4 rounded-full" style={{ background: color }} /> Workbook forecast
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-amber" /> Illustrative scenario
          </span>
        </div>
      </div>
      <div className="mt-2 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v: number) => gbp(v, { compact: true })} width={60} />
            {zero && <ReferenceLine y={0} stroke={C.silver} strokeOpacity={0.5} />}
            <Tooltip
              cursor={{ stroke: C.line }}
              content={({ active, payload }) => {
                const r = payload?.[0]?.payload as ScRow | undefined
                if (!active || !r) return null
                const d = r[scenKey] - r[baseKey]
                return (
                  <TipBox
                    title={`${r.year} · ${title}`}
                    rows={[
                      { label: 'Workbook forecast', value: gbp(r[baseKey]), color },
                      { label: 'Illustrative scenario', value: gbp(r[scenKey]), color: C.amber },
                      { label: 'Difference', value: gbp(d, { sign: true }), muted: true },
                    ]}
                    foot="Scenario rounded to nearest £100"
                  />
                )
              }}
            />
            <Line type="monotone" dataKey={baseKey} stroke={color} strokeWidth={3} dot={{ r: 3, fill: color }} isAnimationActive={anim} />
            <Line type="monotone" dataKey={scenKey} stroke={C.amber} strokeWidth={2.5} strokeDasharray="6 5" dot={{ r: 3, fill: C.amber }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
