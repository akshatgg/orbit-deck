import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, FlaskConical } from 'lucide-react'
import { useState } from 'react'
import { chapterIndex, chapters } from '../../data/chapters'
import { statusMeta, type Status } from '../../data/evidence'
import { assumptions, assumptionsFootnote, trackerVerdict, type Assumption } from '../../data/assumptions'
import { EvidenceTag, StatusPill } from '../ui'

interface Props {
  /** Present mode: assumptions whose chapter has not been reached show as "Not yet discussed". */
  currentChapterIdx?: number
  /** Explore mode: also render the questions → evidence timeline. */
  full?: boolean
  /** Called instead of following chapter links (lets a side panel close itself). */
  onGoChapter?: (slug: string) => void
}

const GROUPS = [
  { key: 'evidence', title: 'Evidence gathered' },
  { key: 'pilot', title: 'Untested: pilot evidence needed' },
] as const

const ORDER: Status[] = ['supported', 'inconclusive', 'untested', 'contradicted']
const PROPOSED = 'var(--color-ev-proposed)'

export function AssumptionTracker({ currentChapterIdx, full = false, onGoChapter }: Props) {
  const all = currentChapterIdx === undefined
  const isReached = (a: Assumption) => all || chapterIndex(a.chapter) <= (currentChapterIdx ?? 0)
  const total = assumptions.length
  const counts = ORDER.map((s) => ({ s, n: assumptions.filter((a) => isReached(a) && a.status === s).length })).filter((c) => c.n > 0)
  const hidden = assumptions.filter((a) => !isReached(a)).length
  const supported = assumptions.filter((a) => isReached(a) && a.status === 'supported').length

  return (
    <div className="w-full">
      {/* summary bar — never a full-green bar: untested / inconclusive stay visible */}
      <div>
        <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label={`${supported} of ${total} critical assumptions supported`}>
          {counts.map((c) => (
            <div key={c.s} style={{ flex: c.n, background: statusMeta[c.s].color }} title={`${statusMeta[c.s].label}: ${c.n}`} />
          ))}
          {hidden > 0 && <div style={{ flex: hidden }} className="bg-white/10" title={`Not yet discussed: ${hidden}`} />}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-silver">
          {counts.map((c) => (
            <li key={c.s} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: statusMeta[c.s].color }} />
              <span className="num text-snow">{c.n}</span> {statusMeta[c.s].label.toLowerCase()}
            </li>
          ))}
          {hidden > 0 && (
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="num text-snow">{hidden}</span> not yet discussed
            </li>
          )}
        </ul>
        <p className="mt-3 text-sm font-medium text-snow">
          <span className="num text-silver">{supported} of {total}</span> critical assumptions supported. {trackerVerdict}
        </p>
      </div>

      {full && <Timeline />}

      {GROUPS.map((g) => {
        const list = assumptions.filter((a) => a.group === g.key)
        return (
          <section key={g.key} className="mt-6" aria-label={g.title}>
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
              <h3 className="text-base font-semibold tracking-tight text-snow">{g.title}</h3>
              <span className="num font-mono text-xs text-dim">{list.length} of {total}</span>
            </div>
            <ul className={`gap-3 ${full ? 'grid lg:grid-cols-2' : 'space-y-3'}`}>
              {list.map((a) => (
                <AssumptionRow key={a.id} a={a} reached={isReached(a)} onGoChapter={onGoChapter} />
              ))}
            </ul>
            {g.key === 'pilot' && <p className="mt-3 text-xs leading-snug text-dim">{assumptionsFootnote}</p>}
          </section>
        )
      })}
    </div>
  )
}

function AssumptionRow({ a, reached, onGoChapter }: { a: Assumption; reached: boolean; onGoChapter?: (slug: string) => void }) {
  const [open, setOpen] = useState(false)
  const m = statusMeta[a.status]
  const ch = chapters.find((c) => c.slug === a.chapter)

  if (!reached) {
    return (
      <li className="rounded-2xl border border-dashed border-line p-4 opacity-60">
        <div className="flex items-start gap-3">
          <span className="num mt-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-dim">{a.id}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug text-silver">{a.title}</p>
            <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Not yet discussed</p>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="self-start rounded-2xl border bg-navy/60" style={{ borderColor: `color-mix(in srgb, ${m.color} 28%, transparent)` }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} data-no-nav className="flex w-full items-start gap-3 p-4 text-left">
        <span className="num mt-0.5 rounded-md px-1.5 py-0.5 text-xs" style={{ color: m.color, background: `color-mix(in srgb, ${m.color} 12%, transparent)` }}>
          {a.id}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-snow">{a.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={a.status} />
            <span className="text-xs leading-snug text-silver">{a.statusText.split(': ').slice(1).join(': ')}</span>
          </div>
        </div>
        <ChevronDown size={16} className={`mt-1 shrink-0 text-dim transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="space-y-3 border-t border-line px-4 pb-4 pt-3 text-sm leading-relaxed">
              <p className="text-snow">{a.claim}</p>
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Evidence so far</div>
                <p className="mt-1 text-snow/90">{a.evidence}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">
                  Next test <EvidenceTag label="proposed" />
                </div>
                <p className="mt-1 text-snow/90">{a.nextTest}</p>
              </div>
              {ch && (
                <a
                  href={`#/present/${ch.slug}`}
                  onClick={(e) => {
                    if (onGoChapter) {
                      e.preventDefault()
                      onGoChapter(ch.slug)
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-violet-soft hover:text-snow"
                >
                  Chapter {ch.num}: {ch.navLabel} <ArrowRight size={13} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/* ---------------- questions → evidence timeline (full mode) ---------------- */

const PHASES = [
  { key: 'q', title: 'Questions asked', sub: 'Screening · Weeks 1–2', color: '#38bdf8' },
  { key: 'e', title: 'Evidence gathered', sub: 'Discovery · Week 3', color: '#60a5fa' },
  { key: 'h', title: 'Hypotheses formed', sub: 'Business model design', color: '#a78bfa' },
  { key: 'x', title: 'Engagement & critique', sub: 'Validation · Weeks 6–8', color: '#c084fc' },
  { key: 'p', title: 'Proposed pilot', sub: 'Not yet run', color: '#a78bfa', proposed: true },
] as const

/** Assumptions only the pilot can test (repeat use, attendance): shown as proposed, not yet run. */
const pilotOnly = (a: Assumption) => a.chapter === 'gates'

/** Which phase an assumption was first addressed in (all eight begin as questions in phase 0). */
function phaseOf(a: Assumption): number {
  if (pilotOnly(a)) return 4
  const c = chapters.find((x) => x.slug === a.chapter)
  if (!c) return 1
  return c.stage === 'ideation' ? 0 : c.stage === 'discovery' ? 1 : c.stage === 'bmd' ? 2 : 3
}

function Timeline() {
  return (
    <section className="mt-8" aria-label="From asking questions to obtaining evidence">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">From asking questions to obtaining evidence</h3>
      <p className="mt-2 max-w-3xl text-sm text-silver">
        Every assumption starts as a question. The marker shows the stage where it was first tested against something, coloured by how strong the evidence is today. Only A1 reached a supported state; A6 and A7 can only be tested in the pilot, which has not run.
      </p>

      {/* desktop swimlane */}
      <div className="mt-5 hidden overflow-hidden rounded-2xl border border-line md:block">
        <div className="grid grid-cols-[minmax(150px,1.1fr)_repeat(5,minmax(0,1fr))] bg-navy/70 text-center">
          <div />
          {PHASES.map((p, i) => (
            <div key={p.key} className={`relative px-2 py-3 ${'proposed' in p ? 'border-l border-dashed border-violet/40' : 'border-l border-line'}`}>
              <div className="text-[13px] font-medium" style={{ color: p.color }}>
                {i + 1}. {p.title}
              </div>
              <div className="mt-0.5 text-[11px] text-dim">{p.sub}</div>
            </div>
          ))}
        </div>
        {assumptions.map((a) => {
          const at = phaseOf(a)
          const col = pilotOnly(a) ? PROPOSED : statusMeta[a.status].color
          return (
            <div key={a.id} className="grid grid-cols-[minmax(150px,1.1fr)_repeat(5,minmax(0,1fr))] items-center border-t border-line">
              <div className="px-3 py-3 text-xs leading-snug text-silver">
                <span className="num mr-1.5 text-snow">{a.id}</span>
                {a.title}
              </div>
              {PHASES.map((p, i) => (
                <div key={p.key} className="relative grid h-12 place-items-center border-l border-line/60">
                  {/* connecting line from the question to the first test */}
                  {i > 0 && i < at && <span className="absolute inset-x-0 top-1/2 h-px" style={{ background: `color-mix(in srgb, ${col} 55%, transparent)` }} />}
                  {i === 0 && at > 0 && <span className="absolute left-1/2 right-0 top-1/2 h-px" style={{ background: `color-mix(in srgb, ${col} 55%, transparent)` }} />}
                  {i === at && at > 0 && <span className="absolute left-0 right-1/2 top-1/2 h-px" style={{ background: `color-mix(in srgb, ${col} 55%, transparent)` }} />}
                  {i === 0 ? (
                    <span className="relative h-3.5 w-3.5 rounded-full border-2 bg-ink" style={{ borderColor: 'rgb(148 163 184 / 0.7)' }} title="Started as a question" />
                  ) : i === at ? (
                    <span
                      className="relative grid h-6 w-6 place-items-center rounded-full"
                      style={{
                        border: `2px ${pilotOnly(a) ? 'dashed' : 'solid'} ${col}`,
                        background: pilotOnly(a) ? 'transparent' : `color-mix(in srgb, ${col} 25%, #080d1a)`,
                      }}
                      title={`${a.id}: ${pilotOnly(a) ? 'proposed, not yet run' : statusMeta[a.status].label}`}
                    >
                      {pilotOnly(a) && <FlaskConical size={11} style={{ color: col }} />}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* mobile: stacked phases */}
      <ol className="mt-5 space-y-3 md:hidden">
        {PHASES.map((p, i) => {
          const here = assumptions.filter((a) => phaseOf(a) === i)
          return (
            <li key={p.key} className={`rounded-xl border p-3 ${'proposed' in p ? 'border-dashed border-violet/40' : 'border-line'}`}>
              <div className="text-sm font-medium" style={{ color: p.color }}>
                {i + 1}. {p.title} <span className="text-xs font-normal text-dim">· {p.sub}</span>
              </div>
              {i === 0 ? (
                <p className="mt-1.5 text-xs text-silver">All eight assumptions begin here as questions.</p>
              ) : here.length === 0 ? (
                <p className="mt-1.5 text-xs text-dim">No assumption first tested at this stage.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {here.map((a) => {
                    const col = pilotOnly(a) ? PROPOSED : statusMeta[a.status].color
                    return (
                      <span key={a.id} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-snow" style={{ border: `1.5px ${pilotOnly(a) ? 'dashed' : 'solid'} ${col}` }}>
                        <span className="num" style={{ color: col }}>{a.id}</span>
                        {pilotOnly(a) ? 'proposed' : statusMeta[a.status].label.toLowerCase()}
                      </span>
                    )
                  })}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
