import { ChapterHeader, SplitHeadline, StageLabel } from '../ui'
import type { ChapterMeta } from '../../data/chapters'

/** Compact present-mode header: stage label + kicker + one-line-ish headline at a reduced size. */
export function PresentHeader({ meta, title }: { meta: Pick<ChapterMeta, 'num' | 'title' | 'stage'>; title: string }) {
  return (
    <>
      <StageLabel stage={meta.stage} className="mb-2" />
      <ChapterHeader
        num={meta.num}
        kicker={meta.title}
        title={<SplitHeadline text={title} delay={0.08} className="text-[clamp(1.6rem,3.1vw,3.2rem)]" />}
      />
    </>
  )
}
