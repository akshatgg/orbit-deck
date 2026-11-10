import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Bell, ExternalLink, Film, Inbox, MessageCircle, Pause, Play, SkipForward } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DesktopFrame, PhoneFrame, artStyle } from '../components/product/OrbitUI'
import { DesktopScene, PhoneScene, sceneList, type SceneId } from '../components/product/Scenes'
import { Button, Expandable, IllustrativeBadge, Kicker, Reveal, SourceNote, SplitHeadline, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { demoEvents } from '../data/events'
import { discoverySources } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'reveal')!

/* ------------------------- Fragments (illustrative) ------------------------- */

type Frag =
  | { kind: 'window'; title: string; lines: number; x: number; y: number; r: number; w: number }
  | { kind: 'event'; ev: (typeof demoEvents)[number]; x: number; y: number; r: number; w: number }
  | { kind: 'notif'; icon: 'chat' | 'bell' | 'inbox'; title: string; body: string; x: number; y: number; r: number; w: number }

const fragments: Frag[] = [
  { kind: 'window', title: discoverySources[0], lines: 4, x: -38, y: -28, r: -8, w: 220 },
  { kind: 'event', ev: demoEvents[2], x: 30, y: -30, r: 6, w: 210 },
  { kind: 'notif', icon: 'chat', title: discoverySources[4], body: 'New messages in 4 chats', x: -14, y: -36, r: 3, w: 230 },
  { kind: 'window', title: discoverySources[1], lines: 3, x: 40, y: 4, r: 9, w: 200 },
  { kind: 'event', ev: demoEvents[3], x: -42, y: 10, r: 5, w: 200 },
  { kind: 'notif', icon: 'bell', title: 'Reminder', body: 'Registration closes soon', x: 16, y: 32, r: -6, w: 220 },
  { kind: 'window', title: discoverySources[2], lines: 3, x: -22, y: 34, r: -4, w: 210 },
  { kind: 'event', ev: demoEvents[4], x: 6, y: -14, r: -10, w: 190 },
  { kind: 'notif', icon: 'inbox', title: discoverySources[3], body: 'Events you might like', x: 36, y: -12, r: -3, w: 220 },
  { kind: 'event', ev: demoEvents[10], x: -30, y: -6, r: 8, w: 200 },
  { kind: 'window', title: discoverySources[5], lines: 2, x: 28, y: 22, r: 4, w: 190 },
  { kind: 'event', ev: demoEvents[6], x: -4, y: 20, r: 6, w: 200 },
]

function FragmentBody({ f }: { f: Frag }) {
  if (f.kind === 'window')
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121725]/90 shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-2 truncate text-xs text-silver">{f.title}</span>
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          {Array.from({ length: f.lines }, (_, i) => (
            <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${90 - i * 14}%` }} />
          ))}
        </div>
      </div>
    )
  if (f.kind === 'event')
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121725]/90 shadow-2xl">
        <div className="h-12" style={artStyle(f.ev.hue)} />
        <div className="p-3">
          <div className="text-[11px] text-[#7b93ff]">
            {f.ev.date} · {f.ev.time}
          </div>
          <div className="text-sm font-semibold leading-snug text-snow">{f.ev.title}</div>
        </div>
      </div>
    )
  const I = f.icon === 'chat' ? MessageCircle : f.icon === 'bell' ? Bell : Inbox
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a2033]/90 p-3 shadow-2xl backdrop-blur">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-silver">
        <I size={16} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-xs font-semibold text-snow">{f.title}</div>
        <div className="truncate text-xs text-silver">{f.body}</div>
      </div>
    </div>
  )
}

/** 0 scatter · 1 converge · 2 logo burst · 3 settled */
function Fragments({ phase }: { phase: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {fragments.map((f, i) => {
        const converge = phase >= 1
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ width: f.w, marginLeft: -f.w / 2, marginTop: -40 }}
            initial={{ x: `${f.x * 1.4}vw`, y: `${f.y * 1.4}vh`, opacity: 0, rotate: f.r * 2, scale: 0.9 }}
            animate={
              converge
                ? { x: '0vw', y: '0vh', opacity: 0, rotate: 0, scale: 0.15 }
                : { x: [`${f.x}vw`, `${f.x + (i % 2 ? 1.2 : -1.2)}vw`, `${f.x}vw`], y: [`${f.y}vh`, `${f.y + (i % 3 ? -1.5 : 1.5)}vh`, `${f.y}vh`], opacity: 1, rotate: f.r, scale: 1 }
            }
            transition={
              converge
                ? { duration: 0.85, ease: [0.7, 0, 0.3, 1], delay: (i % 6) * 0.03 }
                : { duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', opacity: { duration: 0.6, delay: i * 0.05 }, rotate: { duration: 0.8 }, scale: { duration: 0.8 } }
            }
          >
            <FragmentBody f={f} />
          </motion.div>
        )
      })}
    </div>
  )
}

function LogoBurst() {
  return (
    <div className="relative grid place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-violet-soft/40"
          style={{ width: 220, height: 220 }}
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: i * 0.25 }}
        />
      ))}
      <motion.div
        className="absolute h-[420px] w-[420px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(128,102,255,0.55), rgba(59,130,246,0.2) 40%, transparent 70%)' }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.img layoutId="orbit-reveal-logo" src="/brand/orbit-logo.webp" alt="Orbit logo" className="relative h-40 w-40" initial={{ scale: 0.3, opacity: 0, rotate: -40 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.9, ease }} />
    </div>
  )
}

/* ------------------------- Demo player ------------------------- */

function useScenePlayer(active: boolean) {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(1)
  const [playing, setPlaying] = useState(!reduce)
  useEffect(() => {
    if (!active || !playing) return
    const t = setInterval(() => setIdx((i) => (i + 1) % sceneList.length), 3600)
    return () => clearInterval(t)
  }, [active, playing])
  return { idx, setIdx, playing, setPlaying }
}

function SceneList({ idx, setIdx, playing, setPlaying }: ReturnType<typeof useScenePlayer>) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Kicker>Walkthrough</Kicker>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setPlaying(!playing)
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-silver hover:text-snow"
          aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <ol className="flex flex-col gap-0.5">
        {sceneList.map((s, i) => {
          const on = i === idx
          return (
            <li key={s.id}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx(i)
                  setPlaying(false)
                }}
                className={`relative w-full overflow-hidden rounded-xl px-3.5 py-1.5 text-left transition-colors ${on ? 'bg-white/[0.07] text-snow' : 'text-silver hover:bg-white/[0.03] hover:text-snow'}`}
                aria-current={on}
              >
                <span className="num mr-3 text-xs text-dim">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base">{s.label}</span>
                {on && playing && <motion.span key={idx} className="absolute bottom-0 left-0 h-[2px] bg-cyan" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3.6, ease: 'linear' }} />}
              </button>
            </li>
          )
        })}
      </ol>
      <AnimatePresence mode="wait">
        <motion.p key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 min-h-[2.8em] text-base leading-snug text-snow/90">
          {sceneList[idx].caption}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function VideoSlot() {
  if (pitchConfig.productVideoUrl) return null
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-line px-3.5 py-2.5 text-xs text-dim">
      <Film size={16} className="shrink-0" />
      <span>
        30-second product video slot — add file in <span className="font-mono">src/data/config.ts</span>
      </span>
    </div>
  )
}

function PrototypeButton() {
  if (!pitchConfig.prototypeUrl) return null
  return (
    <div className="flex flex-col gap-1">
      <Button href={pitchConfig.prototypeUrl} variant="outline">
        Launch real prototype <ExternalLink size={14} />
      </Button>
      <span className="pl-1 text-xs text-dim">Separate working prototype · opens in a new tab</span>
    </div>
  )
}

function Devices({ id, compact = false }: { id: SceneId; compact?: boolean }) {
  const video = pitchConfig.productVideoUrl
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: compact ? undefined : 'calc(min(48vh, 560px) * 1.95)' }}>
      {video ? (
        <video src={video} controls muted playsInline className="w-full rounded-2xl border border-line bg-black" />
      ) : (
        <>
          <div className="w-[82%]">
            <DesktopFrame>
              <DesktopScene id={id} />
            </DesktopFrame>
          </div>
          <div className="absolute bottom-[-4%] right-0 w-[24%]">
            <PhoneFrame>
              <PhoneScene id={id} />
            </PhoneFrame>
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------- Chapter ------------------------- */

export default function Ch04Reveal({ mode, step }: ChapterProps) {
  const reduce = useReducedMotion()
  const explore = mode === 'explore'
  const [phase, setPhase] = useState(explore || reduce || step >= 1 ? 3 : 0)

  useEffect(() => {
    if (step >= 1 || explore) setPhase(3)
  }, [step, explore])

  useEffect(() => {
    if (phase >= 3) return
    const next = [1700, 1000, 1300][phase]
    const t = setTimeout(() => setPhase((p) => Math.min(3, p + 1)), next)
    return () => clearTimeout(t)
  }, [phase])

  const player = useScenePlayer(step >= 1)

  if (explore) return <ExploreView />

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(45% 40% at 50% 50%, rgba(128,102,255,0.14), transparent 70%)' }} />
      {phase < 2 && <Fragments phase={phase} />}

      <LayoutGroup>
        <AnimatePresence mode="wait">
          {phase === 2 && (
            <motion.div key="burst" className="absolute inset-0 grid place-items-center" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LogoBurst />
            </motion.div>
          )}
          {phase === 3 && step === 0 && (
            <motion.div key="hero" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.5 }}>
              <Stage mode={mode}>
                <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
                  <div>
                    <div className="relative mb-6 h-20 w-20">
                      <div className="absolute -inset-10 rounded-full" style={{ background: 'radial-gradient(circle, rgba(128,102,255,0.5), transparent 65%)' }} />
                      <motion.img layoutId="orbit-reveal-logo" src="/brand/orbit-logo.webp" alt="Orbit logo" className="relative h-20 w-20" transition={{ duration: 0.8, ease }} />
                    </div>
                    <Kicker>
                      <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle}
                    </Kicker>
                    <h2 className="t-display mt-4">
                      <SplitHeadline text="Introducing Orbit." delay={0.15} />
                    </h2>
                    <Reveal delay={0.55}>
                      <p className="t-h2 mt-4 font-serif font-normal italic">
                        <span className="text-gradient">{pitchConfig.tagline}</span>
                      </p>
                    </Reveal>
                    <Reveal delay={0.8}>
                      <p className="t-lead mt-5 max-w-xl">One personalised discovery experience for the opportunities that matter to you.</p>
                    </Reveal>
                  </div>
                  <motion.div className="relative mx-auto w-[min(26vh,300px)] lg:w-[min(30vh,320px)]" initial={{ opacity: 0, y: 60, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1, ease, delay: 0.35 }}>
                    <PhoneFrame>
                      <PhoneScene id="recommended" />
                    </PhoneFrame>
                    <div className="mt-4 flex justify-center">
                      <IllustrativeBadge label="Illustrative interface" />
                    </div>
                  </motion.div>
                </div>
              </Stage>
            </motion.div>
          )}
          {phase === 3 && step >= 1 && (
            <motion.div key="demo" className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
              <Stage mode={mode}>
                <div className="grid items-center gap-8 lg:grid-cols-[minmax(280px,0.62fr)_1.6fr] lg:gap-12">
                  <div className="flex flex-col gap-4">
                    <div>
                      <Kicker>
                        <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> Introducing Orbit
                      </Kicker>
                      <h2 className="mt-2 text-[clamp(1.5rem,2.2vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
                        Everything you care about, <span className="font-serif font-normal italic text-gradient">in one feed.</span>
                      </h2>
                    </div>
                    <SceneList {...player} />
                    <div className="flex flex-col gap-2.5">
                      <PrototypeButton />
                      <VideoSlot />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center justify-end gap-2">
                      <IllustrativeBadge label="Illustrative interface" />
                      <span className="text-xs text-dim">Sample events · not a live integration</span>
                    </div>
                    <Devices id={sceneList[player.idx].id} />
                  </div>
                </div>
              </Stage>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      {phase < 3 && (
        <div className="absolute bottom-20 right-8 z-20">
          <Button variant="ghost" size="sm" onClick={() => setPhase(3)}>
            <SkipForward size={14} /> Skip animation
          </Button>
        </div>
      )}
    </div>
  )
}

function ExploreView() {
  const player = useScenePlayer(true)
  return (
    <Stage mode="explore">
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <img src="/brand/orbit-logo.webp" alt="Orbit logo" className="mb-6 h-16 w-16 drop-shadow-[0_0_40px_rgba(128,102,255,0.7)]" />
          <Kicker>
            <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle}
          </Kicker>
          <h2 className="t-display mt-4">Introducing Orbit.</h2>
          <p className="t-h2 mt-4 font-serif font-normal italic">
            <span className="text-gradient">{pitchConfig.tagline}</span>
          </p>
          <p className="t-lead mt-5 max-w-xl">One personalised discovery experience for the opportunities that matter to you.</p>
        </div>
        <div className="mx-auto w-[260px]">
          <PhoneFrame>
            <PhoneScene id="recommended" />
          </PhoneFrame>
        </div>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(260px,0.6fr)_1.6fr]">
        <div className="flex flex-col gap-5">
          <SceneList {...player} />
          <PrototypeButton />
          <VideoSlot />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-end gap-2">
            <IllustrativeBadge label="Illustrative interface" />
          </div>
          <Devices id={sceneList[player.idx].id} compact />
        </div>
      </div>

      <div className="mt-16 grid gap-4 lg:grid-cols-2">
        <Expandable title="What this interface is — and isn’t">
          The phone and desktop views are built in HTML/CSS for this pitch using illustrative sample events. They show the intended experience, not a deployed
          integration with any university system or event platform. A separate working prototype exists and can be opened with “Launch real prototype”.
        </Expandable>
        <Expandable title="Why Orbit links out to original registration pages">
          Orbit is a discovery layer. Registration, ticketing and capacity stay with the organiser’s own page, so Orbit does not need to replace existing
          systems — it helps students find opportunities before deadlines pass.
        </Expandable>
      </div>
      <SourceNote className="mt-6">Illustrative interface and sample events. Real prototype: R5 — {pitchConfig.prototypeUrl ?? 'not configured'}.</SourceNote>
    </Stage>
  )
}
