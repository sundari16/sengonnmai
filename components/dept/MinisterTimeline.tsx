'use client'

import type { Minister } from '@/types'

function tenureMonths(start: string, end: string): number {
  const s = new Date(start)
  const e = end === 'present' ? new Date() : new Date(end)
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 30.4))
}

type Props = {
  ministers: Minister[]
  deptName: string
}

export default function MinisterTimeline({ ministers, deptName }: Props) {
  const earliest = ministers[0]?.tenure_start?.slice(0, 4) ?? '1967'
  const totalMonths = ministers.reduce((sum, m) => sum + tenureMonths(m.tenure_start, m.tenure_end), 0)
  const avgTenure = ministers.length ? Math.round(totalMonths / ministers.length) : 0

  return (
    <div>
      <div style={{
        overflowX: 'auto',
        paddingBottom: '1rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          minWidth: 'max-content',
          paddingBottom: '0.5rem',
        }}>
          {ministers.map((m) => {
            const months = tenureMonths(m.tenure_start, m.tenure_end)
            return (
              <div key={m.id} style={{
                border: '1px solid #E2DED6',
                borderRadius: '6px',
                padding: '0.875rem 1rem',
                background: '#fff',
                minWidth: '200px',
                maxWidth: '220px',
                flexShrink: 0,
              }}>
                <p style={{ fontWeight: 700, color: '#111110', margin: '0 0 0.1rem', fontSize: '0.9rem' }}>
                  {m.name_en}
                </p>
                <p style={{ color: '#6E6E68', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                  {m.name_ta}
                </p>

                <span style={{
                  display: 'inline-block',
                  background: '#F0EEE9',
                  color: '#3A3A36',
                  borderRadius: '3px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem',
                }}>{m.party}</span>

                <p style={{ color: '#3A3A36', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>
                  {m.tenure_start.slice(0, 4)}–{m.tenure_end === 'present' ? 'present' : m.tenure_end.slice(0, 4)}
                  {' '}· {months} months
                </p>
                <p style={{ color: '#6E6E68', fontSize: '0.78rem', margin: '0 0 0.25rem' }}>
                  Under: {m.cm_name_en}
                </p>
                {m.notable_policies_en && (
                  <p style={{
                    color: '#6E6E68',
                    fontSize: '0.78rem',
                    margin: '0.25rem 0 0',
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                  }}>{m.notable_policies_en}</p>
                )}
                {m.dates_approximate && (
                  <p style={{
                    color: '#A0A09A',
                    fontSize: '0.72rem',
                    margin: '0.25rem 0 0',
                  }}>* Dates approximate</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        background: '#F8F7F4',
        border: '1px solid #E2DED6',
        borderRadius: '6px',
        padding: '0.875rem 1rem',
        marginTop: '0.75rem',
      }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#3A3A36' }}>
            <strong>{ministers.length}</strong> ministers since {earliest}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#3A3A36' }}>
            Average tenure: <strong>{avgTenure} months</strong> per minister
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#6E6E68', margin: 0, lineHeight: 1.5 }}>
          Note: Short ministerial tenure can affect policy continuity.
          This is an observation from the data, not an assessment of performance.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#A0A09A', margin: '0.5rem 0 0' }}>
          Source: TN Assembly records · tn.gov.in · Gazette
        </p>
      </div>
    </div>
  )
}
