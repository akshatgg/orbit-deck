import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import type { Notice } from '../../data/question'

/** Generic, deliberately plain notification card (no third-party logos or UI imitation). */
export function NoticeCard({
  notice,
  closed = false,
  size = 'md',
  glow = false,
  compact = false,
  className = '',
}: {
  notice: Notice
  closed?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Luminous depth treatment (present mode). */
  glow?: boolean
  /** Hide the event line (source + body only). */
  compact?: boolean
  className?: string
}) {
  const pad = size === 'lg' ? 'px-7 py-6' : size === 'md' ? 'px-4 py-3' : 'px-3 py-2'
  const body = size === 'lg' ? 'text-[clamp(1.6rem,2.8vw,2.6rem)]' : size === 'md' ? 'text-[15px]' : 'text-[13px]'
  const lit = glow && !closed
  return (
    <div
      className={`rounded-xl border text-left backdrop-blur-sm ${lit ? 'border-violet/40 bg-navy-2/90' : 'border-line bg-navy-2/80'} ${pad} ${className}`}
      style={lit ? { boxShadow: size === 'lg' ? '0 0 0 1px rgb(139 92 246 / 0.25), 0 30px 90px -20px rgb(139 92 246 / 0.65), 0 0 70px -10px rgb(56 189 248 / 0.3)' : '0 18px 50px -18px rgb(139 92 246 / 0.55), 0 0 30px -12px rgb(56 189 248 / 0.25)' } : undefined}
    >
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
        <motion.span
          className={`grid shrink-0 place-items-center rounded-full ${lit ? 'bg-violet/25 text-violet-soft' : 'text-dim'}`}
          style={lit ? { width: 20, height: 20 } : undefined}
          animate={lit && size !== 'sm' ? { scale: [1, 1.18, 1] } : undefined}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bell size={12} aria-hidden />
        </motion.span>
        <span className="truncate">{notice.source}</span>
      </div>
      {!compact && <div className={`mt-1.5 truncate font-medium text-silver ${size === 'lg' ? 'text-base' : 'text-[14px]'}`}>{notice.event}</div>}
      <div className={`${compact ? 'mt-1.5' : 'mt-0.5'} font-semibold leading-tight ${body} ${closed ? 'text-silver' : 'text-snow'}`}>{closed ? 'Registration closed.' : notice.body}</div>
    </div>
  )
}
