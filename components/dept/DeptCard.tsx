'use client'
import Link from 'next/link'
import { Department } from '@/types'
import { formatCr } from '@/lib/departments'

const TYPE_LABEL: Record<string, string> = {
  welfare: 'Welfare · நலன்',
  revenue: 'Revenue · வருவாய்',
  infrastructure: 'Infrastructure · கட்டமைப்பு',
  administration: 'Administration · நிர்வாகம்',
}

const TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  welfare: { bg: '#EEF2FA', color: '#0C447C' },
  revenue: { bg: '#F2F8F4', color: '#1A5C38' },
  infrastructure: { bg: '#FDF6EC', color: '#946010' },
  administration: { bg: '#F0EEE9', color: '#6E6E68' },
}

export default function DeptCard({ dept }: { dept: Department }) {
  const tc = TYPE_COLOR[dept.dept_type]

  return (
    <Link href={`/dept/${dept.id}`} style={{
      border: '0.5px solid var(--border)',
      borderRadius: '12px',
      padding: '18px',
      background: 'var(--bg)',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'block',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-2)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
            {dept.name_en}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>
            {dept.name_ta}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
          {dept.flag_count_red > 0 && (
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px', background: 'var(--flag-red-bg)', color: 'var(--flag-red)' }}>
              {dept.flag_count_red} ⚑
            </span>
          )}
          {dept.flag_count_amber > 0 && (
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px', background: 'var(--flag-amber-bg)', color: 'var(--flag-amber)' }}>
              {dept.flag_count_amber} ⚠
            </span>
          )}
          {dept.flag_count_green > 0 && (
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '10px', background: 'var(--flag-green-bg)', color: 'var(--flag-green)' }}>
              {dept.flag_count_green} ✓
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        <div style={{ background: 'var(--bg-2)', borderRadius: '6px', padding: '8px 10px' }}>
          <div style={{ fontSize: '9px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Budget</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 500, color: 'var(--ink)' }}>{formatCr(dept.budget_cr)}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: '6px', padding: '8px 10px' }}>
          <div style={{ fontSize: '9px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Revenue</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 500, color: 'var(--flag-green)' }}>{formatCr(dept.revenue_cr)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
        <span style={{ padding: '2px 7px', borderRadius: '10px', fontSize: '10px', fontWeight: 500, background: tc.bg, color: tc.color }}>
          {TYPE_LABEL[dept.dept_type]}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>Explore →</span>
      </div>
    </Link>
  )
}
