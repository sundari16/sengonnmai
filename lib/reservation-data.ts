// Tamil Nadu Reservation System — comprehensive data
// TN has 69% reservation protected under 9th Schedule (Tamil Nadu Backward Classes,
// Scheduled Castes and Scheduled Tribes (Reservation of Seats in Educational Institutions
// and of Appointments or Posts in the Services under the State) Act, 1993)

export type ReservationCategory = {
  id: string
  category_en: string
  category_ta: string
  abbreviation: string
  pct_tn: number         // TN state reservation percentage
  pct_central: number    // Central government quota
  pct_central_services: number  // Central services (may differ)
  population_pct_approx: number // approx % of TN population
  population_count_lakh: number
  qualifying_criteria_en: string
  qualifying_criteria_ta: string
  caste_certificate_authority_en: string
  legal_basis_en: string
  sub_categories?: SubCategory[]
  creamy_layer_excluded: boolean
  creamy_layer_income_lakh?: number
  note_en?: string
}

export type SubCategory = {
  name_en: string
  name_ta: string
  pct: number
  note_en?: string
}

export type ReservationContext = {
  id: string
  context_en: string  // education / employment / local body
  context_ta: string
  applies_to_en: string
  legal_basis_en: string
  supreme_court_case?: string
  note_en?: string
}

export type EWSDetail = {
  income_limit_annual_lakh: number
  asset_criteria_en: string
  certificate_authority_en: string
  valid_for_days: number
  central_only: boolean
  note_en: string
}

export const TN_RESERVATION_CATEGORIES: ReservationCategory[] = [
  {
    id: 'sc',
    category_en: 'Scheduled Castes',
    category_ta: 'தாழ்த்தப்பட்டோர் (SC)',
    abbreviation: 'SC',
    pct_tn: 18,
    pct_central: 15,
    pct_central_services: 15,
    population_pct_approx: 20,
    population_count_lakh: 160,
    qualifying_criteria_en: 'Listed in the Constitution (Scheduled Castes) Order 1950. 294 communities listed for Tamil Nadu. Certificate issued by Revenue/Tahsildar office. Non-transferable and hereditary.',
    qualifying_criteria_ta: 'அரசியலமைப்பு (தாழ்த்தப்பட்டோர்) ஆணை 1950-ல் பட்டியலிடப்பட்ட சமூகங்கள். TN-க்கு 294 சமூகங்கள். சான்றிதழ் வருவாய்/தாசில்தார் அலுவலகம்.',
    caste_certificate_authority_en: 'Revenue Divisional Officer (RDO) or Tahsildar',
    legal_basis_en: 'Article 341 of Constitution; TN Reservation Act 1993 (18% TN vs 15% Central)',
    sub_categories: [
      { name_en: 'Arunthathiyar (internal sub-classification)', name_ta: 'அருந்ததியர்', pct: 3, note_en: '3% internal sub-classification within 18% SC quota per TNBC Act 2009 — challenged in Supreme Court, currently operating' },
    ],
    creamy_layer_excluded: false,
    note_en: 'SC reservations have no creamy layer exclusion per Supreme Court ruling. TN quota is 18% (3% more than central 15%) justified by higher SC population share.',
  },
  {
    id: 'st',
    category_en: 'Scheduled Tribes',
    category_ta: 'பழங்குடியினர் (ST)',
    abbreviation: 'ST',
    pct_tn: 1,
    pct_central: 7.5,
    pct_central_services: 7.5,
    population_pct_approx: 1.1,
    population_count_lakh: 9,
    qualifying_criteria_en: '36 Scheduled Tribe communities in TN — concentrated in Nilgiris, Dharmapuri, Salem, Vellore districts. Certificate from Revenue/Tribal Welfare Officer.',
    qualifying_criteria_ta: 'TN-ல் 36 பழங்குடி சமூகங்கள் — நீலகிரி, தருமபுரி, சேலம், வேலூர் மாவட்டங்களில் அதிகம். சான்றிதழ்: வருவாய்/பழங்குடியினர் நல அதிகாரி.',
    caste_certificate_authority_en: 'Tribal Welfare Officer or Revenue Divisional Officer',
    legal_basis_en: 'Article 342 of Constitution; TN Reservation Act 1993 (1% state, lower than central 7.5% reflecting smaller ST population)',
    creamy_layer_excluded: false,
    note_en: 'TN ST quota is 1% — substantially lower than central 7.5% — because ST population is 1.1% of TN. Unfilled ST seats do not lapse to general category under TN law.',
  },
  {
    id: 'mbc',
    category_en: 'Most Backward Classes & Denotified Communities',
    category_ta: 'மிகவும் பிற்படுத்தப்பட்டோர் & நாடோடி சமூகங்கள் (MBC/DNT)',
    abbreviation: 'MBC/DNT',
    pct_tn: 20,
    pct_central: 0,
    pct_central_services: 0,
    population_pct_approx: 32,
    population_count_lakh: 256,
    qualifying_criteria_en: '200+ communities listed including Vanniyar, Nadars (partly), and historically denotified tribes. Certificate from Revenue/Tahsildar. Creamy layer applies for employment only.',
    qualifying_criteria_ta: 'வன்னியர், நாடார் (ஒரு பகுதி) உட்பட 200+ சமூகங்கள். சான்றிதழ் வருவாய்/தாசில்தார். வேலைவாய்ப்பில் மட்டும் கிரீமி லேயர் பொருந்தும்.',
    caste_certificate_authority_en: 'Revenue Divisional Officer (RDO) or Tahsildar',
    legal_basis_en: 'TN Backward Classes, SC and ST (Reservation) Act 1993; TN list differs from Central OBC list',
    sub_categories: [
      { name_en: 'Denotified Communities (DNT)', name_ta: 'நாடோடி சமூகங்கள்', pct: 3, note_en: '3% internal sub-quota within 20% MBC for historically denotified nomadic tribes' },
    ],
    creamy_layer_excluded: true,
    creamy_layer_income_lakh: 8,
    note_en: 'MBC/DNT is a TN-specific category. Not recognised at central level — central OBC list differs. Vanniyar community (largest MBC) led agitation for 10.5% internal quota, pending Supreme Court verdict as of 2024.',
  },
  {
    id: 'bc',
    category_en: 'Backward Classes',
    category_ta: 'பிற்படுத்தப்பட்டோர் (BC)',
    abbreviation: 'BC',
    pct_tn: 26.5,
    pct_central: 0,
    pct_central_services: 0,
    population_pct_approx: 35,
    population_count_lakh: 280,
    qualifying_criteria_en: '180+ communities listed. Certificate from Revenue/Tahsildar. Creamy layer applies — annual family income above ₹8 lakh excludes from reservation.',
    qualifying_criteria_ta: '180+ சமூகங்கள். சான்றிதழ் வருவாய்/தாசில்தார். ஆண்டு குடும்ப வருமானம் ₹8 லட்சத்திற்கு மேல் இருந்தால் கிரீமி லேயர் விலக்கு.',
    caste_certificate_authority_en: 'Revenue Divisional Officer (RDO) or Tahsildar',
    legal_basis_en: 'TN Backward Classes, SC and ST (Reservation) Act 1993',
    sub_categories: [
      { name_en: 'BC (Hindu)', name_ta: 'BC (இந்து)', pct: 23, note_en: '23% of total reservation' },
      { name_en: 'BC (Christians of SC origin)', name_ta: 'BC (SC மூல கிறிஸ்தவர்)', pct: 3.5, note_en: '3.5% for Christians who converted from SC communities' },
    ],
    creamy_layer_excluded: true,
    creamy_layer_income_lakh: 8,
    note_en: 'TN BC quota includes both Hindu and Christian communities. Muslims from BC background are classified separately under BCM category.',
  },
  {
    id: 'bcm',
    category_en: 'Backward Class Muslims',
    category_ta: 'பிற்படுத்தப்பட்ட வகுப்பு முஸ்லிம்கள் (BCM)',
    abbreviation: 'BCM',
    pct_tn: 3.5,
    pct_central: 0,
    pct_central_services: 0,
    population_pct_approx: 5.5,
    population_count_lakh: 44,
    qualifying_criteria_en: 'Muslim communities listed in TN BC list. Certificate from Revenue/Tahsildar indicating Muslim community membership. Creamy layer applies.',
    qualifying_criteria_ta: 'TN BC பட்டியலில் உள்ள முஸ்லிம் சமூகங்கள். சான்றிதழ் வருவாய்/தாசில்தார் அலுவலகம். கிரீமி லேயர் பொருந்தும்.',
    caste_certificate_authority_en: 'Revenue Divisional Officer (RDO) or Tahsildar',
    legal_basis_en: 'TN Backward Classes, SC and ST (Reservation) Act 1993 (amended to carve out 3.5% BCM from original BC quota)',
    creamy_layer_excluded: true,
    creamy_layer_income_lakh: 8,
    note_en: 'BCM is a TN-specific carve-out. Central government does not have a separate Muslim quota. BCM is drawn from within the overall 30% BC reservation, not additive.',
  },
]

export const EWS_DETAILS: EWSDetail = {
  income_limit_annual_lakh: 8,
  asset_criteria_en: 'Must not own 5+ acres agricultural land, 1,000+ sq ft plot in notified municipality, 100+ yards residential plot in non-notified municipality, or 200+ yards flat in notified municipality',
  certificate_authority_en: 'Revenue Divisional Officer (RDO) or Sub-Divisional Magistrate',
  valid_for_days: 365,
  central_only: true,
  note_en: 'EWS 10% quota applies to central government jobs and central educational institutions only. TN has NOT adopted EWS quota in state jobs/colleges. TN total reservation remains 69% (without EWS). Central posts in TN have both 10% EWS and 69% TN reservations applying to different pools.',
}

export const RESERVATION_CONTEXTS: ReservationContext[] = [
  {
    id: 'tn-total',
    context_en: 'Tamil Nadu Total Reservation',
    context_ta: 'தமிழ்நாடு மொத்த இடஒதுக்கீடு',
    applies_to_en: 'All state government jobs and state educational institutions',
    legal_basis_en: 'TN Reservation Act 1993 protected under 9th Schedule (Article 31-B)',
    supreme_court_case: 'Indra Sawhney v. Union of India (1992) — 50% cap; TN exceeds this but protected by 9th Schedule',
    note_en: '69% total reservation: SC 18% + ST 1% + MBC/DNT 20% + BC 26.5% + BCM 3.5%. Unreserved (Open Competition): 31%. This exceeds the Supreme Court\'s 50% ceiling in Indra Sawhney but is protected by the Constitution\'s 9th Schedule (not subject to judicial review on equality grounds).',
  },
  {
    id: 'central-posts',
    context_en: 'Central Government Posts (applied in TN)',
    context_ta: 'மத்திய அரசு பதவிகள் (TN-ல் பொருந்தும்)',
    applies_to_en: 'Central government services, central PSUs, central universities, IITs, NITs',
    legal_basis_en: 'Articles 15(4), 16(4) of Constitution; Central List of OBCs',
    note_en: 'Central reservation: SC 15% + ST 7.5% + OBC 27% + EWS 10% = 59.5%. TN caste certificates must be verified against central OBC list (different from TN BC/MBC list). Many TN communities on state BC/MBC list may not be on Central OBC list — citizens must verify before applying.',
  },
  {
    id: 'local-body',
    context_en: 'Local Body Elections',
    context_ta: 'உள்ளாட்சி தேர்தல்கள்',
    applies_to_en: 'Corporation, Municipality, Town Panchayat, and Village Panchayat ward elections',
    legal_basis_en: 'TN Panchayats Act 1994; TN Municipalities Act 1920; Articles 243D, 243T',
    note_en: 'Reservation for women: 50% of all seats in local bodies. SC reservation proportional to SC population in each local body area. OBC reservation up to 27% (not to exceed 50% combined with SC/ST). Rotation of reserved seats every election cycle.',
  },
  {
    id: 'education-tn',
    context_en: 'Tamil Nadu State Educational Institutions',
    context_ta: 'தமிழ்நாடு மாநில கல்வி நிறுவனங்கள்',
    applies_to_en: 'Government arts & science colleges, engineering colleges, medical colleges, polytechnics',
    legal_basis_en: 'TN Reservation Act 1993; Tamil Nadu Admission to Professional Courses Rules',
    note_en: 'Horizontal reservations (cut across all categories): Ex-servicemen 5%, Differently Abled 3%, Widow/Deserted women 1% (in Tamil Nadu state institutions only). These are calculated over and above the vertical reservations and reduce general pool, not reserved pools.',
  },
  {
    id: 'sports-ncc',
    context_en: 'Sports / NCC / Ex-Servicemen Horizontal Quota',
    context_ta: 'விளையாட்டு / NCC / முன்னாள் படை வீரர் கிடைமட்ட ஒதுக்கீடு',
    applies_to_en: 'State government education and employment',
    legal_basis_en: 'TN Government Orders; Ministry of Education guidelines',
    note_en: 'Horizontal reservations (apply across all vertical categories): NCC — 0.5% to 1% in some institutions; Sports — 2% in employment; Ex-servicemen — 5% in employment. These operate as "within quota" reservations.',
  },
]

export type CertificateType = {
  id: string
  name_en: string
  name_ta: string
  issued_by_en: string
  documents_required_en: string[]
  processing_days_official: number
  processing_days_actual: number
  fee_rs: number
  validity_en: string
  where_used_en: string[]
  rti_note_en: string
}

export const CERTIFICATE_TYPES: CertificateType[] = [
  {
    id: 'sc-cert',
    name_en: 'Scheduled Caste (SC) Certificate',
    name_ta: 'தாழ்த்தப்பட்டோர் (SC) சான்றிதழ்',
    issued_by_en: 'Revenue Divisional Officer (RDO) / Tahsildar',
    documents_required_en: ['Application form', 'Aadhaar card', 'School TC showing community', 'Father/mother SC certificate (if available)', 'Affidavit', 'Ration card'],
    processing_days_official: 15,
    processing_days_actual: 30,
    fee_rs: 0,
    validity_en: 'Lifetime (permanent)',
    where_used_en: ['State government jobs', 'Central government jobs', 'State college admissions', 'Central college admissions (NEET, JEE)', 'Scholarship applications', 'Welfare scheme benefits'],
    rti_note_en: 'If certificate delayed beyond 15 days, file RTI with Revenue Department PIO asking for processing status and reason for delay.',
  },
  {
    id: 'st-cert',
    name_en: 'Scheduled Tribe (ST) Certificate',
    name_ta: 'பழங்குடியினர் (ST) சான்றிதழ்',
    issued_by_en: 'Tribal Welfare Officer / Revenue Divisional Officer',
    documents_required_en: ['Application form', 'Aadhaar card', 'Community declaration', 'Local tribal certificate from Village/Panchayat', 'School records showing tribe name'],
    processing_days_official: 15,
    processing_days_actual: 45,
    fee_rs: 0,
    validity_en: 'Lifetime (permanent)',
    where_used_en: ['State government jobs', 'Central government jobs', 'Educational admissions', 'Forest Rights Act claims', 'Tribal welfare schemes'],
    rti_note_en: 'ST certificates in TN require verification from Tribal Welfare Department for central government purposes. Additional scrutiny committee may be involved.',
  },
  {
    id: 'bc-cert',
    name_en: 'Backward Class (BC/MBC/BCM) Certificate',
    name_ta: 'பிற்படுத்தப்பட்டோர் (BC/MBC/BCM) சான்றிதழ்',
    issued_by_en: 'Revenue Divisional Officer (RDO) / Tahsildar',
    documents_required_en: ['Application form', 'Aadhaar card', 'Community certificate from Village Administrative Officer', 'Ration card', 'Income certificate (for creamy layer check)'],
    processing_days_official: 15,
    processing_days_actual: 21,
    fee_rs: 0,
    validity_en: 'Lifetime for caste; Income certificate valid 3 years for creamy layer check',
    where_used_en: ['State government jobs (with creamy layer check)', 'State college admissions', 'Scholarships', 'TNPSC exams'],
    rti_note_en: 'For central government purposes, must verify community is also in Central OBC list — TN BC/MBC list differs from Central OBC list.',
  },
  {
    id: 'ews-cert',
    name_en: 'Economically Weaker Section (EWS) Certificate',
    name_ta: 'பொருளாதாரத்தில் நலிவடைந்த பிரிவு (EWS) சான்றிதழ்',
    issued_by_en: 'Revenue Divisional Officer (RDO)',
    documents_required_en: ['Application form', 'Aadhaar', 'Income certificate (below ₹8 lakh/year)', 'Property documents', 'Bank statements', 'Land records if any'],
    processing_days_official: 21,
    processing_days_actual: 30,
    fee_rs: 0,
    validity_en: '1 year (must be renewed annually)',
    where_used_en: ['Central government jobs only', 'Central institution admissions (IIT, NIT, AIIMS, etc.)', 'NOT valid for TN state jobs or state college admissions'],
    rti_note_en: 'TN has not adopted EWS reservation in state services. EWS certificate is valid only for Central government posts and Central institutions.',
  },
  {
    id: 'obc-central-cert',
    name_en: 'OBC Certificate for Central Government (Non-Creamy Layer)',
    name_ta: 'மத்திய அரசு OBC சான்றிதழ் (கிரீமி லேயர் இல்லாதவர்)',
    issued_by_en: 'Revenue Divisional Officer (RDO)',
    documents_required_en: ['Application form', 'Aadhaar', 'Community certificate', 'Income proof (below ₹8 lakh for non-creamy layer)', 'Verification that community is in Central OBC list (not just TN BC list)'],
    processing_days_official: 21,
    processing_days_actual: 30,
    fee_rs: 0,
    validity_en: '3 years for Non-Creamy Layer certificate',
    where_used_en: ['UPSC exams', 'Central government jobs', 'IITs, NITs, central universities', 'PM scholarships'],
    rti_note_en: 'Critical distinction: TN BC/MBC certificate ≠ OBC certificate for central purposes. Check NCBC list at ncbc.nic.in before applying. Many TN communities are not on Central OBC list.',
  },
]

export const RESERVATION_FAQS = [
  {
    q_en: 'Does TN\'s 69% reservation violate the Supreme Court\'s 50% cap?',
    q_ta: 'TN-ன் 69% இடஒதுக்கீடு உச்சநீதிமன்றின் 50% வரம்பை மீறுகிறதா?',
    a_en: 'Yes, it exceeds the ceiling set in Indra Sawhney (1992), but it is protected under the 9th Schedule of the Constitution (Article 31-B), which shields it from challenge on fundamental rights grounds. The 9th Schedule laws cannot be struck down for violating Part III rights unless they damage the basic structure of the Constitution.',
    a_ta: 'ஆம், இந்திரா சாவ்னி (1992) வழக்கில் நிர்ணயிக்கப்பட்ட 50% வரம்பை மீறுகிறது. ஆனால் அரசியலமைப்பின் 9-ம் அட்டவணை (அனுச்சேதம் 31-B) மூலம் பாதுகாக்கப்படுகிறது.',
  },
  {
    q_en: 'Can a family lose reservation status if income rises?',
    q_ta: 'வருமானம் உயர்ந்தால் இடஒதுக்கீடு இழக்கப்படுமா?',
    a_en: 'For SC/ST: No — there is no creamy layer for SC/ST. For BC/MBC/BCM: Yes — if annual family income exceeds ₹8 lakh, they fall in the "creamy layer" and cannot use reservation in employment (but can still use it in education in some contexts). EWS: Annual renewal required.',
    a_ta: 'SC/ST-க்கு: இல்லை — SC/ST-க்கு கிரீமி லேயர் இல்லை. BC/MBC/BCM-க்கு: ஆம் — குடும்ப வருமானம் ₹8 லட்சத்திற்கு மேல் இருந்தால் வேலைவாய்ப்பில் இடஒதுக்கீடு கிடைக்காது.',
  },
  {
    q_en: 'Is the TN BC certificate valid for central government OBC quota?',
    q_ta: 'TN BC சான்றிதழ் மத்திய அரசு OBC ஒதுக்கீட்டிற்கு செல்லுபடியாகுமா?',
    a_en: 'Not automatically. TN BC/MBC list and Central OBC list are different. A community must appear in the Central OBC list (maintained by NCBC) to use OBC quota in central services. Check ncbc.nic.in. If your community is listed, get a separate "OBC for central purposes" certificate from the RDO.',
    a_ta: 'தானாக இல்லை. TN BC/MBC பட்டியலும் மத்திய OBC பட்டியலும் வேறுபட்டவை. மத்திய சேவைகளில் OBC ஒதுக்கீட்டை பயன்படுத்த, சமூகம் NCBC பட்டியலில் இருக்க வேண்டும். ncbc.nic.in-ல் சரிபார்க்கவும்.',
  },
  {
    q_en: 'Does EWS (10%) reservation apply in Tamil Nadu state jobs?',
    q_ta: 'EWS (10%) இடஒதுக்கீடு TN மாநில வேலைகளில் பொருந்துமா?',
    a_en: 'No. Tamil Nadu has not adopted the EWS 10% reservation for state government jobs or state educational institutions. EWS quota applies only to central government services and centrally-funded institutions like IITs, NITs, and AIIMS.',
    a_ta: 'இல்லை. தமிழ்நாடு மாநில அரசு வேலைகள் மற்றும் மாநில கல்வி நிறுவனங்களில் EWS 10% இடஒதுக்கீட்டை TN ஏற்கவில்லை.',
  },
  {
    q_en: 'What is the Vanniyar internal quota case?',
    q_ta: 'வன்னியர் உள் ஒதுக்கீடு வழக்கு என்ன?',
    a_en: 'The TN government enacted a law in 2021 providing 10.5% internal quota for Vanniyar community within the 20% MBC quota. The Supreme Court stayed this law in 2021, ruling that data on backwardness must support sub-classification. The case is pending as of 2024.',
    a_ta: '2021-ல் TN அரசு 20% MBC ஒதுக்கீட்டிற்குள் வன்னியர் சமூகத்திற்கு 10.5% உள் ஒதுக்கீட்டை வழங்கும் சட்டம் இயற்றியது. உச்சநீதிமன்றம் 2021-ல் இதை நிறுத்தி வைத்தது. 2024 நிலவரப்படி வழக்கு நிலுவையில் உள்ளது.',
  },
]

export function getCategoryById(id: string): ReservationCategory | undefined {
  return TN_RESERVATION_CATEGORIES.find(c => c.id === id)
}

export function getTotalTNReservationPct(): number {
  return TN_RESERVATION_CATEGORIES.reduce((sum, c) => sum + c.pct_tn, 0)
}

export function getUnreservedPct(): number {
  return 100 - getTotalTNReservationPct()
}
