import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, GraduationCap, Landmark, ShieldCheck, type LucideIcon } from 'lucide-react'
import { roles, stakeholders, type RoleKind, type Stakeholder, type StakeholderId } from '../../data/jtbd'
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

/* ------------------------------------------------------------------ */
/* Present-mode hero: Orbit glowing at the centre, all four jobs around */
/* it at once (staggered). `roles` switches each card from its job to   */
/* its decision right: user ≠ payer ≠ gatekeeper.                       */
/* ------------------------------------------------------------------ */

type Slot = { id: StakeholderId; side: 'l' | 'r'; row: 0 | 1 }
const slots: Slot[] = [
  { id: 'student', side: 'l', row: 0 },
  { id: 'university', side: 'r', row: 0 },
  { id: 'organiser', side: 'r', row: 1 },
  { id: 'it', side: 'l', row: 1 },
]
const roleTone: Record<RoleKind, { border: string; glow: string }> = {
  user: { border: 'rgb(56 189 248 / 0.7)', glow: '0 0 36px -8px rgba(56,189,248,0.6)' },
  payer: { border: 'rgb(139 92 246 / 0.85)', glow: '0 0 44px -6px rgba(139,92,246,0.75)' },
  gatekeeper: { border: 'rgb(203 213 225 / 0.6)', glow: '0 0 30px -10px rgba(203,213,225,0.45)' },
  supplier: { border: 'rgb(51 65 85 / 0.9)', glow: 'none' },
}

function JobCard({ s, i, roles: showRoles }: { s: Stakeholder; i: number; roles: boolean }) {
  const Icon = icons[s.id]
  const tone = roleTone[s.role]
  const dim = showRoles && s.role === 'supplier'
  return (
    <motion.div
      className={`flex h-full min-h-0 items-center gap-4 rounded-2xl border bg-navy/85 px-4 py-3 backdrop-blur-sm sm:px-5 ${showRoles && s.role === 'payer' ? 'border-dashed' : ''}`}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: dim ? 0.55 : 1, y: 0, scale: 1, borderColor: showRoles ? tone.border : 'rgb(51 65 85 / 0.9)', boxShadow: showRoles ? tone.glow : '0 0 0 0 rgba(0,0,0,0)' }}
      transition={{ duration: 0.7, ease, delay: showRoles ? 0.1 + i * 0.1 : 0.45 + i * 0.17 }}
    >
      <span className="grid h-[clamp(46px,7vh,60px)] w-[clamp(46px,7vh,60px)] shrink-0 place-items-center rounded-full border border-line bg-ink text-silver">
        <Icon size={24} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[clamp(1.1rem,1.6vw,1.45rem)] font-semibold leading-tight text-snow">{s.id === 'it' ? 'IT / data owner' : s.name}</span>
          <motion.span initial={false} animate={{ opacity: showRoles ? 1 : 0 }} transition={{ duration: 0.5, ease, delay: showRoles ? 0.3 + i * 0.1 : 0 }}>
            <RoleBadge role={s.role} className="whitespace-nowrap" />
          </motion.span>
        </div>
        <div className="mt-1.5 grid">
          <motion.p
            className="col-start-1 row-start-1 font-serif text-[clamp(1.15rem,1.75vw,1.6rem)] italic leading-[1.18] text-snow"
            initial={false}
            animate={{ opacity: showRoles ? 0 : 1 }}
            transition={{ duration: 0.4, ease }}
            aria-hidden={showRoles}
          >
            {s.pitch}
          </motion.p>
          <motion.p
            className="col-start-1 row-start-1 text-[clamp(1.05rem,1.45vw,1.3rem)] leading-snug text-snow"
            initial={false}
            animate={{ opacity: showRoles ? 1 : 0 }}
            transition={{ duration: 0.5, ease, delay: showRoles ? 0.25 : 0 }}
            aria-hidden={!showRoles}
          >
            {roles[s.role].right}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

export function JobsConstellation({ showRoles, className = '' }: { showRoles: boolean; className?: string }) {
  const reduce = useReducedMotion()
  const byId = (id: StakeholderId) => stakeholders.find((s) => s.id === id)!
  const order = slots.map((s) => s.id)
  const col = (side: 'l' | 'r') => slots.filter((s) => s.side === side).sort((a, b) => a.row - b.row)
  // end points of the four spokes inside the centre cell (viewBox %, preserveAspectRatio none)
  const spoke: Record<StakeholderId, { x: number; y: number }> = {
    student: { x: 0, y: 25 },
    it: { x: 0, y: 75 },
    university: { x: 100, y: 25 },
    organiser: { x: 100, y: 75 },
  }
  return (
    <div className={`grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,27rem)_minmax(150px,1fr)_minmax(0,27rem)] md:grid-rows-[repeat(2,minmax(0,1fr))] md:gap-x-2 md:gap-y-4 ${className}`}>
      {(['l', 'r'] as const).map((side) =>
        col(side).map((sl) => (
          <div key={sl.id} className={`flex min-h-0 flex-col ${side === 'l' ? 'md:col-start-1' : 'md:col-start-3'}`} style={{ gridRow: sl.row + 1 }}>
            <JobCard s={byId(sl.id)} i={order.indexOf(sl.id)} roles={showRoles} />
          </div>
        )),
      )}

      <div className="relative hidden min-h-0 md:col-start-2 md:row-span-2 md:row-start-1 md:block" aria-hidden>
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {stakeholders.map((s) => {
            const e = spoke[s.id]
            const live = showRoles
            const stroke = live ? (s.role === 'payer' ? 'rgb(167 139 250)' : s.role === 'user' ? 'rgb(56 189 248)' : s.role === 'gatekeeper' ? 'rgb(203 213 225)' : 'rgba(100,116,139,0.6)') : 'rgba(148,163,184,0.5)'
            return (
              <motion.line
                key={s.id}
                x1={50}
                y1={50}
                vectorEffect="non-scaling-stroke"
                stroke={stroke}
                strokeWidth={live && s.role !== 'supplier' ? 2.4 : 1.5}
                strokeDasharray={live && s.role === 'payer' ? '7 7' : undefined}
                strokeLinecap="round"
                initial={{ x2: 50, y2: 50, opacity: 0 }}
                animate={{ x2: e.x, y2: e.y, opacity: 1 }}
                transition={{ duration: 0.8, ease, delay: 0.25 + order.indexOf(s.id) * 0.17 }}
                style={{ filter: live && s.role === 'payer' ? 'drop-shadow(0 0 6px rgb(139 92 246))' : undefined }}
              />
            )
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <div className="relative grid h-[clamp(76px,12vh,110px)] w-[clamp(76px,12vh,110px)] place-items-center">
            {!reduce &&
              [0, 1].map((k) => (
                <motion.span
                  key={k}
                  className="absolute inset-0 rounded-full border border-violet/60"
                  initial={{ scale: 1, opacity: 0.55 }}
                  animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
                  transition={{ duration: 3.2, ease: 'easeOut', repeat: Infinity, delay: k * 1.6 }}
                />
              ))}
            <motion.span
              className="relative grid h-full w-full place-items-center rounded-full border border-violet/60 bg-ink shadow-[0_0_70px_6px_rgba(139,92,246,0.55)]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease }}
            >
              <img src="/brand/orbit-logo.webp" alt="" className="h-[58%] w-[58%] select-none" draggable={false} />
            </motion.span>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.3em] text-snow">ORBIT</span>
        </div>
      </div>
    </div>
  )
}
