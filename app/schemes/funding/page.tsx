'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'

const FUNDING_TYPES = [
  {
    id: 'css',
    label: 'Centrally Sponsored Schemes',
    short: 'CSS',
    color: '#1A3C6E',
    bg: '#EBF3FF',
    ratio_center: 60,
    ratio_state: 40,
    ratio_label: '60:40 (Centre:State)',
    ratio_ne: '90:10 for NE & Hill states',
    examples: ['MGNREGS', 'Jal Jeevan Mission', 'PM Awas Yojana', 'National Health Mission', 'PMEGP'],
    how_it_flows: [
      'Parliament approves Union Budget allocation for the scheme',
      'Ministry of Finance releases funds to nodal Central Ministry',
      'Central Ministry signs MoU / transfer to State Government',
      'Finance Dept (State) routes to Line Department',
      'Line Department releases to District / Block / Implementing Agency',
      'Direct Benefit Transfer (DBT) to beneficiary bank account or physical delivery',
    ],
    notes: 'State must submit Utilisation Certificates (UCs) for prior releases before next tranche is released. Unspent funds lapse at year-end unless rolled over.',
    rti_dept: 'Finance Dept + Nodal State Ministry',
  },
  {
    id: 'cs',
    label: 'Central Sector Schemes',
    short: 'CS',
    color: '#1A5C38',
    bg: '#F2F8F4',
    ratio_center: 100,
    ratio_state: 0,
    ratio_label: '100% Centre',
    ratio_ne: '100% Centre',
    examples: ['PM Kisan', 'PMGDISHA', 'PM SVANidhi', 'Soil Health Card', 'PM Surya Ghar'],
    how_it_flows: [
      'Parliament approves; funds stay with Central Ministry',
      'Central Ministry directly transfers to implementing agency or beneficiary',
      'State Government may act as "facilitation" layer only',
      'DBT / PFMS tracks transfers to individual accounts',
    ],
    notes: 'State has no financial stake. State\'s role is mostly data collection, awareness, and last-mile facilitation. RTI must go to Central Ministry directly.',
    rti_dept: 'Nodal Central Ministry',
  },
  {
    id: 'state',
    label: 'State Scheme (State-funded)',
    short: 'SS',
    color: '#946010',
    bg: '#FDF6EC',
    ratio_center: 0,
    ratio_state: 100,
    ratio_label: '100% State',
    ratio_ne: '100% State',
    examples: ['Kalaignar Magalir Urimai Thogai', 'Chief Minister\'s Breakfast Scheme', 'Free Bus Pass', 'Moovalur Ramamirtham Scheme', 'CM\'s Free Laptop'],
    how_it_flows: [
      'TN Budget presented by Finance Minister in February–March',
      'Scheme allocation approved by TN Legislative Assembly',
      'Finance Dept releases to Line Department quarterly',
      'Line Dept disburses via treasury or DBT',
      'CAG of TN audits expenditure annually',
    ],
    notes: 'TN\'s fiscal health directly affects scheme budgets. Revenue deficit / FRBM limits can cause mid-year cuts. Check CAG TN reports for fund utilisation.',
    rti_dept: 'TN Finance Dept + Nodal Line Dept',
  },
  {
    id: 'css_modified',
    label: 'CSS with State Modification',
    short: 'CSS-M',
    color: '#5B21B6',
    bg: '#F3F0FF',
    ratio_center: 60,
    ratio_state: 40,
    ratio_label: '60:40 base; State tops up',
    ratio_ne: 'Varies',
    examples: ['Mid-Day Meal (TN top-up)', 'National Scholarship (TN additional)', 'PMAY with TN subsidy'],
    how_it_flows: [
      'Base CSS funds flow Centre → State → Dept (standard path)',
      'State adds its own top-up from State Budget',
      'Combined benefit delivered to beneficiary',
      'Two separate accounting heads — one CSS, one State',
    ],
    notes: 'TN often enhances Central schemes (e.g. Mid-Day Meal includes egg/banana). The State component is audited by CAG TN; the Central component by CAG of India.',
    rti_dept: 'Nodal Line Dept (for both components)',
  },
  {
    id: 'cess',
    label: 'Cess-funded Welfare Boards',
    short: 'CESS',
    color: '#B83232',
    bg: '#FDF2F2',
    ratio_center: 0,
    ratio_state: 100,
    ratio_label: 'Cess on sector employers',
    ratio_ne: 'N/A',
    examples: ['Construction Workers Welfare Board', 'Unorganised Workers Welfare', 'Beedi Workers Fund'],
    how_it_flows: [
      'Employers pay cess (typically 1% of construction cost or payroll)',
      'Cess collected by Welfare Board as statutory body',
      'Board\'s tripartite committee approves benefit rates',
      'Benefits disbursed to registered workers directly',
    ],
    notes: 'Worker must register with board. Benefits (scholarship, accident, marriage, funeral, housing) available only to registered members. Cess funds are NOT Consolidated Fund — separate audit trail.',
    rti_dept: 'Respective Welfare Board (statutory body)',
  },
]

const BUDGET_CYCLE = [
  { month: 'Jan–Feb',   event: 'Budget preparation: Line Depts submit demand estimates to Finance Dept' },
  { month: 'Feb–Mar',   event: 'TN Budget presented; Assembly passes Appropriation Bill' },
  { month: 'Apr',       event: 'New financial year begins; Finance Dept releases Q1 funds (25%)' },
  { month: 'Apr–Jun',   event: 'Central CSS funds released after UC submission; state matching released' },
  { month: 'Jul',       event: 'Q2 release (25%); supplementary demands filed if under-budgeted' },
  { month: 'Oct',       event: 'Q3 release (25%); revised estimates submitted' },
  { month: 'Dec–Jan',   event: 'Rush spending risk — depts try to utilise funds before year-end' },
  { month: 'Jan',       event: 'Q4 release (25%); third supplementary estimates tabled' },
  { month: 'Mar 31',    event: 'Financial year ends; unspent appropriations lapse; UCs due' },
]

const KEY_TERMS = [
  { term: 'UC (Utilisation Certificate)', def: 'Proof that previous funds were spent correctly. Required to receive next tranche of Central funds.' },
  { term: 'PFMS', def: 'Public Financial Management System — Centre\'s real-time fund-tracking platform. DBT transfers flow through this.' },
  { term: 'FRBM', def: 'Fiscal Responsibility & Budget Management Act — caps TN\'s fiscal deficit at 3% of GSDP. Limits new scheme spending.' },
  { term: 'Revised Estimates (RE)', def: 'Mid-year correction to original Budget Estimates; indicates whether a scheme is over- or under-spent.' },
  { term: 'Actuals', def: 'Final actual expenditure after the year closes; audited by CAG. Compare to RE to gauge slippage.' },
  { term: 'Plan vs Non-Plan', def: 'Abolished since 2017-18; now called Capital Expenditure (asset-creating) vs Revenue Expenditure (recurring).' },
  { term: 'DBT', def: 'Direct Benefit Transfer — cash/subsidy goes straight to beneficiary\'s Aadhaar-linked bank account. Reduces leakage.' },
  { term: 'SDG Fund / TN Welfare Fund', def: 'Earmarked funds created by State for specific purposes; managed outside Consolidated Fund (e.g. CM\'s Relief Fund).' },
]

function RatioBar({ center, state }: { center: number; state: number }) {
  return (
    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', margin: '0.35rem 0' }}>
      {center > 0 && (
        <div style={{ flex: center, background: '#1A3C6E' }} title={`Centre ${center}%`} />
      )}
      {state > 0 && (
        <div style={{ flex: state, background: '#946010' }} title={`State ${state}%`} />
      )}
    </div>
  )
}

export default function SchemeFundingPage() {
  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--ink)' }}>
          How Government Schemes Are Funded
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
          அரசு திட்டங்கள் எப்படி நிதியளிக்கப்படுகின்றன
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', margin: '0 0 2.5rem', maxWidth: 600, lineHeight: 1.7 }}>
          Every welfare scheme has a funding source — Centre, State, or both. The funding type determines who controls the money,
          who can be held accountable, and how to file an RTI if funds are missing.
        </p>

        {/* Funding type cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {FUNDING_TYPES.map(ft => (
            <div key={ft.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: ft.bg, padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: ft.color, color: '#fff',
                  fontFamily: 'var(--mono)', fontSize: '0.72rem', fontWeight: 700,
                  padding: '0.2rem 0.6rem', borderRadius: 3,
                }}>{ft.short}</span>
                <span style={{ color: ft.color, fontWeight: 700, fontSize: '1rem' }}>{ft.label}</span>
              </div>

              <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {/* Funding ratio */}
                <div>
                  <p style={{ color: 'var(--ink-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.4rem' }}>Funding split</p>
                  <RatioBar center={ft.ratio_center} state={ft.ratio_state} />
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#1A3C6E' }}>■ Centre {ft.ratio_center}%</span>
                    <span style={{ fontSize: '0.75rem', color: '#946010' }}>■ State {ft.ratio_state}%</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0.35rem 0 0' }}>{ft.ratio_label}</p>
                  {ft.ratio_ne !== ft.ratio_label && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--ink-4)', margin: '0.15rem 0 0' }}>{ft.ratio_ne}</p>
                  )}

                  <p style={{ color: 'var(--ink-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1rem 0 0.35rem' }}>Examples</p>
                  <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--ink-2)', fontSize: '0.8rem', lineHeight: 1.8 }}>
                    {ft.examples.map(ex => <li key={ex}>{ex}</li>)}
                  </ul>
                </div>

                {/* Money flow */}
                <div>
                  <p style={{ color: 'var(--ink-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Money flow</p>
                  <ol style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--ink-2)', fontSize: '0.8rem', lineHeight: 1.9 }}>
                    {ft.how_it_flows.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>

                  <div style={{ marginTop: '0.75rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.6rem 0.75rem' }}>
                    <p style={{ color: 'var(--ink-3)', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.2rem' }}>Note</p>
                    <p style={{ color: 'var(--ink-2)', fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>{ft.notes}</p>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0.6rem 0 0' }}>
                    RTI to: <strong style={{ color: 'var(--ink)' }}>{ft.rti_dept}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Budget cycle */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
          Tamil Nadu Budget Cycle
        </h2>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
          The TN financial year runs April 1 – March 31. Fund releases to departments follow a quarterly pattern with a chronic year-end spending rush.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: '2.5rem' }}>
          {BUDGET_CYCLE.map((row, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0', alignItems: 'stretch',
              borderBottom: i < BUDGET_CYCLE.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)',
            }}>
              <div style={{ width: 90, flexShrink: 0, padding: '0.6rem 0.75rem', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>{row.month}</span>
              </div>
              <div style={{ flex: 1, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--ink-2)', fontSize: '0.82rem', lineHeight: 1.5 }}>{row.event}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Key terms */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
          Key Terms Explained
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.6rem', marginBottom: '2.5rem' }}>
          {KEY_TERMS.map(kt => (
            <div key={kt.term} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem 1rem' }}>
              <p style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '0.82rem', margin: '0 0 0.25rem' }}>{kt.term}</p>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>{kt.def}</p>
            </div>
          ))}
        </div>

        {/* RTI guide */}
        <div style={{ background: '#FDF6EC', border: '1px solid #E8C87A', borderRadius: 8, padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <p style={{ color: '#946010', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 0.5rem' }}>RTI: Follow the Money</p>
          <ul style={{ color: '#6B4A10', fontSize: '0.82rem', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.9 }}>
            <li>For <strong>CSS schemes</strong>: file with the State Nodal Department + Central Ministry for fund release records</li>
            <li>Ask for <strong>Statement of Expenditure</strong> and <strong>Utilisation Certificates</strong> filed to Centre</li>
            <li>For <strong>State schemes</strong>: file with Line Department; ask for <strong>Demand No., Major Head, and Sub-head</strong></li>
            <li>Check <strong>CAG Report TN</strong> (tabled in Assembly) for scheme-specific audit paragraphs</li>
            <li>PFMS portal (<code>pfms.nic.in</code>) shows DBT flows — cite payment IDs in RTI</li>
          </ul>
        </div>

        <SourceCitation org="Finance Department, TN" document="Budget in Brief &amp; Detailed Demands for Grants" year="2024" url="https://finance.tn.gov.in" />
        <SourceCitation org="CAG of India" document="Report on State Finances — Tamil Nadu" year="2023" url="https://cag.gov.in" />
        <SourceCitation org="Ministry of Finance" document="CSS Financing Pattern Guidelines" year="2022" url="https://finmin.nic.in" />
      </main>
    </>
  )
}
