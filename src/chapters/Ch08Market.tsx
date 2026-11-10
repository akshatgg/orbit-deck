import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { C, DenseHeader } from '../components/biz/kit'
import { Badge, CountUp, Expandable, IllustrativeBadge, Reveal, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { gbp } from '../data/financials'
import { expansionPath, marketAssumptions, marketLayers, pricingTiers } from '../data/market'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'market')!
type LayerId = (typeof marketLayers)[number]['id']

/** Exact compact £ (no rounding of workbook values): £1.865m, £1.29m, £255k. */
const money = (v: number) => (v >= 1_000_000 ? `£${parseFloat((v / 1_000_000).toFixed(3))}m` : v >= 1_000 ? `£${parseFloat((v / 1_000).toFixed(1))}k` : `£${Math.round(v)}`)

const ringColor: Record<LayerId, string> = { tam: C.violet, sam: C.blue, som: C.cyan }

/** CHAPTER 08 — Start focused. Build for repeatability. */
export default function Ch08Market({ mode, step }: ChapterProps) {
  const explore = mode === 'explore'
  const [layer, setLayer] = useState<LayerId>('tam')
  const showExpansion = explore || step >= 2
  const showTiers = explore || step === 1

  return (
    <Stage mode={mode} className={explore ? '' : '!pt-[78px] !pb-[66px]'}>
      <DenseHeader num={meta.num} kicker={meta.actTitle} title="Start focused." accent="Build for repeatability." />

      {/* Present mode swaps the main panel at step 2 */}
      {(explore || step < 2) && (
        <div className="mt-6 grid items-center gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <MarketRings layer={layer} setLayer={setLayer} />
          <div className="min-w-0">
            {explore ? (
              <>
                <LayerDetail layer={layer} />
                <TiersPanel className="mt-4" />
              </>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={showTiers ? 'tiers' : 'detail'} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4, ease }}>
                  {showTiers ? <TiersPanel compactLayer={layer} /> : <LayerDetail layer={layer} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {explore && (
        <>
          <Expandable title="Segmentation assumptions behind these numbers" className="mt-6" defaultOpen>
            <ul className="space-y-1.5">
              {marketAssumptions.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-silver" />
                  {a}
                </li>
              ))}
            </ul>
          </Expandable>
          <SourceNote className="mt-3">Orbit team market sizing model (R3) and financial workbook (R2). Model-derived estimates, not proven demand.</SourceNote>
        </>
      )}

      {showExpansion && (
        <div className={explore ? 'mt-14' : 'mt-4 lg:mt-6'}>
          <Expansion explore={explore} />
        </div>
      )}
    </Stage>
  )
}

/* ---------- Concentric TAM / SAM / SOM ---------- */

function MarketRings({ layer, setLayer }: { layer: LayerId; setLayer: (id: LayerId) => void }) {
  const max = marketLayers[0].institutions
  // radius ∝ √institutions so circle AREA tracks institution count
  const rings = marketLayers.map((l) => ({ ...l, r: 46 * Math.sqrt(l.institutions / max) }))
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(440px,46vh)]">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" role="group" aria-label="Market layers: click a ring">
        <defs>
          {rings.map((l) => (
            <radialGradient key={l.id} id={`mk-${l.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor={ringColor[l.id]} stopOpacity={0.04} />
              <stop offset="100%" stopColor={ringColor[l.id]} stopOpacity={0.18} />
            </radialGradient>
          ))}
        </defs>
        {rings.map((l, i) => {
          const active = layer === l.id
          // bottom-aligned nesting: all circles touch the bottom, like a classic TAM/SAM/SOM
          const cy = 96 - l.r
          return (
            <g
              key={l.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`${l.label}: ${l.institutions} institutions`}
              className="cursor-pointer outline-none"
              onClick={(e) => {
                e.stopPropagation()
                setLayer(l.id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  setLayer(l.id)
                }
              }}
            >
              <motion.circle
                cx={50}
                cy={cy}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: l.r, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.18 }}
                fill={`url(#mk-${l.id})`}
                stroke={ringColor[l.id]}
                strokeWidth={active ? 0.9 : 0.35}
                strokeOpacity={active ? 1 : 0.55}
                style={{ filter: active ? `drop-shadow(0 0 3px ${ringColor[l.id]})` : undefined, transition: 'stroke-width .3s, stroke-opacity .3s' }}
              />
              <motion.text
                x={50}
                y={cy - l.r + (i === 2 ? l.r : 6.5)}
                textAnchor="middle"
                dominantBaseline={i === 2 ? 'middle' : 'auto'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.18 }}
                className="select-none font-mono"
                fontSize={i === 2 ? 3.4 : 3.6}
                fill={active ? C.snow : C.silver}
                letterSpacing={0.4}
              >
                {l.id.toUpperCase()} · {l.institutions}
              </motion.text>
            </g>
          )
        })}
      </svg>
      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 text-center font-mono text-[11px] text-dim">Click a ring · area ∝ institution count</div>
    </div>
  )
}

function LayerDetail({ layer }: { layer: LayerId }) {
  const l = marketLayers.find((m) => m.id === layer)!
  return (
    <div className="glass rounded-2xl p-5 lg:p-6" style={{ borderColor: `color-mix(in srgb, ${ringColor[l.id]} 45%, transparent)` }}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm uppercase tracking-[0.16em]" style={{ color: ringColor[l.id] }}>
          {l.label}
        </span>
        <Badge tone="amber">Model-derived estimate</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[clamp(2.25rem,4vw,4rem)] font-semibold leading-none tracking-tight">
            <CountUp value={l.institutions} />
          </div>
          <div className="mt-1.5 text-sm text-silver">institutions</div>
        </div>
        <div>
          <div className="text-[clamp(2.25rem,4vw,4rem)] font-semibold leading-none tracking-tight">
            <CountUp value={l.value} format={(n) => money(n)} />
          </div>
          <div className="mt-1.5 text-sm text-silver">{l.note}</div>
        </div>
      </div>
      <p className="mt-4 text-base leading-snug text-snow/90 lg:text-lg">{l.definition}</p>
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber/25 bg-amber/[0.06] px-3.5 py-2.5 text-[14px] leading-snug text-silver">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber" />
        <span>
          Not proven demand. The <span className="text-snow">5,000-student cutoff</span> and the <span className="text-snow">serviceability %</span> (TAM → SAM)
          are segmentation assumptions, not observed purchasing boundaries.
        </span>
      </div>
      <SourceNote className="mt-3">Market sizing model (R3). Values = institution counts × assumed list prices.</SourceNote>
    </div>
  )
}

/* ---------- Pricing tiers drill-down ---------- */

function TiersPanel({ className = '', compactLayer }: { className?: string; compactLayer?: LayerId }) {
  const max = pricingTiers[pricingTiers.length - 1].price
  const l = compactLayer ? marketLayers.find((m) => m.id === compactLayer)! : null
  return (
    <div className={`glass rounded-2xl p-5 lg:p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">How the £ values are built · list price by size</div>
        <Badge tone="amber">Assumed pricing</Badge>
      </div>
      {l && (
        <p className="mt-2 text-sm text-silver">
          <span style={{ color: ringColor[l.id] }}>{l.label}</span>: <span className="num text-snow">{l.institutions}</span> institutions ·{' '}
          <span className="num text-snow">{money(l.value)}</span>
        </p>
      )}
      <div className="mt-4 space-y-3">
        {pricingTiers.map((t, i) => (
          <div key={t.id}>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-lg font-semibold">{t.label}</span>
                <span className="ml-2 text-sm text-silver">{t.range}</span>
              </div>
              <span className="num text-xl text-snow lg:text-2xl">
                {gbp(t.price)}
                <span className="text-sm text-silver"> / yr</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--grad-orbit)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(t.price / max) * 100}%` }}
                transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] leading-snug text-silver">
        Each institution is valued at its tier's assumed annual list price. Tier-level institution counts are held in the workbook segmentation sheet and
        are not reproduced here.
      </p>
      <SourceNote className="mt-2">Pricing tiers: financial workbook (R2) / market sizing model (R3). Hypothesised prices, not quoted or contracted.</SourceNote>
    </div>
  )
}

/* ---------- Expansion: Imperial → London → UK ---------- */

// Deterministic abstract node positions (no geography implied)
function ringNodes(n: number, radius: number, offset: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = offset + (i / n) * Math.PI * 2
    const jitter = ((i * 37) % 7) / 7 - 0.5
    return { x: 50 + Math.cos(a) * (radius + jitter * 3), y: 50 + Math.sin(a) * (radius + jitter * 3) * 0.62 }
  })
}

function Expansion({ explore }: { explore: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const stages = useMemo(
    () => [
      { r: 0, nodes: [{ x: 50, y: 50 }] },
      { r: 17, nodes: ringNodes(6, 17, 0.4) },
      { r: 36, nodes: ringNodes(14, 36, 0.1) },
    ],
    [],
  )
  const colors = [C.peach, C.violetSoft, C.cyan]
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10">
      <div className="relative">
        <svg viewBox="0 12 100 76" className="h-auto max-h-[46vh] w-full overflow-visible" aria-label="Abstract expansion diagram: Imperial, then London universities, then wider UK">
          {/* orbit ellipses */}
          {[17, 36].map((r, i) => (
            <motion.ellipse
              key={r}
              cx={50}
              cy={50}
              rx={r}
              ry={r * 0.62}
              fill="none"
              stroke={colors[i + 1]}
              strokeOpacity={hover === null || hover === i + 1 ? 0.45 : 0.15}
              strokeWidth={0.25}
              strokeDasharray="0.8 1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.3 + i * 0.7 }}
            />
          ))}
          {/* luminous links from centre to first ring */}
          {stages[1].nodes.map((n, i) => (
            <motion.line
              key={`l${i}`}
              x1={50}
              y1={50}
              x2={n.x}
              y2={n.y}
              stroke={C.violetSoft}
              strokeOpacity={0.35}
              strokeWidth={0.2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.05 }}
            />
          ))}
          {stages.map((s, si) =>
            s.nodes.map((n, i) => (
              <motion.circle
                key={`${si}-${i}`}
                cx={n.x}
                cy={n.y}
                fill={colors[si]}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: si === 0 ? 2.6 : 1.1, opacity: hover === null || hover === si ? 1 : 0.3 }}
                transition={{ duration: 0.5, ease, delay: 0.2 + si * 0.7 + i * 0.04 }}
                style={{ filter: `drop-shadow(0 0 1.5px ${colors[si]})` }}
              />
            )),
          )}
          <motion.circle cx={50} cy={50} r={5} fill="none" stroke={C.peach} strokeOpacity={0.5} strokeWidth={0.25} animate={{ r: [3.5, 7, 3.5], opacity: [0.7, 0, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
          <text x={50} y={57.5} textAnchor="middle" fontSize={2.6} fill={C.snow} className="font-mono">
            Imperial
          </text>
        </svg>
        <div className="absolute bottom-0 left-0 flex items-center gap-2">
          <IllustrativeBadge label="Abstract diagram" />
          <span className="font-mono text-[11px] text-dim">Not a map · nodes are not specific institutions</span>
        </div>
      </div>
      <div>
        <ol className="space-y-2.5">
          {expansionPath.map((p, i) => (
            <Reveal key={p.id} as="li" delay={0.3 + i * 0.5} show>
              <button
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setHover((h) => (h === i ? null : i))
                }}
                className={`flex w-full items-start gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${hover === i ? 'border-violet/50 bg-violet/[0.08]' : 'border-line bg-white/[0.02]'}`}
              >
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: colors[i], boxShadow: `0 0 12px ${colors[i]}` }} />
                <span>
                  <span className="block text-lg font-semibold">{p.label}</span>
                  <span className="block text-[15px] text-silver">{p.detail}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </ol>
        <Reveal show delay={1.6} className="mt-5">
          <p className="text-[clamp(1.2rem,1.9vw,2rem)] font-medium leading-tight tracking-tight">
            Our first market is not every student.{' '}
            <span className="font-serif italic text-gradient-warm">It's the institution where we can prove value.</span>
          </p>
        </Reveal>
        {explore && <SourceNote className="mt-3">Expansion sequence per the venture report (R1). A plan, not a description of current partnerships.</SourceNote>}
      </div>
    </div>
  )
}
