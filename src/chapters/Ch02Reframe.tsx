import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { ChapterHeader, Expandable, Kicker, Reveal, SourceNote, SplitHeadline, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { discoveryPains, discoverySources, limitations, survey } from '../data/research'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'reframe')!

/* SVG geometry (viewBox units) */
const VW = 1200
const VH = 460
const CX = VW / 2
const CY = VH / 2
const LX = 230
const RX = VW - 230

const ys = (n: number) => Array.from({ length: n }, (_, i) => 40 + (i * (VH - 80)) / (n - 1))
const leftY = ys(discoverySources.length)
const rightY = ys(discoveryPains.length)

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

const tooMany = survey.findings.find((f) => f.id === 'too-many')!
const tooLate = survey.findings.find((f) => f.id === 'too-late')!
const clash = survey.findings.find((f) => f.id === 'clash')!

export default function Ch02Reframe({ mode, step }: ChapterProps) {
  const explore = mode === 'explore'

  if (explore) {
    return (
      <Stage mode={mode}>
        <ChapterHeader
          num={meta.num}
          kicker={meta.actTitle}
          title={
            <>
              The problem isn’t a lack of opportunities. <span className="font-serif font-normal italic text-gradient">It’s fragmented discovery.</span>
            </>
          }
          lead="What if discovering the right opportunity felt effortless?"
        />
        <div className="mt-12">
          <Network show reduceToCalm={false} />
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
          <ScopeNote />
          <div className="space-y-3">
            <Expandable title="Why “discovery” and not “attendance”?">
              <p>
                <span className="num text-snow">{tooMany.value} of {tooMany.of}</span> survey respondents {tooMany.text}, and{' '}
                <span className="num text-snow">{tooLate.value} of {tooLate.of}</span> {tooLate.text}.
              </p>
              <p className="mt-2">
                But <span className="num text-snow">{clash.value} of {clash.of}</span> {clash.text}. Orbit targets the discovery part of the problem only.
              </p>
            </Expandable>
            <Expandable title="Limitations of this evidence">
              <ul className="space-y-1.5">
                {limitations.slice(0, 3).map((l) => (
                  <li key={l.title}>
                    <span className="text-snow">{l.title}.</span> {l.detail}
                  </li>
                ))}
              </ul>
            </Expandable>
            <SourceNote>R1 · Orbit team — New Venture Creation report (survey n = 42; interviews n = 13). Diagram is a qualitative synthesis, not a ranked chart.</SourceNote>
          </div>
        </div>
      </Stage>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_55%,rgba(128,102,255,0.10),transparent_70%)]" />
      <Stage mode={mode} center>
        {/* Step 0 — big statement, centred; it lifts and shrinks when the diagram arrives */}
        <div className="relative w-full">
          <motion.div
            initial={false}
            animate={step === 0 ? { opacity: 1, y: 0, scale: 1 } : { opacity: step === 1 ? 0.55 : 0, y: 0, scale: 0.94 }}
            transition={{ duration: 0.8, ease }}
          >
            <Reveal show>
              <Kicker className="mb-5">
                <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle}
              </Kicker>
            </Reveal>
            <h2 className={`${step === 0 ? 't-display' : 't-h2'} mx-auto max-w-5xl transition-[font-size] duration-700`}>
              <SplitHeadline text="The problem isn’t a lack of opportunities." show delay={0.1} />
            </h2>
          </motion.div>

          <div className={`grid transition-[grid-template-rows] duration-700 ${step >= 1 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="min-h-0 overflow-hidden">
              <h3 className="t-h1 mt-3">
                <span className="font-serif font-normal italic text-gradient">
                  <SplitHeadline text="It’s fragmented discovery." show={step >= 1} delay={0.15} />
                </span>
              </h3>

              <div className="relative mx-auto mt-6 w-full max-w-[1200px]">
                <motion.div
                  initial={false}
                  animate={{ opacity: step === 2 ? 0.22 : 1, filter: step === 2 ? 'blur(3px)' : 'blur(0px)', scale: step === 2 ? 0.97 : 1 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <Network show={step >= 1} reduceToCalm={step === 2} />
                </motion.div>

                {/* Step 2 — the question, over the calmed network */}
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <h2 className="t-display max-w-5xl">
                    <SplitHeadline text="What if discovering the right opportunity" show={step === 2} delay={0.2} />{' '}
                    <span className="font-serif font-normal italic text-gradient-warm">
                      <SplitHeadline text="felt effortless?" show={step === 2} delay={0.55} />
                    </span>
                  </h2>
                </div>
              </div>

              <Reveal show={step === 1} delay={1.4} className="mx-auto mt-4 max-w-3xl">
                <ScopeNote compact />
              </Reveal>
            </div>
          </div>
        </div>
      </Stage>
    </div>
  )
}

function ScopeNote({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`flex items-start gap-2 text-left ${compact ? 'justify-center text-[15px]' : 'text-sm'} leading-relaxed text-silver`}>
      <Info size={15} className="mt-[3px] shrink-0 text-violet-soft" />
      <span>
        Orbit addresses <span className="text-snow">discovery friction</span> — not every reason students miss events. Timetable clashes (
        <span className="num">
          {clash.value} of {clash.of}
        </span>{' '}
        respondents) need other fixes.
      </span>
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Network diagram: sources → student → pains                         */
/* ------------------------------------------------------------------ */

function Network({ show, reduceToCalm }: { show: boolean; reduceToCalm: boolean }) {
  const lines = [
    ...leftY.map((y, i) => ({ id: `l${i}`, d: curve(LX + 12, y, CX - 46, CY), delay: 0.25 + i * 0.08, warm: false })),
    ...rightY.map((y, i) => ({ id: `r${i}`, d: curve(CX + 46, CY, RX - 12, y), delay: 0.95 + i * 0.08, warm: true })),
  ]
  // a few cross-links between sources make the tangle visible
  const tangles = [
    curve(LX + 12, leftY[0], LX + 120, leftY[3]),
    curve(LX + 12, leftY[1], LX + 150, leftY[5]),
    curve(LX + 12, leftY[4], LX + 110, leftY[2]),
  ]

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full max-h-[46vh]" role="img" aria-label={`Students check ${discoverySources.join(', ')}; the result is ${discoveryPains.join(', ')}.`}>
      <defs>
        <linearGradient id="ch02-cool" x1="0" x2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8066ff" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ch02-warm" x1="0" x2="1">
          <stop offset="0%" stopColor="#b7a8ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffa36b" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="ch02-core">
          <stop offset="0%" stopColor="#d6c8ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8066ff" stopOpacity="0" />
        </radialGradient>
        <filter id="ch02-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes ch02-flow { to { stroke-dashoffset: -120; } }
          .ch02-pulse { stroke-dasharray: 6 114; animation: ch02-flow 2.6s linear infinite; }
        `}</style>
      </defs>

      {/* tangles */}
      {tangles.map((d, i) => (
        <motion.path
          key={`t${i}`}
          d={d}
          fill="none"
          stroke="#5d6a80"
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="3 5"
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.6, delay: show ? 1.6 : 0 }}
        />
      ))}

      {/* base lines */}
      {lines.map((l) => (
        <motion.path
          key={l.id}
          d={l.d}
          fill="none"
          stroke={`url(#ch02-${l.warm ? 'warm' : 'cool'})`}
          strokeWidth={1.6}
          initial={false}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
          transition={{ duration: 0.9, ease, delay: show ? l.delay : 0 }}
        />
      ))}

      {/* luminous pulses travelling along the lines */}
      {!reduceToCalm &&
        lines.map((l, i) => (
          <motion.path
            key={`p${l.id}`}
            d={l.d}
            fill="none"
            stroke={l.warm ? '#ffc9a3' : '#c9d8ff'}
            strokeWidth={2.4}
            strokeLinecap="round"
            filter="url(#ch02-glow)"
            className="ch02-pulse"
            style={{ animationDelay: `${-i * 0.37}s` }}
            initial={false}
            animate={{ opacity: show ? 0.9 : 0 }}
            transition={{ duration: 0.6, delay: show ? 1.9 : 0 }}
          />
        ))}

      {/* left: sources */}
      {discoverySources.map((s, i) => (
        <motion.g key={s} initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : -16 }} transition={{ duration: 0.6, ease, delay: show ? 0.1 + i * 0.07 : 0 }}>
          <circle cx={LX} cy={leftY[i]} r={6} fill="#0b1020" stroke="#7cb4ff" strokeWidth={1.5} />
          <circle cx={LX} cy={leftY[i]} r={2.4} fill="#c9d8ff" />
          <text x={LX - 18} y={leftY[i] + 6} textAnchor="end" fill="#f7f9fc" fontSize={19} fontWeight={500} fontFamily="Inter Tight, system-ui, sans-serif">
            {s}
          </text>
        </motion.g>
      ))}

      {/* centre: the student */}
      <motion.g initial={false} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }} style={{ transformOrigin: `${CX}px ${CY}px` }} transition={{ duration: 0.7, ease, delay: show ? 0.5 : 0 }}>
        <circle cx={CX} cy={CY} r={110} fill="url(#ch02-core)" />
        <circle cx={CX} cy={CY} r={44} fill="#10172a" stroke="#b7a8ff" strokeOpacity={0.7} strokeWidth={1.5} />
        <circle cx={CX} cy={CY} r={54} fill="none" stroke="#8066ff" strokeOpacity={0.25} strokeDasharray="2 6" />
        <circle cx={CX} cy={CY - 9} r={9} fill="#d6c8ff" />
        <path d={`M ${CX - 17} ${CY + 21} Q ${CX} ${CY - 2} ${CX + 17} ${CY + 21}`} fill="#d6c8ff" />
        <text x={CX} y={CY + 80} textAnchor="middle" fill="#9ca9bc" fontSize={15} letterSpacing="3" fontFamily="JetBrains Mono, monospace">
          THE STUDENT
        </text>
      </motion.g>

      {/* right: pains */}
      {discoveryPains.map((p, i) => (
        <motion.g key={p} initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : 16 }} transition={{ duration: 0.6, ease, delay: show ? 1.1 + i * 0.08 : 0 }}>
          <circle cx={RX} cy={rightY[i]} r={6} fill="#0b1020" stroke="#ffa36b" strokeWidth={1.5} />
          <circle cx={RX} cy={rightY[i]} r={2.4} fill="#ffd4b8" />
          <text x={RX + 18} y={rightY[i] + 6} textAnchor="start" fill="#f7f9fc" fontSize={19} fontWeight={500} fontFamily="Inter Tight, system-ui, sans-serif">
            {p}
          </text>
        </motion.g>
      ))}

      {/* column captions */}
      <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ delay: show ? 0.4 : 0 }}>
        <text x={LX} y={14} textAnchor="end" fill="#5d6a80" fontSize={12} letterSpacing="3" fontFamily="JetBrains Mono, monospace">
          WHERE OPPORTUNITIES LIVE
        </text>
        <text x={RX} y={14} textAnchor="start" fill="#5d6a80" fontSize={12} letterSpacing="3" fontFamily="JetBrains Mono, monospace">
          WHAT STUDENTS EXPERIENCE
        </text>
      </motion.g>
    </svg>
  )
}
