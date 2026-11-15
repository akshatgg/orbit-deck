import { useState } from 'react'
import { EvidenceTag } from '../ui'
import { alternatives, competitorNote, orbitRow } from '../../data/evidenceRoom'

const cols = ['Alternative', 'Primarily for', 'Cross-source view', 'Relevance / personalisation', 'Survey mention (n = 42)']

export function CompetitorMatrix() {
  const [sel, setSel] = useState<string>(alternatives[0].id)
  const active = alternatives.find((a) => a.id === sel)!
  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h4 className="text-xl font-semibold text-snow">Interactive comparison of alternatives</h4>
        <EvidenceTag label="proposed" text="Differentiation is proposed" />
      </div>
      <p className="mt-1 text-sm text-silver">Select an alternative to see where it overlaps with Orbit and what a pilot would need to test. Cells describe what each is primarily for.</p>

      {/* header (wide screens) */}
      <div className="mt-4 hidden grid-cols-[1.1fr_1.5fr_1.3fr_1.2fr_1.2fr] gap-3 px-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim lg:grid">
        {cols.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>

      <div className="mt-2 space-y-2" role="list">
        <div role="listitem" className="grid gap-x-3 gap-y-1.5 rounded-xl border border-dashed border-ev-proposed/60 bg-ev-proposed/[0.06] p-3 lg:grid-cols-[1.1fr_1.5fr_1.3fr_1.2fr_1.2fr]">
          <div className="font-semibold text-violet-soft">{orbitRow.name}</div>
          <Cell label={cols[1]}>{orbitRow.primary}</Cell>
          <Cell label={cols[2]}>{orbitRow.crossSource}</Cell>
          <Cell label={cols[3]}>{orbitRow.relevance}</Cell>
          <Cell label={cols[4]}>Not applicable; untested.</Cell>
        </div>
        {alternatives.map((a) => {
          const on = a.id === sel
          return (
            <div key={a.id} role="listitem">
              <button
                type="button"
                aria-pressed={on}
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(a.id)
                }}
                className={`grid w-full gap-x-3 gap-y-1.5 rounded-xl border p-3 text-left transition-colors lg:grid-cols-[1.1fr_1.5fr_1.3fr_1.2fr_1.2fr] ${on ? 'border-ev-observed/60 bg-ev-observed/[0.07]' : 'border-line hover:border-silver/40 hover:bg-white/[0.03]'}`}
              >
                <div className="font-semibold text-snow">{a.name}</div>
                <Cell label={cols[1]}>{a.primary}</Cell>
                <Cell label={cols[2]}>{a.crossSource}</Cell>
                <Cell label={cols[3]}>{a.relevance}</Cell>
                <Cell label={cols[4]}>{a.survey}</Cell>
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 rounded-xl border border-line bg-black/20 p-4 sm:grid-cols-3" aria-live="polite">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Selected</div>
          <div className="mt-1 text-lg font-semibold text-snow">{active.name}</div>
          <p className="mt-1 text-sm text-silver">Events come from: {active.events}</p>
        </div>
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Overlap with Orbit</div>
          <p className="mt-1 text-sm text-snow">{active.overlap}</p>
        </div>
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ev-proposed">What a pilot would test</div>
          <p className="mt-1 text-sm text-snow">{active.orbitTest}</p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-dim">{competitorNote}</p>
    </div>
  )
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-[14px] leading-snug text-silver">
      <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim lg:hidden">{label}:</span>
      {children}
    </div>
  )
}
