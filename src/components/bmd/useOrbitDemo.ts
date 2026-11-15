import { useCallback, useMemo, useState } from 'react'
import {
  sampleEvents,
  scoreEvent,
  sourceLabels,
  universities,
  type Availability,
  type EventFormat,
  type Prefs,
  type SampleEvent,
  type Topic,
  type UniversityId,
} from '../../data/demoEvents'

export type DemoScreen = 'onboard' | 'feed' | 'calendar' | 'saved' | 'detail' | 'redirect'
export type ListScreen = 'onboard' | 'feed' | 'calendar' | 'saved'

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

/** Preset used when the presenter jumps straight to the feed without completing onboarding. */
export const presetPrefs: Prefs = { topics: ['Entrepreneurship', 'Networking'], formats: ['Talk', 'Networking'], availability: ['Weekday evenings'] }

/** All state for the in-page Orbit sample walkthrough. Local React state only — no network. */
export function useOrbitDemo() {
  const [uni, setUni] = useState<UniversityId>('imperial')
  const [prefs, setPrefs] = useState<Prefs>({ topics: [], formats: [], availability: [] })
  const [screen, setScreen] = useState<DemoScreen>('onboard')
  const [ob, setOb] = useState(0)
  const [returnTo, setReturnTo] = useState<ListScreen>('feed')
  const [detailId, setDetailId] = useState<string>(sampleEvents[0].id)
  const [scope, setScope] = useState<'university' | 'london'>('university')
  const [query, setQuery] = useState('')
  const [day, setDay] = useState<number | null>(null)
  const [fmt, setFmt] = useState<EventFormat | null>(null)
  const [matchesOnly, setMatchesOnly] = useState(false)
  const [sort, setSort] = useState<'relevance' | 'soonest'>('relevance')
  const [saved, setSaved] = useState<string[]>([])
  const [calDay, setCalDay] = useState(0)

  const university = universities.find((u) => u.id === uni)!
  const hasPrefs = prefs.topics.length + prefs.formats.length + prefs.availability.length > 0

  const scored = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sampleEvents
      .filter((e) => scope === 'london' || e.scope === 'university')
      .map((e) => ({ e, ...scoreEvent(e, prefs) }))
      .filter((x) => !q || `${x.e.title} ${x.e.organiser} ${x.e.topics.join(' ')} ${x.e.format} ${sourceLabels[x.e.source]}`.toLowerCase().includes(q))
      .filter((x) => day === null || x.e.day === day)
      .filter((x) => fmt === null || x.e.format === fmt)
      .filter((x) => !matchesOnly || x.score >= 3)
      .sort((a, b) => {
        const byTime = a.e.day - b.e.day || a.e.time.localeCompare(b.e.time)
        return sort === 'relevance' ? b.score - a.score || byTime : byTime
      })
  }, [prefs, scope, query, day, fmt, matchesOnly, sort])

  /** Top suggestions across everything, used by the onboarding finish screen. */
  const suggestions = useMemo(
    () =>
      sampleEvents
        .map((e) => ({ e, ...scoreEvent(e, prefs) }))
        .sort((a, b) => b.score - a.score || a.e.day - b.e.day || a.e.time.localeCompare(b.e.time))
        .slice(0, 3),
    [prefs],
  )

  const filtersActive = (day !== null ? 1 : 0) + (fmt !== null ? 1 : 0) + (matchesOnly ? 1 : 0) + (sort === 'soonest' ? 1 : 0)

  return {
    uni,
    university,
    setUni,
    prefs,
    hasPrefs,
    toggleTopic: useCallback((t: Topic) => setPrefs((p) => ({ ...p, topics: toggle(p.topics, t) })), []),
    toggleFormat: useCallback((f: EventFormat) => setPrefs((p) => ({ ...p, formats: toggle(p.formats, f) })), []),
    toggleAvail: useCallback((a: Availability) => setPrefs((p) => ({ ...p, availability: toggle(p.availability, a) })), []),
    applyPreset: useCallback(() => setPrefs(presetPrefs), []),
    screen,
    setScreen,
    ob,
    setOb,
    returnTo,
    detailId,
    openEvent: useCallback(
      (id: string, from: ListScreen) => {
        setDetailId(id)
        setReturnTo(from)
        setScreen('detail')
      },
      [],
    ),
    scope,
    setScope,
    query,
    setQuery,
    day,
    setDay,
    fmt,
    setFmt,
    matchesOnly,
    setMatchesOnly,
    sort,
    setSort,
    filtersActive,
    clearFilters: useCallback(() => {
      setQuery('')
      setDay(null)
      setFmt(null)
      setMatchesOnly(false)
      setSort('relevance')
    }, []),
    saved,
    toggleSave: useCallback((id: string) => setSaved((s) => toggle(s, id)), []),
    calDay,
    setCalDay,
    scored,
    suggestions,
    /** Back to the very start of onboarding, keeping chosen preferences. */
    restartOnboarding: useCallback(() => {
      setScreen('onboard')
      setOb(0)
    }, []),
    resetAll: useCallback(() => {
      setScreen('onboard')
      setOb(0)
      setPrefs({ topics: [], formats: [], availability: [] })
      setSaved([])
      setQuery('')
      setDay(null)
      setFmt(null)
      setMatchesOnly(false)
      setSort('relevance')
      setScope('university')
      setUni('imperial')
    }, []),
  }
}

export type OrbitDemo = ReturnType<typeof useOrbitDemo>
export type { SampleEvent }
