/**
 * Functional SAMPLE Orbit phone for Chapter 07. Pure React state, no network.
 * Visual language adapted from the earlier illustrative phone UI (copied, not imported).
 */
import { ArrowRight, Bookmark, BookmarkCheck, CalendarDays, Check, ChevronLeft, Clock, ExternalLink, Home, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  availabilities,
  dateLabel,
  dayDates,
  dayNames,
  formats,
  matchBand,
  sampleEvents,
  scoreEvent,
  sourceLabels,
  topics,
  universities,
  type SampleEvent,
} from '../../data/demoEvents'
import type { ListScreen, OrbitDemo } from './useOrbitDemo'

const P = {
  screen: '#0c0e13',
  surface: '#16181e',
  surface2: '#1d2027',
  track: '#1a1c22',
  tabOn: '#34363c',
  border: 'rgba(255,255,255,0.09)',
  text: '#f4f5f7',
  sub: '#9a9ea8',
  date: '#7b93ff',
  amber: '#fbbf24',
}

function artStyle(hue: number): CSSProperties {
  return {
    background: `radial-gradient(90% 80% at 18% 12%, hsl(${hue} 85% 66% / 0.85), transparent 58%),
      radial-gradient(70% 70% at 88% 78%, hsl(${(hue + 50) % 360} 80% 58% / 0.7), transparent 60%),
      linear-gradient(160deg, hsl(${hue} 45% 22%), hsl(${(hue + 30) % 360} 50% 9%))`,
  }
}

/** One accent per source type, shared with the chapter's source chips. */
export const sourceColors = { careers: '#38bdf8', calendar: '#a78bfa', society: '#f472b6', public: '#fbbf24' } as const

const hideScroll: CSSProperties = { scrollbarWidth: 'none', msOverflowStyle: 'none' }

/* ---------- Frame ---------- */

function Scaled({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 360))
    ro.observe(el)
    setScale(el.clientWidth / 360)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: '360 / 760' }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: 360, height: 760, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

/** Phone frame; width is controlled by the parent (style/className). */
export function PhoneShell({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`relative shrink-0 rounded-[13%/6.2%] p-[3%] ${className}`}
      style={{ background: 'linear-gradient(145deg,#2a2d36,#0d0f14 40%,#1d2029)', boxShadow: '0 40px 120px -30px rgba(128,102,255,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset', ...style }}
    >
      <div className="relative overflow-hidden rounded-[11%/5.2%]" style={{ background: P.screen }}>
        <Scaled>
          <div className="relative h-full w-full" style={{ background: P.screen, fontFamily: 'var(--font-sans)', color: P.text }}>
            {children}
          </div>
        </Scaled>
        <div className="pointer-events-none absolute left-1/2 top-[1.2%] h-[2.8%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

/* ---------- Small parts ---------- */

function Chip({ label, on, onClick, small = false }: { label: string; on: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors ${small ? 'px-3 py-1.5 text-[12.5px]' : 'px-4 py-2.5 text-[15px]'}`}
      style={{ background: on ? '#f4f5f7' : '#1a1c22', color: on ? '#0b0c10' : P.sub, border: `1px solid ${on ? 'transparent' : P.border}` }}
    >
      {on && <Check size={small ? 12 : 14} />}
      {label}
    </button>
  )
}

function Pill({ children, onClick, ghost = false, disabled = false }: { children: ReactNode; onClick: () => void; ghost?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold disabled:opacity-40"
      style={ghost ? { color: P.sub, border: `1px solid ${P.border}` } : { background: '#fff', color: '#000' }}
    >
      {children}
    </button>
  )
}

function SaveBtn({ saved, onClick, size = 40, overlay = false }: { saved: boolean; onClick: () => void; size?: number; overlay?: boolean }) {
  return (
    <button
      type="button"
      aria-label={saved ? 'Remove from saved' : 'Save event'}
      aria-pressed={saved}
      onClick={onClick}
      className="grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, color: saved ? '#fff' : P.sub, background: overlay ? 'rgba(10,12,16,0.55)' : 'transparent', border: overlay ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
    >
      {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
    </button>
  )
}

function SampleBar() {
  return (
    <div
      className="mx-4 mt-1 flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-semibold"
      style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.45)', color: P.amber }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: P.amber }} />
      Sample data — not live listings or integrations
    </div>
  )
}

function Seg({ tabs, active, onChange }: { tabs: [string, string]; active: 0 | 1; onChange: (i: 0 | 1) => void }) {
  return (
    <div className="flex rounded-full p-1" style={{ background: P.track }} role="tablist">
      {tabs.map((t, i) => (
        <button
          key={t}
          role="tab"
          aria-selected={active === i}
          onClick={() => onChange(i as 0 | 1)}
          className="flex-1 whitespace-nowrap rounded-full py-2 text-[13.5px] font-medium"
          style={{ background: active === i ? P.tabOn : 'transparent', color: active === i ? P.text : P.sub }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

/* ---------- Event card ---------- */

function EventCard({ e, score, reasons, d, from }: { e: SampleEvent; score?: number; reasons?: string[]; d: OrbitDemo; from: ListScreen }) {
  const band = score !== undefined ? matchBand(score) : ''
  return (
    <div className="flex items-start gap-1 rounded-2xl p-2.5" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
      <button type="button" onClick={() => d.openEvent(e.id, from)} className="flex min-w-0 flex-1 items-start gap-3 text-left" aria-label={`Open ${e.title}`}>
        <div className="h-[60px] w-[60px] shrink-0 rounded-xl" style={artStyle(e.hue)} />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-medium" style={{ color: P.date }}>
            {dateLabel(e)} · {e.time}
          </div>
          <div className="text-[14.5px] font-semibold leading-tight" style={{ color: P.text }}>
            {e.title}
          </div>
          {d.spotlight === 'source' ? (
            <div className="mt-1.5">
              <span className="inline-block rounded-full px-2.5 py-1 text-[12.5px] font-semibold leading-none" style={{ background: `${sourceColors[e.source]}2e`, color: sourceColors[e.source], border: `1px solid ${sourceColors[e.source]}66` }}>
                {sourceLabels[e.source].replace(' (sample)', '')}
              </span>
            </div>
          ) : (
            <div className="mt-1 text-[11.5px] leading-snug" style={{ color: P.sub }}>
              {sourceLabels[e.source]}
            </div>
          )}
          {band && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px]">
              <span className={`rounded-full px-2 py-0.5 font-semibold ${d.spotlight === 'match' ? 'text-[12.5px]' : ''}`} style={d.spotlight === 'match' ? { background: 'rgba(139,92,246,0.3)', color: '#e2d9ff', border: '1px solid rgba(167,139,250,0.6)' } : { background: 'rgba(123,147,255,0.16)', color: '#a9b8ff' }}>
                {band}
              </span>
              {reasons?.[0] && <span style={{ color: P.sub }}>{reasons[0]}</span>}
            </div>
          )}
        </div>
      </button>
      <SaveBtn saved={d.saved.includes(e.id)} onClick={() => d.toggleSave(e.id)} size={36} />
    </div>
  )
}

/* ---------- Screens ---------- */

const obTitles = ['Where do you study?', 'What are you interested in?', 'Which kinds of events?', 'When are you usually free?']
const obSubs = [
  'Sample set-up only. No university is connected to Orbit in this demo.',
  'Pick as many as you like. You can change these any time.',
  'Choose the formats you would actually go to.',
  'Orbit uses this to flag events that fit your week.',
]

function Onboarding({ d }: { d: OrbitDemo }) {
  const n = d.ob
  if (n === 4) {
    return (
      <div className="absolute inset-0 flex flex-col px-5 pt-4">
        <div className="text-[24px] font-semibold leading-tight">Suggested for you</div>
        <p className="mt-1 text-[13.5px] leading-snug" style={{ color: P.sub }}>
          {d.hasPrefs ? `Ranked by your interests, formats and availability at ${d.university.short === 'My university' ? 'your university' : d.university.name}.` : 'You have not picked anything yet, so these are simply the soonest sample events.'}
        </p>
        <div className="mt-4 flex flex-col gap-2.5">
          {d.suggestions.map(({ e, score, reasons }) => (
            <EventCard key={e.id} e={e} score={score} reasons={reasons} d={d} from="onboard" />
          ))}
        </div>
        <div className="mt-auto flex gap-3 pb-5 pt-3">
          <Pill ghost onClick={() => d.setOb(3)}>
            Back
          </Pill>
          <button
            type="button"
            onClick={() => d.setScreen('feed')}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-[15px] font-semibold text-black"
          >
            See all events <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium uppercase tracking-[0.14em]" style={{ color: P.sub }}>
          Step {n + 1} of 4
        </span>
        <button type="button" onClick={() => d.setScreen('feed')} className="text-[12.5px]" style={{ color: P.sub }}>
          Skip to feed
        </button>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= n ? '#fff' : '#2a2d35' }} />
        ))}
      </div>
      <div className="mt-5 text-[24px] font-semibold leading-tight">{obTitles[n]}</div>
      <p className="mt-1 text-[13.5px] leading-snug" style={{ color: P.sub }}>
        {obSubs[n]}
      </p>

      <div className="mt-5 flex-1 overflow-y-auto" style={hideScroll}>
        {n === 0 && (
          <div className="flex flex-col gap-2.5">
            {universities.map((u) => {
              const on = d.uni === u.id
              return (
                <button
                  key={u.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => d.setUni(u.id)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-left"
                  style={{ background: on ? '#262833' : P.surface, border: `1px solid ${on ? '#fff' : P.border}` }}
                >
                  <span>
                    <span className="block text-[15.5px] font-semibold">{u.name}</span>
                    <span className="text-[12px]" style={{ color: P.sub }}>
                      {u.note}
                    </span>
                  </span>
                  {on && <Check size={18} />}
                </button>
              )
            })}
          </div>
        )}
        {n === 1 && (
          <div className="flex flex-wrap gap-2.5">
            {topics.map((t) => (
              <Chip key={t} label={t} on={d.prefs.topics.includes(t)} onClick={() => d.toggleTopic(t)} />
            ))}
          </div>
        )}
        {n === 2 && (
          <div className="flex flex-wrap gap-2.5">
            {formats.map((f) => (
              <Chip key={f} label={f} on={d.prefs.formats.includes(f)} onClick={() => d.toggleFormat(f)} />
            ))}
          </div>
        )}
        {n === 3 && (
          <div className="flex flex-col gap-2.5">
            {availabilities.map((a) => {
              const on = d.prefs.availability.includes(a)
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={on}
                  onClick={() => d.toggleAvail(a)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[15.5px] font-semibold"
                  style={{ background: on ? '#262833' : P.surface, border: `1px solid ${on ? '#fff' : P.border}` }}
                >
                  {a}
                  {on && <Check size={18} />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 pb-5 pt-3">
        {n > 0 && (
          <Pill ghost onClick={() => d.setOb(n - 1)}>
            Back
          </Pill>
        )}
        <button
          type="button"
          onClick={() => d.setOb(n + 1)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 text-[15px] font-semibold text-black"
        >
          {n === 3 ? 'View suggestions' : 'Continue'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

function Feed({ d }: { d: OrbitDemo }) {
  const open = d.filtersOpen
  const setOpen = (f: (o: boolean) => boolean) => d.setFiltersOpen(f(open))
  const uniLabel = d.university.short
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-[88px] pt-3" style={hideScroll}>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[24px] font-semibold leading-none">Discover</div>
          <div className="mt-1 text-[12.5px]" style={{ color: P.sub }}>
            {d.university.name}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Seg tabs={[uniLabel, 'All London']} active={d.scope === 'university' ? 0 : 1} onChange={(i) => d.setScope(i === 0 ? 'university' : 'london')} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-full px-3.5 py-2.5" style={{ background: P.track, border: `1px solid ${P.border}` }}>
          <Search size={15} style={{ color: P.sub }} />
          <input
            value={d.query}
            onChange={(e) => d.setQuery(e.target.value)}
            placeholder="Search sample events"
            aria-label="Search sample events"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#6b6f79]"
            style={{ color: P.text }}
          />
          {d.query && (
            <button type="button" aria-label="Clear search" onClick={() => d.setQuery('')} style={{ color: P.sub }}>
              <X size={14} />
            </button>
          )}
        </label>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Filters"
          onClick={() => setOpen((o) => !o)}
          className="relative grid h-[42px] w-[42px] place-items-center rounded-full"
          style={{ background: open ? P.tabOn : P.track, border: `1px solid ${P.border}`, color: P.text }}
        >
          <SlidersHorizontal size={16} />
          {d.filtersActive > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-white text-[10px] font-bold text-black">{d.filtersActive}</span>
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 rounded-2xl p-3" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
          <div className="text-[11.5px] font-medium uppercase tracking-[0.12em]" style={{ color: P.sub }}>
            Date
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip small label="Any" on={d.day === null} onClick={() => d.setDay(null)} />
            {dayNames.map((n, i) => (
              <Chip key={n} small label={`${n} ${dayDates[i]}`} on={d.day === i} onClick={() => d.setDay(d.day === i ? null : i)} />
            ))}
          </div>
          {!d.dateOnlyFilters && (
            <>
          <div className="mt-3 text-[11.5px] font-medium uppercase tracking-[0.12em]" style={{ color: P.sub }}>
            Category
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip small label="All" on={d.fmt === null} onClick={() => d.setFmt(null)} />
            {formats.map((f) => (
              <Chip key={f} small label={f} on={d.fmt === f} onClick={() => d.setFmt(d.fmt === f ? null : f)} />
            ))}
          </div>
          <div className="mt-3 text-[11.5px] font-medium uppercase tracking-[0.12em]" style={{ color: P.sub }}>
            Relevance
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip small label="Good matches only" on={d.matchesOnly} onClick={() => d.setMatchesOnly(!d.matchesOnly)} />
            <Chip small label="Sort: relevance" on={d.sort === 'relevance'} onClick={() => d.setSort('relevance')} />
            <Chip small label="Sort: soonest" on={d.sort === 'soonest'} onClick={() => d.setSort('soonest')} />
          </div>
            </>
          )}
        </div>
      )}

      <div className="mb-2 mt-4 flex items-center justify-between text-[12.5px]" style={{ color: P.sub }}>
        <span>
          {d.scored.length} sample event{d.scored.length === 1 ? '' : 's'}
          {d.scope === 'university' ? ' at your university' : ' across London'}
        </span>
        {(d.filtersActive > 0 || d.query) && (
          <button type="button" onClick={d.clearFilters} className="underline">
            Clear
          </button>
        )}
      </div>
      {!d.hasPrefs && d.showHint && (
        <button type="button" onClick={d.restartOnboarding} className="mb-2 w-full rounded-xl px-3 py-2 text-left text-[12.5px]" style={{ background: P.surface2, color: P.sub }}>
          No interests set yet, so nothing is ranked. Tap to set them up.
        </button>
      )}
      <div className="flex flex-col gap-2.5">
        {d.scored.map(({ e, score, reasons }) => (
          <EventCard key={e.id} e={e} score={d.hasPrefs ? score : undefined} reasons={reasons} d={d} from="feed" />
        ))}
        {d.scored.length === 0 && (
          <div className="rounded-2xl p-5 text-center text-[14px]" style={{ background: P.surface, color: P.sub }}>
            No sample events match.
            <button type="button" onClick={d.clearFilters} className="mt-3 block w-full rounded-full bg-white py-2.5 font-semibold text-black">
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CalendarView({ d }: { d: OrbitDemo }) {
  const dayEvents = sampleEvents.filter((e) => e.day === d.calDay).sort((a, b) => a.time.localeCompare(b.time))
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-[88px] pt-3" style={hideScroll}>
      <div className="text-[24px] font-semibold leading-none">Calendar</div>
      <div className="mt-1 text-[12.5px]" style={{ color: P.sub }}>
        Sample week, 16–22 Nov. Saved events are marked.
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {dayNames.map((n, i) => {
          const savedCount = sampleEvents.filter((e) => e.day === i && d.saved.includes(e.id)).length
          const on = d.calDay === i
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => d.setCalDay(i)}
              className="flex flex-col items-center rounded-xl py-2"
              style={{ background: on ? '#fff' : P.surface, color: on ? '#000' : P.text, border: `1px solid ${on ? 'transparent' : P.border}` }}
            >
              <span className="text-[10.5px] font-medium uppercase" style={{ color: on ? '#444' : P.sub }}>
                {n}
              </span>
              <span className="text-[16px] font-semibold">{dayDates[i]}</span>
              <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: savedCount ? (on ? '#7c3aed' : P.date) : 'transparent' }} />
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {dayEvents.map((e) => (
          <div key={e.id} className="flex items-start gap-1 rounded-2xl p-2.5" style={{ background: P.surface, border: `1px solid ${d.saved.includes(e.id) ? 'rgba(123,147,255,0.6)' : P.border}` }}>
            <button type="button" onClick={() => d.openEvent(e.id, 'calendar')} className="flex min-w-0 flex-1 gap-3 text-left" aria-label={`Open ${e.title}`}>
              <div className="w-11 shrink-0 pt-0.5 text-[13px] font-semibold" style={{ color: P.date }}>
                {e.time}
              </div>
              <div className="min-w-0">
                <div className="text-[14.5px] font-semibold leading-tight">{e.title}</div>
                <div className="mt-0.5 text-[11.5px]" style={{ color: P.sub }}>
                  {sourceLabels[e.source]}
                </div>
              </div>
            </button>
            <SaveBtn saved={d.saved.includes(e.id)} onClick={() => d.toggleSave(e.id)} size={34} />
          </div>
        ))}
        {dayEvents.length === 0 && (
          <div className="rounded-2xl p-5 text-center text-[14px]" style={{ background: P.surface, color: P.sub }}>
            No sample events on this day.
          </div>
        )}
      </div>
    </div>
  )
}

function SavedView({ d }: { d: OrbitDemo }) {
  const list = sampleEvents.filter((e) => d.saved.includes(e.id)).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-[88px] pt-3" style={hideScroll}>
      <div className="text-[24px] font-semibold leading-none">Saved</div>
      <div className="mt-1 text-[12.5px]" style={{ color: P.sub }}>
        Kept only in this browser tab.
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {list.map((e) => (
          <EventCard key={e.id} e={e} d={d} from="saved" />
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl p-6 text-center text-[14px] leading-snug" style={{ background: P.surface, color: P.sub }}>
            Nothing saved yet. Tap the bookmark on any event and it will appear here and in the calendar.
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ d }: { d: OrbitDemo }) {
  const e = sampleEvents.find((x) => x.id === d.detailId)!
  const { score, reasons } = scoreEvent(e, d.prefs)
  const band = d.hasPrefs ? matchBand(score) : ''
  const backTo = d.returnTo
  return (
    <div className="absolute inset-0 overflow-y-auto pb-6" style={hideScroll}>
      <div className="relative h-[150px]" style={artStyle(e.hue)}>
        <button
          type="button"
          aria-label="Back"
          onClick={() => d.setScreen(backTo)}
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full"
          style={{ background: 'rgba(10,12,16,0.55)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="absolute right-3 top-3">
          <SaveBtn saved={d.saved.includes(e.id)} onClick={() => d.toggleSave(e.id)} overlay />
        </div>
      </div>
      <div className="px-5 pt-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full px-2.5 py-0.5 text-[11.5px] font-medium" style={{ background: P.track, color: P.sub }}>
            {e.format}
          </span>
          {e.topics.map((t) => (
            <span key={t} className="rounded-full px-2.5 py-0.5 text-[11.5px] font-medium" style={{ background: P.track, color: P.sub }}>
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2 text-[22px] font-semibold leading-tight">{e.title}</div>
        <div className="mt-1 text-[13px]" style={{ color: P.sub }}>
          By {e.organiser} (fictional)
        </div>
        <div className="mt-3 flex flex-col gap-1.5 text-[13.5px]" style={{ color: '#d3d6dc' }}>
          <span className="flex items-center gap-2">
            <CalendarDays size={14} style={{ color: P.date }} /> {dateLabel(e)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} style={{ color: P.date }} /> {e.time} · {e.price}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={14} style={{ color: P.date }} /> {e.location}
          </span>
        </div>
        <p className="mt-3 text-[13.5px] leading-snug" style={{ color: '#c0c4cc' }}>
          {e.description}
        </p>
        {e.deadline && (
          <div className="mt-2 text-[12.5px]" style={{ color: P.amber }}>
            {e.deadline}
          </div>
        )}
        {band && (
          <div className="mt-3 rounded-xl px-3 py-2 text-[12.5px] leading-snug" style={{ background: 'rgba(123,147,255,0.12)', color: '#bcc7ff' }}>
            <b>{band}.</b> {reasons.join(' · ')}
          </div>
        )}
        <div className="mt-3 rounded-xl px-3 py-2.5" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
          <div className="text-[10.5px] font-medium uppercase tracking-[0.14em]" style={{ color: P.sub }}>
            Source
          </div>
          <div className="mt-0.5 text-[14px] font-semibold">{sourceLabels[e.source]}</div>
          <div className="mt-0.5 text-[12px] leading-snug" style={{ color: P.sub }}>
            Orbit shows where every listing came from. Registration happens on the organiser’s own page.
          </div>
        </div>
        <button
          type="button"
          onClick={() => d.setScreen('redirect')}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-[15px] font-semibold text-black"
        >
          Original registration page <ExternalLink size={15} />
        </button>
      </div>
    </div>
  )
}

function Redirect({ d }: { d: OrbitDemo }) {
  const e = sampleEvents.find((x) => x.id === d.detailId)!
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: P.surface2, border: `1px solid ${P.border}` }}>
        <ExternalLink size={22} />
      </div>
      <div className="mt-5 text-[21px] font-semibold leading-tight">You would now leave Orbit for the organiser’s page</div>
      <p className="mt-3 text-[13.5px] leading-snug" style={{ color: P.sub }}>
        {e.title} is registered for on the organiser’s own page. Registration, ticketing and attendance stay with them.
      </p>
      <div className="mt-4 rounded-xl px-3 py-2 font-mono text-[12px]" style={{ background: P.surface, border: `1px dashed ${P.border}`, color: P.sub }}>
        registration.example/sample-organiser
      </div>
      <p className="mt-3 text-[12.5px] leading-snug" style={{ color: P.amber }}>
        Demonstration only. No page is opened and nothing is sent anywhere.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2.5">
        <Pill onClick={() => d.setScreen('detail')}>Back to event</Pill>
        <Pill ghost onClick={() => d.setScreen(d.returnTo)}>
          Keep browsing
        </Pill>
      </div>
    </div>
  )
}

function BottomNav({ d }: { d: OrbitDemo }) {
  const items = [
    { id: 'feed', label: 'Discover', I: Home },
    { id: 'calendar', label: 'Calendar', I: CalendarDays },
    { id: 'saved', label: `Saved${d.saved.length ? ` (${d.saved.length})` : ''}`, I: Bookmark },
  ] as const
  return (
    <div className="absolute inset-x-3 bottom-3 flex rounded-[28px] p-1.5" style={{ background: 'rgba(22,24,30,0.96)', border: `1px solid ${P.border}` }} role="tablist">
      {items.map(({ id, label, I }) => {
        const on = d.screen === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => d.setScreen(id)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-[22px] py-2 text-[11.5px]"
            style={{ background: on ? '#2d2a2a' : 'transparent', color: on ? P.text : P.sub }}
          >
            <I size={18} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Public ---------- */

export function OrbitDemoPhone({ d }: { d: OrbitDemo }) {
  const s = d.screen
  const nav = s === 'feed' || s === 'calendar' || s === 'saved'
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between px-7 pt-3 text-[13px] font-semibold" style={{ color: P.text }}>
        <span>9:41</span>
        <span className="h-2.5 w-4 rounded-[3px] border border-white/70" />
      </div>
      <SampleBar />
      <div className="relative min-h-0 flex-1">
        {s === 'onboard' && <Onboarding d={d} />}
        {s === 'feed' && <Feed d={d} />}
        {s === 'calendar' && <CalendarView d={d} />}
        {s === 'saved' && <SavedView d={d} />}
        {s === 'detail' && <Detail d={d} />}
        {s === 'redirect' && <Redirect d={d} />}
        {nav && <BottomNav d={d} />}
      </div>
    </div>
  )
}

/** Presenter/professor controls beside the phone: tapping an interest retunes the feed. */
export function DemoSideControls({ d, compact = false }: { d: OrbitDemo; compact?: boolean }) {
  const top = d.scored[0]
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="t-kicker">Try it from outside the phone</div>
        <p className={`mt-1.5 text-silver ${compact ? 'text-[15px]' : 'text-base'}`}>Select an interest and watch the feed re-rank.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
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
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? 'border-violet bg-violet/20 text-snow' : 'border-line text-silver hover:border-violet/50 hover:text-snow'}`}
            >
              {t}
            </button>
          )
        })}
      </div>
      <p className="font-mono text-[12px] leading-relaxed text-dim" aria-live="polite">
        {d.scored.length} sample events in view
        {top && d.hasPrefs ? ` · top: ${top.e.title}` : ''}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={(e) => { e.stopPropagation(); d.restartOnboarding() }} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-silver hover:text-snow">
          Restart onboarding
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); d.resetAll() }} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-silver hover:text-snow">
          Reset everything
        </button>
      </div>
    </div>
  )
}
