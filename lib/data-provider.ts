// Single source of truth for all page data.
// All pages read from here. When ETL loads Supabase, switch queries here only.

import { ALL_SCHEMES } from './schemes-data'
import { DEPARTMENTS } from './departments'
import { TN_TIMELINE } from './timeline-data'
import { TN_ENTITIES } from './entities-data'
import type { Scheme, Department } from '@/types'

export const DataProvider = {

  // ── SCHEMES ─────────────────────────────────────────────────────

  getAllSchemes: (): Scheme[] => ALL_SCHEMES ?? [],

  getSchemesByDept: (deptId: string): Scheme[] =>
    (ALL_SCHEMES ?? []).filter(s =>
      s.dept_id === deptId ||
      (s.implementing_depts ?? []).includes(deptId)
    ),

  getSchemesByType: (type: string): Scheme[] =>
    (ALL_SCHEMES ?? []).filter(s => s.scheme_type === type),

  getActiveSchemes: (): Scheme[] =>
    (ALL_SCHEMES ?? []).filter(s => s.status === 'active' || s.status === 'extended'),

  getSchemeById: (id: string): Scheme | undefined =>
    (ALL_SCHEMES ?? []).find(s => s.id === id),

  searchSchemes: (query: string): Scheme[] => {
    const q = query.toLowerCase()
    return (ALL_SCHEMES ?? []).filter(s =>
      s.name_en?.toLowerCase().includes(q) ||
      s.name_ta?.includes(query) ||
      s.eligibility_en?.toLowerCase().includes(q)
    )
  },

  getSchemeCounts: () => ({
    total: (ALL_SCHEMES ?? []).length,
    central: (ALL_SCHEMES ?? []).filter(s => s.scheme_type === 'central').length,
    state: (ALL_SCHEMES ?? []).filter(s => s.scheme_type === 'state').length,
    css: (ALL_SCHEMES ?? []).filter(s => s.scheme_type === 'centrally_sponsored').length,
    active: (ALL_SCHEMES ?? []).filter(s => s.status === 'active' || s.status === 'extended').length,
  }),

  // ── DEPARTMENTS ──────────────────────────────────────────────────

  getAllDepts: (): Department[] => DEPARTMENTS ?? [],

  getDeptBySlug: (slug: string): Department | undefined =>
    (DEPARTMENTS ?? []).find(d => d.id === slug || d.slug === slug || d.code === slug.toUpperCase()),

  getDeptsByType: (type: string): Department[] =>
    type === 'all'
      ? (DEPARTMENTS ?? [])
      : (DEPARTMENTS ?? []).filter(d => d.dept_type === type),

  // ── TIMELINE ────────────────────────────────────────────────────

  getTimeline: () => TN_TIMELINE ?? [],

  getTimelineByCategory: (cat: string) =>
    (TN_TIMELINE ?? []).filter(e => e.category === cat),

  // ── ENTITIES ────────────────────────────────────────────────────

  getAllEntities: () => TN_ENTITIES ?? [],

  getEntityById: (id: string) =>
    (TN_ENTITIES ?? []).find(e => e.id === id),
}

export default DataProvider
