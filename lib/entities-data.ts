// Tamil Nadu Public Sector Undertakings, Statutory Bodies, and Key Entities
// Covers state PSUs, central PSUs operating in TN, and statutory corporations

export type EntityType =
  | 'state_psu'
  | 'central_psu'
  | 'statutory_body'
  | 'development_authority'
  | 'cooperative'
  | 'special_purpose_vehicle'

export type EntityStatus = 'operational' | 'under_restructuring' | 'loss_making' | 'profitable'

export type TNEntity = {
  id: string
  name_en: string
  name_ta: string
  slug: string
  acronym: string
  entity_type: EntityType
  parent_dept_id: string
  established_year: number
  registered_under_en: string    // Companies Act / Statutory Act
  status: EntityStatus
  annual_revenue_cr: number
  annual_profit_loss_cr: number  // negative = loss
  employees: number
  employees_note_en?: string
  mandate_en: string
  mandate_ta: string
  citizen_services_en: string[]
  key_metrics_en: string[]
  controversies_en?: string[]
  board_composition_en: string
  auditor_en: string
  last_audit_year: number
  rti_nodal_en: string
  website_url?: string
  data_quality: 'available' | 'estimated' | 'not_available'
  data_source_en: string
}

export const TN_ENTITIES: TNEntity[] = [
  // ── ENERGY ──────────────────────────────────────────────────────
  {
    id: 'tangedco',
    name_en: 'Tamil Nadu Generation and Distribution Corporation',
    name_ta: 'தமிழ்நாடு மின்சாரம் உற்பத்தி மற்றும் விநியோக நிறுவனம்',
    slug: 'tangedco',
    acronym: 'TANGEDCO',
    entity_type: 'state_psu',
    parent_dept_id: 'energy',
    established_year: 2010,
    registered_under_en: 'Companies Act 2013 (split from TNEB in 2010)',
    status: 'loss_making',
    annual_revenue_cr: 70000,
    annual_profit_loss_cr: -14442,
    employees: 86000,
    mandate_en: 'Generation, transmission, and distribution of electricity to 3.5 crore connections. Provides 100 free units/month to domestic consumers. Manages 11 thermal plants, wind farms, solar parks.',
    mandate_ta: '3.5 கோடி இணைப்புகளுக்கு மின் உற்பத்தி, பரிமாற்றம் மற்றும் விநியோகம். வீட்டு நுகர்வோருக்கு 100 இலவச யூனிட்/மாதம்.',
    citizen_services_en: [
      'New electricity connection (domestic/commercial/industrial)',
      '100 free units/month for domestic consumers',
      'Solar rooftop net-metering',
      'Smart meter rollout',
      'Consumer grievance redressal (1912 helpline)',
      'Online bill payment and e-statement',
    ],
    key_metrics_en: [
      'Installed generation capacity: 16,200 MW (state) + 12,000 MW (renewables)',
      'Distribution loss: 11.4% (2024) — improved from 16% in 2015',
      'Aggregate Technical & Commercial loss: 17.2%',
      'Outstanding loan: ₹1.25 lakh Cr',
      'Subsidy from state: ₹14,442 Cr/year (2024)',
      'Renewable energy mix: 44% of total generation',
      'Domestic consumer tariff: ₹0 for first 100 units, ₹1.50 for 101–200 units',
    ],
    controversies_en: [
      'Accumulated losses of ₹1.25 lakh Cr as of 2024',
      'CAG audit flagged distribution losses higher than declared',
      'Procurement of coal at above-market rates (CAG 2019)',
      'Renewable energy PPA rates challenged in TNERC',
    ],
    board_composition_en: 'CMD (IAS), Directors from Finance/Technical/Distribution departments; 2 independent directors; State Govt nominee',
    auditor_en: 'Comptroller & Auditor General (C&AG) + statutory auditor appointed by C&AG',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TANGEDCO HQ, NPKRR Maaligai, Chennai-2',
    website_url: 'https://www.tangedco.gov.in',
    data_quality: 'available',
    data_source_en: 'TANGEDCO Annual Report 2023-24; CAG Audit Report; TNERC Tariff Orders',
  },
  {
    id: 'tantransco',
    name_en: 'Tamil Nadu Transmission Corporation',
    name_ta: 'தமிழ்நாடு மின் பரிமாற்ற நிறுவனம்',
    slug: 'tantransco',
    acronym: 'TANTRANSCO',
    entity_type: 'state_psu',
    parent_dept_id: 'energy',
    established_year: 2010,
    registered_under_en: 'Companies Act 2013 (split from TNEB in 2010)',
    status: 'operational',
    annual_revenue_cr: 8200,
    annual_profit_loss_cr: -800,
    employees: 12000,
    mandate_en: 'High-voltage transmission of electricity across Tamil Nadu — 66kV to 400kV network spanning 110,000 circuit km. Grid interconnection with neighbouring states.',
    mandate_ta: 'TN-ல் உயர்வோல்டேஜ் மின் பரிமாற்றம் — 66kV முதல் 400kV வரை 110,000 சர்க்யூட் கி.மீ. வலை.',
    citizen_services_en: [
      'Bulk power supply to TANGEDCO distribution',
      'Interstate power exchange',
      'Grid stability management',
    ],
    key_metrics_en: [
      'Transmission network: 110,000 circuit km',
      'Substations: 3,200+',
      'Transmission loss: 2.8%',
      'Grid availability: 99.6%',
    ],
    board_composition_en: 'CMD (IAS/IES), Technical and Finance Directors; State Govt nominees',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TANTRANSCO, NPKRR Maaligai, Chennai-2',
    website_url: 'https://www.tantransco.gov.in',
    data_quality: 'available',
    data_source_en: 'TANTRANSCO Annual Report 2023-24; TNERC filings',
  },

  // ── TRANSPORT ────────────────────────────────────────────────────
  {
    id: 'tnstc',
    name_en: 'Tamil Nadu State Transport Corporation',
    name_ta: 'தமிழ்நாடு மாநில போக்குவரத்து நிறுவனம்',
    slug: 'tnstc',
    acronym: 'TNSTC',
    entity_type: 'state_psu',
    parent_dept_id: 'transport',
    established_year: 1972,
    registered_under_en: 'Tamil Nadu State Transport Corporations Act 1972',
    status: 'loss_making',
    annual_revenue_cr: 8200,
    annual_profit_loss_cr: -3200,
    employees: 142000,
    employees_note_en: 'Across 7 regional corporations: TNSTC (Villupuram, Kumbakonam, Salem, Coimbatore, Tirunelveli, Madurai), SETC',
    mandate_en: 'Operates 21,600 buses carrying 2.5 crore passengers daily across TN. Free bus pass for women, students, and differently-abled. Rural connectivity through 65,000 routes.',
    mandate_ta: '21,600 பேருந்துகள் தினமும் 2.5 கோடி பயணிகள். பெண்கள், மாணவர்கள், மாற்றுத்திறனாளிகளுக்கு இலவச பாஸ். 65,000 வழிகளில் கிராமப்புற இணைப்பு.',
    citizen_services_en: [
      'Intercity and rural bus services across 65,000 routes',
      'Free bus pass for women (all routes)',
      'Free bus pass for students (school and college)',
      'Free bus pass for differently abled (with one escort)',
      'Monthly season tickets at 50% discount for commuters',
      'Online ticket booking (limited)',
    ],
    key_metrics_en: [
      'Fleet size: 21,600 buses (7 regional corporations + SETC)',
      'Daily passengers: 2.5 crore',
      'Routes: 65,000+',
      'Fleet utilisation: 88%',
      'Revenue per km: ₹41.2 (2023)',
      'Cost per km: ₹55.8 (2023)',
      'Free pass subsidy burden: ₹4,500 Cr/year',
      'Average bus age: 8.2 years',
    ],
    controversies_en: [
      'Accumulating losses — ₹3,200 Cr/year shortfall; debt ₹22,000 Cr+',
      'Fleet renewal delayed — many buses beyond 10-year retirement age',
      'CAG: Driver shortfall 15% leading to cancelled services',
    ],
    board_composition_en: 'MD (IAS), Technical Director, Finance Director; Transport Dept nominee',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, respective regional TNSTC HQ',
    website_url: 'https://www.tnstc.in',
    data_quality: 'available',
    data_source_en: 'TNSTC Annual Report 2023; CAG Audit Reports; Transport Dept budget documents',
  },
  {
    id: 'cmrl',
    name_en: 'Chennai Metro Rail Limited',
    name_ta: 'சென்னை மெட்ரோ ரயில் நிறுவனம்',
    slug: 'cmrl',
    acronym: 'CMRL',
    entity_type: 'special_purpose_vehicle',
    parent_dept_id: 'transport',
    established_year: 2010,
    registered_under_en: 'Companies Act 2013 — JV: Govt of India 50% + Govt of TN 50%',
    status: 'operational',
    annual_revenue_cr: 650,
    annual_profit_loss_cr: -1800,
    employees: 3800,
    mandate_en: 'Operates 54.1 km Phase 1 Chennai Metro. Constructing 118.9 km Phase 2 across 3 corridors (₹63,246 Cr). Targets 40 lakh daily passengers by 2030.',
    mandate_ta: '54.1 கி.மீ. கட்டம் 1 சென்னை மெட்ரோ இயக்குகிறது. 118.9 கி.மீ. கட்டம் 2 கட்டுமானம் (₹63,246 கோடி). 2030 வாக்கில் 40 லட்சம் பயணிகள்.',
    citizen_services_en: [
      'Metro rail service: 54 km, 45 stations, Phase 1',
      'Frequency: 3–10 minutes during peak hours',
      'Fare: ₹10–60 per trip',
      'Smart card (ChennaiOne) for seamless transit',
      'Feeder bus services from major stations',
      'Accessible stations for differently abled (100%)',
    ],
    key_metrics_en: [
      'Phase 1 length: 54.1 km, 45 stations',
      'Phase 1 daily ridership: 5–6 lakh (2024)',
      'Phase 2 target: 118.9 km, 3 corridors',
      'Phase 2 investment: ₹63,246 Cr',
      'Phase 2 expected completion: 2027–2028',
      'Accumulated project debt: ₹25,000 Cr+',
    ],
    board_composition_en: 'MD (IAS — Joint Secretary level), Directors representing Central and State governments, independent directors',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, CMRL, Koyambedu, Chennai-107',
    website_url: 'https://www.chennaimetrorail.org',
    data_quality: 'available',
    data_source_en: 'CMRL Annual Report 2023; Ministry of Housing & Urban Affairs',
  },

  // ── RETAIL / REVENUE ─────────────────────────────────────────────
  {
    id: 'tasmac',
    name_en: 'Tamil Nadu State Marketing Corporation',
    name_ta: 'தமிழ்நாடு மாநில சந்தைப்படுத்தல் நிறுவனம்',
    slug: 'tasmac',
    acronym: 'TASMAC',
    entity_type: 'state_psu',
    parent_dept_id: 'tasmac',
    established_year: 1983,
    registered_under_en: 'Companies Act; state monopoly under Tamil Nadu Liquor (Licence and Permit) Rules',
    status: 'profitable',
    annual_revenue_cr: 45000,
    annual_profit_loss_cr: 8200,
    employees: 35000,
    mandate_en: 'Sole legal retailer of Indian Made Foreign Liquor (IMFL) in TN. Operates 4,928 retail outlets. Annual excise revenue of ₹12,247 Cr flows to state exchequer.',
    mandate_ta: 'TN-ல் ஒரே சட்டப்பூர்வமான மது சில்லறை விற்பனையாளர். 4,928 கடைகள். ஆண்டுக்கு ₹12,247 கோடி கலால் வருவாய்.',
    citizen_services_en: [
      '4,928 retail outlets across TN',
      'Online liquor ordering (limited implementation)',
      'Bar attached to some outlets (TASMAC bars)',
    ],
    key_metrics_en: [
      'Retail outlets: 4,928',
      'Annual sales revenue: ₹45,000 Cr (2023-24)',
      'Excise duty to state: ₹12,247 Cr/year',
      'Market share: 100% (state monopoly)',
      'Daily average sales: ₹123 Cr',
      'Net profit: ₹8,200 Cr/year',
      'Dividend to state: ₹6,000 Cr+',
    ],
    controversies_en: [
      'Labour unions allege irregular working conditions at retail outlets',
      'CAG: Shortfalls in stock accounting at depots',
      'Opposition demands privatisation or prohibition',
      'Court cases on shop location near schools/temples',
    ],
    board_composition_en: 'CMD (IAS), Directors from Finance/Commercial; Commissioner of Prohibition & Excise as ex-officio director',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TASMAC HQ, Greams Road, Chennai-6',
    website_url: 'https://www.tasmac.co.in',
    data_quality: 'available',
    data_source_en: 'TASMAC Annual Report 2023-24; State Budget 2024-25',
  },

  // ── FOOD / COOPERATIVE ───────────────────────────────────────────
  {
    id: 'tncsc',
    name_en: 'Tamil Nadu Civil Supplies Corporation',
    name_ta: 'தமிழ்நாடு சிவில் சப்ளை நிறுவனம்',
    slug: 'tncsc',
    acronym: 'TNCSC',
    entity_type: 'state_psu',
    parent_dept_id: 'cooperation',
    established_year: 1973,
    registered_under_en: 'Tamil Nadu Civil Supplies Corporation Act 1973',
    status: 'operational',
    annual_revenue_cr: 18000,
    annual_profit_loss_cr: -1200,
    employees: 8500,
    mandate_en: 'Procures paddy from 10 lakh farmers at MSP, manages 3,500+ FPS (Fair Price Shops), and distributes rice to 2.06 crore ration card families under PDS.',
    mandate_ta: '10 லட்சம் விவசாயிகளிடம் குறைந்தபட்ச ஆதார விலையில் நெல் கொள்முதல். 3,500+ நியாய விலை கடைகள் மேலாண்மை. PDS மூலம் 2.06 கோடி குடும்பங்களுக்கு அரிசி விநியோகம்.',
    citizen_services_en: [
      'PDS rice distribution to 2.06 crore ration card families',
      'Paddy MSP procurement from farmers (10 lakh/year)',
      'Fair Price Shop network (3,500+ across TN)',
      'Subsidised commodities: sugar, pulses, kerosene, palm oil',
      'Ration card services (new/modifications)',
    ],
    key_metrics_en: [
      'Annual rice procurement: 38–45 lakh MT',
      'PDS beneficiary families: 2.06 crore',
      'Fair Price Shops: 3,500+',
      'Storage capacity: 28 lakh MT',
      'Monthly rice allocation: 5 kg/person free (NFSA)',
      'Additional TN allocation: 2 kg subsidised flour, 1 kg dal, 1 litre oil',
    ],
    board_composition_en: 'MD (IAS), Directors from Finance/Operations; Co-operation Secretary as chairman',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TNCSC, Arumbakkam, Chennai-106',
    website_url: 'https://www.tncsc.tn.gov.in',
    data_quality: 'available',
    data_source_en: 'TNCSC Annual Report 2023; FCI offtake data; TNPDS portal',
  },

  // ── INDUSTRY / INVESTMENT ────────────────────────────────────────
  {
    id: 'tidco',
    name_en: 'Tamil Nadu Industrial Development Corporation',
    name_ta: 'தமிழ்நாடு தொழில் வளர்ச்சி நிறுவனம்',
    slug: 'tidco',
    acronym: 'TIDCO',
    entity_type: 'state_psu',
    parent_dept_id: 'industries',
    established_year: 1965,
    registered_under_en: 'Companies Act',
    status: 'profitable',
    annual_revenue_cr: 2800,
    annual_profit_loss_cr: 420,
    employees: 800,
    mandate_en: 'Promotes industrial investment through joint ventures, equity participation, and facilitation. Key investor in Hyundai, Ford, Nokia, and Renault-Nissan JVs.',
    mandate_ta: 'கூட்டு முயற்சிகள், பங்கு பங்கேற்பு மூலம் தொழில் முதலீட்டை ஊக்குவிக்கிறது. Hyundai, Ford, Nokia, Renault-Nissan JV-களில் முதலீட்டாளர்.',
    citizen_services_en: [
      'Investment facilitation for new industries',
      'Joint venture equity partnership',
      'Industrial land allocation',
      'Investor grievance redressal',
    ],
    key_metrics_en: [
      'Portfolio companies: 40+ JV investments',
      'Equity stake in Hyundai Motor India (minor stake)',
      'Equity in 25 industrial ventures',
      'Land bank: 15,000+ acres across TN',
      'GIM 2024 facilitation: ₹6.65 lakh Cr MoUs',
    ],
    board_composition_en: 'CMD (IAS), Directors from Finance/Technical; Industries Secretary as chairman',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TIDCO, Nandanam, Chennai-35',
    website_url: 'https://www.tidco.com',
    data_quality: 'available',
    data_source_en: 'TIDCO Annual Report 2023; Industries Dept budget',
  },
  {
    id: 'sipcot',
    name_en: 'State Industries Promotion Corporation of Tamil Nadu',
    name_ta: 'தமிழ்நாடு மாநில தொழில்கள் ஊக்குவிப்பு நிறுவனம்',
    slug: 'sipcot',
    acronym: 'SIPCOT',
    entity_type: 'state_psu',
    parent_dept_id: 'industries',
    established_year: 1971,
    registered_under_en: 'Companies Act',
    status: 'profitable',
    annual_revenue_cr: 1600,
    annual_profit_loss_cr: 280,
    employees: 600,
    mandate_en: 'Develops and manages 43 industrial parks across TN. Allots plots to industries at concessional rates. Manages 19,000+ acres of industrial land including Sriperumbudur, Siruseri, and Cuddalore.',
    mandate_ta: 'TN-ல் 43 தொழிற்பேட்டைகளை உருவாக்கி நிர்வகிக்கிறது. தொழிற்சாலைகளுக்கு சலுகை விலையில் நிலம் ஒதுக்கீடு.',
    citizen_services_en: [
      'Industrial plot allotment to new industries',
      'Ready-built factory sheds for MSMEs',
      'Common Effluent Treatment Plants',
      'Industrial infrastructure maintenance',
    ],
    key_metrics_en: [
      'Industrial parks: 43 across TN',
      'Total land: 19,000+ acres',
      'Units housed: 2,800+ industries',
      'Employment generated: 4.5 lakh',
      'Key parks: Sriperumbudur, Siruseri, Cuddalore, Hosur, Gummidipoondi',
      'Occupancy rate: 78%',
    ],
    board_composition_en: 'MD (IAS), Directors; Industries Secretary as chairman',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, SIPCOT HQ, SIDCO Industrial Estate, Chennai-32',
    website_url: 'https://www.sipcot.com',
    data_quality: 'available',
    data_source_en: 'SIPCOT Annual Report 2023; Industries Dept budget',
  },

  // ── HOUSING ──────────────────────────────────────────────────────
  {
    id: 'tnhb',
    name_en: 'Tamil Nadu Housing Board',
    name_ta: 'தமிழ்நாடு வீட்டுவசதி வாரியம்',
    slug: 'tnhb',
    acronym: 'TNHB',
    entity_type: 'statutory_body',
    parent_dept_id: 'housing',
    established_year: 1961,
    registered_under_en: 'Tamil Nadu Housing Board Act 1961',
    status: 'operational',
    annual_revenue_cr: 4200,
    annual_profit_loss_cr: 180,
    employees: 3200,
    mandate_en: 'Constructs and sells affordable residential and commercial units. Develops integrated townships and layouts. Manages Kalaignar Illam housing scheme (4 lakh units target).',
    mandate_ta: 'மலிவு விலை குடியிருப்பு மற்றும் வணிக அலகுகளை கட்டுகிறது. கலைஞர் இல்லம் திட்டம் (4 லட்சம் வீடுகள் இலக்கு).',
    citizen_services_en: [
      'Allotment of affordable housing plots and flats',
      'Layout development and plot registration',
      'Kalaignar Illam slum redevelopment housing',
      'Commercial complex development',
    ],
    key_metrics_en: [
      'Units constructed since inception: 4.2 lakh',
      'Kalaignar Illam target: 4 lakh units (2021–2026)',
      'Units completed under Kalaignar Illam: 2.1 lakh (2024)',
      'Active projects: 280+',
      'Average unit cost: ₹5–15 lakh (EWS), ₹15–50 lakh (MIG)',
    ],
    board_composition_en: 'Commissioner/MD (IAS), Housing Dept Secretary as chairman, Directors from Finance/Engineering',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TNHB, No.1, Haddows Road, Chennai-6',
    website_url: 'https://www.tnhb.gov.in',
    data_quality: 'available',
    data_source_en: 'TNHB Annual Report 2023; Housing Dept budget documents',
  },

  // ── WATER ────────────────────────────────────────────────────────
  {
    id: 'cmwssb',
    name_en: 'Chennai Metropolitan Water Supply and Sewerage Board',
    name_ta: 'சென்னை மாநகர நீர் வழங்கல் மற்றும் கழிவுநீர் வாரியம்',
    slug: 'cmwssb',
    acronym: 'CMWSSB / Metro Water',
    entity_type: 'statutory_body',
    parent_dept_id: 'water-resources',
    established_year: 1978,
    registered_under_en: 'Chennai Metropolitan Water Supply and Sewerage Act 1978',
    status: 'operational',
    annual_revenue_cr: 2400,
    annual_profit_loss_cr: -600,
    employees: 9800,
    mandate_en: 'Supplies drinking water to 45 lakh Chennai households. Manages 4 desalination plants, reservoirs, and sewerage network. Target: 135 litres/person/day through pipeline.',
    mandate_ta: '45 லட்சம் சென்னை குடும்பங்களுக்கு குடிநீர் வழங்கல். 4 நீர் நீக்கல் ஆலைகள், நீர்த்தேக்கங்கள், கழிவுநீர் வலை. இலக்கு: 135 லிட்/நபர்/நாள்.',
    citizen_services_en: [
      'Piped water supply (Chennai corporation area)',
      'Tanker water supply for unserved areas',
      'New water and sewerage connections',
      'Sewerage and drainage maintenance',
      'Online bill payment',
      'Complaint registration (45674 helpline)',
    ],
    key_metrics_en: [
      'Daily water supply: 1,130 MLD (target 1,500 MLD)',
      'Desalination plants: 4 (total 400 MLD capacity)',
      'Service area: Greater Chennai Corporation + suburbs',
      'Households with piped connections: 11.4 lakh direct',
      'Tanker trips daily: 3,200',
      'Sewage treatment: 800 MLD capacity',
      'Water loss (UFW): 32% (high — national average 20%)',
    ],
    controversies_en: [
      'High unaccounted-for water (UFW) at 32% — above industry norm',
      'Quality complaints in peripheral areas',
      'CAG: Capital works delayed by 3–4 years on average',
    ],
    board_composition_en: 'MD (IAS), Director-Engineers; Municipal Administration Secretary as chairman',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, CMWSSB, No.1, Pump House Road, Chennai-2',
    website_url: 'https://www.chennaimetrowater.tn.gov.in',
    data_quality: 'available',
    data_source_en: 'CMWSSB Annual Report 2023; CAG Audit Reports; ADB project reports',
  },

  // ── FINANCE / CREDIT ─────────────────────────────────────────────
  {
    id: 'tansidco',
    name_en: 'Tamil Nadu Small Industries Development Corporation',
    name_ta: 'தமிழ்நாடு சிறு தொழில்கள் வளர்ச்சி நிறுவனம்',
    slug: 'tansidco',
    acronym: 'TANSIDCO (SIDCO)',
    entity_type: 'state_psu',
    parent_dept_id: 'msme',
    established_year: 1970,
    registered_under_en: 'Companies Act',
    status: 'operational',
    annual_revenue_cr: 800,
    annual_profit_loss_cr: 60,
    employees: 1800,
    mandate_en: 'Provides industrial plots, sheds, and financial assistance to MSMEs. Manages 93 industrial estates with 46,000 MSME units across TN.',
    mandate_ta: 'MSME-களுக்கு தொழிற்பேட்டை, கிடங்குகள், நிதி உதவி வழங்குகிறது. 93 தொழிற்பேட்டைகளில் 46,000 MSME பிரிவுகள்.',
    citizen_services_en: [
      'Industrial plot allotment to MSMEs',
      'Ready-built factory sheds for hire/sale',
      'Term loans to MSMEs',
      'Raw material supply (steel, chemicals)',
    ],
    key_metrics_en: [
      'Industrial estates: 93',
      'MSME units: 46,000+',
      'Employment supported: 3 lakh+',
      'Loans disbursed: ₹400 Cr/year',
    ],
    board_composition_en: 'MD (IAS), Directors; MSME Dept Secretary as chairman',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, TANSIDCO, Thiru-vi-ka Industrial Estate, Chennai-32',
    website_url: 'https://www.tansidco.co.in',
    data_quality: 'available',
    data_source_en: 'TANSIDCO Annual Report 2023; MSME Dept budget',
  },

  // ── CENTRAL PSUs OPERATING IN TN ─────────────────────────────────
  {
    id: 'nlc',
    name_en: 'NLC India Limited (Neyveli Lignite Corporation)',
    name_ta: 'NLC இந்தியா லிமிடெட் (நெய்வேலி மரக்கரி நிறுவனம்)',
    slug: 'nlc',
    acronym: 'NLC',
    entity_type: 'central_psu',
    parent_dept_id: 'energy',
    established_year: 1956,
    registered_under_en: 'Companies Act; Navratna Central PSU under Ministry of Coal/Power',
    status: 'profitable',
    annual_revenue_cr: 14000,
    annual_profit_loss_cr: 1800,
    employees: 14000,
    mandate_en: 'Mining lignite at Neyveli and generating thermal power (4,956 MW installed). Expanding into solar (4,000 MW target). Major employer in Cuddalore district.',
    mandate_ta: 'நெய்வேலியில் மரக்கரி சுரங்கம் மற்றும் வெப்ப மின் உற்பத்தி (4,956 MW). சோலார் விரிவாக்கம் (4,000 MW இலக்கு).',
    citizen_services_en: [
      'Power generation to Tamil Nadu grid',
      'Employment — 14,000 direct + 50,000+ indirect',
      'Township services in Neyveli (hospital, schools)',
    ],
    key_metrics_en: [
      'Lignite mining capacity: 30.6 MT/year',
      'Thermal power: 4,956 MW installed',
      'Solar power: 2,476 MW (operational)',
      'Target solar: 10,000 MW by 2030',
      'Profit after tax: ₹1,800 Cr (2023-24)',
      'Dividend to Govt of India: ₹500 Cr',
    ],
    board_composition_en: 'CMD (Board-level IAS/IES); Directors from Finance/Mining/Operations; MoC nominees; independent directors',
    auditor_en: 'C&AG + Statutory Auditor (Navratna company)',
    last_audit_year: 2024,
    rti_nodal_en: 'Public Information Officer, NLC India Limited, Neyveli — 607 803',
    website_url: 'https://www.nlcindia.in',
    data_quality: 'available',
    data_source_en: 'NLC Annual Report 2023-24; BSE filings (listed company)',
  },
  {
    id: 'bhel-trichy',
    name_en: 'BHEL Tiruchirappalli (Bharat Heavy Electricals)',
    name_ta: 'BHEL திருச்சிராப்பள்ளி (பாரத் ஹெவி எலக்ட்ரிக்கல்ஸ்)',
    slug: 'bhel-trichy',
    acronym: 'BHEL Trichy',
    entity_type: 'central_psu',
    parent_dept_id: 'industries',
    established_year: 1965,
    registered_under_en: 'Companies Act; Navratna Central PSU under Ministry of Heavy Industries',
    status: 'operational',
    annual_revenue_cr: 6800,
    annual_profit_loss_cr: 220,
    employees: 9200,
    mandate_en: 'Manufactures power plant equipment — boilers, turbines, heat exchangers, pressure vessels. Major exporter of industrial equipment. 200+ acres campus in Trichy.',
    mandate_ta: 'மின் நிலைய உபகரணங்கள் — கொதிகலன்கள், விசைச்சக்கரங்கள், வெப்ப மாற்றிகள் தயாரிப்பு. தொழிற்துறை உபகரண ஏற்றுமதியாளர்.',
    citizen_services_en: [
      'Industrial employer — 9,200 direct + 15,000+ contract workers',
      'Township facility serving 30,000+ families',
      'Technical training institute (BHARAT)',
    ],
    key_metrics_en: [
      'Manufacturing capacity: 15,000 MW/year equivalent in boilers',
      'Exports: ₹1,200 Cr/year (Southeast Asia, Middle East)',
      'Order book: ₹8,500 Cr',
      'Campus: 200+ acres, Tiruchirappalli',
    ],
    board_composition_en: 'Executive Director heading Trichy unit; reports to BHEL CMD New Delhi',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2024,
    rti_nodal_en: 'Public Information Officer, BHEL Trichy, Thiruviyalur Road, Tiruchirappalli-620014',
    website_url: 'https://www.bhel.com',
    data_quality: 'available',
    data_source_en: 'BHEL Annual Report 2023-24; Ministry of Heavy Industries',
  },

  // ── DEVELOPMENT AUTHORITIES ──────────────────────────────────────
  {
    id: 'cmda',
    name_en: 'Chennai Metropolitan Development Authority',
    name_ta: 'சென்னை மாநகர வளர்ச்சி ஆணையம்',
    slug: 'cmda',
    acronym: 'CMDA',
    entity_type: 'development_authority',
    parent_dept_id: 'housing',
    established_year: 1975,
    registered_under_en: 'Tamil Nadu Town and Country Planning Act 1971',
    status: 'operational',
    annual_revenue_cr: 1800,
    annual_profit_loss_cr: 200,
    employees: 2200,
    mandate_en: 'Regulates land use, issues building permits, and prepares master plans for 1,189 sq km Chennai Metropolitan Area. Manages development control regulations for 28 local bodies.',
    mandate_ta: '1,189 சதுர கி.மீ. சென்னை நகர்ப்புற பகுதிக்கு நில பயன்பாட்டை ஒழுங்குபடுத்துகிறது, கட்டிட அனுமதி, முதன்மை திட்டங்கள். 28 உள்ளாட்சி அமைப்புகளுக்கு வளர்ச்சி கட்டுப்பாடு.',
    citizen_services_en: [
      'Building plan approval (Chennai Metro area)',
      'Land use certificate',
      'Layout approval',
      'Planning permission for commercial buildings',
      'Online plan approval (TNDRIP portal)',
    ],
    key_metrics_en: [
      'Jurisdiction: 1,189 sq km, 28 local bodies',
      'Building permits issued: 1.2 lakh/year',
      'Master Plan 2046: in preparation',
      'Second Master Plan (2026): under review',
      'FSI norms: 1.5–4.0 depending on zone',
    ],
    controversies_en: [
      'Delays in building plan approval — official 30 days, actual 90–120 days',
      'Violations along OMR, ECR corridors',
      'CAG: 40% of approved buildings violate some norm',
    ],
    board_composition_en: 'Member-Secretary (IAS), Technical Director; Housing Dept Secretary as Commissioner',
    auditor_en: 'C&AG + Statutory Auditor',
    last_audit_year: 2023,
    rti_nodal_en: 'Public Information Officer, CMDA, Thalamuthu Natarajan Maaligai, Gandhi Irwin Road, Chennai-8',
    website_url: 'https://www.cmdachennai.gov.in',
    data_quality: 'available',
    data_source_en: 'CMDA Annual Report 2023; CAG Performance Audit; TNDRIP portal data',
  },
]

export function getEntitiesByType(type: EntityType): TNEntity[] {
  return TN_ENTITIES.filter(e => e.entity_type === type)
}

export function getEntitiesByDept(deptId: string): TNEntity[] {
  return TN_ENTITIES.filter(e => e.parent_dept_id === deptId)
}

export function getEntityBySlug(slug: string): TNEntity | undefined {
  return TN_ENTITIES.find(e => e.slug === slug)
}

export function getProfitableEntities(): TNEntity[] {
  return TN_ENTITIES.filter(e => e.annual_profit_loss_cr > 0)
}

export function getLossMakingEntities(): TNEntity[] {
  return TN_ENTITIES.filter(e => e.annual_profit_loss_cr < 0)
}
