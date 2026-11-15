import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ArchitectureDiagram, MvpBoundary, mvpEndLine } from '../components/bmd/ProductDiagrams'
import { DemoSideControls, OrbitDemoPhone, PhoneShell } from '../components/bmd/OrbitDemoPhone'
import { useOrbitDemo } from '../components/bmd/useOrbitDemo'
import { VideoPanel } from '../components/bmd/VideoPanel'
import { Button, ChapterHeader, EvidenceTag, Expandable, IllustrativeBadge, LearningCard, Reveal, SourceNote, Stage, StageLabel } from '../components/ui'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import type { Learning } from '../data/evidence'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'product')!

const learning: Learning = {
  believed: 'More features would make Orbit more useful.',
  investigated: 'What the evidence says the core job is.',
  learned: 'Coverage, relevance and trust in the source matter most.',
  changed: 'A narrow MVP that tests discovery, with social features parked.',
}

type View = 'walk' | 'video'

function ViewToggle({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <div className="inline-flex rounded-full border border-line p-1" role="tablist" aria-label="Product view">
      {([['walk', 'Interactive walkthrough'], ['video', 'Video']] as const).map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={view === id}
          onClick={(e) => {
            e.stopPropagation()
            setView(id)
          }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === id ? 'bg-snow text-ink' : 'text-silver hover:text-snow'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function PrototypeLink() {
  if (!pitchConfig.prototypeUrl) return null
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" href={pitchConfig.prototypeUrl}>
        Open the real prototype <ExternalLink size={14} />
      </Button>
      <span className="max-w-[16rem] text-[13px] leading-snug text-dim">Real working prototype, separate from the in-page sample demo.</span>
    </div>
  )
}

export default function Ch07Product({ mode, step }: ChapterProps) {
  const d = useOrbitDemo()
  const [view, setView] = useState<View>('walk')
  const present = mode === 'present'

  // Presenter steps drive the phone: step 0 = onboarding, step 1 = feed.
  useEffect(() => {
    if (!present) return
    if (step === 0) d.restartOnboarding()
    else if (step === 1 && d.screen === 'onboard') {
      if (!d.hasPrefs) d.applyPreset()
      d.setScreen('feed')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, present])

  const phone = (
    <div className="flex flex-col items-center gap-2">
      <PhoneShell style={present ? { width: 'min(calc((100vh - 190px) / 2.05), 380px)' } : { width: 'min(100%, 340px)' }}>
        <OrbitDemoPhone d={d} />
      </PhoneShell>
      <IllustrativeBadge label="Sample data, in-page demo" />
    </div>
  )

  const header = (
    <>
      <StageLabel stage={meta.stage} />
      <div className="mt-2">
        <ChapterHeader num={meta.num} kicker={meta.title} title={<span className="t-h2 block">{meta.headline}</span>} />
      </div>
    </>
  )

  /* ---------------- Explore ---------------- */
  if (!present) {
    return (
      <Stage mode={mode}>
        {header}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ViewToggle view={view} setView={setView} />
          <PrototypeLink />
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          {view === 'walk' ? <div className="mx-auto lg:mx-0">{phone}</div> : <div className="w-full lg:w-[560px]"><VideoPanel /></div>}
          <div className="flex flex-col gap-6">
            <DemoSideControls d={d} />
            <Expandable title="How relevance is scored in this demo">
              <p>
                A transparent rule, not a model: +3 for each topic you chose that the event carries, +2 if its format is one you chose, +2 if it falls in a window you said you are free. 3 or more shows as a good match,
                6 or more as a strong match. All events and sources are fictional samples.
              </p>
            </Expandable>
            <Expandable title="Prototype walkthrough testing: in progress">
              {pitchConfig.verifiedPrototypeResults ? (
                <div>
                  <EvidenceTag label="observed" text="Verified results" />
                  <ul className="mt-3 grid gap-1.5 text-snow">
                    {[
                      ['Completed unaided', pitchConfig.verifiedPrototypeResults.unaidedCompletion],
                      ['Found a relevant event', pitchConfig.verifiedPrototypeResults.relevantEventFound],
                      ['Found an event matching their availability', pitchConfig.verifiedPrototypeResults.availabilityMatch],
                      ['Reached the original registration redirect', pitchConfig.verifiedPrototypeResults.redirectReached],
                    ].map(([label, n]) => (
                      <li key={label as string}>
                        <span className="num">
                          {n} of {pitchConfig.verifiedPrototypeResults!.participants}
                        </span>{' '}
                        {label}
                      </li>
                    ))}
                  </ul>
                  {pitchConfig.verifiedPrototypeResults.notes && <p className="mt-3">{pitchConfig.verifiedPrototypeResults.notes}</p>}
                </div>
              ) : (
                <p>Walkthrough testing of the real prototype is in progress. Results will be added once verified.</p>
              )}
            </Expandable>
          </div>
        </div>

        <div className="mt-16">
          <ArchitectureDiagram />
        </div>
        <div className="mt-12">
          <MvpBoundary />
          <p className="t-h2 mt-8 max-w-4xl !text-[1.5rem] font-medium leading-snug text-snow">{mvpEndLine}</p>
        </div>
        <SourceNote className="mt-6">Weeks 2–3 frameworks (S1, S2) and the team report (S3). In-page events are fictional samples, not live listings or integrations.</SourceNote>
        <LearningCard learning={learning} className="mt-12" />
      </Stage>
    )
  }

  /* ---------------- Present ---------------- */
  const showPhone = step <= 1
  return (
    <Stage mode={mode}>
      {showPhone ? (
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="flex flex-col gap-5">
            {header}
            <Reveal show className="max-w-xl text-silver">
              <p className="t-lead !text-[1.15rem]">
                {step === 0
                  ? 'Set it up the way a student would: university, interests, event formats, then when you are free.'
                  : 'Search, filter, save, switch between university and London views, and open an event to see its source. Or retune the feed from here.'}
              </p>
            </Reveal>
            <div className="flex flex-wrap items-center gap-4">
              <ViewToggle view={view} setView={setView} />
            </div>
            {step === 1 && <DemoSideControls d={d} compact />}
            <PrototypeLink />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mx-auto">
              {view === 'walk' ? phone : <div className="w-[min(560px,90vw)]"><VideoPanel /></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>{header}</div>
          {step === 2 && <ArchitectureDiagram />}
          {step === 3 && (
            <>
              <MvpBoundary />
              <p className="max-w-5xl text-[clamp(1.1rem,1.8vw,1.6rem)] font-medium leading-snug text-snow">{mvpEndLine}</p>
              <LearningCard learning={learning} compact />
            </>
          )}
        </div>
      )}
    </Stage>
  )
}
