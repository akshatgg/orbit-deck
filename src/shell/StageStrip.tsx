import { Check, Repeat } from 'lucide-react'
import { frameworkStages, stages, type ChapterMeta, type StageId } from '../data/chapters'

/**
 * Compact four-stage framework strip for the presentation header.
 * The current stage is highlighted; the loop glyph says the stages are iterative
 * (evidence sends us back), not a one-way funnel.
 */
export function StageStrip({ meta, onPick }: { meta: ChapterMeta; onPick: (stage: StageId) => void }) {
  const curIdx = meta.stage === 'verdict' ? frameworkStages.length : frameworkStages.indexOf(meta.stage)
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Evaluation framework: ${stages[meta.stage].label}`}>
      <ol className="flex items-center gap-1">
        {frameworkStages.map((s, i) => {
          const st = stages[s]
          const active = i === curIdx
          const past = i < curIdx
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => onPick(s)}
                aria-current={active ? 'step' : undefined}
                title={`Stage ${st.n}: ${st.label} (${st.weeks})`}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors"
                style={{
                  borderColor: active ? st.color : past ? `color-mix(in srgb, ${st.color} 35%, transparent)` : 'rgb(148 163 184 / 0.18)',
                  background: active ? `color-mix(in srgb, ${st.color} 18%, transparent)` : 'transparent',
                  color: active ? '#f8fafc' : past ? '#cbd5e1' : '#64748b',
                }}
              >
                <span className="num" style={{ color: active || past ? st.color : undefined }}>{st.n}</span>
                <span className={active ? 'inline' : 'hidden 2xl:inline'}>{st.label}</span>
              </button>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={() => onPick('verdict')}
            aria-current={curIdx === frameworkStages.length ? 'step' : undefined}
            title="Final evaluation"
            className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11.5px] font-medium transition-colors"
            style={{
              borderColor: curIdx === frameworkStages.length ? '#f8fafc' : 'rgb(148 163 184 / 0.18)',
              background: curIdx === frameworkStages.length ? 'rgb(248 250 252 / 0.12)' : 'transparent',
              color: curIdx === frameworkStages.length ? '#f8fafc' : '#64748b',
            }}
          >
            <Check size={12} />
            {curIdx === frameworkStages.length && <span>Final evaluation</span>}
          </button>
        </li>
      </ol>
      <span title="Iterative: evidence sends us back to earlier stages" className="text-dim">
        <Repeat size={14} aria-label="Iterative loop" />
      </span>
      <span className="num ml-1 hidden whitespace-nowrap text-[11px] text-dim xl:inline">
        Ch <span className="text-silver">{meta.num}</span> / 15
      </span>
    </div>
  )
}
