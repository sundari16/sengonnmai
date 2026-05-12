'use client'
// Embeddable widget — renders a compact scheme/dept/entity card for embedding on external sites.
// Usage: <EmbedWidget type="scheme" id="magalir-urimai" />
// Standalone embed URL: /embed/scheme/magalir-urimai

import { ALL_SCHEMES } from '@/lib/schemes-data'
import { DEPARTMENTS } from '@/lib/departments'
import { TN_ENTITIES } from '@/lib/entities-data'

type WidgetType = 'scheme' | 'department' | 'entity'

type EmbedWidgetProps = {
  type: WidgetType
  id: string
  compact?: boolean
}

export default function EmbedWidget({ type, id, compact = false }: EmbedWidgetProps) {
  if (type === 'scheme') {
    const scheme = ALL_SCHEMES.find(s => s.id === id || s.id === id.replace(/-/g, '_'))
    if (!scheme) return <EmbedError message={`Scheme not found: ${id}`} />
    return (
      <div style={widgetStyle(compact)}>
        <div style={headerStyle('#1A3C6E', '#EBF3FF')}>
          <span style={badgeStyle}>Scheme</span>
          <span style={{ fontSize: '0.68rem', color: '#1A3C6E', fontWeight: 600 }}>{scheme.scheme_type}</span>
        </div>
        <div style={bodyStyle}>
          <p style={titleStyle}>{scheme.name_en}</p>
          <p style={subtitleStyle}>{scheme.name_ta}</p>
          {!compact && (
            <>
              <p style={metaStyle}>{scheme.eligibility_en.slice(0, 120)}…</p>
              <p style={metaStyle}><strong>Beneficiaries:</strong> {scheme.beneficiaries_claimed}</p>
              <p style={metaStyle}><strong>How to apply:</strong> {scheme.how_to_apply_en.slice(0, 100)}…</p>
            </>
          )}
        </div>
        <div style={footerStyle}>
          <a href={`https://sengonnmai.in/schemes/${scheme.id}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            View full details →
          </a>
          <span style={{ color: '#999', fontSize: '0.65rem' }}>sengonnmai.in</span>
        </div>
      </div>
    )
  }

  if (type === 'department') {
    const dept = DEPARTMENTS.find(d => d.slug === id || d.id === id)
    if (!dept) return <EmbedError message={`Department not found: ${id}`} />
    return (
      <div style={widgetStyle(compact)}>
        <div style={headerStyle('#1A5C38', '#F2F8F4')}>
          <span style={{ ...badgeStyle, background: '#1A5C38', color: '#fff' }}>Department</span>
        </div>
        <div style={bodyStyle}>
          <p style={titleStyle}>{dept.name_en}</p>
          <p style={subtitleStyle}>{dept.name_ta}</p>
          {!compact && (
            <>
              <p style={metaStyle}>{dept.purpose_en.slice(0, 120)}…</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={metaStyle}><strong>Budget:</strong> ₹{dept.budget_cr.toLocaleString('en-IN')} Cr</span>
                <span style={metaStyle}><strong>Staff:</strong> {dept.total_staff_filled.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
        </div>
        <div style={footerStyle}>
          <a href={`https://sengonnmai.in/dept/${dept.slug}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            View department →
          </a>
          <span style={{ color: '#999', fontSize: '0.65rem' }}>sengonnmai.in</span>
        </div>
      </div>
    )
  }

  if (type === 'entity') {
    const entity = TN_ENTITIES.find(e => e.slug === id || e.id === id)
    if (!entity) return <EmbedError message={`Entity not found: ${id}`} />
    const isLoss = entity.annual_profit_loss_cr < 0
    return (
      <div style={widgetStyle(compact)}>
        <div style={headerStyle('#946010', '#FDF6EC')}>
          <span style={{ ...badgeStyle, background: '#946010', color: '#fff' }}>PSU / Entity</span>
          <span style={{ fontSize: '0.68rem', color: '#946010', fontWeight: 600 }}>{entity.entity_type.replace(/_/g, ' ')}</span>
        </div>
        <div style={bodyStyle}>
          <p style={titleStyle}>{entity.acronym} — {entity.name_en}</p>
          <p style={subtitleStyle}>{entity.name_ta}</p>
          {!compact && (
            <>
              <p style={metaStyle}>{entity.mandate_en.slice(0, 100)}…</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={metaStyle}><strong>Revenue:</strong> ₹{entity.annual_revenue_cr.toLocaleString('en-IN')} Cr</span>
                <span style={{ ...metaStyle, color: isLoss ? '#B83232' : '#1A5C38', fontWeight: 600 }}>
                  {isLoss ? '−' : '+'}₹{Math.abs(entity.annual_profit_loss_cr).toLocaleString('en-IN')} Cr
                </span>
              </div>
            </>
          )}
        </div>
        <div style={footerStyle}>
          <a href={`https://sengonnmai.in/entities/${entity.slug}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            View entity →
          </a>
          <span style={{ color: '#999', fontSize: '0.65rem' }}>sengonnmai.in</span>
        </div>
      </div>
    )
  }

  return <EmbedError message="Unknown widget type" />
}

function EmbedError({ message }: { message: string }) {
  return (
    <div style={{ border: '1px solid #fca5a5', background: '#fef2f2', borderRadius: 6, padding: '0.75rem 1rem', fontFamily: 'sans-serif', fontSize: '0.82rem', color: '#991b1b' }}>
      Widget error: {message}
    </div>
  )
}

// ── Shared styles ────────────────────────────────────────────────

function widgetStyle(compact: boolean): React.CSSProperties {
  return {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: compact ? 280 : 420,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }
}

function headerStyle(color: string, bg: string): React.CSSProperties {
  return {
    background: bg,
    borderBottom: `1px solid ${color}22`,
    padding: '0.5rem 0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
}

const badgeStyle: React.CSSProperties = {
  background: '#1A3C6E',
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 700,
  padding: '0.1rem 0.4rem',
  borderRadius: 3,
}

const bodyStyle: React.CSSProperties = {
  padding: '0.75rem 0.875rem',
  background: '#fff',
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 0.1rem',
  fontWeight: 700,
  fontSize: '0.9rem',
  color: '#111827',
  lineHeight: 1.4,
}

const subtitleStyle: React.CSSProperties = {
  margin: '0 0 0.5rem',
  fontSize: '0.78rem',
  color: '#6b7280',
}

const metaStyle: React.CSSProperties = {
  margin: '0 0 0.25rem',
  fontSize: '0.78rem',
  color: '#374151',
  lineHeight: 1.5,
}

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 0.875rem',
  background: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
}

const linkStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color: '#1A3C6E',
  fontWeight: 600,
  textDecoration: 'none',
}
