import { Entitlement } from '@/types'
import { HEALTH_ENTITLEMENTS } from './health-data'

const EDUCATION_ENTITLEMENTS: Entitlement[] = [
  {
    id: 'free-education',
    dept_id: 'education',
    title_en: 'Free and compulsory education (Class 1–8)',
    title_ta: 'இலவச கட்டாயக் கல்வி (1–8 வகுப்பு)',
    what_you_get_en: 'Every child aged 6–14 has a legal right to free education in a government school within 1 km. Includes free textbooks, uniform, and mid-day meal.',
    what_you_get_ta: '6–14 வயது குழந்தைகளுக்கு 1 கி.மீ. தொலைவில் இலவச கல்வி உரிமை. இலவச புத்தகங்கள், சீருடை, மதிய உணவு.',
    timeline_days: 0,
    legal_basis: 'Right to Education Act 2009 (RTE) — Section 3',
    how_to_claim_en: 'Enroll at nearest government school. No fees, no documents required to begin. School cannot refuse admission.',
    escalation_en: 'If refused: Contact Block Education Officer → District Elementary Education Officer → Director of Elementary Education.',
  },
  {
    id: 'puthumai-penn-right',
    dept_id: 'education',
    title_en: '₹1,000/month for girl students (Class 6–12)',
    title_ta: 'மாணவிகளுக்கு மாதம் ₹1,000 (6–12 வகுப்பு)',
    what_you_get_en: 'Every girl enrolled in a government or government-aided school from Class 6 to 12 is entitled to ₹1,000 per month directly to their bank account.',
    what_you_get_ta: 'அரசு / உதவி பெறும் பள்ளியில் 6–12 வகுப்பு படிக்கும் அனைத்து மாணவிகளுக்கும் மாதம் ₹1,000 நேரடியாக வங்கி கணக்கில்.',
    timeline_days: 30,
    legal_basis: 'Puthumai Penn Scheme — TN GO Ms.No.54, 2022',
    how_to_claim_en: 'Apply through school principal with bank account details (zero-balance account can be opened at school). No income restriction.',
    escalation_en: 'If payment delayed: Contact school HM → Block Education Officer → District Collector.',
  },
]

const WELFARE_ENTITLEMENTS: Entitlement[] = [
  {
    id: 'magalir-urimai-right',
    dept_id: 'welfare',
    title_en: '₹1,000/month for women heads of household',
    title_ta: 'குடும்பத் தலைவி பெண்களுக்கு மாதம் ₹1,000',
    what_you_get_en: 'Every woman who is head of household, aged 21 and above, not a government employee, and not an income tax payer, is entitled to ₹1,000 per month.',
    what_you_get_ta: '21 வயதுக்கு மேல் உள்ள குடும்பத் தலைவி பெண்கள் (அரசு ஊழியர் அல்லாதவர்) மாதம் ₹1,000 பெற தகுதியானவர்.',
    timeline_days: 45,
    legal_basis: 'Kalaignar Magalir Urimai Thittam — TN GO Ms.No.1, 2023',
    how_to_claim_en: 'Apply at nearest ration shop or e-Sevai centre with Aadhaar and bank passbook. Application is free.',
    escalation_en: 'If rejected incorrectly: Contact District Social Welfare Officer → Commissioner, Social Welfare Dept.',
  },
  {
    id: 'widow-pension-right',
    dept_id: 'welfare',
    title_en: 'Widow pension — ₹1,000/month',
    title_ta: 'விதவை ஓய்வூதியம் — மாதம் ₹1,000',
    what_you_get_en: 'Widows below poverty line who have no income source are entitled to ₹1,000 per month pension under the Indira Gandhi National Widow Pension Scheme.',
    what_you_get_ta: 'வறுமைக் கோட்டிற்கு கீழ் உள்ள விதவைகளுக்கு மாதம் ₹1,000 ஓய்வூதியம்.',
    timeline_days: 60,
    legal_basis: 'Indira Gandhi National Widow Pension Scheme — IGNOAPS 2007',
    how_to_claim_en: 'Apply at the Block Development Office with death certificate of husband, BPL ration card, and Aadhaar.',
    escalation_en: 'If delayed: Contact Block Development Officer → District Social Welfare Officer → State Helpline 14567.',
  },
]

const REVENUE_ENTITLEMENTS: Entitlement[] = [
  {
    id: 'patta-right',
    dept_id: 'revenue',
    title_en: 'Patta certificate within 30 days',
    title_ta: '30 நாட்களில் பட்டா சான்றிதழ்',
    what_you_get_en: 'After purchasing land or completing inheritance, you are entitled to a patta (title deed) transferred in your name within 30 working days of application.',
    what_you_get_ta: 'நில கொள்முதல் அல்லது வாரிசு பரிமாற்றத்திற்கு பிறகு 30 வேலை நாட்களில் உங்கள் பெயரில் பட்டா மாற்றம் பெற உரிமை உள்ளது.',
    timeline_days: 30,
    legal_basis: 'Tamil Nadu Land Reforms Act — TN Revenue Standing Orders',
    how_to_claim_en: 'Apply online at tnreginet.gov.in or at Taluk Office with sale deed, Aadhaar, and previous patta copy.',
    escalation_en: 'If delayed beyond 30 days: File complaint at Revenue Divisional Officer → District Collector → Tamil Nadu Ombudsman.',
  },
]

const TRANSPORT_ENTITLEMENTS: Entitlement[] = [
  {
    id: 'free-bus-right',
    dept_id: 'transport',
    title_en: 'Free bus travel for all women',
    title_ta: 'அனைத்து பெண்களுக்கும் இலவச பேருந்து பயணம்',
    what_you_get_en: 'Every woman in Tamil Nadu, regardless of age or income, is entitled to travel free on all TNSTC, MTC, and SETC government buses. No card or pass required.',
    what_you_get_ta: 'தமிழ்நாட்டில் உள்ள அனைத்து பெண்களும் (வயது, வருமானம் எதுவும் தேவையில்லை) அரசு பேருந்துகளில் இலவசமாக பயணிக்கலாம்.',
    timeline_days: 0,
    legal_basis: 'TN Government Order — Free Bus Pass for Women 2021',
    how_to_claim_en: 'Board any government bus. Show any photo ID if conductor asks. No pass or prior registration needed.',
    escalation_en: 'If denied boarding: Note bus number and route, complain to TNSTC helpline 044-24431948 or MTC 1800 425 3388.',
  },
]

const ENERGY_ENTITLEMENTS: Entitlement[] = [
  {
    id: 'free-100-units-right',
    dept_id: 'energy',
    title_en: 'Free 100 units electricity per month',
    title_ta: 'மாதம் 100 இலவச மின் யூனிட்',
    what_you_get_en: 'Every domestic electricity consumer using up to 100 units per month pays ₹0 for those units. The subsidy is applied automatically to the monthly bill — no application required.',
    what_you_get_ta: 'மாதம் 100 யூனிட் வரை பயன்படுத்தும் வீட்டு நுகர்வோருக்கு அந்த யூனிட்களுக்கு ₹0 கட்டணம். தானாகவே பில்லில் கழிக்கப்படும்.',
    timeline_days: 0,
    legal_basis: 'TANGEDCO Consumer Tariff Order — Free Units Scheme 2021',
    how_to_claim_en: 'No action needed. Subsidy automatically appears on monthly electricity bill for eligible domestic connections.',
    escalation_en: 'If not applied: Call TANGEDCO helpline 1912 or visit nearest TANGEDCO sub-division office with bill copy.',
  },
]

export const ALL_ENTITLEMENTS: Entitlement[] = [
  ...HEALTH_ENTITLEMENTS,
  ...EDUCATION_ENTITLEMENTS,
  ...WELFARE_ENTITLEMENTS,
  ...REVENUE_ENTITLEMENTS,
  ...TRANSPORT_ENTITLEMENTS,
  ...ENERGY_ENTITLEMENTS,
]

export function getEntitlementsByDept(deptId: string): Entitlement[] {
  return ALL_ENTITLEMENTS.filter(e => e.dept_id === deptId)
}
