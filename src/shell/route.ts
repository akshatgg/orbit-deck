import { useEffect, useState } from 'react'
import { chapterIndex, chapters } from '../data/chapters'

export type Route =
  | { view: 'present'; idx: number; step: number }
  | { view: 'explore'; section: string | null }
  | { view: 'presenter' }
  | { view: 'rehearse' }

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'explore') return { view: 'explore', section: parts[1] ?? null }
  if (parts[0] === 'presenter') return { view: 'presenter' }
  if (parts[0] === 'rehearse') return { view: 'rehearse' }
  if (parts[0] === 'present') {
    const i = chapterIndex(parts[1] ?? '')
    const idx = i < 0 ? 0 : i
    const step = Math.max(0, Math.min(chapters[idx].steps - 1, Number(parts[2] ?? 0) || 0))
    return { view: 'present', idx, step }
  }
  return { view: 'present', idx: 0, step: 0 }
}

export function presentHash(idx: number, step: number) {
  return `#/present/${chapters[idx].slug}${step ? `/${step}` : ''}`
}

export function useRoute(): [Route, (hash: string, replace?: boolean) => void] {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (hash: string, replace = true) => {
    if (replace) window.history.replaceState(null, '', hash)
    else window.history.pushState(null, '', hash)
    setRoute(parseHash(hash))
  }
  return [route, go]
}

/* Presenter-window sync over BroadcastChannel */
export type SyncMsg =
  | { type: 'state'; idx: number; step: number; startedAt: number }
  | { type: 'cmd'; action: 'next' | 'prev' | 'goto' | 'reset' | 'resetTimer'; idx?: number }
  | { type: 'hello' }

export const channel: BroadcastChannel | null = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('orbit-pitch') : null
