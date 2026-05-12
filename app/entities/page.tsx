'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import { TN_ENTITIES, getProfitableEntities, getLossMakingEntities } from '@/lib/entities-data'

const STATUS_COLOR: Record<string, string> = {
  profitable: '#1A5C38',
  operational: '#946010',
  loss_making: '#B83232',
  under_restructuring: '#555',
}

const TYPE_LABEL: Record<string, string> = {
  state_psu:            'State PSU',
  central_psu:          'Central PSU',
  statutory_body:       'Statutory Body',
  development_authority: 'Development Authority',
  cooperative:          'Cooperative',
  special_purpose_vehicle: 'SPV',
}

export default function EntitiesPage() {
  const profitable = getProfitableEntities()
  const lossMaking = getLossMakingEntities()
  const totalRevenue = TN_ENTITIES.reduce((s, e) => s + e.annual_revenue_cr, 0)
  const totalPnL = TN_ENTITIES.reduce((s, e) => s + e.annual_profit_loss_cr, 0)
  const totalStaff = TN_ENTITIES.reduce((s, e) => s + e.employees, 0)

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--ink)' }}>
          Tamil Nadu — Public Entities & PSUs
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு பொதுத்துறை நிறுவனங்கள்
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', margin: '0 0 2rem', maxWidth: 600, lineHeight: 1.7 }}>
          State and central public sector undertakings, statutory bodies, and development authorities operating in Tamil Nadu.
          Financial figures from official annual reports and CAG audits.
        </p>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Entities profiled', value: TN_ENTITIES.length },
            { label: 'Combined revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K Cr` },
            { label: 'Net P&L', value: `${totalPnL < 0 ? '−' : '+'}₹${Math.abs(totalPnL / 1000).toFixed(1)}K Cr` },
            { label: 'Total employees', value: `${(totalStaff / 1000).toFixed(0)}K` },
            { label: 'Profitable', value: profitable.length },
            { label: 'Loss-making', value: lossMaking.length },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem' }}>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.7rem', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 700, margin: 0, fontFamily: 'var(--mono)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Entity cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {TN_ENTITIES.map(entity => {
            const isLoss = entity.annual_profit_loss_cr < 0
            return (
              <a key={entity.id} href={`/entities/${entity.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem',
                  background: 'var(--bg)', transition: 'border-color 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                }}>
                  {/* Left: name + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <span style={{
                        background: 'var(--bg-2)', border: '1px solid var(--border)',
                        borderRadius: 3, padding: '0.15rem 0.5rem', fontSize: '0.7rem', color: 'var(--ink-3)',
                      }}>{TYPE_LABEL[entity.entity_type]}</span>
                      <span style={{
                        color: STATUS_COLOR[entity.status],
                        fontSize: '0.7rem', fontWeight: 600,
                      }}>● {entity.status.replace('_', ' ')}</span>
                    </div>
                    <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.1rem' }}>
                      {entity.acronym} — {entity.name_en}
                    </p>
                    <p style={{ color: 'var(--ink-3)', fontSize: '0.78rem', margin: 0 }}>{entity.name_ta}</p>
                    <p style={{ color: 'var(--ink-2)', fontSize: '0.82rem', margin: '0.4rem 0 0', lineHeight: 1.5 }}>
                      {entity.mandate_en.slice(0, 120)}…
                    </p>
                  </div>

                  {/* Right: financials */}
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 110 }}>
                    <p style={{ color: 'var(--ink-3)', fontSize: '0.7rem', margin: '0 0 0.15rem' }}>Revenue</p>
                    <p style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'var(--mono)', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>
                      ₹{entity.annual_revenue_cr.toLocaleString('en-IN')} Cr
                    </p>
                    <p style={{ color: isLoss ? '#B83232' : '#1A5C38', fontWeight: 600, fontFamily: 'var(--mono)', fontSize: '0.85rem', margin: 0 }}>
                      {isLoss ? '−' : '+'}₹{Math.abs(entity.annual_profit_loss_cr).toLocaleString('en-IN')} Cr
                    </p>
                    <p style={{ color: 'var(--ink-4)', fontSize: '0.7rem', margin: '0.15rem 0 0' }}>
                      {entity.employees.toLocaleString('en-IN')} staff
                    </p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', margin: '2rem 0 0', lineHeight: 1.6 }}>
          Data from official annual reports and CAG audit reports. Financial figures are approximate and may vary by reporting period.
          File RTI for latest audited figures from respective entity.
        </p>
      </main>
    </>
  )
}
