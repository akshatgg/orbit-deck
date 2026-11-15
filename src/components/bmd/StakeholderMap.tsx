import { motion } from 'framer-motion'
import { CalendarDays, GraduationCap, Landmark, ShieldCheck, type LucideIcon } from 'lucide-react'
import { roles, stakeholders, type RoleKind, type StakeholderId } from '../../data/jtbd'
import { ease } from '../ui'

const icons: Record<StakeholderId, LucideIcon> = { student: GraduationCap, university: Landmark, organiser: CalendarDays, it: ShieldCheck }

export function RoleBadge({ role, className = '' }: { role: RoleKind; className?: string }) {
  const r = roles[role]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] ${role === 'payer' ? 'border-dashed' : ''} ${className}`}
      style={{ borderColor: `color-mix(in srgb, ${r.color} 55%, transparent)`, color: r.color, background: `color-mix(in srgb, ${r.color} 10%, transparent)` }}
    >
      {r.badge}
    </span>
  )
}

/** Orbit at the centre, stakeholders revealed one by one around it. */
export function StakeholderMap({
  revealed,
  selected,
  onSelect,
  showRoles,
  className = '',
}: {
  revealed: number
  selected: StakeholderId | null
  onSelect: (id: StakeholderId) => void
  showRoles: boolean
  className?: string
}) {
  const place = (v: number) => 50 + (v - 50) * 0.86
  return (
    <div className={`relative w-full ${className}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {stakeholders.map((s, i) => {
          const on = i < revealed
          const sel = selected === s.id && on
          return (
            <motion.line
              key={s.id}
              x1={50}
              y1={50}
              x2={place(s.pos.x)}
              y2={place(s.pos.y)}
              vectorEffect="non-scaling-stroke"
              stroke={sel ? 'var(--color-violet)' : 'rgba(148,163,184,0.45)'}
              strokeWidth={sel ? 2 : 1.25}
              strokeDasharray={s.role === 'payer' && showRoles ? '5 5' : undefined}
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.7, ease }}
            />
          )
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5">
        <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full border border-violet/50 bg-ink shadow-[0_0_50px_-8px_rgba(139,92,246,0.7)] sm:h-[84px] sm:w-[84px]">
          <img src="/brand/orbit-logo.webp" alt="" className="h-10 w-10 select-none sm:h-12 sm:w-12" draggable={false} />
        </span>
        <span className="text-[13px] font-semibold tracking-[0.28em] text-snow">ORBIT</span>
      </div>

      {stakeholders.map((s, i) => {
        const on = i < revealed
        const sel = selected === s.id
        const Icon = icons[s.id]
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${place(s.pos.x)}%`, top: `${place(s.pos.y)}%`, x: '-50%', y: '-50%' }}
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.85 }}
            transition={{ duration: 0.6, ease }}
          >
            <button
              type="button"
              disabled={!on}
              tabIndex={on ? 0 : -1}
              aria-pressed={sel}
              aria-label={`${s.name}: show job to be done`}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(s.id)
              }}
              className={`flex w-[118px] flex-col items-center gap-1.5 rounded-2xl border px-2 py-2.5 text-center transition-colors sm:w-[168px] sm:px-3 ${
                sel ? 'border-violet bg-violet/15' : 'border-line bg-navy/90 hover:border-violet/50'
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full ${sel ? 'bg-violet/30 text-violet-soft' : 'bg-white/5 text-silver'}`}>
                <Icon size={18} />
              </span>
              <span className="text-[14px] font-semibold leading-tight text-snow sm:text-base">{s.name}</span>
              {showRoles && <RoleBadge role={s.role} />}
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
