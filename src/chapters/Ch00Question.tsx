import { ChapterHeader, Stage } from '../components/ui'
import { chapters } from '../data/chapters'
import type { ChapterProps } from '../shell/types'

// STUB — to be implemented
const meta = chapters.find((c) => c.slug === 'question')!

export default function Ch00Question({ mode, step }: ChapterProps) {
  return (
    <Stage mode={mode}>
      <ChapterHeader num={meta.num} kicker={meta.title} title={meta.headline} lead={`step ${step + 1} / ${meta.steps}`} />
    </Stage>
  )
}
