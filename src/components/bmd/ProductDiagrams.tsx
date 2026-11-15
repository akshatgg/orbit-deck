import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, ExternalLink, Layers, Lock, Merge, SlidersHorizontal, Database, type LucideIcon } from 'lucide-react'
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

/* ---------- Present-mode versions ---------- */

const flow: { icon: LucideIcon; label: string; orbit: boolean }[] = [
  { icon: Database, label: 'Sources', orbit: false },
  { icon: Merge, label: 'Normalise', orbit: true },
  { icon: SlidersHorizontal, label: 'Personalise', orbit: true },
  { icon: ExternalLink, label: 'Redirect', orbit: false },
]

function FlowLink({ i }: { i: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative mx-1 h-10 flex-1 sm:mx-2" aria-hidden>
      <div
        className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
        style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.15), rgba(56,189,248,0.55), rgba(139,92,246,0.15))' }}
      />
      <ArrowRight size={18} className="absolute -right-1 top-1/2 -translate-y-1/2 text-cyan/80" />
      {!reduce &&
        [0, 1, 2].map((k) => (
          <motion.span
            key={k}
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan"
            style={{ boxShadow: '0 0 14px 3px rgba(56,189,248,0.7)' }}
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: ['0%', '92%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, delay: k * 0.8 + i * 0.35 }}
          />
        ))}
    </div>
  )
}

/** Four-stage flowing pipeline with particles travelling along the connectors. */
export function FlowPipeline({ show = true }: { show?: boolean }) {
  return (
    <div className="grid w-full grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-center gap-x-2">
      {flow.map((f, i) => {
        const Icon = f.icon
        return (
          <div key={f.label} className="contents">
            <Reveal
              show={show}
              delay={0.1 + i * 0.15}
              className={`flex w-[clamp(120px,15vw,190px)] flex-col items-center gap-3.5 rounded-2xl border px-3 py-8 text-center ${f.orbit ? 'border-violet/60 bg-violet/[0.12] shadow-[0_0_50px_-12px_rgba(139,92,246,0.8)]' : 'border-line bg-navy/80'}`}
            >
              <Icon size={42} className={f.orbit ? 'text-violet-soft' : 'text-silver'} />
              <span className="text-[clamp(1.2rem,1.9vw,1.8rem)] font-semibold leading-none text-snow">{f.label}</span>
            </Reveal>
            {i < flow.length - 1 && <FlowLink i={i} />}
          </div>
        )
      })}
      <Reveal show={show} delay={0.7} className="col-start-3 col-end-6 mt-3 flex items-center gap-3">
        <span className="h-3 flex-1 rounded-b-xl border-x border-b border-violet/60" />
        <span className="flex shrink-0 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-violet-soft">
          <Layers size={14} /> Orbit
        </span>
        <span className="h-3 flex-1 rounded-b-xl border-x border-b border-violet/60" />
      </Reveal>
    </div>
  )
}

const coreChips = ['Accurate coverage', 'Relevant discovery', 'Source transparency', 'Registration redirect']
const futureChips = ['Friend groups', 'Interest communities', 'Social recommendations']

/** Compact core vs future chip groups for the MVP step. */
export function MvpChips({ show = true }: { show?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <Reveal show={show} className="rounded-2xl border border-snow/30 bg-navy/80 p-5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-snow">
          <Lock size={13} /> Core MVP
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {coreChips.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 rounded-full border border-snow/30 bg-white/[0.05] px-4 py-2 text-[clamp(1rem,1.3vw,1.2rem)] font-medium text-snow">
              <Check size={15} className="text-cyan" /> {c}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal show={show} delay={0.2} className="rounded-2xl border border-dashed border-violet/60 bg-violet/[0.06] p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Future hypotheses</span>
          <EvidenceTag label="proposed" text="Proposed" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {futureChips.map((c) => (
            <span key={c} className="rounded-full border border-dashed border-violet/50 px-4 py-2 text-[clamp(1rem,1.3vw,1.2rem)] text-violet-soft">
              {c}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
