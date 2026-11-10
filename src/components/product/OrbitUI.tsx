/**
 * Shared building blocks for the ILLUSTRATIVE Orbit interface used in chapters 04 and 05.
 * Styled after the real Orbit prototype (dark UI, rounded cards, pill tabs, white pill CTA)
 * but rendered entirely in HTML/CSS — these are not screenshots of a deployed integration.
 */
import { Bookmark, BookmarkCheck, Calendar, Compass, Home, Search, Sun, Ticket, User } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { DemoEvent } from '../../data/events'

/* Product palette (sampled from the prototype look) */
export const P = {
  screen: '#0c0e13',
  surface: '#16181e',
  surface2: '#1d2027',
  track: '#1a1c22',
  tabOn: '#34363c',
  border: 'rgba(255,255,255,0.08)',
  text: '#f4f5f7',
  sub: '#9a9ea8',
  date: '#7b93ff',
}

/** Abstract, photo-free event artwork derived from an event hue. */
export function artStyle(hue: number): CSSProperties {
  return {
    background: `radial-gradient(90% 80% at 18% 12%, hsl(${hue} 85% 66% / 0.85), transparent 58%),
      radial-gradient(70% 70% at 88% 78%, hsl(${(hue + 50) % 360} 80% 58% / 0.7), transparent 60%),
      radial-gradient(40% 40% at 62% 30%, hsl(${(hue + 200) % 360} 90% 75% / 0.35), transparent 70%),
      linear-gradient(160deg, hsl(${hue} 45% 22%), hsl(${(hue + 30) % 360} 50% 9%))`,
  }
}

export function EventArt({ hue, className = '', children, rings = true }: { hue: number; className?: string; children?: ReactNode; rings?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={artStyle(hue)}>
      {rings && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <ellipse cx="140" cy="40" rx="70" ry="26" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.6" transform="rotate(-18 140 40)" />
          <ellipse cx="140" cy="40" rx="44" ry="16" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="0.6" transform="rotate(-18 140 40)" />
          <circle cx="182" cy="26" r="2.2" fill="white" fillOpacity="0.8" />
        </svg>
      )}
      {children}
    </div>
  )
}

export function OrbitMark({ size = 22, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img src="/brand/orbit-logo.webp" alt="" style={{ width: size, height: size }} draggable={false} />
      {wordmark && (
        <span className="font-semibold tracking-[0.3em]" style={{ fontSize: size * 0.62, color: P.text }}>
          ORBIT
        </span>
      )}
    </span>
  )
}

export function RoundIcon({ children, size = 34 }: { children: ReactNode; size?: number }) {
  return (
    <span className="grid place-items-center rounded-full" style={{ width: size, height: size, border: `1px solid ${P.border}`, background: '#14161b', color: P.sub }}>
      {children}
    </span>
  )
}

export function AppTopBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3">
      <OrbitMark size={30} />
      <div className="flex gap-2">
        <RoundIcon size={38}>
          <Sun size={16} />
        </RoundIcon>
        <RoundIcon size={38}>
          <Search size={16} />
        </RoundIcon>
      </div>
    </div>
  )
}

export function SegTabs<T extends string>({ tabs, active, onChange, className = '', size = 'md' }: { tabs: readonly T[]; active: T; onChange?: (t: T) => void; className?: string; size?: 'sm' | 'md' }) {
  return (
    <div className={`flex rounded-full p-1 ${className}`} style={{ background: P.track }} role="tablist">
      {tabs.map((t) => {
        const on = t === active
        return (
          <button
            key={t}
            role="tab"
            aria-selected={on}
            onClick={(e) => {
              e.stopPropagation()
              onChange?.(t)
            }}
            className={`flex-1 whitespace-nowrap rounded-full font-medium transition-colors ${size === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-4 py-2.5 text-[15px]'}`}
            style={{ background: on ? P.tabOn : 'transparent', color: on ? P.text : P.sub }}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

const navItems = [
  { id: 'For You', icon: Home },
  { id: 'Explore', icon: Compass },
  { id: 'Tickets', icon: Ticket },
  { id: 'Profile', icon: User },
] as const

export function BottomNav({ active = 'For You' }: { active?: string }) {
  return (
    <div className="absolute inset-x-3 bottom-3 flex rounded-[28px] p-1.5" style={{ background: 'rgba(22,24,30,0.92)', border: `1px solid ${P.border}`, backdropFilter: 'blur(12px)' }}>
      {navItems.map(({ id, icon: I }) => {
        const on = id === active
        return (
          <div key={id} className="flex flex-1 flex-col items-center gap-0.5 rounded-[22px] py-2 text-[11px]" style={{ background: on ? '#2d2a2a' : 'transparent', color: on ? P.text : P.sub }}>
            <I size={18} />
            {id}
          </div>
        )
      })}
    </div>
  )
}

/** Desktop sidebar navigation for the wide interface. */
export function SideNav({ active = 'For You' }: { active?: string }) {
  return (
    <div className="flex h-full w-[200px] shrink-0 flex-col gap-1 p-4" style={{ borderRight: `1px solid ${P.border}` }}>
      <div className="mb-6 px-2 pt-1">
        <OrbitMark size={26} />
      </div>
      {navItems.map(({ id, icon: I }) => {
        const on = id === active
        return (
          <div key={id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px]" style={{ background: on ? P.tabOn : 'transparent', color: on ? P.text : P.sub }}>
            <I size={17} /> {id}
          </div>
        )
      })}
      <div className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px]" style={{ color: P.sub }}>
        <Calendar size={17} /> Calendar
      </div>
    </div>
  )
}

export function SaveIcon({ saved, size = 18 }: { saved: boolean; size?: number }) {
  return saved ? <BookmarkCheck size={size} /> : <Bookmark size={size} />
}

/** Compact list row, like "More for you" in the prototype. */
export function EventRow({ ev, saved = false, note }: { ev: DemoEvent; saved?: boolean; note?: ReactNode }) {
  return (
    <div className="flex items-center gap-3.5">
      <EventArt hue={ev.hue} className="h-[68px] w-[68px] shrink-0 rounded-2xl" rings={false} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium" style={{ color: P.date }}>
          {ev.date} · {ev.time}
        </div>
        <div className="truncate text-[16px] font-semibold leading-tight" style={{ color: P.text }}>
          {ev.title}
        </div>
        <div className="truncate text-[13px]" style={{ color: P.sub }}>
          {note ?? `${ev.source} · ${ev.location}`}
        </div>
      </div>
      <span style={{ color: saved ? P.text : P.sub }}>
        <SaveIcon saved={saved} size={17} />
      </span>
    </div>
  )
}

/** Large hero card with glass overlay (the "For You" lead card). */
export function HeroCard({ ev, cta = 'View event', saved = false, height = 300 }: { ev: DemoEvent; cta?: string; saved?: boolean; height?: number }) {
  return (
    <EventArt hue={ev.hue} className="rounded-[26px]" rings>
      <div style={{ height }} className="relative">
        <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full" style={{ background: 'rgba(10,12,16,0.45)', border: '1px solid rgba(255,255,255,0.18)', color: P.text }}>
          <SaveIcon saved={saved} />
        </span>
        <div className="absolute inset-x-2.5 bottom-2.5 rounded-[20px] p-4" style={{ background: 'rgba(28,22,24,0.78)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
          <div className="text-[13px]" style={{ color: '#d9d4d0' }}>
            {ev.date}, {ev.time}
          </div>
          <div className="mt-1 text-[20px] font-semibold leading-[1.12]" style={{ color: P.text }}>
            {ev.title}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="truncate text-[13px]" style={{ color: '#cfc9c4' }}>
              {ev.source}
            </span>
            <span className="shrink-0 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-black">{cta}</span>
          </div>
        </div>
      </div>
    </EventArt>
  )
}

/** Status bar for phone screens. */
export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 text-[13px] font-semibold" style={{ color: P.text }}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-2.5 w-4 rounded-[3px] border border-white/70" />
      </span>
    </div>
  )
}

/**
 * Renders children at a fixed design size and scales them to the container width.
 * Keeps the mock UI pixel-consistent at any projector resolution.
 */
export function Scaled({ designW, designH, children, className = '' }: { designW: number; designH: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / designW))
    ro.observe(el)
    setScale(el.clientWidth / designW)
    return () => ro.disconnect()
  }, [designW])
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${designW} / ${designH}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: designW, height: designH, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

/** Phone hardware frame. Screen content is designed at 360×760. */
export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[13%/6.2%] p-[3.2%] ${className}`} style={{ background: 'linear-gradient(145deg,#2a2d36,#0d0f14 40%,#1d2029)', boxShadow: '0 40px 120px -30px rgba(128,102,255,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset' }}>
      <div className="relative overflow-hidden rounded-[11%/5.2%]" style={{ background: P.screen }}>
        <Scaled designW={360} designH={760}>
          <div className="relative h-full w-full" style={{ background: P.screen, fontFamily: 'var(--font-sans)' }}>
            {children}
          </div>
        </Scaled>
        <div className="pointer-events-none absolute left-1/2 top-[1.4%] h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

/** Generic desktop window (no real browser branding). Content designed at 1120×700. */
export function DesktopFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl ${className}`} style={{ background: '#090b10', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 120px -40px rgba(59,130,246,0.5)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${P.border}` }}>
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 rounded-full px-3 py-0.5 font-mono text-[10px] text-white/40" style={{ background: 'rgba(255,255,255,0.05)' }}>
          orbit · illustrative interface
        </span>
      </div>
      <Scaled designW={1120} designH={660}>
        <div className="relative flex h-full w-full" style={{ background: P.screen, fontFamily: 'var(--font-sans)' }}>
          {children}
        </div>
      </Scaled>
    </div>
  )
}
