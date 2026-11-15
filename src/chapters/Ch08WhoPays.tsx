import { motion } from 'framer-motion'
import { PathCard, type PathDetail, type PathState } from '../components/bmd/PathCard'
import { ChapterHeader, EvidenceTag, Expandable, LearningCard, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import type { Learning } from '../data/evidence'
import { pricingTiers } from '../data/market'
import { revenueModels, type ModelId } from '../data/models'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'who-pays')!

const learning: Learning = {
  believed: 'The product could monetise several ways at once.',
  investigated: 'Three revenue models compared on payer, value, evidence and unknowns.',
  learned: 'None has purchasing evidence. Student payment looks weakest.',
  changed: 'University SaaS is the working hypothesis. Organiser referrals become a separate future test.',
}

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`

function Root({ compact }: { compact: boolean }) {
  return (
    <motion.div layout transition={{ duration: 0.6, ease }} className={`mx-auto max-w-2xl rounded-2xl border border-violet/50 bg-violet/10 text-center ${compact ? 'px-5 py-2.5' : 'px-6 py-5'}`}>
      <div className="t-kicker">Same student discovery proposition</div>
      <p className={`mt-1 font-semibold leading-snug text-snow ${compact ? 'text-base' : 'text-xl'}`}>{pitchConfig.valueProposition}</p>
    </motion.div>
  )
}

function Connectors({ show }: { show: boolean }) {
  const ends = [16.7, 50, 83.3]
  return (
    <svg className="mx-auto hidden h-10 w-full lg:block" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      {ends.map((x, i) => (
        <motion.path
          key={x}
          d={`M50 0 C50 22, ${x} 18, ${x} 40`}
          fill="none"
          stroke="rgba(167,139,250,0.7)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
          transition={{ duration: 0.8, ease, delay: show ? 0.12 * i : 0 }}
        />
      ))}
    </svg>
  )
}

function Cell({ children, hl = false }: { children: React.ReactNode; hl?: boolean }) {
  return <td className={`border-t border-line px-4 py-3 align-top text-[15px] leading-snug text-silver ${hl ? 'bg-violet/[0.05]' : ''}`}>{children}</td>
}

function CompareTable({ compact = false }: { compact?: boolean }) {
  const rows: { label: string; key: 'payer' | 'source' | 'evidence' | 'costs' | 'unknown' | 'next' }[] = [
    { label: 'Paying customer', key: 'payer' },
    { label: 'Source of value', key: 'source' },
    { label: 'Purchasing evidence', key: 'evidence' },
    { label: 'Main cost drivers', key: 'costs' },
    { label: 'Critical unknown', key: 'unknown' },
    { label: 'Next test', key: 'next' },
  ]
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-navy/80">
      <table className={`w-full min-w-[820px] border-collapse text-left ${compact ? '' : ''}`}>
        <caption className="sr-only">Comparison of the three revenue models</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[130px] px-4 py-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-dim">
              &nbsp;
            </th>
            {revenueModels.map((m) => (
              <th key={m.id} scope="col" className="px-4 py-3 text-base font-semibold text-snow">
                <span className="mr-2 font-mono text-silver">{m.id}</span>
                {m.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r.key}>
              <th scope="row" className="border-t border-line px-4 py-3 align-top font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-silver">
                {r.label}
              </th>
              {revenueModels.map((m) => (
                <Cell key={m.id}>
                  <Reveal show delay={0.05 * ri} y={8} as="p" className={r.key === 'evidence' ? 'font-medium text-amber' : r.key === 'next' && m.id === 'A' ? 'text-violet-soft' : ''}>
                    {m[r.key]}
                  </Reveal>
                </Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const stateOf = (id: ModelId, resolved: boolean): PathState => (!resolved ? 'normal' : id === 'A' ? 'lead' : id === 'B' ? 'future' : 'low')

function Branches({ resolved, lean, show }: { resolved: boolean; lean: boolean; show: boolean }) {
  return (
    <div>
      <Connectors show={show} />
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {revenueModels.map((m, i) => {
          const detail: PathDetail = lean ? (m.id === 'A' ? 'lean' : 'none') : 'full'
          return (
            <Reveal key={m.id} show={show} delay={0.15 * i}>
              <PathCard m={m} state={stateOf(m.id, resolved)} detail={detail} verdictOn={resolved} />
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

function Decision({ show }: { show: boolean }) {
  return (
    <Reveal show={show} className="max-w-5xl">
      <p className="text-[clamp(1.05rem,1.55vw,1.5rem)] font-medium leading-snug text-snow">
        We selected the university-funded model as our core hypothesis because it connects the institutional value proposition with a potentially recurring source of revenue while retaining free student access.
      </p>
      <p className="mt-2.5 flex items-center gap-2 text-base text-amber">
        <span className="h-1.5 w-1.5 rounded-full bg-amber" /> We have not yet proven this is the winning business model.
      </p>
    </Reveal>
  )
}

export default function Ch08WhoPays({ mode, step }: ChapterProps) {
  const present = mode === 'present'
  const header = (
    <>
      <StageLabel stage={meta.stage} />
      <div className="mt-2">
        <ChapterHeader num={meta.num} kicker={meta.title} title={<span className="t-h2 block">{meta.headline}</span>} />
      </div>
    </>
  )

  /* ---------------- Explore ---------------- */
  if (!present) {
    return (
      <Stage mode={mode}>
        {header}
        <div className="mt-10">
          <Root compact={false} />
          <div className="mt-2">
            <Branches resolved lean={false} show />
          </div>
        </div>
        <div className="mt-8">
          <Decision show />
        </div>

        <div className="mt-14">
          <h3 className="t-h2">The three models side by side</h3>
          <div className="mt-6">
            <CompareTable />
          </div>
          <SourceNote className="mt-3">Qualitative comparison. No scores or market figures are shown because none of the three has purchasing evidence yet. Frameworks: S2; plan: S3.</SourceNote>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Expandable title="How the proposed university prices are built">
            <div className="flex flex-wrap items-center gap-2">
              <EvidenceTag label="proposed" text="Proposed prices" />
              <EvidenceTag label="modelled" />
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[15px]">
                <thead className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
                  <tr>
                    <th className="py-2 pr-4 font-normal">Tier</th>
                    <th className="py-2 pr-4 font-normal">Institution size</th>
                    <th className="py-2 pr-4 font-normal">Institutions</th>
                    <th className="py-2 pr-4 font-normal">Proposed price</th>
                    <th className="py-2 font-normal">Modelled annual total</th>
                  </tr>
                </thead>
                <tbody className="text-snow">
                  {pricingTiers.map((t) => (
                    <tr key={t.id} className="border-t border-line">
                      <td className="py-2 pr-4">{t.label}</td>
                      <td className="py-2 pr-4 text-silver">{t.range}</td>
                      <td className="num py-2 pr-4">{t.institutions}</td>
                      <td className="num py-2 pr-4">{gbp(t.price)}</td>
                      <td className="num py-2">{gbp(t.potential)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Totals multiply institutions in each size band (HESA 2024/25, S7) by the proposed price, as a ceiling on the opportunity, not forecast revenue. The prices are proposals; no institution has been asked to confirm them.
            </p>
          </Expandable>
        </div>
        <LearningCard learning={learning} className="mt-12" />
      </Stage>
    )
  }

  /* ---------------- Present ---------------- */
  return (
    <Stage mode={mode} className="sm:!pb-[64px] sm:!pt-[72px]">
      <div className="flex flex-col gap-5">
        <div>{header}</div>

        {step === 0 && (
          <>
            <Root compact={false} />
            <Reveal show className="text-center">
              <p className="t-lead">Students would use it. The open question is who would pay for it.</p>
            </Reveal>
          </>
        )}

        {(step === 1 || step === 3) && (
          <div>
            {step === 1 && <Root compact />}
            <Branches resolved={step === 3} lean={step === 3} show />
          </div>
        )}

        {step === 2 && (
          <>
            <CompareTable compact />
            <SourceNote>Qualitative comparison. No scores are shown: none of the three has purchasing evidence yet.</SourceNote>
          </>
        )}

        {step === 3 && (
          <>
            <Decision show />
            <LearningCard learning={learning} compact />
          </>
        )}
      </div>
    </Stage>
  )
}
