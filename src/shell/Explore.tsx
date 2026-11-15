import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Play } from 'lucide-react'
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { chapterComponents } from '../chapters'
import { JourneyMap } from '../components/journey/JourneyMap'
import { AssumptionTracker } from '../components/tracker/AssumptionTracker'
import EvidenceRoom from '../explore/EvidenceRoom'
import { Kicker, Logo, OrbitFieldLazy, ease } from './exploreParts'
import { chapters, stages, type StageId } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { labelMeta, statusMeta } from '../data/evidence'
import { journeyNodes } from '../data/journey'
import { references } from '../data/references'
import { ModeToggle } from './ModeToggle'
import { presentHash } from './route'

type Block = { chapter: string }

interface Section {
  id: string
  label: string
  stage?: StageId
  blocks: Block[]
}

/** One-line purpose of each stage — process description only, no outcome claims. */
const stageIntro: Record<StageId, string> = {
  ideation: 'Is this worth investigating at all? Start from an observation, state hypotheses, and screen the opportunity before spending anything on it.',
  discovery: 'Replace our own beliefs with evidence: interviews and a survey, and the assumptions they forced us to change.',
  bmd: 'Turn what we learned into jobs, a proposition and a business model, and mark which parts are still assumption.',
  validation: 'Take the idea beyond our team, stress-test the reasoning, and define the experiment that would justify going on.',
  verdict: 'Weigh what we know against what we do not, and decide what to do next.',
}

/** Explore-mode information architecture. Chapters are reused (no duplicated content). */
export const sections: Section[] = [
  { id: 'overview', label: 'Overview', blocks: [] },
  { id: 'journey', label: 'Journey Map', blocks: [] },
  { id: 'ideation', label: '1 · Ideation & Screening', stage: 'ideation', blocks: [{ chapter: 'question' }, { chapter: 'origin' }, { chapter: 'screening' }] },
  { id: 'discovery', label: '2 · Discovery', stage: 'discovery', blocks: [{ chapter: 'learning-before-building' }, { chapter: 'what-students-told-us' }, { chapter: 'assumptions-changed' }] },
  { id: 'bmd', label: '3 · Business Model Design', stage: 'bmd', blocks: [{ chapter: 'jtbd' }, { chapter: 'product' }, { chapter: 'who-pays' }, { chapter: 'lean-canvas' }, { chapter: 'viability' }] },
  { id: 'validation', label: '4 · Validation', stage: 'validation', blocks: [{ chapter: 'market-engagement' }, { chapter: 'coaching' }, { chapter: 'experiment' }, { chapter: 'scale' }] },
  { id: 'verdict', label: 'Final Evaluation', stage: 'verdict', blocks: [{ chapter: 'verdict' }] },
  { id: 'assumptions', label: 'Assumptions', blocks: [] },
  { id: 'evidence', label: 'Evidence Room', blocks: [] },
  { id: 'sources', label: 'Sources', blocks: [] },
]

const noop = () => {}
const wrap = 'mx-auto max-w-[1500px] px-5 sm:px-10 lg:px-16'

function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease }}>
      {children}
    </motion.div>
  )
}

export function Explore({ section, go }: { section: string | null; go: (hash: string, replace?: boolean) => void }) {
  const [active, setActive] = useState(section ?? 'overview')

  useEffect(() => {
    if (!section) {
      window.scrollTo(0, 0)
      return
    }
    // wait for charts/layout to settle, then jump (re-check once in case content above grew)
    const jumpTo = () => document.getElementById(section)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    const t1 = setTimeout(jumpTo, 60)
    const t2 = setTimeout(jumpTo, 600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (vis) {
          setActive(vis.target.id)
          window.history.replaceState(null, '', `#/explore/${vis.target.id}`)
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  // keep the active nav pill visible in the scrolling nav on small screens
  useEffect(() => {
    document.getElementById(`nav-${active}`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])

  return (
    <div className="atmosphere min-h-full overflow-x-clip text-snow">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-8">
          <button onClick={() => jump('overview')} aria-label="Top" className="shrink-0">
            <span className="hidden sm:inline">
              <Logo size={24} />
            </span>
            <span className="sm:hidden">
              <Logo size={24} wordmark={false} />
            </span>
          </button>
          <nav className="scrollbar-thin flex min-w-0 flex-1 gap-1 overflow-x-auto px-1" aria-label="Explore sections">
            {sections.map((s) => (
              <button
                key={s.id}
                id={`nav-${s.id}`}
                onClick={() => jump(s.id)}
                aria-current={active === s.id}
                className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active === s.id ? 'bg-white/10 text-snow' : 'text-silver hover:text-snow'}`}
              >
                {s.label}
              </button>
            ))}
          </nav>
          <div className="shrink-0">
            <ModeToggle mode="explore" onPresent={() => go(presentHash(0, 0), false)} />
          </div>
        </div>
      </header>

      <Overview go={go} />

      <section id="journey" className="scroll-mt-16 border-t border-line/60">
        <div className={`${wrap} py-16 sm:py-24`}>
          <Kicker>The venture journey</Kicker>
          <h2 className="t-h1 mt-4 max-w-4xl">Fourteen steps from observation to a conditional verdict.</h2>
          <p className="t-lead mt-4 max-w-3xl">
            Colour shows how strong the evidence behind each step is today, not whether the step happened. Several steps stay amber or grey on purpose, and the pilot is drawn dashed because it has not been run. Dashed arrows are the feedback loops where evidence sent us back.
          </p>
          <div className="mt-10">
            <JourneyMap />
          </div>
        </div>
      </section>

      {sections
        .filter((s) => s.stage)
        .map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-16 border-t border-line/60">
            <StageBanner stage={s.stage!} />
            {s.blocks.map((b, i) => {
              const C = chapterComponents[b.chapter]
              const meta = chapters.find((c) => c.slug === b.chapter)!
              return (
                <Fragment key={i}>
                  <Reveal>
                    <C mode="explore" step={meta.steps - 1} setStep={noop} />
                  </Reveal>
                </Fragment>
              )
            })}
          </section>
        ))}

      <section id="assumptions" className="scroll-mt-16 border-t border-line/60">
        <div className={`${wrap} py-16 sm:py-24`}>
          <Kicker>Assumption tracker</Kicker>
          <h2 className="t-h1 mt-4 max-w-4xl">What we believe, and what we can actually show.</h2>
          <p className="t-lead mt-4 max-w-3xl">
            Six critical assumptions carry the case for Orbit. Only one is supported, and only within a convenience sample. Open any row for the evidence and the next test.
          </p>
          <div className="mt-10">
            <AssumptionTracker full />
          </div>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-16 border-t border-line/60">
        <EvidenceRoom />
      </section>

      <Sources />

      <footer className="border-t border-line px-6 py-10 text-center text-xs text-dim">
        <Logo size={22} className="mb-3 justify-center" />
        <p>
          {pitchConfig.course} · {pitchConfig.school} · {pitchConfig.teamName}
        </p>
        <p className="mx-auto mt-1 max-w-2xl">All 2027–2031 figures are financial-model projections. Sample events and personas are illustrative reconstructions, not recorded participants.</p>
        <p className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
          <a href="#/present/question" className="text-silver hover:text-snow">Presentation</a>
          <a href="#/rehearse" className="text-silver hover:text-snow">Rehearsal view</a>
          {pitchConfig.prototypeUrl && (
            <a href={pitchConfig.prototypeUrl} target="_blank" rel="noreferrer" className="text-silver hover:text-snow">
              Real prototype
            </a>
          )}
        </p>
      </footer>
    </div>
  )
}

function StageBanner({ stage }: { stage: StageId }) {
  const s = stages[stage]
  const nodes = journeyNodes.filter((n) => n.stage === stage)
  return (
    <div className="border-b border-line/60" style={{ background: `linear-gradient(90deg, color-mix(in srgb, ${s.color} 9%, transparent), transparent 70%)` }}>
      <div className={`${wrap} flex flex-wrap items-center gap-x-6 gap-y-3 py-6 sm:py-8`}>
        <div className="num grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-lg font-medium" style={{ borderColor: s.color, color: s.color }}>
          {s.n}
        </div>
        <div className="min-w-[240px] flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: s.color }}>
            {stage === 'verdict' ? 'After stage 4' : `Stage ${s.n}`}
            {s.weeks && <span className="text-dim">{s.weeks}</span>}
            <span className="text-dim">
              Journey step{nodes.length > 1 ? 's' : ''} {nodes.map((n) => n.id).join(', ')}
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{s.label}</h2>
          <p className="mt-1 max-w-3xl text-[15px] leading-snug text-silver">{stageIntro[stage]}</p>
        </div>
      </div>
    </div>
  )
}

function Overview({ go }: { go: (hash: string, replace?: boolean) => void }) {
  const btn = 'inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-snow hover:border-violet/60'
  return (
    <section id="overview" className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-50" aria-hidden>
        <OrbitFieldLazy intensity={0.6} labels={false} />
      </div>
      <div className={`${wrap} relative py-16 sm:py-28`}>
        <Kicker>Explore mode · read at your own pace</Kicker>
        <h1 className="t-display mt-5 max-w-5xl">
          ORBIT: <span className="font-serif font-normal italic text-gradient">From Idea to Evidence</span>
        </h1>
        <p className="mt-8 max-w-3xl font-serif text-2xl italic leading-snug text-snow sm:text-3xl">
          How did we move from believing in an idea to understanding whether it is actually worth pursuing?
        </p>
        <div className="mt-8 max-w-3xl rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 55%, transparent)', background: 'color-mix(in srgb, var(--color-ev-proposed) 9%, transparent)' }}>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet-soft">Our answer</div>
          <p className="mt-1.5 text-lg font-semibold leading-snug text-snow sm:text-xl">
            CONDITIONAL GO — pursue one paid, measurable university pilot before committing to wider expansion.
          </p>
        </div>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-silver">
          A process-led evaluation of one venture idea through the four stages of the {pitchConfig.course.split(' · ')[0]} framework, by {pitchConfig.teamName} at {pitchConfig.school}. It shows what we believed, what we investigated, what the evidence did and did not say, and what we would test next.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => go('#/present/question', false)} className="inline-flex items-center gap-2 rounded-full bg-snow px-5 py-2.5 text-sm font-medium text-ink">
            <Play size={14} /> Watch the presentation
          </button>
          <button onClick={() => document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' })} className={btn}>
            Evidence Room <ArrowRight size={14} />
          </button>
          {pitchConfig.prototypeUrl && (
            <a href={pitchConfig.prototypeUrl} target="_blank" rel="noreferrer" className={btn}>
              Real prototype <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function Sources() {
  return (
    <section id="sources" className="scroll-mt-16 border-t border-line/60">
      <div className={`${wrap} py-16 sm:py-20`}>
        <Kicker>Sources & evidence labels</Kicker>
        <h2 className="t-h2 mt-3">How to read the evidence</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">References</h3>
            <ol className="mt-3 space-y-2.5">
              {references.map((r) => (
                <li key={r.id} className="flex gap-3 text-sm leading-snug">
                  <span className="num mt-0.5 h-fit shrink-0 rounded-md border border-line px-1.5 py-0.5 text-xs text-violet-soft">{r.id}</span>
                  <span className="text-silver">
                    <span className="text-snow">{r.title}</span>. {r.author}, {r.year}.
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">Where a claim comes from</h3>
              <ul className="mt-3 space-y-2.5">
                {Object.values(labelMeta).map((l) => (
                  <li key={l.label} className="flex items-start gap-3 text-sm leading-snug">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="text-silver">
                      <span className="font-medium uppercase tracking-wide" style={{ color: l.color }}>{l.label}</span> — {l.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">How strong the evidence is</h3>
              <ul className="mt-3 space-y-2.5">
                {Object.values(statusMeta).map((l) => (
                  <li key={l.label} className="flex items-start gap-3 text-sm leading-snug">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="text-silver">
                      <span className="font-medium" style={{ color: l.color }}>{l.label}</span> — {l.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
