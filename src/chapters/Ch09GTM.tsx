import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { DenseHeader, pct } from '../components/biz/kit'
import { Badge, Reveal, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { acquisitionSteps, funnel, funnelNote } from '../data/market'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'gtm')!
type StageId = (typeof funnel)[number]['id']

const stageColors = ['#8066ff', '#6a74fb', '#3b82f6', '#3cb1f0', '#3de0ea']

/** CHAPTER 09 — A scalable product needs a repeatable sales process. */
export default function Ch09GTM({ mode, step }: ChapterProps) {
  const explore = mode === 'explore'
  const [sel, setSel] = useState<StageId>('contacts')
  const showLoop = explore || step >= 1

  return (
    <Stage mode={mode} className={explore ? '' : '!pt-[78px] !pb-[66px]'}>
      <DenseHeader num={meta.num} kicker={meta.actTitle} title="A scalable product needs a" accent="repeatable sales process." size={explore ? 'h1' : 'h2'} />

      {explore || step < 1 ? (
        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
          <Funnel sel={sel} setSel={setSel} />
          <div className="flex flex-col gap-4">
            <StageDetail sel={sel} />
            <NoteBox />
          </div>
        </div>
      ) : (
        <div className="mt-6 lg:mt-8">
          <MiniFunnel />
        </div>
      )}

      {showLoop && (
        <div className={explore ? 'mt-14' : 'mt-6 lg:mt-8'}>
          <AcquisitionLoop explore={explore} />
        </div>
      )}
    </Stage>
  )
}

function Funnel({ sel, setSel }: { sel: StageId; setSel: (id: StageId) => void }) {
  const max = funnel[0].value
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="cyan">Modelled 2027–2029 totals</Badge>
        <Badge tone="amber">Planning estimate</Badge>
      </div>
      <div className="space-y-1">
        {funnel.map((f, i) => {
          const active = sel === f.id
          const w = Math.max(18, (f.value / max) * 100)
          const next = funnel[i + 1]
          return (
            <div key={f.id}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(f.id)
                }}
                aria-pressed={active}
                className="group block w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-[clamp(40px,6vh,58px)] flex-1">
                    <motion.div
                      className="absolute inset-y-0 left-0 flex items-center rounded-xl border px-4"
                      style={{
                        background: `linear-gradient(90deg, ${stageColors[i]}${active ? '55' : '30'}, ${stageColors[i]}10)`,
                        borderColor: active ? stageColors[i] : 'transparent',
                        boxShadow: active ? `0 0 40px -12px ${stageColors[i]}` : undefined,
                      }}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: `${w}%`, opacity: 1 }}
                      transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.12 }}
                    >
                      <span className="num text-[clamp(1.4rem,2.2vw,2.25rem)] font-semibold text-snow">{f.value}</span>
                    </motion.div>
                  </div>
                  <span className={`w-[38%] shrink-0 text-[15px] leading-tight transition-colors lg:text-base ${active ? 'text-snow' : 'text-silver group-hover:text-snow'}`}>
                    {f.label}
                  </span>
                </div>
              </button>
              {next && (
                <div className="flex h-6 items-center pl-4 font-mono text-[12px] text-dim">
                  <span className="mr-2 text-silver">↓</span>
                  <span className="num text-silver">{pct(next.value / f.value)}</span>
                  <span className="ml-1.5">
                    ({next.value} of {f.value})
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-2 font-mono text-[12px] text-dim">
        End-to-end: <span className="num text-silver">{pct(funnel[funnel.length - 1].value / funnel[0].value)}</span> ({funnel[funnel.length - 1].value} of {funnel[0].value})
        · ratios computed from stage totals
      </p>
    </div>
  )
}

function StageDetail({ sel }: { sel: StageId }) {
  const i = funnel.findIndex((f) => f.id === sel)
  const f = funnel[i]
  const prev = funnel[i - 1]
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }} className="glass rounded-2xl p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">
          Stage {i + 1} of {funnel.length}
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="num text-5xl font-semibold" style={{ color: stageColors[i] }}>
            {f.value}
          </span>
          <span className="text-lg font-semibold">{f.label}</span>
        </div>
        <p className="mt-3 text-base leading-snug text-snow/90">{f.detail}</p>
        {prev && (
          <p className="mt-3 font-mono text-[13px] text-silver">
            {pct(f.value / prev.value)} of the previous stage ({f.value} of {prev.value})
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function NoteBox() {
  return (
    <div className="rounded-2xl border border-amber/30 bg-amber/[0.06] p-4">
      <div className="flex items-start gap-2.5 text-[15px] leading-snug text-snow/90">
        <AlertCircle size={17} className="mt-0.5 shrink-0 text-amber" />
        <span>{funnelNote}</span>
      </div>
      <SourceNote className="mt-2">Go-to-market funnel model (R4).</SourceNote>
    </div>
  )
}

function MiniFunnel() {
  return (
    <div className="glass flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-5 py-3">
      <Badge tone="amber">Planning estimate · 2027–29</Badge>
      {funnel.map((f, i) => (
        <span key={f.id} className="flex items-center gap-3">
          <span className="flex items-baseline gap-1.5">
            <span className="num text-2xl font-semibold" style={{ color: stageColors[i] }}>
              {f.value}
            </span>
            <span className="text-sm text-silver">{f.label}</span>
          </span>
          {i < funnel.length - 1 && <ArrowRight size={14} className="text-dim" />}
        </span>
      ))}
    </div>
  )
}

function AcquisitionLoop({ explore }: { explore: boolean }) {
  const [active, setActive] = useState<number | null>(null)
  const n = acquisitionSteps.length
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h3 className="t-h2">
          The acquisition <span className="font-serif font-normal italic text-gradient">loop</span>
        </h3>
        <Badge tone="silver">Proposed approach · not yet executed</Badge>
      </div>

      <div className="relative">
        {/* luminous connecting line (desktop) */}
        <div className="pointer-events-none absolute left-[7%] right-[7%] top-[22px] hidden h-px lg:block">
          <motion.div
            className="h-full origin-left"
            style={{ background: 'linear-gradient(90deg, #8066ff, #3b82f6, #3de0ea)', boxShadow: '0 0 12px rgba(61,224,234,0.6)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.2 }}
          />
        </div>
        <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2">
          {acquisitionSteps.map((s, i) => {
            const on = active === i
            return (
              <Reveal key={s} as="li" show delay={0.25 + i * 0.12}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActive(on ? null : i)
                  }}
                  className="group flex w-full flex-row items-start gap-3 text-left lg:flex-col lg:items-center lg:text-center"
                >
                  <span
                    className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border font-mono text-sm transition-all ${
                      on ? 'border-cyan bg-cyan/20 text-snow shadow-[0_0_30px_-4px_rgba(61,224,234,0.8)]' : 'border-violet/50 bg-ink text-silver group-hover:text-snow'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-[15px] leading-snug transition-colors ${on ? 'text-snow' : 'text-silver group-hover:text-snow'}`}>{s}</span>
                </button>
              </Reveal>
            )
          })}
        </ol>
        <Reveal show delay={0.25 + n * 0.12} className="mt-4 flex items-center justify-end gap-2 font-mono text-[12px] text-cyan/80">
          <RotateCcw size={13} /> Documented results restart the loop with the next institution
        </Reveal>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-peach/30 bg-peach/[0.06] px-4 py-3 text-[15px] leading-snug text-snow/90">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-peach" />
        <span>
          Imperial access helps discovery and a <em>possible</em> pilot. It is <span className="font-semibold">not a signed agreement or a paid pilot</span>.
        </span>
      </div>
      {explore && <SourceNote className="mt-3">Acquisition approach per the venture report (R1) and go-to-market funnel model (R4).</SourceNote>}
    </div>
  )
}
