import type { ComponentType } from 'react'
import type { ChapterProps } from '../shell/types'
import Ch00Opening from './Ch00Opening'
import Ch01Student from './Ch01Student'
import Ch02Reframe from './Ch02Reframe'
import Ch03Research from './Ch03Research'
import Ch04Reveal from './Ch04Reveal'
import Ch05Product from './Ch05Product'
import Ch06ValueProp from './Ch06ValueProp'
import Ch07BusinessModel from './Ch07BusinessModel'
import Ch08Market from './Ch08Market'
import Ch09GTM from './Ch09GTM'
import Ch10Financials from './Ch10Financials'
import Ch11Risks from './Ch11Risks'
import Ch12Pilot from './Ch12Pilot'
import Ch13Vision from './Ch13Vision'
import Ch14Team from './Ch14Team'
import Ch15Closing from './Ch15Closing'

export const chapterComponents: Record<string, ComponentType<ChapterProps>> = {
  'opening': Ch00Opening,
  'student': Ch01Student,
  'reframe': Ch02Reframe,
  'research': Ch03Research,
  'reveal': Ch04Reveal,
  'product': Ch05Product,
  'value-prop': Ch06ValueProp,
  'business-model': Ch07BusinessModel,
  'market': Ch08Market,
  'gtm': Ch09GTM,
  'financials': Ch10Financials,
  'risks': Ch11Risks,
  'pilot': Ch12Pilot,
  'vision': Ch13Vision,
  'team': Ch14Team,
  'closing': Ch15Closing,
}
