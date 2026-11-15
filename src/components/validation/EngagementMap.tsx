import { motion } from 'framer-motion'
import { otherStudentAccounts } from '../../data/engagement'
import { ease } from '../ui'

/**
 * Abstract orbit diagram of stakeholder engagement. NOT a geographic claim.
 * Imperial sits at the centre (one demonstration, a reported stakeholder statement);
 * other London universities appear only as neutral outlined nodes = individual student accounts.
 */
const CX = 380
const CY = 220
const RX = 290
const RY = 150
const angles = [-145, -35, 145, 35]

export default function EngagementMap({ showOthers }: { showOthers: boolean }) {
  return (
    <svg viewBox="0 0 760 440" className="h-auto w-full" role="img" aria-label="Abstract engagement map: Imperial at the centre, with individual student accounts from four other London universities on the outer orbit. Not geographic.">
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="rgb(148 163 184 / 0.22)" strokeDasharray="2 7" />
      <ellipse cx={CX} cy={CY} rx={190} ry={100} fill="none" stroke="rgb(148 163 184 / 0.14)" />

      {otherStudentAccounts.map((u, i) => {
        const a = (angles[i] * Math.PI) / 180
        const x = CX + RX * Math.cos(a)
        const y = CY + RY * Math.sin(a)
        return (
          <motion.g key={u.id} initial={false} animate={{ opacity: showOthers ? 1 : 0, scale: showOthers ? 1 : 0.92 }} transition={{ duration: 0.6, ease, delay: showOthers ? 0.1 + i * 0.12 : 0 }} style={{ transformOrigin: `${x}px ${y}px` }} aria-hidden={!showOthers}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="rgb(148 163 184 / 0.18)" strokeDasharray="3 6" />
            <rect x={x - 112} y={y - 31} width={224} height={62} rx={14} fill="#080d1a" stroke="rgb(148 163 184 / 0.55)" strokeDasharray="5 4" strokeWidth={1.4} />
            <text x={x} y={y - 3} textAnchor="middle" fill="#f8fafc" fontSize={17} fontWeight={600}>
              {u.name}
            </text>
            <text x={x} y={y + 19} textAnchor="middle" fill="var(--color-ev-observed)" fontSize={13} fontFamily="var(--font-mono)" letterSpacing={1}>
              STUDENT ACCOUNT
            </text>
          </motion.g>
        )
      })}

      <rect x={CX - 150} y={CY - 52} width={300} height={104} rx={18} fill="rgb(56 189 248 / 0.07)" stroke="var(--color-ev-reported)" strokeWidth={1.8} />
      <text x={CX} y={CY - 12} textAnchor="middle" fill="#f8fafc" fontSize={22} fontWeight={600}>
        Imperial
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" fill="#cbd5e1" fontSize={15}>
        Careers demonstration
      </text>
      <text x={CX} y={CY + 36} textAnchor="middle" fill="var(--color-ev-reported)" fontSize={13} fontFamily="var(--font-mono)" letterSpacing={1}>
        REPORTED
      </text>
    </svg>
  )
}
