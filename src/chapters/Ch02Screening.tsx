import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ScreeningRadar } from '../components/ideation/ScreeningRadar'
import { ChapterHeader, CountUp, Expandable, Kicker, LearningCard, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { SCREEN_WEIGHT, closingLine, criteria, lowest, screeningLearning, screeningTotal, verdict, verdictNote, weighted } from '../data/screening'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'screening')!
const STAGE = '#38bdf8'
const AMBER = 'var(--color-amber)'

function ScoreBar({ score, show, hot }: { score: number; show: boolean; hot: boolean }) {
  return (
    <div className="hidden gap-1 sm:flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((k) => (
        <motion.span
          key={k}
          initial={false}
          animate={{ opacity: show && k <= score ? 1 : 0.18, scaleY: show && k <= score ? 1 : 0.6 }}
          transition={{ duration: 0.4, ease, delay: show ? k * 0.07 : 0 }}
          className="h-3.5 w-5 rounded-[3px]"
          style={{ background: show && k <= score ? (hot ? AMBER : STAGE) : 'rgb(148 163 184)' }}
        />
      ))}
    </div>
  )
}

function Matrix({ revealed, final, activeId, onHover, onPick, hotId }: { revealed: number; final: boolean; activeId: string | null; onHover: (id: string | null) => void; onPick: (id: string) => void; hotId: string | null }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Venture screening decision matrix: five criteria, each scored out of 5 with a 20% weight</caption>
        <thead>
          <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
            <th scope="col" className="px-4 py-2.5 font-medium">Screening question</th>
            <th scope="col" className="px-2 py-2.5 font-medium">Score</th>
            <th scope="col" className="hidden px-2 py-2.5 text-right font-medium sm:table-cell">Weight</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Weighted</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c, i) => {
            const shown = i < revealed
            const active = activeId === c.id
            const hot = hotId === c.id
            return (
              <tr
                key={c.id}
                onMouseEnter={() => shown && onHover(c.id)}
                onMouseLeave={() => onHover(null)}
                className={`border-b border-line/70 transition-colors duration-500 ${active ? 'bg-white/[0.06]' : ''}`}
              >
                <td className="px-4 py-2">
                  <button
                    type="button"
                    disabled={!shown}
                    onClick={(e) => {
                      e.stopPropagation()
                      onPick(c.id)
                    }}
                    onFocus={() => shown && onHover(c.id)}
                    onBlur={() => onHover(null)}
                    className="block w-full text-left disabled:cursor-default"
                    aria-label={`${c.name}${shown ? `: ${c.score} out of 5. Show rationale` : ''}`}
                  >
                    <span className={`block text-[17px] font-semibold leading-tight transition-colors duration-500 ${shown ? (hot ? 'text-amber' : 'text-snow') : 'text-silver'}`}>
                      <span className="num mr-2 text-dim">{c.q}</span>
                      {c.name}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-silver">{c.question}</span>
                  </button>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-3">
                    <ScoreBar score={c.score} show={shown} hot={hot} />
                    <span className={`num w-9 text-lg font-semibold ${shown ? (hot ? 'text-amber' : 'text-snow') : 'text-dim'}`}>{shown ? `${c.score}/5` : '–'}</span>
                  </div>
                </td>
                <td className="num hidden px-2 py-2 text-right text-silver sm:table-cell">{Math.round(SCREEN_WEIGHT * 100)}%</td>
                <td className={`num px-4 py-2 text-right text-lg ${shown ? (hot ? 'text-amber' : 'text-snow') : 'text-dim'}`}>{shown ? weighted(c).toFixed(2) : '–'}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="px-4 py-2.5 text-[15px] font-semibold text-silver">
              Total
              <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-dim">weights sum to 100%</span>
            </th>
            <td className="px-2" />
            <td className="hidden sm:table-cell" />
            <td className="num px-4 py-2.5 text-right text-2xl font-semibold text-snow">
              {final ? (
                <>
                  <CountUp value={screeningTotal} format={(n) => n.toFixed(2)} duration={0.9} />
                  <span className="text-base text-silver"> / 5</span>
                </>
              ) : (
                <span className="text-dim">–</span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function Rationale({ id }: { id: string }) {
  const c = criteria.find((x) => x.id === id)!
  const hot = c.id === lowest.id
  return (
    <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="glass rounded-2xl p-4" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3">
        <Kicker className={hot ? '!text-amber' : ''}>
          Q{c.q} · {c.name}
        </Kicker>
        <span className="num text-xl font-semibold text-snow">{c.score}/5</span>
      </div>
      <p className="mt-2 text-[clamp(1rem,1.25vw,1.2rem)] leading-snug text-snow">{c.rationale}</p>
    </motion.div>
  )
}

function VerdictBlock() {
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-2xl border p-4" style={{ borderColor: `color-mix(in srgb, ${STAGE} 50%, transparent)`, background: `color-mix(in srgb, ${STAGE} 8%, transparent)` }}>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-silver">Screening outcome</div>
        <div className="mt-1 text-[clamp(1.25rem,2vw,1.9rem)] font-semibold tracking-tight text-snow">{verdict}</div>
      </div>
      <p className="text-[14px] leading-snug text-silver">{verdictNote}</p>
    </div>
  )
}

function WeakLink() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border-l-2 border-amber bg-amber/5 px-4 py-3 text-[clamp(1rem,1.25vw,1.2rem)] leading-snug text-snow">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber">Lowest-scoring assumption</span>
        <div className="mt-1">
          Willingness to pay: <span className="num font-semibold text-amber">{lowest.score}/5</span>. No institutional purchasing evidence at this stage.
        </div>
      </div>
      <p className="font-serif text-[clamp(1.2rem,1.9vw,1.9rem)] italic leading-snug text-violet-soft">{closingLine}</p>
    </div>
  )
}

export default function Ch02Screening({ mode, step }: ChapterProps) {
  const present = mode === 'present'
  const s = present ? step : meta.steps - 1
  const revealed = Math.min(5, Math.max(0, s))
  const final = s >= 6

  // hover is transient; pin is set by click and tied to the step it was made on (so stepping resets it)
  const [hover, setHover] = useState<string | null>(null)
  const [pin, setPin] = useState<{ step: number; id: string } | null>(null)
  const pinned = pin && pin.step === s ? pin.id : null
  const picked = hover ?? pinned
  const stepId = s >= 1 && s <= 5 ? criteria[s - 1].id : null
  const shownIds = criteria.slice(0, revealed).map((c) => c.id)
  const activeId = picked && shownIds.includes(picked) ? picked : stepId
  const hotId = final ? lowest.id : null
  const pick = (id: string) => setPin((p) => (p && p.step === s && p.id === id ? null : { step: s, id }))

  const left = (
    <div className="flex flex-col items-center">
      <ScreeningRadar revealed={revealed} activeId={activeId} onHover={setHover} onPick={pick} highlightId={hotId} />
      <AnimatePresence>
        {final && (
          <motion.div key="verdict" className="w-full" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease, delay: 0.3 }}>
            <VerdictBlock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const right = (
    <div className="space-y-4">
      <Matrix revealed={revealed} final={final} activeId={activeId} onHover={setHover} onPick={pick} hotId={hotId} />
      <AnimatePresence mode="wait" initial={false}>
        {activeId ? (
          <Rationale key={activeId} id={activeId} />
        ) : final ? (
          <motion.div key="weak" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease, delay: 0.5 }}>
            <WeakLink />
          </motion.div>
        ) : (
          <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-1 text-[15px] leading-snug text-silver">
            Each criterion is scored 1–5 by the team and carries {Math.round(SCREEN_WEIGHT * 100)}% of the total. The scores are judgements, not measurements.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <Stage mode={mode}>
      <ChapterHeader
        num={meta.num}
        kicker={meta.title}
        title={meta.headline}
        lead={present ? 'Five venture-screening questions from the Week 2 NVC lecture (S1), equally weighted.' : 'Five venture-screening questions from the Week 2 NVC lecture (S1), each weighted equally at 20%.'}
      />
      <div className="mt-3">
        <StageLabel stage={meta.stage} />
      </div>
      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        {left}
        {right}
      </div>

      {!present && (
        <div className="mt-10 space-y-6">
          <LearningCard learning={screeningLearning} />
          <Expandable title="How the total is calculated">
            <p>
              Weighted score = score × {Math.round(SCREEN_WEIGHT * 100)}%. Total = {criteria.map((c) => weighted(c).toFixed(2)).join(' + ')} = {screeningTotal.toFixed(2)} out of 5.
            </p>
          </Expandable>
          <Expandable title="Rationale for every score">
            <ul className="space-y-2">
              {criteria.map((c) => (
                <li key={c.id}>
                  <span className="font-medium text-snow">
                    {c.name} ({c.score}/5):
                  </span>{' '}
                  {c.rationale}
                </li>
              ))}
            </ul>
          </Expandable>
        </div>
      )}
      <SourceNote className="mt-5">Screening questions: NVC Week 2 lecture (S1). Scores and rationale are the team’s own screening judgement, not validated evidence of demand.</SourceNote>
    </Stage>
  )
}
