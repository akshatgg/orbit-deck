import type { ComponentType } from 'react'
import type { ChapterProps } from '../shell/types'
import Ch00Question from './Ch00Question'
import Ch01Origin from './Ch01Origin'
import Ch02Screening from './Ch02Screening'
import Ch03LearningBeforeBuilding from './Ch03LearningBeforeBuilding'
import Ch04WhatStudentsToldUs from './Ch04WhatStudentsToldUs'
import Ch05AssumptionsChanged from './Ch05AssumptionsChanged'
import Ch06Jtbd from './Ch06Jtbd'
import Ch07Product from './Ch07Product'
import Ch08WhoPays from './Ch08WhoPays'
import Ch09LeanCanvas from './Ch09LeanCanvas'
import Ch10Viability from './Ch10Viability'
import Ch11MarketEngagement from './Ch11MarketEngagement'
import Ch12Coaching from './Ch12Coaching'
import Ch13Experiment from './Ch13Experiment'
import Ch14Scale from './Ch14Scale'
import Ch15Verdict from './Ch15Verdict'

export const chapterComponents: Record<string, ComponentType<ChapterProps>> = {
  'question': Ch00Question,
  'origin': Ch01Origin,
  'screening': Ch02Screening,
  'learning-before-building': Ch03LearningBeforeBuilding,
  'what-students-told-us': Ch04WhatStudentsToldUs,
  'assumptions-changed': Ch05AssumptionsChanged,
  'jtbd': Ch06Jtbd,
  'product': Ch07Product,
  'who-pays': Ch08WhoPays,
  'lean-canvas': Ch09LeanCanvas,
  'viability': Ch10Viability,
  'market-engagement': Ch11MarketEngagement,
  'coaching': Ch12Coaching,
  'experiment': Ch13Experiment,
  'scale': Ch14Scale,
  'verdict': Ch15Verdict,
}
