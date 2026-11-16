import { AnimatePresence, motion } from 'framer-motion'
import { EvidenceTag, ease } from '../ui'
import { pricingTiers } from '../../data/market'
import type { RevenueModel } from '../../data/models'

export type PathState = 'normal' | 'lead' | 'future' | 'low'
export type PathDetail = 'full' | 'lean' | 'none'

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`

const frame: Record<PathState, string> = {
  normal: 'border-line bg-navy/90',
  lead: 'border-violet bg-violet/[0.12] shadow-[0_0_70px_-18px_rgba(139,92,246,0.75)]',
  future: 'border-dashed border-silver/50 bg-navy/70',
  low: 'border-line bg-navy/60',
}
const fade: Record<PathState, number> = { normal: 1, lead: 1, future: 0.62, low: 0.38 }

export function PathCard({ m, state, detail, verdictOn }: { m: RevenueModel; state: PathState; detail: PathDetail; verdictOn: boolean }) {
  const lead = state === 'lead'
  return (
    <motion.article
      layout
      initial={false}
      animate={{ opacity: fade[state], scale: lead ? 1.015 : 1 }}
      transition={{ duration: 0.7, ease }}
      className={`flex flex-col rounded-2xl border p-5 ${frame[state]}`}
      aria-label={`Path ${m.id}: ${m.name}`}
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-sm font-semibold ${lead ? 'border-violet bg-violet/30 text-snow' : 'border-line text-silver'}`}>{m.id}</span>
        <h3 className="text-lg font-semibold leading-snug text-snow sm:text-xl">{m.name}</h3>
      </div>

      <AnimatePresence initial={false}>
        {verdictOn && (
          <motion.div
            key="v"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${lead ? 'border-violet/60 bg-violet/20 text-violet-soft' : 'border-dashed border-silver/50 text-silver'}`}>{m.verdict}</div>
            {lead && <span className="ml-2 mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber/50 bg-amber/10 px-3 py-1 text-sm font-medium text-amber"><span className="h-1.5 w-1.5 rounded-full bg-amber" /> Untested guess</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {detail !== 'none' && (
        <div className="mt-3 flex flex-col gap-3.5">
          {detail === 'full' && <p className="text-base leading-snug text-silver">{m.mechanism}</p>}

          {m.id === 'A' && (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <EvidenceTag label="proposed" text="Proposed prices" />
                <EvidenceTag label="modelled" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {pricingTiers.map((t) => (
                  <div key={t.id} className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-2">
                    <div className="num text-lg font-semibold text-snow">{gbp(t.price)}</div>
                    <div className="text-[12.5px] leading-tight text-silver">{t.label} · per year</div>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-dim">Proposed prices, not validated willingness-to-pay figures.</p>
            </div>
          )}

          {detail === 'full' && m.value && (
            <div>
              <div className="t-kicker !text-silver">Potential institutional value</div>
              <ul className="mt-1.5 flex flex-col gap-1 text-[15px] leading-snug text-snow">
                {m.value.map((v) => (
                  <li key={v} className="flex gap-2">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-violet-soft" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-lg border border-amber/30 bg-amber/[0.07] px-3 py-2.5">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber">Main uncertainty</div>
            <p className="mt-1 text-[15px] leading-snug text-snow">{m.uncertainty}</p>
          </div>
        </div>
      )}
    </motion.article>
  )
}
