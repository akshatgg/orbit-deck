import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { RoleBadge, StakeholderMap, StakeholderOrbit } from '../components/bmd/StakeholderMap'
import { Card, ChapterHeader, EvidenceTag, Expandable, LearningCard, LearningStrip, Reveal, SourceNote, SplitHeadline, Stage, StageLabel, ease } from '../components/ui'
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
              Jobs-to-be-Done (Week 3, S2) asks what job a person hires a product to do, what they use today, and what outcome they want. We applied it to four parties rather than only the student,
              because the person who uses Orbit, the party that might fund it and the people who can block it are not the same.
            </p>
          </Expandable>
          <Expandable title="Evidence status of each job">
            <p>
              The student job reflects our student research (survey n = 42, interviews n = 13). The university, organiser and IT/data-owner jobs are hypotheses framed from the framework: we are not
              claiming interviews or commitments from those stakeholders.
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
  const vp = pitchConfig.valueProposition
  const vpText = vp.includes('early enough to act') ? vp.replace('early enough to act.', '*early enough to act.*') : vp
  return (
    <Stage mode={mode} className="sm:!justify-start sm:!pb-[56px] sm:!pt-[76px]">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div>{header}</div>
        <div className="flex flex-1 flex-col justify-center gap-3">
          <StakeholderOrbit revealed={revealed} selected={final ? null : revealed ? selected : null} showRoles={showRoles} height={final ? 'clamp(220px,34vh,380px)' : 'clamp(270px,45vh,470px)'} />
          <div className="flex min-h-[104px] flex-col items-center justify-start gap-3 text-center">
            {step === 0 && <SplitHeadline text="One product. Four parties. *Four different jobs.*" className="t-h2 !text-[clamp(1.6rem,3vw,2.6rem)]" />}
            {final && (
              <>
                <Reveal show>
                  <p className="text-[clamp(1.7rem,3.3vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-snow">
                    <SplitHeadline text={vpText} />
                  </p>
                </Reveal>
                <LearningStrip believed="An app for students." learned="User, payer, gatekeeper are different parties." changed="Value: timely discovery for users, visibility for payers." />
              </>
            )}
          </div>
        </div>
      </div>
    </Stage>
  )
}
