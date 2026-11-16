import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '../components/ui'
import { chapters, stages, type StageId } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { presenterIds, team, type PresenterId } from '../data/team'
import { presentHash } from './route'
import { WORDS_PER_MIN, useRehearsal, useSpeakers, wordCount } from './useRehearsal'

/** Suggested split of the 13-minute slot (12 min 15 s speaking): six ≈ 2-minute blocks, one per presenter. Chapter index ranges are inclusive. */
const GROUPS: { key: string; label: string; stage: StageId; from: number; to: number; suggestedMin: number }[] = [
  { key: 'ideation', label: 'Opening, ideation & screening', stage: 'ideation', from: 0, to: 2, suggestedMin: 2 },
  { key: 'discovery', label: 'Discovery → product decisions', stage: 'discovery', from: 3, to: 4, suggestedMin: 125 / 60 },
  { key: 'bmd', label: 'Jobs, product & who pays', stage: 'bmd', from: 5, to: 7, suggestedMin: 2 },
  { key: 'market', label: 'Lean Canvas & financials', stage: 'bmd', from: 8, to: 9, suggestedMin: 2 },
  { key: 'validation', label: 'Engagement, walkthroughs & pilot', stage: 'validation', from: 10, to: 12, suggestedMin: 125 / 60 },
  { key: 'verdict', label: 'Gates, scale & verdict', stage: 'validation', from: 13, to: 15, suggestedMin: 125 / 60 },
]
const SUGGESTED_BASE_MIN = 12.25

const mmss = (sec: number) => {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
const mins = (sec: number) => `${(sec / 60).toFixed(1)} min`

/** Number input that lets you type freely and commits on blur / Enter. */
function NumField({ value, onCommit, min, max, step = 1, label, suffix, className = '' }: { value: number; onCommit: (n: number) => void; min: number; max: number; step?: number; label: string; suffix?: string; className?: string }) {
  const shown = String(Math.round(value * 10) / 10)
  const [draft, setDraft] = useState(shown)
  const [focus, setFocus] = useState(false)
  useEffect(() => {
    if (!focus) setDraft(shown)
  }, [shown, focus])
  const commit = () => {
    const n = Number(draft)
    if (Number.isFinite(n) && draft.trim() !== '') onCommit(Math.max(min, Math.min(max, n)))
    else setDraft(shown)
  }
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <input
        type="number"
        inputMode="decimal"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={draft}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false)
          commit()
        }}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
        className="num w-20 rounded-lg border border-line bg-ink/60 px-2.5 py-1.5 text-sm text-snow focus:border-violet/60"
      />
      {suffix && <span className="text-xs text-dim">{suffix}</span>}
    </span>
  )
}

export function Rehearsal({ go }: { go: (hash: string, replace?: boolean) => void }) {
  const r = useRehearsal()
  const speakers = useSpeakers()

  const wordsOf = chapters.map((c) => wordCount(c.script))
  const neededSec = wordsOf.map((w) => (w / WORDS_PER_MIN) * 60)
  const diff = r.totalSec - r.targetSec
  const over = diff > 5
  const overridden = Object.keys(r.overrides).length

  const bySpeaker = presenterIds.map((id) => {
    const idxs = chapters.map((c, i) => (speakers[c.slug] === id ? i : -1)).filter((i) => i >= 0)
    return { id, sec: idxs.reduce((a, i) => a + r.chapterSec[i], 0), n: idxs.length }
  })
  const maxSpk = Math.max(...bySpeaker.map((s) => s.sec), 1)

  return (
    <div className="atmosphere min-h-full text-snow">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-8">
          <a href="#/present/question" aria-label="Back to presentation" className="rounded-full">
            <Logo size={24} wordmark={false} />
          </a>
          <h1 className="mr-auto text-base font-semibold sm:text-lg">Rehearsal</h1>
          <button onClick={() => go(presentHash(0, 0), false)} className="rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">Present</button>
          <button onClick={() => go('#/explore', false)} className="rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">Explore</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-8 sm:py-12">
        <div>
          <a href="#/present/question" className="inline-flex items-center gap-1.5 text-sm text-silver hover:text-snow">
            <ArrowLeft size={14} /> Back to the presentation
          </a>
          <h2 className="t-h1 mt-3">Plan the time and the speakers</h2>
          <p className="t-lead mt-3 max-w-3xl">
            Set the total length, nudge any chapter, assign speakers, and check each script against the time it has. Settings are saved in this browser and drive the timer, the presenter panel and the notes.
          </p>
        </div>

        {/* total */}
        <section className="grid gap-4 rounded-2xl border border-line bg-navy/60 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6" aria-label="Total time">
          <label className="block">
            <span className="t-kicker !text-dim">Target length</span>
            <div className="mt-2">
              <NumField value={r.targetMin} onCommit={r.setTargetMin} min={1} max={120} step={0.5} label="Total presentation time in minutes" suffix="minutes" />
            </div>
            <span className="mt-1 block text-[11px] text-dim">Default {pitchConfig.targetDurationMin} min speaking (12:15) inside a 13-minute slot. Chapters without an override scale to fit.</span>
          </label>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Target" value={mmss(r.targetSec)} />
            <Stat label="Allocated" value={mmss(r.totalSec)} tone={over ? 'text-amber' : 'text-snow'} />
            <Stat label={over ? 'Over by' : 'Spare'} value={mmss(Math.abs(diff))} tone={over ? 'text-amber' : 'text-st-supported'} />
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col">
            {overridden > 0 && (
              <button onClick={() => chapters.forEach((c) => r.clearChapterSec(c.slug))} className="rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
                Clear {overridden} time override{overridden > 1 ? 's' : ''}
              </button>
            )}
            <button onClick={r.reset} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-silver hover:text-snow">
              <RotateCcw size={12} /> Reset to defaults
            </button>
          </div>
          {over && (
            <p className="flex items-center gap-2 text-sm text-amber sm:col-span-3">
              <AlertTriangle size={15} /> Chapter overrides add up to {mmss(Math.abs(diff))} more than the target.
            </p>
          )}
        </section>

        {/* distribution */}
        <section aria-label="Suggested distribution">
          <h3 className="t-kicker mb-3">Suggested distribution vs current plan</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {GROUPS.map((g) => {
              const cur = chapters.slice(g.from, g.to + 1).reduce((a, _c, k) => a + r.chapterSec[g.from + k], 0)
              const sug = (g.suggestedMin * 60 * r.targetMin) / SUGGESTED_BASE_MIN
              const col = stages[g.stage].color
              const d = cur - sug
              return (
                <div key={g.key} className="rounded-xl border border-line bg-navy/50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium" style={{ color: col }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: col }} />
                    {g.label}
                  </div>
                  <div className="num mt-2 text-xl text-snow">{mmss(cur)}</div>
                  <div className="num text-[11px] text-dim">
                    suggested {mmss(sug)} <span className={Math.abs(d) > 10 ? 'text-amber' : ''}>({d >= 0 ? '+' : '−'}{Math.round(Math.abs(d))}s)</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (cur / Math.max(sug, 1)) * 100)}%`, background: col }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* chapters */}
        <section aria-label="Chapters" className="space-y-8">
          {GROUPS.map((g) => {
            const col = stages[g.stage].color
            const sub = chapters.slice(g.from, g.to + 1).reduce((a, _c, k) => a + r.chapterSec[g.from + k], 0)
            return (
              <div key={g.key}>
                <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: col }} />
                    {g.label}
                    <span className="font-mono text-[11px] font-normal uppercase tracking-wider text-dim">Stage {stages[g.stage].n}</span>
                  </h3>
                  <span className="num text-sm text-silver">
                    subtotal {mmss(sub)} <span className="text-dim">({mins(sub)})</span>
                  </span>
                </div>
                <ul className="space-y-3">
                  {chapters.slice(g.from, g.to + 1).map((c, k) => {
                    const i = g.from + k
                    const sec = r.chapterSec[i]
                    const tooLong = neededSec[i] > sec + 0.5
                    const edited = c.slug in r.overrides
                    return (
                      <li key={c.slug} className="rounded-2xl border border-line bg-navy/50 p-4">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                          <div className="min-w-[200px] flex-1">
                            <a href={`#/present/${c.slug}`} className="text-[15px] font-medium text-snow hover:text-violet-soft">
                              <span className="num mr-2 text-dim">{c.num}</span>
                              {c.title}
                            </a>
                            <div className="num mt-0.5 text-[11px] text-dim">
                              {c.steps} steps · default {c.durationSec}s{edited && <span className="ml-2 text-violet-soft">edited</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <NumField value={sec} onCommit={(n) => r.setChapterSec(c.slug, n)} min={5} max={600} label={`Seconds for ${c.title}`} suffix="sec" />
                            {edited && (
                              <button onClick={() => r.clearChapterSec(c.slug)} aria-label={`Reset ${c.title} to the scaled default`} title="Back to scaled default" className="rounded-full p-1.5 text-dim hover:text-snow">
                                <RotateCcw size={13} />
                              </button>
                            )}
                          </div>
                          <label className="flex items-center gap-2 text-xs text-dim">
                            Speaker
                            <select
                              value={speakers[c.slug] ?? ''}
                              onChange={(e) => r.setSpeaker(c.slug, e.target.value as PresenterId)}
                              aria-label={`Speaker for ${c.title}`}
                              className="rounded-lg border border-line bg-ink px-2.5 py-1.5 text-sm text-snow"
                            >
                              {presenterIds.map((id) => (
                                <option key={id} value={id}>
                                  {team[id].name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span className="num text-silver">{wordsOf[i]} words</span>
                          <span className="num text-silver">≈ {mmss(neededSec[i])} at {WORDS_PER_MIN} wpm</span>
                          <span className="num text-dim">allotted {mmss(sec)}</span>
                          {tooLong ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-2.5 py-0.5 text-amber">
                              <AlertTriangle size={12} /> Script is {Math.round(neededSec[i] - sec)}s over its time
                            </span>
                          ) : (
                            <span className="text-st-supported">Fits</span>
                          )}
                        </div>
                        <details className="mt-3 text-sm">
                          <summary className="cursor-pointer text-silver hover:text-snow">Script</summary>
                          <p className="mt-2 leading-relaxed text-snow/85">{c.script}</p>
                          <ol className="mt-3 list-decimal space-y-0.5 pl-5 text-xs text-dim">
                            {c.cues.map((cue, ci) => (
                              <li key={ci}>{cue}</li>
                            ))}
                          </ol>
                        </details>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </section>

        {/* speakers */}
        <section aria-label="Speaker totals">
          <h3 className="t-kicker mb-3">Time per speaker</h3>
          <ul className="space-y-2">
            {bySpeaker.map((s) => (
              <li key={s.id} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate text-snow">{team[s.id].short}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full rounded-full" style={{ width: `${(s.sec / maxSpk) * 100}%`, background: 'var(--grad-orbit)' }} />
                </span>
                <span className="num whitespace-nowrap text-xs text-silver">
                  {mmss(s.sec)} · {s.n} ch.
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-dim">Speakers are the six team members of the academic project group; the allocation says nothing about who would found a company.</p>
        </section>
      </main>
    </div>
  )
}

function Stat({ label, value, tone = 'text-snow' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-line px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-dim">{label}</div>
      <div className={`num text-xl ${tone}`}>{value}</div>
    </div>
  )
}
