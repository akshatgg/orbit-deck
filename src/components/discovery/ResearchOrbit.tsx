import { motion, useReducedMotion } from 'framer-motion'
import { EvidenceTag, GlowNumber, ease } from '../ui'
import { interviewN, researchMeta, surveyN } from '../../data/research'
import { hypothesisShort } from '../../data/discoveryShort'

const W = 760
const H = 400
const CX = W / 2
const CY = H / 2
const IN = { rx: 222, ry: 118 }
const OUT = { rx: 358, ry: 190 }

const onEllipse = (e: { rx: number; ry: number }, i: number, n: number, offset = -Math.PI / 2) => {
  const t = offset + (i / n) * Math.PI * 2
  return { x: CX + e.rx * Math.cos(t), y: CY + e.ry * Math.sin(t) }
}

/** A tiny person glyph (head + shoulders) inside a ring, centred on (0,0). */
const Person = () => (
  <>
    <circle r={12.5} fill="rgb(96 165 250 / 0.14)" stroke="#60a5fa" strokeWidth={1.4} />
    <circle cy={-3.6} r={3.4} fill="#e0efff" />
    <path d="M-6.2 7 C-6.2 1.6 6.2 1.6 6.2 7 Z" fill="#e0efff" />
  </>
)

/** Present-mode research wall: 13 interview glyphs and 42 survey dots orbiting the hypothesis. */
export function ResearchOrbit() {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-2">
      <div className="text-center lg:text-right">
        <GlowNumber value={interviewN} className="text-[clamp(4.5rem,8vw,7.5rem)] leading-none" />
        <div className="mt-1 text-xl text-snow">interviews</div>
        <div className="mt-2 flex justify-center lg:justify-end"><EvidenceTag label="observed" /></div>
      </div>

      <div className="relative w-fit">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[min(53vh,410px)] w-auto" role="img" aria-label={`${interviewN} interview glyphs and ${surveyN} survey dots orbit the original hypothesis`}>
          {[IN, OUT].map((e, k) => (
            <motion.ellipse
              key={k}
              cx={CX}
              cy={CY}
              rx={e.rx}
              ry={e.ry}
              fill="none"
              stroke={k === 0 ? 'rgb(96 165 250 / 0.35)' : 'rgb(148 163 184 / 0.28)'}
              strokeDasharray="3 9"
              strokeLinecap="round"
              initial={false}
              animate={reduce ? undefined : { strokeDashoffset: k === 0 ? [0, -48] : [0, 48] }}
              transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
            />
          ))}
          {Array.from({ length: surveyN }, (_, i) => {
            const p = onEllipse(OUT, i, surveyN, -Math.PI / 2 + 0.07)
            const imperial = i < researchMeta.imperialMsc
            return (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                fill={imperial ? '#60a5fa' : 'rgb(148 163 184 / 0.4)'}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 6.2, opacity: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.022 }}
              />
            )
          })}
          {Array.from({ length: interviewN }, (_, i) => {
            const p = onEllipse(IN, i, interviewN)
            return (
              <motion.g
                key={i}
                transform={`translate(${p.x} ${p.y})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.04 }}
              >
                <Person />
              </motion.g>
            )
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 w-[36%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="glow-ring rounded-2xl bg-ink/60 px-4 py-3 text-center backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease, delay: 1.1 }}
          >
            <div className="t-kicker !text-[10px]">Hypothesis</div>
            <p className="mt-1 font-serif text-[clamp(1rem,1.55vw,1.45rem)] italic leading-[1.12] text-snow">{hypothesisShort}</p>
          </motion.div>
        </div>
      </div>

      <div className="text-center lg:text-left">
        <GlowNumber value={surveyN} className="text-[clamp(4.5rem,8vw,7.5rem)] leading-none" />
        <div className="mt-1 text-xl text-snow">survey responses</div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 lg:justify-start">
          <EvidenceTag label="observed" />
          <span className="num whitespace-nowrap text-xs text-silver"><span className="text-ev-observed">●</span> {researchMeta.imperialMsc} of {surveyN} Imperial MSc</span>
        </div>
      </div>
    </div>
  )
}

/** Slim research strip shown once the wall has been introduced: glyph dots, no prose. */
export function WallStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line bg-navy/60 px-4 py-2.5" aria-label={`${interviewN} interviews and ${surveyN} survey responses`}>
      <span className="flex items-center gap-2">
        <span className="num text-xl text-snow">{interviewN}</span>
        <span className="text-sm text-silver">interviews</span>
        <span className="flex gap-1" aria-hidden>
          {Array.from({ length: interviewN }, (_, i) => <span key={i} className="h-2 w-2 rounded-full border border-ev-observed bg-ev-observed/30" />)}
        </span>
      </span>
      <span className="text-dim" aria-hidden>+</span>
      <span className="flex items-center gap-2">
        <span className="num text-xl text-snow">{surveyN}</span>
        <span className="text-sm text-silver">survey</span>
        <span className="flex flex-wrap gap-[3px]" aria-hidden>
          {Array.from({ length: surveyN }, (_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i < researchMeta.imperialMsc ? '#60a5fa' : 'rgb(148 163 184 / 0.4)' }} />)}
        </span>
      </span>
      <EvidenceTag label="observed" className="ml-auto" />
    </div>
  )
}
