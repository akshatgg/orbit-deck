import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ChallengeDetail from '../components/validation/ChallengeDetail'
import { Hero, PresentHeader } from '../components/validation/PitchKit'
import { PropositionMorph, QuestionOrbs, QuestionRoom } from '../components/validation/PitchCoaching'
import { Accent, Card, ChapterHeader, LearningCard, LearningStrip, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { coachingChallenges, coachingLearning, versionComparison } from '../data/coaching'
import { coachingPresent, coachingStrip } from '../data/validationPresent'
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
  if (mode === 'explore') {
    const sourceNote = <SourceNote>Source: S6 coaching session feedback. Critique and refinement, not market validation.</SourceNote>
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

  return (
    <Stage mode="present">
      <PresentHeader stage={meta.stage} num={meta.num} kicker={meta.title} title="The strongest challenge to our idea was not *whether people liked it.*" />
      <div className="mt-6 min-h-[28rem]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }} className="space-y-10 pt-4">
              <Hero size="lg">
                Five questions. <Accent>Each one changed a decision.</Accent>
              </Hero>
              <QuestionOrbs active={-1} onPick={setStep} large />
            </motion.div>
          )}
          {step >= 1 && step <= 5 && (
            <motion.div key={`q${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }} className="space-y-6">
              <QuestionRoom index={active} />
              <QuestionOrbs active={active} onPick={setStep} />
            </motion.div>
          )}
          {step >= 6 && (
            <motion.div key="versions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
              <PropositionMorph />
              <Reveal delay={1.1} className="mt-8">
                <Hero size="lg" className="font-normal">
                  {coachingPresent.endLead} <Accent>{coachingPresent.endAccent}</Accent>
                </Hero>
              </Reveal>
              <LearningStrip className="mt-6" {...coachingStrip} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3">
        <SourceNote>{coachingPresent.source}</SourceNote>
      </div>
    </Stage>
  )
}
