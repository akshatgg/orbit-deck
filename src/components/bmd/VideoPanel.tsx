import { Play } from 'lucide-react'
import { useState } from 'react'
import { pitchConfig } from '../../data/config'

function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

/** The team's 30-second Orbit video, or a tasteful placeholder while productVideoUrl is null. */
export function VideoPanel({ className = '' }: { className?: string }) {
  const url = pitchConfig.productVideoUrl
  const [failed, setFailed] = useState(false)
  const frame = `relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-navy ${className}`

  if (!url || failed) {
    return (
      <div className={frame}>
        <div className="grid-faint absolute inset-0 opacity-70" />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-line text-silver">
            <Play size={22} />
          </span>
          <p className="max-w-md text-base text-snow">
            {failed ? 'The video could not be loaded. The interactive walkthrough is still available.' : 'Team’s 30-second Orbit video'}
          </p>
          {!failed && <p className="font-mono text-[12px] text-dim">Add URL in src/data/config.ts (productVideoUrl)</p>}
        </div>
      </div>
    )
  }
  const emb = embedUrl(url)
  return (
    <div className={frame}>
      {emb ? (
        <iframe src={emb} title="Orbit, 30-second video" className="absolute inset-0 h-full w-full" allow="fullscreen; picture-in-picture" allowFullScreen />
      ) : (
        <video src={url} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full bg-black" onError={() => setFailed(true)} />
      )}
    </div>
  )
}
