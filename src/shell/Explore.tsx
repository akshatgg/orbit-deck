import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Play } from 'lucide-react'
import { Fragment, useEffect, useState, type ComponentType } from 'react'
import { chapterComponents } from '../chapters'
import { Kicker, Logo, OrbitFieldLazy, ease } from './exploreParts'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import { ModeToggle } from './ModeToggle'
import { presentHash } from './route'

type Block = { chapter: string } | { extra: ComponentType; title: string }

interface Section {
  id: string
  label: string
  blocks: Block[]
}

/** Explore-mode information architecture. Chapters are reused (no duplicated content). */
export const sections: Section[] = [
  { id: 'overview', label: 'Overview', blocks: [] },
  { id: 'ideation', label: '1 · Ideation & Screening', blocks: [{ chapter: 'question' }, { chapter: 'origin' }, { chapter: 'screening' }] },
  { id: 'discovery', label: '2 · Discovery', blocks: [{ chapter: 'learning-before-building' }, { chapter: 'what-students-told-us' }, { chapter: 'assumptions-changed' }] },
  { id: 'bmd', label: '3 · Business Model', blocks: [{ chapter: 'jtbd' }, { chapter: 'product' }, { chapter: 'who-pays' }, { chapter: 'lean-canvas' }, { chapter: 'viability' }] },
  { id: 'validation', label: '4 · Validation', blocks: [{ chapter: 'market-engagement' }, { chapter: 'coaching' }, { chapter: 'experiment' }, { chapter: 'scale' }] },
  { id: 'verdict', label: 'Verdict', blocks: [{ chapter: 'verdict' }] },
]

const noop = () => {}

export function Explore({ section, go }: { section: string | null; go: (hash: string, replace?: boolean) => void }) {
  const [active, setActive] = useState(section ?? 'overview')

  useEffect(() => {
    if (!section) {
      window.scrollTo(0, 0)
      return
    }
    // wait for charts/layout to settle, then jump (re-check once in case content above grew)
    const jumpTo = () => document.getElementById(section)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    const t1 = setTimeout(jumpTo, 60)
    const t2 = setTimeout(jumpTo, 600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (vis) {
          setActive(vis.target.id)
          window.history.replaceState(null, '', `#/explore/${vis.target.id}`)
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="atmosphere min-h-full text-snow">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-8">
          <button onClick={() => jump('overview')} aria-label="Top">
            <Logo size={24} />
          </button>
          <nav className="scrollbar-thin -mx-1 flex flex-1 gap-1 overflow-x-auto px-1" aria-label="Explore sections">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                aria-current={active === s.id}
                className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active === s.id ? 'text-snow' : 'text-silver hover:text-snow'}`}
              >
                {active === s.id && <motion.span layoutId="explore-nav" className="absolute inset-0 -z-10 rounded-full bg-white/10" />}
                {s.label}
              </button>
            ))}
          </nav>
          <ModeToggle mode="explore" onPresent={() => go(presentHash(0, 0), false)} />
        </div>
      </header>

      <Overview go={go} />

      {sections.slice(1).map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-16 border-t border-line/60">
          {s.blocks.map((b, i) => {
            if ('chapter' in b) {
              const C = chapterComponents[b.chapter]
              const meta = chapters.find((c) => c.slug === b.chapter)!
              return (
                <Fragment key={i}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease }}>
                    <C mode="explore" step={meta.steps - 1} setStep={noop} />
                  </motion.div>
                </Fragment>
              )
            }
            const E = b.extra
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease }}>
                <E />
              </motion.div>
            )
          })}
        </section>
      ))}

      <footer className="border-t border-line px-6 py-12 text-center text-xs text-dim">
        <Logo size={22} className="mb-3 justify-center" />
        <p>{pitchConfig.course} · {pitchConfig.school}</p>
        <p className="mt-1">All 2027–2031 figures are financial-model projections. Demo events and personas are illustrative.</p>
      </footer>
    </div>
  )
}

function Overview({ go }: { go: (hash: string, replace?: boolean) => void }) {
  return (
    <section id="overview" className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <OrbitFieldLazy intensity={0.7} labels={false} />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
        <Kicker>Explore mode · for judges, professors and classmates</Kicker>
        <h1 className="t-display mt-5 max-w-5xl">
          Orbit. <span className="font-serif font-normal italic text-gradient">Discover your next opportunity.</span>
        </h1>
        <p className="t-lead mt-6 max-w-3xl">
          {pitchConfig.valueProposition} A student event-discovery venture by six MSc Innovation, Entrepreneurship & Management students at Imperial College Business School.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => go(presentHash(0, 0), false)} className="inline-flex items-center gap-2 rounded-full bg-snow px-5 py-2.5 text-sm font-medium text-ink">
            <Play size={14} /> Watch the presentation
          </button>
          <button onClick={() => document.getElementById('references')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-snow hover:border-violet/60">
            Go to the Evidence Room <ArrowRight size={14} />
          </button>
          {pitchConfig.prototypeUrl && (
            <a href={pitchConfig.prototypeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-snow hover:border-violet/60">
              Launch real prototype <ExternalLink size={14} />
            </a>
          )}
        </div>
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['I', 'The Invisible Problem', 'problem'],
            ['II', 'The Evidence', 'research'],
            ['III', 'The Solution', 'product'],
            ['IV', 'The Business', 'business-model'],
            ['V', 'The Decision', 'assumptions'],
          ].map(([n, t, id]) => (
            <button key={n} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} className="glass rounded-2xl p-5 text-left transition-colors hover:border-violet/50">
              <div className="num text-xs text-violet-soft">Act {n}</div>
              <div className="mt-2 text-lg font-semibold">{t}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
