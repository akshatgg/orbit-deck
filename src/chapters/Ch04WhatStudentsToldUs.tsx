import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ChannelChart } from '../components/discovery/ChannelChart'
import { DotField, type DotView } from '../components/discovery/DotField'
import { PresentHeader } from '../components/discovery/pitch'
import { Accent, ChapterHeader, EvidenceTag, GlowNumber, LearningCard, LearningStrip, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { causesCaveat, findingLabels, insightShort, learningStripCh04 } from '../data/discoveryShort'
import { chapters } from '../data/chapters'
import type { Learning } from '../data/evidence'
import { discoveryRelatedMisses, headlineFindings, interviewN, keyInsight, missCausesListedTotal, quotes, surveyN } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'what-students-told-us')!

const learning: Learning = {
  believed: 'Students need more events, or one app with everything in it.',
  investigated: 'Survey counts (n = 42) and interview accounts (n = 13).',
  learned: 'Misses are mostly late discovery, deadlines and full events, and students hear via friends and email, not event apps.',
  changed: 'Timely, relevant discovery became the focus.',
}

const viewOfStep: DotView[] = ['all', 'missed', 'toomany', 'interview', 'causes']
const viewLabels: { v: DotView; t: string }[] = [
  { v: 'all', t: `All ${surveyN}` },
  { v: 'missed', t: 'Missed an event' },
  { v: 'toomany', t: 'Too many places' },
  { v: 'interview', t: 'Interviews' },
  { v: 'causes', t: 'Causes' },
]

const [fMissed, fToomany, fInterview] = headlineFindings

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

/** Present-mode hero stat: big glowing number beside the dot field, one short label. */
function StatPanel({ view }: { view: DotView }) {
  const stat =
    view === 'all' ? { value: surveyN, of: null, label: findingLabels.all }
    : view === 'missed' ? { value: fMissed.value, of: fMissed.of, label: findingLabels.missed }
    : view === 'toomany' ? { value: fToomany.value, of: fToomany.of, label: findingLabels.toomany }
    : view === 'interview' ? { value: fInterview.value, of: fInterview.of, label: findingLabels.interview }
    : { value: discoveryRelatedMisses, of: surveyN, label: findingLabels.causes }
  return (
    <div>
      <GlowNumber
        value={stat.value}
        className="text-[clamp(5.5rem,11vw,10rem)] leading-[0.9]"
        suffix={stat.of ? <span className="num text-[clamp(1.75rem,3.2vw,3rem)] text-silver">of {stat.of}</span> : undefined}
      />
      <p className="mt-3 max-w-md text-[clamp(1.25rem,2vw,1.9rem)] leading-snug text-snow">{stat.label}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <EvidenceTag label="observed" />
        {view === 'interview' && <span className="text-sm text-silver">Interviews, not the survey</span>}
      </div>
      {view === 'causes' && <p className="mt-4 max-w-md border-l-2 border-ev-unresolved pl-3 text-base leading-snug text-silver">{causesCaveat}</p>}
    </div>
  )
}

/** One large serif quote at a time, with a small pager. */
function QuoteStage() {
  const [i, setI] = useState(0)
  const n = quotes.length
  return (
    <div className="flex flex-col justify-center">
      <div className="font-serif text-[5rem] leading-[0.6] text-violet" aria-hidden>“</div>
      <div className="min-h-[clamp(9rem,26vh,13rem)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
            <blockquote className="font-serif text-[clamp(1.9rem,3.3vw,3.2rem)] italic leading-[1.1] text-snow">{quotes[i].text}</blockquote>
            <figcaption className="mt-3 flex items-center gap-3 text-sm text-silver">Interviewee, anonymised <EvidenceTag label="observed" /></figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center gap-2" role="group" aria-label="Interview quotes">
        <button type="button" aria-label="Previous quote" onClick={(e) => { e.stopPropagation(); setI((i + n - 1) % n) }} className="rounded-full border border-line p-2 text-silver hover:text-snow"><ChevronLeft size={16} /></button>
        <span className="num text-sm text-silver">{i + 1} / {n}</span>
        <button type="button" aria-label="Next quote" onClick={(e) => { e.stopPropagation(); setI((i + 1) % n) }} className="rounded-full border border-line p-2 text-silver hover:text-snow"><ChevronRight size={16} /></button>
      </div>
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

const DOT_NOTE = 'Dot arrangement is illustrative: it shows counts, not which respondents overlap between questions.'

export default function Ch04WhatStudentsToldUs({ mode, step }: ChapterProps) {
  const [exploreView, setExploreView] = useState<DotView>('all')

  if (mode === 'explore') {
    return (
      <Stage mode={mode}>
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="Survey n = 42 and interviews n = 13. Each dot is one analysed survey response." />
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
          <LearningCard learning={learning} />
        </div>
      </Stage>
    )
  }

  return (
    <Stage mode={mode} className="!justify-start !pb-8 !pt-20">
      <PresentHeader meta={meta} title="The problem was real. *But it was not exactly what we expected.*" />

      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {step <= 4 && (
            <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="grid items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
              <div>
                <div className="glass rounded-2xl p-3">
                  <DotField view={viewOfStep[step]} tall />
                </div>
                <SourceNote className="mt-2">S3, S4 · Dot layout is illustrative: counts, not overlap.</SourceNote>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={viewOfStep[step]} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                  <StatPanel view={viewOfStep[step]} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="chan" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
              <p className="mb-3 text-[clamp(1.4rem,2.4vw,2.2rem)] font-medium leading-tight tracking-tight text-snow">
                Students hear from <Accent>friends and email</Accent>, not event apps.
              </p>
              <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="t-kicker !text-[11px]">How students hear · survey n = {surveyN}</span>
                    <EvidenceTag label="observed" />
                  </div>
                  <ChannelChart compact />
                </div>
                <QuoteStage />
              </div>
              <SourceNote className="mt-2">S3, S4 · Quotes from the interviews (n = {interviewN}).</SourceNote>
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="insight" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="space-y-8 pt-6">
              <div className="flex items-center gap-3">
                <span className="t-kicker">Key insight</span>
                <EvidenceTag label="observed" />
              </div>
              <p className="max-w-5xl text-[clamp(2.6rem,6.2vw,6rem)] font-semibold leading-[1.02] tracking-tight text-snow">
                {insightShort.lead} <Accent>{insightShort.accent}</Accent>
              </p>
              <Reveal show delay={0.35}>
                <LearningStrip {...learningStripCh04} />
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  )
}
