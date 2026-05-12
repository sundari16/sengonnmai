'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import RTITooltip from '@/components/ui/RTITooltip'
import SourceCitation from '@/components/ui/SourceCitation'
import {
  TN_RESERVATION_CATEGORIES,
  RESERVATION_CONTEXTS,
  CERTIFICATE_TYPES,
  EWS_DETAILS,
  RESERVATION_FAQS,
  getTotalTNReservationPct,
  getUnreservedPct,
} from '@/lib/reservation-data'

const CATEGORY_COLORS: Record<string, string> = {
  sc:  '#B83232',
  st:  '#946010',
  mbc: '#1A3C6E',
  bc:  '#1A4731',
  bcm: '#5B21B6',
}

function ReservationBar() {
  const categories = TN_RESERVATION_CATEGORIES
  const unreserved = getUnreservedPct()
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', height: 40, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
        {categories.map(c => (
          <div
            key={c.id}
            title={`${c.abbreviation}: ${c.pct_tn}%`}
            style={{
              width: `${c.pct_tn}%`, height: '100%',
              background: CATEGORY_COLORS[c.id] ?? '#888',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', color: '#fff', fontWeight: 700,
              overflow: 'hidden',
            }}
          >
            {c.pct_tn >= 5 ? `${c.abbreviation} ${c.pct_tn}%` : ''}
          </div>
        ))}
        <div style={{
          width: `${unreserved}%`, height: '100%',
          background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', color: 'var(--ink-2)', fontWeight: 700,
        }}>
          OC {unreserved}%
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', marginTop: '0.75rem' }}>
        {categories.map(c => (
          <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--ink-2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: CATEGORY_COLORS[c.id], display: 'inline-block' }} />
            {c.abbreviation} {c.pct_tn}%
          </span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--ink-2)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bg-3)', border: '1px solid var(--border)', display: 'inline-block' }} />
          Open Competition {unreserved}%
        </span>
      </div>
    </div>
  )
}

function CertCard({ cert }: { cert: typeof CERTIFICATE_TYPES[0] }) {
  const isDelayed = cert.processing_days_actual > cert.processing_days_official
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', background: 'var(--bg)' }}>
      <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.92rem', margin: '0 0 0.15rem' }}>{cert.name_en}</p>
      <p style={{ color: 'var(--ink-3)', fontSize: '0.78rem', margin: '0 0 0.75rem' }}>{cert.name_ta}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--ink-2)', marginBottom: '0.75rem' }}>
        <span><strong>Issued by:</strong> {cert.issued_by_en}</span>
        <span><strong>Fee:</strong> {cert.fee_rs === 0 ? 'Free' : `₹${cert.fee_rs}`}</span>
        <span style={{ color: isDelayed ? '#B83232' : 'var(--ink-2)' }}>
          <strong>Official: </strong>{cert.processing_days_official}d | <strong>Actual: </strong>{cert.processing_days_actual}d
          {isDelayed && ' ⚠'}
        </span>
        <span><strong>Valid:</strong> {cert.validity_en}</span>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: '0 0 0.25rem' }}>Used for:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {cert.where_used_en.slice(0, 3).map((u, i) => (
            <span key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: 'var(--ink-3)' }}>{u}</span>
          ))}
          {cert.where_used_en.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--ink-4)' }}>+{cert.where_used_en.length - 3} more</span>
          )}
        </div>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#946010', margin: '0.5rem 0 0', lineHeight: 1.5 }}>
        ℹ {cert.rti_note_en}
      </p>
    </div>
  )
}

export default function ReservationPage() {
  const totalReserved = getTotalTNReservationPct()
  const unreserved = getUnreservedPct()

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--ink)' }}>
          Tamil Nadu Reservation System
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு இடஒதுக்கீடு முறை
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', margin: '0 0 2rem', maxWidth: 640, lineHeight: 1.7 }}>
          Tamil Nadu has {totalReserved}% reservation in state government jobs and educational institutions —
          the highest of any state in India, protected under the Constitution's 9th Schedule.
          Unreserved (Open Competition): {unreserved}%.
        </p>

        {/* Visual bar */}
        <ReservationBar />

        {/* Context banner */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <strong>Legal basis:</strong> TN Backward Classes, Scheduled Castes and Scheduled Tribes (Reservation of Seats in Educational Institutions
          and of Appointments or Posts in the Services under the State) Act, 1993.
          Protected by <strong>9th Schedule</strong> — not subject to challenge under Fundamental Rights (Article 31-B).
          Exceeds Supreme Court's 50% ceiling (Indra Sawhney, 1992) but constitutionally shielded.
        </div>

        {/* Categories */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>
          Reservation Categories
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {TN_RESERVATION_CATEGORIES.map(cat => (
            <div key={cat.id} style={{ border: `1px solid ${CATEGORY_COLORS[cat.id]}33`, borderLeft: `4px solid ${CATEGORY_COLORS[cat.id]}`, borderRadius: 6, padding: '1.25rem', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontWeight: 700, color: CATEGORY_COLORS[cat.id], fontSize: '1.1rem' }}>{cat.abbreviation}</span>
                  <span style={{ color: 'var(--ink)', fontSize: '0.95rem', fontWeight: 600, marginLeft: '0.5rem' }}>{cat.category_en}</span>
                  <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>{cat.category_ta}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700, color: CATEGORY_COLORS[cat.id], lineHeight: 1 }}>{cat.pct_tn}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)' }}>TN State</div>
                  {cat.pct_central > 0 && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-4)' }}>Central: {cat.pct_central}%</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem 1.5rem', marginBottom: '0.75rem' }}>
                <p style={{ color: 'var(--ink-2)', fontSize: '0.82rem', margin: 0 }}>
                  <strong>Population:</strong> ~{cat.population_count_lakh} lakh ({cat.population_pct_approx}% of TN)
                </p>
                <p style={{ color: 'var(--ink-2)', fontSize: '0.82rem', margin: 0 }}>
                  <strong>Certificate:</strong> {cat.caste_certificate_authority_en}
                </p>
                <p style={{ color: 'var(--ink-2)', fontSize: '0.82rem', margin: 0 }}>
                  <strong>Creamy layer:</strong> {cat.creamy_layer_excluded ? `Yes — income above ₹${cat.creamy_layer_income_lakh}L excluded` : 'No (SC/ST — no creamy layer)'}
                </p>
              </div>

              <p style={{ color: 'var(--ink-2)', fontSize: '0.83rem', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
                <strong>Qualifying criteria:</strong> {cat.qualifying_criteria_en}
              </p>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem', margin: '0 0 0.25rem', lineHeight: 1.6 }}>
                {cat.qualifying_criteria_ta}
              </p>

              {cat.sub_categories && cat.sub_categories.length > 0 && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-2)', borderRadius: 4 }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0 0 0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sub-classification</p>
                  {cat.sub_categories.map((sub, i) => (
                    <p key={i} style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: '0.2rem 0' }}>
                      {sub.name_en} ({sub.name_ta}): <strong>{sub.pct}%</strong>
                      {sub.note_en && <span style={{ color: 'var(--ink-3)', marginLeft: '0.4rem' }}>— {sub.note_en}</span>}
                    </p>
                  ))}
                </div>
              )}

              {cat.note_en && (
                <p style={{ fontSize: '0.78rem', color: '#946010', margin: '0.75rem 0 0', lineHeight: 1.5, background: '#FDF6EC', padding: '0.5rem 0.75rem', borderRadius: 4 }}>
                  ℹ {cat.note_en}
                </p>
              )}

              <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', margin: '0.5rem 0 0' }}>
                Legal basis: {cat.legal_basis_en}
              </p>
            </div>
          ))}
        </div>

        {/* EWS Section */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>
          EWS (Economically Weaker Section) — 10%
        </h2>
        <div style={{ border: '1px solid #E8C97A', borderRadius: 6, padding: '1.25rem', background: '#FDF6EC', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#946010', fontWeight: 700, margin: '0 0 0.5rem' }}>
            ⚠ EWS 10% reservation does NOT apply to Tamil Nadu state jobs or colleges
          </p>
          <p style={{ fontSize: '0.85rem', color: '#6E6E68', margin: '0 0 1rem', lineHeight: 1.7 }}>
            {EWS_DETAILS.note_en}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem 1.5rem', fontSize: '0.82rem', color: '#6E6E68' }}>
            <p style={{ margin: 0 }}><strong>Income limit:</strong> ₹{EWS_DETAILS.income_limit_annual_lakh} lakh/year</p>
            <p style={{ margin: 0 }}><strong>Issued by:</strong> {EWS_DETAILS.certificate_authority_en}</p>
            <p style={{ margin: 0 }}><strong>Valid for:</strong> {EWS_DETAILS.valid_for_days} days (annual renewal)</p>
            <p style={{ margin: 0 }}><strong>Asset criteria:</strong> {EWS_DETAILS.asset_criteria_en}</p>
          </div>
        </div>

        {/* Application Contexts */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>
          Where Reservation Applies
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {RESERVATION_CONTEXTS.map(ctx => (
            <div key={ctx.id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', background: 'var(--bg)' }}>
              <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.92rem', margin: '0 0 0.15rem' }}>{ctx.context_en}</p>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.78rem', margin: '0 0 0.5rem' }}>{ctx.context_ta}</p>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.83rem', margin: '0 0 0.25rem' }}><strong>Applies to:</strong> {ctx.applies_to_en}</p>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.83rem', margin: '0 0 0.25rem' }}><strong>Legal basis:</strong> {ctx.legal_basis_en}</p>
              {ctx.supreme_court_case && <p style={{ color: 'var(--ink-3)', fontSize: '0.78rem', margin: '0 0 0.25rem' }}><strong>SC case:</strong> {ctx.supreme_court_case}</p>}
              {ctx.note_en && <p style={{ color: '#946010', fontSize: '0.78rem', margin: '0.4rem 0 0', background: '#FDF6EC', padding: '0.4rem 0.6rem', borderRadius: 4, lineHeight: 1.5 }}>{ctx.note_en}</p>}
            </div>
          ))}
        </div>

        {/* Certificates */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>
          Community & Income Certificates
        </h2>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
          All certificates are free. Delays beyond official timelines can be challenged via RTI.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {CERTIFICATE_TYPES.map(cert => <CertCard key={cert.id} cert={cert} />)}
        </div>

        {/* FAQs */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {RESERVATION_FAQS.map((faq, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg-2)', padding: '0.875rem 1.25rem' }}>
                <p style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.88rem', margin: '0 0 0.2rem' }}>{faq.q_en}</p>
                <p style={{ color: 'var(--ink-3)', fontSize: '0.78rem', margin: 0 }}>{faq.q_ta}</p>
              </div>
              <div style={{ padding: '0.875rem 1.25rem' }}>
                <p style={{ color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.7, margin: '0 0 0.5rem' }}>{faq.a_en}</p>
                <p style={{ color: 'var(--ink-3)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{faq.a_ta}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RTI */}
        <RTITooltip
          dept_name_en="BC, MBC & Minorities Welfare Department"
          dept_name_ta="BC, MBC & சிறுபான்மையினர் நலன் துறை"
          pio_designation="Public Information Officer, BC, MBC and Minorities Welfare Dept"
          information_type_en="Roster verification, reservation implementation data"
          template_en={`To,\nThe Public Information Officer,\nBC, MBC and Minorities Welfare Department,\nGovernment of Tamil Nadu.\n\nSubject: Information under RTI Act 2005\n\nI request the following:\n1. Category-wise appointment roster for [institution/department] for the year [year]\n2. Number of vacancies reserved for each category (SC/ST/MBC/BC/BCM) in [department]\n3. Creamy layer income threshold applicable for BC/MBC/BCM reservations in state services\n4. List of communities in TN BC and MBC lists\n\nEnclosing ₹10 towards RTI fee.\n\nName:\nAddress:\nDate:`}
          template_ta={`பொது தகவல் அதிகாரி அவர்களுக்கு,\nBC, MBC & சிறுபான்மையினர் நலன் துறை,\nதமிழ்நாடு அரசு.\n\nபொருள்: RTI சட்டம் 2005 படி தகவல்\n\n1. [நிறுவனம்] [ஆண்டு]-ல் வகை வாரியான நியமனப் பட்டியல்\n2. ஒவ்வொரு வகுப்பிற்கும் ஒதுக்கப்பட்ட காலி பணியிடங்கள்\n3. BC/MBC/BCM-க்கான கிரீமி லேயர் வருமான வரம்பு\n\nRTI கட்டணம் ₹10 இணைக்கப்படுகிறது.`}
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, BC, MBC and Minorities Welfare Dept"
        />

        {/* Sources */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 0.75rem', color: 'var(--ink)' }}>Sources</h2>
        <ul style={{ color: 'var(--ink-2)', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Tamil Nadu Backward Classes, SC and ST (Reservation) Act, 1993</li>
          <li>Constitution of India — Articles 15, 16, 31-B, 243D, 243T, 341, 342</li>
          <li>National Commission for Backward Classes (NCBC) — ncbc.nic.in</li>
          <li>Indra Sawhney v. Union of India (1992) 3 SCC 217</li>
          <li>TN BC/MBC/DNC Community List — bcmbcmw.tn.gov.in</li>
          <li>Adi Dravidar Welfare Dept — adwelfare.tn.gov.in</li>
        </ul>
        <SourceCitation
          org="Government of Tamil Nadu"
          document="TN Reservation Act 1993; BC/MBC Community Lists"
          year="2024"
          url="https://bcmbcmw.tn.gov.in"
        />
      </main>
    </>
  )
}
