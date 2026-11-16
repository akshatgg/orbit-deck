import { ArrowRight } from 'lucide-react'
import { attendance, attendanceLadder, scorecard } from '../../data/pilot'
import { EvidenceTag } from '../ui'

export function Gates() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <EvidenceTag label="proposed" text="Proposed gates · illustrative targets" />
      </div>
      <ul className="mt-3 grid gap-2">
        {scorecard.map((g) => (
          <li key={g.id} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 rounded-xl border border-dashed px-4 py-2.5" style={{ borderColor: 'color-mix(in srgb, var(--color-ev-proposed) 45%, transparent)' }}>
            <span className="num text-[clamp(1.2rem,1.7vw,1.7rem)] text-violet-soft">{g.value}</span>
            <span className="leading-tight">
              <span className="block text-[16px] font-medium text-snow">{g.gate}</span>
              <span className="block text-[13.5px] text-silver">{g.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AttendanceCalc() {
  const pct = Math.round((attendance.target / attendance.baseline - 1) * 100)
  return (
    <div className="rounded-2xl border border-line p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-soft">Attendance gate · worked example</div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="num text-3xl text-snow">{attendance.baseline.toFixed(2)}</span>
        <ArrowRight size={20} className="text-dim" />
        <span className="num text-3xl text-violet-soft">{attendance.target.toFixed(2)}</span>
        <span className="num text-xl text-snow">= +{pct}% relative</span>
      </div>
      <p className="mt-1 text-[14px] text-silver">Verified attendances per eligible student: baseline, then target.</p>
      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[14.5px] text-silver">
        {attendance.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  )
}

export function ClickLadder() {
  return (
    <div className="rounded-2xl border border-line p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber">Why a click is not attendance</div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
        {attendanceLadder.map((s, i) => (
          <li key={s.label} className="rounded-xl border border-line p-3" style={{ background: `rgb(167 139 250 / ${0.05 + i * 0.05})` }}>
            <div className="flex items-center gap-1.5 text-[15px] font-semibold text-snow">
              <span className="num text-dim">{i + 1}</span> {s.label}
            </div>
            <p className="mt-1 text-[13.5px] leading-snug text-silver">{s.text}</p>
            <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-wider text-violet-soft">{s.who}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
