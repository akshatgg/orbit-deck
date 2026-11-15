import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, TiltCard, ease } from '../ui'
import type { ModelId, RevenueModel } from '../../data/models'
import type { PathState } from './PathCard'

export type PathVariant = 'detail' | 'evidence' | 'verdict'

const ends = [16.7, 50, 83.3]

/** Three animated branches from one node. State drives ignite (A) / dash (B) / fade (C). */
export function PathConnectors({ show, states }: { show: boolean; states: PathState[] }) {
  const reduce = useReducedMotion()
  return (
    <svg className="mx-auto hidden h-16 w-full overflow-visible lg:block" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      {ends.map((x, i) => {
        const st = states[i]
        const lead = st === 'lead'
        const d = `M50 0 C50 26, ${x} 14, ${x} 40`
        const o = st === 'low' ? 0.18 : st === 'future' ? 0.55 : 1
        return (
          <g key={x}>
            <motion.path
              d={d}
              fill="none"
              stroke={lead ? 'rgb(167 139 250)' : 'rgba(167,139,250,0.55)'}
              strokeWidth={lead ? 3 : 1.5}
              vectorEffect="non-scaling-stroke"
              initial={false}
              style={{ filter: lead ? 'drop-shadow(0 0 8px rgb(139 92 246))' : undefined }}
              animate={{ opacity: show ? o : 0 }}
              transition={{ opacity: { duration: 0.7, delay: show ? 0.12 * i : 0 } }}
            />
            {/* flowing pulses (normal + lead); B is drawn dashed, C fades */}
            {(st === 'normal' || lead) && !reduce && (
              <motion.path
                d={d}
                fill="none"
                stroke={lead ? 'white' : 'rgb(196 181 253)'}
                strokeWidth={lead ? 3 : 2.2}
                strokeLinecap="round"
                strokeDasharray="0.1 14"
                vectorEffect="non-scaling-stroke"
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{ strokeDashoffset: [0, -28], opacity: show ? 1 : 0 }}
                transition={{ strokeDashoffset: { duration: 1.1, ease: 'linear', repeat: Infinity }, opacity: { duration: 0.4 } }}
              />
            )}
            {st === 'future' && <path d={d} fill="none" stroke="rgb(15 23 42)" strokeWidth={2} strokeDasharray="4 6" vectorEffect="non-scaling-stroke" opacity={0.9} />}
          </g>
        )
      })}
    </svg>
  )
}

function EvidenceMeter() {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-silver">Purchasing evidence</div>
      <div className="mt-2 flex gap-1.5" role="img" aria-label="Purchasing evidence meter: empty">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-4 flex-1 rounded-sm border border-dashed border-amber/50 bg-amber/[0.04]" />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[17px] font-medium text-amber">
        <span className="h-1.5 w-1.5 rounded-full bg-amber" /> None yet
      </div>
    </div>
  )
}

export function PathNode({ m, state, variant, index, size = 'lg' }: { m: RevenueModel; state: PathState; variant: PathVariant; index: number; size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  const lead = variant === 'verdict' && state === 'lead'
  const fade = variant === 'verdict' ? (state === 'low' ? 0.4 : state === 'future' ? 0.8 : 1) : 1
  return (
    <Reveal show delay={0.15 * index} className="h-full">
      <motion.div
        initial={false}
        animate={{ opacity: fade, scale: lead ? 1.05 : state === 'low' ? 0.97 : 1 }}
        transition={{ duration: 0.8, ease }}
        className="h-full"
        style={{ zIndex: lead ? 2 : 1, position: 'relative' }}
      >
        <div className={`h-full rounded-2xl ${lead ? 'glow-ring shadow-[0_0_90px_-8px_rgba(139,92,246,0.9)]' : ''}`}>
          <TiltCard className={`h-full ${lg ? 'p-7' : 'p-5'} ${lead ? '!bg-violet/[0.14]' : ''} ${variant === 'verdict' && state === 'future' ? '!border-dashed !border-silver/60' : ''}`}>
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-base font-semibold ${lead ? 'border-violet bg-violet/30 text-snow' : 'border-line text-silver'}`}
              >
                {m.id}
              </span>
              <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-semibold leading-tight text-snow">{m.short}</h3>
            </div>

            {variant === 'evidence' ? (
              <div className="mt-7">
                <EvidenceMeter />
              </div>
            ) : (
              <>
                <div className={`${lg ? 'mt-6' : 'mt-4'} font-mono text-[10.5px] uppercase tracking-[0.14em] text-silver`}>Who pays</div>
                <div className="mt-1 text-[clamp(1.2rem,1.7vw,1.6rem)] font-semibold leading-tight text-snow">{m.payerShort}</div>
                {variant === 'detail' ? (
                  <p className={`${lg ? 'mt-4 text-[19px]' : 'mt-3 text-[17px]'} flex items-start gap-2 leading-snug text-silver`}>
                    <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    {m.uncertaintyShort}
                  </p>
                ) : (
                  <div
                    className={`mt-3 inline-flex rounded-full border px-3.5 py-1 text-[15px] font-medium ${lead ? 'border-violet/60 bg-violet/20 text-violet-soft' : 'border-dashed border-silver/50 text-silver'}`}
                  >
                    {m.verdictShort}
                  </div>
                )}
              </>
            )}
          </TiltCard>
        </div>
      </motion.div>
    </Reveal>
  )
}

export const verdictStates: Record<ModelId, PathState> = { A: 'lead', B: 'future', C: 'low' }
