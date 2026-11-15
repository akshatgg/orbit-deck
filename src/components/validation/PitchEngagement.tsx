import { motion, useReducedMotion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { imperialJourney, journeyStateMeta, ladder, otherStudentAccounts, whatRemainsUnknown, type RungState } from '../../data/engagement'
import { journeyShortLabels } from '../../data/validationPresent'
import { EvidenceTag, ease } from '../ui'

const CX = 380
const CY = 220
const RX = 290
const RY = 150
const angles = [-145, -35, 145, 35]

/** Hero orbit map: Imperial glows at the centre; other universities are faint dashed student-account nodes. */
export function OrbitMap({ showOthers }: { showOthers: boolean }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 760 440" className="h-auto w-full" role="img" aria-label="Abstract engagement map: Imperial glowing at the centre, with individual student accounts from four other London universities as faint dashed nodes. Not geographic.">
      <defs>
        <radialGradient id="imp-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="imp-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <motion.ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="rgb(148 163 184 / 0.28)" strokeWidth={1.2} strokeDasharray="3 9" animate={reduce ? undefined : { strokeDashoffset: [0, -48] }} transition={{ duration: 10, ease: 'linear', repeat: Infinity }} />
      <ellipse cx={CX} cy={CY} rx={170} ry={95} fill="none" stroke="rgb(125 211 252 / 0.18)" />

      {otherStudentAccounts.map((u, i) => {
        const a = (angles[i] * Math.PI) / 180
        const x = CX + RX * Math.cos(a)
        const y = CY + RY * Math.sin(a)
        return (
          <motion.g key={u.id} initial={false} animate={{ opacity: showOthers ? 0.78 : 0, scale: showOthers ? 1 : 0.9 }} transition={{ duration: 0.7, ease, delay: showOthers ? 0.1 + i * 0.14 : 0 }} style={{ transformOrigin: `${x}px ${y}px` }} aria-hidden={!showOthers}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="rgb(148 163 184 / 0.2)" strokeDasharray="3 7" />
            <rect x={x - 108} y={y - 28} width={216} height={56} rx={28} fill="#080d1a" fillOpacity={0.85} stroke="rgb(148 163 184 / 0.5)" strokeDasharray="5 5" strokeWidth={1.3} />
            <text x={x} y={y - 2} textAnchor="middle" fill="#cbd5e1" fontSize={15} fontWeight={600}>
              {u.name}
            </text>
            <text x={x} y={y + 17} textAnchor="middle" fill="var(--color-ev-observed)" fontSize={11} fontFamily="var(--font-mono)" letterSpacing={1.4}>
              STUDENT ACCOUNT
            </text>
          </motion.g>
        )
      })}

      <circle cx={CX} cy={CY} r={200} fill="url(#imp-halo)" />
      {!reduce && <motion.circle cx={CX} cy={CY} r={80} fill="none" stroke="#7dd3fc" strokeWidth={1.6} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scale: [1, 1.9], opacity: [0.55, 0] }} transition={{ duration: 3.2, ease: 'easeOut', repeat: Infinity }} />}
      <circle cx={CX} cy={CY} r={80} fill="#7dd3fc" opacity={0.55} filter="url(#imp-blur)" />
      <circle cx={CX} cy={CY} r={80} fill="#0b1426" stroke="var(--color-ev-reported)" strokeWidth={2.2} />
      <circle cx={CX} cy={CY} r={80} fill="rgb(125 211 252 / 0.14)" />
      <text x={CX} y={CY + 2} textAnchor="middle" fill="#f8fafc" fontSize={30} fontWeight={700}>
        Imperial
      </text>
      <text x={CX} y={CY + 30} textAnchor="middle" fill="var(--color-ev-reported)" fontSize={12} fontFamily="var(--font-mono)" letterSpacing={1.6}>
        REPORTED
      </text>
    </svg>
  )
}

/** Five glowing dots on a path: lit = happened, hollow = potential / possible / not yet reached. */
export function JourneyPath() {
  const reduce = useReducedMotion()
  const lastHappened = imperialJourney.reduce((n, j, i) => (j.state === 'happened' ? i : n), 0)
  const litPct = (lastHappened / (imperialJourney.length - 1)) * 80
  return (
    <div className="relative pt-2">
      <div className="absolute left-[10%] right-[10%] top-[2.5rem] border-t-2 border-dashed border-silver/30" />
      <motion.div
        className="absolute left-[10%] top-[2.5rem] h-[3px] -translate-y-px origin-left rounded-full"
        style={{ width: `${litPct}%`, background: 'linear-gradient(90deg, var(--color-ev-reported), #8b5cf6)', boxShadow: '0 0 22px 2px rgb(125 211 252 / 0.6)' }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
      />
      <ol className="relative grid grid-cols-5">
        {imperialJourney.map((j, i) => {
          const m = journeyStateMeta[j.state]
          const happened = j.state === 'happened'
          return (
            <motion.li key={j.id} className="flex list-none flex-col items-center text-center" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.12 }}>
              <span
                className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full"
                style={
                  happened
                    ? { background: 'var(--color-ev-reported)', color: '#06101f', boxShadow: '0 0 0 7px rgb(125 211 252 / 0.14), 0 0 44px 8px rgb(125 211 252 / 0.55)' }
                    : { background: '#080d1a', border: `2px dashed ${m.color}`, color: m.color }
                }
              >
                {happened ? <Check size={24} strokeWidth={3} /> : <span className="h-2 w-2 rounded-full opacity-0" />}
              </span>
              <div className={`mt-3 text-[clamp(1.05rem,1.5vw,1.5rem)] font-semibold leading-tight ${happened ? 'text-snow' : 'text-silver'}`}>{journeyShortLabels[j.id]}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: m.color }}>
                {j.state === 'next' ? 'Not yet' : m.label}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

/** The unresolved unknowns as amber chips. */
export function UnknownChips() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <EvidenceTag label="unresolved" text="Still unknown" />
      {whatRemainsUnknown.map((t, i) => (
        <motion.span key={t} className="rounded-full border border-amber/50 bg-amber/10 px-3.5 py-1.5 text-[clamp(0.95rem,1.2vw,1.15rem)] text-amber" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease, delay: 0.7 + i * 0.07 }}>
          {t}
        </motion.span>
      ))}
    </div>
  )
}

const rungColor: Record<RungState, string> = {
  observed: 'var(--color-ev-observed)',
  partial: 'var(--color-amber)',
  reported: 'var(--color-ev-reported)',
  'not-reached': 'var(--color-st-untested)',
}

/** Vertical evidence ladder: three rungs light up (bottom first), three stay dark. */
export function LadderViz() {
  const rungs = [...ladder].map((r, i) => ({ ...r, n: i })).reverse()
  return (
    <div className="relative mx-auto w-full max-w-xl px-5">
      <div className="absolute inset-y-0 left-0 w-[3px] rounded-full" style={{ background: 'linear-gradient(to top, #7dd3fc 0%, #7dd3fc 48%, rgb(148 163 184 / 0.18) 52%)', boxShadow: '0 0 18px rgb(125 211 252 / 0.5)' }} />
      <div className="absolute inset-y-0 right-0 w-[3px] rounded-full" style={{ background: 'linear-gradient(to top, #7dd3fc 0%, #7dd3fc 48%, rgb(148 163 184 / 0.18) 52%)', boxShadow: '0 0 18px rgb(125 211 252 / 0.5)' }} />
      <ol className="flex flex-col gap-2 py-1">
        {rungs.map((r) => {
          const lit = r.state !== 'not-reached'
          const c = rungColor[r.state]
          return (
            <motion.li
              key={r.id}
              className="flex list-none items-center gap-3 rounded-xl px-4 py-2.5"
              style={{
                border: lit ? `1.5px solid ${c}` : '1.5px dashed rgb(148 163 184 / 0.28)',
                background: lit ? `color-mix(in srgb, ${c} 13%, #080d1a)` : 'rgb(8 13 26 / 0.5)',
                boxShadow: lit ? `0 0 34px -4px color-mix(in srgb, ${c} 65%, transparent)` : 'none',
              }}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: lit ? 1 : 0.5, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 + r.n * 0.2 }}
            >
              <span className="num w-5 text-lg" style={{ color: lit ? c : 'var(--color-dim)' }}>
                {r.n + 1}
              </span>
              <span className={`flex-1 text-[clamp(1.05rem,1.45vw,1.45rem)] font-semibold leading-tight ${lit ? 'text-snow' : 'text-silver'}`}>{r.label}</span>
              {lit ? (
                r.tag ? (
                  <EvidenceTag label={r.tag} text={r.id === 'buyer' ? 'Reported' : undefined} />
                ) : (
                  <span className="rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ borderColor: `color-mix(in srgb, ${c} 50%, transparent)`, color: c }}>
                    Partial
                  </span>
                )
              ) : (
                <span className="flex items-center text-dim" aria-label="Not reached">
                  <Minus size={16} />
                </span>
              )}
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
