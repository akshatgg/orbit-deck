import type { ReactNode } from 'react'
import { Kicker, Reveal, SplitHeadline, StageLabel } from '../ui'
import type { StageId } from '../../data/chapters'

/** Compact chapter header for present mode (smaller headline so content fits 1366×768). */
export default function ModelHeader({
  num,
  kicker,
  title,
  stage,
  compact,
  children,
}: {
  num: string
  kicker: string
  title: string
  stage: StageId
  compact: boolean
  children?: ReactNode
}) {
  return (
    <div className="max-w-5xl">
      <Reveal>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Kicker>
            <span className="text-dim">{num}</span> <span className="mx-2 text-dim">/</span> {kicker}
          </Kicker>
          <StageLabel stage={stage} />
        </div>
      </Reveal>
      <h2 className={compact ? 'mt-2 text-[clamp(1.4rem,2.5vw,2.7rem)] font-semibold leading-[1.06] tracking-[-0.025em]' : 't-h1 mt-4'}>
        <SplitHeadline text={title} delay={0.08} />
      </h2>
      {children}
    </div>
  )
}
