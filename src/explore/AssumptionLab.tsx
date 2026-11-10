import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, FlaskConical, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Kicker, SourceNote, StatusPill, ease } from '../components/ui'
import { assumptionLab, statusMeta, type Status } from '../data/strategy'

type Hyp = (typeof assumptionLab)[number]
type Filter = 'all' | Status

/** Where a hypothesis currently sits on the learning cycle. */
type Node = 'untested' | 'supported' | 'contradicted' | 'iterate' | 'retest'
const nodeFor: Record<Status, Node> = {
  untested: 'untested',
  supported: 'supported',
  contradicted: 'contradicted',
  partial: 'iterate', // partial evidence → refine and test again
}

const nodes: { id: Node; label: string; sub: string; x: number; y: number; color: string }[] = [
  { id: 'untested', label: 'Untested', sub: 'Hypothesis stated', x: 10, y: 50, color: statusMeta.untested.color },
  { id: 'supported', label: 'Supported', sub: 'Evidence agrees', x: 36, y: 18, color: statusMeta.supported.color },
  { id: 'contradicted', label: 'Contradicted', sub: 'Evidence disagrees', x: 36, y: 82, color: statusMeta.contradicted.color },
  { id: 'iterate', label: 'Iterate', sub: 'Partial evidence · refine', x: 64, y: 50, color: statusMeta.partial.color },
  { id: 'retest', label: 'Retest', sub: 'New experiment', x: 90, y: 50, color: 'var(--color-cyan)' },
]
const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<Node, (typeof nodes)[number]>

const edges: [Node, Node][] = [
  ['untested', 'supported'],
  ['untested', 'contradicted'],
  ['supported', 'iterate'],
  ['contradicted', 'iterate'],
  ['iterate', 'retest'],
]

const confidenceLevel = (c: string) => (c.startsWith('Moderate–low') ? 2 : c.startsWith('Moderate') ? 3 : c.startsWith('High') ? 4 : 1)

export default function AssumptionLab() {
  const [filter, setFilter] = useState<Filter>('all')
  const [active, setActive] = useState<string | null>(null)
  const filters: Filter[] = ['all', 'supported', 'partial', 'untested', 'contradicted']
  const visible = assumptionLab.filter((h) => filter === 'all' || h.status === filter)

  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16" aria-labelledby="assumption-lab-title">
      <Kicker>Explore · Disciplined entrepreneurship</Kicker>
      <h2 id="assumption-lab-title" className="t-h2 mt-4">
        The Assumption Lab
      </h2>
      <p className="t-lead mt-4 max-w-3xl">
        Every claim the business depends on, written as a testable hypothesis — with the evidence on both sides, our current confidence and the experiment
        that would change our mind. Nothing here is rated “validated”.
      </p>

      {/* Progression diagram */}
      <div className="glass mt-10 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-lg font-semibold">The learning cycle</span>
          <span className="font-mono text-[11px] text-dim">Chips show where each hypothesis sits today · select one to highlight it</span>
        </div>
        <div className="scrollbar-thin mt-4 overflow-x-auto">
          <div className="relative mx-auto aspect-[1000/340] min-w-[720px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <marker id="al-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="rgb(183 168 255 / 0.6)" />
                </marker>
              </defs>
              {edges.map(([a, b]) => {
                const A = nodeById[a]
                const B = nodeById[b]
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={A.x + 7}
                    y1={A.y}
                    x2={B.x - 7}
                    y2={B.y}
                    stroke="rgb(183 168 255 / 0.35)"
                    strokeWidth="0.35"
                    vectorEffect="non-scaling-stroke"
                    markerEnd="url(#al-arrow)"
                  />
                )
              })}
              {/* retest loops back to the start */}
              <path
                d="M 90 64 C 90 100, 10 100, 10 64"
                fill="none"
                stroke="rgb(61 224 234 / 0.4)"
                strokeWidth="1"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
                markerEnd="url(#al-arrow)"
              />
            </svg>
            {nodes.map((n) => {
              const here = assumptionLab.filter((h) => nodeFor[h.status] === n.id)
              const lit = active ? here.some((h) => h.id === active) : here.length > 0
              return (
                <div
                  key={n.id}
                  className="absolute flex w-[17%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div
                    className="rounded-xl border bg-ink/90 px-3 py-2 transition-all duration-300"
                    style={{
                      borderColor: lit ? n.color : 'var(--color-line)',
                      boxShadow: lit ? `0 0 28px -10px ${n.color}` : 'none',
                      opacity: active && !lit ? 0.45 : 1,
                    }}
                  >
                    <div className="text-sm font-semibold" style={{ color: n.color }}>
                      {n.label}
                    </div>
                    <div className="text-[11px] text-dim">{n.sub}</div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                    {here.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setActive(active === h.id ? null : h.id)}
                        aria-pressed={active === h.id}
                        aria-label={`${h.id.toUpperCase()}: ${h.hypothesis}`}
                        title={h.hypothesis}
                        className={`num rounded-full border px-1.5 py-0.5 text-[10.5px] uppercase transition-colors ${
                          active === h.id ? 'border-snow bg-snow text-ink' : 'border-line text-silver hover:border-violet/60 hover:text-snow'
                        }`}
                      >
                        {h.id}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cyan/70">Retest → restate hypothesis</div>
          </div>
        </div>
        <p className="mt-2 text-xs text-dim">“Partially supported” hypotheses are placed at Iterate: there is some evidence, but the hypothesis needs refining and a further test.</p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter hypotheses by status">
        {filters.map((f) => {
          const count = f === 'all' ? assumptionLab.length : assumptionLab.filter((h) => h.status === f).length
          const on = filter === f
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                on ? 'border-violet/60 bg-violet/15 text-snow' : 'border-line text-silver hover:text-snow'
              }`}
            >
              {f !== 'all' && <span className="h-2 w-2 rounded-full" style={{ background: statusMeta[f].color }} />}
              {f === 'all' ? 'All' : statusMeta[f].label}
              <span className="num text-xs text-dim">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <motion.div layout className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((h) => (
            <motion.div
              key={h.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease }}
            >
              <HypothesisCard h={h} active={active === h.id} onSelect={() => setActive(active === h.id ? null : h.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-6 text-silver md:col-span-2 xl:col-span-3">
            No hypotheses currently carry this status.
          </p>
        )}
      </motion.div>

      <SourceNote className="mt-6">
        Evidence from the team’s New Venture Creation report (R1, survey n = 42, interviews n = 13) and financial workbook (R2). Status and confidence
        are the team’s own assessment and will change as experiments run.
      </SourceNote>
    </section>
  )
}

function HypothesisCard({ h, active, onSelect }: { h: Hyp; active: boolean; onSelect: () => void }) {
  const level = confidenceLevel(h.confidence)
  return (
    <article
      className={`glass flex h-full flex-col rounded-2xl p-5 transition-shadow ${active ? 'shadow-[0_0_0_1px_rgba(247,249,252,0.6),0_0_50px_-20px_rgba(128,102,255,0.9)]' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={onSelect} aria-pressed={active} className="num text-xs uppercase text-dim hover:text-snow">
          {h.id} · show on cycle
        </button>
        <StatusPill status={h.status} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{h.hypothesis}</h3>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Confidence</span>
        <span className="flex gap-0.5" aria-hidden>
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-1.5 w-5 rounded-full ${i <= level ? 'bg-violet-soft' : 'bg-white/10'}`} />
          ))}
        </span>
        <span className="text-sm text-silver">{h.confidence}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <List icon={<Plus size={12} />} title="Supporting" items={h.support} color="var(--color-st-supported)" />
        <List icon={<Minus size={12} />} title="Contradicting" items={h.contradict} color="var(--color-st-contradicted)" />
      </div>

      <div className="mt-auto space-y-2 border-t border-line pt-3">
        <p className="flex gap-2 text-sm text-silver">
          <FlaskConical size={15} className="mt-0.5 shrink-0 text-cyan" />
          <span>
            <span className="text-snow">Next experiment:</span> {h.next}
          </span>
        </p>
        <p className="flex gap-2 text-sm text-silver">
          <ArrowRight size={15} className="mt-0.5 shrink-0 text-peach" />
          <span>
            <span className="text-snow">Decision implication:</span> {h.implication}
          </span>
        </p>
      </div>
    </article>
  )
}

function List({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color }}>
        {icon} {title}
      </div>
      <ul className="mt-1 space-y-1">
        {items.map((t) => (
          <li key={t} className="text-sm leading-snug text-silver">
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
