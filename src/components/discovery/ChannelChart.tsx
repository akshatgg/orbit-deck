import { motion } from 'framer-motion'
import { useState } from 'react'
import { discoveryChannels, surveyN } from '../../data/research'
import { ease } from '../ui'

const EVENT_PLATFORMS = ['Eventbrite', 'Luma', 'Fatsoma']

/** Horizontal bars for the multiple-response discovery-channel question. */
export function ChannelChart({ show = true }: { show?: boolean }) {
  const [sel, setSel] = useState<string | null>(null)
  const chosen = discoveryChannels.find((c) => c.label === sel)
  return (
    <div>
      <ul className="space-y-1.5" aria-label="Discovery channels, multiple response">
        {discoveryChannels.map((c, i) => {
          const platform = EVENT_PLATFORMS.includes(c.label)
          const on = sel === c.label
          return (
            <li key={c.label}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(on ? null : c.label)
                }}
                aria-pressed={on}
                className={`grid w-full grid-cols-[minmax(110px,190px)_1fr_auto] items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors ${on ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
              >
                <span className="text-[15px] leading-tight text-snow">{c.label}</span>
                <span className="h-4 rounded-full bg-white/[0.05]">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ background: platform ? '#94a3b8' : '#60a5fa', originX: 0 }}
                    initial={false}
                    animate={{ width: show ? `${(c.value / surveyN) * 100}%` : '0%' }}
                    transition={{ duration: 0.8, ease, delay: show ? 0.1 + i * 0.05 : 0 }}
                  />
                </span>
                <span className="num w-[72px] text-right text-sm text-snow">{c.value} of {surveyN}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-silver">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#60a5fa]" /> Informal, institutional and careers channels</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#94a3b8]" /> Event-listing platforms (Eventbrite, Luma, Fatsoma)</span>
      </div>
      <p className="mt-2 min-h-[1.25rem] text-sm text-silver">
        {chosen ? (
          <>
            <span className="text-snow">{chosen.label}:</span> {chosen.value} of {surveyN} respondents ({Math.round((chosen.value / surveyN) * 100)}%).
          </>
        ) : (
          'Select a bar for the count and share.'
        )}{' '}
        Multiple-response question, so bars do not sum to {surveyN} or 100%.
      </p>
    </div>
  )
}
