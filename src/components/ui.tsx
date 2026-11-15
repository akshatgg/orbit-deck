import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ChevronDown, Info } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { labelMeta, statusMeta, type EvidenceLabel, type Learning, type Status } from '../data/evidence'
import { stages, type StageId } from '../data/chapters'

export const ease = [0.22, 1, 0.36, 1] as const

/* ---------- Brand ---------- */

export function Logo({ size = 28, wordmark = true, className = '' }: { size?: number; wordmark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/brand/orbit-logo.webp" alt="" width={size} height={size} style={{ width: size, height: size }} className="select-none" draggable={false} />
      {wordmark && (
        <span className="font-semibold tracking-[0.28em] text-snow" style={{ fontSize: size * 0.55 }}>
          ORBIT
        </span>
      )}
    </span>
  )
}

/* ---------- Text ---------- */

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`t-kicker ${className}`}>{children}</div>
}

/** Fade/slide-in gated by `show` (presenter step) — animates out when hidden. */
export function Reveal({
  show = true,
  delay = 0,
  y = 18,
  children,
  className = '',
  as = 'div',
}: {
  show?: boolean
  delay?: number
  y?: number
  children: ReactNode
  className?: string
  as?: 'div' | 'span' | 'li' | 'p' | 'h1' | 'h2'
}) {
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      initial={false}
      animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease, delay: show ? delay : 0 }}
      aria-hidden={!show}
    >
      {children}
    </M>
  )
}

/** Staggered word-by-word headline. */
export function SplitHeadline({ text, show = true, className = '', delay = 0 }: { text: string; show?: boolean; className?: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="-mx-[0.08em] inline-block overflow-hidden px-[0.08em] pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={false}
            animate={show ? { y: '0%', opacity: 1 } : { y: '105%', opacity: 0 }}
            transition={{ duration: 0.75, ease, delay: show ? delay + i * 0.045 : 0 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ---------- Labels ---------- */

export function Badge({ children, tone = 'violet', className = '' }: { children: ReactNode; tone?: 'violet' | 'amber' | 'silver' | 'cyan'; className?: string }) {
  const tones = {
    violet: 'border-violet/40 text-violet-soft bg-violet/10',
    amber: 'border-amber/40 text-amber bg-amber/10',
    silver: 'border-silver/30 text-silver bg-silver/5',
    cyan: 'border-cyan/40 text-cyan bg-cyan/10',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export const IllustrativeBadge = ({ label = 'Illustrative', className = '' }: { label?: string; className?: string }) => (
  <Badge tone="amber" className={className}>
    <span className="h-1.5 w-1.5 rounded-full bg-amber" /> {label}
  </Badge>
)

/** Evidence-convention tag: OBSERVED · REPORTED · MODELLED · PROPOSED · UNRESOLVED (§27). */
export function EvidenceTag({ label, className = '', text }: { label: EvidenceLabel; className?: string; text?: string }) {
  const m = labelMeta[label]
  return (
    <span
      title={m.meaning}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] ${className}`}
      style={{ borderColor: `color-mix(in srgb, ${m.color} 45%, transparent)`, color: m.color, background: `color-mix(in srgb, ${m.color} 9%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {text ?? m.label}
    </span>
  )
}

/** @deprecated use <EvidenceTag label="modelled" /> */
export const ProjectionBadge = ({ className = '' }: { className?: string }) => <EvidenceTag label="modelled" className={className} />

/** Framework stage label, e.g. "Stage 2 · Discovery". */
export function StageLabel({ stage, className = '' }: { stage: StageId; className?: string }) {
  const s = stages[stage]
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] ${className}`} style={{ color: s.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {stage === 'verdict' ? s.label : `Stage ${s.n} · ${s.label}`}
    </span>
  )
}

/**
 * The recurring storytelling device (§2) that closes every major chapter:
 * What we believed → What we investigated → What we learned → What changed.
 * `compact` renders one row for present mode.
 */
export function LearningCard({ learning, show = true, compact = false, className = '' }: { learning: Learning; show?: boolean; compact?: boolean; className?: string }) {
  const cols: { k: keyof Learning; t: string; c: string }[] = [
    { k: 'believed', t: 'What we believed', c: 'var(--color-silver)' },
    { k: 'investigated', t: 'What we investigated', c: 'var(--color-ev-observed)' },
    { k: 'learned', t: 'What we learned', c: 'var(--color-st-supported)' },
    { k: 'changed', t: 'What changed', c: 'var(--color-ev-proposed)' },
  ]
  return (
    <div className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 ${className}`} aria-label="Learning card">
      {cols.map((col, i) => (
        <Reveal key={col.k} show={show} delay={i * 0.12} className={`bg-navy/95 ${compact ? 'p-4' : 'p-5'}`}>
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: col.c }}>
            <span className="num text-dim">{i + 1}</span> {col.t}
            {i < 3 && <span className="ml-auto hidden text-dim lg:inline">→</span>}
          </div>
          <p className={`mt-2 leading-snug text-snow ${compact ? 'text-[15px]' : 'text-base'}`}>{learning[col.k]}</p>
        </Reveal>
      ))}
    </div>
  )
}

export function SourceNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-start gap-1.5 font-mono text-[11px] leading-relaxed text-dim ${className}`}>
      <Info size={12} className="mt-[2px] shrink-0" />
      <span>{children}</span>
    </p>
  )
}

export function StatusPill({ status, className = '' }: { status: Status; className?: string }) {
  const m = statusMeta[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{ borderColor: `color-mix(in srgb, ${m.color} 45%, transparent)`, color: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

/* ---------- Containers ---------- */

export function Card({ children, className = '', glow = false }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`glass relative rounded-2xl ${glow ? 'shadow-[0_0_60px_-20px_rgba(128,102,255,0.6)]' : ''} ${className}`}>{children}</div>
  )
}

export function Expandable({ title, children, defaultOpen = false, className = '' }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`glass rounded-xl ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-snow"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown size={16} className={`shrink-0 text-silver transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
            <div className="px-4 pb-4 text-sm leading-relaxed text-silver">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  href,
  size = 'md',
  ...rest
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  className?: string
  href?: string
  size?: 'sm' | 'md' | 'lg'
  'aria-label'?: string
  'aria-pressed'?: boolean
}) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4.5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }
  const variants = {
    primary: 'bg-snow text-ink hover:bg-white shadow-[0_8px_30px_-10px_rgba(128,102,255,0.7)]',
    ghost: 'text-silver hover:text-snow hover:bg-white/5',
    outline: 'border border-line text-snow hover:border-violet/60 hover:bg-violet/10',
  }
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors ${sizes[size]} ${variants[variant]} ${className}`
  const stop = (e: React.MouseEvent) => e.stopPropagation()
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} onClick={stop} {...rest}>
        {children}
      </a>
    )
  return (
    <button
      type="button"
      className={cls}
      onClick={(e) => {
        stop(e)
        onClick?.()
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------- Numbers ---------- */

/** Counts up to `value` when visible. `format` renders the number. */
export function CountUp({ value, format = (n) => Math.round(n).toLocaleString('en-GB'), duration = 1.2, className = '' }: { value: number; format?: (n: number) => string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)
  const last = useRef(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setDisplay(value)
      return
    }
    const controls = animate(last.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    last.current = value
    return () => controls.stop()
  }, [value, inView, reduce, duration])
  return (
    <span ref={ref} className={`num ${className}`}>
      {format(display)}
    </span>
  )
}

/* ---------- Layout ---------- */

/**
 * Standard chapter frame. In present mode it fills the 16:9 stage;
 * in explore mode it becomes a normal flowing section.
 */
export function Stage({ children, className = '', mode, center = false }: { children: ReactNode; className?: string; mode: 'present' | 'explore'; center?: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[1500px] px-5 sm:px-10 lg:px-16 ${
        mode === 'present' ? 'flex h-full flex-col justify-center py-16 sm:py-20' : 'py-20 sm:py-28'
      } ${center ? 'items-center text-center' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function ChapterHeader({ num, kicker, title, lead, show = true, center = false }: { num: string; kicker: string; title: ReactNode; lead?: ReactNode; show?: boolean; center?: boolean }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-5xl`}>
      <Reveal show={show}>
        <Kicker>
          <span className="text-dim">{num}</span> <span className="mx-2 text-dim">/</span> {kicker}
        </Kicker>
      </Reveal>
      <h2 className="t-h1 mt-4">{typeof title === 'string' ? <SplitHeadline text={title} show={show} delay={0.08} /> : title}</h2>
      {lead && (
        <Reveal show={show} delay={0.25}>
          <p className={`t-lead mt-5 max-w-3xl ${center ? 'mx-auto' : ''}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  )
}
