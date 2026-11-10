import { motion } from 'framer-motion'
import type { Mode } from './types'

export function ModeToggle({ mode, onExplore, onPresent }: { mode: Mode; onExplore?: () => void; onPresent?: () => void }) {
  return (
    <div className="relative flex rounded-full border border-line bg-ink/60 p-0.5 text-xs font-medium" role="group" aria-label="Mode">
      {(['present', 'explore'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={m === 'present' ? onPresent : onExplore}
          aria-pressed={mode === m}
          className={`relative z-10 rounded-full px-3 py-1.5 capitalize transition-colors ${mode === m ? 'text-ink' : 'text-silver hover:text-snow'}`}
        >
          {mode === m && <motion.span layoutId="mode-pill" className="absolute inset-0 -z-10 rounded-full bg-snow" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          {m}
        </button>
      ))}
    </div>
  )
}
