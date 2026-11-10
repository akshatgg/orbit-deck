import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, FlaskConical } from 'lucide-react'
import { useState } from 'react'
import { DenseHeader } from '../components/biz/kit'
import { Badge, Expandable, Reveal, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { businessModelRowKeys, businessModels, valueProp } from '../data/strategy'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'business-model')!

type Model = (typeof businessModels)[number]
type ModelId = Model['id']

/** CHAPTER 07 — Who should pay for discovery? */
export default function Ch07BusinessModel({ mode, step }: ChapterProps) {
  const [focus, setFocus] = useState<ModelId>('university')
  const explore = mode === 'explore'
  const focused = businessModels.find((m) => m.id === focus)!

  return (
    <Stage mode={mode} className={explore ? '' : '!pt-[78px] !pb-[66px]'}>
      <DenseHeader num={meta.num} kicker={meta.actTitle} title="Who should pay for" accent="discovery?" size={explore ? 'h1' : 'h2'} />

      {/* Option cards */}
      <div className={`grid gap-3 md:grid-cols-3 lg:gap-4 ${explore ? 'mt-8' : 'mt-5'}`} role="radiogroup" aria-label="Business model options">
        {businessModels.map((m, i) => (
          <OptionCard key={m.id} m={m} compact={!explore} active={focus === m.id} onSelect={() => setFocus(m.id)} delay={0.15 + i * 0.08} />
        ))}
      </div>

      {/* Detail: present = focused option's rows; explore = full table */}
      {!explore ? (
        <div className="mt-4 lg:mt-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={focus}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className={`glass rounded-2xl p-4 lg:p-5 ${focused.selected ? 'border-violet/40' : ''}`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                Option {focused.option} · {focused.title}
                {focused.selected && <Badge tone="violet">Selected to test</Badge>}
              </div>
              <dl className="grid gap-x-7 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-4">
                {businessModelRowKeys.map((k) => (
                  <div key={k}>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{k}</dt>
                    <dd className={`mt-0.5 text-[15px] leading-snug lg:text-base ${k === 'Main uncertainty' ? 'text-peach' : 'text-snow/90'}`}>{focused.rows[k]}</dd>
                  </div>
                ))}
                <div>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Requires</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {focused.requires.map((r) => (
                      <span key={r} className="rounded-full border border-line bg-white/[0.03] px-2.5 py-0.5 text-[13px] text-silver">
                        {r}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <ComparisonTable focus={focus} setFocus={setFocus} />
      )}

      <Reveal show={step >= 1} className={explore ? 'mt-8' : 'mt-4'}>
        <p className="text-center text-[clamp(1.25rem,2.2vw,2.25rem)] font-medium leading-tight tracking-tight text-snow">
          We chose a model to <span className="font-serif italic text-gradient">test</span> — not a revenue stream to assume.
        </p>
      </Reveal>

      {explore && (
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <Expandable title="Why universities, and what this does not prove">
            <p>
              The prototype is built around a university event feed, so an institutional subscription is the closest fit to what already exists. But the
              current evidence is student-side problem evidence only. {valueProp.caveat} No budget owner, purchasing process or paid pilot has been
              confirmed yet.
            </p>
          </Expandable>
          <Expandable title="Why the other options are not dropped">
            <p>
              Option B (organisers pay) becomes testable only once Orbit has an engaged audience and reliable attribution. Option C (students pay) has no
              willingness-to-pay evidence and faces free alternatives. Both remain open if the institutional model fails its pilot test.
            </p>
          </Expandable>
        </div>
      )}
      {explore && <SourceNote className="mt-4">Comparison synthesised from the New Venture Creation report (R1). Option assessments are team judgements, not market data.</SourceNote>}
    </Stage>
  )
}

function OptionCard({ m, active, onSelect, delay, compact }: { m: Model; active: boolean; onSelect: () => void; delay: number; compact: boolean }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-4 text-left transition-all lg:p-5 ${
        active ? 'border-violet/60 bg-violet/[0.08] shadow-[0_0_60px_-24px_rgba(128,102,255,0.9)]' : 'border-line bg-white/[0.02] hover:border-silver/30'
      } ${m.selected ? '' : 'opacity-90'}`}
    >
      {m.selected && <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet/25 blur-3xl" />}
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-lg ${
            m.selected ? 'border-violet/60 bg-violet/20 text-snow' : 'border-line text-silver'
          }`}
        >
          {m.option}
        </span>
        {m.selected ? (
          <Badge tone="violet">
            <FlaskConical size={11} /> Selected to test
          </Badge>
        ) : (
          <Badge tone="silver">{m.verdict}</Badge>
        )}
      </div>
      <h3 className={`relative font-semibold tracking-tight ${compact ? 'mt-2 text-[clamp(1.2rem,1.6vw,1.6rem)]' : 'mt-3 text-[clamp(1.25rem,1.8vw,1.75rem)]'}`}>{m.title}</h3>
      {!compact && <p className="relative mt-1 text-[15px] text-silver">{m.rows['Revenue mechanism']}</p>}
      {m.selected && (
        <div className="relative mt-2.5 flex items-start gap-2 rounded-lg border border-peach/30 bg-peach/[0.07] px-3 py-2 text-[14px] text-peach">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>
            {m.rows['Main uncertainty']}. <span className="text-peach/80">{m.verdict}.</span>
          </span>
        </div>
      )}
      {active && (
        <motion.span layoutId="bm-active" className="absolute bottom-0 left-0 h-[2px] w-full" style={{ background: 'var(--grad-orbit)' }} />
      )}
    </motion.button>
  )
}

function ComparisonTable({ focus, setFocus }: { focus: ModelId; setFocus: (id: ModelId) => void }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[760px] border-collapse text-left text-[15px]">
        <thead>
          <tr className="bg-white/[0.02]">
            <th className="w-[18%] px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-dim">Dimension</th>
            {businessModels.map((m) => (
              <th key={m.id} className={`px-4 py-3 transition-colors ${focus === m.id ? 'bg-violet/[0.10]' : ''}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFocus(m.id)
                  }}
                  className="flex items-center gap-2 text-left font-semibold text-snow"
                >
                  <span className="font-mono text-silver">{m.option}</span> {m.title}
                  {m.selected && <Badge tone="violet">Selected to test</Badge>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {businessModelRowKeys.map((k) => (
            <tr key={k} className="border-t border-line">
              <th scope="row" className="px-4 py-3 align-top font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-silver">
                {k}
              </th>
              {businessModels.map((m) => (
                <td
                  key={m.id}
                  className={`px-4 py-3 align-top leading-snug transition-colors ${focus === m.id ? 'bg-violet/[0.06] text-snow' : 'text-silver'} ${
                    k === 'Main uncertainty' && m.selected ? '!text-peach' : ''
                  }`}
                >
                  {m.rows[k]}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-line">
            <th scope="row" className="px-4 py-3 align-top font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-silver">
              Requires
            </th>
            {businessModels.map((m) => (
              <td key={m.id} className={`px-4 py-3 align-top ${focus === m.id ? 'bg-violet/[0.06]' : ''}`}>
                <ul className="space-y-1">
                  {m.requires.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[14px] text-silver">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full border border-silver/60" /> {r}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
