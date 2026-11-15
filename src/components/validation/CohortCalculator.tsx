import { definitions, funnel, thresholds } from '../../data/pilot'
import { EvidenceTag } from '../ui'

const fmt = (n: number) => n.toLocaleString('en-GB')

/** Pilot cohort calculator. Thresholds are PROPOSED; nothing here claims the minimum was achieved. */
export default function CohortCalculator({ invited, setInvited, showDefinitions = true }: { invited: number; setInvited: (n: number) => void; showDefinitions?: boolean }) {
  const f = funnel(invited)
  const rows = [
    { label: 'Invited students', n: f.invited, rule: 'Eligible cohort', w: 100 },
    { label: 'Activated', n: f.activated, rule: `× ${thresholds.activation}% activation`, w: 74 },
    { label: 'Weekly active users', n: f.wau, rule: `× ${thresholds.wau}% of activated`, w: 50 },
    { label: 'Meaningful action', n: f.meaningful, rule: `× ${thresholds.meaningful}% of WAU`, w: 28 },
  ]
  const clamp = (v: number) => Math.max(1, Math.min(100000, Math.round(v) || 1))
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div>
        <label htmlFor="invited-count" className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">
          Invited students (editable)
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            id="invited-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={100000}
            value={invited}
            onChange={(e) => setInvited(clamp(Number(e.target.value)))}
            className="num w-36 rounded-xl border border-violet/50 bg-navy px-4 py-2.5 text-3xl text-snow focus-visible:outline-2 focus-visible:outline-violet"
          />
          <span className="text-silver">students</span>
        </div>
        <input
          type="range"
          aria-label="Invited students"
          min={100}
          max={5000}
          step={50}
          value={Math.min(5000, Math.max(100, invited))}
          onChange={(e) => setInvited(Number(e.target.value))}
          className="mt-4 w-full accent-violet"
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-dim">
          <span>100</span>
          <span>5,000</span>
        </div>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 num text-[clamp(1.05rem,1.5vw,1.5rem)] text-snow">
          <span>{fmt(f.invited)}</span>
          <span className="text-dim">× {thresholds.activation}% =</span>
          <span>{fmt(f.activated)}</span>
          <span className="text-dim">× {thresholds.wau}% =</span>
          <span className="text-violet-soft">{fmt(f.wau)} WAU</span>
          <span className="text-dim">× {thresholds.meaningful}% =</span>
          <span>{fmt(f.meaningful)}</span>
        </div>
        <p className="mt-4 border-l-2 border-amber/70 pl-3 text-[15px] leading-snug text-snow">
          {fmt(f.wau)} WAU is an illustrative threshold for this {fmt(f.invited)}-student cohort, not a validated university-wide requirement.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <EvidenceTag label="proposed" text="Proposed thresholds" />
          <span className="text-[13px] text-dim">funnel not to scale</span>
        </div>
        <div className="mt-3 space-y-2" aria-label="Narrowing funnel">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col items-center">
              <div
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 transition-[width] duration-500"
                style={{ width: `${r.w}%`, minWidth: '15rem', background: 'color-mix(in srgb, var(--color-ev-proposed) 16%, transparent)', border: '1px solid color-mix(in srgb, var(--color-ev-proposed) 50%, transparent)' }}
              >
                <div>
                  <div className="text-[15px] font-medium text-snow">{r.label}</div>
                  <div className="font-mono text-[11px] text-silver">{r.rule}</div>
                </div>
                <div className="num text-2xl text-snow">{fmt(r.n)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDefinitions && (
        <div className="grid gap-3 text-[15px] leading-snug sm:grid-cols-2 lg:col-span-2">
          <p className="rounded-xl border border-line p-4 text-silver">
            <span className="font-semibold text-snow">Weekly active user: </span>
            {definitions.wau}
          </p>
          <p className="rounded-xl border border-line p-4 text-silver">
            <span className="font-semibold text-snow">Meaningful action: </span>
            {definitions.meaningful}
          </p>
          <p className="text-amber sm:col-span-2">{definitions.caution}</p>
        </div>
      )}
    </div>
  )
}
