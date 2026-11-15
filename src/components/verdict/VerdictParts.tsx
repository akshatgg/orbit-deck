import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Cpu, Handshake, HelpCircle, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Accent, Button, EvidenceTag, Logo, Reveal, SplitHeadline, StatusPill, ease } from '../ui'
import { assumptions, trackerVerdict } from '../../data/assumptions'
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
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Assumptions A1 to A6">
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

/* ================= Pass 2: Present-mode pitch components ================= */

const punchKnown: Item[] = [
  { text: 'Discovery friction is real in our sample', tag: 'observed' },
  { text: 'One discovery layer looks plausible', tag: 'proposed' },
  { text: 'Imperial opens research access', tag: 'reported' },
  { text: 'A route to viability, on paper', tag: 'modelled' },
]
const punchUnknown = ['Will students come back?', 'Does it lift verified attendance?', 'Can integrations scale economically?', 'Will universities pay and renew?']
const punchDo = [
  { icon: Timer, text: '8–12 week pilot' },
  { icon: Check, text: 'Thresholds set in advance' },
  { icon: Check, text: 'Verified attendance, paid renewal' },
]
const punchText = 'text-[clamp(1.1rem,1.5vw,1.5rem)] leading-snug text-snow'

/** Steps 1–3 in Present mode: short punchy lines, max 4 per column. */
export function ThreeColumnsPunchy({ s1, s2, s3 }: { s1: boolean; s2: boolean; s3: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Column kicker="Established, with limits" title="What we know" color="var(--color-ev-observed)" show={s1}>
        <ul className="space-y-2.5">
          {punchKnown.map((k, i) => (
            <Reveal as="li" key={k.text} show={s1} delay={0.15 + i * 0.1} className={punchText}>
              {k.tag && <EvidenceTag label={k.tag} className="mb-1" />}
              <div>{k.text}</div>
            </Reveal>
          ))}
        </ul>
      </Column>
      <Column kicker="Open questions" title="What we do not know" color="var(--color-amber)" show={s2}>
        <ul className="space-y-3">
          {punchUnknown.map((u, i) => (
            <Reveal as="li" key={u} show={s2} delay={0.15 + i * 0.1} className={`flex gap-3 ${punchText}`}>
              <HelpCircle size={22} className="mt-1 shrink-0 text-amber" />
              {u}
            </Reveal>
          ))}
        </ul>
      </Column>
      <Column kicker="Proposed next step" title="What we should do" color="var(--color-ev-proposed)" show={s3}>
        <p className="font-serif text-[clamp(1.9rem,3.2vw,3.2rem)] italic leading-[1.05] text-violet-soft" style={{ textShadow: '0 0 40px rgb(139 92 246 / 0.4)' }}>
          Run one paid university pilot.
        </p>
        <ul className="mt-5 space-y-2.5">
          {punchDo.map((d, i) => (
            <Reveal as="li" key={d.text} show={s3} delay={0.3 + i * 0.1} className={`flex items-center gap-3 ${punchText}`}>
              <d.icon size={20} className="shrink-0 text-ev-proposed" />
              {d.text}
            </Reveal>
          ))}
        </ul>
        <div className="mt-4">
          <EvidenceTag label="proposed" />
        </div>
      </Column>
    </div>
  )
}

/** Step 4 hero: the biggest moment of the deck. */
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
        <Reveal delay={0.9} className="mt-4">
          <p className="font-serif text-[clamp(1.3rem,2.5vw,2.3rem)] italic leading-tight text-snow">Pursue the next experiment, not the expansion plan.</p>
        </Reveal>
      </div>
    </div>
  )
}

/** Step 4: compact team + roles. */
export function TeamRolesCompact() {
  const names = Object.values(team)
  const roleList = [
    { icon: Cpu, title: 'Technical owner' },
    { icon: Handshake, title: 'Commercial owner' },
  ]
  return (
    <Reveal delay={1.1} className="h-full">
      <div className="glass flex h-full flex-col rounded-2xl p-4 text-left">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Who should pursue it</div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {roleList.map((r) => (
            <span key={r.title} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-ev-proposed/60 bg-ev-proposed/5 px-3 py-2 text-lg font-semibold text-snow">
              <r.icon size={18} className="text-ev-proposed" /> {r.title}
            </span>
          ))}
        </div>
        <p className="mt-2.5 text-[13px] leading-snug text-silver">{names.map((n) => n.short).join(' · ')}</p>
        <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-dim">Academic team · not the founder structure · roles unnamed</p>
      </div>
    </Reveal>
  )
}

/** Step 4: A1–A6 as status chips. */
export function AssumptionChips() {
  const [sel, setSel] = useState<string | null>(null)
  const active = assumptions.find((a) => a.id === sel)
  return (
    <Reveal delay={1.25} className="h-full">
      <div className="glass flex h-full flex-col rounded-2xl p-4 text-left">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Assumption tracker</div>
        <div className="mt-2.5 grid grid-cols-6 gap-2" role="group" aria-label="Assumptions A1 to A6">
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
                className="lift flex flex-col items-center gap-0.5 rounded-xl border px-1 py-1.5"
                style={{ borderColor: `color-mix(in srgb, ${c} ${on ? 90 : 45}%, transparent)`, background: `color-mix(in srgb, ${c} ${on ? 18 : 8}%, transparent)` }}
                title={`${a.id} · ${a.claim} (${statusMeta[a.status].label})`}
              >
                <span className="num text-lg font-semibold" style={{ color: c }}>{a.id}</span>
                <span className="text-[10.5px] leading-none text-silver">{statusMeta[a.status].label}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 min-h-[2.4rem] text-[13.5px] leading-snug text-silver" aria-live="polite">
          {active ? (
            <>
              <span className="text-snow">{active.claim}</span> {active.statusText}.
            </>
          ) : (
            <span className="font-serif text-lg italic text-snow">{trackerVerdict}</span>
          )}
        </div>
      </div>
    </Reveal>
  )
}

/** Step 5: cinematic finale — question fades to the answer, then the closing line, logo and call to action. */
export function FinaleCinematic({ openingQuestion, onEvidence, tagline }: { openingQuestion: string; onEvidence: () => void; tagline: string }) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(reduce ? 2 : 0)
  useEffect(() => {
    if (reduce) {
      setPhase(2)
      return
    }
    const t1 = window.setTimeout(() => setPhase(1), 2800)
    const t2 = window.setTimeout(() => setPhase(2), 5600)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [reduce])
  const fade = { initial: { opacity: 0, y: 16, filter: 'blur(10px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -14, filter: 'blur(10px)', transition: { duration: 0.4, ease } }, transition: { duration: 0.9, ease } }
  return (
    <div className="relative mx-auto flex min-h-[420px] w-full max-w-5xl flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait" initial={false}>
        {phase === 0 && (
          <motion.div key="q" {...fade}>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">The question we started with</div>
            <p className="mt-4 font-serif text-[clamp(2rem,4.2vw,4.2rem)] italic leading-[1.1] text-silver">{openingQuestion}</p>
          </motion.div>
        )}
        {phase === 1 && (
          <motion.div key="a" {...fade}>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-soft">Where we are now</div>
            <p className="mt-4 text-[clamp(2rem,4.6vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-snow">
              Enough evidence to test. <Accent>Not yet to scale.</Accent>
            </p>
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div key="end" {...fade} className="flex flex-col items-center">
            <p className="text-[clamp(1.6rem,3.2vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-snow">
              <SplitHeadline text="Good ventures are not built by believing harder." />
            </p>
            <p className="mt-2 text-[clamp(1.9rem,4.2vw,4.2rem)] leading-[1.1]">
              <SplitHeadline text="*They are built by learning better.*" delay={0.5} />
            </p>
            <Reveal delay={1.3} className="mt-9 flex flex-col items-center gap-3">
              <span className="rounded-full" style={{ filter: 'drop-shadow(0 0 22px rgb(139 92 246 / 0.9)) drop-shadow(0 0 50px rgb(56 189 248 / 0.4))' }}>
                <Logo size={52} />
              </span>
              <p className="text-[clamp(1.2rem,1.8vw,1.7rem)] text-snow">{tagline}</p>
            </Reveal>
            <Reveal delay={1.6} className="mt-5">
              <Button size="lg" onClick={onEvidence}>
                Explore our evidence <ArrowRight size={18} />
              </Button>
            </Reveal>
          </motion.div>
        )}
      </AnimatePresence>
      {phase < 2 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setPhase(2)
          }}
          className="absolute bottom-0 right-0 rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim hover:text-snow"
        >
          Skip intro
        </button>
      )}
    </div>
  )
}
