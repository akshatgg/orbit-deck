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

/** Fade/slide-in gated by `show` (presenter step) — rises out of depth, animates out when hidden. */
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
      style={{ transformPerspective: 900 }}
      animate={show ? { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y, rotateX: 10, scale: 0.98, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease, delay: show ? delay : 0 }}
      aria-hidden={!show}
    >
      {children}
    </M>
  )
}

/**
 * Parse accent markers: words wrapped in *asterisks* render as the glowing serif accent.
 * With no markers and `autoAccent`, a two-sentence headline accents its second sentence,
 * otherwise the last two words.
 */
function splitAccent(text: string, autoAccent: boolean): { w: string; accent: boolean }[] {
  if (text.includes('*')) {
    const out: { w: string; accent: boolean }[] = []
    text.split(/(\*[^*]+\*)/).forEach((part) => {
      const accent = part.startsWith('*') && part.endsWith('*')
      part.replace(/\*/g, '').split(' ').filter(Boolean).forEach((w) => out.push({ w, accent }))
    })
    return out
  }
  const words = text.split(' ')
  if (!autoAccent || words.length < 4) return words.map((w) => ({ w, accent: false }))
  const sentences = text.match(/[^.?!]+[.?!]+/g)
  let from = words.length - 2
  if (sentences && sentences.length >= 2) from = words.length - sentences[sentences.length - 1].trim().split(' ').length
  return words.map((w, i) => ({ w, accent: i >= from }))
}

/** Staggered 3D word-flip headline (words rise and rotate in from below). */
export function SplitHeadline({ text, show = true, className = '', delay = 0, autoAccent = false }: { text: string; show?: boolean; className?: string; delay?: number; autoAccent?: boolean }) {
  const words = splitAccent(text, autoAccent)
  const plain = text.replace(/\*/g, '')
  return (
    <span className={className} aria-label={plain} style={{ perspective: 900 }}>
      {words.map(({ w, accent }, i) => (
        <span key={i} className="-mx-[0.08em] inline-block px-[0.08em] pb-[0.1em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block origin-bottom ${accent ? 'accent' : ''}`}
            initial={false}
            animate={show ? { y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)' } : { y: '60%', opacity: 0, rotateX: -75, filter: 'blur(6px)' }}
            transition={{ duration: 0.9, ease, delay: show ? delay + i * 0.05 : 0 }}
          >
            {w}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Inline expressive accent (serif italic, animated gradient, soft glow). */
export const Accent = ({ children, warm = false, className = '' }: { children: ReactNode; warm?: boolean; className?: string }) => (
  <span className={`${warm ? 'accent-warm' : 'accent'} ${className}`}>{children}</span>
)

/** Card that tilts in 3D toward the pointer, with a moving glare. Purely decorative motion. */
export function TiltCard({ children, className = '', max = 6, glow = false }: { children: ReactNode; className?: string; max?: number; glow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })
  return (
    <motion.div
      ref={ref}
      className={`glass relative overflow-hidden rounded-2xl ${glow ? 'glow-ring' : ''} ${className}`}
      style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      animate={{ rotateX: t.rx, rotateY: t.ry }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.6 }}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        setT({ rx: (0.5 - py) * max, ry: (px - 0.5) * max, gx: px * 100, gy: py * 100, on: true })
      }}
      onPointerLeave={() => setT({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: t.on ? 1 : 0, background: `radial-gradient(420px circle at ${t.gx}% ${t.gy}%, rgb(255 255 255 / 0.07), transparent 45%)` }}
      />
      {children}
    </motion.div>
  )
}

/** Big luminous number that counts up (pitch-style stat). */
export function GlowNumber({ value, format, className = '', suffix }: { value: number; format?: (n: number) => string; className?: string; suffix?: ReactNode }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <CountUp value={value} format={format} className="glow-num font-semibold tracking-tight text-snow" />
      {suffix}
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
    <div className={`glass relative rounded-2xl ${glow ? 'glow-ring shadow-[0_0_60px_-20px_rgba(139,92,246,0.6)]' : ''} ${className}`}>{children}</div>
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
    primary: 'bg-snow text-ink hover:bg-white shadow-[0_8px_30px_-10px_rgba(139,92,246,0.8)] hover:shadow-[0_10px_40px_-8px_rgba(139,92,246,0.95)]',
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
      <h2 className="t-h1 mt-4">{typeof title === 'string' ? <SplitHeadline text={title} show={show} delay={0.08} autoAccent /> : title}</h2>
      {lead && (
        <Reveal show={show} delay={0.25}>
          <p className={`t-lead mt-5 max-w-3xl ${center ? 'mx-auto' : ''}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  )
}
