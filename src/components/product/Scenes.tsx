/**
 * Illustrative product scenes for the Chapter 04 reveal (phone + desktop variants).
 * All event content comes from the ILLUSTRATIVE demoEvents in src/data/events.ts.
 */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, ChevronLeft, ExternalLink, MapPin, SlidersHorizontal, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { demoEvents, interests, type DemoEvent } from '../../data/events'
import { AppTopBar, BottomNav, EventArt, EventRow, HeroCard, P, SaveIcon, SegTabs, SideNav, StatusBar } from './OrbitUI'

export const sceneList = [
  { id: 'interests', label: 'Choose interests', caption: 'Pick what you care about — the feed tunes itself.' },
  { id: 'recommended', label: 'Recommended', caption: 'A personalised feed, with the reason for every pick.' },
  { id: 'university', label: 'University events', caption: 'Careers, societies and school events in one place.' },
  { id: 'external', label: 'External opportunities', caption: 'Relevant events across London, alongside campus ones.' },
  { id: 'filters', label: 'Filters', caption: 'Narrow by date, format and scope.' },
  { id: 'saved', label: 'Saved events', caption: 'Save now, see your week at a glance.' },
  { id: 'original', label: 'Original link', caption: 'Register on the organiser’s own page — Orbit links out.' },
] as const
export type SceneId = (typeof sceneList)[number]['id']

const ev = (id: string) => demoEvents.find((e) => e.id === id)!
const demoInterests = ['Networking', 'Entrepreneurship', 'Startups', 'AI']
const uni = demoEvents.filter((e) => e.scope === 'university')
const ext = demoEvents.filter((e) => e.scope === 'london')
const savedIds = ['e3', 'e14', 'e4', 'e5']
const filteredCount = demoEvents.filter((e) => e.category === 'Networking' || e.category === 'Workshop').length
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function useProgress(max: number, every = 380) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? max : 0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setN((v) => (v >= max ? v : v + 1)), every)
    return () => clearInterval(t)
  }, [max, every, reduce])
  return n
}

function Chip({ label, on, size = 'md' }: { label: string; on: boolean; size?: 'md' | 'lg' }) {
  return (
    <motion.span
      layout
      initial={false}
      animate={{ backgroundColor: on ? '#f4f5f7' : '#1a1c22', color: on ? '#0b0c10' : P.sub, scale: on ? 1.04 : 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${size === 'lg' ? 'px-5 py-3 text-[17px]' : 'px-4 py-2.5 text-[15px]'}`}
      style={{ border: `1px solid ${on ? 'transparent' : P.border}` }}
    >
      {on && <Check size={size === 'lg' ? 16 : 14} />}
      {label}
    </motion.span>
  )
}

function ScopeToggle({ scope }: { scope: 'university' | 'london' }) {
  return <SegTabs tabs={['My University', 'Across London'] as const} active={scope === 'university' ? 'My University' : 'Across London'} size="sm" />
}

/* ------------------------------ Phone ------------------------------ */

export function PhoneScene({ id }: { id: SceneId }) {
  return (
    <div className="absolute inset-0">
      <StatusBar />
      <AppTopBar />
      <AnimatePresence mode="wait">
        <motion.div key={id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="absolute inset-x-0 bottom-0 top-[92px]">
          <PhoneBody id={id} />
        </motion.div>
      </AnimatePresence>
      {id !== 'original' && <BottomNav active={id === 'external' || id === 'filters' ? 'Explore' : 'For You'} />}
    </div>
  )
}

function PhoneBody({ id }: { id: SceneId }) {
  switch (id) {
    case 'interests':
      return <PhoneInterests />
    case 'recommended':
      return (
        <div className="px-4">
          <SegTabs tabs={['For You', 'This Week', 'Calendar'] as const} active="For You" />
          <div className="mt-4">
            <HeroCard ev={ev('e3')} height={290} cta="View event" />
          </div>
          <p className="mt-3 px-1 text-[13.5px] leading-snug" style={{ color: P.sub }}>
            Picked because you’re into <b style={{ color: P.text }}>networking</b> and <b style={{ color: P.text }}>entrepreneurship</b>
          </p>
          <div className="mt-4 text-[20px] font-semibold" style={{ color: P.text }}>
            More for you
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <EventRow ev={ev('e1')} />
          </div>
        </div>
      )
    case 'university':
    case 'external': {
      const list = id === 'university' ? [ev('e3'), ev('e1'), ev('e14'), ev('e5'), ev('e12')] : [ev('e6'), ev('e4'), ev('e11'), ev('e7'), ev('e13')]
      return (
        <div className="px-4">
          <ScopeToggle scope={id === 'university' ? 'university' : 'london'} />
          <div className="mt-5 text-[20px] font-semibold" style={{ color: P.text }}>
            {id === 'university' ? 'At your university' : 'Across London'}
          </div>
          <div className="mt-3 flex flex-col gap-3.5">
            {list.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}>
                <EventRow ev={e} note={e.source} />
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
    case 'filters':
      return (
        <div className="relative h-full">
          <div className="px-4 opacity-40">
            <ScopeToggle scope="london" />
            <div className="mt-4 flex flex-col gap-3.5">
              {[ev('e3'), ev('e6'), ev('e1')].map((e) => (
                <EventRow key={e.id} ev={e} />
              ))}
            </div>
          </div>
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-x-0 bottom-0 rounded-t-[28px] px-5 pb-6 pt-3" style={{ background: P.surface, borderTop: `1px solid ${P.border}` }}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <FilterGroups />
            <div className="mt-5 rounded-full bg-white py-3.5 text-center text-[16px] font-semibold text-black">Show {filteredCount} events</div>
          </motion.div>
        </div>
      )
    case 'saved':
      return (
        <div className="px-4">
          <SegTabs tabs={['For You', 'This Week', 'Calendar'] as const} active="Calendar" />
          <WeekStrip />
          <div className="mt-4 text-[18px] font-semibold" style={{ color: P.text }}>
            Saved · {savedIds.length}
          </div>
          <div className="mt-3 flex flex-col gap-3.5">
            {savedIds.slice(0, 3).map((id) => (
              <EventRow key={id} ev={ev(id)} saved />
            ))}
          </div>
        </div>
      )
    case 'original':
      return <PhoneDetail e={ev('e3')} />
  }
}

function PhoneInterests() {
  const n = useProgress(demoInterests.length)
  const on = demoInterests.slice(0, n)
  return (
    <div className="px-5">
      <div className="mt-2 text-[26px] font-semibold leading-tight" style={{ color: P.text }}>
        What are you into?
      </div>
      <p className="mt-1.5 text-[15px]" style={{ color: P.sub }}>
        Pick a few — Orbit tunes your feed.
      </p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {interests.map((i) => (
          <Chip key={i} label={i} on={on.includes(i)} />
        ))}
      </div>
      <div className="mt-8 rounded-full bg-white py-3.5 text-center text-[16px] font-semibold text-black">Show my feed</div>
    </div>
  )
}

function FilterGroups({ big = false }: { big?: boolean }) {
  const groups = [
    { t: 'When', opts: ['Today', 'This week', 'Weekend'], on: ['This week'] },
    { t: 'Format', opts: ['Talk', 'Workshop', 'Networking', 'Competition'], on: ['Networking', 'Workshop'] },
    { t: 'Scope', opts: ['My University', 'Across London'], on: ['Across London'] },
  ]
  return (
    <div className="flex flex-col gap-4">
      {groups.map((g) => (
        <div key={g.t}>
          <div className={`mb-2 font-semibold ${big ? 'text-[15px]' : 'text-[14px]'}`} style={{ color: P.text }}>
            {g.t}
          </div>
          <div className="flex flex-wrap gap-2">
            {g.opts.map((o) => (
              <span key={o} className="rounded-full px-3.5 py-2 text-[13.5px]" style={{ background: g.on.includes(o) ? '#f4f5f7' : P.track, color: g.on.includes(o) ? '#0b0c10' : P.sub, border: `1px solid ${P.border}` }}>
                {o}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function WeekStrip() {
  return (
    <div className="mt-4 grid grid-cols-7 gap-1.5">
      {days.map((d, i) => {
        const has = savedIds.some((id) => ev(id).day === i)
        return (
          <div key={d} className="flex flex-col items-center gap-1 rounded-2xl py-2.5" style={{ background: has ? P.surface2 : 'transparent', border: `1px solid ${has ? P.border : 'transparent'}` }}>
            <span className="text-[11px]" style={{ color: P.sub }}>
              {d}
            </span>
            <span className="text-[16px] font-semibold" style={{ color: P.text }}>
              {17 + i}
            </span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: has ? P.date : 'transparent' }} />
          </div>
        )
      })}
    </div>
  )
}

function PhoneDetail({ e }: { e: DemoEvent }) {
  return (
    <div className="absolute inset-x-0 -top-[92px] bottom-0">
      <EventArt hue={e.hue} className="h-[300px]">
        <div className="flex justify-between p-5 pt-12">
          <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: 'rgba(10,12,16,0.45)', border: '1px solid rgba(255,255,255,0.2)', color: P.text }}>
            <ChevronLeft size={18} />
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: 'rgba(10,12,16,0.45)', border: '1px solid rgba(255,255,255,0.2)', color: P.text }}>
            <SaveIcon saved />
          </span>
        </div>
      </EventArt>
      <div className="absolute inset-x-0 top-[270px] bottom-0 rounded-t-[28px] px-5 pt-5" style={{ background: P.screen }}>
        <div className="flex gap-2">
          <span className="rounded-full px-3 py-1 text-[13px]" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.5)', color: '#8fb1ff' }}>
            {e.category}
          </span>
          <span className="rounded-full px-3 py-1 text-[13px]" style={{ border: `1px solid ${P.border}`, color: P.sub }}>
            In person
          </span>
        </div>
        <div className="mt-3 text-[24px] font-semibold leading-tight" style={{ color: P.text }}>
          {e.title}
        </div>
        <p className="mt-2 text-[14.5px]" style={{ color: P.sub }}>
          {e.description}
        </p>
        <div className="mt-4 rounded-2xl p-3.5 text-[14px]" style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.text }}>
          <div className="flex items-center gap-2">
            <CalendarDays size={15} /> {e.date} · {e.time}
          </div>
          <div className="mt-2 flex items-center gap-2" style={{ color: P.sub }}>
            <MapPin size={15} /> {e.location}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[28px] p-2 pl-5" style={{ background: 'rgba(22,24,30,0.95)', border: `1px solid ${P.border}` }}>
        <span className="text-[12px] leading-tight" style={{ color: P.sub }}>
          Registration on the
          <br />
          organiser’s own page
        </span>
        <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-black">
          View original <ArrowUpRight size={16} />
        </motion.span>
      </div>
    </div>
  )
}

/* ------------------------------ Desktop ------------------------------ */

function Tile({ e, saved = false, badge }: { e: DemoEvent; saved?: boolean; badge?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
      <EventArt hue={e.hue} className="h-[110px]">
        {badge && (
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: 'rgba(10,12,16,0.55)', color: P.text }}>
            {badge}
          </span>
        )}
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full" style={{ background: 'rgba(10,12,16,0.5)', color: P.text }}>
          <SaveIcon saved={saved} size={15} />
        </span>
      </EventArt>
      <div className="p-3.5">
        <div className="text-[13px] font-medium" style={{ color: P.date }}>
          {e.date} · {e.time}
        </div>
        <div className="mt-0.5 line-clamp-2 text-[16px] font-semibold leading-snug" style={{ color: P.text }}>
          {e.title}
        </div>
        <div className="mt-1 truncate text-[13px]" style={{ color: P.sub }}>
          {e.source}
        </div>
      </div>
    </div>
  )
}

const titles: Record<SceneId, string> = {
  interests: 'Your interests',
  recommended: 'For you',
  university: 'At your university',
  external: 'Across London',
  filters: 'Explore',
  saved: 'Your week',
  original: 'Event',
}

export function DesktopScene({ id }: { id: SceneId }) {
  return (
    <>
      <SideNav active={id === 'external' || id === 'filters' ? 'Explore' : 'For You'} />
      <div className="relative flex-1 overflow-hidden p-7">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            <div className="flex items-center justify-between">
              <div className="text-[30px] font-semibold tracking-tight" style={{ color: P.text }}>
                {titles[id]}
              </div>
              {id === 'university' || id === 'external' || id === 'filters' ? (
                <ScopeToggle scope={id === 'university' ? 'university' : 'london'} />
              ) : (
                <SegTabs tabs={['For You', 'This Week', 'Calendar'] as const} active={id === 'saved' ? 'Calendar' : 'For You'} size="sm" />
              )}
            </div>
            <div className="mt-6">
              <DesktopBody id={id} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

function DesktopBody({ id }: { id: SceneId }) {
  switch (id) {
    case 'interests':
      return <DesktopInterests />
    case 'recommended':
      return (
        <div className="grid grid-cols-[1.25fr_1fr] gap-5">
          <div>
            <HeroCard ev={ev('e3')} height={340} />
            <p className="mt-3 text-[14px]" style={{ color: P.sub }}>
              Picked because you’re into <b style={{ color: P.text }}>networking</b> and you follow <b style={{ color: P.text }}>Entrepreneurship society</b>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[18px] font-semibold" style={{ color: P.text }}>
              More for you
            </div>
            {[ev('e1'), ev('e14'), ev('e6'), ev('e5')].map((e) => (
              <EventRow key={e.id} ev={e} />
            ))}
          </div>
        </div>
      )
    case 'university':
    case 'external': {
      const list = (id === 'university' ? uni : ext).slice(0, 6)
      return (
        <div className="grid grid-cols-3 gap-4">
          {list.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Tile e={e} badge={id === 'external' ? 'External' : 'Campus'} />
            </motion.div>
          ))}
        </div>
      )
    }
    case 'filters':
      return (
        <div className="grid grid-cols-[260px_1fr] gap-5">
          <div className="rounded-2xl p-5" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold" style={{ color: P.text }}>
              <SlidersHorizontal size={16} /> Filters
            </div>
            <FilterGroups big />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[ev('e3'), ev('e6'), ev('e2'), ev('e10')].map((e) => (
              <Tile key={e.id} e={e} />
            ))}
          </div>
        </div>
      )
    case 'saved':
      return (
        <div className="grid grid-cols-7 gap-2.5">
          {days.map((d, i) => (
            <div key={d} className="min-h-[420px] rounded-2xl p-2.5" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
              <div className="mb-3 flex items-baseline justify-between px-1">
                <span className="text-[13px]" style={{ color: P.sub }}>
                  {d}
                </span>
                <span className="text-[18px] font-semibold" style={{ color: P.text }}>
                  {17 + i}
                </span>
              </div>
              {savedIds
                .map(ev)
                .filter((e) => e.day === i)
                .map((e) => (
                  <motion.div key={e.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-2 overflow-hidden rounded-xl" style={{ background: P.surface2 }}>
                    <EventArt hue={e.hue} className="h-10" rings={false} />
                    <div className="p-2">
                      <div className="text-[12px]" style={{ color: P.date }}>
                        {e.time}
                      </div>
                      <div className="text-[13px] font-semibold leading-snug" style={{ color: P.text }}>
                        {e.title}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          ))}
        </div>
      )
    case 'original': {
      const e = ev('e3')
      return (
        <div className="grid grid-cols-[1.2fr_1fr] gap-6">
          <div className="overflow-hidden rounded-[24px]" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <EventArt hue={e.hue} className="h-[200px]" />
            <div className="p-6">
              <div className="text-[13px] font-medium" style={{ color: P.date }}>
                {e.date} · {e.time} · {e.location}
              </div>
              <div className="mt-1 text-[26px] font-semibold leading-tight" style={{ color: P.text }}>
                {e.title}
              </div>
              <p className="mt-2 text-[15px]" style={{ color: P.sub }}>
                {e.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-[24px] p-7" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <div className="text-[15px]" style={{ color: P.sub }}>
              Orbit doesn’t replace the organiser’s registration. It sends you to the original page.
            </div>
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[16px] font-semibold text-black">
              View original event <ExternalLink size={16} />
            </motion.div>
            <div className="text-[13px]" style={{ color: P.sub }}>
              Source: {e.source}
            </div>
          </div>
        </div>
      )
    }
  }
}

function DesktopInterests() {
  const n = useProgress(demoInterests.length)
  const on = demoInterests.slice(0, n)
  const preview = demoEvents.filter((e) => e.tags.some((t) => on.includes(t))).slice(0, 3)
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {interests.map((i) => (
          <Chip key={i} label={i} on={on.includes(i)} size="lg" />
        ))}
      </div>
      <div className="mt-7 text-[15px]" style={{ color: P.sub }}>
        Your feed · {preview.length ? `${demoEvents.filter((e) => e.tags.some((t) => on.includes(t))).length} matches` : 'choose interests to begin'}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4">
        <AnimatePresence>
          {preview.map((e) => (
            <motion.div key={e.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Tile e={e} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
