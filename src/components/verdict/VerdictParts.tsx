import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Cpu, Handshake, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Accent, Button, EvidenceTag, Logo, Reveal, SplitHeadline, StatusPill, ease } from '../ui'
import { assumptionsFootnote, assumptions, trackerVerdict, type Assumption } from '../../data/assumptions'
import type { EvidenceLabel } from '../../data/evidence'
import { statusMeta } from '../../data/evidence'
import { team } from '../../data/team'

/* ---------- Steps 1–3: know / do not know / should do ---------- */

interface Item {
  text: string
  tag?: EvidenceLabel
}

export const known: Item[] = [
  { text: 'Our research identifies recurring event-discovery friction within the sample.', tag: 'observed' },
  { text: 'A single discovery layer is a plausible response.', tag: 'proposed' },
  { text: 'Imperial provides access to student research and potential institutional conversations.', tag: 'reported' },
  { text: 'The financial model suggests a possible route to viability under stated assumptions.', tag: 'modelled' },
]

export const unknown: string[] = [
  'Whether students will use Orbit repeatedly.',
  'Whether it materially improves verified attendance.',
  'Whether authorised integrations can scale economically.',
  'Whether universities will pay and renew.',
  'Whether the customer acquisition assumptions can be achieved.',
]

export function Column({ title, color, show, delay = 0, children, kicker }: { title: string; color: string; show: boolean; delay?: number; children: React.ReactNode; kicker: string }) {
  return (
    <Reveal show={show} delay={delay} className="h-full">
      <section className="glass flex h-full flex-col rounded-2xl p-5 sm:p-6" style={{ borderTop: `2px solid ${color}` }}>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color }}>
          {kicker}
        </div>
        <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-snow">{title}</h3>
        <div className="mt-4 flex-1">{children}</div>
      </section>
    </Reveal>
  )
}

export function ThreeColumns({ s1, s2, s3 }: { s1: boolean; s2: boolean; s3: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Column kicker="Established, with limits" title="What we know" color="var(--color-ev-observed)" show={s1}>
        <ul className="space-y-3.5">
          {known.map((k) => (
            <li key={k.text} className="text-base leading-snug text-snow">
              {k.tag && <EvidenceTag label={k.tag} className="mb-1" />}
              <div>{k.text}</div>
            </li>
          ))}
        </ul>
      </Column>
      <Column kicker="Open questions" title="What we do not know" color="var(--color-amber)" show={s2}>
        <ul className="space-y-3.5">
          {unknown.map((u) => (
            <li key={u} className="flex gap-3 text-base leading-snug text-snow">
              <span className="num mt-0.5 text-amber">?</span>
              {u}
            </li>
          ))}
        </ul>
      </Column>
      <Column kicker="Proposed next step" title="What we should do" color="var(--color-ev-proposed)" show={s3}>
        <p className="font-serif text-3xl italic leading-tight text-violet-soft sm:text-4xl">Run one paid, measurable university pilot.</p>
        <p className="mt-4 text-[15px] leading-snug text-silver">An 8–12 week pilot with thresholds set in advance, judged on host-verified attendance and a paid renewal rather than clicks or goodwill.</p>
        <div className="mt-3">
          <EvidenceTag label="proposed" />
        </div>
      </Column>
    </div>
  )
}

/* ---------- Step 4: verdict ---------- */

export function VerdictStamp({ show, compact = false }: { show: boolean; compact?: boolean }) {
  return (
    <Reveal show={show}>
      <div>
        <EvidenceTag label="proposed" text="Proposed decision" />
        <div
          className={`mt-3 font-semibold leading-[0.95] tracking-[-0.03em] text-violet-soft ${compact ? 'text-[clamp(2.6rem,6.4vw,5.6rem)]' : 'text-[clamp(2.8rem,8vw,7.5rem)]'}`}
          style={{ textShadow: '0 0 60px rgb(139 92 246 / 0.35)' }}
        >
          CONDITIONAL GO
        </div>
        <p className="mt-3 font-serif text-[clamp(1.25rem,2.4vw,2.2rem)] italic leading-tight text-snow">Pursue the next experiment, not the entire expansion plan.</p>
      </div>
    </Reveal>
  )
}

const roles = [
  { id: 'tech', title: 'Technical owner', body: 'Integrations, product reliability and data governance.' },
  { id: 'comm', title: 'Commercial owner', body: 'Institutional sales, procurement and customer success.' },
]

export function WhoPursues({ show }: { show: boolean }) {
  const names = Object.values(team)
  return (
    <Reveal show={show} delay={0.15}>
      <div className="glass rounded-2xl p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Who should pursue it</div>
        <p className="mt-1.5 text-[15px] leading-snug text-silver">A complementary founding team with clear ownership on both sides.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {roles.map((r) => (
            <div key={r.id} className="rounded-xl border border-dashed border-ev-proposed/50 bg-ev-proposed/5 p-3.5">
              <div className="text-lg font-semibold text-snow">{r.title}</div>
              <p className="mt-1 text-[15px] leading-snug text-silver">{r.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">Proposed operating-company structure · two roles, unnamed</p>

        <div className="mt-4 border-t border-line pt-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-silver">Academic project team</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-snow">
            {names.map((n) => (
              <li key={n.name}>{n.name}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs leading-snug text-dim">Six MSc students who carried out this evaluation for the module. This is not the founder structure, and no one is shown here as committing to the operating company.</p>
        </div>
      </div>
    </Reveal>
  )
}

export function TrackerSummary({ show, detail = false }: { show: boolean; detail?: boolean }) {
  const [sel, setSel] = useState<string | null>(null)
  const counts = (['supported', 'inconclusive', 'untested', 'contradicted'] as const)
    .map((k) => ({ k, n: assumptions.filter((a) => a.status === k).length }))
    .filter((c) => c.n > 0)
  const active = assumptions.find((a) => a.id === sel)
  return (
    <Reveal show={show} delay={0.3}>
      <div className="glass rounded-2xl p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Assumption tracker</div>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8" role="group" aria-label="Assumptions A1 to A8">
          {assumptions.map((a) => {
            const c = statusMeta[a.status].color
            const on = sel === a.id
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(on ? null : a.id)
                }}
                className="flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-center transition-colors hover:bg-white/5"
                style={{ borderColor: `color-mix(in srgb, ${c} ${on ? 90 : 45}%, transparent)`, background: `color-mix(in srgb, ${c} ${on ? 16 : 8}%, transparent)` }}
                title={`${a.id} · ${a.claim} (${statusMeta[a.status].label})`}
              >
                <span className="num text-lg font-semibold" style={{ color: c }}>
                  {a.id}
                </span>
                <span className="text-[11px] leading-none text-silver">{statusMeta[a.status].label}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-3 min-h-[2.5rem] text-sm leading-snug text-silver" aria-live="polite">
          {active ? (
            <>
              <StatusPill status={active.status} className="mr-2" />
              <span className="text-snow">{active.claim}</span> {active.statusText}.
            </>
          ) : (
            <span>{counts.map((c) => `${c.n} ${statusMeta[c.k].label.toLowerCase()}`).join(' · ')} of {assumptions.length}.{detail ? ' Select a chip for detail.' : ''}</span>
          )}
        </div>
        <p className="mt-1 font-serif text-xl italic text-snow">{trackerVerdict}</p>
      </div>
    </Reveal>
  )
}

/* ---------- Step 5: return to the question ---------- */

export function Finale({ openingQuestion, closing }: { openingQuestion: string; closing: string }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
      <div className="grid w-full items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <div className="text-left lg:text-right">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">The beginning</div>
          <p className="mt-2 text-[clamp(1.2rem,2vw,1.9rem)] leading-snug text-silver">{openingQuestion}</p>
        </div>
        <ArrowRight className="mx-auto rotate-90 text-violet-soft lg:rotate-0" size={30} aria-hidden />
        <div className="text-left">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">The end</div>
          <p className="mt-2 text-[clamp(1.2rem,2vw,1.9rem)] font-medium leading-snug text-snow">
            We have enough evidence to test whether Orbit can help. <span className="text-violet-soft">Not yet enough evidence to scale.</span>
          </p>
        </div>
      </div>

      <p className="mt-10 max-w-4xl font-serif text-[clamp(1.8rem,3.8vw,3.6rem)] italic leading-[1.1] text-snow">
        Good ventures are not built by believing harder. They are built by learning better.
      </p>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-dim">{closing}</p>
    </div>
  )
}

/* ================= Pass 3: Present-mode components ================= */

/** True a moment after mount, so Reveals inside a freshly mounted view animate in (staggered, no clicks). */
function useEntered(delayMs = 60) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), delayMs)
    return () => window.clearTimeout(t)
  }, [delayMs])
  return on
}

const label = (a: Assumption) => a.statusText.split(':')[0]
const detail = (a: Assumption) => a.statusText.split(':').slice(1).join(':').trim()

function AssumptionRow({ a, show, delay, detailed, stretch }: { a: Assumption; show: boolean; delay: number; detailed: boolean; stretch?: boolean }) {
  const c = statusMeta[a.status].color
  return (
    <Reveal show={show} delay={delay} className={stretch ? 'flex-1' : ''}>
      <div
        className="flex h-full items-center gap-4 rounded-2xl border px-4 py-2.5 sm:px-5"
        style={{
          borderColor: `color-mix(in srgb, ${c} 38%, transparent)`,
          background: `linear-gradient(90deg, color-mix(in srgb, ${c} 13%, transparent), color-mix(in srgb, ${c} 3%, transparent))`,
          boxShadow: `inset 3px 0 0 ${c}`,
        }}
      >
        <span className="num w-11 shrink-0 text-[clamp(1.35rem,2vw,1.9rem)] font-semibold leading-none" style={{ color: c, textShadow: `0 0 22px color-mix(in srgb, ${c} 55%, transparent)` }}>
          {a.id}
        </span>
        <div className="min-w-0">
          <div className="text-[clamp(1.1rem,1.65vw,1.55rem)] font-semibold leading-tight tracking-tight text-snow">{a.title}</div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[clamp(0.9rem,1.1vw,1.05rem)] leading-snug">
            <span className="font-semibold" style={{ color: c }}>
              {label(a)}
            </span>
            {detailed && detail(a) && <span className="text-silver">{detail(a)}</span>}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function ColumnHead({ title, n, color }: { title: string; n: number; color: string }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-3 border-b pb-2" style={{ borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }}>
      <h3 className="text-[clamp(1.15rem,1.7vw,1.6rem)] font-semibold tracking-tight text-snow">{title}</h3>
      <span className="num shrink-0 font-mono text-sm" style={{ color }}>
        {n} of {assumptions.length}
      </span>
    </div>
  )
}

/**
 * The report's "Orbit's business model has 8 key assumptions" slide: evidence gathered versus
 * untested. Present mode staggers the rows in on arrival (≈1.2 s); no extra clicks.
 */
export function AssumptionsSlide({ animate = false }: { animate?: boolean }) {
  const entered = useEntered()
  const show = animate ? entered : true
  const ev = assumptions.filter((a) => a.group === 'evidence')
  const pilot = assumptions.filter((a) => a.group === 'pilot')
  const imperial = pilot.filter((a) => a.imperial)
  const rest = pilot.filter((a) => !a.imperial)
  const untestedColor = statusMeta.untested.color
  let k = 0
  const d = () => 0.05 + 0.075 * k++
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
      <section aria-label="Evidence gathered" className="flex flex-col">
        <ColumnHead title="Evidence gathered" n={ev.length} color="var(--color-st-supported)" />
        <div className="flex flex-1 flex-col gap-2.5">
          {ev.map((a) => (
            <AssumptionRow key={a.id} a={a} show={show} delay={d()} detailed stretch />
          ))}
        </div>
      </section>

      <section aria-label="Untested: pilot evidence needed" className="flex flex-col">
        <ColumnHead title="Untested: pilot evidence needed" n={pilot.length} color={untestedColor} />
        <div className="flex flex-col gap-2.5">
          {/* A3 and A4 are grouped together: explored with Imperial, still to be validated */}
          <div className="relative mt-2 flex flex-col gap-2.5 rounded-[1.25rem] border-2 border-dashed border-ev-proposed/60 bg-ev-proposed/[0.04] p-2.5 pt-4">
            <Reveal show={show} delay={0.05 + 0.075 * k} className="absolute -top-3 left-5">
              <span className="inline-block rounded-full border border-ev-proposed/60 bg-ink px-3 py-0.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-violet-soft">Partially tested with Imperial</span>
            </Reveal>
            {imperial.map((a) => (
              <AssumptionRow key={a.id} a={a} show={show} delay={d()} detailed={false} />
            ))}
          </div>
          {rest.map((a) => (
            <AssumptionRow key={a.id} a={a} show={show} delay={d()} detailed={false} />
          ))}
        </div>
      </section>

      <Reveal show={show} delay={0.05 + 0.075 * 9} className="lg:col-span-2">
        <p className="flex items-start gap-2 text-[clamp(0.9rem,1.05vw,1.05rem)] leading-snug text-silver">
          <Info size={15} className="mt-[3px] shrink-0 text-dim" aria-hidden />
          <span>{assumptionsFootnote}</span>
        </p>
      </Reveal>
    </div>
  )
}

/** Step 1 hero: the biggest moment of the deck. */
export function VerdictHero() {
  const reduce = useReducedMotion()
  return (
    <div className="relative w-full text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[min(1100px,95%)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(139 92 246 / 0.32), rgb(139 92 246 / 0.08) 60%, transparent)' }}
      />
      <div className="relative flex flex-col items-center">
        <EvidenceTag label="proposed" text="Proposed decision" />
        <motion.div
          className="mt-4 text-[clamp(3rem,9.4vw,9.5rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-violet-soft"
          initial={false}
          animate={reduce ? { textShadow: '0 0 60px rgb(139 92 246 / 0.6)' } : { textShadow: ['0 0 40px rgb(139 92 246 / 0.45)', '0 0 90px rgb(139 92 246 / 0.9)', '0 0 40px rgb(139 92 246 / 0.45)'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <SplitHeadline text="CONDITIONAL GO" delay={0.15} />
        </motion.div>
        <Reveal delay={0.55} className="mt-4">
          <p className="font-serif text-[clamp(1.3rem,2.5vw,2.3rem)] italic leading-tight text-snow">One paid, measurable pilot before wider expansion.</p>
        </Reveal>
      </div>
    </div>
  )
}

const owners = [
  { icon: Cpu, title: 'Technical owner', body: 'Integrations, reliability, data governance' },
  { icon: Handshake, title: 'Commercial owner', body: 'Institutional sales, procurement, customer success' },
]

/** Step 1: who owns the pilot, compactly — two roles, not all six team members. */
export function OwnersCompact() {
  return (
    <Reveal delay={0.7}>
      <div className="mx-auto max-w-3xl text-left">
        <div className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Who owns it</div>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
          {owners.map((o) => (
            <div key={o.title} className="flex items-start gap-3 rounded-2xl border border-dashed border-ev-proposed/60 bg-ev-proposed/5 px-4 py-3">
              <o.icon size={22} className="mt-0.5 shrink-0 text-ev-proposed" />
              <div>
                <div className="text-lg font-semibold leading-tight text-snow">{o.title}</div>
                <p className="mt-0.5 text-[15px] leading-snug text-silver">{o.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-dim">Proposed structure · two roles, not all six team members</p>
      </div>
    </Reveal>
  )
}

/** Step 2: return to the opening question and answer it. Static: no timers, staggered in over ~1.3 s. */
export function FinaleStatic({ openingQuestion, onEvidence, tagline }: { openingQuestion: string; onEvidence: () => void; tagline: string }) {
  const entered = useEntered()
  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      <Reveal show={entered}>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">The question we started with</div>
        <p className="mt-3 font-serif text-[clamp(1.6rem,3vw,3rem)] italic leading-[1.15] text-silver">{openingQuestion}</p>
      </Reveal>
      <Reveal show={entered} delay={0.15} className="my-5">
        <ArrowRight className="rotate-90 text-violet-soft" size={30} aria-hidden />
      </Reveal>
      <p className="text-[clamp(2rem,4.8vw,4.8rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-snow">
        <SplitHeadline text="We started believing in an idea." show={entered} delay={0.2} />
        <br />
        <SplitHeadline text="*We finish knowing how to test it.*" show={entered} delay={0.5} />
      </p>
      <Reveal show={entered} delay={0.8} className="mt-5">
        <p className="text-[clamp(1.1rem,1.6vw,1.6rem)] text-silver">
          Enough evidence to test. <Accent>Not yet to scale.</Accent>
        </p>
      </Reveal>
      <Reveal show={entered} delay={0.95} className="mt-7 flex flex-col items-center gap-3">
        <span className="rounded-full" style={{ filter: 'drop-shadow(0 0 22px rgb(139 92 246 / 0.9)) drop-shadow(0 0 50px rgb(56 189 248 / 0.4))' }}>
          <Logo size={48} />
        </span>
        <p className="text-[clamp(1.1rem,1.6vw,1.6rem)] text-snow">{tagline}</p>
        <Button size="lg" onClick={onEvidence}>
          Explore our evidence <ArrowRight size={18} />
        </Button>
      </Reveal>
    </div>
  )
}
