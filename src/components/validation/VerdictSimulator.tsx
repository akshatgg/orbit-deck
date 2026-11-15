import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { evaluate, presets, thresholds, weakUseBelow, type PilotOutcome, type Renewal, type VerdictResult } from '../../data/pilot'
import { Badge } from '../ui'

const resultStyle: Record<VerdictResult, { color: string }> = {
  GO: { color: 'var(--color-st-supported)' },
  ITERATE: { color: 'var(--color-amber)' },
  STOP: { color: 'var(--color-st-contradicted)' },
}

function Slide({ id, label, value, min, max, unit = '%', onChange, gate }: { id: string; label: string; value: number; min: number; max: number; unit?: string; onChange: (n: number) => void; gate: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[15px] text-snow">
          {label}
        </label>
        <span className="num text-xl text-snow">
          {value > 0 && id === 'sim-uplift' ? '+' : ''}
          {value}
          {unit}
        </span>
      </div>
      <input id={id} type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-violet" />
      <div className="font-mono text-[10.5px] text-dim">proposed gate {gate}</div>
    </div>
  )
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (b: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!on)
      }}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5 text-left text-[15px] text-snow transition-colors hover:border-violet/60 focus-visible:outline-2 focus-visible:outline-violet"
    >
      <span>{label}</span>
      <span className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${on ? 'bg-violet' : 'bg-silver/30'}`}>
        <span className={`h-5 w-5 rounded-full bg-snow transition-transform ${on ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  )
}

const renewalOptions: { v: Renewal; t: string }[] = [
  { v: 'agrees', t: 'Agrees to renew' },
  { v: 'undecided', t: 'Undecided' },
  { v: 'rejects', t: 'Rejects viable terms' },
]

/** Interactive GO / ITERATE / STOP simulator. EXAMPLE outcomes only — the pilot has not been run. */
export default function VerdictSimulator() {
  const [o, setO] = useState<PilotOutcome>(presets[1].outcome)
  const [active, setActive] = useState<string | null>('iterate')
  const set = (patch: Partial<PilotOutcome>) => {
    setActive(null)
    setO((p) => ({ ...p, ...patch }))
  }
  const v = evaluate(o)
  const c = resultStyle[v.result].color

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber/40 bg-amber/10 px-4 py-2.5">
        <Badge tone="amber">Sample data</Badge>
        <span className="text-[15px] font-medium text-snow">Example outcomes — the pilot has not been run.</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Example outcome presets">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={active === p.id}
            onClick={(e) => {
              e.stopPropagation()
              setActive(p.id)
              setO(p.outcome)
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-violet ${active === p.id ? 'border-violet bg-violet/20 text-snow' : 'border-line text-silver hover:border-violet/60 hover:text-snow'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Slide id="sim-activation" label="Invited students activated" value={o.activation} min={0} max={100} gate={`≥ ${thresholds.activation}%`} onChange={(n) => set({ activation: n })} />
          <Slide id="sim-wau" label="Weekly active, of activated" value={o.wau} min={0} max={60} gate={`≥ ${thresholds.wau}%`} onChange={(n) => set({ wau: n })} />
          <Slide id="sim-meaningful" label="Meaningful action, of WAU" value={o.meaningful} min={0} max={100} gate={`≥ ${thresholds.meaningful}%`} onChange={(n) => set({ meaningful: n })} />
          <Slide id="sim-accuracy" label="Sampled listing accuracy" value={o.accuracy} min={80} max={100} gate={`≥ ${thresholds.accuracy}%`} onChange={(n) => set({ accuracy: n })} />
          <Slide id="sim-uplift" label="Host-verified attendance uplift" value={o.uplift} min={-10} max={40} gate={`≥ +${thresholds.uplift}% relative`} onChange={(n) => set({ uplift: n })} />
          <div className="grid content-start gap-2">
            <Toggle label="Authorised data access achieved" on={o.dataAccess} onChange={(b) => set({ dataAccess: b })} />
            <Toggle label="Integration and support costs viable" on={o.costsViable} onChange={(b) => set({ costsViable: b })} />
          </div>
          <div className="sm:col-span-2">
            <div className="text-[15px] text-snow">Buyer decision on renewal</div>
            <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="Buyer renewal decision">
              {renewalOptions.map((r) => (
                <button
                  key={r.v}
                  type="button"
                  aria-pressed={o.renewal === r.v}
                  onClick={(e) => {
                    e.stopPropagation()
                    set({ renewal: r.v })
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-violet ${o.renewal === r.v ? 'border-violet bg-violet/20 text-snow' : 'border-line text-silver hover:border-violet/60'}`}
                >
                  {r.t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div aria-live="polite">
          <div className="rounded-2xl border p-5" style={{ borderColor: `color-mix(in srgb, ${c} 55%, transparent)`, background: `color-mix(in srgb, ${c} 8%, transparent)` }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">Example verdict</div>
            <div className="num text-[clamp(2rem,3.4vw,3.6rem)] font-semibold leading-none" style={{ color: c }}>
              {v.title}
            </div>
            <p className="mt-3 text-[15.5px] leading-snug text-snow">
              <span className="font-semibold">Rule fired: </span>
              {v.rule}
            </p>
            {v.result === 'STOP' && (
              <ul className="mt-2 list-disc pl-5 text-[14.5px] text-snow">
                {v.stopHits.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            {v.result === 'ITERATE' && v.unmet.length > 0 && <p className="mt-2 text-[14.5px] text-silver">Retest hypothesis to define: {v.unmet.join('; ')}.</p>}
          </div>
          <ul className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {v.gates.map((g) => (
              <li key={g.id} className="flex items-center gap-2 text-[13.5px] text-silver">
                {g.met ? <Check size={14} className="shrink-0 text-st-supported" /> : <X size={14} className="shrink-0 text-st-contradicted" />}
                <span className="flex-1 leading-tight">{g.label}</span>
                <span className="num text-snow">{g.actual}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[10.5px] leading-snug text-dim">Simulator convention (not a team figure): weekly use below {weakUseBelow}% of activated users is treated as “weak”. Verdict colours show the example outcome only.</p>
        </div>
      </div>
    </div>
  )
}
