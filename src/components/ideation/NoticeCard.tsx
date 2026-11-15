import { Bell } from 'lucide-react'
import type { Notice } from '../../data/question'

/** Generic, deliberately plain notification card (no third-party logos or UI imitation). */
export function NoticeCard({ notice, closed = false, size = 'md', className = '' }: { notice: Notice; closed?: boolean; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const pad = size === 'lg' ? 'px-6 py-5' : size === 'md' ? 'px-4 py-3' : 'px-3 py-2'
  const body = size === 'lg' ? 'text-[clamp(1.4rem,2.4vw,2.2rem)]' : size === 'md' ? 'text-[15px]' : 'text-[13px]'
  return (
    <div className={`rounded-xl border border-line bg-navy-2/80 text-left ${pad} ${className}`}>
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
        <Bell size={12} className="shrink-0 text-dim" aria-hidden />
        <span className="truncate">{notice.source}</span>
      </div>
      <div className={`mt-1.5 truncate font-medium text-silver ${size === 'lg' ? 'text-base' : 'text-[14px]'}`}>{notice.event}</div>
      <div className={`mt-0.5 font-semibold leading-tight ${body} ${closed ? 'text-silver' : 'text-snow'}`}>{closed ? 'Registration closed.' : notice.body}</div>
    </div>
  )
}
