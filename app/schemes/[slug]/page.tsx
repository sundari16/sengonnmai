'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'
import { getSchemeBySlug, getSchemesByDept } from '@/lib/schemes-data'
import { DEPARTMENTS } from '@/lib/departments'
import { Scheme, SchemeType, SchemeStatus } from '@/types'

const SCHEME_TYPE_META: Record<SchemeType, { label_en: string; label_ta: string; color: string; description: string }> = {
  central: {
    label_en: 'Central Government Scheme',
    label_ta: 'மத்திய அரசு திட்டம்',
    color: '#1A3C6E',
    description: '100% funded and operated by the Central Government. Tamil Nadu implements but does not set the rules.',
  },
  state: {
    label_en: 'State Government Scheme',
    label_ta: 'மாநில அரசு திட்டம்',
    color: '#1A4731',
    description: '100% funded and operated by Tamil Nadu. Rules, eligibility, and implementation are set by the state.',
  },
  centrally_sponsored: {
    label_en: 'Centrally Sponsored Scheme',
    label_ta: 'மத்திய-மாநில திட்டம்',
    color: '#7A3B00',
    description: 'Joint Central + State scheme — typically 60% Central / 40% State funding. States have limited flexibility to modify rules.',
  },
}

const STATUS_META: Record<SchemeStatus, { label: string; bg: string; fg: string; note?: string }> = {
  active: { label: 'Active', bg: '#D1FAE5', fg: '#065F46' },
  new: { label: 'New (2024)', bg: '#DBEAFE', fg: '#1E40AF', note: 'Recently launched — implementation may still be rolling out.' },
  extended: { label: 'Extended', bg: '#FEF3C7', fg: '#92400E', note: 'Scope or eligibility extended from original design.' },
  renamed: { label: 'Renamed', bg: '#EDE9FE', fg: '#5B21B6', note: 'This scheme was renamed — same programme, different branding.' },
  shelved: { label: 'Shelved', bg: '#F3F4F6', fg: '#6B7280', note: 'No longer accepting new applications.' },
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ margin: '0.25rem 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink, #0F172A)', lineHeight: 1.3 }}>{value}</p>
      {sub && <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#9CA3AF' }}>{sub}</p>}
    </div>
  )
}

function Section({ title, title_ta, children }: { title: string; title_ta: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: '2.5rem' }}>
      <div style={{ borderBottom: '2px solid var(--accent, #1A4731)', paddingBottom: '0.4rem', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>{title}</h2>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--serif, Georgia, serif)' }}>{title_ta}</p>
      </div>
      {children}
    </section>
  )
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{
        minWidth: 28, height: 28, borderRadius: '50%',
        background: 'var(--accent, #1A4731)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
      }}>{n}</span>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', lineHeight: 1.55 }}>{text}</p>
    </div>
  )
}

export default function SchemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const scheme = getSchemeBySlug(slug)

  if (!scheme) notFound()

  const dept = DEPARTMENTS.find(d => d.id === scheme.dept_id)
  const typeMeta = SCHEME_TYPE_META[scheme.scheme_type]
  const statusMeta = STATUS_META[scheme.status]
  const relatedSchemes = getSchemesByDept(scheme.dept_id).filter(s => s.id !== scheme.id).slice(0, 3)

  const steps = scheme.how_to_apply_en
    .split(/\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10)

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/schemes" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Schemes</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--ink, #0F172A)' }}>{scheme.name_en}</span>
      </nav>

      {/* Hero */}
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            background: typeMeta.color, color: '#fff',
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {typeMeta.label_en}
          </span>
          <span style={{
            background: statusMeta.bg, color: statusMeta.fg,
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {statusMeta.label}
          </span>
          {dept && (
            <Link href={`/dept/${dept.slug}`} style={{
              fontSize: '0.72rem', color: '#6B7280', textDecoration: 'none',
              border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: 4,
            }}>
              {dept.name_en} ↗
            </Link>
          )}
        </div>

        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--ink, #0F172A)' }}>
          {scheme.name_en}
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '1rem', color: '#6B7280', fontFamily: 'var(--serif, Georgia, serif)' }}>
          {scheme.name_ta}
        </p>

        {statusMeta.note && (
          <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: statusMeta.bg, borderRadius: 6, display: 'inline-block' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: statusMeta.fg }}>{statusMeta.note}</p>
          </div>
        )}

        {scheme.parent_scheme_en && (
          <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: '#FEF3C7', borderRadius: 6 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400E' }}>
              <strong>Origin note:</strong> {scheme.parent_scheme_en}
            </p>
          </div>
        )}
      </header>

      {/* Key stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        <InfoBox label="Beneficiaries" value={scheme.beneficiaries_claimed} />
        <InfoBox label="Funding" value={scheme.funding_ratio_en} />
        <InfoBox label="Started" value={String(scheme.origin_year)} sub={`by ${scheme.origin_party}`} />
        <InfoBox label="Scheme type" value={typeMeta.label_en} sub={typeMeta.label_ta} />
      </div>

      {/* Scheme type explainer */}
      <div style={{ marginTop: '1rem', padding: '0.9rem 1rem', background: '#F0FDF4', borderRadius: 8, borderLeft: `4px solid ${typeMeta.color}` }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#374151' }}>
          <strong style={{ color: typeMeta.color }}>What this means:</strong> {typeMeta.description}
        </p>
      </div>

      {/* Eligibility */}
      <Section title="Who is eligible?" title_ta="யார் தகுதியானவர்?">
        <div style={{ padding: '1.25rem', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#064E3B', lineHeight: 1.7 }}>
            {scheme.eligibility_en}
          </p>
        </div>
        <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', fontFamily: 'var(--serif, Georgia, serif)', lineHeight: 1.7 }}>
            {scheme.eligibility_ta}
          </p>
        </div>
      </Section>

      {/* How to apply */}
      <Section title="How to apply" title_ta="எப்படி விண்ணப்பிக்கலாம்?">
        <div>
          {steps.map((step, i) => (
            <Step key={i} n={i + 1} text={step.endsWith('.') ? step : step + '.'} />
          ))}
        </div>

        <div style={{ marginTop: '1rem', padding: '0.9rem 1rem', background: '#FEF3C7', borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400E' }}>
            <strong>Note:</strong> Always carry original documents and photocopies. Application is free — do not pay touts or agents.
          </p>
        </div>
      </Section>

      {/* Funding & origin */}
      <Section title="Funding & origin" title_ta="நிதியும் தோற்றமும்">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Funding split
            </p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink, #0F172A)' }}>{scheme.funding_ratio_en}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#6B7280' }}>
              {scheme.scheme_type === 'state' && 'TN bears the full cost from state tax revenues.'}
              {scheme.scheme_type === 'central' && 'Central Govt bears the full cost — TN handles delivery only.'}
              {scheme.scheme_type === 'centrally_sponsored' && 'If Central releases funds late, TN may not be able to disburse on time.'}
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Launched
            </p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--ink, #0F172A)' }}>{scheme.origin_year}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#6B7280' }}>
              By {scheme.origin_party}
            </p>
          </div>
        </div>
      </Section>

      {/* Source citation */}
      <Section title="Data source" title_ta="தரவு மூலம்">
        <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#374151' }}>Official scheme portal / notification</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--mono, monospace)', wordBreak: 'break-all' }}>
              {scheme.source_url}
            </p>
          </div>
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.45rem 0.9rem',
              background: 'var(--accent, #1A4731)',
              color: '#fff',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Official site ↗
          </a>
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#9CA3AF' }}>
          Sengonnmai aggregates public data for transparency. Beneficiary figures are government-claimed and may not be independently verified.
          If you find an error, <Link href="/about" style={{ color: 'var(--accent, #1A4731)' }}>dispute it here</Link>.
        </p>
      </Section>

      {/* Related schemes */}
      {relatedSchemes.length > 0 && (
        <Section title="Other schemes from this department" title_ta="இதே துறையின் மற்ற திட்டங்கள்">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedSchemes.map(s => (
              <Link key={s.id} href={`/schemes/${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  padding: '0.9rem 1rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  background: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'box-shadow 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink, #0F172A)' }}>{s.name_en}</p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#6B7280' }}>{s.beneficiaries_claimed}</p>
                  </div>
                  <span style={{
                    background: SCHEME_TYPE_META[s.scheme_type].color, color: '#fff',
                    fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>
                    {SCHEME_TYPE_META[s.scheme_type].label_en.split(' ')[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/schemes" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--accent, #1A4731)', textDecoration: 'none', fontWeight: 600 }}>
            ← View all schemes
          </Link>
        </Section>
      )}
    </main>
  )
}
