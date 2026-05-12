'use client'
import { useParams } from 'next/navigation'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import RTITooltip from '@/components/ui/RTITooltip'
import SourceCitation from '@/components/ui/SourceCitation'
import { getEntityBySlug, TN_ENTITIES } from '@/lib/entities-data'

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  profitable:        { label: 'Profitable', color: '#1A5C38', bg: '#F2F8F4' },
  operational:       { label: 'Operational', color: '#946010', bg: '#FDF6EC' },
  loss_making:       { label: 'Loss-making', color: '#B83232', bg: '#FDF2F2' },
  under_restructuring: { label: 'Restructuring', color: '#555', bg: '#F5F5F3' },
}

const TYPE_LABEL: Record<string, string> = {
  state_psu:            'State PSU',
  central_psu:          'Central PSU',
  statutory_body:       'Statutory Body',
  development_authority: 'Development Authority',
  cooperative:          'Cooperative',
  special_purpose_vehicle: 'Special Purpose Vehicle',
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--ink-3)', fontSize: '0.82rem', width: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function PnLBar({ revenue, profitLoss }: { revenue: number; profitLoss: number }) {
  const isProfit = profitLoss >= 0
  const pct = revenue > 0 ? Math.min(Math.abs(profitLoss) / revenue * 100, 100) : 0
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', margin: '0 0 0.5rem' }}>Revenue vs {isProfit ? 'Profit' : 'Loss'}</p>
      <div style={{ position: 'relative', height: 32, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'var(--bg-2)' }} />
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: `${pct}%`, height: '100%',
          background: isProfit ? '#1A5C38' : '#B83232',
          opacity: 0.7,
          transition: 'width 0.4s',
        }} />
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: '0.78rem', color: 'var(--ink)', fontWeight: 600,
        }}>
          {isProfit ? '+' : ''}₹{Math.abs(profitLoss).toLocaleString('en-IN')} Cr {isProfit ? 'profit' : 'loss'} on ₹{revenue.toLocaleString('en-IN')} Cr revenue
        </span>
      </div>
    </div>
  )
}

export default function EntityPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const entity = getEntityBySlug(slug)

  if (!entity) {
    return (
      <>
        <Topbar />
        <Nav />
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--ink)' }}>Entity not found</h1>
          <p style={{ color: 'var(--ink-3)' }}>No entity found for "{slug}". <a href="/entities" style={{ color: 'var(--accent)' }}>View all entities →</a></p>
        </main>
      </>
    )
  }

  const statusMeta = STATUS_META[entity.status] ?? STATUS_META.operational

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '0.2rem 0.6rem', fontSize: '0.75rem', color: 'var(--ink-3)',
            }}>{TYPE_LABEL[entity.entity_type]}</span>
            <span style={{
              background: statusMeta.bg, color: statusMeta.color,
              borderRadius: 4, padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600,
            }}>{statusMeta.label}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            {entity.name_en}
          </h1>
          <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem', margin: '0 0 0.25rem' }}>{entity.name_ta}</p>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', margin: 0 }}>
            Est. {entity.established_year} · Registered under: {entity.registered_under_en}
          </p>
        </div>

        {/* P&L Visual */}
        <PnLBar revenue={entity.annual_revenue_cr} profitLoss={entity.annual_profit_loss_cr} />

        {/* Key stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { label: 'Annual Revenue', value: `₹${entity.annual_revenue_cr.toLocaleString('en-IN')} Cr` },
            { label: entity.annual_profit_loss_cr >= 0 ? 'Annual Profit' : 'Annual Loss', value: `₹${Math.abs(entity.annual_profit_loss_cr).toLocaleString('en-IN')} Cr` },
            { label: 'Employees', value: entity.employees.toLocaleString('en-IN') },
            { label: 'Parent Dept', value: entity.parent_dept_id.toUpperCase() },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem' }}>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.72rem', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 700, margin: 0, fontFamily: 'var(--mono)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Mandate */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>Mandate</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.75, margin: '0 0 0.5rem' }}>{entity.mandate_en}</p>
          <p style={{ color: 'var(--ink-3)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{entity.mandate_ta}</p>
        </section>

        {/* Citizen Services */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>Services to Citizens</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {entity.citizen_services_en.map((s, i) => (
              <li key={i} style={{ color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.6 }}>{s}</li>
            ))}
          </ul>
        </section>

        {/* Key Metrics */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>Key Metrics</h2>
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            {entity.key_metrics_en.map((m, i) => {
              const [label, ...rest] = m.split(':')
              const value = rest.join(':').trim()
              return value
                ? <MetricRow key={i} label={label} value={value} />
                : <div key={i} style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', color: 'var(--ink-2)', fontSize: '0.85rem' }}>{m}</div>
            })}
          </div>
        </section>

        {/* Controversies / Flags */}
        {entity.controversies_en && entity.controversies_en.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>Audit Findings & Concerns</h2>
            <div style={{ border: '1px solid #E8C97A', borderRadius: 6, background: '#FDF6EC', padding: '1rem 1.25rem' }}>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {entity.controversies_en.map((c, i) => (
                  <li key={i} style={{ color: '#6E6E68', fontSize: '0.85rem', lineHeight: 1.6 }}>{c}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Governance */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>Governance</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <MetricRow label="Board composition" value={entity.board_composition_en} />
            <MetricRow label="Statutory auditor" value={entity.auditor_en} />
            <MetricRow label="Last audit year" value={String(entity.last_audit_year)} />
            <MetricRow label="RTI contact" value={entity.rti_nodal_en} />
            <MetricRow label="Data quality" value={entity.data_quality === 'available' ? 'Official data' : entity.data_quality === 'estimated' ? 'Estimated' : 'Not published'} />
          </div>
        </section>

        {/* RTI */}
        <RTITooltip
          dept_name_en={entity.acronym}
          dept_name_ta={entity.name_ta}
          pio_designation={entity.rti_nodal_en}
          information_type_en={`Annual Report, audit findings, and financial statements of ${entity.acronym}`}
          template_en={`To,\nThe Public Information Officer,\n${entity.name_en}.\n\nSubject: Information under RTI Act 2005\n\nI request the following information:\n1. Annual Report for the last 3 financial years\n2. Profit/Loss statement and balance sheet\n3. Number of employees (permanent and contract) as on [date]\n4. All CAG audit reports for the last 3 years\n5. Board of Directors list with DIN numbers\n\nEnclosing ₹10 towards RTI fee.\n\nName:\nAddress:\nDate:`}
          template_ta={`பொது தகவல் அதிகாரி அவர்களுக்கு,\n${entity.name_ta}.\n\nபொருள்: RTI சட்டம் 2005 படி தகவல்\n\nகீழ்க்கண்ட தகவல்களை வழங்க கோருகிறேன்:\n1. கடந்த 3 நிதியாண்டுகளுக்கான ஆண்டு அறிக்கை\n2. லாப/நஷ்ட கணக்கு மற்றும் இருப்பு நிலை\n3. [தேதி] நிலவரப்படி ஊழியர்கள் எண்ணிக்கை\n4. கடந்த 3 ஆண்டுகளுக்கான CAG தணிக்கை அறிக்கைகள்\n\nRTI கட்டணம் ₹10 இணைக்கப்படுகிறது.`}
          filing_fee={10}
          response_days={30}
          appeal_body={`First Appellate Authority, ${entity.name_en}`}
        />

        {/* Sources */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 0.75rem', color: 'var(--ink)' }}>Sources</h2>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', lineHeight: 1.7, margin: '0 0 1rem' }}>{entity.data_source_en}</p>
        {entity.website_url && (
          <SourceCitation
            org={entity.acronym}
            document="Official website and annual reports"
            year={String(entity.last_audit_year)}
            url={entity.website_url}
          />
        )}

        {/* Related entities */}
        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>Other entities</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {TN_ENTITIES.filter(e => e.id !== entity.id).slice(0, 8).map(e => (
              <a key={e.id} href={`/entities/${e.slug}`} style={{
                padding: '0.3rem 0.75rem', border: '1px solid var(--border)', borderRadius: 4,
                fontSize: '0.8rem', color: 'var(--ink-2)', textDecoration: 'none',
                background: 'var(--bg)',
              }}>{e.acronym}</a>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
