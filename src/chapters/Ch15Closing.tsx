import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bookmark, CalendarDays, Check, ExternalLink, MapPin, SkipForward, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { OrbitField } from '../components/OrbitField'
import { Button, IllustrativeBadge, Kicker, Reveal, SplitHeadline, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { heroEvent } from '../data/events'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'closing')!

/** Step-0 beats: 1 Sam appears · 2 converge · 3 card · 4 saved */
const BEATS = [900, 2100, 3100, 4600]
const END = BEATS.length

function useFinale(active: boolean, forceEnd: boolean) {
  const reduce = useReducedMotion()
  const [raw, setRaw] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const toEnd = forceEnd || reduce || skipped
  useEffect(() => {
    if (toEnd || !active) return
    const ts = [window.setTimeout(() => setRaw(0), 0), ...BEATS.map((t, i) => window.setTimeout(() => setRaw((b) => Math.max(b, i + 1)), t))]
    return () => ts.forEach(clearTimeout)
  }, [active, toEnd])
  return { beat: toEnd ? END : raw, skip: () => setSkipped(true) }
}

const goEvidence = () => {
  const el = document.getElementById('references')
  if (el) {
    // already in explore mode — scroll there and keep the URL in sync
    el.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', '#/explore/references')
    return
  }
  window.location.hash = '#/explore/references'
}

export default function Ch15Closing({ mode, step }: ChapterProps) {
  return mode === 'explore' ? <ExploreClosing /> : <PresentClosing step={step} />
}

function PresentClosing({ step }: { step: number }) {
  const { beat, skip } = useFinale(step === 0, step >= 1)
  const dark = step >= 1

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <OrbitField intensity={1} converge={beat >= 2 ? 1 : 0} labels={beat < 2} dim={dark} />

      {/* soft vignette behind the card */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(32%_38%_at_50%_50%,rgba(7,10,18,0.8),transparent_75%)]" />

      {/* ---------------- step 0: Sam, rediscovered ---------------- */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        initial={false}
        animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.97 : 1, filter: dark ? 'blur(10px)' : 'blur(0px)' }}
        transition={{ duration: 1, ease }}
        aria-hidden={dark}
      >
        <Reveal show={!dark}>
          <Kicker className="text-center">
            <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.title}
          </Kicker>
        </Reveal>

        {/* Sam */}
        <motion.div
          className="mt-6 flex items-center gap-3"
          initial={false}
          animate={{ opacity: beat >= 1 ? 1 : 0, y: beat >= 1 ? 0 : 12 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[conic-gradient(from_200deg,#8066ff,#3b82f6,#3de0ea,#ffa36b,#8066ff)] p-[2px]">
            <div className="grid h-full w-full place-items-center rounded-full bg-navy text-lg font-semibold">S</div>
          </div>
          <div className="text-left">
            <div className="text-lg font-semibold leading-tight">Sam, again.</div>
            <div className="text-[15px] text-silver">Same week. Same opportunity. A different discovery.</div>
          </div>
          <IllustrativeBadge className="ml-2" />
        </motion.div>

        {/* Orbit-style card */}
        <div className="mt-7 h-[min(400px,48vh)] w-[min(460px,92vw)]">
          <AnimatePresence>
            {beat >= 3 && <FoundCard saved={beat >= 4} />}
          </AnimatePresence>
        </div>

        <div className="mt-5 h-10">
          {beat < END && !dark && (
            <Button variant="ghost" size="sm" onClick={skip} aria-label="Skip animation">
              <SkipForward size={13} /> Skip animation
            </Button>
          )}
        </div>
      </motion.div>

      {/* ---------------- steps 1–3: the close ---------------- */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#030409]"
        initial={false}
        animate={{ opacity: step === 1 ? 0.96 : step >= 2 ? 0.82 : 0 }}
        transition={{ duration: 1.4, ease }}
      />

      <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
        {/* step 1 */}
        <div className="col-start-1 row-start-1">
          <h2 className="t-display">
            <SplitHeadline text="Opportunities change lives." show={step === 1} delay={0.6} />
          </h2>
          <h2 className="t-display mt-3 font-serif font-normal italic">
            <span className="text-gradient-warm">
              <SplitHeadline text="But only when people discover them." show={step === 1} delay={1.8} />
            </span>
          </h2>
        </div>

        {/* step 2 — brand */}
        <motion.div
          className="col-start-1 row-start-1 flex flex-col items-center"
          initial={false}
          animate={{ opacity: step === 2 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          aria-hidden={step !== 2}
        >
          <motion.img
            src="/brand/orbit-logo.webp"
            alt="Orbit logo"
            draggable={false}
            className="h-[clamp(120px,22vh,220px)] w-auto select-none"
            initial={false}
            animate={step === 2 ? { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px) drop-shadow(0 0 50px rgba(128,102,255,0.55))' } : { opacity: 0, scale: 0.7, rotate: -25, filter: 'blur(12px) drop-shadow(0 0 0px rgba(128,102,255,0))' }}
            transition={{ duration: 1.4, ease, delay: step === 2 ? 0.2 : 0 }}
          />
          <Reveal show={step === 2} delay={0.9}>
            <div className="mt-6 text-[clamp(2.2rem,4.5vw,4.5rem)] font-semibold tracking-[0.32em] text-snow" style={{ marginRight: '-0.32em' }}>
              ORBIT
            </div>
          </Reveal>
          <Reveal show={step === 2} delay={1.3}>
            <p className="mt-2 font-serif text-[clamp(1.5rem,2.6vw,2.6rem)] italic text-gradient">Discover your next opportunity.</p>
          </Reveal>
          <Reveal show={step === 2} delay={2.1}>
            <p className="mt-10 max-w-2xl text-[clamp(1rem,1.3vw,1.3rem)] text-silver">
              The problem is worth solving. <span className="text-snow">Our next job is proving the business.</span>
            </p>
          </Reveal>
        </motion.div>

        {/* step 3 — thank you */}
        <motion.div
          className="col-start-1 row-start-1 flex flex-col items-center"
          initial={false}
          animate={{ opacity: step === 3 ? 1 : 0 }}
          transition={{ duration: 0.9 }}
          aria-hidden={step !== 3}
        >
          <Reveal show={step === 3} delay={0.1}>
            <img src="/brand/orbit-logo.webp" alt="" className="mx-auto h-14 w-14 opacity-90" draggable={false} />
          </Reveal>
          <h2 className="mt-8 text-[clamp(3.5rem,10vw,10rem)] font-semibold leading-none tracking-[-0.04em]">
            <SplitHeadline text="Thank you." show={step === 3} delay={0.3} />
          </h2>
          <Reveal show={step === 3} delay={1.2} className={step === 3 ? 'pointer-events-auto' : ''}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goEvidence()
              }}
              tabIndex={step === 3 ? 0 : -1}
              className="group mt-12 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-silver transition-colors hover:border-violet/60 hover:text-snow"
            >
              Explore the evidence
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </Reveal>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function FoundCard({ saved, still = false }: { saved: boolean; still?: boolean }) {
  const e = heroEvent
  return (
    <motion.div
      initial={still ? false : { opacity: 0, scale: 0.85, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease }}
      className="glass-strong relative overflow-hidden rounded-3xl text-left shadow-[0_40px_120px_-30px_rgba(128,102,255,0.75)]"
    >
      {/* app header */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em]">
          <img src="/brand/orbit-logo.webp" alt="" className="h-5 w-5" /> ORBIT
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-cyan/10 px-2.5 py-1 text-xs text-cyan">
          <Sparkles size={12} /> Matches your interests
        </span>
      </div>

      <div className="relative h-24 overflow-hidden" style={{ background: `linear-gradient(120deg, hsl(${e.hue} 70% 40%), #3b82f6 60%, #3de0ea)` }}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_85%_10%,rgba(255,255,255,0.3),transparent_60%)]" />
        <div className="absolute bottom-2.5 left-5 flex gap-1.5">
          {e.tags.map((t) => (
            <span key={t} className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[clamp(1.25rem,1.6vw,1.6rem)] font-semibold leading-tight">{e.title}</h3>
          <motion.div
            className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border ${saved ? 'border-violet bg-violet/25 text-snow' : 'border-line text-silver'}`}
            initial={false}
            animate={saved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, ease }}
            aria-label={saved ? 'Saved' : 'Not saved'}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
            {saved && !still && (
              <motion.span className="absolute inset-0 rounded-full border border-violet-soft" initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.9, ease }} />
            )}
          </motion.div>
        </div>

        <div className="mt-3 space-y-1.5 text-[15px] text-silver">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} /> {e.date} · {e.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} /> {e.location}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-st-supported/40 bg-st-supported/10 px-2.5 py-1 text-[13px] text-st-supported">
            <Check size={13} /> Found Monday — before the deadline
          </span>
          <AnimatePresence>
            {saved && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="rounded-full bg-violet/15 px-2.5 py-1 text-[13px] text-violet-soft">
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-[14px]">
          <span className="text-silver">{e.deadline}</span>
          <span className="flex items-center gap-1.5 text-snow">
            Opens at original registration source <ExternalLink size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Explore mode: a calm, flowing version of the finale                */
/* ------------------------------------------------------------------ */

function ExploreClosing() {
  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 opacity-70">
        <OrbitField intensity={0.8} converge={1} labels={false} dim />
      </div>
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-14 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1fr_460px] lg:px-16">
        <div>
          <Kicker>
            <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.title}
          </Kicker>
          <h2 className="t-h1 mt-5">
            Opportunities change lives. <span className="font-serif font-normal italic text-gradient-warm">But only when people discover them.</span>
          </h2>
          <p className="t-lead mt-6 max-w-2xl">
            Sam returns — same week, same event. This time it surfaces in one place, before the RSVP deadline, and links out to the original registration
            page. Sam and the event are illustrative.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <img src="/brand/orbit-logo.webp" alt="Orbit logo" className="h-16 w-16" />
            <div>
              <div className="text-2xl font-semibold tracking-[0.3em]">ORBIT</div>
              <div className="font-serif text-xl italic text-gradient">Discover your next opportunity.</div>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-silver">
            The problem is worth solving. <span className="text-snow">Our next job is proving the business.</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-3xl font-semibold tracking-tight">Thank you.</span>
            <Button variant="outline" onClick={goEvidence}>
              Explore the evidence <ArrowRight size={14} />
            </Button>
          </div>
        </div>
        <div>
          <FoundCard saved still />
          <div className="mt-3 flex justify-center">
            <IllustrativeBadge label="Illustrative demo event" />
          </div>
        </div>
      </div>
    </div>
  )
}
