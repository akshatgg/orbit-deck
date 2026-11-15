import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AnticipatedList } from '../components/evidence/Anticipated'
import { CardView } from '../components/evidence/CardView'
import { CompetitorMatrix } from '../components/evidence/CompetitorMatrix'
import { CustomerFactory } from '../components/evidence/CustomerFactory'
import { DataIssues } from '../components/evidence/DataIssues'
import { ReferenceList } from '../components/evidence/ReferenceList'
import { Kicker } from '../components/ui'
import { chapters } from '../data/chapters'
import { labelMeta, statusMeta, type EvidenceLabel, type Status } from '../data/evidence'
import { alternatives, anticipated, cards, categories, competitorNote, type CategoryId } from '../data/evidenceRoom'
import { funnel, funnelNote } from '../data/market'
import { references } from '../data/references'

type NavId = CategoryId | 'issues' | 'questions'

const nav: { id: NavId; label: string; special?: boolean }[] = [
  ...categories.map((c) => ({ id: c.id as NavId, label: c.label })),
  { id: 'issues', label: 'Known data issues', special: true },
  { id: 'questions', label: 'Questions we anticipate', special: true },
]

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id
const chapterTitle = (slug: string) => chapters.find((c) => c.slug === slug)?.title ?? ''

const textOf = {
  competitors: ['competitor comparison alternatives', competitorNote, ...alternatives.flatMap((a) => [a.name, a.primary, a.events, a.crossSource, a.relevance, a.survey, a.overlap, a.orbitTest])].join(' '),
  acquisition: ['customer factory funnel 2027 2029', funnelNote, ...funnel.flatMap((f) => [f.label, String(f.value), f.detail])].join(' '),
  issues: 'known data issues survey denominator 44 vs 42 financial workbook annex reference errors',
  references: ['references legend evidence labels status', ...references.flatMap((r) => [r.id, r.short, r.title, r.author]), ...Object.values(labelMeta).map((l) => l.label + ' ' + l.meaning), ...Object.values(statusMeta).map((l) => l.label + ' ' + l.meaning)].join(' '),
}

export default function EvidenceRoom() {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState<Set<NavId>>(new Set())
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [label, setLabel] = useState<EvidenceLabel | 'all'>('all')
  const [openAll, setOpenAll] = useState(false)

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  const match = (text: string) => {
    const h = text.toLowerCase()
    return tokens.every((t) => h.includes(t))
  }
  const catOn = (id: NavId) => sel.size === 0 || sel.has(id)
  const cardFilterActive = status !== 'all' || label !== 'all'

  const visible = useMemo(
    () =>
      cards.filter((c) => {
        if (sel.size && !sel.has(c.category)) return false
        if (status !== 'all' && c.status !== status) return false
        if (label !== 'all' && c.label !== label) return false
        if (!tokens.length) return true
        return match([c.id, c.claim, c.evidence, c.limitations, c.nextTest, c.sources.join(' '), catLabel(c.category), chapterTitle(c.chapter), c.label, c.status].join(' '))
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sel, status, label, query],
  )

  const showCompetitors = catOn('competitors') && !cardFilterActive && match(textOf.competitors)
  const showFactory = catOn('acquisition') && !cardFilterActive && match(textOf.acquisition)
  const showReferences = catOn('references') && !cardFilterActive && match(textOf.references)
  const showIssues = catOn('issues') && !cardFilterActive && match(textOf.issues)
  const qs = anticipated.filter((a) => !cardFilterActive && catOn('questions') && match([a.q, a.a, a.nextTest ?? '', 'questions we anticipate'].join(' ')))

  const counts = (id: NavId): number => {
    const base = cards.filter((c) => c.category === id && (status === 'all' || c.status === status) && (label === 'all' || c.label === label) && (!tokens.length || match([c.claim, c.evidence, c.limitations, c.nextTest, c.sources.join(' '), catLabel(c.category)].join(' '))))
    if (id === 'issues') return showIssues ? 2 : 0
    if (id === 'questions') return anticipated.filter((a) => !cardFilterActive && match([a.q, a.a, a.nextTest ?? ''].join(' '))).length
    return base.length
  }

  const total = visible.length + qs.length + (showCompetitors ? 1 : 0) + (showFactory ? 1 : 0) + (showReferences ? 1 : 0) + (showIssues ? 1 : 0)
  const filtering = tokens.length > 0 || sel.size > 0 || cardFilterActive
  const clear = () => {
    setQuery('')
    setSel(new Set())
    setStatus('all')
    setLabel('all')
  }
  const toggle = (id: NavId) =>
    setSel((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const statusCounts = (Object.keys(statusMeta) as Status[]).map((s) => ({ s, n: cards.filter((c) => c.status === s).length })).filter((x) => x.n > 0)
  const labelCounts = (Object.keys(labelMeta) as EvidenceLabel[]).map((l) => ({ l, n: cards.filter((c) => c.label === l).length })).filter((x) => x.n > 0)

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16">
      <Kicker>Appendix · for questions</Kicker>
      <h2 className="t-h1 mt-4">Evidence Room</h2>
      <p className="t-lead mt-4 max-w-3xl">
        Every important claim in the presentation, with its evidence, source, limitations and next test. {cards.length} claims across {categories.length} categories. Search, filter by category, status or evidence label, and follow any card back to its chapter.
      </p>

      {/* controls */}
      <div className="mt-8 space-y-4">
        <div className="relative max-w-2xl">
          <label htmlFor="ev-search" className="sr-only">
            Search the Evidence Room
          </label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dim" aria-hidden />
          <input
            id="ev-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search claims, figures, sources… e.g. “willingness to pay”, “42”, “S5”"
            className="w-full rounded-full border border-line bg-navy/80 py-3 pl-11 pr-4 text-base text-snow placeholder:text-dim focus:border-violet/70 focus:outline-none"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ChipGroup label="Status">
            <Chip on={status === 'all'} onClick={() => setStatus('all')}>
              All
            </Chip>
            {statusCounts.map(({ s, n }) => (
              <Chip key={s} on={status === s} color={statusMeta[s].color} onClick={() => setStatus(status === s ? 'all' : s)}>
                {statusMeta[s].label} <span className="num opacity-60">{n}</span>
              </Chip>
            ))}
          </ChipGroup>
          <ChipGroup label="Evidence">
            <Chip on={label === 'all'} onClick={() => setLabel('all')}>
              All
            </Chip>
            {labelCounts.map(({ l, n }) => (
              <Chip key={l} on={label === l} color={labelMeta[l].color} onClick={() => setLabel(label === l ? 'all' : l)}>
                {labelMeta[l].label} <span className="num opacity-60">{n}</span>
              </Chip>
            ))}
          </ChipGroup>
        </div>

        {/* category chips — mobile / tablet */}
        <div className="lg:hidden">
          <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Category</div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-thin" role="group" aria-label="Filter by category">
            <Chip on={sel.size === 0} onClick={() => setSel(new Set())} nowrap>
              All
            </Chip>
            {nav.map((n) => (
              <Chip key={n.id} on={sel.has(n.id)} onClick={() => toggle(n.id)} nowrap>
                {n.label} <span className="num opacity-60">{counts(n.id)}</span>
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-silver" aria-live="polite">
          <span>
            <span className="num text-snow">{visible.length}</span> of {cards.length} cards shown
            {qs.length > 0 && !cardFilterActive ? ` · ${qs.length} anticipated questions` : ''}
          </span>
          {filtering && (
            <button type="button" onClick={clear} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs text-snow hover:border-violet/60">
              <X size={12} aria-hidden /> Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* desktop category nav */}
        <nav aria-label="Evidence categories" className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin">
            <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Categories</div>
            <ul className="space-y-0.5">
              <li>
                <NavButton on={sel.size === 0} onClick={() => setSel(new Set())} label="All categories" n={cards.length} />
              </li>
              {nav.map((n) => (
                <li key={n.id} className={n.special && n.id === 'issues' ? 'mt-3 border-t border-line pt-3' : ''}>
                  <NavButton on={sel.has(n.id)} onClick={() => toggle(n.id)} label={n.label} n={counts(n.id)} />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="min-w-0 space-y-14">
          {total === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-lg text-snow">No evidence matches those filters.</p>
              <p className="mt-1 text-sm text-silver">Try fewer words, or clear the filters. If a claim has no card, that is a gap we should record.</p>
              <button type="button" onClick={clear} className="mt-4 rounded-full border border-line px-4 py-2 text-sm text-snow hover:border-violet/60">
                Clear filters
              </button>
            </div>
          )}

          {categories.map((cat) => {
            const list = visible.filter((c) => c.category === cat.id)
            const extra = (cat.id === 'competitors' && showCompetitors) || (cat.id === 'acquisition' && showFactory) || (cat.id === 'references' && showReferences)
            if (!list.length && !extra) return null
            return (
              <section key={cat.id} id={`evc-${cat.id}`} aria-labelledby={`evh-${cat.id}`} className="scroll-mt-24">
                <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
                  <h3 id={`evh-${cat.id}`} className="t-h2">
                    {cat.label}
                  </h3>
                  <span className="num text-sm text-dim">{list.length}</span>
                </div>
                {list.length > 0 && (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {list.map((c) => (
                      <CardView key={c.id} card={c} />
                    ))}
                  </div>
                )}
                {cat.id === 'competitors' && showCompetitors && (
                  <div className="mt-6">
                    <CompetitorMatrix />
                  </div>
                )}
                {cat.id === 'acquisition' && showFactory && (
                  <div className="mt-6">
                    <CustomerFactory />
                  </div>
                )}
                {cat.id === 'references' && showReferences && (
                  <div className="mt-6">
                    <ReferenceList />
                  </div>
                )}
              </section>
            )
          })}

          {showIssues && (
            <section id="evc-issues" aria-labelledby="evh-issues" className="scroll-mt-24">
              <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
                <h3 id="evh-issues" className="t-h2">
                  Known data issues
                </h3>
              </div>
              <DataIssues />
            </section>
          )}

          {qs.length > 0 && (
            <section id="evc-questions" aria-labelledby="evh-questions" className="scroll-mt-24">
              <div className="mb-4 flex flex-wrap items-baseline gap-3 border-b border-line pb-2">
                <h3 id="evh-questions" className="t-h2">
                  Questions we anticipate
                </h3>
                <span className="num text-sm text-dim">{qs.length}</span>
                <button type="button" onClick={() => setOpenAll((o) => !o)} aria-pressed={openAll} className="ml-auto rounded-full border border-line px-3 py-1 text-xs text-snow hover:border-violet/60">
                  {openAll ? 'Collapse all' : 'Expand all'}
                </button>
              </div>
              <p className="mb-4 max-w-3xl text-sm text-silver">Answers use only the evidence in this room. Where the honest answer is “we don’t know yet”, we say so and name the next test.</p>
              <AnticipatedList items={qs} openAll={openAll} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={`Filter by ${label.toLowerCase()}`} className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{label}</span>
      {children}
    </div>
  )
}

function Chip({ on, onClick, children, color, nowrap }: { on: boolean; onClick: () => void; children: React.ReactNode; color?: string; nowrap?: boolean }) {
  const c = color ?? 'var(--color-violet-soft)'
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${nowrap ? 'shrink-0 whitespace-nowrap' : ''} ${on ? 'text-snow' : 'border-line text-silver hover:text-snow'}`}
      style={on ? { borderColor: `color-mix(in srgb, ${c} 70%, transparent)`, background: `color-mix(in srgb, ${c} 16%, transparent)` } : undefined}
    >
      {children}
    </button>
  )
}

function NavButton({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-[14px] transition-colors ${on ? 'bg-violet/15 text-snow' : n === 0 ? 'text-dim hover:bg-white/5' : 'text-silver hover:bg-white/5 hover:text-snow'}`}
    >
      <span>{label}</span>
      <span className="num text-xs text-dim">{n}</span>
    </button>
  )
}
