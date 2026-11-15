import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { RoleBadge, StakeholderMap } from '../components/bmd/StakeholderMap'
import { Card, ChapterHeader, EvidenceTag, Expandable, LearningCard, Reveal, SourceNote, Stage, StageLabel, ease } from '../components/ui'
import { chapters } from '../data/chapters'
import { pitchConfig } from '../data/config'
import type { Learning } from '../data/evidence'
import { roles, stakeholders, type Stakeholder, type StakeholderId } from '../data/jtbd'
import type { ChapterProps } from '../shell/types'

const meta = chapters.find((c) => c.slug === 'jtbd')!

const learning: Learning = {
  believed: 'We were designing an app for students.',
  investigated: 'Jobs-to-be-Done across four stakeholders.',
  learned: 'The user, the payer and the gatekeeper are different parties, with different decision rights.',
  changed: 'The value proposition now centres on timely, relevant discovery for the user and visibility for the payer.',
}

const stepOrder: StakeholderId[] = ['student', 'university', 'organiser', 'it']

function JobPanel({ s, showRole }: { s: Stakeholder; showRole: boolean }) {
  return (
    <Card className="p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="text-xl font-semibold text-snow sm:text-2xl">{s.name}</h3>
        {showRole && <RoleBadge role={s.role} />}
        {s.id !== 'student' && <EvidenceTag label="proposed" text="Hypothesis" />}
      </div>
      <div className="t-kicker mt-5">Job to be done</div>
      <p className="mt-2 text-[clamp(1.1rem,1.55vw,1.5rem)] font-medium leading-snug text-snow">{s.job}</p>
      {s.alternatives && (
        <div className="mt-5">
          <div className="t-kicker !text-silver">Current alternatives</div>
          <p className="mt-1.5 text-base leading-snug text-silver">{s.alternatives}</p>
        </div>
      )}
      <div className="mt-5">
        <div className="t-kicker !text-silver">{s.detailLabel}</div>
        <p className="mt-1.5 text-base leading-snug text-snow">{s.detail}</p>
      </div>
    </Card>
  )
}

function RoleCards({ compact = false }: { compact?: boolean }) {
  const rows = [
    { k: 'user' as const, who: roles.user.who },
    { k: 'payer' as const, who: roles.payer.who },
    { k: 'gatekeeper' as const, who: roles.gatekeeper.who },
  ]
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <motion.div
          key={r.k}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.12 * i }}
          className={`rounded-2xl border bg-navy/90 ${compact ? 'p-3.5' : 'p-4'} ${r.k === 'payer' ? 'border-dashed border-violet/50' : 'border-line'}`}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <RoleBadge role={r.k} />
            <span className="text-base font-semibold text-snow">{r.who}</span>
          </div>
          <p className="mt-1.5 text-[15px] leading-snug text-silver">{roles[r.k].right}</p>
        </motion.div>
      ))}
    </div>
  )
}

function ValueProp({ show }: { show: boolean }) {
  return (
    <Reveal show={show} className="text-center">
      <div className="t-kicker">Refined value proposition</div>
      <p className="mx-auto mt-2 max-w-5xl text-[clamp(1.6rem,3.4vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-snow">{pitchConfig.valueProposition}</p>
    </Reveal>
  )
}

export default function Ch06Jtbd({ mode, step }: ChapterProps) {
  const present = mode === 'present'
  const revealed = present ? Math.min(Math.max(step, 0), 4) : 4
  const showRoles = present ? step >= 5 : true
  const [selected, setSelected] = useState<StakeholderId>('student')

  // each presenter step 1–4 brings its stakeholder into focus
  useEffect(() => {
    if (present && step >= 1 && step <= 4) setSelected(stepOrder[step - 1])
  }, [step, present])

  const sel = stakeholders.find((s) => s.id === selected)!
  const header = (
    <>
      <StageLabel stage={meta.stage} />
      <div className="mt-2">
        <ChapterHeader num={meta.num} kicker={meta.title} title={<span className="t-h2 block">{meta.headline}</span>} />
      </div>
    </>
  )

  const diagram = (h: string) => <StakeholderMap revealed={revealed} selected={revealed ? selected : null} onSelect={setSelected} showRoles={showRoles} className={h} />

  /* ---------------- Explore ---------------- */
  if (!present) {
    return (
      <Stage mode={mode}>
        {header}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          {diagram('h-[400px] sm:h-[460px]')}
          <JobPanel s={sel} showRole />
        </div>
        <p className="mt-2 text-sm text-dim">Select any stakeholder to read their job.</p>

        <div className="mt-14">
          <h3 className="t-h2">Same product, different decision rights</h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {(['user', 'payer', 'gatekeeper'] as const).map((k) => (
              <div key={k} className={`rounded-2xl border bg-navy/90 p-5 ${k === 'payer' ? 'border-dashed border-violet/50' : 'border-line'}`}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <RoleBadge role={k} />
                </div>
                <div className="mt-3 text-lg font-semibold text-snow">{roles[k].who}</div>
                <p className="mt-1.5 text-base leading-snug text-silver">{roles[k].right}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-silver">The event organiser sits on the supply side: they control the listing and the original registration page.</p>
        </div>

        <div className="mt-14">
          <ValueProp show />
        </div>

        <div className="mt-12 flex flex-col gap-3">
          <Expandable title="How we applied the framework">
            <p>
              Jobs-to-be-Done (Week 3, S2) asks what job a person hires a product to do, what they use today, and what outcome they want. We applied it to four parties rather than only the student, because the person who
              uses Orbit, the party that might fund it and the people who can block it are not the same.
            </p>
          </Expandable>
          <Expandable title="Evidence status of each job">
            <p>
              The student job reflects our student research (survey n = 42, interviews n = 13). The university, organiser and IT/data-owner jobs are hypotheses framed from the framework: we are not claiming interviews or
              commitments from those stakeholders.
            </p>
          </Expandable>
        </div>
        <SourceNote className="mt-6">Framework: NVC Week 3, Discovery and Business Model Design (S2).</SourceNote>
        <LearningCard learning={learning} className="mt-10" />
      </Stage>
    )
  }

  /* ---------------- Present ---------------- */
  const final = step >= 5
  return (
    <Stage mode={mode} className="sm:!pb-[64px] sm:!pt-[72px]">
      <div className="flex flex-col gap-5">
        <div>{header}</div>
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          {diagram(final ? 'h-[clamp(250px,36vh,400px)]' : 'h-[clamp(300px,50vh,560px)]')}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <p className="t-lead">One product, four parties. Each would hire it for a different job.</p>
                  <SourceNote className="mt-4">Jobs-to-be-Done framework, Week 3 (S2).</SourceNote>
                </motion.div>
              )}
              {step >= 1 && step <= 4 && (
                <motion.div key={sel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <JobPanel s={sel} showRole={false} />
                </motion.div>
              )}
              {final && (
                <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <RoleCards compact />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {final && (
          <>
            <ValueProp show />
            <LearningCard learning={learning} compact />
          </>
        )}
      </div>
    </Stage>
  )
}
