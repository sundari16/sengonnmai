'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import Link from 'next/link'

type Journey = {
  id: string
  title_en: string
  title_ta: string
  desc_en: string
  steps: { step: string; timeline?: string; body_en: string }[]
  dept_en: string
  dept_slug?: string
  rti_tip?: string
}

const JOURNEYS: Journey[] = [
  {
    id: 'birth-cert',
    title_en: 'Get a birth certificate',
    title_ta: 'பிறப்புச் சான்றிதழ் பெறுவது',
    desc_en: 'Required for school admissions, passports, and many government schemes. Must be registered within 21 days of birth.',
    dept_en: 'Municipal Administration / Revenue',
    dept_slug: 'municipal-administration',
    steps: [
      { step: '1', timeline: 'Within 21 days', body_en: 'Report birth at the local registrar: Corporation/Municipality ward office or Village Panchayat office. Free if done within 21 days.' },
      { step: '2', timeline: '1–7 days', body_en: 'Registrar issues birth certificate. Hospital births: hospital usually registers on your behalf. Home births: parents must report.' },
      { step: '3', timeline: 'Anytime after', body_en: 'If late (after 21 days), approach Executive Magistrate for late registration. Fee applies. May need affidavit.' },
    ],
    rti_tip: 'If certificate is delayed beyond 7 days, file RTI with the registrar asking for the specific reason for delay and expected issue date.',
  },
  {
    id: 'ration-card',
    title_en: 'Get or update a ration card',
    title_ta: 'ஆதார் அட்டை / குடும்ப அட்டை பெறுவது',
    desc_en: 'Ration cards (Family Cards) are issued by the Civil Supplies Department and give access to subsidised food grains at PDS shops.',
    dept_en: 'Civil Supplies & Consumer Protection',
    steps: [
      { step: '1', body_en: 'Visit the nearest Taluk Office or Civil Supplies Office. Bring Aadhaar, voter ID, and proof of address.' },
      { step: '2', timeline: '15–30 days', body_en: 'Submit Form A (new card) or Form B (addition/deletion of member). Pay prescribed fee.' },
      { step: '3', timeline: 'After approval', body_en: 'Card issued after field verification by Revenue Inspector. Link with Aadhaar mandatory.' },
      { step: '4', body_en: 'For corrections or migration, visit the same office with updated documents.' },
    ],
    rti_tip: 'If your application is pending beyond 30 days, file RTI asking for current status, the officer responsible, and reason for delay.',
  },
  {
    id: 'patta',
    title_en: 'Get a Patta (land record) and Chitta',
    title_ta: 'பட்டா மற்றும் சிட்டா பெறுவது',
    desc_en: 'Patta is the primary document establishing ownership of land in Tamil Nadu. Essential for any land transaction or bank loan.',
    dept_en: 'Revenue Department',
    dept_slug: 'revenue',
    steps: [
      { step: '1', body_en: 'Apply online at tnreginet.gov.in or at the Taluk Office. You need the survey number (சர்வே நம்பர்) of the land.' },
      { step: '2', timeline: '3–7 days', body_en: 'VAO (Village Administrative Officer) verifies field records. Taluk Office issues certified Patta & Chitta.' },
      { step: '3', body_en: 'For mutation (after purchase), submit registered sale deed + application. Mutation updates the revenue register.' },
    ],
    rti_tip: 'If mutation is delayed, file RTI with Tahsildar asking for current status of the mutation application by registration number.',
  },
  {
    id: 'income-cert',
    title_en: 'Get an income certificate',
    title_ta: 'வருமானச் சான்றிதழ் பெறுவது',
    desc_en: 'Required for fee concessions, OBC/EBC category benefits, and scheme eligibility. Issued by the Revenue Department.',
    dept_en: 'Revenue Department',
    dept_slug: 'revenue',
    steps: [
      { step: '1', body_en: 'Apply online via Tamil Nadu Government\'s e-Sevai portal or visit the nearest Taluk Office / CSC (Common Service Centre).' },
      { step: '2', timeline: '7–15 days', body_en: 'VAO verifies income. Tahsildar or Revenue Divisional Officer issues the certificate.' },
      { step: '3', body_en: 'Certificate is valid for 3 years. For scheme applications, check if the scheme requires a certificate of specific vintage.' },
    ],
    rti_tip: 'Under the TN Public Services Guarantee Act, income certificates must be issued within 15 days. Delay can be escalated to the designated appeals officer.',
  },
  {
    id: 'school-admission',
    title_en: 'RTE school admission (Class 1)',
    title_ta: 'RTE — 1-ம் வகுப்பு சேர்க்கை',
    desc_en: 'Under the Right to Education Act, 25% of seats in private unaided schools are reserved for economically weaker sections (EWS). Free for Classes 1–8.',
    dept_en: 'School Education',
    dept_slug: 'school-education',
    steps: [
      { step: '1', timeline: 'Feb–Mar each year', body_en: 'Notification issued by School Education Department. Apply online at rte.tnschools.gov.in or at DEO office.' },
      { step: '2', body_en: 'Submit income certificate (< ₹2 lakh/year for EWS), address proof, child\'s age proof, caste certificate if applicable.' },
      { step: '3', timeline: 'April', body_en: 'Lottery conducted for oversubscribed schools. Parents notified of allotted school.' },
      { step: '4', timeline: 'June', body_en: 'Admission confirmed. School cannot charge any fee from RTE students for Classes 1–8.' },
    ],
    rti_tip: 'If a school denies admission after RTE allotment, file a complaint with the Block Education Officer. RTI can be used to get the lottery result data for your ward.',
  },
  {
    id: 'pension-apply',
    title_en: 'Apply for old-age / widow pension',
    title_ta: 'முதுமை / விதவை உதவித்தொகை விண்ணப்பிக்க',
    desc_en: 'Under Indira Gandhi National Old Age Pension Scheme (IGNOAPS) and TN state schemes, eligible seniors and widows receive monthly pensions.',
    dept_en: 'Social Welfare & Women Empowerment',
    dept_slug: 'welfare',
    steps: [
      { step: '1', body_en: 'Visit the Village Panchayat office or Urban Ward office. Bring age proof (60+ for old-age), Aadhaar, bank account details, income certificate.' },
      { step: '2', timeline: '30–60 days', body_en: 'Application verified by CDPO (Child Development Project Officer) or Social Welfare Inspector.' },
      { step: '3', body_en: 'Pension disbursed monthly via bank account. DBT (Direct Benefit Transfer) is now mandatory.' },
      { step: '4', body_en: 'Annual verification (life certificate) required — done at post office or bank. Aadhaar-based biometric verification being rolled out.' },
    ],
    rti_tip: 'If pension is approved but not disbursed, file RTI with CDPO asking for disbursement status and DBT transaction reference.',
  },
  {
    id: 'property-tax',
    title_en: 'Pay and dispute property tax',
    title_ta: 'சொத்து வரி செலுத்துதல் மற்றும் மறுப்பு',
    desc_en: 'Property tax is the primary revenue source for local bodies. Assessment disputes are common after revaluations.',
    dept_en: 'Municipal Administration',
    dept_slug: 'municipal-administration',
    steps: [
      { step: '1', body_en: 'Check your property tax demand on the corporation/municipality portal or at the ward office. Note the Assessment Number.' },
      { step: '2', body_en: 'Pay online (tnurban.tn.gov.in for ULBs) or at the ward office. Two installments: half-yearly in April and October.' },
      { step: '3', body_en: 'If the assessment seems too high, file an objection petition at the ward office within 30 days of the demand notice.' },
      { step: '4', timeline: '60 days', body_en: 'Appellate authority hears the objection. If unsatisfied, further appeal to the Special Original Petition before High Court.' },
    ],
    rti_tip: 'File RTI asking for the calculation basis for your specific property assessment — plinth area, depreciation rate, and basic street rate used.',
  },
  {
    id: 'ration-complaint',
    title_en: 'Complain about PDS / ration shop',
    title_ta: 'ரேஷன் கடை புகார் செய்வது',
    desc_en: 'Ration shop irregularities (quantity, quality, denial) can be reported. Multiple escalation levels available.',
    dept_en: 'Civil Supplies / Food & Consumer Protection',
    steps: [
      { step: '1', body_en: 'First complain to the Area Inspector, Civil Supplies, for your area. Get the complaint number in writing.' },
      { step: '2', body_en: 'If unresolved, escalate to the Deputy Commissioner / Assistant Commissioner (Civil Supplies) at the district level.' },
      { step: '3', body_en: 'For persistent issues, file RTI with the Civil Supplies Department asking for stock allocation vs distribution records for your shop.' },
      { step: '4', body_en: 'Online complaint: call 1967 (National Food Security Act helpline) or tnepds.gov.in grievance portal.' },
    ],
    rti_tip: 'Ask for the register of stock receipt and issue for your ration shop for the past 3 months — this will reveal if quantities are being diverted.',
  },
]

function JourneyCard({ j, open, onToggle }: { j: Journey; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: '0.875rem' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', background: open ? 'var(--bg-2)' : 'var(--bg)',
          border: 'none', cursor: 'pointer', padding: '1rem 1.125rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', margin: '0 0 0.2rem', lineHeight: 1.4 }}>{j.title_en}</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', margin: '0 0 0.25rem' }}>{j.title_ta}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>{j.desc_en}</p>
        </div>
        <span style={{ fontSize: '1rem', color: 'var(--ink-3)', flexShrink: 0, marginTop: '0.2rem' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '1rem 1.125rem', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>Department:</span>
            {j.dept_slug ? (
              <Link href={`/dept/${j.dept_slug}`} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                {j.dept_en} →
              </Link>
            ) : (
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-2)' }}>{j.dept_en}</span>
            )}
          </div>

          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: '0 0 1rem' }}>
            {j.steps.map(s => (
              <li key={s.step} style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.75rem' }}>
                <div style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                }}>
                  {s.step}
                </div>
                <div style={{ flex: 1, paddingTop: '0.3rem' }}>
                  {s.timeline && (
                    <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 600, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.05rem 0.4rem', color: 'var(--ink-3)', marginBottom: '0.25rem' }}>
                      {s.timeline}
                    </span>
                  )}
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>{s.body_en}</p>
                </div>
              </li>
            ))}
          </ol>

          {j.rti_tip && (
            <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', borderRadius: '0 6px 6px 0', padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--flag-amber)' }}>RTI tip: </strong>{j.rti_tip}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

export default function CitizenGuidePage() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>

        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
          Citizen Services Guide
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1rem', margin: '0 0 0.5rem' }}>
          குடிமக்கள் சேவை வழிகாட்டி
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', margin: '0 0 2rem', maxWidth: 640, lineHeight: 1.7 }}>
          Step-by-step journeys for the most common government services in Tamil Nadu.
          Each guide includes timelines, documents needed, escalation paths, and RTI tips if you face delays.
        </p>

        {/* Quick stat strip */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Services covered', value: String(JOURNEYS.length) },
            { label: 'RTI-enabled journeys', value: String(JOURNEYS.filter(j => j.rti_tip).length) },
            { label: 'Departments involved', value: '6+' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem 1rem', minWidth: 120 }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--ink-3)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ink)', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Timelines and procedures may vary by district and change with government orders. Verify current requirements at the relevant department before applying.
          All RTI templates are suggestions — adapt to your specific situation.
        </div>

        {/* Journey accordions */}
        <div>
          {JOURNEYS.map(j => (
            <JourneyCard
              key={j.id}
              j={j}
              open={openId === j.id}
              onToggle={() => setOpenId(prev => prev === j.id ? null : j.id)}
            />
          ))}
        </div>

        {/* General escalation guide */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', marginTop: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>
            General escalation ladder
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
            If you don't get a response at any level, escalate upward. Document everything in writing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { level: '1', who: 'Front-line officer / ward officer', body_en: 'First point of contact. Submit applications in writing, get acknowledgement receipt.' },
              { level: '2', who: 'Block / Taluk level officer (Tahsildar / BDO / BEO)', body_en: 'Escalate if front-line officer doesn\'t respond within the notified timeline.' },
              { level: '3', who: 'District Collector / District-level head of department', body_en: 'For persistent non-response or wrongful denial. Written petition + any correspondence trail.' },
              { level: '4', who: 'RTI application', body_en: 'File RTI at any point to understand why your application is stuck. PIO must respond in 30 days. Free if below poverty line.' },
              { level: '5', who: 'Grievance portals & TNGAG', body_en: 'cms.tn.gov.in (Chief Minister\'s Grievance Cell) for state-level escalation. pgportal.gov.in for central schemes.' },
              { level: '6', who: 'State Information Commission / TNLA petition / High Court', body_en: 'For RTI denials or serious rights violations. Legal aid available under NALSA/TLSC.' },
            ].map((r, i) => (
              <div key={r.level} style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-3)' }}>
                  {r.level}
                </div>
                <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)', margin: '0 0 0.25rem' }}>{r.who}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>{r.body_en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <SourceCitation
            org="TN e-Sevai, TN Public Services Guarantee Act, RTI Act 2005, TNGA Handbook"
            document="Compiled from government portal SOPs and RTI responses"
            year="2024"
            url="https://tn.gov.in"
          />
        </div>
      </main>
    </>
  )
}
