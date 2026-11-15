import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { EvidenceTag, Reveal, StatusPill } from '../ui'
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
