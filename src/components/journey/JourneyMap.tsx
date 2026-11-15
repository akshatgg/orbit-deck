import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { chapters, stages, type StageId } from '../../data/chapters'
import { statusMeta } from '../../data/evidence'
import { journeyLoops, journeyNodes, type JourneyNode } from '../../data/journey'
import { Badge, EvidenceTag, StatusPill } from '../ui'

const STAGE_ORDER: StageId[] = ['ideation', 'discovery', 'bmd', 'validation', 'verdict']
const PROPOSED = 'var(--color-ev-proposed)'

interface Props {
  /** Present mode: nodes appear cumulatively through chapters[0..idx]. Undefined = everything reached. */
  currentChapterIdx?: number
  compact?: boolean
  /** Called instead of following the "Go to chapter" link (lets an overlay close itself). */
  onGoChapter?: (slug: string) => void
}

const nodeColor = (n: JourneyNode) => (n.kind === 'proposed' ? PROPOSED : statusMeta[n.status].color)

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export function JourneyMap({ currentChapterIdx, compact = false, onGoChapter }: Props) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const all = currentChapterIdx === undefined

  const reached = useMemo(() => {
    const set = new Set<number>()
    if (all) journeyNodes.forEach((n) => set.add(n.id))
    else chapters.slice(0, (currentChapterIdx ?? 0) + 1).forEach((c) => c.journey.forEach((id) => set.add(id)))
    return set
  }, [all, currentChapterIdx])

  const latest = useMemo(() => {
    if (all) return null
    const ids = chapters[currentChapterIdx ?? 0]?.journey ?? []
    return ids.length ? ids[ids.length - 1] : null
  }, [all, currentChapterIdx])

  const [selected, setSelected] = useState<number | null>(null)
  const [hoverLoop, setHoverLoop] = useState<number | null>(null)
  // in present mode follow the story: select the newest node when the chapter changes
  useEffect(() => {
    if (!all) setSelected(latest)
  }, [all, latest])

  const node = selected != null && reached.has(selected) ? journeyNodes.find((n) => n.id === selected) ?? null : null
  const wide = width >= 760

  const loops = journeyLoops.map((l, i) => ({ ...l, i, visible: reached.has(l.from) && reached.has(l.to) }))
  const statuses = Array.from(new Set(journeyNodes.filter((n) => n.kind === 'completed').map((n) => n.status)))

  return (
    <div ref={ref} className="w-full">
      {width > 0 &&
        (wide ? (
          <OrbitalMap width={width} compact={compact} reached={reached} latest={latest} selected={selected} onSelect={setSelected} loops={loops} hoverLoop={hoverLoop} />
        ) : (
          <VerticalMap reached={reached} selected={selected} onSelect={setSelected} node={node} onGoChapter={onGoChapter} />
        ))}

      {wide && <NodeCard node={node} all={all} onGoChapter={onGoChapter} />}

      {!compact && (
        <div className="mt-5 space-y-4">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-silver" aria-label="Legend">
            {statuses.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2" style={{ borderColor: statusMeta[s].color, background: `color-mix(in srgb, ${statusMeta[s].color} 22%, transparent)` }} />
                {statusMeta[s].label}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-dashed" style={{ borderColor: PROPOSED, background: 'transparent' }} />
              Proposed, not yet run
            </li>
            {!all && (
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white/20" /> Not yet reached
              </li>
            )}
          </ul>
          <p className="max-w-3xl text-xs leading-relaxed text-dim">
            Colour shows the evidence status of each step’s central claim, not whether the step was completed. Amber and grey nodes are unresolved or untested on purpose. Dashed violet marks a proposal that has not been run.
          </p>
          <ol className="grid gap-2 sm:grid-cols-2" aria-label="Feedback loops">
            {loops.map((l) => (
              <li
                key={l.i}
                onMouseEnter={() => setHoverLoop(l.i)}
                onMouseLeave={() => setHoverLoop(null)}
                className={`flex items-start gap-2.5 text-xs leading-snug transition-opacity ${l.visible ? 'text-silver' : 'text-dim opacity-50'}`}
              >
                <span className="num mt-px shrink-0 rounded-full border border-line px-1.5 py-0.5 text-[10px] text-violet-soft">↺ {l.i + 1}</span>
                <span>
                  <span className="num text-dim">
                    {l.from} → {l.to}
                  </span>{' '}
                  {l.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface LoopView {
  from: number
  to: number
  label: string
  i: number
  visible: boolean
}

function OrbitalMap({
  width,
  compact,
  reached,
  latest,
  selected,
  onSelect,
  loops,
  hoverLoop,
}: {
  width: number
  compact: boolean
  reached: Set<number>
  latest: number | null
  selected: number | null
  onSelect: (id: number | null) => void
  loops: LoopView[]
  hoverLoop: number | null
}) {
  const H = compact ? 360 : 400
  const padX = 34
  const cy = compact ? 175 : 215
  const amp = 26
  const innerW = width - padX * 2

  // stage bands, widths weighted by node count
  const bands = STAGE_ORDER.map((s) => ({ stage: s, nodes: journeyNodes.filter((n) => n.stage === s) }))
  const totalWeight = bands.reduce((a, b) => a + b.nodes.length + 0.7, 0)
  let cursor = padX
  const layout = bands.map((b) => {
    const w = ((b.nodes.length + 0.7) / totalWeight) * innerW
    const x0 = cursor
    cursor += w
    return { ...b, x0, w }
  })
  const pos = new Map<number, { x: number; y: number }>()
  layout.forEach((b) =>
    b.nodes.forEach((n, k) => {
      const x = b.x0 + (b.w * (k + 0.5 + 0.2)) / (b.nodes.length + 0.4)
      pos.set(n.id, { x, y: cy + (n.id % 2 === 0 ? -amp : amp) })
    }),
  )
  const ordered = journeyNodes.map((n) => ({ n, ...pos.get(n.id)! }))
  const spacing = innerW / journeyNodes.length
  const labelW = Math.max(74, Math.min(130, spacing * 1.75))
  const R = width < 1000 ? 15 : 17

  const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2
    return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`
  }

  const loopPath = (l: LoopView) => {
    const a = pos.get(l.from)!
    const b = pos.get(l.to)!
    const span = Math.abs(l.from - l.to)
    const lift = ([64, 100, 95, 128][l.i % 4] + span * 3) * (compact ? 0.6 : 1)
    const y1 = a.y - R - 3
    const y2 = b.y - R - 7
    const yb = Math.min(y1, y2)
    const top = yb - lift / 0.75
    return { d: `M${a.x},${y1} C${a.x},${top} ${b.x},${top} ${b.x},${y2}`, apex: { x: (a.x + b.x) / 2, y: yb - lift } }
  }

  return (
    <div className="relative" style={{ height: H }}>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} className="absolute inset-0" role="img" aria-label="Venture journey map: four stages and a final evaluation, with feedback loops">
        <defs>
          <linearGradient id="jm-path" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <marker id="jm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,1 L9,5 L0,9 z" fill="#c4b5fd" />
          </marker>
        </defs>

        {/* stage bands */}
        {layout.map((b) => {
          const c = stages[b.stage].color
          return (
            <g key={b.stage}>
              <rect x={b.x0 + 3} y={14} width={b.w - 6} height={H - 28} rx={18} fill={c} fillOpacity={0.045} stroke={c} strokeOpacity={0.16} />
              <text x={b.x0 + b.w / 2} y={H - 40} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" letterSpacing="0.12em" fill={c} fillOpacity={0.95} style={{ textTransform: 'uppercase' }}>
                {b.stage === 'verdict' ? 'Final' : `Stage ${stages[b.stage].n}`}
              </text>
              <text x={b.x0 + b.w / 2} y={H - 24} textAnchor="middle" fontSize={11.5} fill="#94a3b8">
                {stages[b.stage].label}
                {stages[b.stage].weeks ? ` · ${stages[b.stage].weeks.replace('Weeks', 'Wk').replace('Week', 'Wk')}` : ''}
              </text>
            </g>
          )
        })}

        {/* decorative orbit rings */}
        <ellipse cx={width / 2} cy={cy} rx={innerW / 2 + 6} ry={92} fill="none" stroke="#8b5cf6" strokeOpacity={0.12} strokeDasharray="2 7" transform={`rotate(-2 ${width / 2} ${cy})`} />
        <ellipse cx={width / 2} cy={cy} rx={innerW / 2 - 24} ry={62} fill="none" stroke="#38bdf8" strokeOpacity={0.1} strokeDasharray="2 9" transform={`rotate(2 ${width / 2} ${cy})`} />

        {/* path segments */}
        {ordered.slice(0, -1).map((a, i) => {
          const b = ordered[i + 1]
          const on = reached.has(a.n.id) && reached.has(b.n.id)
          return <path key={a.n.id} d={seg(a, b)} fill="none" stroke={on ? 'url(#jm-path)' : '#94a3b8'} strokeOpacity={on ? 0.95 : 0.2} strokeWidth={on ? 2.5 : 1.5} strokeDasharray={on ? undefined : '3 6'} />
        })}

        {/* feedback loops */}
        {loops.map((l) => {
          if (!l.visible) return null
          const p = loopPath(l)
          const active = hoverLoop === l.i
          const short = l.label.split(' → ')[0]
          return (
            <g key={l.i} opacity={hoverLoop == null || active ? 1 : 0.4}>
              <motion.path d={p.d} fill="none" stroke="#c4b5fd" strokeOpacity={active ? 1 : 0.7} strokeWidth={active ? 2 : 1.4} strokeDasharray="5 5" markerEnd="url(#jm-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
              <g transform={`translate(${p.apex.x},${p.apex.y})`}>
                <rect x={-(short.length * 2.9 + 14)} y={-9} width={short.length * 5.8 + 28} height={18} rx={9} fill="#080d1a" stroke="#c4b5fd" strokeOpacity={0.4} />
                <text textAnchor="middle" y={4} fontSize={10} fill="#c4b5fd" fontFamily="var(--font-mono)">
                  ↺ {short}
                </text>
              </g>
            </g>
          )
        })}
      </svg>

      {/* nodes + labels (real buttons: keyboard focusable) */}
      {ordered.map(({ n, x, y }) => {
        const isReached = reached.has(n.id)
        const col = nodeColor(n)
        const proposed = n.kind === 'proposed'
        const sel = selected === n.id
        return (
          <div key={n.id}>
            <button
              type="button"
              disabled={!isReached}
              onClick={() => onSelect(sel ? null : n.id)}
              aria-pressed={sel}
              aria-label={isReached ? `Step ${n.id}: ${n.label}. ${proposed ? 'Proposed, not yet run' : statusMeta[n.status].label}` : `Step ${n.id}: not yet reached`}
              className={`absolute grid place-items-center rounded-full transition-all duration-500 ${isReached ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
              style={{
                left: x - R,
                top: y - R,
                width: R * 2,
                height: R * 2,
                border: isReached ? `2px ${proposed ? 'dashed' : 'solid'} ${col}` : '1.5px solid rgb(148 163 184 / 0.22)',
                background: isReached ? (proposed ? 'color-mix(in srgb, var(--color-ev-proposed) 10%, #080d1a)' : `color-mix(in srgb, ${col} 20%, #0b1222)`) : 'transparent',
                boxShadow: sel ? `0 0 0 4px color-mix(in srgb, ${col} 28%, transparent)` : isReached ? `0 0 18px -4px color-mix(in srgb, ${col} 60%, transparent)` : 'none',
              }}
            >
              <span className="num text-[11px] font-medium" style={{ color: isReached ? col : 'rgb(148 163 184 / 0.45)' }}>
                {n.id}
              </span>
              {latest === n.id && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full motion-safe:animate-ping" style={{ border: `1.5px solid ${col}`, opacity: 0.5 }} />}
            </button>
            {isReached && (
              <div
                className="pointer-events-none absolute text-center text-[11.5px] leading-tight text-snow transition-opacity duration-500 [text-shadow:0_0_6px_#080d1a,0_0_3px_#080d1a,0_0_10px_#080d1a]"
                style={{ left: x - labelW / 2, top: y + R + 7, width: labelW }}
              >
                {n.label}
                {proposed && <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider" style={{ color: PROPOSED }}>proposed</div>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function NodeCard({ node, all, onGoChapter, inline = false }: { node: JourneyNode | null; all: boolean; onGoChapter?: (slug: string) => void; inline?: boolean }) {
  if (!node) {
    if (inline) return null
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-line px-5 py-6 text-center text-sm text-silver">
        {all ? 'Select any step on the map to see the question, activity, what we learned and what we decided.' : 'Select a lit step to see its evidence card. Steps appear as the story reaches them.'}
      </div>
    )
  }
  const proposed = node.kind === 'proposed'
  const rows: [string, string][] = [
    ['Question', node.question],
    ['Activity', node.activity],
    ['What we learned', node.learned],
    ['Decision', node.decision],
  ]
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${inline ? 'mt-2' : 'mt-4'} rounded-2xl border p-5 sm:p-6 ${proposed ? 'border-dashed' : ''}`}
      style={{ borderColor: `color-mix(in srgb, ${nodeColor(node)} 45%, transparent)`, background: 'rgb(17 24 39 / 0.7)' }}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="num text-sm text-dim">Step {node.id}</span>
        <h3 className="mr-auto text-lg font-semibold text-snow">{node.label}</h3>
        <StatusPill status={node.status} />
        {proposed ? <EvidenceTag label="proposed" text="Proposed · not yet run" /> : <Badge tone="silver">Completed activity</Badge>}
      </div>
      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{k}</dt>
            <dd className="mt-1 text-[15px] leading-snug text-snow/90">{v}</dd>
          </div>
        ))}
      </dl>
      <a
        href={`#/present/${node.chapter}`}
        onClick={(e) => {
          if (onGoChapter) {
            e.preventDefault()
            onGoChapter(node.chapter)
          }
        }}
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-violet-soft hover:text-snow"
      >
        Go to chapter <ArrowRight size={14} />
      </a>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */

function VerticalMap({ reached, selected, onSelect, node, onGoChapter }: { reached: Set<number>; selected: number | null; onSelect: (id: number | null) => void; node: JourneyNode | null; onGoChapter?: (slug: string) => void }) {
  return (
    <ol className="space-y-6" aria-label="Venture journey">
      {STAGE_ORDER.map((s) => {
        const items = journeyNodes.filter((n) => n.stage === s)
        const c = stages[s].color
        return (
          <li key={s}>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: c }}>
              {s === 'verdict' ? 'Final evaluation' : `Stage ${stages[s].n} · ${stages[s].label}`}
              {stages[s].weeks && <span className="ml-2 text-dim">{stages[s].weeks}</span>}
            </div>
            <ol className="relative ml-3 space-y-2 border-l pl-5" style={{ borderColor: `color-mix(in srgb, ${c} 35%, transparent)` }}>
              {items.map((n) => {
                const on = reached.has(n.id)
                const col = nodeColor(n)
                const proposed = n.kind === 'proposed'
                const sel = selected === n.id && on
                return (
                  <li key={n.id} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[31px] top-3 grid h-5 w-5 place-items-center rounded-full text-[10px]"
                      style={{ border: on ? `2px ${proposed ? 'dashed' : 'solid'} ${col}` : '1.5px solid rgb(148 163 184 / 0.25)', background: '#080d1a', color: on ? col : 'rgb(148 163 184 / 0.5)' }}
                    >
                      {n.id}
                    </span>
                    <button
                      type="button"
                      disabled={!on}
                      onClick={() => onSelect(sel ? null : n.id)}
                      aria-expanded={sel}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left ${on ? 'border-line bg-navy/60 hover:border-violet/50' : 'border-transparent opacity-45'}`}
                    >
                      <span className="text-sm text-snow">{on ? n.label : 'Not yet reached'}</span>
                      {on ? proposed ? <EvidenceTag label="proposed" text="Proposed" /> : <StatusPill status={n.status} /> : <Lock size={13} className="text-dim" />}
                    </button>
                    {sel && <NodeCard node={node} all inline onGoChapter={onGoChapter} />}
                  </li>
                )
              })}
            </ol>
          </li>
        )
      })}
    </ol>
  )
}
