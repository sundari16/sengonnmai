'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import DeptCard from '@/components/dept/DeptCard'
import { DEPARTMENTS, getDeptsByType, formatCr } from '@/lib/departments'
import DataProvider from '@/lib/data-provider'

const FILTER_TYPES = ['all', 'welfare', 'revenue', 'infrastructure', 'administration'] as const
type FilterType = typeof FILTER_TYPES[number]

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'All',
  welfare: 'Welfare',
  revenue: 'Revenue',
  infrastructure: 'Infrastructure',
  administration: 'Administration',
}

const RIGHTS = [
  {
    title_en: 'RTI response in 30 days',
    title_ta: 'RTI பதில் 30 நாட்களில்',
    body: 'Any government department must respond to your information request within 30 days. 48 hours for life/liberty cases.',
    law: 'RTI Act 2005 · Section 7',
  },
  {
    title_en: 'MGNREGA work within 15 days',
    title_ta: 'MGNREGA வேலை 15 நாட்களில்',
    body: 'Any rural household can demand 100 days of guaranteed employment per year. Work must begin within 15 days.',
    law: 'MGNREGA 2005 · Section 3',
  },
  {
    title_en: 'Ration card within 30 days',
    title_ta: 'ரேஷன் அட்டை 30 நாட்களில்',
    body: 'Every eligible family is entitled to a ration card within 30 days of application under the National Food Security Act.',
    law: 'Food Security Act 2013 · Section 10',
  },
  {
    title_en: 'Patta transfer within 45 days',
    title_ta: 'பட்டா மாற்றம் 45 நாட்களில்',
    body: 'Land patta transfer must be completed within 45 days of a valid application under TN land administration rules.',
    law: 'TN Land Reform Rules · Revenue Standing Order',
  },
]

const RUPEE_ROWS = [
  { label: 'Staff salaries', amount: 28, color: 'var(--ink-3)', ta: 'ஊழியர் சம்பளம்' },
  { label: 'Interest on loans', amount: 21, color: 'var(--flag-red)', ta: 'கடன் வட்டி ⚑' },
  { label: 'Pensions', amount: 14, color: 'var(--ink-3)', ta: 'ஓய்வூதியம்' },
  { label: 'Education', amount: 14, color: 'var(--flag-green)', ta: 'கல்வி' },
  { label: 'Energy / TANGEDCO losses', amount: 5, color: 'var(--flag-amber)', ta: 'TANGEDCO நஷ்டம்' },
  { label: 'Health', amount: 5, color: 'var(--flag-green)', ta: 'சுகாதாரம்' },
  { label: 'All other 40 departments', amount: 13, color: 'var(--ink-3)', ta: 'மற்ற 40 துறைகள்' },
]

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const filteredDepts = getDeptsByType(activeFilter)
  const totalBudget = DEPARTMENTS.find(d => d.id === 'finance')?.budget_cr ?? 439293
  const deptCount = DataProvider.getAllDepts().length
  const schemeCount = DataProvider.getSchemeCounts().total

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar />
      <Nav />

      {/* HERO */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
              TAMIL NADU · PUBLIC ACCOUNTS
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, margin: '0 0 1rem 0' }}>
              Your money.<br />Their record.<br />Your right to know.
            </h1>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--ink-3)', marginBottom: '1.5rem' }}>
              உங்கள் பணம். அவர்கள் கணக்கு. உங்கள் உரிமை.
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--ink-2)', maxWidth: '500px', marginBottom: '2rem' }}>
              Every rupee the TN government spends comes from citizens. This platform tracks where it goes, what it does, and what independent audits say about it. Sourced. Citable. Disputable.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Budget', value: formatCr(totalBudget) },
                { label: 'Departments', value: `${deptCount} departments` },
                { label: 'Schemes tracked', value: `${schemeCount} schemes` },
                { label: 'Data vintage', value: '2024-25' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: '8px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginTop: '2px' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 4 doors */}
          <div style={{ border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--bg-2)', padding: '14px 18px', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>Where do you want to start?</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>எங்கிருந்து தொடங்க விரும்புகிறீர்கள்?</div>
            </div>
            {[
              { en: 'Understand a department', ta: 'ஒரு துறையை புரிந்துகொள்ள', href: '#departments' },
              { en: 'Find a scheme I may qualify for', ta: 'நான் தகுதியான திட்டங்கள்', href: '/schemes' },
              { en: 'Know my legal rights', ta: 'என் சட்டப்பூர்வ உரிமைகள்', href: '/rights' },
              { en: 'See how my money is spent', ta: 'என் பணம் எப்படி செலவாகிறது', href: '/budget' },
            ].map((door, i) => (
              <a key={i} href={door.href}
                onClick={door.href.startsWith('#') ? (e) => { e.preventDefault(); document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth' }) } : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < 3 ? '0.5px solid var(--border)' : 'none', textDecoration: 'none', background: 'var(--bg)', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{door.en}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '1px' }}>{door.ta}</div>
                </div>
                <span style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 300 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RUPEE BREAKDOWN */}
      <section style={{ background: 'var(--bg-2)', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ padding: 'clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem)', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
            For every ₹100 the government spends
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '1.5rem' }}>அரசு செலவிடும் ஒவ்வொரு ₹100-க்கும்</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '680px' }}>
            {RUPEE_ROWS.map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700, color: row.color, width: '48px', flexShrink: 0 }}>₹{row.amount}</div>
                <div style={{ flex: 1, height: '20px', background: 'var(--bg-3)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.amount}%`, height: '100%', background: row.color, opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink-2)', minWidth: '200px' }}>{row.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', background: 'var(--flag-red-bg)', border: '0.5px solid var(--flag-red)', borderRadius: '8px', padding: '12px 16px', maxWidth: '680px', fontSize: '13px', color: 'var(--flag-red)', lineHeight: 1.6 }}>
            <strong>₹63 of every ₹100</strong> is committed to salaries, interest, and pensions before a single scheme or service begins. This is true across all governments.
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>
            Source: PRS India · TN Budget Analysis 2024-25 · prsindia.org
          </div>
        </div>
      </section>

      {/* DEPARTMENTS GRID */}
      <section id="departments" style={{ padding: 'clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>All departments</h2>
            <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginTop: '3px' }}>அனைத்து துறைகளும்</div>
          </div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-4)' }}>TN Budget 2024-25 · tnbudget.tn.gov.in</div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {FILTER_TYPES.map(type => (
            <button key={type} onClick={() => setActiveFilter(type)}
              style={{
                padding: '5px 14px', borderRadius: '20px', border: '0.5px solid',
                borderColor: activeFilter === type ? 'var(--accent)' : 'var(--border)',
                background: activeFilter === type ? 'var(--accent)' : 'transparent',
                color: activeFilter === type ? '#fff' : 'var(--ink-3)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--sans)',
              }}>
              {FILTER_LABELS[type]}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {filteredDepts.map(dept => <DeptCard key={dept.id} dept={dept} />)}
        </div>
      </section>

      {/* RIGHTS STRIP */}
      <section style={{ background: 'var(--accent)' }}>
        <div style={{ padding: 'clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem)', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            What you are legally owed
          </h2>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>உங்களுக்கு சட்டப்பூர்வமாக வழங்கப்பட வேண்டியவை</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
            These are not schemes. These are enforceable rights.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {RIGHTS.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px', border: '0.5px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{r.title_en}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>{r.title_ta}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: '10px' }}>{r.body}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{r.law}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/rights" style={{ display: 'inline-block', padding: '10px 20px', background: '#fff', color: 'var(--accent)', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
              See all your rights →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--ink)', color: '#fff' }}>
        <div style={{ padding: 'clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem)', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Sengonnmai</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>செங்கொன்னமை</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Tamil Nadu public accounts in plain language. Non-partisan. Open source.</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Departments</div>
              {['Health', 'Education', 'Finance', 'Agriculture'].map(d => (
                <Link key={d} href={`/dept/${d.toLowerCase()}`} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '5px' }}>{d}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Data</div>
              {[['Schemes', '/schemes'], ['Budget', '/budget'], ['Rights', '/rights']].map(([label, href]) => (
                <Link key={label} href={href} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '5px' }}>{label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>About</div>
              <Link href="/about" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '5px' }}>About & Methodology</Link>
              <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>MIT Licence · Open Source</div>
            </div>
          </div>
          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Sources: tnbudget.tn.gov.in · cag.gov.in · prsindia.org · tnassembly.gov.in · nhm.gov.in · rchiips.org/nfhs
            <br />All data from official TN government records. Every claim citable. Dispute any claim.
          </div>
        </div>
      </footer>
    </div>
  )
}
