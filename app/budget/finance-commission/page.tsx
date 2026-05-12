'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'

const FC_HISTORY = [
  { fc: '1st FC', years: '1951–56', chair: 'K.C. Neogy', tn_share_pct: 4.93, total_devolution_cr: null, note: 'Base framework established' },
  { fc: '6th FC', years: '1974–79', chair: 'K.M. Brahmananda Reddy', tn_share_pct: 5.28, total_devolution_cr: null, note: 'Post-nationalisation era' },
  { fc: '10th FC', years: '1995–2000', chair: 'K.C. Pant', tn_share_pct: 5.385, total_devolution_cr: null, note: 'Post-liberalisation reforms' },
  { fc: '13th FC', years: '2010–15', chair: 'Vijay Kelkar', tn_share_pct: 4.969, total_devolution_cr: 62_151, note: 'Raised divisible pool to 32%' },
  { fc: '14th FC', years: '2015–20', chair: 'Y.V. Reddy', tn_share_pct: 4.023, total_devolution_cr: 1_38_604, note: 'Raised devolution to 42%; TN share fell due to higher income weight' },
  { fc: '15th FC', years: '2021–26', chair: 'N.K. Singh', tn_share_pct: 4.189, total_devolution_cr: 1_78_000, note: '2011 Census used; slight recovery for TN. Grants for urban + health added.' },
]

const FC15_CRITERIA = [
  { criterion: 'Income distance', weight: 45, tn_impact: 'Negative — TN is wealthier than average, so lower weight', color: '#B83232' },
  { criterion: 'Population (2011 Census)', weight: 15, tn_impact: 'Negative vs 1971 — TN population grew slower due to better family planning', color: '#B83232' },
  { criterion: 'Area', weight: 15, tn_impact: 'Neutral — TN is mid-sized state', color: '#946010' },
  { criterion: 'Forest & Ecology', weight: 10, tn_impact: 'Slight positive — Western Ghats forest cover', color: '#1A5C38' },
  { criterion: 'Tax & fiscal effort', weight: 2.5, tn_impact: 'Positive — TN has high own-tax revenue', color: '#1A5C38' },
  { criterion: 'Demographic performance', weight: 12.5, tn_impact: 'Positive — rewards states that reduced fertility rates', color: '#1A5C38' },
]

const MONEY_FLOWS = [
  {
    id: 'tax_devolution',
    label: 'Tax Devolution',
    color: '#1A3C6E',
    bg: '#EBF3FF',
    what: '41% of Centre\'s net tax receipts divided among all states per FC formula',
    tn_fy24_cr: 52_800,
    mechanism: 'Monthly instalments released by Finance Ministry on the 1st of each month. Constitutionally mandated — cannot be reduced or withheld.',
    rti_target: 'Finance Ministry (Delhi); State Finance Dept for receipt confirmation',
  },
  {
    id: 'grants',
    label: 'Grants-in-Aid (Article 275)',
    color: '#1A5C38',
    bg: '#F2F8F4',
    what: 'Unconditional + tied grants from FC recommendations: local body grants, health grants, disaster relief, post-devolution deficit',
    tn_fy24_cr: 8_400,
    mechanism: 'Released in two instalments (June and November). Local body grants split between Panchayats and Urban Local Bodies.',
    rti_target: 'Finance Dept TN; respective Urban/Rural Local Body for final receipt',
  },
  {
    id: 'css_transfers',
    label: 'CSS / Central Transfers',
    color: '#946010',
    bg: '#FDF6EC',
    what: 'Scheme-tied transfers for CSS (60:40). State must release matching share.',
    tn_fy24_cr: 41_200,
    mechanism: 'Released by Central Ministries after Utilisation Certificates. Often delayed — causing mid-year cash crunch in departments.',
    rti_target: 'Nodal Line Department (State) + Central Ministry',
  },
  {
    id: 'sdrf',
    label: 'SDRF (Disaster Relief)',
    color: '#7A3B00',
    bg: '#FFF4E0',
    what: 'State Disaster Response Fund — 75% Centre, 25% State. Used for cyclone, flood, drought relief.',
    tn_fy24_cr: 1_850,
    mechanism: 'Two instalments per year. NDMA guidelines govern admissible expenditures. Underspend must be refunded. TN often supplements from CM Relief Fund.',
    rti_target: 'TN Revenue Dept (Disaster Management) + NDMA',
  },
]

const FISCAL_INDICATORS = [
  { indicator: 'GSDP (2023-24)', value: '₹26.5 Lakh Cr', trend: 'up', note: '3rd largest state economy' },
  { indicator: 'Own Tax Revenue', value: '₹1,92,000 Cr', trend: 'up', note: 'Primarily GST + VAT (alcohol, fuel) + stamp duty' },
  { indicator: 'Fiscal Deficit', value: '2.85% of GSDP', trend: 'neutral', note: 'Within FRBM 3% limit' },
  { indicator: 'Debt/GSDP', value: '22.4%', trend: 'warning', note: 'Rising trend; FC15 sustainability threshold is ~25%' },
  { indicator: 'Revenue Deficit', value: '−₹15,600 Cr', trend: 'warning', note: 'Revenue spending exceeds revenue receipts — structural concern' },
  { indicator: 'Capital Expenditure', value: '₹72,000 Cr', trend: 'up', note: 'Infrastructure push; ~2.7% of GSDP' },
]

const TN_GRIEVANCES_FC = [
  {
    issue: 'Population penalty',
    detail: 'Using 2011 Census instead of 1971 penalises states like TN that successfully controlled population growth. TN\'s 2011 share is lower than its 1971-based share would have been.',
    cite: 'TN Government memorandum to 15th FC, 2019',
  },
  {
    issue: 'Income distance criterion',
    detail: 'Wealthier states get a lower "income distance" score. TN\'s higher per-capita income means it receives proportionally less than poorer states, even though it contributes more to central taxes.',
    cite: 'M. Govinda Rao, NIPFP Working Paper 2020',
  },
  {
    issue: 'GST Compensation ended 2022',
    detail: 'States were promised 14% annual revenue growth for 5 years post-GST (2017-22). After 2022, compensation stopped. TN lost ≈₹6,000 Cr/year in guaranteed revenue.',
    cite: 'CAG Report on GST Implementation, 2023',
  },
  {
    issue: 'Centralisation of CSS',
    detail: 'Shifting more spending to tied CSS grants (rather than untied devolution) gives Centre more control and reduces State flexibility. TN prefers higher untied devolution.',
    cite: 'TN Finance Minister statement, Budget 2024-25',
  },
]

function TrendIcon({ t }: { t: string }) {
  if (t === 'up') return <span style={{ color: '#1A5C38', fontWeight: 700 }}>↑</span>
  if (t === 'warning') return <span style={{ color: '#B83232', fontWeight: 700 }}>⚠</span>
  return <span style={{ color: '#946010', fontWeight: 700 }}>→</span>
}

export default function FinanceCommissionPage() {
  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--ink)' }}>
          Finance Commission & Money Flow to Tamil Nadu
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
          நிதி ஆயோகம் மற்றும் தமிழ்நாட்டிற்கான நிதி பாய்ச்சல்
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', margin: '0 0 2.5rem', maxWidth: 640, lineHeight: 1.7 }}>
          India's Finance Commission (Article 280) meets every five years to decide how to split Central taxes between the Union and States.
          The 15th Finance Commission (2021–26) allocates 4.189% of the divisible pool to Tamil Nadu.
        </p>

        {/* TN fiscal snapshot */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
          Tamil Nadu Fiscal Snapshot (2023-24)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', marginBottom: '2.5rem' }}>
          {FISCAL_INDICATORS.map(fi => (
            <div key={fi.indicator} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem 1rem' }}>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.68rem', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{fi.indicator}</p>
              <p style={{ color: 'var(--ink)', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.2rem', fontFamily: 'var(--mono)' }}>
                <TrendIcon t={fi.trend} /> {fi.value}
              </p>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.72rem', margin: 0, lineHeight: 1.5 }}>{fi.note}</p>
            </div>
          ))}
        </div>

        {/* Money flows */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
          How Central Money Flows to TN
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {MONEY_FLOWS.map(mf => (
            <div key={mf.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: mf.bg, padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: mf.color, fontWeight: 700, fontSize: '0.95rem' }}>{mf.label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', fontWeight: 700, color: mf.color, marginLeft: 'auto' }}>
                  ₹{(mf.tn_fy24_cr / 1000).toFixed(1)}K Cr (est. FY24)
                </span>
              </div>
              <div style={{ padding: '0.875rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--ink-3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.3rem' }}>What it is</p>
                  <p style={{ color: 'var(--ink-2)', fontSize: '0.83rem', margin: 0, lineHeight: 1.6 }}>{mf.what}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--ink-3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.3rem' }}>How it flows</p>
                  <p style={{ color: 'var(--ink-2)', fontSize: '0.83rem', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{mf.mechanism}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)' }}>RTI: <strong style={{ color: 'var(--ink)' }}>{mf.rti_target}</strong></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FC15 criteria */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--ink)' }}>
          15th FC Formula: Why TN Gets 4.189%
        </h2>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
          The 15th FC used six criteria with specific weights. TN benefits from its demographic performance and tax effort, but is penalised by the income distance and population criteria.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', background: 'var(--bg-2)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase' }}>Criterion</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', textAlign: 'center' }}>Weight</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase' }}>Impact on TN</span>
          </div>
          {FC15_CRITERIA.map((cr, i) => (
            <div key={cr.criterion} style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 1fr', padding: '0.6rem 1rem', alignItems: 'center',
              borderBottom: i < FC15_CRITERIA.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
            }}>
              <span style={{ color: 'var(--ink)', fontSize: '0.83rem', fontWeight: 500 }}>{cr.criterion}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.83rem', color: 'var(--accent)', textAlign: 'center', fontWeight: 600 }}>{cr.weight}%</span>
              <span style={{ color: cr.color, fontSize: '0.78rem', lineHeight: 1.5 }}>{cr.tn_impact}</span>
            </div>
          ))}
        </div>

        {/* Historical FC share */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
          TN's Share Across Finance Commissions
        </h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: '2.5rem' }}>
          {FC_HISTORY.map((fc, i) => (
            <div key={fc.fc} style={{
              display: 'grid', gridTemplateColumns: '90px 110px 80px 1fr', alignItems: 'center',
              padding: '0.55rem 1rem', gap: '0.5rem',
              borderBottom: i < FC_HISTORY.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.83rem' }}>{fc.fc}</span>
              <span style={{ color: 'var(--ink-3)', fontSize: '0.78rem' }}>{fc.years}</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 600, fontSize: '0.88rem' }}>{fc.tn_share_pct}%</span>
              <span style={{ color: 'var(--ink-2)', fontSize: '0.78rem', lineHeight: 1.5 }}>{fc.note}</span>
            </div>
          ))}
        </div>

        {/* TN grievances */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--ink)' }}>
          Tamil Nadu's Fiscal Grievances
        </h2>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
          TN consistently argues it is under-compensated for its fiscal effort and social development outcomes. These are evidence-based policy positions, not partisan claims.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
          {TN_GRIEVANCES_FC.map(gr => (
            <div key={gr.issue} style={{ border: '1px solid var(--border)', borderLeft: '3px solid #946010', borderRadius: 6, padding: '0.875rem 1.1rem', background: 'var(--bg)' }}>
              <p style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '0.87rem', margin: '0 0 0.3rem' }}>{gr.issue}</p>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.82rem', margin: '0 0 0.3rem', lineHeight: 1.6 }}>{gr.detail}</p>
              <p style={{ color: 'var(--ink-4)', fontSize: '0.72rem', margin: 0 }}>Source: {gr.cite}</p>
            </div>
          ))}
        </div>

        {/* RTI guide */}
        <div style={{ background: '#EBF3FF', border: '1px solid #A3C0E8', borderRadius: 8, padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <p style={{ color: '#1A3C6E', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 0.5rem' }}>Track the money with RTI</p>
          <ul style={{ color: '#1A3C6E', fontSize: '0.82rem', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.9, opacity: 0.85 }}>
            <li>Ask TN Finance Dept: <em>"Monthly tax devolution amounts received from Centre for 2023-24"</em></li>
            <li>Ask Line Dept: <em>"CSS fund releases received from Centre and UCs submitted for [scheme]"</em></li>
            <li>Ask TN Revenue Dept: <em>"SDRF balance and expenditure for Cyclone Michaung 2023"</em></li>
            <li>Check <strong>AG Tamil Nadu website</strong> for Finance Accounts (receipts and payments by major head)</li>
            <li>CAG Report on State Finances (TN) tabled in Assembly — freely available at cag.gov.in</li>
          </ul>
        </div>

        <SourceCitation org="15th Finance Commission" document="Final Report: Finance Commission in COVID Times" year="2021" url="https://fincomindia.nic.in" />
        <SourceCitation org="Finance Dept, TN" document="Budget at a Glance 2024-25" year="2024" url="https://finance.tn.gov.in" />
        <SourceCitation org="CAG of India" document="Report on State Finances — Tamil Nadu 2022-23" year="2023" url="https://cag.gov.in" />
      </main>
    </>
  )
}
