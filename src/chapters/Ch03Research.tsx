import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ClipboardList, MessagesSquare, ShieldAlert, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge, Card, CountUp, Expandable, Kicker, Reveal, SourceNote, SplitHeadline, Stage, StatusPill, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { interviewThemes, interviews, limitations, methodologyLabel, survey } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'research')!

const toneColor: Record<string, string> = {
  amber: '#ffb547',
  violet: '#8066ff',
  blue: '#3b82f6',
  silver: '#9ca9bc',
  cyan: '#3de0ea',
  peach: '#ffa36b',
}
const OFF = 'rgba(156,169,188,0.13)'

type SurveyId = (typeof survey.findings)[number]['id']
type InterviewId = (typeof interviews.findings)[number]['id']
const interviewTone: Record<InterviewId, string> = { late: 'amber', friends: 'cyan', 'another-app': 'peach' }

const SOURCE = 'Source: R1 — Orbit team New Venture Creation report. Student survey n = 42; qualitative interviews n = 13.'

/* ---------------------------------------------------------------- */

function SourceCards({ big = true }: { big?: boolean }) {
  const items = [
    { icon: ClipboardList, label: survey.label, n: survey.n, sub: 'Survey responses on recent event discovery' },
    { icon: MessagesSquare, label: interviews.label, n: interviews.n, sub: 'Interviews on how students find events' },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <Reveal key={it.label} delay={0.35 + i * 0.12} className="h-full">
          <Card className={`h-full ${big ? 'p-7' : 'p-5'}`} glow={i === 0}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-silver">
                  <it.icon size={18} />
                  <span className="text-base">{it.label}</span>
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-mono text-lg text-dim">n =</span>
                  <CountUp value={it.n} className={`${big ? 'text-7xl' : 'text-5xl'} font-semibold text-snow`} />
                </div>
                <p className="mt-3 max-w-sm text-base text-silver">{it.sub}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  )
}

function MethodLabel() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-silver">
      <AlertTriangle size={15} className="text-amber" />
      {methodologyLabel}
    </div>
  )
}

/* ---------------- Survey: 42-dot grid ---------------- */

function SurveyGrid({ active, lit, dot = 40 }: { active: SurveyId; lit: boolean; dot?: number }) {
  const f = survey.findings.find((x) => x.id === active)!
  const color = toneColor[f.tone]
  return (
    <div className="grid w-fit grid-cols-7 gap-2.5" role="img" aria-label={`${f.value} of ${f.of} ${f.text}`}>
      {Array.from({ length: survey.n }, (_, i) => {
        const on = lit && i < f.value
        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: dot, height: dot }}
            initial={false}
            animate={{ backgroundColor: on ? color : OFF, scale: on ? 1 : 0.86, boxShadow: on ? `0 0 18px -4px ${color}` : '0 0 0 0 rgba(0,0,0,0)' }}
            transition={{ duration: 0.45, ease, delay: on ? i * 0.022 : (survey.n - i) * 0.006 }}
          />
        )
      })}
    </div>
  )
}

function SurveyPanel({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<SurveyId>('missed')
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLit(true), 250)
    return () => clearTimeout(t)
  }, [])
  const f = survey.findings.find((x) => x.id === active)!
  const color = toneColor[f.tone]
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-14">
      <div>
        <SurveyGrid active={active} lit={lit} dot={compact ? 32 : 40} />
        <div className="mt-5 flex items-baseline gap-3">
          <span className="num text-6xl font-semibold" style={{ color }}>
            <CountUp key={active} value={f.value} duration={0.9} />
          </span>
          <span className="num text-2xl text-silver">of {f.of}</span>
        </div>
        <p className="mt-1 max-w-[23rem] text-lg leading-snug text-snow">{f.text}</p>
      </div>
      <div>
        <Kicker className="mb-3">Survey findings · tap to recolour</Kicker>
        <div className="flex flex-col gap-2">
          {survey.findings.map((x) => {
            const on = x.id === active
            const c = toneColor[x.tone]
            return (
              <button
                key={x.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setActive(x.id)
                  setLit(true)
                }}
                aria-pressed={on}
                className={`flex items-center gap-4 rounded-xl border px-4 py-2.5 text-left transition-colors ${on ? 'bg-white/[0.06]' : 'border-line hover:bg-white/[0.03]'}`}
                style={{ borderColor: on ? `color-mix(in srgb, ${c} 55%, transparent)` : undefined }}
              >
                <span className="num w-[5.5rem] shrink-0 text-xl font-semibold" style={{ color: c }}>
                  {x.value}
                  <span className="text-base text-dim"> of {x.of}</span>
                </span>
                <span className={`text-base leading-snug ${on ? 'text-snow' : 'text-silver'}`}>{x.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Interviews: 13 people ---------------- */

function InterviewPanel() {
  const [active, setActive] = useState<InterviewId>('late')
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLit(true), 250)
    return () => clearTimeout(t)
  }, [])
  const f = interviews.findings.find((x) => x.id === active)!
  const color = toneColor[interviewTone[active]]
  const counter = interviews.findings.find((x) => x.id === 'another-app')!
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <div>
        <div className="grid w-fit grid-cols-7 gap-2.5" role="img" aria-label={`${f.value} of ${f.of} interviewees ${f.text}`}>
          {Array.from({ length: interviews.n }, (_, i) => {
            const on = lit && i < f.value
            return (
              <motion.div
                key={i}
                className="grid h-12 w-12 place-items-center rounded-full border"
                initial={false}
                animate={{ backgroundColor: on ? `color-mix(in srgb, ${color} 22%, transparent)` : 'rgba(156,169,188,0.05)', borderColor: on ? color : 'rgba(156,169,188,0.18)', color: on ? color : '#5d6a80' }}
                transition={{ duration: 0.4, ease, delay: on ? i * 0.04 : 0 }}
              >
                <User size={22} />
              </motion.div>
            )
          })}
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="num text-6xl font-semibold" style={{ color }}>
            <CountUp key={active} value={f.value} duration={0.8} />
          </span>
          <span className="num text-2xl text-silver">of {f.of} interviewees</span>
        </div>
        <p className="mt-1 text-lg text-snow">{f.text}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {interviews.findings.map((x) => {
            const on = x.id === active
            const c = toneColor[interviewTone[x.id]]
            return (
              <button
                key={x.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setActive(x.id)
                  setLit(true)
                }}
                aria-pressed={on}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? 'text-snow' : 'border-line text-silver hover:text-snow'}`}
                style={on ? { borderColor: c, background: `color-mix(in srgb, ${c} 14%, transparent)` } : undefined}
              >
                <span className="num font-semibold" style={{ color: c }}>
                  {x.value}/{x.of}
                </span>{' '}
                {x.id === 'late' ? 'late discovery' : x.id === 'friends' ? 'friends influence discovery' : 'wary of another app'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setActive('another-app')
            setLit(true)
          }}
          className="relative overflow-hidden rounded-2xl border p-5 text-left"
          style={{ borderColor: 'rgb(255 163 107 / 0.55)', background: 'linear-gradient(135deg, rgb(255 163 107 / 0.14), rgb(16 23 42 / 0.7))', boxShadow: '0 0 60px -24px rgba(255,163,107,0.8)' }}
        >
          <div className="flex items-center gap-2">
            <Badge tone="amber">
              <ShieldAlert size={11} /> Counter-evidence
            </Badge>
          </div>
          <div className="mt-3 text-2xl font-semibold leading-tight text-snow">
            Another app isn’t <span className="font-serif font-normal italic text-peach">automatically</span> the answer.
          </div>
          <p className="mt-2 text-base text-silver">
            <span className="num font-semibold text-peach">
              {counter.value} of {counter.of}
            </span>{' '}
            interviewees {counter.text}. Orbit has to earn its place.
          </p>
        </button>
        <div>
          <Kicker className="mb-2">Interview themes · qualitative</Kicker>
          <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-white/[0.02]">
            {interviewThemes.map((t) => (
              <li key={t.title} className="px-4 py-2.5">
                <div className="text-base font-medium text-snow">{t.title}</div>
                <div className="text-sm leading-snug text-silver">{t.detail}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Closing line ---------------- */

function Closing({ show }: { show: boolean }) {
  return (
    <div className="mx-auto max-w-6xl text-center">
      <div className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-base text-silver">
        <Reveal show={show} delay={0}>
          <span className="num text-amber">35 of 42</span> missed an event
        </Reveal>
        <Reveal show={show} delay={0.08}>
          <span className="num text-violet-soft">31 of 42</span> too many places
        </Reveal>
        <Reveal show={show} delay={0.16}>
          <span className="num text-lavender">12 of 13</span> late discovery
        </Reveal>
      </div>
      <h3 className="t-display">
        <SplitHeadline text="The problem has evidence." show={show} delay={0.25} />
      </h3>
      <motion.div
        initial={false}
        animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease, delay: show ? 0.9 : 0 }}
        className="mx-auto my-6 h-px w-2/3 origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(183,168,255,0.6), transparent)' }}
      />
      <h3 className="t-display font-serif font-normal italic">
        <span className="text-gradient-warm">
          <SplitHeadline text="The business still needs validation." show={show} delay={1.2} />
        </span>
      </h3>
      <Reveal show={show} delay={1.9} className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="text-base text-silver">Student problem</span>
        <StatusPill status="supported" />
        <span className="mx-3 h-5 w-px bg-line" />
        <span className="text-base text-silver">Institutional willingness to pay</span>
        <StatusPill status="untested" />
        <span className="text-sm text-dim">Not yet validated</span>
      </Reveal>
    </div>
  )
}

/* ---------------- Limitations ---------------- */

function LimitationsList() {
  return (
    <ul className="flex flex-col gap-3">
      {limitations.map((l) => (
        <li key={l.title}>
          <div className="text-base font-medium text-snow">{l.title}</div>
          <div className="text-sm leading-snug text-silver">{l.detail}</div>
        </li>
      ))}
    </ul>
  )
}

function LimitationsPopover() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-silver hover:border-amber/50 hover:text-snow"
      >
        <AlertTriangle size={14} className="text-amber" /> Research limitations ({limitations.length})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="glass-strong absolute bottom-full right-0 z-30 mb-3 w-[min(92vw,480px)] rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <Kicker>Research limitations</Kicker>
              <button onClick={() => setOpen(false)} aria-label="Close limitations" className="rounded-full p-1 text-silver hover:text-snow">
                <X size={16} />
              </button>
            </div>
            <LimitationsList />
            <p className="mt-4 text-sm text-dim">{methodologyLabel}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Chapter ---------------- */

function Headline({ show = true, small = false }: { show?: boolean; small?: boolean }) {
  return (
    <div>
      <Reveal show={show}>
        <Kicker>
          <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle}
        </Kicker>
      </Reveal>
      <h2 className={`${small ? 't-h2' : 't-display'} mt-3`}>
        <SplitHeadline text="So we" show={show} delay={0.05} />{' '}
        <span className="font-serif font-normal italic text-gradient">
          <SplitHeadline text="investigated." show={show} delay={0.15} />
        </span>
      </h2>
    </div>
  )
}

export default function Ch03Research({ mode, step }: ChapterProps) {
  if (mode === 'explore') return <ExploreView />

  const panel = Math.min(step, 3)
  return (
    <Stage mode={mode}>
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease }}
          >
            {panel === 0 && (
              <div className="flex flex-col gap-8">
                <Headline />
                <SourceCards />
                <Reveal delay={0.6}>
                  <MethodLabel />
                </Reveal>
              </div>
            )}
            {panel === 1 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <Kicker>
                      <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> Student survey · n = {survey.n}
                    </Kicker>
                    <h2 className="t-h2 mt-2">
                      Most had <span className="font-serif font-normal italic text-amber">recently missed</span> something.
                    </h2>
                  </div>
                </div>
                <SurveyPanel />
              </div>
            )}
            {panel === 2 && (
              <div className="flex flex-col gap-6">
                <div>
                  <Kicker>
                    <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> Qualitative interviews · n = {interviews.n}
                  </Kicker>
                  <h2 className="t-h2 mt-2">
                    The pattern repeated — <span className="font-serif font-normal italic text-lavender">with a warning.</span>
                  </h2>
                </div>
                <InterviewPanel />
              </div>
            )}
            {panel === 3 && <Closing show />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <SourceNote className="max-w-2xl">
          {SOURCE} {methodologyLabel}
        </SourceNote>
        <LimitationsPopover />
      </div>
    </Stage>
  )
}

function ExploreView() {
  return (
    <Stage mode="explore">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-8">
          <Headline />
          <SourceCards />
          <MethodLabel />
        </div>

        <section>
          <Kicker className="mb-2">Student survey · n = {survey.n}</Kicker>
          <h3 className="t-h2 mb-8">
            Most had <span className="font-serif font-normal italic text-amber">recently missed</span> something.
          </h3>
          <SurveyPanel />
          <SourceNote className="mt-6">{SOURCE}</SourceNote>
        </section>

        <section>
          <Kicker className="mb-2">Qualitative interviews · n = {interviews.n}</Kicker>
          <h3 className="t-h2 mb-8">
            The pattern repeated — <span className="font-serif font-normal italic text-lavender">with a warning.</span>
          </h3>
          <InterviewPanel />
          <SourceNote className="mt-6">{SOURCE} Discovery-channel themes are qualitative; the report does not provide per-channel counts.</SourceNote>
        </section>

        <section className="py-10">
          <Closing show />
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <Expandable title="All research findings (with denominators)" defaultOpen>
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-dim">Survey · n = {survey.n}</div>
            <ul className="mb-4 flex flex-col gap-1.5">
              {survey.findings.map((f) => (
                <li key={f.id}>
                  <span className="num font-semibold text-snow">
                    {f.value} of {f.of}
                  </span>{' '}
                  {f.text}
                </li>
              ))}
            </ul>
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-dim">Interviews · n = {interviews.n}</div>
            <ul className="flex flex-col gap-1.5">
              {interviews.findings.map((f) => (
                <li key={f.id}>
                  <span className="num font-semibold text-snow">
                    {f.value} of {f.of}
                  </span>{' '}
                  {f.text}
                </li>
              ))}
            </ul>
          </Expandable>
          <Expandable title="Research limitations" defaultOpen>
            <LimitationsList />
            <p className="mt-4 text-dim">{methodologyLabel}</p>
          </Expandable>
        </div>
        <SourceNote>{SOURCE}</SourceNote>
      </div>
    </Stage>
  )
}
