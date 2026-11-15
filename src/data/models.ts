/**
 * Revenue models compared in Chapter 08. Qualitative only: no purchasing evidence exists for any path,
 * and no scores or market figures are invented here. Prices come from market.ts (PROPOSED).
 */
export type ModelId = 'A' | 'B' | 'C'

export interface RevenueModel {
  id: ModelId
  name: string
  mechanism: string
  value?: string[]
  uncertainty: string
  /** comparison table */
  payer: string
  source: string
  evidence: string
  costs: string
  unknown: string
  next: string
  /** step-3 verdict */
  verdict: string
}

export const revenueModels: RevenueModel[] = [
  {
    id: 'A',
    name: 'University-funded B2B SaaS',
    mechanism: 'Students use Orbit free. Universities pay an annual subscription for a complementary discovery service.',
    value: ['More visibility of existing opportunities', 'Potential participation improvement', 'Complementary integration with existing systems'],
    uncertainty: 'Will an institution pay an additional subscription and renew at a viable price?',
    payer: 'The university, through an annual institutional subscription.',
    source: 'Visibility of existing opportunities, potential participation gains, complementary to current systems.',
    evidence: 'None yet. No institution has committed to a purchase; the price points are proposed.',
    costs: 'Integration with university systems, security and data-protection review, onboarding and support, a long procurement cycle.',
    unknown: 'Will an institution pay for an additional subscription, and renew it at a viable price?',
    next: 'One paid, measurable university pilot with success measures agreed in advance.',
    verdict: 'Working hypothesis',
  },
  {
    id: 'B',
    name: 'Organiser-funded external-event referrals',
    mechanism: 'Users discover public events free. Organisers or event platforms could pay commission on attributable paid registrations.',
    uncertainty: 'Can sufficient paid-event volume, attribution and commission margin support the service?',
    payer: 'Organisers or event platforms, as commission on attributable paid registrations.',
    source: 'Attributable referrals that end in a paid registration on the organiser’s page.',
    evidence: 'None yet. No organiser or platform has agreed to pay a commission.',
    costs: 'Referral attribution, organiser and platform relationships, external-event coverage and data quality.',
    unknown: 'Is there enough paid-event volume, reliable attribution and commission margin?',
    next: 'Separate test of paid-event volume, attribution feasibility and commission terms.',
    verdict: 'Future opportunity requiring its own validation',
  },
  {
    id: 'C',
    name: 'Student-paid subscription',
    mechanism: 'Students pay directly for event discovery or premium features.',
    uncertainty: 'Will students pay for access to opportunities that are often free to discover elsewhere?',
    payer: 'The student, as a direct subscription or premium features.',
    source: 'Less search effort and earlier awareness for the individual student.',
    evidence: 'None yet. Student willingness to pay is not evidenced.',
    costs: 'Consumer acquisition and retention, payment handling, premium-feature development.',
    unknown: 'Will students pay for opportunities that are often free to discover elsewhere?',
    next: 'Not prioritised. Would need its own willingness-to-pay test.',
    verdict: 'Lower priority',
  },
]
