import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Badge, Kicker, Reveal, SplitHeadline, Stage, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { operatingModel, teamMembers, teamStrengths } from '../data/strategy'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'team')!

const PROGRAMME = 'MSc Innovation, Entrepreneurship & Management'
const SCHOOL = 'Imperial College Business School'

/**
 * Optional headshots, keyed by team member name. Drop files into
 * /public/team/ and add e.g. 'Rong Gao': '/team/rong-gao.jpg'.
 * Members without a photo get an initials avatar.
 */
const photos: Record<string, string | undefined> = {}

const avatarGradients = [
  'linear-gradient(135deg, #8066ff, #3b82f6)',
  'linear-gradient(135deg, #3b82f6, #3de0ea)',
  'linear-gradient(135deg, #b7a8ff, #ffa36b)',
  'linear-gradient(135deg, #8066ff, #3de0ea)',
  'linear-gradient(135deg, #3de0ea, #b7a8ff)',
  'linear-gradient(135deg, #ffa36b, #8066ff)',
]

/** CHAPTER 14 — The team. Names and programme only; no invented titles or credentials. */
export default function Ch14Team({ mode }: ChapterProps) {
  return (
    <Stage mode={mode}>
      <div className="max-w-5xl">
        <Reveal>
          <Kicker>
            <span className="text-dim">{meta.num}</span> <span className="mx-2 text-dim">/</span> {meta.actTitle} · {meta.title}
          </Kicker>
        </Reveal>
        <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
          <SplitHeadline text="Built by students who" delay={0.08} />{' '}
          <span className="font-serif font-normal italic text-gradient-warm">
            <SplitHeadline text="experience the problem." delay={0.3} />
          </span>
        </h2>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-8 xl:grid-cols-6">
        {teamMembers.map((m, i) => {
          const photo = photos[m.name]
          return (
            <motion.li
              key={m.name}
              className="glass flex flex-col items-center rounded-2xl px-3 py-5 text-center"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.07, ease }}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full opacity-60 blur-md" style={{ background: avatarGradients[i % avatarGradients.length] }} />
                {photo ? (
                  <img src={photo} alt={m.name} className="relative h-[4.5rem] w-[4.5rem] rounded-full border border-white/20 object-cover" />
                ) : (
                  <div
                    className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-white/20 p-[2px]"
                    style={{ background: avatarGradients[i % avatarGradients.length] }}
                    aria-hidden
                  >
                    <div className="grid h-full w-full place-items-center rounded-full bg-navy">
                      <span className="text-xl font-semibold tracking-wide text-snow">{m.initials}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-[17px] font-semibold leading-tight">{m.name}</div>
              <div className="mt-1.5 text-[12.5px] leading-snug text-silver">{PROGRAMME}</div>
              <div className="text-[12.5px] leading-snug text-dim">{SCHOOL}</div>
            </motion.li>
          )
        })}
      </ul>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Reveal delay={0.6} className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-semibold">Why this team, for now</span>
            <Badge tone="silver">Not a competitive moat</Badge>
          </div>
          <ul className="mt-3 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
            {teamStrengths.map((s) => (
              <li key={s} className="flex gap-2 text-base leading-snug text-snow">
                <Check size={16} className="mt-1 shrink-0 text-cyan" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-silver">Advantages for early testing — not an established competitive moat.</p>
        </Reveal>

        <Reveal delay={0.75} className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-semibold">Proposed operating model</span>
            <Badge tone="amber">Proposed</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {operatingModel.map((o, i) => (
              <li key={o.role} className="flex items-baseline gap-3">
                <span className="num text-xs text-violet-soft">0{i + 1}</span>
                <span className="text-base">
                  <span className="font-semibold text-snow">{o.role}</span> <span className="text-silver">— {o.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-silver">Proposed operating plan, not necessarily the final ownership structure of the six-person student project.</p>
        </Reveal>
      </div>
    </Stage>
  )
}
