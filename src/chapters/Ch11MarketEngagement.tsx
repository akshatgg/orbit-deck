import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import EngagementMap from '../components/validation/EngagementMap'
import EvidenceLadder from '../components/validation/EvidenceLadder'
import ImperialJourney from '../components/validation/ImperialJourney'
import PrototypeDrawer from '../components/validation/PrototypeDrawer'
import { Hero, PresentHeader } from '../components/validation/PitchKit'
import { LadderViz, OrbitMap } from '../components/validation/PitchEngagement'
import { Accent, Card, ChapterHeader, EvidenceTag, LearningCard, LearningStrip, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { engagementLearning, imperialContact, otherStudentAccounts, otherStudentDisclaimer, whatRemainsUnknown, whatWeLearned } from '../data/engagement'
import { engagementShort, engagementStrip } from '../data/validationPresent'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'market-engagement')!

function Panel({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
      {children}
    </motion.div>
  )
}

function Happened() {
  return (
    <Card className="p-6 sm:p-7">
      <EvidenceTag label="reported" />
      <h3 className="t-h2 mt-3">What happened</h3>
      <p className="mt-3 text-[clamp(1.05rem,1.4vw,1.4rem)] leading-snug text-snow">{imperialContact.statement}</p>
      <p className="mt-3 text-[15px] leading-snug text-silver">{imperialContact.caveat}</p>
    </Card>
  )
}

function OtherAccounts() {
  return (
    <Card className="p-6 sm:p-7">
      <div className="flex flex-wrap gap-2">
        <EvidenceTag label="observed" text="Individual student accounts" />
      </div>
      <h3 className="t-h2 mt-3">Similar challenges, elsewhere</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {otherStudentAccounts.map((u) => (
          <li key={u.id} className="rounded-full border border-dashed border-silver/50 px-3 py-1 text-[15px] text-snow">
            {u.name}
          </li>
        ))}
      </ul>
      <p className="mt-4 border-l-2 border-amber/70 pl-3 text-[clamp(1rem,1.25vw,1.2rem)] leading-snug text-snow">{otherStudentDisclaimer}</p>
      <p className="mt-3 text-[14px] text-silver">Not customers, partners or pilot participants.</p>
    </Card>
  )
}

function LearnedUnknown() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <EvidenceTag label="reported" text="What we learned" />
        <ul className="mt-3 space-y-2 text-[16px] leading-snug text-snow">
          {whatWeLearned.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ev-reported" />
              {t}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="border-amber/30 p-5">
        <EvidenceTag label="unresolved" text="What remains unknown" />
        <ul className="mt-3 grid gap-x-4 gap-y-2 text-[16px] leading-snug text-snow sm:grid-cols-2">
          {whatRemainsUnknown.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber" />
              {t}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

const mapNote = 'Abstract engagement diagram — not a geographic claim. Sources: S3, S4.'

export default function Ch11MarketEngagement({ mode, step }: ChapterProps) {
  if (mode === 'explore') {
    return (
      <Stage mode="explore">
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead="Validation meant leaving our own cohort, and being honest about how far the evidence actually reaches." />
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <EngagementMap showOthers />
            <SourceNote className="mt-2">{mapNote}</SourceNote>
          </div>
          <div className="space-y-4">
            <Happened />
            <OtherAccounts />
          </div>
        </div>
        <h3 className="t-h2 mt-16">The Imperial engagement journey</h3>
        <div className="mt-5">
          <ImperialJourney />
        </div>
        <div className="mt-6">
          <LearnedUnknown />
        </div>
        <h3 className="t-h2 mt-16">The evidence ladder</h3>
        <p className="t-lead mt-3 max-w-3xl">Only three rungs are supported by current evidence, and two of them only partly. We have not claimed a pilot, a paid contract or an approved integration.</p>
        <div className="mt-6">
          <EvidenceLadder />
        </div>
        <div className="mt-8">
          <PrototypeDrawer defaultOpen />
        </div>
        <LearningCard className="mt-12" learning={engagementLearning} />
        <SourceNote className="mt-4">Sources: S3 Team 2S report, S4 Definitive report. Stakeholder statements are reported, not independently verified.</SourceNote>
      </Stage>
    )
  }

  return (
    <Stage mode="present">
      <PresentHeader stage={meta.stage} num={meta.num} kicker={meta.title} title="We took Orbit *beyond our own team.*" />
      <div className="mt-5 min-h-[27.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <Panel key="map">
              <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_1fr]">
                <OrbitMap showOthers />
                <div className="space-y-4">
                  <Hero>
                    Same problem elsewhere. <Accent>One Imperial contact welcomed a demo.</Accent>
                  </Hero>
                  <div className="space-y-2.5">
                    <div className="rounded-xl border border-ev-reported/40 bg-ev-reported/5 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold text-snow">{engagementShort.imperialTitle}</span>
                        <EvidenceTag label="reported" />
                      </div>
                      <p className="mt-1 text-[16px] leading-snug text-silver">
                        {engagementShort.imperialLine} <span className="text-amber">{engagementShort.imperialTag}.</span>
                      </p>
                    </div>
                    <div className="rounded-xl border border-dashed border-silver/40 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold text-snow">{engagementShort.othersTitle}</span>
                        <EvidenceTag label="observed" text="Student accounts" />
                      </div>
                      <p className="mt-1 text-[16px] leading-snug text-silver">
                        {engagementShort.othersLine} <span className="text-amber">{engagementShort.othersTag}.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <SourceNote className="mt-1">Abstract diagram, not geographic · S3, S4</SourceNote>
            </Panel>
          )}
          {step >= 1 && (
            <Panel key="ladder">
              <div className="grid items-center gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-4">
                  <Hero size="lg">
                    Early signals. <Accent>No pilot, no payment.</Accent>
                  </Hero>
                  <p className="text-[clamp(1rem,1.3vw,1.3rem)] leading-snug text-silver">{engagementShort.ladderNote}</p>
                </div>
                <LadderViz />
              </div>
              <LearningStrip className="mt-5" {...engagementStrip} />
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  )
}
