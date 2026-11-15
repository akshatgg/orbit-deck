import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

/** Two-step reset (click, then confirm) so a stray click never wipes a live presentation. */
export function ResetButton({ onReset }: { onReset: () => void }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 3000)
    return () => clearTimeout(t)
  }, [armed])
  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          setArmed(false)
          onReset()
        } else setArmed(true)
      }}
      aria-label={armed ? 'Confirm reset to chapter 0 and reset timer' : 'Reset presentation and timer'}
      title={armed ? 'Click again to confirm' : 'Reset: back to chapter 0, timer to 0:00'}
      className={`flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors ${
        armed ? 'border-amber/60 bg-amber/15 text-amber' : 'w-9 justify-center border-line bg-ink/40 text-silver hover:border-violet/50 hover:text-snow'
      }`}
    >
      <RotateCcw size={15} />
      {armed && <span className="whitespace-nowrap">Confirm reset</span>}
    </button>
  )
}
