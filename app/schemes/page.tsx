'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_SCHEMES, getSchemesByType } from '@/lib/schemes-data'
import { DEPARTMENTS } from '@/lib/departments'
import { Scheme, SchemeType, SchemeStatus } from '@/types'

const SCHEME_TYPE_LABELS: Record<SchemeType, { en: string; ta: string; color: string }> = {
  central: { en: 'Central', ta: 'மத்திய', color: '#1A3C6E' },
  state: { en: 'State', ta: 'மாநில', color: '#1A4731' },
  centrally_sponsored: { en: 'Centrally Sponsored', ta: 'மத்திய-மாநில', color: '#7A3B00' },
}

const STATUS_LABELS: Record<SchemeStatus, { label: string; bg: string; fg: string }> = {
  active: { label: 'Active', bg: '#D1FAE5', fg: '#065F46' },
  new: { label: 'New', bg: '#DBEAFE', fg: '#1E40AF' },
  extended: { label: 'Extended', bg: '#FEF3C7', fg: '#92400E' },
  renamed: { label: 'Renamed', bg: '#EDE9FE', fg: '#5B21B6' },
  shelved: { label: 'Shelved', bg: '#F3F4F6', fg: '#6B7280' },
}

const DEPT_OPTIONS = [
  { id: 'all', label_en: 'All Departments', label_ta: 'அனைத்து துறைகள்' },
  ...DEPARTMENTS.map(d => ({ id: d.id, label_en: d.name_en, label_ta: d.name_ta })),
]

const TYPE_OPTIONS: { id: 'all' | SchemeType; label_en: string; label_ta: string }[] = [
  { id: 'all', label_en: 'All Types', label_ta: 'அனைத்து வகை' },
  { id: 'state', label_en: 'State', label_ta: 'மாநில' },
  { id: 'central', label_en: 'Central', label_ta: 'மத்திய' },
  { id: 'centrally_sponsored', label_en: 'Centrally Sponsored', label_ta: 'மத்திய-மாநில' },
]

function StatusBadge({ status }: { status: SchemeStatus }) {
  const s = STATUS_LABELS[status]
  return (
    <span style={{ background: s.bg, color: s.fg, fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {s.label}
    </span>
  )
}

function TypePill({ type }: { type: SchemeType }) {
  const t = SCHEME_TYPE_LABELS[type]
  return (
    <span style={{ background: t.color, color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {t.en}
    </span>
  )
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const dept = DEPARTMENTS.find(d => d.id === scheme.dept_id)
  return (
    <Link href={`/schemes/${scheme.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article style={{
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '1.25rem',
        background: '#fff',
        transition: 'box-shadow 0.15s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        {/* Top row: type pill + status badge */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <TypePill type={scheme.scheme_type} />
          <StatusBadge status={scheme.status} />
        </div>

        {/* Name */}
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, lineHeight: 1.35, color: 'var(--ink, #0F172A)' }}>
            {scheme.name_en}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--serif, Georgia, serif)' }}>
            {scheme.name_ta}
          </p>
        </div>

        {/* Dept tag */}
        {dept && (
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
            {dept.name_en}
          </p>
        )}

        {/* Eligibility */}
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#374151', lineHeight: 1.5, flex: 1 }}>
          {scheme.eligibility_en.length > 120
            ? scheme.eligibility_en.slice(0, 120) + '…'
            : scheme.eligibility_en}
        </p>

        {/* Bottom: origin + beneficiaries */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
            Since {scheme.origin_year} · {scheme.origin_party}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent, #1A4731)', textAlign: 'right' }}>
            {scheme.beneficiaries_claimed}
          </span>
        </div>
      </article>
    </Link>
  )
}

export default function SchemesPage() {
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | SchemeType>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return ALL_SCHEMES.filter(s => {
      if (deptFilter !== 'all' && s.dept_id !== deptFilter) return false
      if (typeFilter !== 'all' && s.scheme_type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.name_en.toLowerCase().includes(q) && !s.name_ta.includes(q) && !s.eligibility_en.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [deptFilter, typeFilter, search])

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 0.9rem',
    borderRadius: 20,
    border: active ? '2px solid var(--accent, #1A4731)' : '2px solid #E5E7EB',
    background: active ? 'var(--accent, #1A4731)' : '#fff',
    color: active ? '#fff' : '#374151',
    fontSize: '0.78rem',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <nav style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.75rem' }}>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.4rem' }}>›</span>
          <span style={{ color: 'var(--ink, #0F172A)' }}>Schemes</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Government Schemes
        </h1>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#6B7280' }}>
          அரசு திட்டங்கள் — {ALL_SCHEMES.length} schemes across {DEPARTMENTS.length} departments
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search schemes… (e.g. health, women, housing)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '0.55rem 0.9rem',
            border: '1px solid #D1D5DB',
            borderRadius: 8,
            fontSize: '0.85rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Type filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {TYPE_OPTIONS.map(t => (
          <button key={t.id} onClick={() => setTypeFilter(t.id)} style={pillStyle(typeFilter === t.id)}>
            {t.label_en}
          </button>
        ))}
      </div>

      {/* Dept filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
        {DEPT_OPTIONS.map(d => (
          <button key={d.id} onClick={() => setDeptFilter(d.id)} style={pillStyle(deptFilter === d.id)}>
            {d.label_en}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: '#6B7280' }}>
        Showing {filtered.length} of {ALL_SCHEMES.length} schemes
        {(deptFilter !== 'all' || typeFilter !== 'all' || search) && (
          <button
            onClick={() => { setDeptFilter('all'); setTypeFilter('all'); setSearch('') }}
            style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: 'var(--accent, #1A4731)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Clear filters
          </button>
        )}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9CA3AF' }}>
          <p style={{ fontSize: '1.1rem' }}>No schemes match your filters.</p>
          <button
            onClick={() => { setDeptFilter('all'); setTypeFilter('all'); setSearch('') }}
            style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent, #1A4731)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {filtered.map(s => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: '3rem', padding: '1.25rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Understanding Scheme Types</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {Object.entries(SCHEME_TYPE_LABELS).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', minWidth: 220 }}>
              <span style={{ background: val.color, color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap', marginTop: 2 }}>
                {val.en}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                {key === 'central' && '100% funded & operated by Central Govt'}
                {key === 'state' && '100% funded & operated by Tamil Nadu'}
                {key === 'centrally_sponsored' && 'Joint Central + State funding (typically 60:40)'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
