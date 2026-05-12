// Master ETL pipeline configuration for Sengonnmai data refresh.
// Each pipeline entry defines a data source, update frequency, transform target, and validation rules.

export type PipelineFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on_event'

export type PipelineStatus = 'active' | 'manual_only' | 'planned' | 'deprecated'

export type DataSource = {
  id: string
  name: string
  url: string
  format: 'html' | 'pdf' | 'json' | 'csv' | 'xml' | 'gazette_pdf'
  auth_required: boolean
  rate_limit_note?: string
}

export type ValidationRule = {
  field: string
  rule: 'required' | 'numeric' | 'positive' | 'year_range' | 'enum' | 'non_empty_string'
  params?: Record<string, unknown>
}

export type Pipeline = {
  id: string
  name: string
  description: string
  sources: DataSource[]
  target_file: string
  target_export: string
  frequency: PipelineFrequency
  status: PipelineStatus
  last_run_note: string
  validation: ValidationRule[]
  transform_notes: string[]
  rti_fallback: string
}

export const PIPELINES: Pipeline[] = [
  {
    id: 'budget-annual',
    name: 'TN Budget Demands for Grants',
    description: 'Annual budget figures per department from TN Finance Dept pink book and detailed demands.',
    sources: [
      {
        id: 'tn-finance-budget',
        name: 'TN Finance Dept — Budget Publications',
        url: 'https://finance.tn.gov.in/budget',
        format: 'pdf',
        auth_required: false,
        rate_limit_note: 'Published once per year in February/March',
      },
    ],
    target_file: 'lib/departments.ts',
    target_export: 'DEPARTMENTS[*].budget_cr',
    frequency: 'annual',
    status: 'manual_only',
    last_run_note: 'Updated for 2024-25 budget; next refresh Feb 2026',
    validation: [
      { field: 'budget_cr', rule: 'positive' },
      { field: 'budget_cr', rule: 'numeric' },
    ],
    transform_notes: [
      'Extract Major Head-wise expenditure from Detailed Demands for Grants',
      'Map Major Head numbers to dept IDs in DEPT_MAJOR_HEAD_MAP',
      'Convert from lakhs (PDF) to crores (×0.01)',
      'Use Revised Estimates if Actuals not yet published',
    ],
    rti_fallback: 'File RTI with TN Finance Dept (PIO) for department-wise budget allocation',
  },
  {
    id: 'scheme-beneficiaries',
    name: 'Scheme Beneficiary & DBT Data',
    description: 'Quarterly update of beneficiary counts and DBT amounts from PFMS and scheme portals.',
    sources: [
      {
        id: 'pfms-dbt',
        name: 'PFMS DBT Dashboard',
        url: 'https://pfms.nic.in/NewDefaultHome.aspx',
        format: 'html',
        auth_required: false,
        rate_limit_note: 'Public dashboard; scrape with 2s delay between requests',
      },
      {
        id: 'dbt-bharath',
        name: 'DBT Bharat — TN State Data',
        url: 'https://dbtbharat.gov.in',
        format: 'html',
        auth_required: false,
      },
    ],
    target_file: 'lib/schemes-data.ts',
    target_export: 'ALL_SCHEMES[*].beneficiaries_claimed',
    frequency: 'quarterly',
    status: 'planned',
    last_run_note: 'Manual only; quarterly automation planned for v4',
    validation: [
      { field: 'beneficiaries_claimed', rule: 'non_empty_string' },
    ],
    transform_notes: [
      'Map scheme IDs to PFMS scheme codes (maintain separate lookup table)',
      'Prefer "verified beneficiaries" over "applications received"',
      'Flag if claimed vs verified gap >20% (add rti_needed: true)',
      'Round to nearest lakh for display; store exact in comments',
    ],
    rti_fallback: 'RTI to nodal department: "beneficiary-wise list of disbursements under [scheme] for 2024-25"',
  },
  {
    id: 'gazette-timeline',
    name: 'TN Gazette Weekly Scraper',
    description: 'Scrape TN Official Gazette for new orders, GOs, and policy announcements to add to timeline.',
    sources: [
      {
        id: 'tn-gazette',
        name: 'Tamil Nadu e-Gazette',
        url: 'https://gazette.tn.gov.in',
        format: 'gazette_pdf',
        auth_required: false,
        rate_limit_note: 'New issues published Tuesday/Friday; scrape Thursday/Monday',
      },
    ],
    target_file: 'lib/timeline-data.ts',
    target_export: 'TN_TIMELINE',
    frequency: 'weekly',
    status: 'planned',
    last_run_note: 'Manual curation only; automation planned for v4',
    validation: [
      { field: 'year', rule: 'year_range', params: { min: 1947, max: 2030 } },
      { field: 'event_en', rule: 'non_empty_string' },
      { field: 'category', rule: 'enum', params: { values: ['political', 'policy', 'economic', 'social', 'infrastructure', 'legal', 'disaster'] } },
    ],
    transform_notes: [
      'Extract GO number, department, date, and subject from gazette PDF header',
      'Classify category using keyword matching (see GAZETTE_CATEGORY_KEYWORDS)',
      'Generate event_ta using DeepL or Google Translate API (verify manually)',
      'Only add events with significance ≥ medium (filter out routine administrative orders)',
      'Cite as: source_en = "TN Gazette [Part/Issue] No.[X], dated [date]"',
    ],
    rti_fallback: 'All Gazette issues are public documents; no RTI needed',
  },
  {
    id: 'entity-financials',
    name: 'PSU & Entity Annual Reports',
    description: 'Annual financial data from entity annual reports and CAG audit reports.',
    sources: [
      {
        id: 'cag-tn',
        name: 'CAG Report — TN PSUs',
        url: 'https://cag.gov.in/en/audit-report?year=&state=Tamil+Nadu',
        format: 'pdf',
        auth_required: false,
      },
      {
        id: 'mca-filings',
        name: 'MCA21 Company Filings',
        url: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
        format: 'html',
        auth_required: false,
        rate_limit_note: 'Use CIN lookup; 1 request per 3s',
      },
    ],
    target_file: 'lib/entities-data.ts',
    target_export: 'TN_ENTITIES[*].annual_revenue_cr, annual_profit_loss_cr',
    frequency: 'annual',
    status: 'manual_only',
    last_run_note: 'Updated from CAG TN 2022-23 report; next update after CAG 2023-24 release (~Oct 2025)',
    validation: [
      { field: 'annual_revenue_cr', rule: 'positive' },
      { field: 'employees', rule: 'positive' },
      { field: 'last_audit_year', rule: 'year_range', params: { min: 2018, max: 2030 } },
    ],
    transform_notes: [
      'Prefer CAG figures over entity self-reported (CAG is independently audited)',
      'Revenue = operating revenue only (exclude grants/subsidies in notes)',
      'Profit/loss = net profit after tax from P&L statement',
      'Update data_quality: "available" if from audited annual report, "estimated" if from press/budget',
    ],
    rti_fallback: 'RTI to entity PIO or parent dept for latest annual report and audited accounts',
  },
  {
    id: 'staff-vacancy',
    name: 'Staff Sanctioned vs Filled',
    description: 'Staff strength data from TN Public Service Commission and department vacancy circulars.',
    sources: [
      {
        id: 'tnpsc',
        name: 'TNPSC Annual Report',
        url: 'https://www.tnpsc.gov.in/annualreports.html',
        format: 'pdf',
        auth_required: false,
      },
      {
        id: 'finance-establishment',
        name: 'TN Finance Dept Establishment Returns',
        url: 'https://finance.tn.gov.in',
        format: 'pdf',
        auth_required: false,
      },
    ],
    target_file: 'lib/departments.ts',
    target_export: 'DEPARTMENTS[*].total_staff_sanctioned, total_staff_filled',
    frequency: 'annual',
    status: 'manual_only',
    last_run_note: 'Data from TNPSC Annual Report 2022-23; significant vacancies in health/education',
    validation: [
      { field: 'total_staff_sanctioned', rule: 'positive' },
      { field: 'total_staff_filled', rule: 'positive' },
    ],
    transform_notes: [
      'Filled ≤ Sanctioned always (validate this constraint)',
      'Distinguish permanent vs contract staff (contract in contract_staff_count field)',
      'Vacancy % = (Sanctioned - Filled) / Sanctioned × 100',
    ],
    rti_fallback: 'RTI to TN Personnel & Administrative Reforms Dept for department-wise vacancy position',
  },
  {
    id: 'election-results',
    name: 'Election Commission Results',
    description: 'Assembly and Lok Sabha election results for performance comparison pages.',
    sources: [
      {
        id: 'eci',
        name: 'Election Commission of India — ECI Results',
        url: 'https://results.eci.gov.in',
        format: 'html',
        auth_required: false,
      },
    ],
    target_file: 'lib/timeline-data.ts',
    target_export: 'TN_TIMELINE (political events)',
    frequency: 'on_event',
    status: 'manual_only',
    last_run_note: 'Next TN Assembly election due 2026; Lok Sabha 2029',
    validation: [
      { field: 'year', rule: 'year_range', params: { min: 1947, max: 2030 } },
    ],
    transform_notes: [
      'Record winning party, CM-elect, seat count, and vote share',
      'Add to timeline as category: "political", significance: "high"',
    ],
    rti_fallback: 'ECI results are publicly available; no RTI needed',
  },
]

// Keyword map for Gazette category auto-classification
export const GAZETTE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  political:      ['chief minister', 'cabinet', 'government formation', 'election', 'assembly dissolution'],
  policy:         ['G.O. Ms.', 'scheme', 'policy', 'guidelines', 'rules', 'notification', 'amendment'],
  economic:       ['budget', 'tax', 'GST', 'duty', 'tariff', 'subsidy', 'incentive', 'industrial policy'],
  social:         ['reservation', 'welfare', 'pension', 'scholarship', 'women', 'child', 'labour'],
  infrastructure: ['road', 'bridge', 'metro', 'port', 'airport', 'power plant', 'water supply', 'TANGEDCO'],
  legal:          ['High Court', 'Supreme Court', 'ordinance', 'legislation', 'act', 'tribunal'],
  disaster:       ['cyclone', 'flood', 'drought', 'relief', 'SDRF', 'disaster', 'earthquake'],
}

// Department Major Head mapping (subset — extend as needed)
export const DEPT_MAJOR_HEAD_MAP: Record<string, number[]> = {
  health:               [2210, 2211, 2212],
  education:            [2202, 2203, 2204],
  agriculture:          [2401, 2402, 2403],
  'public-works':       [2059, 3054, 5054],
  police:               [2055],
  revenue:              [2029, 2030],
  finance:              [2047, 2048, 2049],
  welfare:              [2235],
  'rural-development':  [2505, 2506, 2515],
  housing:              [2216, 4216],
}
