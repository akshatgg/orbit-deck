import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Briefcase, CalendarDays, ExternalLink, Globe, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ArchitectureDiagram, FlowPipeline, MvpBoundary, MvpChips, mvpEndLine } from '../components/bmd/ProductDiagrams'
import { DemoSideControls, OrbitDemoPhone, PhoneShell, sourceColors } from '../components/bmd/OrbitDemoPhone'
import { PhoneHero } from '../components/bmd/PhoneHero'
import { presetPrefs, useOrbitDemo, type OrbitDemo } from '../components/bmd/useOrbitDemo'
import { VideoPanel } from '../components/bmd/VideoPanel'
import { Button, ChapterHeader, EvidenceTag, Expandable, IllustrativeBadge, LearningCard, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
import { availabilities, sourceLabels, topics, type SourceKey } from '../data/demoEvents'
import { valueProps } from '../data/productDecisions'
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
      {(
        [
          ['walk', 'Interactive walkthrough'],
          ['video', 'Video'],
        ] as const
      ).map(([id, label]) => (
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

  const d2 = useOrbitDemo()

  // Presenter steps put the phone in the state that shows each benefit. The phone stays tappable.
  useEffect(() => {
    if (!present) return
    d.setScreen('feed')
    d.setScope('london')
    d.setQuery('')
    d.setFmt(null)
    d.setMatchesOnly(false)
    d.setShowHint(false)
    if (step === 0) {
      d.setPrefs({ topics: [], formats: [], availability: [] })
      d.setSort('soonest')
      d.setDay(null)
      d.setFiltersOpen(false)
      d.setDateOnlyFilters(false)
      d.setSpotlight('source')
    } else {
      d.setPrefs(presetPrefs)
      d.setSort('relevance')
      d.setSpotlight('match')
      d.setDay(step === 2 ? 2 : null)
      d.setFiltersOpen(step === 2)
      d.setDateOnlyFilters(step === 2)
    }
    if (step === 2) {
      d2.setPrefs(presetPrefs)
      d2.openEvent('s6', 'feed')
      d2.setScreen('redirect')
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
        <ChapterHeader num={meta.num} kicker={meta.title} title={<span className={present ? 'block text-[clamp(1.3rem,1.7vw,2.1rem)] font-semibold leading-tight tracking-[-0.02em]' : 't-h2 block'}>{meta.headline}</span>} />
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
          {view === 'walk' ? (
            <div className="mx-auto lg:mx-0">{phone}</div>
          ) : (
            <div className="w-full lg:w-[560px]">
              <VideoPanel />
            </div>
          )}
          <div className="flex flex-col gap-6">
            <DemoSideControls d={d} />
            <Expandable title="How relevance is scored in this demo">
              <p>
                A transparent rule, not a model: +3 for each topic you chose that the event carries, +2 if its format is one you chose, +2 if it falls in a window you said you are free. 3 or more
                shows as a good match, 6 or more as a strong match. All events and sources are fictional samples.
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
  const vp = valueProps[Math.min(step, valueProps.length - 1)]
  const phoneW = step === 2 ? 'min(calc((100vh - 200px) / 2.05), 330px)' : 'min(calc((100vh - 200px) / 2.05), 400px)'
  return (
    <Stage mode={mode} className="sm:!py-[64px]">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-5">
          {header}
          <ValueRail step={step} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }} className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <span className="glow-num num text-[clamp(3.4rem,6vw,5.6rem)] font-semibold leading-[0.9] text-violet-soft">{vp.n}</span>
                <div className="min-w-0">
                  <p className="text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-snow">
                    <SplitHeadline text={vp.title} />
                  </p>
                  <p className="mt-2 max-w-xl text-[clamp(1rem,1.3vw,1.2rem)] leading-snug text-silver">{vp.line}</p>
                </div>
              </div>
              {step === 0 && <SourceFlow />}
              {step === 1 && <InterestChips d={d} />}
              {step === 2 && <ScheduleChips d={d} />}
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <IllustrativeBadge label="Sample data, in-page demo" />
            {pitchConfig.prototypeUrl && (
              <a
                href={pitchConfig.prototypeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[13px] text-silver underline-offset-4 hover:text-snow hover:underline"
              >
                Open the real prototype <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 px-4">
          <PhoneHero>
            <PhoneShell style={{ width: phoneW }}>
              <OrbitDemoPhone d={d} />
            </PhoneShell>
          </PhoneHero>
          <AnimatePresence>
            {step === 2 && (
              <motion.div key="redir" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.6, ease, delay: 0.25 }} className="flex items-center gap-4">
                <ArrowRight className="shrink-0 text-violet-soft" size={30} aria-hidden />
                <PhoneHero>
                  <PhoneShell style={{ width: phoneW }}>
                    <OrbitDemoPhone d={d2} />
                  </PhoneShell>
                </PhoneHero>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Stage>
  )
}

/* ---------- Present-mode helpers ---------- */

function ValueRail({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="The three value propositions">
      {valueProps.map((v) => {
        const on = v.n - 1 === step
        return (
          <li
            key={v.id}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${on ? 'border-violet bg-violet/25 text-snow' : v.n - 1 < step ? 'border-violet/40 text-silver' : 'border-line text-dim'}`}
          >
            <span className="num grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[12px]">{v.n}</span>
            {v.title}
          </li>
        )
      })}
    </ol>
  )
}

const sourceIcons: Record<SourceKey, typeof Globe> = { careers: Briefcase, calendar: CalendarDays, society: Users, public: Globe }

function SourceFlow() {
  return (
    <div className="flex flex-wrap items-center gap-2.5" aria-label="Sources feeding one feed">
      {(Object.keys(sourceLabels) as SourceKey[]).map((k, i) => {
        const Icon = sourceIcons[k]
        return (
          <motion.span
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.15 + i * 0.12 }}
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[15px] font-medium"
            style={{ borderColor: `${sourceColors[k]}66`, background: `${sourceColors[k]}1f`, color: sourceColors[k] }}
          >
            <Icon size={15} /> {sourceLabels[k].replace(' (sample)', '')}
          </motion.span>
        )
      })}
      <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
        <ArrowRight className="text-violet-soft" size={20} aria-hidden />
        <span className="rounded-full border border-violet bg-violet/25 px-4 py-2 text-[15px] font-semibold text-snow">One feed</span>
      </span>
    </div>
  )
}

function InterestChips({ d }: { d: OrbitDemo }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex max-w-2xl flex-wrap gap-2.5" role="group" aria-label="Interests">
        {topics.map((t) => {
          const on = d.prefs.topics.includes(t)
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={(e) => {
                e.stopPropagation()
                d.toggleTopic(t)
              }}
              className={`rounded-full border px-4 py-2 text-[15px] font-medium transition-all ${on ? 'border-violet bg-violet/25 text-snow shadow-[0_0_24px_-4px_rgba(139,92,246,0.8)]' : 'border-line text-silver hover:border-violet/50 hover:text-snow'}`}
            >
              {t}
            </button>
          )
        })}
      </div>
      <p className="font-mono text-[11px] text-dim">Tap an interest: the feed re-ranks</p>
    </div>
  )
}

function ScheduleChips({ d }: { d: OrbitDemo }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="When you are free">
        {availabilities.map((a) => {
          const on = d.prefs.availability.includes(a)
          return (
            <button
              key={a}
              type="button"
              aria-pressed={on}
              onClick={(e) => {
                e.stopPropagation()
                d.toggleAvail(a)
              }}
              className={`rounded-full border px-4 py-2 text-[15px] font-medium transition-all ${on ? 'border-violet bg-violet/25 text-snow shadow-[0_0_24px_-4px_rgba(139,92,246,0.8)]' : 'border-line text-silver hover:border-violet/50 hover:text-snow'}`}
            >
              {a}
            </button>
          )
        })}
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-navy/70 px-4 py-2 text-[15px] text-snow">
        Filter by date <ArrowRight size={16} className="text-violet-soft" /> the organiser’s own registration page <ExternalLink size={14} className="text-silver" />
      </div>
    </div>
  )
}
