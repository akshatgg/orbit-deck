import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bell, Briefcase, CalendarDays, Clock, Compass, Lock, Mail, MapPin, MessageCircle, Search, SkipForward, Ticket, Users } from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Button, ChapterHeader, Expandable, IllustrativeBadge, Reveal, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { demoEvents, heroEvent } from '../data/events'
import { survey } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'student')!

/* ------------------------------------------------------------------ */
/* Timeline: ~7s of escalating discovery chaos (step 1).              */
/* ------------------------------------------------------------------ */

type Beat =
  | 'inbox'
  | 'chat'
  | 'careers'
  | 'platform'
  | 'tab1'
  | 'tab2'
  | 'calendar'
  | 'network'
  | 'deadline'
  | 'noise1'
  | 'noise2'
  | 'time'
  | 'hero'
  | 'closed'

const TIMELINE: { at: number; beat: Beat }[] = [
  { at: 150, beat: 'inbox' },
  { at: 800, beat: 'chat' },
  { at: 1450, beat: 'careers' },
  { at: 2100, beat: 'platform' },
  { at: 2500, beat: 'tab1' },
  { at: 2900, beat: 'tab2' },
  { at: 3300, beat: 'calendar' },
  { at: 3900, beat: 'network' },
  { at: 4450, beat: 'deadline' },
  { at: 4900, beat: 'noise1' },
  { at: 5300, beat: 'noise2' },
  { at: 5850, beat: 'time' },
  { at: 6400, beat: 'hero' },
  { at: 7200, beat: 'closed' },
]
const END = TIMELINE.length
const at = (b: Beat) => TIMELINE.findIndex((t) => t.beat === b) + 1

/* Notifications that accumulate (newest on top, the deadline gets buried). */
const NOTES: { beat: Beat; icon: typeof Bell; app: string; text: string; tone?: 'deadline' }[] = [
  { beat: 'inbox', icon: Mail, app: 'University inbox', text: '14 new messages' },
  { beat: 'chat', icon: MessageCircle, app: 'Cohort chat', text: '63 unread messages' },
  { beat: 'careers', icon: Briefcase, app: 'Careers portal', text: '3 new application deadlines' },
  { beat: 'calendar', icon: CalendarDays, app: 'Society calendar', text: '5 events added this week' },
  { beat: 'network', icon: Users, app: 'Professional network', text: '3 of your connections are attending an event near you' },
  { beat: 'deadline', icon: Clock, app: 'Events calendar', text: `${heroEvent.title} · RSVP by Wed`, tone: 'deadline' },
  { beat: 'noise1', icon: MessageCircle, app: 'Cohort chat', text: '“anyone got the link for thursday??”' },
  { beat: 'noise2', icon: Mail, app: 'University inbox', text: 'Weekly digest: 31 things happening' },
]

function useSequence(mode: ChapterProps['mode'], step: number) {
  const reduce = useReducedMotion()
  const [raw, setRaw] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const toEnd = mode === 'explore' || step >= 2 || reduce || skipped

  useEffect(() => {
    if (step !== 1 || toEnd) return
    const timers = [window.setTimeout(() => setRaw(0), 0), ...TIMELINE.map((t, i) => window.setTimeout(() => setRaw((p) => Math.max(p, i + 1)), t.at))]
    return () => timers.forEach(clearTimeout)
  }, [step, toEnd])

  // returning to step 0 re-arms the sequence (and the skip)
  useEffect(() => {
    if (step !== 0) return
    const id = window.setTimeout(() => {
      setRaw(0)
      setSkipped(false)
    }, 0)
    return () => clearTimeout(id)
  }, [step])

  const phase = toEnd ? END : step === 0 ? 0 : raw
  return { phase, skip: () => setSkipped(true) }
}

/* ------------------------------------------------------------------ */

export default function Ch01Student({ mode, step, setStep }: ChapterProps) {
  const { phase, skip } = useSequence(mode, step)
  const explore = mode === 'explore'
  const frozen = step >= 2
  const has = (b: Beat) => phase >= at(b)
  const running = step === 1 && phase < END

  const deskH = explore ? '560px' : 'clamp(300px, calc(100vh - 330px), 640px)'
  const deskStyle: CSSProperties = { height: deskH, width: `min(100%, calc(${deskH} * 1.95))` }

  return (
    <Stage mode={mode}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <ChapterHeader
          num={meta.num}
          kicker={meta.actTitle}
          title="Meet Sam."
          lead="A student with ambition. A calendar full of possibilities. And no single place to find them."
        />
        <div className="flex items-center gap-3 pb-1">
          <IllustrativeBadge label="Illustrative · fictional student" />
        </div>
      </div>

      <div className="relative mx-auto mt-6 sm:mt-8" style={deskStyle}>
        <Desktop phase={phase} has={has} frozen={frozen} step={step} explore={explore} setStep={setStep} />

        {/* Skip control */}
        <AnimatePresence>
          {running && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -bottom-11 right-0 z-[60]">
              <Button variant="ghost" size="sm" onClick={skip} aria-label="Skip animation">
                <SkipForward size={13} /> Skip animation
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {explore && (
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-silver">
            Sam is a fictional student and every interface above is a generic mock-up — not a real service, account or listing. The scene dramatises the
            pattern our research surfaced: opportunities exist, but they are spread across many places and are often found too late.
          </p>
          <div className="space-y-3">
            <Expandable title="What evidence sits behind this scene?">
              <p>
                In our exploratory student survey, <span className="num text-snow">{survey.findings[1].value} of {survey.findings[1].of}</span> respondents{' '}
                {survey.findings[1].text}, and <span className="num text-snow">{survey.findings[2].value} of {survey.findings[2].of}</span>{' '}
                {survey.findings[2].text}.
              </p>
              <p className="mt-2">Small convenience sample (Imperial-heavy) — it supports exploration, not generalisation.</p>
            </Expandable>
            <SourceNote>R1 · Orbit team — New Venture Creation report (survey n = 42). Scene and events are illustrative.</SourceNote>
          </div>
        </div>
      )}
    </Stage>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop                                                            */
/* ------------------------------------------------------------------ */

function Desktop({
  phase,
  has,
  frozen,
  step,
  explore,
  setStep,
}: {
  phase: number
  has: (b: Beat) => boolean
  frozen: boolean
  step: number
  explore: boolean
  setStep: (n: number) => void
}) {
  const order: Beat[] = ['inbox', 'chat', 'careers', 'platform', 'calendar', 'hero']
  const opened = order.filter(has)
  const focusZ = (b: Beat) => (opened.indexOf(b) + 1) * 2
  const focused = opened[opened.length - 1]
  const notes = NOTES.filter((n) => has(n.beat)).reverse().slice(0, 5)
  const late = has('time')
  const badge = (n: number) => (n > 0 ? n : 0)

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl border border-line bg-[#0b1020] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      {/* wallpaper */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_20%_10%,rgba(128,102,255,0.22),transparent_60%),radial-gradient(60%_70%_at_90%_90%,rgba(59,130,246,0.18),transparent_60%)]" />

      {/* menu bar */}
      <div className="absolute inset-x-0 top-0 z-[30] flex h-7 items-center justify-between border-b border-white/5 bg-black/35 px-3 font-mono text-[11px] text-silver backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-soft/70" /> Sam’s laptop
        </span>
        <span className="flex items-center gap-3">
          <Search size={11} />
          <motion.span
            key={late ? 'late' : 'early'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`num ${late ? 'text-snow' : ''}`}
          >
            {late ? 'Thu 09:14' : 'Mon 14:02'}
          </motion.span>
        </span>
      </div>

      {/* windows */}
      <Win show={has('inbox')} z={focusZ('inbox')} focused={focused === 'inbox'} frame={{ left: '2%', top: '9%', width: '35%', height: '55%' }} title="Inbox — student account" theme="light">
        <InboxBody />
      </Win>
      <Win show={has('chat')} z={focusZ('chat')} focused={focused === 'chat'} frame={{ left: '27%', top: '30%', width: '21%', height: '58%' }} title="Cohort chat · 214" theme="chat">
        <ChatBody />
      </Win>
      <Win show={has('careers')} z={focusZ('careers')} focused={focused === 'careers'} frame={{ left: '40%', top: '8%', width: '33%', height: '47%' }} title="Careers portal" theme="light2">
        <CareersBody />
      </Win>
      <Win show={has('platform')} z={focusZ('platform')} focused={focused === 'platform'} frame={{ left: '6%', top: '42%', width: '37%', height: '50%' }} title="Discover events near you" theme="dark">
        <PlatformBody tab={has('tab2') ? 2 : has('tab1') ? 1 : 0} />
      </Win>
      <Win show={has('calendar')} z={focusZ('calendar')} focused={focused === 'calendar'} frame={{ left: '55%', top: '40%', width: '30%', height: '50%' }} title="Society calendar · November" theme="light">
        <CalendarBody />
      </Win>

      {/* hero event page — raised above the freeze overlay */}
      <Win
        show={has('hero')}
        z={frozen ? 50 : focusZ('hero')}
        focused={focused === 'hero' || frozen}
        frame={{ left: '44%', top: '12%', width: '31%', height: '78%' }}
        title="Event page"
        theme="event"
        highlight={frozen}
      >
        <HeroBody closed={has('closed')} />
      </Win>

      {/* notification stack */}
      <div className="absolute right-[1.5%] top-[10%] z-[40] flex w-[22%] flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {notes.map((n) => (
            <motion.div
              key={n.beat}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: frozen ? 0.25 : 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease }}
              className={`rounded-lg border px-2.5 py-1.5 shadow-lg backdrop-blur-md ${
                n.tone === 'deadline' ? 'border-lavender/30 bg-[#232a44]/95' : 'border-white/10 bg-[#1a2133]/92'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[9.5px] font-medium uppercase tracking-wider text-dim">
                <n.icon size={10} /> {n.app}
                <span className="ml-auto normal-case tracking-normal">now</span>
              </div>
              <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-snow/90">{n.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* dock */}
      <div className="absolute bottom-2 left-1/2 z-[30] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur-md">
        {[
          { icon: Mail, n: has('noise2') ? 15 : has('inbox') ? 14 : 0 },
          { icon: MessageCircle, n: has('noise1') ? 64 : has('chat') ? 63 : 0 },
          { icon: Briefcase, n: has('careers') ? 3 : 0 },
          { icon: Compass, n: has('platform') ? 9 : 0 },
          { icon: CalendarDays, n: has('calendar') ? 5 : 0 },
          { icon: Users, n: has('network') ? 3 : 0 },
        ].map(({ icon: I, n }, i) => (
          <div key={i} className="relative grid h-7 w-7 place-items-center rounded-lg bg-white/8 text-silver">
            <I size={14} />
            <AnimatePresence>
              {badge(n) > 0 && (
                <motion.span
                  key={n}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="num absolute -right-1.5 -top-1.5 min-w-[16px] rounded-full bg-[#ff5a6e] px-1 text-center text-[9px] font-semibold leading-4 text-white"
                >
                  {n}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* step 0 — intro card */}
      <AnimatePresence>
        {step === 0 && !explore && (
          <motion.div
            className="absolute inset-0 z-[45] grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="glass-strong w-[min(420px,86%)] rounded-2xl p-6 text-center shadow-[0_30px_80px_-30px_rgba(128,102,255,0.6)]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[conic-gradient(from_200deg,#8066ff,#3b82f6,#3de0ea,#ffa36b,#8066ff)] p-[2px]">
                <div className="grid h-full w-full place-items-center rounded-full bg-navy text-2xl font-semibold">S</div>
              </div>
              <div className="mt-3 text-xl font-semibold">Sam</div>
              <div className="mt-1 text-base text-silver">MSc student · curious about startups &amp; networking</div>
              <div className="mt-3 flex justify-center">
                <IllustrativeBadge label="Illustrative persona" />
              </div>
              <Button size="lg" className="mt-5" onClick={() => setStep(1)}>
                <Search size={16} /> Find opportunities
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* step 2 — freeze */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[48] bg-[#04060c]"
        initial={false}
        animate={{ opacity: frozen ? 0.9 : 0 }}
        transition={{ duration: explore ? 0 : 1.1, ease }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-[49] bg-[radial-gradient(28%_45%_at_60%_50%,rgba(255,181,71,0.16),transparent_70%)]"
        initial={false}
        animate={{ opacity: frozen ? 1 : 0 }}
        transition={{ duration: 1.4, ease }}
      />
      <div className="pointer-events-none absolute left-[4%] top-1/2 z-[55] w-[37%] -translate-y-1/2">
        <Reveal show={frozen} delay={explore ? 0 : 0.6}>
          <p className="text-[clamp(1.4rem,2.6vw,2.9rem)] font-semibold leading-[1.08] tracking-tight text-snow">The opportunity existed.</p>
        </Reveal>
        <Reveal show={frozen} delay={explore ? 0 : 1.9}>
          <p className="mt-3 font-serif text-[clamp(1.4rem,2.6vw,2.9rem)] italic leading-[1.08] text-amber">The discovery didn’t happen in time.</p>
        </Reveal>
      </div>

      {/* sequence progress hairline */}
      {step === 1 && (
        <div className="absolute inset-x-0 bottom-0 z-[31] h-[2px] bg-white/5">
          <motion.div className="h-full bg-gradient-to-r from-violet via-blue to-cyan" animate={{ width: `${(phase / END) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Generic window frame                                               */
/* ------------------------------------------------------------------ */

type Theme = 'light' | 'light2' | 'dark' | 'chat' | 'event'
const themes: Record<Theme, { bar: string; body: string; text: string; border: string }> = {
  light: { bar: 'bg-[#dde2ea] text-[#4a5468]', body: 'bg-[#f3f5f9]', text: 'text-[#1a2233]', border: 'border-white/30' },
  light2: { bar: 'bg-[#1d2b4a] text-[#c8d3ea]', body: 'bg-[#f6f7fb]', text: 'text-[#1a2233]', border: 'border-white/20' },
  dark: { bar: 'bg-[#15161c] text-[#9aa0ad]', body: 'bg-[#1d1e26]', text: 'text-[#e8e9ef]', border: 'border-white/10' },
  chat: { bar: 'bg-[#232742] text-[#b9bfdc]', body: 'bg-[#171a2c]', text: 'text-[#e6e8f5]', border: 'border-white/10' },
  event: { bar: 'bg-[#101521] text-[#8d97ab]', body: 'bg-[#0d121d]', text: 'text-snow', border: 'border-white/12' },
}

function Win({
  show,
  z,
  focused,
  frame,
  title,
  theme,
  highlight = false,
  children,
}: {
  show: boolean
  z: number
  focused: boolean
  frame: CSSProperties
  title: string
  theme: Theme
  highlight?: boolean
  children: ReactNode
}) {
  const t = themes[theme]
  return (
    <motion.div
      className={`absolute flex flex-col overflow-hidden rounded-[10px] border ${t.border} ${t.body} ${t.text}`}
      style={{
        ...frame,
        zIndex: z,
        boxShadow: highlight
          ? '0 0 0 1.5px rgba(255,181,71,0.85), 0 0 80px -10px rgba(255,181,71,0.45), 0 30px 80px -20px rgba(0,0,0,0.9)'
          : focused
            ? '0 30px 70px -20px rgba(0,0,0,0.85)'
            : '0 14px 40px -18px rgba(0,0,0,0.8)',
      }}
      initial={false}
      animate={show ? { opacity: 1, scale: 1, y: 0, filter: focused ? 'brightness(1)' : 'brightness(0.82)' } : { opacity: 0, scale: 0.92, y: 18 }}
      transition={{ duration: 0.45, ease }}
      aria-hidden={!show}
    >
      <div className={`flex h-6 shrink-0 items-center gap-1.5 px-2.5 text-[10px] font-medium ${t.bar}`}>
        <span className="h-2 w-2 rounded-full bg-[#ff6159]/80" />
        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]/80" />
        <span className="h-2 w-2 rounded-full bg-[#28c941]/80" />
        <span className="ml-2 truncate">{title}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Window bodies — generic, fictional interfaces                      */
/* ------------------------------------------------------------------ */

function InboxBody() {
  const rows = [
    { from: 'Student Services', subj: 'Weekly digest: 31 things happening this week', unread: true },
    { from: 'Library', subj: 'Reminder: extended opening hours during exams', unread: false },
    { from: 'Programme Office', subj: 'Module feedback survey — closes Friday', unread: true },
    { from: 'Careers Service', subj: 'Spring insight programmes: deadlines approaching', unread: true },
    { from: 'Accommodation', subj: 'Planned fire-alarm test, Block C', unread: false },
    { from: 'Entrepreneurship Society', subj: 'Newsletter #7 — what’s on (scroll for events)', unread: true },
    { from: 'IT Services', subj: 'Password expiry notice', unread: false },
  ]
  return (
    <div className="flex h-full">
      <div className="hidden w-[24%] shrink-0 space-y-1 border-r border-black/5 bg-[#e8ecf2] p-2 text-[10px] text-[#5a6478] sm:block">
        <div className="rounded bg-[#d5dcea] px-1.5 py-0.5 font-semibold text-[#1a2233]">Inbox 14</div>
        <div className="px-1.5">Starred</div>
        <div className="px-1.5">Societies</div>
        <div className="px-1.5">Archive</div>
      </div>
      <div className="min-w-0 flex-1 divide-y divide-black/5">
        {rows.map((r, i) => (
          <div key={i} className={`px-2.5 py-1.5 text-[10.5px] ${r.unread ? 'bg-white' : ''}`}>
            <div className={`truncate ${r.unread ? 'font-semibold' : 'text-[#5a6478]'}`}>{r.from}</div>
            <div className="truncate text-[#5a6478]">{r.subj}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChatBody() {
  const msgs = [
    { me: false, who: 'Priya', t: 'anyone going to the thing on thursday?' },
    { me: false, who: 'Tom', t: 'which thing 😅' },
    { me: false, who: 'Priya', t: 'the founders one? or was it networking' },
    { me: false, who: 'Leo', t: 'there’s like 4 thursday things' },
    { me: false, who: 'Tom', t: 'link??' },
    { me: false, who: 'Priya', t: 'it was on some calendar page' },
  ]
  return (
    <div className="flex h-full flex-col justify-end gap-1.5 p-2">
      {msgs.map((m, i) => (
        <div key={i} className="max-w-[88%] rounded-xl rounded-bl-sm bg-[#2a2f52] px-2 py-1 text-[10.5px] leading-snug">
          <div className="text-[9px] font-semibold text-[#9fb0ff]">{m.who}</div>
          {m.t}
        </div>
      ))}
      <div className="mt-1 rounded-full bg-white/5 px-2 py-1 text-[9.5px] text-white/35">Message…</div>
    </div>
  )
}

function CareersBody() {
  const items = demoEvents.filter((e) => e.source === 'Careers portal' || e.tags.includes('Finance')).slice(0, 4)
  return (
    <div className="h-full">
      <div className="flex gap-1.5 border-b border-black/5 px-2.5 py-1.5 text-[9.5px]">
        {['All', 'Workshops', 'Employers', 'Deadlines'].map((f, i) => (
          <span key={f} className={`rounded-full px-2 py-0.5 ${i === 3 ? 'bg-[#1d2b4a] text-white' : 'bg-black/5 text-[#4a5468]'}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="divide-y divide-black/5">
        {items.map((e) => (
          <div key={e.id} className="flex items-center gap-2 px-2.5 py-1.5 text-[10.5px]">
            <div className="h-6 w-1 rounded-full" style={{ background: `hsl(${e.hue} 60% 55%)` }} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{e.title}</div>
              <div className="truncate text-[#5a6478]">
                {e.date} · {e.category}
              </div>
            </div>
            <span className="rounded border border-black/10 px-1.5 text-[9px] text-[#4a5468]">Apply</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlatformBody({ tab }: { tab: number }) {
  const tabs = ['For you', 'This weekend', 'Free']
  const pools = [
    demoEvents.filter((e) => e.scope === 'london'),
    demoEvents.filter((e) => e.day >= 4),
    demoEvents.filter((e) => e.tags.includes('Social') || e.tags.includes('Marketing')),
  ]
  const list = pools[tab].slice(0, 4)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-white/5 px-2 pt-1.5">
        {tabs.map((t, i) => (
          <span key={t} className={`relative px-2 pb-1.5 text-[10px] ${i === tab ? 'text-white' : 'text-white/40'}`}>
            {t}
            {i === tab && <motion.span layoutId="ch01-platform-tab" className="absolute inset-x-1 bottom-0 h-[2px] rounded bg-[#e05ac8]" />}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="grid flex-1 grid-cols-2 gap-1.5 p-2"
        >
          {list.map((e) => (
            <div key={e.id} className="overflow-hidden rounded-md bg-white/5">
              <div className="h-[38%] min-h-5" style={{ background: `linear-gradient(135deg, hsl(${e.hue} 70% 45%), hsl(${(e.hue + 50) % 360} 70% 30%))` }} />
              <div className="p-1.5 text-[9.5px] leading-tight">
                <div className="line-clamp-2 font-semibold">{e.title}</div>
                <div className="mt-0.5 text-white/45">{e.date}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CalendarBody() {
  const dots: Record<number, string[]> = { 2: ['#8066ff'], 4: ['#3b82f6', '#e05ac8'], 8: ['#3de0ea'], 10: ['#8066ff', '#ffa36b'], 11: ['#3b82f6'], 15: ['#e05ac8'], 16: ['#8066ff', '#3de0ea', '#3b82f6'], 17: ['#ffa36b'], 18: ['#8066ff'], 19: ['#3b82f6', '#e05ac8'], 23: ['#3de0ea'], 25: ['#8066ff'], 29: ['#3b82f6'] }
  return (
    <div className="h-full p-2">
      <div className="grid grid-cols-7 gap-px text-center text-[8.5px] font-semibold uppercase text-[#7a8498]">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-px overflow-hidden rounded bg-black/5">
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className={`h-[clamp(14px,3.2vh,30px)] bg-white p-0.5 text-left text-[8.5px] ${i === 16 ? 'ring-1 ring-inset ring-[#3b82f6]' : ''}`}>
            <span className="text-[#7a8498]">{(i % 30) + 1}</span>
            <div className="flex gap-0.5">
              {(dots[i] ?? []).map((c, j) => (
                <span key={j} className="h-1 w-1 rounded-full" style={{ background: c }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroBody({ closed }: { closed: boolean }) {
  const e = heroEvent
  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-[34%] shrink-0 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${e.hue} 65% 38%), hsl(${e.hue - 50} 70% 28%) 60%, #0d121d)` }}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">{e.category}</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <div className="text-[clamp(13px,1.25vw,20px)] font-semibold leading-tight">{e.title}</div>
        <div className="mt-2 space-y-1 text-[clamp(10px,0.8vw,12.5px)] text-silver">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} /> {e.date} · {e.time}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} /> {e.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Ticket size={12} /> {e.deadline}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-[clamp(10px,0.8vw,12.5px)] leading-snug text-silver/80">{e.description}</p>
        <div className="mt-auto">
          <motion.div
            initial={false}
            animate={closed ? { backgroundColor: 'rgba(255,181,71,0.12)', color: '#ffb547' } : { backgroundColor: '#f7f9fc', color: '#070a12' }}
            className="flex items-center justify-center gap-1.5 rounded-md border border-amber/0 py-1.5 text-[clamp(10px,0.85vw,13px)] font-semibold"
            style={closed ? { borderColor: 'rgba(255,181,71,0.4)' } : undefined}
          >
            {closed ? (
              <>
                <Lock size={12} /> Registration closed
              </>
            ) : (
              <>
                RSVP <ArrowRight size={12} />
              </>
            )}
          </motion.div>
          <div className="mt-1.5 text-center font-mono text-[9px] text-dim">via {e.source.toLowerCase()} · illustrative</div>
        </div>
      </div>

      {/* stamp */}
      <AnimatePresence>
        {closed && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[13%] -translate-x-1/2"
            initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            <div className="whitespace-nowrap rounded-md border-2 border-amber bg-[#1a1408]/85 px-3 py-1.5 font-mono text-[clamp(11px,1.15vw,18px)] font-bold tracking-[0.18em] text-amber shadow-[0_0_40px_-6px_rgba(255,181,71,0.6)]">
              REGISTRATION CLOSED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
