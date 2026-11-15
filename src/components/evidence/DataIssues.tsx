import { AlertTriangle } from 'lucide-react'
import { EvidenceTag } from '../ui'
import { workbookIssues } from '../../data/financials'
import { limitations } from '../../data/research'

export function DataIssues() {
  const survey = limitations.find((l) => l.includes('44')) ?? ''
  const items = [
    { id: 'survey', title: 'Survey denominator: 44 vs 42', text: survey, effect: 'We use 42 throughout, with the denominator always shown (for example, 35 of 42). No figure has been taken from a 44-response screenshot.', fix: 'Reconcile the raw export with the analysed dataset.' },
    ...workbookIssues.map((w) => ({
      id: 'workbook',
      title: 'Financial workbook: annex reference errors',
      text: w,
      effect: 'Headline figures are taken from the model outputs, not from the faulty annex references.',
      fix: 'Correct the cross-references and re-check the annexes against the outputs.',
    })),
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((it) => (
        <div key={it.title} className="glass rounded-2xl border-l-2 p-5" style={{ borderLeftColor: 'var(--color-ev-unresolved)' }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber" aria-hidden />
            <h4 className="text-lg font-semibold text-snow">{it.title}</h4>
            <EvidenceTag label="unresolved" className="ml-auto" />
          </div>
          <p className="mt-2 text-[14.5px] leading-snug text-silver">{it.text}</p>
          <p className="mt-2 text-[14.5px] leading-snug text-silver">
            <span className="font-medium text-snow">How we handled it: </span>
            {it.effect}
          </p>
          <p className="mt-2 text-[14.5px] leading-snug text-violet-soft">
            <span className="font-medium">Next: </span>
            {it.fix}
          </p>
        </div>
      ))}
    </div>
  )
}
