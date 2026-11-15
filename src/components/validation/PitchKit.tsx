import type { ReactNode } from 'react'
import { ChapterHeader, SplitHeadline, StageLabel } from '../ui'
import type { StageId } from '../../data/chapters'

/** Present-mode chapter header: stage label (+ optional compact banner) and a word-flip headline. */
export function PresentHeader({ stage, num, kicker, title, banner }: { stage: StageId; num: string; kicker: string; title: string; banner?: ReactNode }) {
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <StageLabel stage={stage} />
        {banner}
      </div>
      <ChapterHeader num={num} kicker={kicker} title={<SplitHeadline text={title} className="t-h2 block" />} />
    </>
  )
}

/** One bold hero statement per step. Put the payoff phrase in <Accent>. */
export function Hero({ children, className = '', size = 'md' }: { children: ReactNode; className?: string; size?: 'md' | 'lg' | 'xl' }) {
  const sizes = {
    md: 'text-[clamp(1.7rem,2.9vw,3rem)]',
    lg: 'text-[clamp(2.1rem,3.8vw,4rem)]',
    xl: 'text-[clamp(2.4rem,5vw,5.2rem)]',
  }
  return <p className={`font-semibold leading-[1.06] tracking-tight text-snow ${sizes[size]} ${className}`}>{children}</p>
}
