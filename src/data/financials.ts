/**
 * Financial model — SOURCE OF TRUTH is the team's financial model V3 (MODELLED evidence).
 * Label every figure: "Modelled base-case forecasts — not achieved performance."
 * The figures below are the workbook's projected values as supplied to the site.
 * All 2027–2031 values are PROJECTIONS, not operating results.
 *
 * `totalCosts` is DERIVED here as revenue − EBITDA (i.e. COGS + operating
 * expenses combined). The workbook's separate COGS / OpEx split has not been
 * imported yet — see `costSplit` below.
 */
export interface FinYear {
  year: number
  revenue: number
  ebitda: number
  netProfit: number
  institutions: number
}

export const finYears: FinYear[] = [
  { year: 2027, revenue: 22_500, ebitda: -36_724, netProfit: -37_474, institutions: 3 },
  { year: 2028, revenue: 97_110, ebitda: -11_666, netProfit: -12_184, institutions: 8 },
  { year: 2029, revenue: 241_600, ebitda: 37_492, netProfit: 27_918, institutions: 18 },
  { year: 2030, revenue: 445_325, ebitda: 197_720, netProfit: 148_290, institutions: 31 },
  { year: 2031, revenue: 658_345, ebitda: 327_383, netProfit: 245_538, institutions: 45 },
]

export const withDerived = finYears.map((y, i) => {
  const totalCosts = y.revenue - y.ebitda
  const cumulativeNet = finYears.slice(0, i + 1).reduce((s, r) => s + r.netProfit, 0)
  return {
    ...y,
    totalCosts,
    ebitdaMargin: y.ebitda / y.revenue,
    revenuePerInstitution: y.revenue / y.institutions,
    cumulativeNet,
  }
})

/**
 * Workbook COGS / operating-expense split per year.
 * null = not yet imported from the workbook. Fill in to enable the split chart.
 */
export const modelLabel = 'Modelled base-case forecasts — not achieved performance.'

/** Known workbook issue — acknowledge in the Evidence Room, not the main presentation. */
export const workbookIssues = ['Some annex cross-references in the financial workbook point to incorrect cells/sheets and require correction; headline figures above are taken from the model outputs.']

export const costSplit: Record<number, { cogs: number; opex: number } | null> = {
  2027: null,
  2028: null,
  2029: null,
  2030: null,
  2031: null,
}

export const milestones = {
  firstProfitableYear: 2029,
  arrTarget: 230_000,
  arrTargetYear: 2029,
  operatingBudget2029: 204_108,
  cashRecoveryYear: 2030,
  minCashYear: 2028,
  minCash: 3_919,
  equity: 50_000,
  debt: 10_000,
}

export const commentary: Record<number, string> = {
  2027: 'Launch year. Three modelled paying institutions with first-year discounts; founders build product and run the first pilots. Loss-making by design.',
  2028: 'Eight modelled institutions. Losses narrow, but year-end cash falls to roughly £3,919 — the tightest point in the plan.',
  2029: 'Eighteen modelled institutions. EBITDA turns positive — the first modelled profitable year, and the year of the £230k ARR target.',
  2030: 'Thirty-one modelled institutions. Cumulative net profit turns positive — modelled recovery of project cash.',
  2031: 'Forty-five modelled institutions. Outcome depends on retention and acquisition assumptions holding.',
}

export const assumptions = [
  { group: 'Institutional pricing tiers', items: ['Standard (5,000–14,999 students): £10,000 / yr', 'Large (15,000–29,999): £15,000 / yr', 'Very large (30,000+): £20,000 / yr'] },
  { group: 'First-year discounts', items: ['New institutions receive an introductory discount in their first contract year (see workbook for rate).', 'Explains why 2027 revenue per institution (£7,500) is below the lowest list price.'] },
  { group: 'Customer acquisition', items: ['Funnel 2027–29: 105 contacts → 54 qualified meetings → 31 paid-pilot opportunities → 25 conversions → 18 net additions.', 'Modelled paying institutions: 3, 8, 18, 31, 45 (2027–31).'] },
  { group: 'Retention', items: ['Churn is applied in the workbook (25 conversions → 18 net customers by 2029).', 'Renewal behaviour is unvalidated — see the Assumption Tracker (A6).'] },
  { group: 'Founder salaries', items: ['One technical founder and one business founder (proposed operating model). Salary levels per workbook.'] },
  { group: 'Developer costs', items: ['Additional development support added as institutions grow (per workbook).'] },
  { group: 'Hosting & administration', items: ['Cloud hosting, tooling, legal and admin (per workbook).'] },
  { group: 'Operating contingency', items: ['Contingency allowance included in the operating budget (per workbook).'] },
  { group: 'Equity & debt', items: ['£50,000 equity and £10,000 debt as initial financing.'] },
]

/**
 * Minimum-success reasoning (master prompt §17). An approximate recurring-revenue
 * planning target — NOT the exact accounting break-even point.
 */
export const minimumSuccess = {
  opex2029: 204_108,
  coverageAllowance: 0.15,
  thresholdLow: 230_000,
  thresholdHigh: 235_000,
}

/**
 * One-variable sensitivities on 2029 EBITDA (simplified; NOT a rebuilt cash-flow model).
 *   revenue reduction r:     EBITDA' = 37,492 − 241,600 × r      (costs held constant)
 *   extra integration cost c: EBITDA' = 37,492 − c
 *   customers below target k: EBITDA' = 37,492 − k × (241,600 / 18)  (avg revenue per customer, costs held)
 * e.g. r = 10% → £13,332 · r = 20% → −£10,828
 */
export const base2029 = { revenue: 241_600, ebitda: 37_492, customers: 18 }
export const sensitivity = {
  revenueReduction: (r: number) => base2029.ebitda - base2029.revenue * r,
  integrationCost: (c: number) => base2029.ebitda - c,
  customersBelow: (k: number) => base2029.ebitda - k * (base2029.revenue / base2029.customers),
}

export const gbp = (v: number, opts: { compact?: boolean; sign?: boolean } = {}) => {
  const abs = Math.abs(v)
  const s = opts.compact
    ? abs >= 1_000_000
      ? `£${(abs / 1_000_000).toFixed(2)}m`
      : abs >= 1_000
        ? `£${(abs / 1_000).toFixed(abs >= 100_000 ? 0 : 1)}k`
        : `£${Math.round(abs)}`
    : `£${Math.round(abs).toLocaleString('en-GB')}`
  if (v < 0) return `−${s}`
  return opts.sign && v > 0 ? `+${s}` : s
}
