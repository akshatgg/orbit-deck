/** True when a key event came from a control that owns the keyboard (text fields, selects, sliders). */
export function isTypingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null
  if (!el || !el.tagName) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

export const inNoNav = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest?.('[data-no-nav]')
