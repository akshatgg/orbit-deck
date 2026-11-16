import { motion } from 'framer-motion'
import { AssumptionCard } from '../components/discovery/AssumptionCard'
import { DecisionFlow } from '../components/discovery/DecisionFlow'
import { FeatureCloud } from '../components/discovery/FeatureCloud'
import { PresentHeader } from '../components/discovery/pitch'
import { ChapterHeader, EvidenceTag, Expandable, IllustrativeBadge, LearningCard, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { assumptionClosing, assumptionShifts } from '../data/assumptionShifts'
import { chapters } from '../data/chapters'
import type { Learning } from '../data/evidence'
import { decisionsSource, productDecisions, valueProps } from '../data/productDecisions'
import type { ChapterProps } from '../shell/types'

/*
 * NOTE (team): the wording of the insight / decision rows in src/data/productDecisions.ts is built only from
 * evidence already in research.ts. It awaits alignment with Juanfe's PPT Slide 4 (Slide 4 was not available).
 * Replace the row text there; the evidence figures (n = 42 survey, n = 13 interviews) stay.
 */

const meta = chapters.find((c) => c.slug === 'product-decisions')!

const learning: Learning = {
  believed: 'Students need one more event app; reminders, aggregation and better discovery would fix missed events and adoption would follow.',
  investigated: 'Interview (n = 13) and survey (n = 42) evidence, read as insight → product decision.',
  learned: 'Timely discovery matters more than reminders, existing channels are familiar, and some misses are not Orbit’s to solve.',
  changed: 'Five decisions shape three value propositions: an accurate, low-friction discovery layer, with adoption measured rather than assumed.',
}

const CloudLabel = ({ children }: { children: string }) => (
  <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
    <span className="t-kicker !text-[11px]">{children}</span>
    <IllustrativeBadge label="Analytical reconstruction" />
  </div>
)

const vpTitle = (id: string | null) => valueProps.find((v) => v.id === id)?.title

/** Full evidence table: stacked cards below md, a four-column grid from md up. */
function DecisionTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="hidden grid-cols-[1fr_1.5fr_1.5fr_1fr] gap-4 border-b border-line bg-navy/80 px-5 py-3 md:grid">
        {['Insight', 'Evidence', 'Product decision', 'Delivers'].map((h) => (
          <div key={h} className="t-kicker !text-[11px]">{h}</div>
        ))}
      </div>
      <ul className="divide-y divide-line">
        {productDecisions.map((d) => (
          <li key={d.id} className={`grid gap-3 px-5 py-4 md:grid-cols-[1fr_1.5fr_1.5fr_1fr] md:gap-4 ${d.deprioritised ? 'bg-white/[0.015] text-silver' : 'bg-navy/50'}`}>
            <div>
              <div className="t-kicker !text-[10.5px] mb-1 md:hidden">Insight</div>
              <div className={`text-lg font-semibold leading-snug ${d.deprioritised ? 'text-silver' : 'text-snow'}`}>{d.insight}</div>
            </div>
            <div>
              <div className="t-kicker !text-[10.5px] mb-1 md:hidden">Evidence</div>
              <p className="text-[15px] leading-snug">{d.evidence}</p>
              <div className="mt-2"><EvidenceTag label="observed" /></div>
            </div>
            <div>
              <div className="t-kicker !text-[10.5px] mb-1 md:hidden">Product decision</div>
              <p className={`text-[15px] leading-snug ${d.deprioritised ? '' : 'text-snow'}`}>{d.decision}</p>
            </div>
            <div>
              <div className="t-kicker !text-[10.5px] mb-1 md:hidden">Delivers</div>
              {d.vp ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-sm text-snow"><span className="num text-xs text-cyan">{valueProps.find((v) => v.id === d.vp)!.n}</span>{vpTitle(d.vp)}</span>
              ) : d.deprioritised ? (
                <span className="inline-flex rounded-full border border-dashed border-line px-3 py-1 text-sm text-dim">Deprioritised: secondary</span>
              ) : (
                <span className="inline-flex rounded-full border border-violet/50 bg-violet/10 px-3 py-1 text-sm text-violet-soft">Principle: shapes all three</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Ch04ProductDecisions({ mode, step }: ChapterProps) {
  if (mode === 'explore') {
    return (
      <Stage mode={mode}>
        <StageLabel stage={meta.stage} className="mb-3" />
        <ChapterHeader
          num={meta.num}
          kicker={meta.title}
          title={meta.headline}
          lead="Each product decision starts from something students told us, with the count behind it. Five decisions shape the three value propositions."
        />
        <div className="mt-10 space-y-12">
          <section className="hidden lg:block">
            <DecisionFlow stage={1} height="560px" />
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h3 className="t-h2">Insight, evidence and decision</h3>
              <EvidenceTag label="observed" />
            </div>
            <DecisionTable />
            <SourceNote className="mt-3">{decisionsSource} Survey denominator is 42 throughout.</SourceNote>
          </section>

          <section>
            <div className="mb-4 t-kicker">The three value propositions</div>
            <div className="grid gap-4 md:grid-cols-3">
              {valueProps.map((v) => (
                <div key={v.id} className="rounded-2xl border border-cyan/30 bg-navy/60 p-5">
                  <span className="num text-sm text-cyan">{v.n}</span>
                  <div className="mt-1 text-xl font-semibold text-snow">{v.title}</div>
                  <p className="mt-1.5 text-[15px] leading-snug text-silver">{v.line}</p>
                </div>
              ))}
            </div>
          </section>

          <Expandable title={<span>How our beliefs narrowed <span className="ml-2 font-mono text-xs text-dim">five initial beliefs, before and after</span></span>}>
            <div className="space-y-8 py-2">
              <p className="max-w-3xl text-silver">Five beliefs went into the research. Each came out narrower. Select Replay on a card to watch hypothesis, evidence and decision resolve in turn.</p>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="glass rounded-2xl p-5">
                  <CloudLabel>Initial concept</CloudLabel>
                  <FeatureCloud resolved={0} />
                </div>
                <div className="glass rounded-2xl p-5">
                  <CloudLabel>After five challenges</CloudLabel>
                  <FeatureCloud resolved={5} showCore />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {assumptionShifts.map((c) => (
                  <AssumptionCard key={c.n} card={c} animateIn={false} />
                ))}
              </div>
              <div className="space-y-3">
                <p className="t-h2 max-w-4xl">{assumptionClosing.shift}</p>
                <p className="font-serif text-3xl italic text-violet-soft">{assumptionClosing.reframe}</p>
              </div>
              <SourceNote>S3, S4 (survey n = 42, interviews n = 13). {assumptionClosing.note} “Challenged” means the evidence qualifies or contradicts the belief; it does not mean the idea has failed.</SourceNote>
            </div>
          </Expandable>

          <LearningCard learning={learning} />
        </div>
      </Stage>
    )
  }

  return (
    <Stage mode={mode} className="!justify-start !pb-5 !pt-[72px]">
      <PresentHeader meta={meta} title="Every product decision *traces back to evidence.*" />
      <motion.div className="mt-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <DecisionFlow stage={step >= 1 ? 1 : 0} />
        <SourceNote className="mt-2">{decisionsSource}</SourceNote>
      </motion.div>
    </Stage>
  )
}
