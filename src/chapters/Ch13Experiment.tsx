import PilotSequence from '../components/validation/PilotSequence'
import { PilotJourney } from '../components/validation/PitchPilot'
import { PresentHeader } from '../components/validation/PitchKit'
import { ChapterHeader, EvidenceTag, Expandable, LearningCard, Reveal, SourceNote, Stage, StageLabel } from '../components/ui'
import { chapters } from '../data/chapters'
import { evaluationIncludes, pilotDisclaimer, pilotEndLine, pilotLearning } from '../data/pilot'
import { pilotPresent as P } from '../data/validationPresent'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'experiment')!

export default function Ch13Experiment({ mode }: ChapterProps) {
  if (mode === 'explore') {
    return (
      <Stage mode="explore">
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="The proposed next step is not more features. It is one journey: get to yes, measure a baseline, run the pilot, and make one decision." />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <EvidenceTag label="proposed" text={P.banner} />
          <span className="text-[16px] text-snow">{pilotDisclaimer}</span>
        </div>
        <h3 className="t-h2 mt-14">The proposed journey</h3>
        <div className="mt-6 hidden lg:block">
          <PilotJourney />
        </div>
        <div className="mt-6 lg:mt-5">
          <PilotSequence />
        </div>
        <div className="mt-6">
          <Expandable title="What the evaluation includes" defaultOpen>
            <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {evaluationIncludes.map((t) => (
                <li key={t} className="flex gap-2 text-[15px] text-snow">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ev-proposed" />
                  {t}
                </li>
              ))}
            </ul>
          </Expandable>
        </div>
        <p className="mt-16 max-w-4xl font-serif text-[clamp(2rem,4.4vw,4.5rem)] italic leading-[1.05] text-snow">{pilotEndLine}</p>
        <LearningCard className="mt-12" learning={pilotLearning} />
        <SourceNote className="mt-4">Proposed design. The sequence, thresholds and decision rules are the team’s, set before any pilot (S3, S4, S6). No pilot results exist. The cohort calculator and the six gates are under “Six validation gates”.</SourceNote>
      </Stage>
    )
  }

  return (
    <Stage mode="present">
      <PresentHeader stage={meta.stage} num={meta.num} kicker={meta.title} title="One paid, controlled *8–12 week pilot* at Imperial." banner={<EvidenceTag label="proposed" text={P.banner} />} />
      <div className="mt-6">
        <PilotJourney />
      </div>
      <Reveal delay={1.4} className="mt-3">
        <SourceNote>{P.source}</SourceNote>
      </Reveal>
    </Stage>
  )
}
