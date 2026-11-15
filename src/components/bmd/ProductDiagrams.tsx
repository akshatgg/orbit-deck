import { ArrowDown, ArrowRight, Layers, Lock } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { EvidenceTag, Reveal } from '../ui'

function Node({ title, sub, accent = false, className = '' }: { title: ReactNode; sub?: string; accent?: boolean; className?: string }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${accent ? 'border-violet/50 bg-violet/10' : 'border-line bg-navy/80'} ${className}`}>
      <div className="text-base font-semibold leading-snug text-snow">{title}</div>
      {sub && <div className="mt-1 text-[14px] leading-snug text-silver">{sub}</div>}
    </div>
  )
}

const Arrow = () => (
  <>
    <ArrowRight className="hidden shrink-0 text-dim lg:block" size={22} aria-hidden />
    <ArrowDown className="shrink-0 self-center text-dim lg:hidden" size={20} aria-hidden />
  </>
)

/** Product architecture: sources → normalise → personalise → redirect. Orbit is a discovery layer. */
export function ArchitectureDiagram({ show = true, compact = false }: { show?: boolean; compact?: boolean }) {
  return (
    <div>
      <Reveal show={show} className="flex flex-wrap items-center gap-2">
        <span className="t-kicker">Intended design</span>
        <EvidenceTag label="proposed" text="Design, no live integrations" />
      </Reveal>
      <div className="mt-3 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        <Reveal show={show} delay={0.05} className="flex flex-col gap-2.5 lg:w-[24%]">
          <Node title="Authorised university sources" sub="Careers, events calendars, society channels" />
          <Node title="Authorised external sources" sub="Public event platforms" />
        </Reveal>
        <Reveal show={show} delay={0.15} className="contents">
          <Arrow />
        </Reveal>
        <Reveal show={show} delay={0.25} className="lg:w-[20%]">
          <Node title="Normalise and deduplicate event data" sub="One consistent record per event, with its source kept" accent />
        </Reveal>
        <Reveal show={show} delay={0.35} className="contents">
          <Arrow />
        </Reveal>
        <Reveal show={show} delay={0.45} className="lg:w-[20%]">
          <Node title="Personalise discovery" sub="Interests, formats, availability" accent />
        </Reveal>
        <Reveal show={show} delay={0.55} className="contents">
          <Arrow />
        </Reveal>
        <Reveal show={show} delay={0.65} className="lg:w-[20%]">
          <Node title="Redirect to organiser" sub="The original registration page" />
        </Reveal>
      </div>

      <Reveal show={show} delay={0.8} className={compact ? 'mt-4' : 'mt-6'}>
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-silver/40 px-4 py-3 lg:flex-row lg:items-center">
          <span className="flex items-center gap-2 text-base font-semibold text-snow lg:w-[24%]">
            <Layers size={18} className="text-violet-soft" /> Orbit is a discovery layer.
          </span>
          <p className="text-base leading-snug text-silver">
            It does not initially replace{' '}
            {['university careers platforms', 'event registration systems', 'ticketing providers'].map((x, i, a) => (
              <Fragment key={x}>
                <b className="font-medium text-snow">{x}</b>
                {i < a.length - 2 ? ', ' : i === a.length - 2 ? ' or ' : '.'}
              </Fragment>
            ))}
          </p>
        </div>
      </Reveal>
    </div>
  )
}

const core = ['Accurate event coverage', 'Relevant discovery', 'Source transparency', 'Original registration redirect']
const future = ['Friend groups', 'Interest communities', 'Advanced social recommendations']

/** Core MVP (solid) vs future hypotheses (violet, dashed, PROPOSED, not validated). */
export function MvpBoundary({ show = true }: { show?: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <Reveal show={show} className="rounded-2xl border border-snow/30 bg-navy/90 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="t-kicker !text-snow">Core MVP</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-silver">
            <Lock size={12} /> In scope for the pilot
          </span>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {core.map((c) => (
            <li key={c} className="rounded-lg border border-line bg-white/[0.03] px-3.5 py-2.5 text-base font-medium text-snow">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal show={show} delay={0.2} className="rounded-2xl border border-dashed border-violet/60 bg-violet/[0.06] p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="t-kicker">Future hypotheses</span>
          <EvidenceTag label="proposed" text="Proposed, not validated" />
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {future.map((c) => (
            <li key={c} className="rounded-lg border border-dashed border-violet/40 px-3.5 py-2.5 text-base text-violet-soft">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

export const mvpEndLine = 'Our MVP is designed to test whether students discover opportunities more effectively, not to maximise the number of features.'
