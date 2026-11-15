import { motion } from 'framer-motion'
import { missCauses, surveyN, interviewN } from '../../data/research'

export type DotView = 'all' | 'missed' | 'toomany' | 'interview' | 'causes'

const BLUE = '#60a5fa' // ev-observed
const NEUTRAL = '#cbd5e1'
const UNLIT = '#334155'
const SILVER = '#94a3b8'
const GREY = '#475569'

/** Group order for the "causes" view: discovery-related first so the combined 23 sit together. */
const groups = [
  { id: 'late', label: 'Heard too late', n: missCauses.find((c) => c.id === 'late')!.value, disc: true },
  { id: 'deadline', label: 'Missed registration deadline', n: missCauses.find((c) => c.id === 'deadline')!.value, disc: true },
  { id: 'full', label: 'Event full', n: missCauses.find((c) => c.id === 'full')!.value, disc: true },
  { id: 'clash', label: 'Timetable clash', n: missCauses.find((c) => c.id === 'clash')!.value, disc: false },
  { id: 'forgot', label: 'Forgot', n: missCauses.find((c) => c.id === 'forgot')!.value, disc: false },
  { id: 'other', label: 'Not in listed categories', n: surveyN - 38, disc: false },
]

const W = 576
const H = 380

function causePos(i: number) {
  let acc = 0
  for (let g = 0; g < groups.length; g++) {
    if (i < acc + groups[g].n) {
      const k = i - acc
      return { x: 238 + k * 23, y: 38 + g * 58, g }
    }
    acc += groups[g].n
  }
  return { x: 0, y: 0, g: 0 }
}

function gridPos(i: number) {
  const col = i % 7
  const row = Math.floor(i / 7)
  return { x: W / 2 - 3 * 54 + col * 54 - 8, y: 44 + row * 58 }
}

function target(i: number, view: DotView, lit: { missed: number; toomany: number }) {
  const g = gridPos(i)
  switch (view) {
    case 'all':
      return { ...g, r: 17, fill: NEUTRAL, opacity: 0.85 }
    case 'missed':
      return { ...g, r: 17, fill: i < lit.missed ? BLUE : UNLIT, opacity: i < lit.missed ? 1 : 0.7 }
    case 'toomany':
      return { ...g, r: 17, fill: i < lit.toomany ? BLUE : UNLIT, opacity: i < lit.toomany ? 1 : 0.7 }
    case 'interview':
      if (i < interviewN) return { x: 32 + i * 42, y: H / 2, r: 15, fill: i < 12 ? BLUE : UNLIT, opacity: i < 12 ? 1 : 0.8 }
      return { ...g, r: 17, fill: UNLIT, opacity: 0 }
    case 'causes': {
      const p = causePos(i)
      const grp = groups[p.g]
      return { x: p.x, y: p.y, r: 8.5, fill: grp.id === 'other' ? GREY : grp.disc ? BLUE : SILVER, opacity: grp.id === 'other' ? 0.8 : 1 }
    }
  }
}

/** 42 respondent dots (SVG). Dots slide between layouts; positions show counts, not respondent overlap. */
export function DotField({ view, missed = 35, toomany = 31 }: { view: DotView; missed?: number; toomany?: number }) {
  const lit = { missed, toomany }
  const causes = view === 'causes'
  return (
    <svg viewBox={`-8 0 ${W + 8} ${H}`} className="h-auto max-h-[46vh] w-full" role="img" aria-label={`${surveyN} survey respondent dots, view: ${view}`}>
      {/* highlight: combined discovery-related misses */}
      <motion.rect
        x={-6}
        y={10}
        width={W + 2}
        height={176}
        rx={14}
        fill="rgb(96 165 250 / 0.06)"
        stroke="#60a5fa"
        strokeDasharray="5 5"
        strokeOpacity={0.55}
        initial={false}
        animate={{ opacity: causes ? 1 : 0 }}
        transition={{ duration: 0.5, delay: causes ? 0.5 : 0 }}
      />
      {Array.from({ length: surveyN }, (_, i) => {
        const t = target(i, view, lit)
        return (
          <motion.circle
            key={i}
            initial={false}
            animate={{ cx: t.x, cy: t.y, r: t.r, fill: t.fill, opacity: t.opacity }}
            transition={{ duration: 0.7, delay: Math.min(i, 41) * 0.008, ease: [0.22, 1, 0.36, 1] }}
          />
        )
      })}
      {groups.map((g, gi) => (
        <motion.g key={g.id} initial={false} animate={{ opacity: causes ? 1 : 0 }} transition={{ duration: 0.4, delay: causes ? 0.4 : 0 }}>
          <text x={0} y={38 + gi * 58 + 5} fontSize={15} fill={g.id === 'other' ? '#94a3b8' : '#f8fafc'} fontFamily="Inter Tight, sans-serif">
            {g.label}
          </text>
          <text x={238 + g.n * 23 + 2} y={38 + gi * 58 + 6} fontSize={16} fill="#f8fafc" fontFamily="JetBrains Mono, monospace">
            {g.n}
          </text>
        </motion.g>
      ))}
      <motion.text
        x={W - 8}
        y={126}
        textAnchor="end"
        fontSize={52}
        fontFamily="JetBrains Mono, monospace"
        fill="#60a5fa"
        initial={false}
        animate={{ opacity: causes ? 1 : 0 }}
        transition={{ duration: 0.5, delay: causes ? 0.7 : 0 }}
      >
        23
      </motion.text>
    </svg>
  )
}
