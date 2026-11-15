import { heroNotice, otherNotices } from '../../data/question'
import { NoticeCard } from './NoticeCard'

/** The frozen, dimmed notification set — compact final state of the opening scenario. */
export function FrozenSet({ className = '' }: { className?: string }) {
  const all = [heroNotice, ...otherNotices]
  return (
    <div className={`grid grid-cols-2 gap-2 opacity-60 saturate-50 sm:grid-cols-4 lg:grid-cols-7 ${className}`} role="group" aria-label="Frozen notification set (illustrative)">
      {all.map((n, i) => (
        <NoticeCard key={n.id} notice={n} size="sm" closed={i === 0} />
      ))}
    </div>
  )
}
