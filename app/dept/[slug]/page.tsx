'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import DisputeButton from '@/components/ui/DisputeButton'
import RTITooltip from '@/components/ui/RTITooltip'
import DecisionPowers from '@/components/ui/DecisionPowers'
import MinisterTimeline from '@/components/dept/MinisterTimeline'
import ContractWorkerNotice from '@/components/ui/ContractWorkerNotice'
import {
  HEALTH_DEPT,
  HEALTH_SERVICES,
  HEALTH_SCHEMES,
  HEALTH_PROCESSES,
  HEALTH_METRICS,
  HEALTH_FLAGS,
  HEALTH_ENTITLEMENTS,
  HEALTH_ORG_LEVELS,
  HEALTH_CONTRACT_WORKERS,
  HEALTH_LEGAL_APPOINTMENTS,
  HEALTH_MINISTERS,
} from '@/lib/health-data'
import { DEPARTMENTS } from '@/lib/departments'

// ── helpers ──────────────────────────────────────────────────────

function formatCr(cr: number) {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(2)}L Cr`
  return `₹${cr.toLocaleString('en-IN')} Cr`
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
}

function SectionHead({ en, ta }: { en: string; ta: string }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{en}</h2>
      <div style={{ fontSize: '0.875rem', color: 'var(--ink-3)', marginTop: '4px' }}>{ta}</div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '1rem 1.25rem', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function FlagCard({ flag }: { flag: { id: string; severity: string; title_en: string; title_ta: string; body_en: string; body_ta: string; source_org: string; source_doc: string; source_year: string; source_url: string } }) {
  const colors = {
    red: { border: 'var(--flag-red)', bg: 'var(--flag-red-bg)', label: 'Finding' },
    amber: { border: 'var(--flag-amber)', bg: 'var(--flag-amber-bg)', label: 'Note' },
    green: { border: 'var(--flag-green)', bg: 'var(--flag-green-bg)', label: 'Verified' },
  }
  const c = colors[flag.severity as 'red' | 'amber' | 'green']
  return (
    <div style={{ borderLeft: `4px solid ${c.border}`, background: c.bg, borderRadius: '0 6px 6px 0', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
      <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4, fontSize: '0.95rem' }}>{flag.title_en}</div>
      <div style={{ color: 'var(--ink-3)', fontSize: '0.82rem', marginBottom: 6 }}>{flag.title_ta}</div>
      <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{flag.body_en}</p>
      <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>
        Source: {flag.source_org} · {flag.source_doc} · {flag.source_year}
      </div>
    </div>
  )
}

function CadreTag({ cadre }: { cadre: string }) {
  const labels: Record<string, string> = {
    IAS: 'IAS', IPS: 'IPS', IFS: 'IFS',
    state_service: 'State Service', subordinate: 'Subordinate',
    honorary: 'Honorary', elected: 'Elected', contract: 'Contract', deputation: 'Deputation',
  }
  return (
    <span style={{
      display: 'inline-block',
      background: cadre === 'IAS' || cadre === 'IPS' ? '#F0EEE9' : '#F8F7F4',
      color: cadre === 'IAS' || cadre === 'IPS' ? '#1A4731' : '#6E6E68',
      border: '1px solid var(--border)',
      borderRadius: 3,
      padding: '0.1rem 0.45rem',
      fontSize: '0.72rem',
      fontWeight: 600,
    }}>{labels[cadre] ?? cadre}</span>
  )
}

// ── Section IDs ──────────────────────────────────────────────────

const SECTION_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'schemes', label: 'Schemes' },
  { id: 'access', label: 'Access' },
  { id: 'funding', label: 'Funding' },
  { id: 'staff', label: 'Staff' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'tenders', label: 'Tenders' },
  { id: 'ministers', label: 'Ministers' },
  { id: 'local', label: 'Local' },
  { id: 'rights', label: 'Rights' },
  { id: 'audit', label: 'Audit' },
  { id: 'legal', label: 'Legal' },
]

// ── Page ─────────────────────────────────────────────────────────

export default function DeptPage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const [activeSection, setActiveSection] = useState('overview')

  // For now Health is the only fully seeded dept
  const dept = slug === 'health' ? HEALTH_DEPT : DEPARTMENTS.find(d => d.slug === slug)
  if (!dept) return <div style={{ padding: '2rem' }}>Department not found.</div>

  const isHealth = slug === 'health'
  const services = isHealth ? HEALTH_SERVICES : []
  const schemes = isHealth ? HEALTH_SCHEMES : []
  const processes = isHealth ? HEALTH_PROCESSES : []
  const metrics = isHealth ? HEALTH_METRICS : []
  const flags = isHealth ? HEALTH_FLAGS : []
  const entitlements = isHealth ? HEALTH_ENTITLEMENTS : []
  const orgLevels = isHealth ? HEALTH_ORG_LEVELS : []
  const contractWorkers = isHealth ? HEALTH_CONTRACT_WORKERS : []
  const legalAppointments = isHealth ? HEALTH_LEGAL_APPOINTMENTS : []
  const ministers = isHealth ? HEALTH_MINISTERS : []

  const vacancyPct = dept.total_staff_sanctioned > 0
    ? Math.round(((dept.total_staff_sanctioned - dept.total_staff_filled) / dept.total_staff_sanctioned) * 100)
    : 0
  const activeSchemes = schemes.filter(s => s.status === 'active' || s.status === 'extended' || s.status === 'new')
  const perCitizenCr = 80000000 > 0 ? (dept.budget_cr / 80000000 * 10000000).toFixed(0) : '0'

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  useEffect(() => {
    const handler = () => {
      for (const s of [...SECTION_NAV].reverse()) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(s.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <Topbar />
      <Nav />

      {/* Sticky section nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto', whiteSpace: 'nowrap',
        padding: '0 max(1.5rem, 5vw)',
      }}>
        <div style={{ display: 'inline-flex', gap: '0' }}>
          {SECTION_NAV.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.75rem 0.875rem',
              fontSize: '0.82rem',
              fontFamily: 'var(--sans)',
              color: activeSection === s.id ? 'var(--accent)' : 'var(--ink-3)',
              fontWeight: activeSection === s.id ? 600 : 400,
              borderBottom: activeSection === s.id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'color 0.15s',
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 max(1.5rem,5vw) 4rem' }}>

        {/* ── SECTION 1: OVERVIEW ─────────────────────────────── */}
        <section id="overview" style={{ padding: '3rem 0 2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--ink)' }}>
            {dept.name_en}
          </h1>
          <p style={{ color: 'var(--ink-3)', fontSize: '1.05rem', margin: '0 0 0.75rem' }}>{dept.name_ta}</p>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
            <strong>Founded:</strong> {dept.established_year}
            {dept.founding_legislation && ` · ${dept.founding_legislation}`}
          </p>
          {dept.mandate_evolution_en && (
            <p style={{ color: 'var(--ink-3)', fontSize: '0.88rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
              {dept.mandate_evolution_en}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            <StatCard label="Citizens served" value={dept.citizens_served_en} />
            <StatCard label="Active schemes" value={String(activeSchemes.length)} />
            <StatCard label="Total staff" value={`${(dept.total_staff_filled / 1000).toFixed(0)}K / ${(dept.total_staff_sanctioned / 1000).toFixed(0)}K`} sub={`${vacancyPct}% posts vacant`} />
            <StatCard label="Budget 2024–25" value={formatCr(dept.budget_cr)} />
          </div>

          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1rem' }}>
            {dept.purpose_en}
          </p>
          <p style={{ color: 'var(--ink-3)', fontSize: '0.85rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
            {dept.purpose_ta}
          </p>

          {dept.inter_dept_dependencies && dept.inter_dept_dependencies.length > 0 && (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.85rem', margin: '0 0 0.3rem' }}>Works with:</p>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', margin: 0 }}>{dept.inter_dept_dependencies.join(' · ')}</p>
            </div>
          )}

          <SourceCitation org="TN Health Dept" document="Annual Report 2024" year="2024" url="https://www.tnhealth.tn.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 2: SERVICES ──────────────────────────────── */}
        <section id="services" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="What this department delivers to citizens"
            ta="இந்தத் துறை குடிமக்களுக்கு வழங்கும் சேவைகள்"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '0.75rem' }}>
            {services.map((s, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem', background: 'var(--bg)' }}>
                <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', margin: '0 0 0.4rem' }}>{s.if_you_are_en}</p>
                <p style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{s.you_get_en}</p>
                <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{s.you_get_ta}</p>
              </div>
            ))}
          </div>
          {services.length === 0 && (
            <RTITooltip
              dept_name_en={dept.name_en}
              dept_name_ta={dept.name_ta}
              pio_designation={dept.pio_designation_en ?? 'Public Information Officer'}
              information_type_en="Services delivered to citizens"
              template_en="To,\nThe PIO,\n[Department],\nGovernment of Tamil Nadu.\n\nPlease provide: list of services delivered directly to citizens."
              template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\n[துறை],\nதமிழ்நாடு அரசு.\n\nகுடிமக்களுக்கு நேரடியாக வழங்கப்படும் சேவைகளின் பட்டியல் வழங்கவும்."
              filing_fee={10}
              response_days={30}
              appeal_body="First Appellate Authority, department"
            />
          )}
        </section>

        <Divider />

        {/* ── SECTION 3: SCHEMES ───────────────────────────────── */}
        <section id="schemes" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Schemes from this department"
            ta="இந்தத் துறையின் திட்டங்கள்"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
            {schemes.map(s => (
              <div key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem', margin: '0 0 0.15rem' }}>{s.name_en}</p>
                    <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem', margin: 0 }}>{s.name_ta}</p>
                  </div>
                  <span style={{
                    background: s.status === 'active' ? 'var(--flag-green-bg)' : s.status === 'new' ? '#EAF4FF' : 'var(--bg-3)',
                    color: s.status === 'active' ? 'var(--flag-green)' : s.status === 'new' ? '#1455A4' : 'var(--ink-3)',
                    fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 3, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>{s.status}</span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--ink-3)', margin: '0.5rem 0' }}>
                  <span style={{
                    background: s.scheme_type === 'central' ? '#EAF4FF' : s.scheme_type === 'centrally_sponsored' ? '#F5EEFF' : 'var(--bg-3)',
                    color: s.scheme_type === 'central' ? '#1455A4' : s.scheme_type === 'centrally_sponsored' ? '#5B2D8E' : 'var(--ink-2)',
                    padding: '0.1rem 0.45rem', borderRadius: 3, fontSize: '0.72rem', fontWeight: 600,
                  }}>{s.scheme_type.replace('_', ' ')}</span>
                  {' '}<span style={{ color: 'var(--ink-3)' }}>{s.funding_ratio_en}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', margin: '0.5rem 0', lineHeight: 1.5 }}>
                  <strong>Eligibility:</strong> {s.eligibility_en}
                </p>
                {s.eligibility_ta && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{s.eligibility_ta}</p>
                )}

                <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', margin: '0.25rem 0 0' }}>
                  Started by {s.origin_party} · {s.origin_year}
                  {s.parent_scheme_en && ` · Previously: ${s.parent_scheme_en}`}
                </p>

                {s.beneficiaries_claimed && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', margin: '0.2rem 0 0' }}>
                    Claimed beneficiaries: {s.beneficiaries_claimed}
                  </p>
                )}
              </div>
            ))}
          </div>
          <SourceCitation org="TN Health Dept / NHM" document="Scheme documents" year="2024" url="https://nhm.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 4: ACCESS ────────────────────────────────── */}
        <section id="access" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="How to access these services"
            ta="இந்தச் சேவைகளை எவ்வாறு பெறலாம்"
          />
          {processes.map(proc => (
            <div key={proc.id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.75rem' }}>{proc.name_en}</p>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', margin: '0 0 1rem' }}>{proc.name_ta}</p>

              <ol style={{ margin: '0 0 1rem', padding: '0 0 0 1.25rem' }}>
                {proc.official_steps.map((step, i) => (
                  <li key={i} style={{ color: 'var(--ink-2)', fontSize: '0.88rem', marginBottom: '0.35rem', lineHeight: 1.5 }}>{step}</li>
                ))}
              </ol>

              {proc.stall_point_en && (
                <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', borderRadius: '0 4px 4px 0', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--flag-amber)' }}>Where delays occur:</strong> {proc.stall_point_en}
                  </p>
                </div>
              )}

              {proc.documents_required.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-3)', margin: '0 0 0.3rem' }}>Documents required:</p>
                  <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
                    {proc.documents_required.map((d, i) => (
                      <li key={i} style={{ color: 'var(--ink-2)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {proc.portal_url && (
                <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', margin: '0.75rem 0 0' }}>
                  Portal: <a href={proc.portal_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{proc.portal_url}</a>
                </p>
              )}
            </div>
          ))}
        </section>

        <Divider />

        {/* ── SECTION 5: FUNDING ───────────────────────────────── */}
        <section id="funding" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="How this department is funded"
            ta="இந்தத் துறை எவ்வாறு நிதியளிக்கப்படுகிறது"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <StatCard label="Total budget" value={formatCr(dept.budget_cr)} />
            <StatCard label="Revenue receipts" value={formatCr(dept.revenue_cr)} />
            <StatCard label="Central funding" value={`${dept.central_funding_pct}%`} />
            <StatCard label="State funding" value={`${dept.state_funding_pct}%`} />
            <StatCard label="Per citizen / year" value={`₹${Number(perCitizenCr).toLocaleString('en-IN')}`} />
          </div>

          {/* Funding split bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 20, marginBottom: '0.4rem' }}>
              <div style={{ width: `${dept.central_funding_pct}%`, background: '#1455A4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>Centre {dept.central_funding_pct}%</span>
              </div>
              <div style={{ width: `${dept.state_funding_pct}%`, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>State {dept.state_funding_pct}%</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6, margin: '0.5rem 0' }}>
              Of every ₹100 this department spends, ₹{dept.central_funding_pct} comes from the Central government
              and ₹{dept.state_funding_pct} from the Tamil Nadu state budget.
            </p>
            {dept.central_funding_pct > 40 && (
              <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', padding: '0.75rem 1rem', borderRadius: '0 4px 4px 0', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
                More than 40% of this department budget comes from the Central government,
                typically with conditions on how it must be spent.
              </div>
            )}
          </div>

          <RTITooltip
            dept_name_en={dept.name_en}
            dept_name_ta={dept.name_ta}
            pio_designation={dept.pio_designation_en ?? 'Public Information Officer'}
            information_type_en="Salary vs programme expenditure breakdown"
            template_en={"To,\nThe PIO,\n" + dept.name_en + ",\nGovernment of Tamil Nadu.\n\nPlease provide: breakdown of expenditure between establishment (salary) costs and programme delivery costs for financial year 2023-24."}
            template_ta={"பொது தகவல் அதிகாரி அவர்களுக்கு,\n" + dept.name_ta + ",\nதமிழ்நாடு அரசு.\n\n2023-24 நிதி ஆண்டில் நிர்வாக (ஊதிய) செலவு மற்றும் திட்ட செலவு பிரிவு தகவல் வழங்கவும்."}
            filing_fee={10}
            response_days={30}
            appeal_body="First Appellate Authority, Finance Department"
          />

          <SourceCitation org="TN Budget" document="Budget Estimate 2024-25" year="2024" url="https://tnbudget.tn.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 6: STAFF ─────────────────────────────────── */}
        <section id="staff" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Who runs this department"
            ta="இந்தத் துறையை யார் நடத்துகிறார்கள்"
          />

          <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
            <div style={{ position: 'absolute', left: '0.6rem', top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
            {orgLevels.map((level, idx) => {
              const vacPct = level.sanctioned_posts > 0
                ? Math.round(((level.sanctioned_posts - level.filled_posts) / level.sanctioned_posts) * 100)
                : 0
              return (
                <div key={level.id} style={{ position: 'relative', marginBottom: '1rem' }}>
                  <div style={{ position: 'absolute', left: '-1.5rem', top: '1rem', width: 10, height: 10, borderRadius: '50%', background: level.citizen_facing ? 'var(--accent)' : 'var(--border-2)', border: '2px solid var(--bg)' }} />
                  <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem', background: 'var(--bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem' }}>Level {level.level}: </span>
                        <span style={{ color: 'var(--ink)', fontSize: '0.9rem' }}>{level.designation_en}</span>
                        <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>{level.designation_ta}</p>
                      </div>
                      <CadreTag cadre={level.cadre} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.3rem 1rem', fontSize: '0.82rem', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
                      <span>Pay: ₹{level.pay_min.toLocaleString('en-IN')} – ₹{level.pay_max.toLocaleString('en-IN')}/mo</span>
                      <span>Recruited by: {level.recruitment_body}</span>
                      <span>
                        Posts: {level.filled_posts.toLocaleString('en-IN')} filled / {level.sanctioned_posts.toLocaleString('en-IN')} sanctioned
                        {vacPct > 15 && <span style={{ color: 'var(--flag-amber)', fontWeight: 600 }}> · {vacPct}% vacant</span>}
                      </span>
                      <span>Typical tenure: {level.typical_tenure_months} months</span>
                    </div>

                    {level.citizen_facing && (
                      <div style={{ background: 'var(--flag-green-bg)', borderRadius: 4, padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--flag-green)', display: 'inline-block', marginBottom: '0.5rem' }}>
                        ✓ Citizen-facing role
                      </div>
                    )}

                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                      <strong>For your problem:</strong> {level.for_citizen_problem_en}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {orgLevels.some(l => l.data_quality_staffing === 'estimated' || l.data_quality_staffing === 'not_available') && (
            <RTITooltip
              dept_name_en={dept.name_en}
              dept_name_ta={dept.name_ta}
              pio_designation={dept.pio_designation_en ?? 'Public Information Officer'}
              information_type_en="Exact staffing numbers by designation"
              template_en={"To,\nThe PIO,\n" + dept.name_en + ",\nGovernment of Tamil Nadu.\n\nPlease provide: sanctioned strength and filled posts for all designations as on [date]."}
              template_ta={"பொது தகவல் அதிகாரி அவர்களுக்கு,\n" + dept.name_ta + ",\nதமிழ்நாடு அரசு.\n\n[தேதி] நிலவரப்படி அனைத்து பதவிகளுக்கும் அனுமதிக்கப்பட்ட பணியிடங்கள் மற்றும் நிரப்பப்பட்ட பணியிடங்கள் வழங்கவும்."}
              filing_fee={10}
              response_days={30}
              appeal_body="First Appellate Authority, department"
            />
          )}
          <SourceCitation org="TN Health Dept" document="Service Rules · Assembly Q&A" year="2024" url="https://tnassembly.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 7: CONTRACTS ─────────────────────────────── */}
        <section id="contracts" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Contract workforce"
            ta="ஒப்பந்த பணியாளர்கள்"
          />
          {contractWorkers.length > 0 ? (
            <ContractWorkerNotice categories={contractWorkers} />
          ) : (
            <RTITooltip
              dept_name_en={dept.name_en}
              dept_name_ta={dept.name_ta}
              pio_designation={dept.pio_designation_en ?? 'Public Information Officer'}
              information_type_en="Contract workforce count and pay details"
              template_en={"To,\nThe PIO,\n" + dept.name_en + ".\n\nPlease provide: number of contract/outsourced staff, their roles, and pay structure."}
              template_ta={"பொது தகவல் அதிகாரி அவர்களுக்கு,\n" + dept.name_ta + ".\n\nஒப்பந்த பணியாளர்களின் எண்ணிக்கை, பணி மற்றும் ஊதிய விவரம் வழங்கவும்."}
              filing_fee={10}
              response_days={30}
              appeal_body="First Appellate Authority, department"
            />
          )}
        </section>

        <Divider />

        {/* ── SECTION 8: DECISIONS ─────────────────────────────── */}
        <section id="decisions" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="What each level can and cannot decide"
            ta="ஒவ்வொரு அடுக்கும் எதை முடிவு செய்யலாம், எதை செய்ய முடியாது"
          />

          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
            Government decision-making operates within a formal structure of delegated powers.
            Each level can only act within its authorised limits.
            Understanding these limits helps citizens know who to approach for which matter.
          </div>

          {orgLevels.filter(l => l.level >= 3).map(level => (
            <div key={level.id} style={{ marginBottom: '1rem' }}>
              <DecisionPowers
                designation={`Level ${level.level}: ${level.designation_en}`}
                powers={level.decision_powers_en}
                limitations={level.decision_limitations_en}
                transferAuthority={level.transfer_authority}
                financialDelegation={`Pay scale: ₹${level.pay_min.toLocaleString('en-IN')}–₹${level.pay_max.toLocaleString('en-IN')}`}
              />
            </div>
          ))}
          <SourceCitation org="TN Financial Code" document="Delegation of Financial Powers Rules · TN Service Rules" year="2024" url="https://finance.tn.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 9: OUTCOMES ──────────────────────────────── */}
        <section id="outcomes" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Is this department delivering?"
            ta="இந்தத் துறை சேவை வழங்குகிறதா?"
          />
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            We present official targets alongside independently verified actual outcomes.
            We draw no conclusions. Sources are cited for every metric.
          </div>
          {metrics.map(m => {
            const declining = m.trend === 'down' || m.trend === 'declining'
            const improving = m.trend === 'up' || m.trend === 'improving'
            const needsRTI = m.actual_value.toLowerCase().includes('rti') || m.actual_value.toLowerCase().includes('not pub')
            return (
              <div key={m.id} style={{
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${declining ? 'var(--flag-amber)' : improving ? 'var(--flag-green)' : 'var(--border)'}`,
                borderRadius: '0 6px 6px 0',
                padding: '1rem 1.125rem',
                marginBottom: '1rem',
                background: 'var(--bg)',
              }}>
                <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
                  {m.label_en}
                  <span style={{ fontWeight: 400, color: 'var(--ink-3)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{m.label_ta}</span>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--bg-2)', borderRadius: 4, padding: '0.6rem 0.875rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official target</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{m.official_target}</p>
                  </div>
                  <div style={{ background: needsRTI ? 'var(--flag-amber-bg)' : 'var(--bg-2)', borderRadius: 4, padding: '0.6rem 0.875rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actual</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: needsRTI ? 'var(--flag-amber)' : 'var(--ink)', margin: 0 }}>{m.actual_value}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: '0.5rem 0 0' }}>
                  Source: {m.source}
                </p>
              </div>
            )
          })}
          <SourceCitation org="NFHS-5 / Assembly Q&A" document="Tamil Nadu Factsheet" year="2021" url="https://rchiips.org/nfhs/nfhs-5.shtml" />
        </section>

        <Divider />

        {/* ── SECTION 10: TENDERS ──────────────────────────────── */}
        <section id="tenders" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Procurement and contracting"
            ta="கொள்முதல் மற்றும் ஒப்பந்தங்கள்"
          />
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            All government tenders above a threshold must be published on TNTENDERS portal.
            This section surfaces notable patterns from public tender data.{' '}
            <a href="https://tntenders.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Source: tntenders.gov.in</a>
          </div>
          <p style={{ color: 'var(--ink-3)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            No notable patterns flagged in recent tender data for this department.{' '}
            <a href="https://tntenders.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>View all tenders: tntenders.gov.in</a>
          </p>
        </section>

        <Divider />

        {/* ── SECTION 11: MINISTERS ────────────────────────────── */}
        <section id="ministers" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Ministers tracker"
            ta="அமைச்சர்கள் பதிவேடு"
          />
          {ministers.length > 0 ? (
            <MinisterTimeline ministers={ministers} deptName={dept.name_en} />
          ) : (
            <RTITooltip
              dept_name_en={dept.name_en}
              dept_name_ta={dept.name_ta}
              pio_designation={dept.pio_designation_en ?? 'Public Information Officer'}
              information_type_en="List of ministers with tenure dates"
              template_en={"To,\nThe PIO,\n" + dept.name_en + ".\n\nPlease provide: list of all ministers who held charge of this department with their tenure dates."}
              template_ta={"பொது தகவல் அதிகாரி அவர்களுக்கு,\n" + dept.name_ta + ".\n\nஇந்தத் துறையில் பொறுப்பு வகித்த அனைத்து அமைச்சர்களின் பட்டியல் மற்றும் பதவிக்காலம் வழங்கவும்."}
              filing_fee={10}
              response_days={30}
              appeal_body="First Appellate Authority, department"
            />
          )}
        </section>

        <Divider />

        {/* ── SECTION 12: LOCAL ────────────────────────────────── */}
        <section id="local" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="How local government is involved"
            ta="உள்ளாட்சி அமைப்புகளின் பங்கு"
          />
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--ink)', margin: '0 0 0.75rem', fontSize: '0.9rem' }}>
              National Health Mission — implementation roles
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
              {[
                { role: 'State role', body: 'Health Dept issues circulars, releases funds, sets targets' },
                { role: 'District role', body: 'JDHS monitors PHCs, approves medicine indent, reviews progress' },
                { role: 'Panchayat / corporation role', body: 'ANM sub-centre building, community mobilisation, VHSNC meetings' },
              ].map(r => (
                <div key={r.role} style={{ background: 'var(--bg-2)', borderRadius: 4, padding: '0.75rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--ink-2)', margin: '0 0 0.3rem', fontSize: '0.8rem' }}>{r.role}</p>
                  <p style={{ color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>{r.body}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', margin: '0.75rem 0 0', lineHeight: 1.6 }}>
              If this service fails at your local body level, the escalation path is:
              Village health nurse → Block Medical Officer → JDHS District → Commissioner of Health
            </p>
          </div>
          <SourceCitation org="NHM Tamil Nadu" document="Implementation guidelines" year="2024" url="https://nhm.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 13: RIGHTS ───────────────────────────────── */}
        <section id="rights" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Your rights from this department"
            ta="இந்தத் துறையிலிருந்து உங்கள் உரிமைகள்"
          />
          <div style={{ background: 'var(--flag-green-bg)', border: '1px solid var(--flag-green)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
            These are legal entitlements — not schemes.
            Schemes can be modified or withdrawn.
            Legal entitlements are written into Acts of Parliament or State Legislature.
            They can be enforced through legal channels.
            <p style={{ color: 'var(--ink-3)', margin: '0.5rem 0 0', fontSize: '0.83rem' }}>
              இவை சட்டப்பூர்வ உரிமைகள் — திட்டங்கள் அல்ல.
              திட்டங்களை திருத்தலாம் அல்லது நிறுத்தலாம்.
              சட்டப்பூர்வ உரிமைகள் சட்ட வழிகளில் நடைமுறைப்படுத்தப்படலாம்.
            </p>
          </div>
          {entitlements.map(ent => (
            <div key={ent.id} style={{ border: '1px solid var(--border)', borderLeft: '4px solid var(--accent)', borderRadius: '0 6px 6px 0', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.15rem' }}>{ent.title_en}</p>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>{ent.title_ta}</p>

              <div style={{ background: 'var(--flag-green-bg)', borderRadius: 4, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>{ent.what_you_get_en}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', margin: '0.4rem 0 0', lineHeight: 1.5 }}>{ent.what_you_get_ta}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timeline</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                    {ent.timeline_days === 0 ? 'Immediate' : `${ent.timeline_days} days`}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Legal basis</p>
                  <p style={{ fontSize: '0.85rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)', margin: 0 }}>{ent.legal_basis}</p>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
                <strong>How to claim:</strong> {ent.how_to_claim_en}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--flag-amber)', margin: 0, lineHeight: 1.6 }}>
                <strong>If denied:</strong> {ent.escalation_en}
              </p>
            </div>
          ))}
        </section>

        <Divider />

        {/* ── SECTION 14: AUDIT ────────────────────────────────── */}
        <section id="audit" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="What official audits have found"
            ta="அரசு தணிக்கைகள் என்ன கண்டறிந்துள்ளன"
          />
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            The Comptroller and Auditor General (CAG) audits government accounts and reports to
            the Legislature. These findings are constitutional records. We present them without
            editorial commentary.
          </div>

          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)', margin: '0 0 1rem' }}>Findings noted in audit records</h3>
          {flags.filter(f => f.severity === 'red' || f.severity === 'amber').map(f => (
            <div key={f.id}>
              <FlagCard flag={f} />
              <div style={{ marginBottom: '0.75rem' }}>
                <DisputeButton flagId={f.id} />
              </div>
            </div>
          ))}

          {flags.filter(f => f.severity === 'green').length > 0 && (
            <>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--flag-green)', margin: '1.5rem 0 1rem' }}>What is working — verified findings</h3>
              {flags.filter(f => f.severity === 'green').map(f => <FlagCard key={f.id} flag={f} />)}
            </>
          )}

          <SourceCitation org="CAG India / PRS India" document="TN Audit Reports" year="2024" url="https://cag.gov.in" />
        </section>

        <Divider />

        {/* ── SECTION 15: LEGAL ────────────────────────────────── */}
        <section id="legal" style={{ padding: '3rem 0 2.5rem' }}>
          <SectionHead
            en="Legal representation"
            ta="சட்ட பிரதிநிதித்துவம்"
          />
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            Government departments are represented in courts by lawyers appointed by the state
            government. These appointments are made through the Law Department and Advocate
            General's office. Taxpayer funds pay for this legal representation.
          </div>

          {legalAppointments.map(la => (
            <div key={la.id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '1rem', background: 'var(--bg)' }}>
              <p style={{ fontWeight: 700, color: 'var(--ink)', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{la.designation}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.5rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
                <p style={{ margin: 0 }}><strong>Appointed by:</strong> {la.appointing_authority}</p>
                <p style={{ margin: 0 }}><strong>Basis:</strong> {la.appointment_basis}</p>
                <p style={{ margin: 0 }}><strong>Tenure:</strong> {la.tenure_en}</p>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
                <strong>Cases handled:</strong> {la.cases_handled_en}
              </p>

              {la.data_quality !== 'available' ? (
                <RTITooltip
                  dept_name_en={dept.name_en}
                  dept_name_ta={dept.name_ta}
                  pio_designation="Public Information Officer, Law Department"
                  information_type_en="Fee structure for government pleaders"
                  template_en={la.rti_note_en}
                  template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nசட்டத் துறை,\nதமிழ்நாடு அரசு.\n\nசர்க்கார் குடா வழக்கறிஞர்களுக்கு செலுத்தப்படும் கட்டண விவரம் வழங்கவும்."
                  filing_fee={10}
                  response_days={30}
                  appeal_body="First Appellate Authority, Law Department"
                />
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
                  <strong>Fee structure:</strong> {la.fee_structure_en}
                </p>
              )}

              <SourceCitation org="TN Law Dept" document={la.source} year="2024" url="https://lawdept.tn.gov.in" />
            </div>
          ))}

          {legalAppointments.length === 0 && (
            <RTITooltip
              dept_name_en={dept.name_en}
              dept_name_ta={dept.name_ta}
              pio_designation="Public Information Officer, Law Department"
              information_type_en="Government pleaders and fee structure for this department"
              template_en={"To,\nThe PIO,\nLaw Department,\nGovernment of Tamil Nadu.\n\nPlease provide: list of government pleaders handling " + dept.name_en + " matters, their appointment date, tenure, and fee structure."}
              template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nசட்டத் துறை,\nதமிழ்நாடு அரசு.\n\nசட்டத் துறை வழக்கறிஞர்கள் பட்டியல் மற்றும் கட்டண விவரம் வழங்கவும்."
              filing_fee={10}
              response_days={30}
              appeal_body="First Appellate Authority, Law Department"
            />
          )}
        </section>

      </main>
    </>
  )
}
