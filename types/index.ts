// ── CORE ENTITY TYPES ────────────────────────────────────────────

export type DeptType =
  | 'welfare'
  | 'revenue'
  | 'infrastructure'
  | 'administration'
  | 'social'
  | 'legal'

export type SchemeType = 'central' | 'state' | 'centrally_sponsored'

export type SchemeStatus = 'active' | 'renamed' | 'shelved' | 'extended' | 'new'

export type DataQuality = 'available' | 'estimated' | 'not_available' | 'rti_needed' | 'verified'

export type CadreType =
  | 'IAS'
  | 'IPS'
  | 'IFS'
  | 'state_service'
  | 'subordinate'
  | 'honorary'
  | 'elected'
  | 'contract'
  | 'deputation'

// ── DEPARTMENT ───────────────────────────────────────────────────

export type Department = {
  id: string
  code: string
  name_en: string
  name_ta: string
  slug: string
  dept_type: DeptType
  established_year: number
  purpose_en: string
  purpose_ta: string
  citizens_served_en: string
  citizens_served_ta: string
  budget_cr: number
  revenue_cr: number
  central_funding_pct: number
  state_funding_pct: number
  total_staff_sanctioned: number
  total_staff_filled: number
  current_secretary_en: string
  flag_count_red: number
  flag_count_amber: number
  flag_count_green: number
  description_en?: string
  description_ta?: string
  // v2 additions
  established_by_en?: string
  founding_legislation?: string
  mandate_evolution_en?: string
  directly_serves_citizens?: boolean
  contract_staff_count?: number
  contract_staff_note_en?: string
  current_secretary_title_en?: string
  inter_dept_dependencies?: string[]
  nodal_dept_for?: string[]
  website_url?: string
  pio_designation_en?: string
  pio_designation_ta?: string
  budget_data_quality?: DataQuality
  budget_source_note?: string
}

// ── ORG LEVEL ────────────────────────────────────────────────────

export type OrgLevel = {
  id: string
  dept_id: string
  level: number
  designation_en: string
  designation_ta: string
  cadre: CadreType
  recruitment_body: string
  pay_min: number
  pay_max: number
  sanctioned_posts: number
  filled_posts: number
  data_quality_staffing: DataQuality
  citizen_facing: boolean
  decision_powers_en: string[]
  decision_limitations_en: string[]
  for_citizen_problem_en: string
  transfer_authority: string
  typical_tenure_months: number
  source: string
}

// ── MINISTER ─────────────────────────────────────────────────────

export type Minister = {
  id: string
  dept_id: string
  name_en: string
  name_ta: string
  party: string
  tenure_start: string
  tenure_end: string
  cm_name_en: string
  notable_policies_en: string
  source: string
  dates_approximate: boolean
}

// ── SCHEME ───────────────────────────────────────────────────────

export type Scheme = {
  id: string
  name_en: string
  name_ta: string
  dept_id: string
  scheme_type: SchemeType
  status: SchemeStatus
  funding_ratio_en: string
  origin_year: number
  origin_party: string
  beneficiaries_claimed: string
  eligibility_en: string
  eligibility_ta: string
  how_to_apply_en: string
  source_url: string
  parent_scheme_en?: string
  // v2 additions
  implementing_depts?: string[]
  funding_centre_pct?: number
  funding_state_pct?: number
  funding_note_en?: string
  origin_go_number?: string
  parent_scheme_id?: string
  parent_scheme_name_en?: string
  continuity_type?: string
  beneficiaries_verified?: string
  eligibility_ta_v2?: string
  how_to_apply_ta?: string
  documents_required?: string[]
  portal_url?: string
  rti_needed?: boolean
}

// ── FLAG ─────────────────────────────────────────────────────────

export type Flag = {
  id: string
  severity: 'red' | 'amber' | 'green'
  title_en: string
  title_ta: string
  body_en: string
  body_ta: string
  source_org: string
  source_doc: string
  source_year: string
  source_url: string
  // v2 additions
  dept_id?: string
  flag_category?:
    | 'budget_gap'
    | 'vacancy'
    | 'audit_finding'
    | 'data_not_published'
    | 'target_not_met'
    | 'announcement_no_action'
    | 'scheme_continuity'
    | 'tender_pattern'
    | 'confirmed_delivery'
}

// ── ENTITLEMENT ──────────────────────────────────────────────────

export type EscalationStep = {
  step: number
  officer_designation: string
  timeline_days: number
  how_to_reach: string
}

export type Entitlement = {
  id: string
  dept_id: string
  title_en: string
  title_ta: string
  what_you_get_en: string
  what_you_get_ta: string
  timeline_days: number
  legal_basis: string
  how_to_claim_en: string
  escalation_en: string
  // v2 additions
  how_to_claim_ta?: string
  escalation_path?: EscalationStep[]
  rti_template_en?: string
  source_url?: string
}

// ── PROCESS / WORKFLOW ───────────────────────────────────────────

export type Process = {
  id: string
  name_en: string
  name_ta: string
  official_steps: string[]
  official_days: number
  reality_days: number
  stall_point_en: string
  documents_required: string[]
  portal_url?: string
}

export type CitizenProcess = {
  id: string
  dept_id: string
  name_en: string
  name_ta: string
  official_steps: string[]
  official_days: number
  real_world_days: number
  stall_point_en: string
  stall_point_ta: string
  stall_reason_en: string
  documents_required: string[]
  documents_unofficially_demanded: string[]
  portal_url: string
  fee_official: number
  source: string
  rti_note_en: string
}

// ── OUTCOME METRIC ───────────────────────────────────────────────

export type OutcomeMetric = {
  id: string
  label_en: string
  label_ta: string
  official_target: string
  actual_value: string
  source: string
  source_url: string
  trend: 'up' | 'down' | 'flat' | 'improving' | 'declining' | 'stable' | 'unknown'
  // v2 additions
  dept_id?: string
  comparison_national?: string
  year?: string
  data_quality?: DataQuality
}

// ── TENDER SIGNAL ────────────────────────────────────────────────

export type TenderSignal = {
  id: string
  dept_id: string
  tender_ref: string
  description_en: string
  estimated_value_cr: number
  awarded_value_cr: number
  bid_count: number
  signal_type: 'single_bid' | 'cost_overrun' | 'timeline_overrun' | 'repeat_contractor'
  signal_note_en: string
  source: string
  source_url: string
  tntenders_url: string
}

// ── LEGAL APPOINTMENTS ───────────────────────────────────────────

export type LegalAppointment = {
  id: string
  designation: string
  appointment_basis: string
  appointing_authority: string
  tenure_en: string
  fee_structure_en: string
  cases_handled_en: string
  source: string
  data_quality: DataQuality
  rti_note_en: string
}

// ── CONTRACT WORKER ──────────────────────────────────────────────

export type ContractWorkerCategory = {
  id: string
  dept_id: string
  role_en: string
  role_ta: string
  count_approximate: number
  pay_range_en: string
  vs_permanent_pay_en: string
  job_security_en: string
  services_they_deliver_en: string
  source: string
  data_quality: DataQuality
}

// ── PERFORMANCE METRIC ───────────────────────────────────────────

export type PerformanceMetric = {
  id: string
  year: number
  metric_en: string
  metric_ta: string
  value: string
  unit: string
  source: string
  source_url: string
  data_quality: DataQuality
  era: '1947_1991' | '1991_present'
  category: 'economy' | 'fiscal' | 'social' | 'education' | 'health' | 'infrastructure'
  cm_name: string
  party: string
}

// ── LOCAL GOVERNMENT ─────────────────────────────────────────────

export type LocalBodyType =
  | 'corporation'
  | 'municipality'
  | 'town_panchayat'
  | 'panchayat_union'
  | 'district_panchayat'
  | 'village_panchayat'

export type LocalBody = {
  id: string
  type: LocalBodyType
  name_en: string
  name_ta: string
  district: string
  population: number
  budget_cr: number
  budget_year: string
  key_functions_en: string[]
  schemes_implemented: string[]
  elected_members: number
  permanent_staff: number
  contract_staff: number
  website_url: string
  source_url: string
  data_quality: DataQuality
}

// ── MP / MLA FUND ────────────────────────────────────────────────

export type MPFund = {
  mp_name: string
  constituency: string
  district: string
  party: string
  allocation_cr: number
  utilised_cr: number
  year: string
  projects_sanctioned: number
  projects_completed: number
  projects_pending: number
  source_url: string
}

export type MLAFund = {
  mla_name: string
  constituency: string
  district: string
  party: string
  allocation_cr: number
  utilised_cr: number
  year: string
  source_url: string
  data_quality: DataQuality
}

// ── EDUCATIONAL INSTITUTION ──────────────────────────────────────

export type EducationalInstitution = {
  id: string
  name_en: string
  name_ta: string
  type: 'school' | 'college' | 'university' | 'polytechnic' | 'iti'
  control: 'govt' | 'govt_aided' | 'autonomous' | 'deemed'
  district: string
  established_year: number
  faculty_sanctioned: number
  faculty_filled: number
  students_enrolled: number
  appointment_process_en: string
  ugc_norms_compliant: boolean
  annual_grant_cr: number
  source: string
  data_quality: DataQuality
}

// ── RTI DISCLAIMER ───────────────────────────────────────────────

export type RTIDisclaimerProps = {
  dept_name_en: string
  dept_name_ta: string
  pio_designation: string
  information_type_en: string
  template_en: string
  template_ta: string
  filing_fee: number
  response_days: number
  appeal_body: string
}

// ── SOURCE CITATION ──────────────────────────────────────────────

export type SourceProps = {
  org: string
  document: string
  year: string
  url: string
}
