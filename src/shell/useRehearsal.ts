import { useMemo, useSyncExternalStore } from 'react'
import { chapters, totalPlannedSec } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { defaultSpeakers, type PresenterId, presenterIds } from '../data/team'

/**
 * Rehearsal settings (target length, per-chapter time overrides, speaker allocation).
 * Persisted per browser in localStorage; every access is wrapped in try/catch so the
 * site works unchanged when storage is unavailable. A tiny external store keeps the
 * Presentation, PresenterPanel and Rehearsal view in sync (including across tabs via
 * the `storage` event).
 */
const KEY = 'orbit-pitch-rehearsal-v2-13min'

interface Stored {
  targetMin: number
  /** Per-chapter seconds overrides (slug → seconds). Absent = scaled default. */
  secs: Record<string, number>
  /** Speaker overrides (slug → team member id). Absent = team.defaultSpeakers. */
  speakers: Record<string, PresenterId>
}

const fresh = (): Stored => ({ targetMin: pitchConfig.targetDurationMin, secs: {}, speakers: {} })

function load(): Stored {
  const base = fresh()
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
    if (!raw) return base
    const p = JSON.parse(raw) as Partial<Stored>
    if (typeof p.targetMin === 'number' && p.targetMin >= 1 && p.targetMin <= 120) base.targetMin = p.targetMin
    const slugs = new Set(chapters.map((c) => c.slug))
    if (p.secs && typeof p.secs === 'object') {
      for (const [k, v] of Object.entries(p.secs)) if (slugs.has(k) && typeof v === 'number' && v >= 5 && v <= 3600) base.secs[k] = v
    }
    if (p.speakers && typeof p.speakers === 'object') {
      for (const [k, v] of Object.entries(p.speakers)) if (slugs.has(k) && (presenterIds as string[]).includes(v as string)) base.speakers[k] = v as PresenterId
    }
  } catch {
    /* storage unavailable or corrupted — fall back to defaults */
  }
  return base
}

let state: Stored = load()
const listeners = new Set<() => void>()

function commit(next: Stored) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private mode / quota — in-memory state still works for this session */
  }
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === null) {
      state = load()
      listeners.forEach((l) => l())
    }
  })
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const getSnapshot = () => state

export const WORDS_PER_MIN = 140
export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

/** slug → presenter id (defaults from team.defaultSpeakers, overridden in the Rehearsal view). */
export function useSpeakers(): Record<string, PresenterId> {
  const s = useSyncExternalStore(subscribe, getSnapshot)
  return useMemo(() => ({ ...defaultSpeakers, ...s.speakers }), [s])
}

export function useRehearsal() {
  const s = useSyncExternalStore(subscribe, getSnapshot)
  return useMemo(() => {
    const targetSec = s.targetMin * 60
    const scale = targetSec / totalPlannedSec
    const scaled = chapters.map((c) => c.durationSec * scale)
    const chapterSec = chapters.map((c, i) => s.secs[c.slug] ?? scaled[i])
    const totalSec = chapterSec.reduce((a, b) => a + b, 0)
    return {
      targetMin: s.targetMin,
      targetSec,
      /** Effective seconds per chapter (override, else default scaled to the target). */
      chapterSec,
      /** Scaled default per chapter ignoring overrides. */
      scaledSec: scaled,
      overrides: s.secs,
      totalSec,
      setTargetMin: (m: number) => commit({ ...state, targetMin: Math.max(1, Math.min(120, Math.round(m * 10) / 10)) }),
      setChapterSec: (slug: string, sec: number) => commit({ ...state, secs: { ...state.secs, [slug]: Math.max(5, Math.min(3600, Math.round(sec))) } }),
      clearChapterSec: (slug: string) => {
        const secs = { ...state.secs }
        delete secs[slug]
        commit({ ...state, secs })
      },
      setSpeaker: (slug: string, id: PresenterId) => commit({ ...state, speakers: { ...state.speakers, [slug]: id } }),
      reset: () => commit(fresh()),
    }
  }, [s])
}

/** Planned seconds elapsed at a point in the talk (chapters before idx + the fraction of idx reached). */
export function plannedPaceSec(chapterSec: number[], idx: number, step: number) {
  const before = chapterSec.slice(0, idx).reduce((a, b) => a + b, 0)
  const c = chapters[idx]
  return before + (chapterSec[idx] ?? 0) * ((step + 1) / c.steps)
}
