import { useEffect, useRef } from 'react'
import { opportunityLabels } from '../data/events'

/**
 * Canvas "opportunity universe": luminous nodes on gentle elliptical orbits.
 * - `intensity` 0..1 controls how many nodes are visible (they emerge over time).
 * - `converge` 0..1 pulls every node into a tidy ring around the centre (used in the finale).
 * - `onCount` reports how many opportunities are currently visible.
 * Lightweight 2D canvas; no WebGL needed, so it degrades gracefully on projectors.
 */
export function OrbitField({
  intensity = 1,
  converge = 0,
  labels = true,
  dim = false,
  onCount,
  className = '',
}: {
  intensity?: number
  converge?: number
  labels?: boolean
  dim?: boolean
  onCount?: (n: number) => void
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const props = useRef({ intensity, converge, labels, dim, onCount })
  props.current = { intensity, converge, labels, dim, onCount }

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const N = 140
    const palette = ['#8066FF', '#3B82F6', '#3DE0EA', '#B7A8FF', '#FFA36B', '#D6C8FF']
    const rand = mulberry32(7)
    const nodes = Array.from({ length: N }, (_, i) => {
      const r = 0.12 + Math.pow(rand(), 0.7) * 0.75
      return {
        r,
        a: rand() * Math.PI * 2,
        speed: (0.012 + rand() * 0.03) * (rand() > 0.5 ? 1 : -1) * (0.6 / (r + 0.2)),
        tilt: 0.42 + rand() * 0.18,
        size: 0.8 + rand() * 2.2,
        color: palette[Math.floor(rand() * palette.length)],
        born: rand(), // threshold vs intensity
        label: i < 48 ? opportunityLabels[i % opportunityLabels.length] : null,
        labelPhase: rand() * 20,
        ringA: (i / N) * Math.PI * 2,
        conv: 0,
      }
    })

    let raf = 0
    let last = performance.now()
    let t = 0
    let shown = 0
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!reduce) t += dt
      const { intensity, converge, labels, dim, onCount } = props.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const R = Math.max(w, h) * 0.62

      let visible = 0
      const pts: { x: number; y: number; n: (typeof nodes)[number]; alpha: number }[] = []
      for (const n of nodes) {
        if (n.born > intensity) continue
        visible++
        if (!reduce) n.a += n.speed * dt
        n.conv += (converge - n.conv) * Math.min(1, dt * 2.2)
        const ox = cx + Math.cos(n.a) * n.r * R
        const oy = cy + Math.sin(n.a) * n.r * R * n.tilt
        const rr = Math.min(w, h) * 0.3
        const tx = cx + Math.cos(n.ringA + t * 0.15) * rr
        const ty = cy + Math.sin(n.ringA + t * 0.15) * rr * 0.62
        const x = ox + (tx - ox) * n.conv
        const y = oy + (ty - oy) * n.conv
        const fadeIn = Math.min(1, (intensity - n.born) * 8)
        const alpha = fadeIn * (dim ? 0.35 : 1)
        pts.push({ x, y, n, alpha })
      }

      // faint connecting lines when converging
      if (converge > 0.05) {
        ctx.lineWidth = 0.6
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i]
          ctx.strokeStyle = `rgba(128,102,255,${0.22 * converge * p.alpha})`
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(cx, cy)
          ctx.stroke()
        }
      }

      for (const { x, y, n, alpha } of pts) {
        const tw = 0.65 + 0.35 * Math.sin(t * 1.6 + n.labelPhase)
        ctx.globalAlpha = alpha * tw
        const g = ctx.createRadialGradient(x, y, 0, x, y, n.size * 6)
        g.addColorStop(0, n.color)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, n.size * 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#F7F9FC'
        ctx.beginPath()
        ctx.arc(x, y, n.size * 0.7, 0, Math.PI * 2)
        ctx.fill()

        if (labels && n.label && converge < 0.5 && !(Math.abs(x - cx) < w * 0.32 && Math.abs(y - cy) < h * 0.26)) {
          // each label lives ~6s then fades — some vanish before you can read them
          const cyc = (t + n.labelPhase) % 14
          const la = cyc < 1 ? cyc : cyc < 5 ? 1 : cyc < 6 ? 6 - cyc : 0
          if (la > 0.01) {
            ctx.globalAlpha = la * alpha * 0.85 * (1 - converge * 2)
            ctx.font = '500 12px "Inter Tight", system-ui, sans-serif'
            ctx.fillStyle = '#C9D2E0'
            ctx.fillText(n.label, x + 9, y + 4)
          }
        }
      }
      ctx.globalAlpha = 1

      if (visible !== shown) {
        shown = visible
        onCount?.(visible)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
