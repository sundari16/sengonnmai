export type DeptType = 'welfare' | 'revenue' | 'infrastructure' | 'administration' | 'social'
export type SchemeType = 'central' | 'state' | 'centrally_sponsored'
export type SchemeStatus = 'active' | 'renamed' | 'shelved' | 'extended' | 'new'

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
}

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
}

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
}

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

export type OutcomeMetric = {
  id: string
  label_en: string
  label_ta: string
  official_target: string
  actual_value: string
  source: string
  source_url: string
  trend: 'up' | 'down' | 'flat'
}

export type SourceProps = {
  org: string
  document: string
  year: string
  url: string
}
