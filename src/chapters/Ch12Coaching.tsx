import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ChallengeDetail from '../components/validation/ChallengeDetail'
import { Badge, Card, ChapterHeader, LearningCard, Reveal, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { coachingChallenges, coachingLearning, versionComparison } from '../data/coaching'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'coaching')!

function Versions() {
  const { earlier, refined } = versionComparison
  return (
    <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
      <div className="rounded-2xl border border-dashed border-silver/40 p-5 sm:p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">{earlier.label}</div>
        <p className="mt-2 text-[clamp(1.1rem,1.7vw,1.7rem)] leading-snug text-silver">{earlier.text}</p>
      </div>
      <div className="flex items-center justify-center text-silver">
        <ArrowRight size={28} className="rotate-90 lg:rotate-0" />
      </div>
      <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 55%, transparent)', background: 'color-mix(in srgb, var(--color-ev-proposed) 8%, transparent)' }}>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">{refined.label}</div>
        <p className="mt-2 text-[clamp(1.1rem,1.7vw,1.7rem)] leading-snug text-snow">{refined.text}</p>
      </div>
    </div>
  )
}

function EndLine({ className = '' }: { className?: string }) {
  return <p className={`font-serif text-[clamp(1.4rem,2.4vw,2.5rem)] italic leading-tight text-snow ${className}`}>{versionComparison.endLine}</p>
}

export default function Ch12Coaching({ mode, step, setStep }: ChapterProps) {
  const sourceNote = <SourceNote>Source: S6 coaching session feedback. Critique and refinement, not market validation.</SourceNote>

  if (mode === 'explore') {
    return (
      <Stage mode="explore">
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="Five questions from the coaching session. Each one changed a decision." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {coachingChallenges.map((c, i) => (
            <Card key={c.id} className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="num text-3xl text-dim">{i + 1}</span>
                <h3 className="font-serif text-[clamp(1.3rem,2vw,1.9rem)] italic leading-tight text-snow">“{c.question}”</h3>
              </div>
              <div className="mt-4">
                <ChallengeDetail c={c} compact />
              </div>
            </Card>
          ))}
        </div>
        <h3 className="t-h2 mt-16">Earlier versus refined proposition</h3>
        <div className="mt-5">
          <Versions />
        </div>
        <p className="mt-4 text-[15px] text-silver">{versionComparison.note}</p>
        <EndLine className="mt-8 max-w-4xl" />
        <LearningCard className="mt-12" learning={coachingLearning} />
        <div className="mt-4">{sourceNote}</div>
      </Stage>
    )
  }

  const active = step >= 1 && step <= 5 ? step - 1 : -1
  const title = <SplitHeadline text={meta.headline} className="t-h2 block" />

  return (
    <Stage mode="present">
      <StageLabel stage={meta.stage} className="mb-3" />
      <ChapterHeader num={meta.num} kicker={meta.title} title={title} />
      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {step <= 5 ? (
            <motion.div key="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
              <div role="list" aria-label="Coaching questions" className="grid gap-2.5">
                {coachingChallenges.map((c, i) => {
                  const on = i === active
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="listitem"
                      aria-pressed={on}
                      onClick={(e) => {
                        e.stopPropagation()
                        setStep(i + 1)
                      }}
                      className={`flex items-start gap-4 rounded-2xl border px-5 py-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet ${
                        on ? 'border-snow/70 bg-white/[0.07] shadow-[0_0_40px_-18px_rgba(196,181,253,0.8)]' : active === -1 ? 'border-line bg-navy/70 hover:border-silver/50' : 'border-line bg-navy/40 opacity-60 hover:opacity-100'
                      }`}
                      style={{ transform: on ? 'translateX(6px)' : undefined }}
                    >
                      <span className={`num mt-0.5 text-2xl ${on ? 'text-snow' : 'text-dim'}`}>{i + 1}</span>
                      <span className="font-serif text-[clamp(1.1rem,1.55vw,1.6rem)] italic leading-snug text-snow">“{c.question}”</span>
                    </button>
                  )
                })}
              </div>
              <div className="min-h-[18rem]">
                <AnimatePresence mode="wait" initial={false}>
                  {active >= 0 ? (
                    <motion.div key={active} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.45, ease }}>
                      <ChallengeDetail c={coachingChallenges[active]} />
                    </motion.div>
                  ) : (
                    <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-line p-6">
                      <Badge tone="silver">Source S6 · coaching session</Badge>
                      <p className="t-lead mt-4 text-snow">Five questions. Each one is a challenge, an implication and a revised decision.</p>
                      <p className="mt-3 text-[15px] text-dim">Select a question, or press → to bring them forward in order.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div key="versions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
              <Versions />
              <Reveal delay={0.3}>
                <p className="mt-4 text-[16px] text-silver">{versionComparison.note}</p>
              </Reveal>
              <Reveal delay={0.5}>
                <EndLine className="mt-5 max-w-5xl" />
              </Reveal>
              <LearningCard className="mt-6" compact learning={coachingLearning} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3">{sourceNote}</div>
    </Stage>
  )
}
