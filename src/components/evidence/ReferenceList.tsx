import { EvidenceTag, StatusPill } from '../ui'
import { labelMeta, statusMeta, type EvidenceLabel, type Status } from '../../data/evidence'
import { references } from '../../data/references'

export function ReferenceList() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="glass rounded-2xl p-5" id="ev-references">
        <h4 className="text-lg font-semibold text-snow">Source list</h4>
        <ul className="mt-3 divide-y divide-line">
          {references.map((r) => (
            <li key={r.id} className="flex gap-3 py-2.5">
              <span className="num w-8 shrink-0 text-sm font-semibold text-violet-soft">{r.id}</span>
              <div className="text-[14.5px] leading-snug">
                <div className="text-snow">{r.title}</div>
                <div className="text-dim">
                  {r.author}, {r.year} · {r.short}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5">
          <h4 className="text-lg font-semibold text-snow">Evidence labels</h4>
          <ul className="mt-3 space-y-2.5">
            {(Object.keys(labelMeta) as EvidenceLabel[]).map((k) => (
              <li key={k} className="flex items-start gap-3">
                <EvidenceTag label={k} className="shrink-0" />
                <span className="text-[13.5px] leading-snug text-silver">{labelMeta[k].meaning}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5">
          <h4 className="text-lg font-semibold text-snow">Status</h4>
          <ul className="mt-3 space-y-2.5">
            {(Object.keys(statusMeta) as Status[]).map((k) => (
              <li key={k} className="flex items-start gap-3">
                <StatusPill status={k} className="shrink-0" />
                <span className="text-[13.5px] leading-snug text-silver">{statusMeta[k].meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
