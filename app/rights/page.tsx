'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_ENTITLEMENTS } from '@/lib/entitlements-data'
import { DEPARTMENTS } from '@/lib/departments'
import { Entitlement } from '@/types'

const DEPT_OPTIONS = [
  { id: 'all', label_en: 'All Departments', label_ta: 'அனைத்து துறைகள்' },
  ...DEPARTMENTS.filter(d => ALL_ENTITLEMENTS.some(e => e.dept_id === d.id))
    .map(d => ({ id: d.id, label_en: d.name_en, label_ta: d.name_ta })),
]

function TimelineBadge({ days }: { days: number }) {
  const label = days === 0 ? 'Immediate' : `${days} days`
  const bg = days === 0 ? '#D1FAE5' : days <= 30 ? '#DBEAFE' : '#FEF3C7'
  const fg = days === 0 ? '#065F46' : days <= 30 ? '#1E40AF' : '#92400E'
  return (
    <span style={{ background: bg, color: fg, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function EntitlementCard({ ent }: { ent: Entitlement }) {
  const [open, setOpen] = useState(false)
  const dept = DEPARTMENTS.find(d => d.id === ent.dept_id)

  return (
    <article style={{
      border: '1px solid #E5E7EB',
      borderLeft: '4px solid var(--accent, #1A4731)',
      borderRadius: 8,
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '1.1rem 1.25rem', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.4rem' }}>
            {dept && (
              <span style={{ fontSize: '0.7rem', color: '#6B7280', border: '1px solid #E5E7EB', padding: '1px 7px', borderRadius: 4 }}>
                {dept.name_en}
              </span>
            )}
            <TimelineBadge days={ent.timeline_days} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink, #0F172A)', lineHeight: 1.35 }}>
            {ent.title_en}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--serif, Georgia, serif)' }}>
            {ent.title_ta}
          </p>
        </div>
        <span style={{ fontSize: '1.1rem', color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {/* What you get — always visible */}
      <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid #F3F4F6' }}>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.88rem', color: '#374151', lineHeight: 1.6 }}>
          {ent.what_you_get_en}
        </p>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: '#6B7280', fontFamily: 'var(--serif, Georgia, serif)', lineHeight: 1.6 }}>
          {ent.what_you_get_ta}
        </p>
      </div>

      {/* Expandable: how to claim + escalation + legal basis */}
      {open && (
        <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ padding: '0.9rem', background: '#F0FDF4', borderRadius: 8 }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              How to claim
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#064E3B', lineHeight: 1.6 }}>
              {ent.how_to_claim_en}
            </p>
          </div>

          <div style={{ padding: '0.9rem', background: '#FEF3C7', borderRadius: 8 }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              If denied — escalate
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F', lineHeight: 1.6 }}>
              {ent.escalation_en}
            </p>
          </div>

          <div style={{ padding: '0.75rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <p style={{ margin: '0 0 0.15rem', fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Legal basis
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--mono, monospace)' }}>
              {ent.legal_basis}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

export default function RightsPage() {
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return ALL_ENTITLEMENTS.filter(e => {
      if (deptFilter !== 'all' && e.dept_id !== deptFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!e.title_en.toLowerCase().includes(q) && !e.what_you_get_en.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [deptFilter, search])

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
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <nav style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.75rem' }}>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.4rem' }}>›</span>
          <span style={{ color: 'var(--ink, #0F172A)' }}>Your Rights</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Your Rights as a Tamil Nadu Citizen
        </h1>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#6B7280' }}>
          தமிழ்நாடு குடிமகனாக உங்கள் உரிமைகள் — {ALL_ENTITLEMENTS.length} legally-grounded entitlements
        </p>
      </div>

      {/* Explainer box */}
      <div style={{ padding: '1.1rem 1.25rem', background: '#F0FDF4', borderRadius: 8, borderLeft: '4px solid #1A4731', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 0.4rem', fontSize: '0.9rem', fontWeight: 700, color: '#064E3B' }}>
          These are entitlements — not favours
        </h2>
        <p style={{ margin: 0, fontSize: '0.83rem', color: '#374151', lineHeight: 1.65 }}>
          The items below are rights backed by law or government orders. You do not need to beg, bribe, or wait indefinitely for them.
          Each card shows what you are owed, how to claim it, and how to escalate if you are denied.
          If you believe data here is wrong, <Link href="/about" style={{ color: '#1A4731', fontWeight: 600 }}>file a dispute</Link>.
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search entitlements… (e.g. health, education, women)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 480,
            padding: '0.55rem 0.9rem',
            border: '1px solid #D1D5DB', borderRadius: 8,
            fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Dept filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
        {DEPT_OPTIONS.map(d => (
          <button key={d.id} onClick={() => setDeptFilter(d.id)} style={pillStyle(deptFilter === d.id)}>
            {d.label_en}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: '#6B7280' }}>
        Showing {filtered.length} of {ALL_ENTITLEMENTS.length} entitlements
        {(deptFilter !== 'all' || search) && (
          <button
            onClick={() => { setDeptFilter('all'); setSearch('') }}
            style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: 'var(--accent, #1A4731)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Clear filters
          </button>
        )}
      </p>

      {/* Entitlement list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9CA3AF' }}>
          <p style={{ fontSize: '1.1rem' }}>No entitlements match your filters.</p>
          <button
            onClick={() => { setDeptFilter('all'); setSearch('') }}
            style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent, #1A4731)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(e => <EntitlementCard key={e.id} ent={e} />)}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: '3rem', padding: '1.25rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Disclaimer</h3>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.65 }}>
          Sengonnmai aggregates entitlements from government orders, Acts, and scheme notifications. This is not legal advice.
          Timelines are statutory — actual delivery may differ. If an entitlement is missing or wrong, <Link href="/about" style={{ color: 'var(--accent, #1A4731)' }}>dispute it</Link>.
        </p>
      </div>
    </main>
  )
}
