'use client'

import Link from 'next/link'
import { DEPARTMENTS } from '@/lib/departments'
import { formatCr } from '@/lib/departments'

const BUDGET_YEAR = '2024–25'
const TOTAL_BUDGET_CR = 306000

const RUPEE_BREAKDOWN = [
  { label_en: 'Salaries & Wages', label_ta: 'சம்பளம் & கூலி', value_cr: 78000, pct: 25.5, color: '#1A4731', icon: '👥' },
  { label_en: 'Interest Payments', label_ta: 'வட்டி கட்டணங்கள்', value_cr: 58000, pct: 19.0, color: '#7C2D12', icon: '💸' },
  { label_en: 'Pensions & Gratuities', label_ta: 'ஓய்வூதியம்', value_cr: 44000, pct: 14.4, color: '#5B21B6', icon: '🏦' },
  { label_en: 'Capital Expenditure', label_ta: 'மூலதன செலவு', value_cr: 42000, pct: 13.7, color: '#1E40AF', icon: '🏗️' },
  { label_en: 'Subsidies & Welfare', label_ta: 'மானியங்கள் & நலத்திட்டங்கள்', value_cr: 38000, pct: 12.4, color: '#065F46', icon: '🤝' },
  { label_en: 'Grants to Local Bodies', label_ta: 'உள்ளாட்சி மானியம்', value_cr: 22000, pct: 7.2, color: '#1A4731', icon: '🏛️' },
  { label_en: 'Other Revenue Expenditure', label_ta: 'பிற வருவாய் செலவு', value_cr: 24000, pct: 7.8, color: '#6B7280', icon: '📋' },
]

const REVENUE_SOURCES = [
  { label_en: 'State Own Tax Revenue', label_ta: 'மாநில வரி வருவாய்', value_cr: 145000, pct: 47.4 },
  { label_en: 'Central Transfers (Tax Devolution)', label_ta: 'மத்திய நிதி பகிர்வு', value_cr: 52000, pct: 17.0 },
  { label_en: 'Central Grants', label_ta: 'மத்திய மானியம்', value_cr: 38000, pct: 12.4 },
  { label_en: 'Borrowings', label_ta: 'கடன்கள்', value_cr: 48000, pct: 15.7 },
  { label_en: 'Non-Tax Revenue', label_ta: 'வரி அல்லாத வருவாய்', value_cr: 23000, pct: 7.5 },
]

const FLAGS = [
  {
    severity: 'red' as const,
    title: 'Fiscal deficit at 3.2% of GSDP',
    body: 'Tamil Nadu\'s fiscal deficit (₹72,000 Cr) exceeds the FRBM target of 3% of GSDP. CAG 2023 flagged rising committed expenditure (salaries + interest + pensions) crowding out capital spending.',
  },
  {
    severity: 'amber' as const,
    title: '57.8% of budget is committed expenditure',
    body: 'Salaries, interest payments, and pensions together consume ₹1.8 lakh crore — leaving less than 44% for discretionary spending on new infrastructure, welfare, or emergency response.',
  },
  {
    severity: 'green' as const,
    title: 'TN ranks 3rd in own tax revenue collection',
    body: 'Tamil Nadu collects ₹1.45 lakh crore in own taxes — one of the highest among Indian states — due to a large formal economy and strong GST collections.',
  },
]

const TOP_DEPTS = DEPARTMENTS
  .slice()
  .sort((a, b) => b.budget_cr - a.budget_cr)
  .slice(0, 8)

const TOTAL_DEPT_BUDGET = DEPARTMENTS.reduce((s, d) => s + d.budget_cr, 0)

function FlagCard({ severity, title, body }: { severity: 'red' | 'amber' | 'green'; title: string; body: string }) {
  const colors = {
    red: { border: '#DC2626', bg: '#FEF2F2', text: '#991B1B', dot: '#DC2626' },
    amber: { border: '#D97706', bg: '#FFFBEB', text: '#92400E', dot: '#D97706' },
    green: { border: '#059669', bg: '#F0FDF4', text: '#064E3B', dot: '#059669' },
  }
  const c = colors[severity]
  return (
    <div style={{ padding: '1rem 1.1rem', background: c.bg, borderLeft: `4px solid ${c.border}`, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: 4 }} />
        <div>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.88rem', fontWeight: 700, color: c.text }}>{title}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: c.text, opacity: 0.85, lineHeight: 1.6 }}>{body}</p>
        </div>
      </div>
    </div>
  )
}

export default function BudgetPage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1rem' }}>
        <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--ink, #0F172A)' }}>Budget</span>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Tamil Nadu State Budget {BUDGET_YEAR}
        </h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', color: '#6B7280' }}>
          தமிழ்நாடு மாநில பட்ஜெட் — where ₹3.06 lakh crore comes from and where it goes
        </p>
        <div style={{ marginTop: '1.25rem', display: 'inline-block', padding: '0.6rem 1.2rem', background: 'var(--accent, #1A4731)', color: '#fff', borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.8, textTransform: 'uppercase' }}>Total Budget</p>
          <p style={{ margin: '0.1rem 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{formatCr(TOTAL_BUDGET_CR)}</p>
        </div>
      </div>

      {/* Flags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {FLAGS.map((f, i) => <FlagCard key={i} {...f} />)}
      </div>

      {/* Where the money goes */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Where every rupee goes
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: '#6B7280' }}>உங்கள் வரிப்பணம் எங்கே செல்கிறது</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {RUPEE_BREAKDOWN.map(row => (
            <div key={row.label_en}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>{row.icon}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink, #0F172A)' }}>{row.label_en}</span>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontFamily: 'var(--serif, Georgia, serif)' }}>{row.label_ta}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink, #0F172A)' }}>{formatCr(row.value_cr)}</span>
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.78rem', color: '#6B7280' }}>({row.pct}%)</span>
                </div>
              </div>
              <div style={{ height: 10, background: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 5, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Committed expenditure callout */}
        <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#FEF3C7', borderRadius: 8, borderLeft: '4px solid #D97706' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350F', lineHeight: 1.65 }}>
            <strong>Committed expenditure lock-in:</strong> Salaries (₹78,000 Cr) + Interest (₹58,000 Cr) + Pensions (₹44,000 Cr)
            = <strong>₹1,80,000 Cr (58.8%)</strong> of total budget is pre-committed every year regardless of economic conditions.
            This limits the government's ability to respond to crises or invest in new programmes.
          </p>
        </div>
      </section>

      {/* Revenue sources */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Where the money comes from
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: '#6B7280' }}>பணம் எங்கிருந்து வருகிறது</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {REVENUE_SOURCES.map(src => (
            <div key={src.label_en} style={{ padding: '1rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {src.pct}% of revenue
              </p>
              <p style={{ margin: '0 0 0.15rem', fontSize: '1rem', fontWeight: 700, color: 'var(--ink, #0F172A)' }}>
                {formatCr(src.value_cr)}
              </p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#374151', lineHeight: 1.4 }}>{src.label_en}</p>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: '#9CA3AF', fontFamily: 'var(--serif, Georgia, serif)' }}>{src.label_ta}</p>
              <div style={{ marginTop: '0.6rem', height: 4, background: '#E5E7EB', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${src.pct}%`, background: 'var(--accent, #1A4731)', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top departments by budget */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink, #0F172A)' }}>
          Budget by Department
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: '#6B7280' }}>
          துறைவாரியான பட்ஜெட் — top 8 by allocation
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {TOP_DEPTS.map(dept => {
            const pct = (dept.budget_cr / TOTAL_DEPT_BUDGET) * 100
            return (
              <Link key={dept.id} href={`/dept/${dept.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  background: '#fff',
                  transition: 'box-shadow 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink, #0F172A)' }}>{dept.name_en}</span>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'var(--serif, Georgia, serif)' }}>{dept.name_ta}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink, #0F172A)' }}>{formatCr(dept.budget_cr)}</span>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct * 5}%`, maxWidth: '100%', background: 'var(--accent, #1A4731)', borderRadius: 3 }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#9CA3AF' }}>
          Total across all 12 tracked departments: {formatCr(TOTAL_DEPT_BUDGET)}
        </p>
      </section>

      {/* Source */}
      <div style={{ padding: '1rem 1.25rem', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
        <p style={{ margin: '0 0 0.3rem', fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Data Sources
        </p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.65 }}>
          Tamil Nadu Budget Estimates 2024–25 (Finance Department). CAG Report on State Finances 2022–23.
          RBI State Finances Study 2023–24. Figures rounded. If you find an error, <Link href="/about" style={{ color: 'var(--accent, #1A4731)' }}>dispute it here</Link>.
        </p>
      </div>
    </main>
  )
}
