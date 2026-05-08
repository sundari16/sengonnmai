export type CitizenService = {
  persona_en: string
  outcome_en: string
  persona_ta: string
  outcome_ta: string
}

export type Scheme = {
  name_en: string
  name_ta: string
  status: 'active' | 'renamed' | 'shelved' | 'new'
  funding: '100% Central' | '60:40' | '75:25' | '90:10' | '100% State'
  eligible_en: string
  eligible_ta: string
  source_org: string
  source_doc: string
  source_url: string
}

export type AccessProcess = {
  name_en: string
  name_ta: string
  steps: string[]
  official_days: number
  realworld_note: string
  stalls_at: string
  documents: string[]
  portal_url?: string
  escalate_to: string
}

export type OutcomeMetric = {
  metric_en: string
  metric_ta: string
  target: string
  actual: string
  direction: 'good' | 'bad' | 'neutral'
  source_org: string
  source_doc: string
  source_year: string
  source_url: string
}

export type Right = {
  title_en: string
  title_ta: string
  description_en: string
  law: string
  timeline: string
  escalate: string
}

export type AccountabilityFlag = {
  id: string
  severity: 'red' | 'amber' | 'green'
  title_en: string
  body_en: string
  source_org: string
  source_doc: string
  source_year: string
  source_url: string
}

export type DeptDetail = {
  id: string
  name_en: string
  name_ta: string
  founded_year: number
  original_purpose_en: string
  problem_solved_en: string
  problem_solved_ta: string
  citizens_served_en: string
  citizens_served_ta: string
  services_count: number
  schemes_count: number
  citizen_services: CitizenService[]
  central_schemes: Scheme[]
  state_schemes: Scheme[]
  access_processes: AccessProcess[]
  budget_cr: number
  central_pct: number
  state_pct: number
  revenue_cr: number
  per_citizen_spend_en: string
  budget_trend_cr: number[]
  budget_trend_years: string[]
  staff_sanctioned: number
  staff_filled: number
  secretary_name: string
  secretary_tenure: string
  frontline_description_en: string
  vacancy_note_en: string
  staff_source: string
  outcome_metrics: OutcomeMetric[]
  rights: Right[]
  flags: AccountabilityFlag[]
}

const HEALTH: DeptDetail = {
  id: 'health',
  name_en: 'Health & Family Welfare',
  name_ta: 'சுகாதாரம் & குடும்ப நலன்',
  founded_year: 1919,
  original_purpose_en: 'Established to control epidemic diseases following the 1918 influenza pandemic that killed an estimated 1.2 crore Indians.',
  problem_solved_en:
    'When you or your family falls sick and cannot afford private care, this department runs 2,780 hospitals and 1,776 primary health centres to treat you for free. It also provides free medicines, free maternity care, and health insurance covering up to ₹5 lakh per year for eligible families.',
  problem_solved_ta:
    'நீங்கள் அல்லது உங்கள் குடும்பத்தினர் நோய்வாய்ப்படும்போது, இந்தத் துறை 2,780 மருத்துவமனைகள் மற்றும் 1,776 PHC-களில் இலவச சிகிச்சை வழங்குகிறது. இலவச மருந்துகள், பிரசவ பராமரிப்பு மற்றும் ஆண்டுக்கு ₹5 லட்சம் வரை சுகாதார காப்பீடு வழங்கப்படுகிறது.',
  citizens_served_en: '1.75 crore families covered by CMCHIS',
  citizens_served_ta: 'CMCHIS கீழ் 1.75 கோடி குடும்பங்கள்',
  services_count: 18,
  schemes_count: 23,

  citizen_services: [
    {
      persona_en: 'If you are sick and cannot afford private care',
      outcome_en: 'Free OPD and inpatient treatment at any of 2,780 government hospitals — including surgeries, specialist consultations, and diagnostics',
      persona_ta: 'நீங்கள் நோய்வாய்ப்பட்டு தனியார் சிகிச்சை வாங்க இயலாவிட்டால்',
      outcome_ta: '2,780 அரசு மருத்துவமனைகளில் இலவச OPD மற்றும் அறுவை சிகிச்சை',
    },
    {
      persona_en: 'If you are pregnant',
      outcome_en: 'Free delivery at any government hospital + ₹1,000 cash under Janani Suraksha Yojana + free 108 ambulance + free antenatal check-ups',
      persona_ta: 'நீங்கள் கர்ப்பிணியாக இருந்தால்',
      outcome_ta: 'இலவச பிரசவம் + ₹1,000 JSY பணம் + இலவச 108 ஆம்புலன்ஸ்',
    },
    {
      persona_en: 'If your family income is below ₹72,000 per year',
      outcome_en: 'CMCHIS health insurance — cashless treatment up to ₹5 lakh/year for 1,027 procedures at government and empanelled private hospitals',
      persona_ta: 'குடும்ப வருடாந்திர வருமானம் ₹72,000-க்கு கீழ் இருந்தால்',
      outcome_ta: 'CMCHIS — 1,027 சிகிச்சைகளுக்கு ஆண்டுக்கு ₹5 லட்சம் வரை பணமில்லா சிகிச்சை',
    },
    {
      persona_en: 'If you need essential medicines',
      outcome_en: 'Free essential medicines (348 drugs on the TNMSC list) dispensed at all PHC and government hospital pharmacies — no prescription fee, no medicine charge',
      persona_ta: 'உங்களுக்கு மருந்துகள் தேவைப்பட்டால்',
      outcome_ta: 'அனைத்து PHC-களிலும் 348 மருந்துகள் இலவசமாக',
    },
    {
      persona_en: 'If you have diabetes, hypertension, or a chronic disease',
      outcome_en: 'Free medicines and regular monitoring under the National Programme for Non-Communicable Diseases at all PHCs — no insurance card required',
      persona_ta: 'நீரிழிவு, உயர் இரத்த அழுத்தம் அல்லது நாட்பட்ட நோய் இருந்தால்',
      outcome_ta: 'NCD திட்டத்தில் அனைத்து PHC-களிலும் இலவச மருந்துகள் மற்றும் கண்காணிப்பு',
    },
    {
      persona_en: 'If you have a child under 5',
      outcome_en: 'Free immunisation for 12 diseases under the Universal Immunisation Programme + free nutrition counselling at the nearest PHC or subcentre',
      persona_ta: '5 வயதுக்குட்பட்ட குழந்தை இருந்தால்',
      outcome_ta: '12 நோய்களுக்கு இலவச தடுப்பூசி மற்றும் ஊட்டச்சத்து ஆலோசனை',
    },
    {
      persona_en: 'If you need emergency care anywhere in Tamil Nadu',
      outcome_en: 'Call 108 — free 24/7 ambulance with paramedic and basic life support. No payment, no ID required at point of emergency.',
      persona_ta: 'அவசர மருத்துவ உதவி தேவையானால்',
      outcome_ta: '108 — இலவச 24/7 ஆம்புலன்ஸ், பணம் அல்லது அடையாள அட்டை தேவையில்லை',
    },
  ],

  central_schemes: [
    {
      name_en: 'National Health Mission (NHM)',
      name_ta: 'தேசிய சுகாதார இயக்கம்',
      status: 'active',
      funding: '60:40',
      eligible_en: 'All citizens — strengthens rural primary health infrastructure',
      eligible_ta: 'அனைத்து குடிமக்களும் — கிராமப்புற PHC வலுப்படுத்தல்',
      source_org: 'MoHFW / NHM',
      source_doc: 'NHM Annual Report 2023-24',
      source_url: 'https://nhm.gov.in',
    },
    {
      name_en: 'Ayushman Bharat PM-JAY',
      name_ta: 'ஆயுஷ்மான் பாரத் PM-JAY',
      status: 'active',
      funding: '60:40',
      eligible_en: 'Bottom 40% households by income — merged operationally with CMCHIS in TN',
      eligible_ta: 'கீழ் 40% வருமான குடும்பங்கள் — TN-ல் CMCHIS-உடன் இணைக்கப்பட்டது',
      source_org: 'National Health Authority',
      source_doc: 'PM-JAY State Report TN 2024',
      source_url: 'https://pmjay.gov.in',
    },
    {
      name_en: 'Janani Suraksha Yojana (JSY)',
      name_ta: 'ஜனனி சுரட்சா யோஜனா',
      status: 'active',
      funding: '100% Central',
      eligible_en: 'All pregnant women — ₹1,000 cash incentive for institutional delivery in TN',
      eligible_ta: 'அனைத்து கர்ப்பிணி பெண்கள் — அரசு மருத்துவமனை பிரசவத்திற்கு ₹1,000',
      source_org: 'MoHFW / NHM',
      source_doc: 'JSY Programme Report 2023-24',
      source_url: 'https://nhm.gov.in',
    },
    {
      name_en: 'PM Surakshit Matritva Abhiyan (PMSMA)',
      name_ta: 'PM சுரட்சித் மாத்ருத்வ அபியான்',
      status: 'active',
      funding: '100% Central',
      eligible_en: 'All pregnant women — free specialist antenatal check on the 9th of every month',
      eligible_ta: 'அனைத்து கர்ப்பிணி பெண்கள் — மாதம் 9-ம் தேதி இலவச நிபுணர் பரிசோதனை',
      source_org: 'MoHFW',
      source_doc: 'PMSMA Guidelines 2023',
      source_url: 'https://pmsma.nhp.gov.in',
    },
  ],

  state_schemes: [
    {
      name_en: "Chief Minister's Comprehensive Health Insurance (CMCHIS)",
      name_ta: 'முதலமைச்சரின் விரிவான சுகாதார காப்பீட்டுத் திட்டம்',
      status: 'active',
      funding: '100% State',
      eligible_en: 'Families earning below ₹72,000/year — 1.75 crore families currently enrolled',
      eligible_ta: 'ஆண்டு வருமானம் ₹72,000-க்கு கீழ் உள்ள 1.75 கோடி குடும்பங்கள்',
      source_org: 'TN Health Dept / CMCHIS',
      source_doc: 'CMCHIS Annual Report 2023-24',
      source_url: 'https://www.cmchistn.com',
    },
    {
      name_en: 'Dr Muthulakshmi Maternity Benefit Scheme',
      name_ta: 'டாக்டர். முத்துலட்சுமி மகப்பேறு நல உதவித் திட்டம்',
      status: 'active',
      funding: '100% State',
      eligible_en: 'Pregnant women in low-income families — ₹18,000 total cash assistance in instalments',
      eligible_ta: 'குறைந்த வருமான குடும்பத்து கர்ப்பிணி பெண்கள் — மொத்தம் ₹18,000 தவணை உதவி',
      source_org: 'TN Social Welfare Dept',
      source_doc: 'GO Ms 48 / 2023',
      source_url: 'https://tnhealth.tn.gov.in',
    },
    {
      name_en: 'TNMSC Free Medicine Scheme',
      name_ta: 'TNMSC இலவச மருந்து திட்டம்',
      status: 'active',
      funding: '100% State',
      eligible_en: 'All OPD and IPD patients at government facilities — 348 essential drugs',
      eligible_ta: 'அனைத்து அரசு மருத்துவமனை நோயாளிகள் — 348 அத்தியாவசிய மருந்துகள்',
      source_org: 'TNMSC',
      source_doc: 'TNMSC Annual Report 2023-24',
      source_url: 'https://www.tnmsc.com',
    },
    {
      name_en: 'Makkalai Thedi Maruthuvam',
      name_ta: 'மக்களை தேடி மருத்துவம்',
      status: 'active',
      funding: '100% State',
      eligible_en: 'All citizens — doorstep screening for 27 diseases via 14,000 health workers',
      eligible_ta: 'அனைத்து குடிமக்கள் — 14,000 சுகாதார ஊழியர்களால் வீட்டு வாசல் பரிசோதனை',
      source_org: 'TN Health Dept',
      source_doc: 'MTM Progress Report Jan 2025',
      source_url: 'https://tnhealth.tn.gov.in',
    },
  ],

  access_processes: [
    {
      name_en: 'Enrol in CMCHIS (Health Insurance Card)',
      name_ta: 'CMCHIS சுகாதார காப்பீடு பதிவு',
      steps: [
        'Confirm eligibility: family annual income below ₹72,000',
        'Visit nearest ration shop or e-Sevai centre with ration card + Aadhaar cards of all family members',
        'Submit application at counter — no fee, no agent needed',
        'Smart Health Card mailed to your address or collected at e-Sevai centre within 15 days',
        'Use the Smart Health Card at any empanelled government or private hospital for cashless treatment',
      ],
      official_days: 15,
      realworld_note:
        'Cards typically take 20–30 days in practice. The card is linked to your ration card number — any name mismatch with Aadhaar causes automatic rejection. Correct your ration card name first if needed.',
      stalls_at:
        'Name mismatch between Aadhaar and ration card. Income certificate dispute for borderline cases.',
      documents: [
        'Ration card (original + photocopy)',
        'Aadhaar card of all family members',
        'Income certificate (if required by officer)',
      ],
      portal_url: 'https://www.cmchistn.com',
      escalate_to:
        'District Collector — Health Wing. TN CM Helpline 1100 if card not received after 45 days.',
    },
    {
      name_en: 'Get free treatment at a Government Hospital',
      name_ta: 'அரசு மருத்துவமனையில் இலவச சிகிச்சை',
      steps: [
        'Walk in to any government hospital OPD — no appointment needed',
        'Collect token at registration counter (bring Aadhaar or any photo ID)',
        'See the doctor, collect prescription slip',
        'Go to hospital pharmacy — collect free medicines with prescription',
        'For inpatient admission: present CMCHIS card if eligible for cashless treatment',
      ],
      official_days: 1,
      realworld_note:
        'OPD wait at major hospitals (GH Chennai, Madurai GH) is commonly 2–4 hours. Arrive before 7 am for shorter queues. Casualty (Emergency) operates 24/7 with no token required.',
      stalls_at:
        'Medicine stock-out at pharmacy. If a medicine is not available, insist on a written "not in stock" note — you can use this to get it at cost from a private pharmacy and claim reimbursement.',
      documents: [
        'Any photo ID (Aadhaar preferred)',
        'CMCHIS Smart Health Card (for inpatient cashless treatment)',
      ],
      escalate_to:
        'Medical Superintendent of the hospital. Dean / Director for government medical college hospitals.',
    },
    {
      name_en: 'Call 108 Ambulance (Emergency)',
      name_ta: '108 ஆம்புலன்ஸ் அழைக்க',
      steps: [
        'Call 108 from any mobile or landline — free, 24/7, no charge ever',
        'Give your location clearly — nearest landmark, street name, district',
        'Stay on the line — dispatcher guides you and tracks the ambulance',
        'Ambulance carries paramedic + basic life support equipment',
        'Transported to nearest government hospital casualty',
      ],
      official_days: 0,
      realworld_note:
        'Urban response target: 8 minutes. Actual urban average: 13.2 minutes (GVK EMRI 2024). Rural average: 24 minutes. Night-time calls respond faster due to low traffic.',
      stalls_at:
        'GPS lock failure in newly developed areas or narrow lanes. Be ready with a clear spoken address and landmark.',
      documents: [],
      escalate_to:
        'If ambulance not arriving: call 104 (Health Helpline) or your district CMHO office directly.',
    },
  ],

  budget_cr: 21000,
  central_pct: 30,
  state_pct: 70,
  revenue_cr: 1200,
  per_citizen_spend_en: '~₹271 per citizen per year (TN population 7.75 crore, 2024-25 budget)',
  budget_trend_cr: [10200, 11800, 13100, 14200, 15600, 16100, 17200, 18100, 19800, 21000],
  budget_trend_years: ['2015-16', '2016-17', '2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25'],

  staff_sanctioned: 82000,
  staff_filled: 67400,
  secretary_name: 'Dr P. Senthilkumar (IAS)',
  secretary_tenure: 'Principal Secretary since Aug 2023',
  frontline_description_en:
    '40,000+ nurses across government hospitals · 14,000 ASHA health workers under Makkalai Thedi Maruthuvam · 5,200 doctors posted at PHCs',
  vacancy_note_en:
    '18% overall vacancy. Specialist doctors: 32% vacant — highest in rural and tribal area PHCs, some running without any specialist for 2+ years.',
  staff_source: 'TN Legislative Assembly Q&A · Session Feb 2025 · Question No. 147 + CAG Report 2023',

  outcome_metrics: [
    {
      metric_en: 'PHCs with a full-time doctor posted',
      metric_ta: 'முழுநேர மருத்துவர் உள்ள PHC-கள்',
      target: '100%',
      actual: '68%',
      direction: 'bad',
      source_org: 'CAG',
      source_doc: 'Performance Audit: Health Services TN 2023',
      source_year: '2023',
      source_url: 'https://cag.gov.in',
    },
    {
      metric_en: 'Essential medicine availability at PHCs',
      metric_ta: 'PHC-களில் மருந்து கிடைக்கும் விகிதம்',
      target: '100%',
      actual: '87%',
      direction: 'bad',
      source_org: 'TNMSC',
      source_doc: 'Stock Availability Audit Q3 2024',
      source_year: '2024',
      source_url: 'https://tnmsc.com',
    },
    {
      metric_en: '108 ambulance average response — urban',
      metric_ta: '108 ஆம்புலன்ஸ் சராசரி வருகை நேரம் (நகர்)',
      target: '8 minutes',
      actual: '13.2 minutes',
      direction: 'bad',
      source_org: 'GVK EMRI / TN Health Dept',
      source_doc: '108 Performance Dashboard Q3 2024',
      source_year: '2024',
      source_url: 'https://tnhealth.tn.gov.in',
    },
    {
      metric_en: 'CMCHIS claim settlement rate',
      metric_ta: 'CMCHIS கோரிக்கை தீர்வு விகிதம்',
      target: '100%',
      actual: '94.2%',
      direction: 'good',
      source_org: 'CMCHIS',
      source_doc: 'Annual Report 2023-24',
      source_year: '2024',
      source_url: 'https://www.cmchistn.com',
    },
    {
      metric_en: 'Maternal mortality rate (per 1 lakh live births)',
      metric_ta: 'தாய் இறப்பு விகிதம் (1 லட்சம் பிறப்புகளுக்கு)',
      target: '70 (SDG 2030 goal)',
      actual: '61 — already met',
      direction: 'good',
      source_org: 'Sample Registration System (SRS)',
      source_doc: 'SRS Statistical Report 2020-22',
      source_year: '2022',
      source_url: 'https://censusindia.gov.in',
    },
  ],

  rights: [
    {
      title_en: 'Free emergency treatment — no refusal allowed',
      title_ta: 'இலவச அவசர சிகிச்சை — மறுக்க இயலாது',
      description_en:
        'Any government hospital must provide emergency treatment immediately. No payment, no documentation, no insurance card is required to begin emergency care. Refusing is a punishable offence under clinical establishment rules.',
      law: 'Clinical Establishments Act 2010 · MCI Emergency Care Guidelines',
      timeline: 'Immediate — no waiting for payment or documents',
      escalate:
        'File complaint with TN Medical Council. Call 104 health helpline. Report to District Collector if hospital refuses.',
    },
    {
      title_en: 'Free essential medicines at all government facilities',
      title_ta: 'அனைத்து அரசு மருத்துவமனைகளில் இலவச மருந்துகள்',
      description_en:
        '348 essential medicines must be dispensed free at all government hospitals and PHCs to any patient who holds a valid government doctor prescription. If unavailable, the hospital must issue a written shortage note.',
      law: 'TN Free Medicine Scheme — GO Ms 72 / 2008 + TNMSC Standing Orders',
      timeline: 'On presentation of valid government doctor prescription',
      escalate:
        'Complaint to TNMSC District Manager. Escalate to CMHO if medicines are chronically unavailable at your PHC.',
    },
    {
      title_en: 'CMCHIS cashless treatment — pre-auth within 2 hours',
      title_ta: 'CMCHIS பணமில்லா சிகிச்சை — 2 மணி நேரத்தில் அனுமதி',
      description_en:
        'Empanelled hospitals cannot charge you for any of 1,027 covered procedures if you present a valid CMCHIS Smart Health Card. Pre-authorisation must be granted within 2 hours of admission request.',
      law: 'CMCHIS Scheme Rules 2012, amended 2023',
      timeline: 'Immediate admission · Pre-auth within 2 hours',
      escalate:
        'CMCHIS Helpline: 044-28592828. Complaint at District Collector office if hospital charges or delays pre-auth.',
    },
    {
      title_en: 'RTI on any health data — 30 days',
      title_ta: 'எந்த சுகாதார தகவலும் 30 நாட்களில்',
      description_en:
        'You can request any health department data — hospital budgets, staff vacancy figures, medicine purchase prices, audit reports, scheme beneficiary lists — from any government health institution. For life-threatening situations, 48-hour response is mandatory.',
      law: 'Right to Information Act 2005 · Section 7(1)',
      timeline: '30 days from application · 48 hours for life/liberty cases',
      escalate:
        'First Appeal to Departmental Appellate Authority. Second Appeal to Tamil Nadu Information Commission.',
    },
  ],

  flags: [
    {
      id: 'health-specialist-vacancy',
      severity: 'red',
      title_en: '32% specialist doctor posts vacant — rural PHCs hardest hit',
      body_en:
        'Of 8,400 sanctioned specialist posts, 2,688 are unfilled as of Feb 2025. Rural and tribal area PHCs report the highest vacancy rates, with several facilities running without any specialist for over 2 years.',
      source_org: 'CAG',
      source_doc: 'Performance Audit: Health Services TN 2023',
      source_year: '2023',
      source_url: 'https://cag.gov.in',
    },
    {
      id: 'health-ambulance-response',
      severity: 'red',
      title_en: '108 ambulance response time — 65% above target in urban areas',
      body_en:
        'Official urban target is 8 minutes. Actual average is 13.2 minutes (GVK EMRI Q3 2024). Rural average: 24 minutes vs 20-minute target. No published improvement plan from the department.',
      source_org: 'GVK EMRI · TN Health Dept',
      source_doc: '108 Performance Dashboard Q3 2024',
      source_year: '2024',
      source_url: 'https://tnhealth.tn.gov.in',
    },
    {
      id: 'health-cmchis-empanelled',
      severity: 'amber',
      title_en: 'CMCHIS empanelled private hospitals fell 12% in 2023-24',
      body_en:
        'From 1,062 empanelled hospitals in 2022-23 to 934 in 2023-24. Hospitals cite delayed reimbursements (60–90 days beyond the 30-day contractual deadline) as the primary reason for opting out.',
      source_org: 'CMCHIS',
      source_doc: 'Empanelment Statistics 2023-24',
      source_year: '2024',
      source_url: 'https://www.cmchistn.com',
    },
    {
      id: 'health-mmr',
      severity: 'green',
      title_en: 'Maternal mortality rate — below national average and SDG target already met',
      body_en:
        'TN MMR: 61 per 1 lakh live births. National average: 97. SDG 2030 target: 70. TN crossed this target 8 years early. Consistent improvement from 90 per lakh in 2014-16.',
      source_org: 'Sample Registration System',
      source_doc: 'SRS Statistical Report 2020-22',
      source_year: '2022',
      source_url: 'https://censusindia.gov.in',
    },
  ],
}

export const DEPT_DETAILS: Record<string, DeptDetail> = {
  health: HEALTH,
}
