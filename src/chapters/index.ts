import type { ComponentType } from 'react'
import type { ChapterProps } from '../shell/types'
import Ch00Question from './Ch00Question'
import Ch01Origin from './Ch01Origin'
import Ch02Screening from './Ch02Screening'
import Ch03WhatStudentsToldUs from './Ch03WhatStudentsToldUs'
import Ch04ProductDecisions from './Ch04ProductDecisions'
import Ch06Jtbd from './Ch06Jtbd'
import Ch07Product from './Ch07Product'
import Ch08WhoPays from './Ch08WhoPays'
import Ch09LeanCanvas from './Ch09LeanCanvas'
import Ch10Viability from './Ch10Viability'
import Ch11MarketEngagement from './Ch11MarketEngagement'
import Ch12Walkthroughs from './Ch12Walkthroughs'
import Ch13Experiment from './Ch13Experiment'
import Ch13Gates from './Ch13Gates'
import Ch14Scale from './Ch14Scale'
import Ch15Verdict from './Ch15Verdict'

/** Keyed by chapter slug (data/chapters.ts). File names are historical; order comes from chapters.ts. */
export const chapterComponents: Record<string, ComponentType<ChapterProps>> = {
  'question': Ch00Question,
  'origin': Ch01Origin,
  'screening': Ch02Screening,
  'what-students-told-us': Ch03WhatStudentsToldUs,
  'product-decisions': Ch04ProductDecisions,
  'jtbd': Ch06Jtbd,
  'product': Ch07Product,
  'who-pays': Ch08WhoPays,
  'lean-canvas': Ch09LeanCanvas,
  'viability': Ch10Viability,
  'market-engagement': Ch11MarketEngagement,
  'walkthroughs': Ch12Walkthroughs,
  'experiment': Ch13Experiment,
  'gates': Ch13Gates,
  'scale': Ch14Scale,
  'verdict': Ch15Verdict,
}
