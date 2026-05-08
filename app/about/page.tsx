'use client'

import { useState } from 'react'
import Link from 'next/link'

const DATA_SOURCES = [
  {
    category: 'Budget & Finance',
    category_ta: 'பட்ஜெட் & நிதி',
    sources: [
      { name: 'TN Budget Estimates 2024–25', org: 'Finance Department, Government of Tamil Nadu', url: 'https://www.tn.gov.in/dept/finance' },
      { name: 'CAG Report on State Finances 2022–23', org: 'Comptroller and Auditor General of India', url: 'https://cag.gov.in' },
      { name: 'RBI State Finances Study 2023–24', org: 'Reserve Bank of India', url: 'https://rbi.org.in' },
    ],
  },
  {
    category: 'Health',
    category_ta: 'சுகாதாரம்',
    sources: [
      { name: 'National Health Profile 2022', org: 'Central Bureau of Health Intelligence, MoHFW', url: 'https://cbhidghs.nic.in' },
      { name: 'NFHS-5 (2019–21) Tamil Nadu Factsheet', org: 'Ministry of Health & Family Welfare', url: 'https://rchiips.org' },
      { name: 'CMCHIS Annual Report 2022', org: 'CMCHIS, Government of Tamil Nadu', url: 'https://www.cmchistn.com' },
    ],
  },
  {
    category: 'Education',
    category_ta: 'கல்வி',
    sources: [
      { name: 'UDISE+ 2022–23 School Education Statistics', org: 'Ministry of Education, GoI', url: 'https://udiseplus.gov.in' },
      { name: 'TN School Education Dept Annual Report', org: 'School Education Dept, GoTN', url: 'https://www.tnschools.gov.in' },
    ],
  },
  {
    category: 'Schemes & Welfare',
    category_ta: 'திட்டங்கள் & நலன்',
    sources: [
      { name: 'Government Orders (GO) published on tn.gov.in', org: 'Various Departments, Government of Tamil Nadu', url: 'https://www.tn.gov.in' },
      { name: 'PM-KISAN, PM-JAY, PMAY-G official portals', org: 'Ministry of Agriculture / Health / Housing, GoI', url: 'https://pmkisan.gov.in' },
    ],
  },
]

const METHODOLOGY_STEPS = [
  {
    title: 'Collect from primary sources',
    body: 'We source from official government orders (GOs), CAG audit reports, RTI responses, National Sample Survey data, and ministry annual reports. No figures from news articles or press releases without cross-referencing official documents.',
  },
  {
    title: 'Separate official from actual',
    body: 'Where government claims a target or achievement, we show both the claimed figure and the independently verifiable figure (if available). When data is not published, we flag it as a transparency failure — not a data gap.',
  },
  {
    title: 'Flag disputes clearly',
    body: 'We do not resolve contested data by picking a side. If the official figure is disputed by CAG or an independent survey, we show both and link to the dispute source. Severity: Red (contested by audit), Amber (methodology disputed), Green (verified).',
  },
  {
    title: 'Version and timestamp',
    body: 'Every data point carries a source, year, and document reference. When data is updated, we update the source reference — not silently replace numbers. You can trace every figure to its origin.',
  },
]

function DisputeForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', dept: '', issue: '', evidence: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, submitted_at: new Date().toISOString() }),
    }).catch(() => {})
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ padding: '2rem', background: '#F0FDF4', borderRadius: 8, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#065F46' }}>Dispute submitted</p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#374151' }}>
          We review all disputes within 7 days. If the data needs correction, we will update it and note the change.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
            Your name (optional)
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Anonymous is fine"
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.85rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
            Department or page
          </label>
          <input
            type="text"
            value={form.dept}
            onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
            placeholder="e.g. Health, Schemes › CMCHIS"
            required
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.85rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
          What is wrong? *
        </label>
        <textarea
          value={form.issue}
          onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
          required
          rows={3}
          placeholder="Describe what the data says, and what you believe the correct figure or fact is."
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.85rem', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
          Evidence / source link (optional)
        </label>
        <input
          type="text"
          value={form.evidence}
          onChange={e => setForm(f => ({ ...f, evidence: e.target.value }))}
          placeholder="Link to official document, RTI response, or news report"
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.85rem', boxSizing: 'border-box' }}
        />
      </div>

      <button
        type="submit"
        style={{
          alignSelf: 'flex-start',
          padding: '0.55rem 1.25rem',
          background: 'var(--accent, #1A4731)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Submit dispute
      </button>
    </form>
  )
}

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1rem' }}>
        <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--ink, #0F172A)' }}>About</span>
      </nav>

      {/* Hero */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>About Sengonnmai</h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', color: '#6B7280' }}>
          செங்கொன்மை — Tamil for "good governance" or "governance done right"
        </p>
      </header>

      {/* Mission */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', background: '#F0FDF4', borderRadius: 8, borderLeft: '4px solid #1A4731' }}>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', fontWeight: 800, color: '#064E3B' }}>
            What we are
          </h2>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#374151', lineHeight: 1.7 }}>
            Sengonnmai is a public-information platform that translates Tamil Nadu's government data — budgets, schemes, entitlements,
            staff figures, and audit findings — into plain language accessible to every citizen.
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.7 }}>
            We do not accept government funding, party funding, or advertising. We are not affiliated with any political party.
            Our editorial judgements are based on publicly available data from government sources, CAG audits, and independent surveys.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          How we work
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {METHODOLOGY_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{
                minWidth: 32, height: 32, borderRadius: '50%',
                background: 'var(--accent, #1A4731)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.82rem', fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</span>
              <div>
                <h3 style={{ margin: '0 0 0.3rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink, #0F172A)' }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Data sources
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {DATA_SOURCES.map(cat => (
            <div key={cat.category}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>
                {cat.category}
                <span style={{ marginLeft: '0.5rem', fontWeight: 400, color: '#9CA3AF', fontFamily: 'var(--serif, Georgia, serif)' }}>
                  {cat.category_ta}
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cat.sources.map((src, i) => (
                  <div key={i} style={{ padding: '0.75rem 1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                    <p style={{ margin: '0 0 0.15rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink, #0F172A)' }}>{src.name}</p>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: '#6B7280' }}>{src.org}</p>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent, #1A4731)', fontFamily: 'var(--mono, monospace)', wordBreak: 'break-all' }}>
                      {src.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Limitations
        </h2>
        <div style={{ padding: '1.1rem 1.25rem', background: '#FEF3C7', borderRadius: 8, borderLeft: '4px solid #D97706' }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#78350F', lineHeight: 1.8 }}>
            <li>Beneficiary figures are government-claimed and may be inflated.</li>
            <li>Staff vacancy data lags by 1–2 years (published in annual reports).</li>
            <li>Scheme eligibility rules change — we update quarterly but may lag GOs by weeks.</li>
            <li>Budget figures are from estimates — actual spending may differ significantly.</li>
            <li>This platform covers 12 departments. Tamil Nadu has 50+ departments.</li>
          </ul>
        </div>
      </section>

      {/* Dispute form */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Dispute a data point
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#6B7280' }}>
          If you believe a figure, date, or fact on this platform is wrong, tell us. We read every submission.
        </p>
        <DisputeForm />
      </section>

      {/* Contact */}
      <div style={{ padding: '1.25rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Contact</h3>
        <p style={{ margin: 0, fontSize: '0.83rem', color: '#6B7280', lineHeight: 1.65 }}>
          Sengonnmai is a civic technology project. To contribute data, report errors, or discuss methodology,
          use the dispute form above. We do not disclose contributor identities.
        </p>
      </div>
    </main>
  )
}
