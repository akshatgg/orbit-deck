import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../ui'
import type { Anticipated } from '../../data/evidenceRoom'
import { ChapterLink } from './CardView'

export function AnticipatedList({ items, openAll }: { items: Anticipated[]; openAll: boolean }) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const isOpen = (q: string) => openAll || open.has(q)
  const toggle = (q: string) =>
    setOpen((prev) => {
      const n = new Set(prev)
      if (n.has(q)) n.delete(q)
      else n.add(q)
      return n
    })
  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const o = isOpen(it.q)
        const pid = `anticipated-${i}`
        return (
          <div key={it.q} className="glass rounded-xl">
            <button
              type="button"
              aria-expanded={o}
              aria-controls={pid}
              onClick={(e) => {
                e.stopPropagation()
                toggle(it.q)
              }}
              className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
            >
              <span className="num mt-0.5 text-xs text-dim">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-[16px] font-medium leading-snug text-snow">
                {it.q}
                {it.unknown && (
                  <Badge tone="amber" className="ml-2 align-middle">
                    We don’t know yet
                  </Badge>
                )}
              </span>
              <ChevronDown size={16} className={`mt-1 shrink-0 text-silver transition-transform ${o ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {o && (
              <div id={pid} className="space-y-2 px-4 pb-4 pl-11 text-[14.5px] leading-snug text-silver">
                <p>{it.a}</p>
                {it.nextTest && (
                  <p>
                    <span className="font-medium text-violet-soft">Next test: </span>
                    {it.nextTest}
                  </p>
                )}
                {it.chapter && <ChapterLink slug={it.chapter} />}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
