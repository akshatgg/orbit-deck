import { EvidenceTag } from '../ui'
import { interviewN, researchMeta, surveyN } from '../../data/research'

const Dots = ({ n, lit, size = 9, cols }: { n: number; lit: number; size?: number; cols?: number }) => (
  <div
    className="flex flex-wrap gap-1.5"
    style={cols ? { display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)` } : undefined}
    aria-hidden
  >
    {Array.from({ length: n }, (_, i) => (
      <span
        key={i}
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: i < lit ? 'var(--color-ev-observed)' : 'rgb(148 163 184 / 0.28)',
        }}
      />
    ))}
  </div>
)

/** Three-column research wall: interviews | original hypothesis | survey. */
export function ResearchWall({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-navy/60 px-4 py-3 text-sm text-silver">
        <span>
          <span className="num text-lg text-snow">{interviewN}</span> interviews
        </span>
        <span className="text-dim">+</span>
        <span>
          <span className="num text-lg text-snow">{surveyN}</span> survey responses
        </span>
        <span className="hidden text-dim sm:inline">→</span>
        <span className="min-w-0 flex-1 italic text-violet-soft">“Students may be missing relevant events because discovery is fragmented.”</span>
        <EvidenceTag label="observed" />
      </div>
    )
  }
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.15fr_1fr]">
      {/* Interviews */}
      <section className="glass rounded-2xl p-5" aria-label="Qualitative interview evidence">
        <div className="flex items-center justify-between gap-2">
          <span className="t-kicker !text-[11px]">Qualitative · interviews</span>
          <EvidenceTag label="observed" />
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="num text-6xl font-medium text-snow">{interviewN}</span>
          <span className="text-base text-silver">semi-structured student interviews</span>
        </div>
        <div className="mt-3">
          <Dots n={interviewN} lit={interviewN} size={11} />
        </div>
        <p className="mt-3 text-sm text-silver">Held {researchMeta.interviewDates}. {researchMeta.recruitment}</p>
      </section>

      {/* Hypothesis */}
      <section className="relative flex flex-col justify-center rounded-2xl border border-violet/40 bg-violet/[0.07] p-5" aria-label="Original hypothesis">
        <span className="t-kicker !text-[11px]">Original hypothesis</span>
        <p className="mt-3 font-serif text-3xl italic leading-tight text-snow lg:text-4xl">Students may be missing relevant events because discovery is fragmented.</p>
        <p className="mt-3 text-sm text-silver">A hypothesis to test against behaviour, not a conclusion.</p>
      </section>

      {/* Survey */}
      <section className="glass rounded-2xl p-5" aria-label="Quantitative survey evidence">
        <div className="flex items-center justify-between gap-2">
          <span className="t-kicker !text-[11px]">Quantitative · survey</span>
          <EvidenceTag label="observed" />
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="num text-6xl font-medium text-snow">{surveyN}</span>
          <span className="text-base text-silver">analysed survey responses</span>
        </div>
        <div className="mt-3">
          <Dots n={surveyN} lit={researchMeta.imperialMsc} size={9} />
        </div>
        <p className="mt-3 text-sm text-silver">
          <span className="num text-snow">{researchMeta.imperialMsc} of {surveyN}</span> were Imperial Business School MSc students (filled dots).
        </p>
      </section>
    </div>
  )
}
