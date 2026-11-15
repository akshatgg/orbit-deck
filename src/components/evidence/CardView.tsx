import { ArrowUpRight } from 'lucide-react'
import { EvidenceTag, StatusPill } from '../ui'
import { chapters } from '../../data/chapters'
import type { EvidenceCard } from '../../data/evidenceRoom'

export function ChapterLink({ slug, className = '' }: { slug: string; className?: string }) {
  const c = chapters.find((x) => x.slug === slug)
  if (!c) return null
  return (
    <a href={`#/present/${slug}`} className={`inline-flex items-center gap-1 text-xs text-violet-soft underline-offset-4 hover:underline ${className}`}>
      Chapter {c.num} · {c.title} <ArrowUpRight size={12} aria-hidden />
    </a>
  )
}

export function SourceChips({ ids }: { ids: readonly string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1" aria-label={`Sources ${ids.join(', ')}`}>
      {ids.map((s) => (
        <button
          key={s}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            document.getElementById('ev-references')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          title={`${s}: see reference list`}
          className="num rounded border border-line px-1.5 py-px text-[11px] text-silver hover:border-violet/60 hover:text-snow"
        >
          {s}
        </button>
      ))}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{label}</dt>
      <dd className="mt-0.5 text-[14.5px] leading-snug text-silver">{children}</dd>
    </div>
  )
}

export function CardView({ card }: { card: EvidenceCard }) {
  return (
    <article id={`ev-${card.id}`} className="glass flex h-full flex-col gap-3 rounded-2xl p-5" aria-label={card.claim}>
      <div className="flex flex-wrap items-center gap-2">
        <EvidenceTag label={card.label} />
        <StatusPill status={card.status} />
        <span className="num ml-auto text-[11px] text-dim">{card.id}</span>
      </div>
      <h4 className="text-[17px] font-semibold leading-snug text-snow">{card.claim}</h4>
      <dl className="flex flex-1 flex-col gap-2.5">
        <Field label="Evidence">{card.evidence}</Field>
        <Field label="Limitations">{card.limitations}</Field>
        <Field label="Next test">
          <span className="text-violet-soft">{card.nextTest}</span>
        </Field>
      </dl>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span className="flex items-center gap-2 text-xs text-dim">
          Source <SourceChips ids={card.sources} />
        </span>
        <ChapterLink slug={card.chapter} />
      </div>
    </article>
  )
}
