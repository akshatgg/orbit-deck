import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowUpRight, Bookmark, BookmarkCheck, CalendarDays, Check, Clock, ExternalLink, Lock, MapPin, Sparkles, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { EventArt, OrbitMark, P, SegTabs } from '../components/product/OrbitUI'
import { Badge, Button, Expandable, IllustrativeBadge, Kicker, SourceNote, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { demoEvents, interests, type DemoEvent, type Interest, type Scope } from '../data/events'
import { interviews } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'product')!

const DEFAULT_INTERESTS: Interest[] = ['Consulting', 'Technology', 'AI']
const PRESET: Interest[] = ['Networking', 'Entrepreneurship']
const DEMO_SAVE = 'e3'
const TABS = ['For You', 'This Week', 'Calendar'] as const
type Tab = (typeof TABS)[number]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const byId = (id: string) => demoEvents.find((e) => e.id === id)!
const stop = (e: React.MouseEvent) => e.stopPropagation()

/* ======================= App state ======================= */

function useOrbitApp(step: number) {
  const [selected, setSelected] = useState<Interest[]>(DEFAULT_INTERESTS)
  const [scope, setScope] = useState<Scope>('university')
  const [saved, setSaved] = useState<string[]>([])
  const [tab, setTab] = useState<Tab>('For You')
  const [detail, setDetail] = useState<string | null>(null)
  const [original, setOriginal] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Presenter steps set up a known state; the audience can still interact freely afterwards.
  useEffect(() => {
    setOriginal(null)
    setTab('For You')
    if (step <= 0) {
      setSelected(DEFAULT_INTERESTS)
      setScope('university')
      setSaved([])
      setDetail(null)
      return
    }
    setSelected(PRESET)
    if (step === 1) {
      setSaved([])
      setDetail(null)
      return
    }
    // step 2 — demonstrate saving an event, then show it in the week + details
    setDetail(DEMO_SAVE)
    const t = setTimeout(() => {
      setSaved((s) => (s.includes(DEMO_SAVE) ? s : [...s, DEMO_SAVE, 'e14']))
      setToast(DEMO_SAVE)
    }, 650)
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const feed = useMemo(() => {
    const score = (e: DemoEvent) => e.tags.filter((t) => selected.includes(t)).length
    return demoEvents
      .filter((e) => scope === 'london' || e.scope === 'university')
      .filter((e) => selected.length === 0 || score(e) > 0)
      .sort((a, b) => score(b) - score(a) || a.day - b.day || a.time.localeCompare(b.time))
  }, [selected, scope])

  const toggleInterest = (i: Interest) => setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))
  const toggleSave = (id: string) => {
    if (saved.includes(id)) setSaved((s) => s.filter((x) => x !== id))
    else {
      setSaved((s) => (s.includes(id) ? s : [...s, id]))
      setToast(id)
    }
  }

  return { selected, setSelected, toggleInterest, scope, setScope, saved, toggleSave, tab, setTab, detail, setDetail, original, setOriginal, toast, feed }
}
type App = ReturnType<typeof useOrbitApp>

/* ======================= Pieces ======================= */

function StepTag({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 text-[13px] font-medium" style={{ color: P.sub }}>
      <span className="num grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[11px] text-snow">{n}</span>
      {children}
    </div>
  )
}

function InterestChips({ app }: { app: App }) {
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map((i) => {
        const on = app.selected.includes(i)
        return (
          <button
            key={i}
            onClick={(e) => {
              stop(e)
              app.toggleInterest(i)
            }}
            aria-pressed={on}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors"
            style={{ background: on ? '#f4f5f7' : P.track, color: on ? '#0b0c10' : P.sub, border: `1px solid ${on ? 'transparent' : P.border}` }}
          >
            {on && <Check size={13} />}
            {i}
          </button>
        )
      })}
    </div>
  )
}

function ScopeToggle({ app }: { app: App }) {
  return (
    <SegTabs
      tabs={['My University', 'Across London'] as const}
      active={app.scope === 'university' ? 'My University' : 'Across London'}
      onChange={(t) => app.setScope(t === 'My University' ? 'university' : 'london')}
      size="sm"
      className="w-[290px]"
    />
  )
}

function SaveBtn({ app, id, full = false }: { app: App; id: string; full?: boolean }) {
  const on = app.saved.includes(id)
  return (
    <button
      onClick={(e) => {
        stop(e)
        app.toggleSave(id)
      }}
      aria-pressed={on}
      aria-label={on ? 'Remove from saved' : 'Save event'}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full text-[14px] font-medium transition-colors ${full ? 'px-4 py-2' : 'px-3 py-1.5'}`}
      style={{ background: on ? 'rgba(123,147,255,0.18)' : P.track, color: on ? '#b9c6ff' : P.text, border: `1px solid ${on ? 'rgba(123,147,255,0.5)' : P.border}` }}
    >
      {on ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {on ? 'Saved' : 'Save'}
    </button>
  )
}

function OriginalBtn({ app, id }: { app: App; id: string }) {
  return (
    <button
      onClick={(e) => {
        stop(e)
        app.setOriginal(id)
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[14px] font-semibold text-black hover:bg-white/90"
    >
      View original event <ArrowUpRight size={14} />
    </button>
  )
}

function EventCard({ app, e }: { app: App; e: DemoEvent }) {
  const matched = e.tags.filter((t) => app.selected.includes(t))
  const active = app.detail === e.id
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease }}
      onClick={(ev) => {
        stop(ev)
        app.setDetail(e.id)
      }}
      className="cursor-pointer overflow-hidden rounded-[20px]"
      style={{ background: P.surface, border: `1px solid ${active ? 'rgba(123,147,255,0.6)' : P.border}`, boxShadow: active ? '0 0 40px -16px rgba(123,147,255,0.8)' : undefined }}
    >
      <EventArt hue={e.hue} className="h-[64px]">
        <div className="absolute inset-x-3 top-2.5 flex items-center justify-between gap-2">
          <span className="rounded-full px-2.5 py-0.5 text-[12px] font-medium" style={{ background: 'rgba(10,12,16,0.55)', color: P.text }}>
            {e.category}
          </span>
          <span className="truncate rounded-full px-2.5 py-0.5 text-[12px]" style={{ background: 'rgba(10,12,16,0.55)', color: '#d8dbe2' }}>
            {e.scope === 'university' ? 'Campus' : 'External'}
          </span>
        </div>
      </EventArt>
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 text-[14px] font-medium" style={{ color: P.date }}>
          {e.date} · {e.time}
        </div>
        <div className="mt-0.5 text-[17px] font-semibold leading-snug" style={{ color: P.text }}>
          {e.title}
        </div>
        <div className="mt-1 flex items-center gap-1.5 truncate text-[13.5px]" style={{ color: P.sub }}>
          <MapPin size={13} className="shrink-0" /> <span className="truncate">{e.location}</span>
        </div>
        <div className="mt-0.5 truncate text-[13.5px]" style={{ color: P.sub }}>
          Source: {e.source}
        </div>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-snug" style={{ color: '#c4c8d0' }}>
          {e.description}
        </p>
        {matched.length > 0 && (
          <div className="mt-1.5 text-[12.5px]" style={{ color: P.sub }}>
            Picked because you’re into <span style={{ color: P.text }}>{matched.join(' & ').toLowerCase()}</span>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SaveBtn app={app} id={e.id} />
          <OriginalBtn app={app} id={e.id} />
        </div>
      </div>
    </motion.div>
  )
}

function Feed({ app }: { app: App }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <StepTag n={3}>Your feed</StepTag>
        <span className="text-[13px]" style={{ color: P.sub }}>
          <span className="num text-snow">{app.feed.length}</span> of {demoEvents.length} illustrative events match
        </span>
      </div>
      {app.feed.length === 0 ? (
        <div className="grid h-40 place-items-center rounded-2xl text-[15px]" style={{ border: `1px dashed ${P.border}`, color: P.sub }}>
          No matches — try another interest or switch to Across London.
        </div>
      ) : (
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {app.feed.map((e) => (
                <EventCard key={e.id} app={app} e={e} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}
    </div>
  )
}

function ThisWeek({ app }: { app: App }) {
  return (
    <div className="flex flex-col gap-4">
      {DAYS.map((d, i) => {
        const list = app.feed.filter((e) => e.day === i)
        if (!list.length) return null
        return (
          <div key={d}>
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: P.sub }}>
              {d} {17 + i} Nov
            </div>
            <div className="flex flex-col gap-2">
              {list.map((e) => (
                <div
                  key={e.id}
                  onClick={(ev) => {
                    stop(ev)
                    app.setDetail(e.id)
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl p-2.5"
                  style={{ background: P.surface, border: `1px solid ${app.detail === e.id ? 'rgba(123,147,255,0.6)' : P.border}` }}
                >
                  <EventArt hue={e.hue} className="h-12 w-12 shrink-0 rounded-xl" rings={false} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px]" style={{ color: P.date }}>
                      {e.time} · {e.category}
                    </div>
                    <div className="truncate text-[15.5px] font-semibold" style={{ color: P.text }}>
                      {e.title}
                    </div>
                  </div>
                  <SaveBtn app={app} id={e.id} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {app.feed.length === 0 && <div style={{ color: P.sub }}>No matching events this week.</div>}
    </div>
  )
}

function WeekGrid({ app, compact = false }: { app: App; compact?: boolean }) {
  const saved = app.saved.map(byId)
  return (
    <div className={`grid grid-cols-7 ${compact ? 'gap-1' : 'gap-2'}`}>
      {DAYS.map((d, i) => {
        const list = saved.filter((e) => e.day === i)
        return (
          <div key={d} className={`rounded-xl ${compact ? 'min-h-[86px] p-1' : 'min-h-[300px] p-2'}`} style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <div className={`mb-1.5 text-center ${compact ? 'text-[11px]' : 'text-[13px]'}`} style={{ color: P.sub }}>
              {d}
              <div className={`${compact ? 'text-[13px]' : 'text-[17px]'} font-semibold`} style={{ color: P.text }}>
                {17 + i}
              </div>
            </div>
            <AnimatePresence>
              {list.map((e) => (
                <motion.button
                  key={e.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={(ev) => {
                    stop(ev)
                    app.setDetail(e.id)
                  }}
                  className={`mb-1 block w-full overflow-hidden rounded-lg text-left ${compact ? 'h-5' : 'p-2'}`}
                  style={{ background: `hsl(${e.hue} 60% 55% / 0.35)`, border: `1px solid hsl(${e.hue} 70% 65% / 0.6)` }}
                  title={e.title}
                >
                  {!compact && (
                    <>
                      <div className="text-[12px]" style={{ color: '#dfe5ff' }}>
                        {e.time}
                      </div>
                      <div className="text-[13px] font-semibold leading-snug" style={{ color: P.text }}>
                        {e.title}
                      </div>
                    </>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function DetailPanel({ app }: { app: App }) {
  const id = app.detail ?? app.saved[0] ?? app.feed[0]?.id
  const e = id ? byId(id) : null
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-[13px] font-medium" style={{ color: P.sub }}>
          Event details
        </div>
        <AnimatePresence mode="wait">
          {e ? (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-[20px]" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
              <EventArt hue={e.hue} className="h-[48px]" />
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full px-2.5 py-0.5 text-[12px]" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.45)', color: '#9dbbff' }}>
                    {e.category}
                  </span>
                  {e.tags.filter((t) => t !== e.category).map((t) => (
                    <span key={t} className="rounded-full px-2.5 py-0.5 text-[12px]" style={{ border: `1px solid ${P.border}`, color: P.sub }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[18px] font-semibold leading-snug" style={{ color: P.text }}>
                  {e.title}
                </div>
                <div className="mt-2 flex flex-col gap-1 text-[13.5px]" style={{ color: P.sub }}>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} /> {e.date} · {e.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {e.location}
                  </span>
                  {e.deadline && (
                    <span className="flex items-center gap-1.5 text-amber">
                      <Clock size={14} /> {e.deadline}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] leading-snug" style={{ color: '#c4c8d0' }}>
                  {e.description}
                </p>
                <div className="mt-1 text-[12.5px]" style={{ color: P.sub }}>
                  Source: {e.source}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SaveBtn app={app} id={e.id} />
                  <OriginalBtn app={app} id={e.id} />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl p-4 text-[14px]" style={{ border: `1px dashed ${P.border}`, color: P.sub }}>
              Select an event to see details.
            </div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-[13px] font-medium" style={{ color: P.sub }}>
          <span>Your week · saved</span>
          <span className="num text-snow">{app.saved.length}</span>
        </div>
        <WeekGrid app={app} compact />
      </div>
    </div>
  )
}

function OriginalModal({ app }: { app: App }) {
  const e = app.original ? byId(app.original) : null
  return (
    <AnimatePresence>
      {e && (
        <motion.div
          className="absolute inset-0 z-30 grid place-items-center p-6"
          style={{ background: 'rgba(5,7,12,0.72)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(ev) => {
            stop(ev)
            app.setOriginal(null)
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Original registration page (illustrative)"
            initial={{ y: 30, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            onClick={stop}
            className="w-full max-w-[560px] overflow-hidden rounded-2xl"
            style={{ background: '#f5f6f8', color: '#14161b' }}
          >
            <div className="flex items-center gap-2 border-b border-black/10 bg-[#e8eaee] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
              <span className="flex flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[12px] text-black/50">
                <Lock size={11} /> organiser’s registration page
              </span>
              <button onClick={() => app.setOriginal(null)} aria-label="Close" className="rounded-full p-1 text-black/50 hover:text-black">
                <X size={16} />
              </button>
            </div>
            <div className="bg-amber/20 px-5 py-2.5 text-[13px] font-medium text-[#6b4300]">
              Original registration page — illustrative; in production this links to the organiser’s own page.
            </div>
            <div className="p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">{e.source}</div>
              <div className="mt-1 text-[24px] font-semibold leading-tight">{e.title}</div>
              <div className="mt-2 text-[14px] text-black/60">
                {e.date} · {e.time} · {e.location}
              </div>
              <p className="mt-3 text-[15px] text-black/75">{e.description}</p>
              {e.deadline && <p className="mt-2 text-[14px] font-medium text-[#a15c00]">{e.deadline}</p>}
              <div className="mt-5 flex items-center gap-3">
                <span className="rounded-lg bg-black/85 px-5 py-2.5 text-[14px] font-semibold text-white/90">Register (organiser’s form)</span>
                <span className="text-[12.5px] text-black/50">Registration stays with the organiser — Orbit only links here.</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FutureConcepts({ expanded = false }: { expanded?: boolean }) {
  const items = [
    { icon: Users, title: 'Orbit Circles', body: 'Private groups: share events and see friends’ interests.' },
    { icon: Sparkles, title: 'Orbit Communities', body: 'Interest-based communities that gather around events.' },
  ]
  return (
    <div className="rounded-2xl p-3" style={{ border: `1px dashed rgba(183,168,255,0.35)`, background: 'rgba(128,102,255,0.05)' }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold" style={{ color: P.text }}>
          Future concepts
        </span>
        <span className="rounded-full border border-violet/40 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-violet-soft">Not in MVP</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <div key={it.title} className="flex gap-2.5">
            <it.icon size={15} className="mt-0.5 shrink-0 text-violet-soft" />
            <div>
              <div className="text-[13.5px] font-medium" style={{ color: P.text }}>
                {it.title}
              </div>
              <div className="text-[12.5px] leading-snug" style={{ color: P.sub }}>
                {it.body}
              </div>
            </div>
          </div>
        ))}
      </div>
      {expanded && (
        <p className="mt-3 text-[12.5px] leading-snug" style={{ color: P.sub }}>
          Rationale: friends influenced event discovery in {interviews.findings[1].value} of {interviews.findings[1].of} interviews. These are concepts to test later, not confirmed
          features.
        </p>
      )}
    </div>
  )
}

/* ======================= App window ======================= */

function OrbitApp({ app, mode, step, setStep }: { app: App; mode: 'present' | 'explore'; step: number; setStep: (n: number) => void }) {
  const presetActive = PRESET.every((p) => app.selected.includes(p)) && app.selected.length === PRESET.length
  const applyPreset = () => {
    if (mode === 'present' && step < 1) setStep(1)
    else {
      app.setSelected(PRESET)
      app.setTab('For You')
    }
  }
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[28px]"
      style={{
        background: P.screen,
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 50px 140px -50px rgba(128,102,255,0.55)',
        height: mode === 'present' ? 'clamp(440px, calc(100vh - 290px), 820px)' : 860,
        fontFamily: 'var(--font-sans)',
      }}
      onClick={stop}
    >
      {/* top bar */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3" style={{ borderBottom: `1px solid ${P.border}` }}>
        <OrbitMark size={26} />
        <SegTabs tabs={TABS} active={app.tab} onChange={app.setTab} size="sm" className="w-[330px]" />
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-[12px]" style={{ color: P.sub }}>
              <span className="num mr-1 inline-grid h-4 w-4 place-items-center rounded-full bg-white/10 text-[10px] text-snow">2</span>
              Scope
            </span>
            <ScopeToggle app={app} />
          </div>
          <button
            onClick={(e) => {
              stop(e)
              app.setTab('Calendar')
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px]"
            style={{ background: P.track, color: P.text, border: `1px solid ${P.border}` }}
          >
            <BookmarkCheck size={14} /> <span className="num">{app.saved.length}</span> saved
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[250px_1fr_300px]">
        {/* left rail */}
        <div className="scrollbar-thin flex min-h-0 flex-col gap-3 overflow-y-auto p-4" style={{ borderRight: `1px solid ${P.border}` }}>
          <div>
            <StepTag n={1}>Choose interests</StepTag>
            <InterestChips app={app} />
          </div>
          <div className="lg:hidden">
            <StepTag n={2}>Scope</StepTag>
            <ScopeToggle app={app} />
          </div>
          <button
            onClick={(e) => {
              stop(e)
              applyPreset()
            }}
            className="rounded-2xl p-3 text-left text-[14px] leading-snug transition-colors"
            style={{ background: presetActive ? 'rgba(123,147,255,0.14)' : P.surface, border: `1px solid ${presetActive ? 'rgba(123,147,255,0.5)' : P.border}`, color: P.text }}
          >
            <span className="mb-1 flex items-center gap-1.5 text-[12px]" style={{ color: P.date }}>
              <Sparkles size={13} /> Try
            </span>
            “Show me networking and entrepreneurship opportunities”
          </button>
          <div className="mt-auto">
            <FutureConcepts expanded={mode === 'explore'} />
          </div>
        </div>

        {/* centre */}
        <div className="scrollbar-thin relative min-h-0 overflow-y-auto p-4">
          {app.tab === 'For You' && <Feed app={app} />}
          {app.tab === 'This Week' && <ThisWeek app={app} />}
          {app.tab === 'Calendar' && (
            <div>
              <div className="mb-3 text-[14px]" style={{ color: P.sub }}>
                Saved events this week · <span className="num text-snow">{app.saved.length}</span>
              </div>
              <WeekGrid app={app} />
              {app.saved.length === 0 && (
                <p className="mt-3 text-[14px]" style={{ color: P.sub }}>
                  Save events from your feed to see them here.
                </p>
              )}
            </div>
          )}
        </div>

        {/* right */}
        <div className="scrollbar-thin hidden min-h-0 overflow-y-auto p-4 xl:block" style={{ borderLeft: `1px solid ${P.border}` }}>
          <DetailPanel app={app} />
        </div>
      </div>

      {/* toast */}
      <AnimatePresence>
        {app.toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-black shadow-2xl"
          >
            <BookmarkCheck size={15} className="mr-1.5 inline" />
            Saved — added to your week
          </motion.div>
        )}
      </AnimatePresence>

      <OriginalModal app={app} />
    </div>
  )
}

/* ======================= Chapter ======================= */

function Header({ mode }: { mode: 'present' | 'explore' }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Kicker>
          <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle}
        </Kicker>
        <h2 className={`${mode === 'present' ? 't-h2' : 't-h1'} mt-2`}>
          Experience <span className="font-serif font-normal italic text-gradient">the product.</span>
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          <IllustrativeBadge label="Illustrative events" />
          <span className="text-xs text-dim">In-pitch simulation · sample data, not live feeds</span>
        </div>
        {pitchConfig.prototypeUrl && (
          <>
            <span className="mx-1 hidden h-10 w-px bg-line sm:block" />
            <div className="flex flex-col items-start gap-1">
              <Button href={pitchConfig.prototypeUrl} variant="outline" size="sm">
                Launch real prototype <ExternalLink size={13} />
              </Button>
              <span className="text-xs text-dim">Separate working prototype</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Ch05Product({ mode, step, setStep }: ChapterProps) {
  const app = useOrbitApp(step)
  return (
    <Stage mode={mode} className={mode === 'present' ? '!justify-start !pt-20 !pb-16' : ''}>
      <Header mode={mode} />
      <OrbitApp app={app} mode={mode} step={step} setStep={setStep} />
      {mode === 'explore' ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Expandable title="How the simulation works">
            Choose interests, then switch between My University and Across London. Cards are filtered by matching interests and ranked by how many of your
            interests they match. Save is fully functional and feeds the This Week and Calendar views. “View original event” opens an illustrative
            placeholder — in production Orbit links to the organiser’s own registration page.
          </Expandable>
          <Expandable title="Future concepts — not confirmed MVP features">
            <p className="mb-2">
              <b className="text-snow">Orbit Circles</b> — private groups to share events and see friends’ interests.
            </p>
            <p className="mb-2">
              <b className="text-snow">Orbit Communities</b> — interest-based communities around events.
            </p>
            <p>
              Motivation: friends influenced discovery in {interviews.findings[1].value} of {interviews.findings[1].of} interviews. Neither concept has been built or validated.
            </p>
          </Expandable>
          <SourceNote className="lg:col-span-2">
            All events are illustrative sample data (src/data/events.ts) — not real listings, live feeds or organiser endorsements. The real prototype (R5) is separate.
          </SourceNote>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <SourceNote>All events are illustrative sample data — not live feeds or real listings.</SourceNote>
          <Badge tone="silver">
            {step === 0 ? 'Pick interests · switch scope' : step === 1 ? 'Preset applied' : 'Save · week preview · details'}
          </Badge>
        </div>
      )}
    </Stage>
  )
}
