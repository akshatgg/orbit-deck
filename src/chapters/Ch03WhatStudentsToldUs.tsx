import { AnimatePresence, motion } from 'framer-motion'
import { History, Users, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { ChannelChart } from '../components/discovery/ChannelChart'
import { DotField, type DotView } from '../components/discovery/DotField'
import { MethodLoop } from '../components/discovery/MethodLoop'
import { PresentHeader } from '../components/discovery/pitch'
import { QuestionExplorer } from '../components/discovery/QuestionExplorer'
import { ResearchWall } from '../components/discovery/ResearchWall'
import { Accent, ChapterHeader, EvidenceTag, Expandable, GlowNumber, LearningCard, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { causesCaveat, insightShort } from '../data/discoveryShort'
import { chapters } from '../data/chapters'
import type { Learning } from '../data/evidence'
import { discoveryRelatedMisses, headlineFindings, interviewN, keyInsight, limitations, missCauses, missCausesListedTotal, quotes, researchMeta, surveyN } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'what-students-told-us')!

const learning: Learning = {
  believed: 'Students need more events, or one app with everything in it. Asking about Orbit would show whether it was needed.',
  investigated: `Past behaviour, not opinions: ${interviewN} interviews and ${surveyN} survey responses (n = ${surveyN}; interviews n = ${interviewN}).`,
  learned: 'Misses are mostly late discovery, deadlines and full events, and students hear via friends and email, not event apps.',
  changed: 'Timely, relevant discovery became the focus, with research limitations stated up front.',
}

const viewLabels: { v: DotView; t: string }[] = [
  { v: 'all', t: `All ${surveyN}` },
  { v: 'missed', t: 'Missed an event' },
  { v: 'toomany', t: 'Too many places' },
  { v: 'interview', t: 'Interviews' },
  { v: 'causes', t: 'Causes' },
]

const [fMissed, fToomany, fInterview] = headlineFindings
const forgot = missCauses.find((c) => c.id === 'forgot')!.value

function Big({ value, of, children }: { value: number; of: number; children: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="num text-[clamp(4rem,9vw,8rem)] font-medium leading-none text-ev-observed">{value}</span>
        <span className="num text-3xl text-silver sm:text-4xl">of {of}</span>
      </div>
      <p className="mt-3 max-w-md text-xl leading-snug text-snow sm:text-2xl">{children}</p>
    </div>
  )
}

function ViewPanel({ view }: { view: DotView }) {
  return (
    <div className="space-y-3">
      {view === 'all' && (
        <div>
          <span className="num text-[clamp(4rem,9vw,8rem)] font-medium leading-none text-snow">{surveyN}</span>
          <p className="mt-3 max-w-md text-xl leading-snug text-snow sm:text-2xl">analysed survey responses. Each dot is one respondent.</p>
        </div>
      )}
      {view === 'missed' && <Big value={fMissed.value} of={fMissed.of}>{`reported missing at least one event in the previous four weeks`}</Big>}
      {view === 'toomany' && <Big value={fToomany.value} of={fToomany.of}>{`agreed that there were too many places to check`}</Big>}
      {view === 'interview' && (
        <div>
          <Big value={fInterview.value} of={fInterview.of}>{`interviewees described missing an event or finding out about it too late`}</Big>
          <p className="mt-3 text-sm text-silver">A separate evidence source: {interviewN} semi-structured interviews, not the survey.</p>
        </div>
      )}
      {view === 'causes' && (
        <div>
          <div className="flex items-baseline gap-3">
            <span className="num text-[clamp(3.5rem,7vw,6rem)] font-medium leading-none text-ev-observed">{discoveryRelatedMisses}</span>
            <span className="text-xl text-snow sm:text-2xl">late + deadline + full</span>
          </div>
          <p className="mt-3 text-base leading-snug text-snow sm:text-lg">
            Cause of each respondent’s most recent miss. These five listed categories account for {missCausesListedTotal} of {surveyN} analysed responses; the other {surveyN - missCausesListedTotal} (grey) are not in the listed categories.
          </p>
          <p className="mt-3 border-l-2 border-ev-unresolved pl-3 text-sm leading-snug text-silver sm:text-base">
            These indicate a potentially addressable discovery problem, but they do not establish that Orbit could have prevented all {discoveryRelatedMisses} missed events.
          </p>
        </div>
      )}
      <EvidenceTag label="observed" />
    </div>
  )
}

const Quotes = () => (
  <div className="flex flex-col justify-center gap-4">
    {quotes.map((q) => (
      <figure key={q.text} className="rounded-2xl border border-line bg-navy/60 p-5">
        <blockquote className="font-serif text-2xl italic leading-snug text-snow sm:text-[1.75rem]">“{q.text}”</blockquote>
        <figcaption className="mt-3 flex items-center gap-3 text-sm text-silver">
          {q.who} <EvidenceTag label="observed" />
        </figcaption>
      </figure>
    ))}
  </div>
)

const Insight = ({ large }: { large?: boolean }) => (
  <p className={`max-w-5xl font-medium leading-[1.12] tracking-tight text-snow ${large ? 'text-[clamp(1.75rem,3.6vw,3.5rem)]' : 'text-[clamp(1.5rem,2.6vw,2.5rem)]'}`}>
    {keyInsight}
  </p>
)


/** One row of small dots: `lit` of `n` filled. */
function MiniDots({ n, lit, size = 7 }: { n: number; lit: number; size?: number }) {
  return (
    <div className="flex flex-wrap gap-[3px]" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <motion.span
          key={i}
          className="rounded-full"
          style={{ width: size, height: size, background: i < lit ? '#60a5fa' : 'rgb(148 163 184 / 0.28)' }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease, delay: 0.5 + i * 0.012 }}
        />
      ))}
    </div>
  )
}

/** Compact method strip: replaces the old stand-alone method chapter in Present mode. */
function MethodStrip() {
  const chips = [
    { Icon: Users, t: `${interviewN} interviews` },
    { Icon: ClipboardList, t: `${surveyN} survey responses` },
    { Icon: History, t: 'We asked about past behaviour, not opinions' },
  ]
  return (
    <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.1 }} className="flex flex-wrap items-center gap-2.5" aria-label="Method">
      {chips.map(({ Icon, t }, i) => (
        <li key={t} className="flex items-center gap-2 rounded-full border border-ev-observed/40 bg-ev-observed/10 px-4 py-2 text-[clamp(1rem,1.35vw,1.2rem)] text-snow">
          <Icon size={18} className="text-ev-observed" aria-hidden />
          <span className="num mr-0.5 text-xs text-dim">{i + 1}</span>
          {t}
        </li>
      ))}
      <li><EvidenceTag label="observed" /></li>
    </motion.ul>
  )
}

function FindingCard({ value, of, label, source, delay }: { value: number; of: number; label: string; source: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease, delay }} className="glass glow-ring flex flex-col rounded-3xl p-5 sm:p-6">
      <div className="t-kicker !text-[11px]">{source}</div>
      <GlowNumber value={value} className="mt-2 text-[clamp(5rem,8.6vw,8.5rem)] leading-[0.9]" suffix={<span className="num text-[clamp(1.6rem,2.6vw,2.6rem)] text-silver">of {of}</span>} />
      <p className="mt-3 min-h-[3.4em] text-[clamp(1.15rem,1.7vw,1.6rem)] leading-snug text-snow">{label}</p>
      <div className="mt-auto pt-3"><MiniDots n={of} lit={value} size={of > 20 ? 7 : 11} /></div>
    </motion.div>
  )
}

function Findings() {
  return (
    <div className="space-y-5">
      <MethodStrip />
      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        <FindingCard value={fMissed.value} of={fMissed.of} label="missed an event in the last four weeks" source={`Survey · n = ${surveyN}`} delay={0.35} />
        <FindingCard value={fToomany.value} of={fToomany.of} label="say there are too many places to check" source={`Survey · n = ${surveyN}`} delay={0.6} />
        <FindingCard value={fInterview.value} of={fInterview.of} label="interviewees missed an event or heard too late" source={`Interviews · n = ${interviewN}`} delay={0.85} />
      </div>
      <SourceNote>S3, S4 · Separate evidence sources: the survey and the interviews are not combined.</SourceNote>
    </div>
  )
}

function WhyMissed() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="space-y-3">
      <div className="grid items-center gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        <div className="glass rounded-2xl p-3">
          <DotField view="causes" tall />
        </div>
        <div>
          <div className="t-kicker !text-[11px] mb-1">Cause of each respondent’s latest miss</div>
          <GlowNumber value={discoveryRelatedMisses} className="text-[clamp(5.5rem,10vw,9.5rem)] leading-[0.9]" suffix={<span className="num text-[clamp(1.6rem,2.8vw,2.8rem)] text-silver">of {surveyN}</span>} />
          <p className="mt-2 text-[clamp(1.2rem,1.9vw,1.75rem)] leading-snug text-snow">were discovery-related: heard too late, deadline, event full.</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-3">
            <span className="num text-[clamp(2.5rem,4vw,3.8rem)] font-medium leading-none text-silver">{forgot}</span>
            <span className="text-[clamp(1.1rem,1.6vw,1.5rem)] text-silver">of {surveyN} simply forgot</span>
          </div>
          <div className="mt-3"><EvidenceTag label="observed" /></div>
        </div>
      </div>
      <SourceNote>
        S3, S4 · The five listed categories cover {missCausesListedTotal} of {surveyN} responses; the other {surveyN - missCausesListedTotal} are not in a listed category. {causesCaveat} Dot layout is illustrative.
      </SourceNote>
    </motion.div>
  )
}

function WhereTheyHear() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="space-y-4">
      <p className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-tight tracking-tight text-snow">
        Students hear from <Accent>friends and email</Accent>, not event apps.
      </p>
      <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <span className="t-kicker !text-[11px]">How students hear · survey n = {surveyN}</span>
            <EvidenceTag label="observed" />
          </div>
          <ChannelChart compact />
        </div>
        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease, delay: 0.5 }} className="rounded-3xl border border-violet/40 bg-violet/[0.07] p-6 sm:p-8">
          <div className="t-kicker mb-3">Key insight</div>
          <p className="text-[clamp(1.9rem,3.3vw,3.2rem)] font-semibold leading-[1.05] tracking-tight text-snow">
            {insightShort.lead} <Accent>{insightShort.accent}</Accent>
          </p>
        </motion.div>
      </div>
      <SourceNote>S3, S4 · Survey n = {surveyN}; quotes from the interviews are in Explore.</SourceNote>
    </motion.div>
  )
}

const Limitations = () => (
  <Expandable defaultOpen title={<span>Research limitations <span className="ml-2 font-mono text-xs text-amber">{limitations.length} stated</span></span>}>
    <ul className="grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
      {limitations.map((l) => (
        <li key={l} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
          <span>{l}</span>
        </li>
      ))}
    </ul>
  </Expandable>
)

const DOT_NOTE = 'Dot arrangement is illustrative: it shows counts, not which respondents overlap between questions.'

export default function Ch03WhatStudentsToldUs({ mode, step }: ChapterProps) {
  const [exploreView, setExploreView] = useState<DotView>('all')

  if (mode === 'explore') {
    return (
      <Stage mode={mode}>
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead={`Survey n = ${surveyN} and interviews n = ${interviewN}. Each dot is one analysed survey response. The investigation followed Week 3 customer-discovery principles (S2): ask about past behaviour, not whether people like Orbit.`} />
        <div className="mt-10 space-y-12">
          <section className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Dot view">
                {viewLabels.map((b) => (
                  <button
                    key={b.v}
                    type="button"
                    aria-pressed={exploreView === b.v}
                    onClick={(e) => {
                      e.stopPropagation()
                      setExploreView(b.v)
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${exploreView === b.v ? 'border-ev-observed bg-ev-observed/15 text-snow' : 'border-line text-silver hover:text-snow'}`}
                  >
                    {b.t}
                  </button>
                ))}
              </div>
              <div className="glass rounded-2xl p-4">
                <DotField view={exploreView} />
              </div>
              <SourceNote className="mt-3">S3, S4 · {DOT_NOTE}</SourceNote>
            </div>
            <div className="flex items-center">
              <ViewPanel view={exploreView} />
            </div>
          </section>

          <section>
            <h3 className="t-h2 mb-4">Where students actually hear about events</h3>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <ChannelChart />
              <Quotes />
            </div>
            <SourceNote className="mt-3">S3, S4 · Survey n = {surveyN}, multiple response. Quotes are anonymised interview excerpts.</SourceNote>
          </section>

          <section>
            <div className="t-kicker mb-3">Key insight</div>
            <Insight large />
          </section>

          <section className="space-y-10 border-t border-line pt-10">
            <div>
              <div className="t-kicker mb-1">Methodology</div>
              <h3 className="t-h2">How we investigated</h3>
              <p className="mt-2 max-w-3xl text-silver">Organised around past behaviour, not around asking people whether they liked Orbit. The hypothesis was tested against two separate evidence sources.</p>
            </div>
            <ResearchWall />
            <div>
              <h3 className="t-h2 mb-4">Questions we asked, and why</h3>
              <QuestionExplorer showWhy expandAll />
            </div>
            <div>
              <h3 className="t-h2 mb-4">Method</h3>
              <MethodLoop />
            </div>
            <Limitations />
          </section>

          <LearningCard learning={learning} />
          <SourceNote>S2 (Week 3 principles) · S3, S4 (research design and evidence appendices). 42 is the survey denominator throughout; some source screenshots show 44, and reconciliation remains required. {researchMeta.imperialMsc} of {surveyN} respondents were Imperial Business School MSc students.</SourceNote>
        </div>
      </Stage>
    )
  }

  return (
    <Stage mode={mode} className="!justify-start !pb-8 !pt-20">
      <PresentHeader meta={meta} title="The problem was real. *But it was not exactly what we expected.*" />
      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }}>
              <Findings />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <WhyMissed />
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div key="s2" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <WhereTheyHear />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  )
}
