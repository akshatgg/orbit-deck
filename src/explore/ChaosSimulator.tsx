import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Briefcase, CalendarDays, Check, Compass, ExternalLink, Mail, MapPin, MessageCircle, RotateCcw, Search, SkipForward, Timer, Users, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button, IllustrativeBadge, Kicker, ease } from '../components/ui'
import { demoEvents, heroEvent, interests, type DemoEvent, type Interest } from '../data/events'

/**
 * The Opportunity Chaos Simulator — a conceptual demonstration of discovery
 * friction. Everything here is illustrative sample data.
 */

const LIMIT = 20 // seconds for the fragmented round
const TARGET = heroEvent

type Phase = 'idle' | 'chaos' | 'chaos-end' | 'orbit' | 'done'

interface RoundResult {
  found: boolean
  seconds: number | null
  sources: number
  checked: number
}

interface Item {
  id: string
  title: string
  meta: string
  target?: boolean
}

const ev = (e: DemoEvent): Item => ({ id: e.id, title: e.title, meta: `${e.date} · ${e.time} · ${e.location}`, target: e.id === TARGET.id })
const noise = (id: string, title: string, meta: string): Item => ({ id, title, meta })

const SOURCES: { id: string; label: string; icon: typeof Mail; style: string; items: Item[] }[] = [
  {
    id: 'inbox',
    label: 'University inbox',
    icon: Mail,
    style: 'bg-[#eef1f6] text-[#1a2233]',
    items: [
      noise('m1', 'Weekly digest: 31 things happening this week', 'Student Services · Mon'),
      noise('m2', 'Module feedback survey — closes Friday', 'Programme Office · Mon'),
      noise('m3', 'Reminder: extended library hours', 'Library · Sun'),
      noise('m4', 'Planned fire-alarm test, Block C', 'Accommodation · Sun'),
      noise('m5', 'Spring insight programmes: deadlines approaching', 'Careers Service · Fri'),
      noise('m6', 'Password expiry notice', 'IT Services · Fri'),
    ],
  },
  {
    id: 'chat',
    label: 'Cohort group chat',
    icon: MessageCircle,
    style: 'bg-[#171a2c] text-[#e6e8f5]',
    items: [
      noise('c1', '“anyone going to the thing on thursday?”', 'Priya · 63 unread'),
      noise('c2', '“which thing 😅”', 'Tom'),
      noise('c3', '“the founders one? or networking?”', 'Priya'),
      noise('c4', '“there’s like 4 thursday things”', 'Leo'),
      noise('c5', '“link??”', 'Tom'),
      noise('c6', '“it was on some calendar page”', 'Priya'),
    ],
  },
  {
    id: 'careers',
    label: 'Careers portal',
    icon: Briefcase,
    style: 'bg-[#f6f7fb] text-[#1a2233]',
    items: [
      ...demoEvents.filter((e) => e.source === 'Careers portal').map(ev),
      noise('k1', 'Employer presentation: Graduate analyst roles', 'Wed · Careers Centre'),
      noise('k2', 'CV clinic drop-in', 'Daily · Careers Centre'),
      noise('k3', 'Psychometric test practice', 'Online'),
    ],
  },
  {
    id: 'platform',
    label: 'External event platform',
    icon: Compass,
    style: 'bg-[#1d1e26] text-[#e8e9ef]',
    items: [...demoEvents.filter((e) => e.source === 'External event platform').map(ev), noise('p1', 'Rooftop Comedy Night', 'Sat · Dalston'), noise('p2', 'Sourdough for Beginners', 'Sun · Hackney')],
  },
  {
    id: 'network',
    label: 'Professional network',
    icon: Users,
    style: 'bg-[#141b2b] text-[#e6ebf5]',
    items: [
      ...demoEvents.filter((e) => e.source === 'Professional network event').map(ev),
      noise('n1', '3 connections are attending an event near you', 'Notification'),
      noise('n2', 'Webinar: Leadership in uncertain markets', 'Online · Thu'),
      noise('n3', 'You appeared in 12 searches this week', 'Notification'),
    ],
  },
  {
    id: 'calendar',
    label: 'University events calendar',
    icon: CalendarDays,
    style: 'bg-[#f3f5f9] text-[#1a2233]',
    items: [
      ...demoEvents.filter((e) => e.scope === 'university' && e.id !== TARGET.id && e.source !== 'Careers portal').map(ev),
      noise('u1', 'Chamber Choir rehearsal (open)', 'Thu · Great Hall'),
      noise('u2', 'Sports night: badminton', 'Thu · Sports Centre'),
      ev(TARGET), // buried near the bottom
      noise('u3', 'Open lecture: History of Cartography', 'Fri · Main Building'),
    ],
  },
]

export default function ChaosSimulator() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [chaos, setChaos] = useState<RoundResult | null>(null)
  const [orbit, setOrbit] = useState<RoundResult | null>(null)

  const reset = () => {
    setPhase('idle')
    setChaos(null)
    setOrbit(null)
  }
  const skipAll = () => {
    if (!chaos) setChaos({ found: false, seconds: null, sources: 0, checked: 0 })
    if (!orbit) setOrbit({ found: false, seconds: null, sources: 0, checked: 0 })
    setPhase('done')
  }

  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-4xl">
          <Kicker>Interactive · Explore only</Kicker>
          <h2 className="t-h2 mt-4">The Opportunity Chaos Simulator</h2>
          <p className="t-lead mt-4 max-w-3xl">
            Try to find one specific opportunity across scattered sources against the clock. Then try again with a single filtered feed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IllustrativeBadge label="Illustrative sample data" />
          {phase !== 'idle' && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw size={13} /> Reset
            </Button>
          )}
          {phase !== 'done' && (
            <Button variant="ghost" size="sm" onClick={skipAll}>
              <SkipForward size={13} /> Skip to comparison
            </Button>
          )}
        </div>
      </div>

      <Disclaimer className="mt-6" />

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <Pane key="idle">
              <Brief onStart={() => setPhase('chaos')} />
            </Pane>
          )}
          {phase === 'chaos' && (
            <Pane key="chaos">
              <ChaosRound
                onEnd={(r) => {
                  setChaos(r)
                  setPhase('chaos-end')
                }}
              />
            </Pane>
          )}
          {phase === 'chaos-end' && chaos && (
            <Pane key="chaos-end">
              <Interlude result={chaos} onNext={() => setPhase('orbit')} />
            </Pane>
          )}
          {phase === 'orbit' && (
            <Pane key="orbit">
              <OrbitRound
                onEnd={(r) => {
                  setOrbit(r)
                  setPhase('done')
                }}
              />
            </Pane>
          )}
          {phase === 'done' && (
            <Pane key="done">
              <Comparison chaos={chaos} orbit={orbit} onReset={reset} />
            </Pane>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Pane({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
      {children}
    </motion.div>
  )
}

function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm leading-relaxed text-silver ${className}`}>
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber" />
      <p>
        <span className="font-medium text-snow">Conceptual demonstration of discovery friction — not a scientific experiment.</span> The sources, events and timer
        are invented for illustration. Nothing here measures or claims a real time saving, and results from one run say nothing about real students.
      </p>
    </div>
  )
}

function TaskCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="t-kicker">Your task</div>
      <p className="mt-2 text-xl font-semibold leading-snug">Find an entrepreneurship networking evening on campus this week — and RSVP before places run out.</p>
      <p className="mt-2 text-sm text-silver">Click the event when you find it.</p>
    </div>
  )
}

function Brief({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
      <TaskCard />
      <div>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-silver">
              <s.icon size={14} /> {s.label}
            </span>
          ))}
        </div>
        <p className="mt-4 text-silver">
          {SOURCES.length} generic sources · <span className="num text-snow">{LIMIT}s</span> on the clock
        </p>
        <Button size="lg" className="mt-6" onClick={onStart}>
          <Search size={16} /> Try finding an event
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Round 1 — fragmented sources                                       */
/* ------------------------------------------------------------------ */

function useClock(running: boolean) {
  const start = useRef(performance.now())
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!running) return
    start.current = performance.now() - elapsed * 1000
    const id = window.setInterval(() => setElapsed((performance.now() - start.current) / 1000), 200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])
  return elapsed
}

function ChaosRound({ onEnd }: { onEnd: (r: RoundResult) => void }) {
  const [active, setActive] = useState(SOURCES[0].id)
  const [visited, setVisited] = useState<Set<string>>(() => new Set([SOURCES[0].id]))
  const [checked, setChecked] = useState<Set<string>>(() => new Set())
  const [miss, setMiss] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const elapsed = useClock(!done)
  const left = Math.max(0, LIMIT - elapsed)

  const finish = (found: boolean) => {
    if (done) return
    setDone(true)
    window.setTimeout(() => onEnd({ found, seconds: found ? elapsed : null, sources: visited.size, checked: checked.size + (found ? 1 : 0) }), found ? 900 : 700)
  }

  useEffect(() => {
    if (left <= 0) finish(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const src = SOURCES.find((s) => s.id === active)!
  const pct = (left / LIMIT) * 100

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <TaskCard />
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-silver">
              <Timer size={15} /> Time left
            </span>
            <span className={`num text-3xl ${left < 6 ? 'text-amber' : 'text-snow'}`}>{left.toFixed(1)}s</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className={`h-full rounded-full transition-[width] duration-200 ${left < 6 ? 'bg-amber' : 'bg-gradient-to-r from-violet to-cyan'}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-silver">
            <div>
              Sources opened <span className="num block text-xl text-snow">{visited.size}</span>
            </div>
            <div>
              Items checked <span className="num block text-xl text-snow">{checked.size}</span>
            </div>
          </div>
          <button type="button" onClick={() => finish(false)} className="mt-4 text-xs text-dim underline-offset-2 hover:text-silver hover:underline">
            Give up
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-[#0b1020]">
        {/* tab strip */}
        <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-line bg-black/30 px-2 pt-2" role="tablist">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === active}
              onClick={() => {
                setActive(s.id)
                setVisited((v) => new Set(v).add(s.id))
                setMiss(null)
              }}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-[13px] transition-colors ${s.id === active ? 'bg-white/10 text-snow' : 'text-silver hover:bg-white/5'}`}
            >
              <s.icon size={13} /> {s.label}
              {!visited.has(s.id) && <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a6e]" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2 }}
            className={`scrollbar-thin h-[380px] overflow-y-auto ${src.style}`}
          >
            <div className="sticky top-0 z-10 border-b border-current/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider opacity-60 backdrop-blur" style={{ background: 'inherit' }}>
              {src.label} · {src.items.length} items
            </div>
            <ul>
              {src.items.map((it) => {
                const wasChecked = checked.has(it.id)
                return (
                  <li key={it.id}>
                    <motion.button
                      type="button"
                      disabled={done}
                      animate={miss === it.id ? { x: [0, -5, 5, -3, 0] } : { x: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        setChecked((c) => new Set(c).add(it.id))
                        if (it.target) finish(true)
                        else setMiss(it.id)
                      }}
                      className={`flex w-full items-center gap-3 border-b border-current/[0.07] px-4 py-3.5 text-left transition-colors hover:bg-current/[0.04] ${wasChecked && !it.target ? 'opacity-45' : ''} ${done && it.target ? 'bg-st-supported/15' : ''}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-medium">{it.title}</div>
                        <div className="truncate text-[13px] opacity-60">{it.meta}</div>
                      </div>
                      {miss === it.id && <span className="shrink-0 text-xs opacity-70">Not this one</span>}
                      {wasChecked && it.target && <Check size={18} className="shrink-0 text-st-supported" />}
                      {wasChecked && !it.target && miss !== it.id && <X size={14} className="shrink-0 opacity-50" />}
                    </motion.button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Interlude({ result, onNext }: { result: RoundResult; onNext: () => void }) {
  return (
    <div className="glass mx-auto max-w-3xl rounded-3xl p-8 text-center">
      <div className="t-kicker">Round one</div>
      <h3 className="t-h2 mt-3">{result.found ? 'Found it — eventually.' : 'Time’s up.'}</h3>
      <p className="t-lead mx-auto mt-3 max-w-xl">
        {result.found
          ? `You found it after opening ${result.sources} of ${SOURCES.length} sources and checking ${result.checked} items.`
          : `You opened ${result.sources} of ${SOURCES.length} sources and checked ${result.checked} items. It was in the ${SOURCES.find((s) => s.items.some((i) => i.target))!.label.toLowerCase()}, near the bottom.`}
      </p>
      <Button size="lg" className="mt-7" onClick={onNext}>
        Try with Orbit <ArrowRight size={16} />
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Round 2 — one filtered feed                                        */
/* ------------------------------------------------------------------ */

function OrbitRound({ onEnd }: { onEnd: (r: RoundResult) => void }) {
  const [picked, setPicked] = useState<Set<Interest>>(() => new Set())
  const [campus, setCampus] = useState(false)
  const [checked, setChecked] = useState(0)
  const [found, setFound] = useState(false)
  const elapsed = useClock(!found)

  const feed = useMemo(() => {
    const score = (e: DemoEvent) => e.tags.filter((t) => picked.has(t)).length
    return demoEvents
      .filter((e) => (campus ? e.scope === 'university' : true))
      .filter((e) => (picked.size ? score(e) > 0 : true))
      .sort((a, b) => score(b) - score(a) || a.day - b.day)
  }, [picked, campus])

  const toggle = (i: Interest) =>
    setPicked((p) => {
      const n = new Set(p)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <TaskCard />
        <div className="glass rounded-2xl p-5">
          <div className="t-kicker">Your interests</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((i) => {
              const on = picked.has(i)
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(i)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${on ? 'border-violet/70 bg-violet/25 text-snow' : 'border-line text-silver hover:border-violet/40 hover:text-snow'}`}
                >
                  {i}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex rounded-full border border-line p-1 text-sm">
            {[
              { v: false, l: 'University + London' },
              { v: true, l: 'On campus only' },
            ].map((o) => (
              <button
                key={o.l}
                type="button"
                aria-pressed={campus === o.v}
                onClick={() => setCampus(o.v)}
                className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${campus === o.v ? 'bg-white/10 text-snow' : 'text-silver'}`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-dim">Hint: try Entrepreneurship + Networking, on campus.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-navy/60">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em]">
            <img src="/brand/orbit-logo.webp" alt="" className="h-5 w-5" /> ORBIT
          </span>
          <span className="num text-sm text-silver">
            {feed.length} of {demoEvents.length} events
          </span>
        </div>
        <motion.ul layout className="scrollbar-thin h-[380px] overflow-y-auto p-3">
          <AnimatePresence initial={false}>
            {feed.map((e) => {
              const isT = e.id === TARGET.id
              return (
                <motion.li key={e.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3, ease }} className="mb-2">
                  <button
                    type="button"
                    disabled={found}
                    onClick={() => {
                      setChecked((c) => c + 1)
                      if (isT) {
                        setFound(true)
                        window.setTimeout(() => onEnd({ found: true, seconds: elapsed, sources: 1, checked: checked + 1 }), 900)
                      }
                    }}
                    className={`glass flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:border-violet/50 ${found && isT ? '!border-st-supported/60 !bg-st-supported/10' : ''}`}
                  >
                    <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: `hsl(${e.hue} 70% 60%)` }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[15px] font-medium text-snow">{e.title}</div>
                      <div className="flex items-center gap-1.5 truncate text-[13px] text-silver">
                        <MapPin size={12} /> {e.date} · {e.location}
                      </div>
                    </div>
                    <div className="hidden shrink-0 gap-1 sm:flex">
                      {e.tags.slice(0, 2).map((t) => (
                        <span key={t} className={`rounded-full px-2 py-0.5 text-[11px] ${picked.has(t) ? 'bg-violet/20 text-violet-soft' : 'bg-white/5 text-dim'}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                    {found && isT && <Check size={18} className="shrink-0 text-st-supported" />}
                  </button>
                </motion.li>
              )
            })}
          </AnimatePresence>
          {feed.length === 0 && <li className="p-6 text-center text-sm text-dim">No events match — try fewer filters.</li>}
        </motion.ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Comparison — descriptive only                                      */
/* ------------------------------------------------------------------ */

function Comparison({ chaos, orbit, onReset }: { chaos: RoundResult | null; orbit: RoundResult | null; onReset: () => void }) {
  const fmt = (r: RoundResult | null) =>
    !r || (r.sources === 0 && r.checked === 0 && !r.found)
      ? { outcome: 'Skipped', time: '—', sources: '—', checked: '—' }
      : {
          outcome: r.found ? 'Found' : 'Not found in time',
          time: r.seconds != null ? `${r.seconds.toFixed(1)}s` : `> ${LIMIT}s`,
          sources: String(r.sources),
          checked: String(r.checked),
        }
  const a = fmt(chaos)
  const b = fmt(orbit)
  const rows: { label: string; a: string; b: string }[] = [
    { label: 'Outcome', a: a.outcome, b: b.outcome },
    { label: 'Places you had to look', a: a.sources === '—' ? '—' : `${a.sources} of ${SOURCES.length}`, b: b.sources === '—' ? '—' : `${b.sources} feed` },
    { label: 'Items you checked', a: a.checked, b: b.checked },
    { label: 'Time in this run', a: a.time, b: b.time },
  ]

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: 'Fragmented sources', sub: `${SOURCES.length} generic tabs, one buried listing`, tone: 'border-amber/25', col: 'a' as const },
          { title: 'One filtered feed', sub: 'Interest chips + campus filter', tone: 'border-violet/35', col: 'b' as const },
        ].map((c) => (
          <div key={c.title} className={`glass rounded-2xl border p-6 ${c.tone}`}>
            <div className="t-kicker">{c.col === 'a' ? 'Round one' : 'Round two'}</div>
            <h3 className="mt-2 text-2xl font-semibold">{c.title}</h3>
            <p className="text-sm text-silver">{c.sub}</p>
            <dl className="mt-5 divide-y divide-line">
              {rows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-sm text-silver">{r.label}</dt>
                  <dd className="num text-lg text-snow">{r[c.col]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <p className="text-sm leading-relaxed text-silver">
          What this shows, descriptively: the same illustrative event was reachable either by opening several differently-shaped sources, or by narrowing a
          single feed by interest. It does not show how long real students take, that Orbit saves time, or that anyone would attend. In the product, the event
          would open at its <span className="inline-flex items-center gap-1 text-snow">original registration source <ExternalLink size={12} /></span>.
        </p>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw size={14} /> Run it again
        </Button>
      </div>
    </div>
  )
}
