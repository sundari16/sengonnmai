'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import DisputeButton from '@/components/ui/DisputeButton'
import {
  HEALTH_DEPT,
  HEALTH_SERVICES,
  HEALTH_SCHEMES,
  HEALTH_PROCESSES,
  HEALTH_METRICS,
  HEALTH_FLAGS,
  HEALTH_ENTITLEMENTS,
} from '@/lib/health-data'
import { DEPARTMENTS } from '@/lib/departments'
import { useState, useEffect } from 'react'

const SECTIONS = [
  { id: 'overview', label: 'What you get' },
  { id: 'services', label: 'Services' },
  { id: 'schemes', label: 'Schemes' },
  { id: 'access', label: 'How to access' },
  { id: 'funding', label: 'Funding' },
  { id: 'staff', label: 'Staff' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'rights', label: 'Your Rights' },
]

function formatCr(cr: number) {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(2)}L Cr`
  return `₹${cr.toLocaleString('en-IN')} Cr`
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '0.5px solid var(--border)', margin: 0 }} />
}

function SectionHead({ en, ta }: { en: string; ta: string }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{en}</h2>
      <div style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--ink-3)', marginTop: '4px' }}>{ta}</div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px 20px', flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'var(--flag-green-bg)', color: 'var(--flag-green)' },
    extended: { bg: 'var(--flag-green-bg)', color: 'var(--flag-green)' },
    new: { bg: '#E8F0FE', color: '#1A56DB' },
    renamed: { bg: 'var(--flag-amber-bg)', color: 'var(--flag-amber)' },
    shelved: { bg: 'var(--bg-3)', color: 'var(--ink-3)' },
  }
  const c = colors[status] || colors.active
  return (
    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: c.bg, color: c.color, textTransform: 'capitalize' }}>
      {status}
    </span>
  )
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Topbar />
      <Nav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--ink-3)', marginBottom: '1rem' }}>DEPARTMENT PROFILE</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '1rem' }}>{name}</h1>
          <p style={{ color: 'var(--ink-3)', maxWidth: '400px', lineHeight: 1.6 }}>
            Full department profile coming soon. We are sourcing and verifying data for this department.
          </p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to all departments
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DeptPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-15% 0px -65% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  if (slug !== 'health') {
    const dept = DEPARTMENTS.find(d => d.id === slug)
    return <ComingSoon name={dept?.name_en ?? slug} />
  }

  const dept = HEALTH_DEPT
  const vacancyCount = dept.total_staff_sanctioned - dept.total_staff_filled
  const vacancyPct = Math.round((vacancyCount / dept.total_staff_sanctioned) * 100)
  const centralSchemes = HEALTH_SCHEMES.filter(s => s.scheme_type === 'central' || s.scheme_type === 'centrally_sponsored')
  const stateSchemes = HEALTH_SCHEMES.filter(s => s.scheme_type === 'state')

  const W = 'clamp(1rem,4vw,3rem)'
  const sectionStyle: React.CSSProperties = { padding: `4rem ${W}`, maxWidth: '1100px', margin: '0 auto' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar />
      <Nav />

      {/* Anchor nav */}
      <div style={{ position: 'sticky', top: '60px', zIndex: 90, background: 'var(--bg)', borderBottom: '0.5px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: '1100px', margin: '0 auto', padding: `0 ${W}` }}>
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`#${id}`}
              onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                padding: '12px 16px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
                color: activeSection === id ? 'var(--accent)' : 'var(--ink-3)',
                borderBottom: activeSection === id ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'color 0.2s',
              }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* SECTION 1 — Overview */}
      <section id="overview" style={sectionStyle}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
          Est. {dept.established_year} · {dept.dept_type.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--ink)', margin: '0 0 4px 0' }}>
          {dept.name_en}
        </h1>
        <div style={{ fontFamily: 'var(--sans)', fontSize: '15px', color: 'var(--ink-3)', marginBottom: '2rem' }}>{dept.name_ta}</div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <StatCard label="Citizens served" value={dept.citizens_served_en} />
          <StatCard label="Budget 2024-25" value={formatCr(dept.budget_cr)} />
          <StatCard label="Staff on ground" value={`${dept.total_staff_filled.toLocaleString('en-IN')} / ${dept.total_staff_sanctioned.toLocaleString('en-IN')}`} sub={`${vacancyPct}% vacancy`} />
        </div>

        <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink)', maxWidth: '720px', marginBottom: '1rem' }}>{dept.purpose_en}</p>
        <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--ink-3)', maxWidth: '720px', marginBottom: '1.5rem' }}>{dept.purpose_ta}</p>
        <SourceCitation org="TN Health Dept" document="tnhealth.tn.gov.in" year="2024" url="https://tnhealth.tn.gov.in" />
      </section>

      <Divider />

      {/* SECTION 2 — Services */}
      <section id="services" style={sectionStyle}>
        <SectionHead en="What you can get from this department" ta="இந்தத் துறையிலிருந்து நீங்கள் என்ன பெறலாம்" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {HEALTH_SERVICES.map((svc, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px', background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px 20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>If you are</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-2)' }}>{svc.if_you_are_en}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>{svc.if_you_are_ta}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--flag-green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>You get</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{svc.you_get_en}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>{svc.you_get_ta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* SECTION 3 — Schemes */}
      <section id="schemes" style={sectionStyle}>
        <SectionHead en="Schemes under this department" ta="இந்தத் துறையின் கீழ் உள்ள திட்டங்கள்" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Central &amp; Centrally Sponsored</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {centralSchemes.map(s => (
                <div key={s.id} style={{ background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <StatusBadge status={s.status} />
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: '#E8F0FE', color: '#1A56DB' }}>Central</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{s.name_en}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '8px' }}>{s.name_ta}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)', background: 'var(--bg-2)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>{s.funding_ratio_en}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginBottom: '8px' }}>{s.eligibility_en}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SourceCitation org="TN Health Dept" document="Scheme records" year="2024" url={s.source_url} />
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>How to apply →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>State Schemes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stateSchemes.map(s => (
                <div key={s.id} style={{ background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <StatusBadge status={s.status} />
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: 'var(--flag-green-bg)', color: 'var(--flag-green)' }}>State</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{s.name_en}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '8px' }}>{s.name_ta}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)', background: 'var(--bg-2)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>{s.funding_ratio_en}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginBottom: '4px' }}>{s.eligibility_en}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '8px' }}>
                    Beneficiaries: {s.beneficiaries_claimed} · Started {s.origin_year}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SourceCitation org="TN Health Dept" document="Scheme records" year="2024" url={s.source_url} />
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>How to apply →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* SECTION 4 — Access */}
      <section id="access" style={sectionStyle}>
        <SectionHead en="How to actually access these services" ta="இந்த சேவைகளை எவ்வாறு பெறுவது" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {HEALTH_PROCESSES.map(proc => (
            <div key={proc.id} style={{ border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px', background: 'var(--bg)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{proc.name_en}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '16px' }}>{proc.name_ta}</div>
              <ol style={{ margin: '0 0 16px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {proc.official_steps.map((step, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{step}</li>
                ))}
              </ol>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, background: 'var(--flag-green-bg)', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--flag-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official timeline</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--flag-green)' }}>{proc.official_days === 0 ? 'Same day' : `${proc.official_days} days`}</div>
                </div>
                <div style={{ flex: 1, background: proc.reality_days > proc.official_days ? 'var(--flag-amber-bg)' : 'var(--flag-green-bg)', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '10px', color: proc.reality_days > proc.official_days ? 'var(--flag-amber)' : 'var(--flag-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real world</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: proc.reality_days > proc.official_days ? 'var(--flag-amber)' : 'var(--flag-green)' }}>
                    {proc.reality_days === 0 ? 'Same day' : `${proc.reality_days} days`}
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--flag-amber-bg)', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--flag-amber)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Where it typically stalls</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{proc.stall_point_en}</div>
              </div>
              {proc.documents_required.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Documents needed</div>
                  <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {proc.documents_required.map((doc, i) => (
                      <li key={i} style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              {proc.portal_url && (
                <a href={proc.portal_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
                  Official portal → {proc.portal_url}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* SECTION 5 — Funding */}
      <section id="funding" style={sectionStyle}>
        <SectionHead en="How this department is funded" ta="இந்தத் துறை எவ்வாறு நிதியளிக்கப்படுகிறது" />
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <StatCard label="Budget 2024-25" value={formatCr(dept.budget_cr)} />
          <StatCard label="Revenue generated" value={formatCr(dept.revenue_cr)} />
          <StatCard label="Central funding" value={`${dept.central_funding_pct}%`} />
          <StatCard label="State funding" value={`${dept.state_funding_pct}%`} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '8px' }}>Funding split</div>
          <div style={{ height: '28px', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${dept.central_funding_pct}%`, background: '#1A56DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>Centre {dept.central_funding_pct}%</span>
            </div>
            <div style={{ width: `${dept.state_funding_pct}%`, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>State {dept.state_funding_pct}%</span>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '16px 20px', marginBottom: '1.5rem', fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
          Of every ₹100 this department spends, <strong>₹{dept.central_funding_pct} comes from the Central government</strong> in Delhi and <strong>₹{dept.state_funding_pct} comes from the Tamil Nadu state budget</strong>.
        </div>
        <SourceCitation org="TN Budget 2024-25" document="tnbudget.tn.gov.in" year="2024" url="https://tnbudget.tn.gov.in" />
      </section>

      <Divider />

      {/* SECTION 6 — Staff */}
      <section id="staff" style={sectionStyle}>
        <SectionHead en="Who runs this department" ta="இந்தத் துறையை யார் நடத்துகிறார்கள்" />
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <StatCard label="Sanctioned posts" value={dept.total_staff_sanctioned.toLocaleString('en-IN')} />
          <StatCard label="Posts filled" value={dept.total_staff_filled.toLocaleString('en-IN')} />
          <StatCard label="Vacancy rate" value={`${vacancyPct}%`} sub={`${vacancyCount.toLocaleString('en-IN')} posts unfilled`} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '6px' }}>
            {dept.total_staff_filled.toLocaleString('en-IN')} filled · {vacancyCount.toLocaleString('en-IN')} vacant
          </div>
          <div style={{ height: '16px', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${100 - vacancyPct}%`, background: 'var(--flag-green)' }} />
            <div style={{ width: `${vacancyPct}%`, background: 'var(--flag-red)' }} />
          </div>
        </div>
        {vacancyPct > 15 && (
          <div style={{ background: 'var(--flag-red-bg)', border: '0.5px solid var(--flag-red)', borderRadius: '8px', padding: '12px 14px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--flag-red)', fontWeight: 600 }}>
              High vacancy rate — {vacancyPct}% of posts are unfilled. Services may be affected in some areas.
            </div>
          </div>
        )}
        <div style={{ background: 'var(--bg-2)', borderRadius: '10px', padding: '14px 18px', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Senior Officer</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{dept.current_secretary_en}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>Title only — no photo, no political context</div>
        </div>
        <SourceCitation org="TN Gazette · Assembly Q&A" document="Dept Annual Report" year="2024" url="https://tnassembly.gov.in" />
      </section>

      <Divider />

      {/* SECTION 7 — Outcomes */}
      <section id="outcomes" style={sectionStyle}>
        <SectionHead en="Is this department delivering?" ta="இந்தத் துறை கடமைகளை நிறைவேற்றுகிறதா?" />
        <div style={{ background: 'var(--bg-2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          We track official targets vs actual outcomes. No editorialising — the data speaks for itself.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {HEALTH_METRICS.map(m => {
            const isNotPublished = m.actual_value.toLowerCase().includes('not publicly')
            const trendColor = m.trend === 'up' ? 'var(--flag-green)' : m.trend === 'down' ? 'var(--flag-amber)' : 'var(--ink-3)'
            const trendBg = m.trend === 'up' ? 'var(--flag-green-bg)' : m.trend === 'down' ? 'var(--flag-amber-bg)' : 'var(--bg-3)'
            return (
              <div key={m.id} style={{ border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px', background: 'var(--bg)' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>{m.label_en}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '12px' }}>{m.label_ta}</div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1, background: 'var(--flag-green-bg)', borderRadius: '8px', padding: '10px 14px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--flag-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official target</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--flag-green)' }}>{m.official_target}</div>
                  </div>
                  <div style={{ flex: 1, background: trendBg, borderRadius: '8px', padding: '10px 14px' }}>
                    <div style={{ fontSize: '10px', color: trendColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actual</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: trendColor }}>{m.actual_value}</div>
                  </div>
                </div>
                {isNotPublished && (
                  <div style={{ background: 'var(--flag-red-bg)', borderRadius: '6px', padding: '8px 12px', marginBottom: '8px', fontSize: '12px', color: 'var(--flag-red)', fontWeight: 600 }}>
                    ⚑ Data not publicly disclosed — this is a transparency failure
                  </div>
                )}
                <SourceCitation org={m.source} document={m.source} year="2024" url={m.source_url} />
              </div>
            )
          })}
        </div>
      </section>

      <Divider />

      {/* SECTION 8 — Rights + Flags */}
      <section id="rights" style={sectionStyle}>
        <SectionHead en="Your rights + accountability" ta="உங்கள் உரிமைகள் மற்றும் பொறுப்புணர்வு" />

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Your legal rights from this department</h3>
          <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '8px' }}>உங்கள் சட்டப்பூர்வமான உரிமைகள்</div>
          <div style={{ background: 'var(--bg-2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.6 }}>
            These are not schemes. These are rights you can legally enforce. They do not change with governments.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {HEALTH_ENTITLEMENTS.map(ent => (
              <div key={ent.id} style={{ border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px', background: 'var(--bg)' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{ent.title_en}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '12px' }}>{ent.title_ta}</div>
                <div style={{ background: 'var(--flag-green-bg)', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--flag-green)', lineHeight: 1.6 }}>{ent.what_you_get_en}</div>
                  <div style={{ fontSize: '12px', color: 'var(--flag-green)', marginTop: '6px', opacity: 0.8 }}>{ent.what_you_get_ta}</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '8px' }}>
                  Timeline: <strong>Must be provided {ent.timeline_days === 0 ? 'immediately' : `within ${ent.timeline_days} days`}</strong>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)', background: 'var(--bg-2)', padding: '6px 10px', borderRadius: '4px', marginBottom: '12px' }}>
                  {ent.legal_basis}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginBottom: '8px' }}>
                  <strong>How to claim:</strong> {ent.how_to_claim_en}
                </div>
                <div style={{ background: 'var(--bg-3)', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', color: 'var(--ink-2)' }}>
                  <strong>If denied:</strong> {ent.escalation_en}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Accountability flags</h3>
          <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '1.5rem' }}>கண்காணிப்பு குறிகள்</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {HEALTH_FLAGS.map(flag => {
              const borderColor = flag.severity === 'red' ? 'var(--flag-red)' : flag.severity === 'amber' ? 'var(--flag-amber)' : 'var(--flag-green)'
              const bgColor = flag.severity === 'red' ? 'var(--flag-red-bg)' : flag.severity === 'amber' ? 'var(--flag-amber-bg)' : 'var(--flag-green-bg)'
              return (
                <div key={flag.id} style={{ borderLeft: `4px solid ${borderColor}`, background: bgColor, borderRadius: '0 10px 10px 0', padding: '16px 18px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{flag.title_en}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginBottom: '10px' }}>{flag.title_ta}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '12px' }}>{flag.body_en}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <SourceCitation org={flag.source_org} document={flag.source_doc} year={flag.source_year} url={flag.source_url} />
                    <DisputeButton flagId={flag.id} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div style={{ height: '4rem' }} />
    </div>
  )
}
