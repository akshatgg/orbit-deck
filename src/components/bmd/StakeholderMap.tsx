import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, GraduationCap, Landmark, ShieldCheck, type LucideIcon } from 'lucide-react'
import { roles, stakeholders, type RoleKind, type StakeholderId } from '../../data/jtbd'
import { EvidenceTag, ease } from '../ui'

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
/* Present-mode hero: Orbit glowing at the centre, stakeholders on the  */
/* orbit ring, the active job as one short line beside its node.        */
/* ------------------------------------------------------------------ */

const VB = { w: 1000, h: 400, cx: 500, cy: 200, rx: 424, ry: 180 }
const orbitPos: Record<StakeholderId, { x: number; y: number; side: 'l' | 'r' }> = {
  student: { x: 20, y: 18, side: 'l' },
  university: { x: 80, y: 18, side: 'r' },
  organiser: { x: 80, y: 82, side: 'r' },
  it: { x: 20, y: 82, side: 'l' },
}
const px = (x: number) => (x / 100) * VB.w
const py = (y: number) => (y / 100) * VB.h
const ringPath = (k: number) => `M ${VB.cx - VB.rx * k} ${VB.cy} a ${VB.rx * k} ${VB.ry * k} 0 1 0 ${VB.rx * 2 * k} 0 a ${VB.rx * k} ${VB.ry * k} 0 1 0 ${-VB.rx * 2 * k} 0`

export function StakeholderOrbit({ revealed, selected, showRoles, height = 'clamp(250px,40vh,420px)' }: { revealed: number; selected: StakeholderId | null; showRoles: boolean; height?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative mx-auto" style={{ width: `min(100%, calc(${height} * 2.5))`, aspectRatio: '5 / 2', transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${VB.w} ${VB.h}`} aria-hidden>
        <defs>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="rgb(56 189 248)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={VB.cx} cy={VB.cy} rx={VB.rx * 0.9} ry={VB.ry * 0.9} fill="url(#orb-core)" />
        <ellipse cx={VB.cx} cy={VB.cy} rx={VB.rx * 0.5} ry={VB.ry * 0.5} fill="none" stroke="rgba(139,92,246,0.35)" strokeWidth={1.2} strokeDasharray="3 9" />
        <motion.ellipse
          cx={VB.cx}
          cy={VB.cy}
          rx={VB.rx}
          ry={VB.ry}
          fill="none"
          stroke="rgba(148,163,184,0.5)"
          strokeWidth={1.4}
          strokeDasharray="2 10"
          initial={{ strokeDashoffset: 0 }}
          animate={reduce ? undefined : { strokeDashoffset: [0, -96] }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        />
        <ellipse cx={VB.cx} cy={VB.cy} rx={VB.rx * 1.12} ry={VB.ry * 1.12} fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth={1} />

        {stakeholders.map((s, i) => {
          const on = i < revealed
          const sel = selected === s.id && on
          const p = orbitPos[s.id]
          return (
            <g key={s.id}>
              <circle cx={px(p.x)} cy={py(p.y)} r={5} fill="rgba(148,163,184,0.45)" opacity={on ? 0 : 1} />
              <motion.line
                x1={VB.cx}
                y1={VB.cy}
                x2={px(p.x)}
                y2={py(p.y)}
                stroke={sel ? 'rgb(167 139 250)' : 'rgba(148,163,184,0.4)'}
                strokeWidth={sel ? 2.4 : 1.4}
                strokeDasharray={s.role === 'payer' && showRoles ? '8 8' : undefined}
                initial={false}
                animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                transition={{ pathLength: { duration: 0.8, ease }, opacity: { duration: 0.4 } }}
                style={{ filter: sel ? 'drop-shadow(0 0 6px rgb(139 92 246))' : undefined }}
              />
              {sel && !reduce && (
                <motion.line
                  x1={VB.cx}
                  y1={VB.cy}
                  x2={px(p.x)}
                  y2={py(p.y)}
                  stroke="white"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeDasharray="0.1 22"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -44 }}
                  transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }}
                />
              )}
            </g>
          )
        })}

        {!reduce && (
          <>
            <circle r={5} fill="rgb(125 211 252)" style={{ filter: 'drop-shadow(0 0 8px rgb(56 189 248))' }}>
              <animateMotion dur="22s" repeatCount="indefinite" path={ringPath(1)} />
            </circle>
            <circle r={4} fill="rgb(196 181 253)" style={{ filter: 'drop-shadow(0 0 8px rgb(139 92 246))' }}>
              <animateMotion dur="14s" repeatCount="indefinite" path={ringPath(0.5)} />
            </circle>
          </>
        )}
      </svg>

      {/* Orbit, glowing */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-[clamp(72px,11vh,104px)] w-[clamp(72px,11vh,104px)] place-items-center">
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
          <span className="relative grid h-full w-full place-items-center rounded-full border border-violet/60 bg-ink shadow-[0_0_70px_6px_rgba(139,92,246,0.55)]">
            <img src="/brand/orbit-logo.webp" alt="" className="h-[58%] w-[58%] select-none" draggable={false} />
          </span>
        </div>
        <div className="mt-2 text-center text-[13px] font-semibold tracking-[0.3em] text-snow">ORBIT</div>
      </div>

      {stakeholders.map((s, i) => {
        const on = i < revealed
        const sel = selected === s.id
        const Icon = icons[s.id]
        const p = orbitPos[s.id]
        const left = p.side === 'l'
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, x: '-50%', y: '-50%' }}
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? (sel ? 1.08 : 1) : 0.7 }}
            transition={{ duration: 0.6, ease }}
          >
            <motion.div
              animate={reduce || !on ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4 + i * 0.7, ease: 'easeInOut', repeat: Infinity }}
              className="flex w-[160px] flex-col items-center gap-1.5 text-center"
            >
              <span
                className={`grid h-[clamp(48px,7.5vh,64px)] w-[clamp(48px,7.5vh,64px)] place-items-center rounded-full border transition-all duration-500 ${
                  sel ? 'border-violet bg-violet/30 text-snow shadow-[0_0_44px_2px_rgba(139,92,246,0.7)]' : 'border-line bg-navy text-silver'
                }`}
              >
                <Icon size={24} />
              </span>
              <span className={`text-[15px] font-semibold leading-tight ${sel ? 'text-snow' : 'text-silver'}`}>{s.name === 'University IT / data owner' ? 'IT / data owner' : s.name}</span>
              {showRoles && <RoleBadge role={s.role} className="whitespace-nowrap" />}
            </motion.div>

            <AnimatePresence>
              {sel && on && !showRoles && (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, x: left ? 14 : -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className={`absolute top-[38%] w-[clamp(200px,19vw,300px)] -translate-y-1/2 ${left ? 'right-full mr-3 text-right' : 'left-full ml-3 text-left'}`}
                >
                  <div className={`flex items-center gap-2 ${left ? 'justify-end' : ''}`}>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">Job to be done</span>
                    {s.id !== 'student' && <EvidenceTag label="proposed" text="Hypothesis" />}
                  </div>
                  <p className={`mt-1.5 font-serif text-[clamp(1.2rem,1.9vw,1.7rem)] italic leading-[1.2] text-snow ${left ? 'border-r-2 pr-3' : 'border-l-2 pl-3'} border-violet`}>{s.pitch}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
