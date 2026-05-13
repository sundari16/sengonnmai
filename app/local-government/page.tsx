'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import RTITooltip from '@/components/ui/RTITooltip'
import { TN_CORPORATIONS, CORP_SUMMARY } from '@/lib/local-bodies-complete'
import type { MPFund, MLAFund } from '@/types'

const MP_FUNDS_SAMPLE: MPFund[] = [
  { mp_name: 'Data under RTI', constituency: 'Chennai North', district: 'Chennai', party: '—', allocation_cr: 5, utilised_cr: 3.2, year: '2022-23', projects_sanctioned: 38, projects_completed: 24, projects_pending: 14, source_url: 'https://mplads.gov.in' },
  { mp_name: 'Data under RTI', constituency: 'Chennai South', district: 'Chennai', party: '—', allocation_cr: 5, utilised_cr: 4.1, year: '2022-23', projects_sanctioned: 42, projects_completed: 31, projects_pending: 11, source_url: 'https://mplads.gov.in' },
  { mp_name: 'Data under RTI', constituency: 'Coimbatore', district: 'Coimbatore', party: '—', allocation_cr: 5, utilised_cr: 2.9, year: '2022-23', projects_sanctioned: 29, projects_completed: 17, projects_pending: 12, source_url: 'https://mplads.gov.in' },
]

const MLA_FUNDS_SAMPLE: MLAFund[] = [
  { mla_name: 'Data under RTI', constituency: 'Chepauk-Triplicane', district: 'Chennai', party: '—', allocation_cr: 2, utilised_cr: 1.4, year: '2022-23', source_url: 'https://tn.gov.in/tnla', data_quality: 'estimated' },
  { mla_name: 'Data under RTI', constituency: 'Anna Nagar', district: 'Chennai', party: '—', allocation_cr: 2, utilised_cr: 1.8, year: '2022-23', source_url: 'https://tn.gov.in/tnla', data_quality: 'estimated' },
  { mla_name: 'Data under RTI', constituency: 'Coimbatore North', district: 'Coimbatore', party: '—', allocation_cr: 2, utilised_cr: 0.9, year: '2022-23', source_url: 'https://tn.gov.in/tnla', data_quality: 'estimated' },
]

const LOCAL_BODY_TYPES = [
  { type: 'Corporations (நகராட்சி மன்றம்)', count: 21, governs: 'Cities > ~3–5 lakh population', functions_en: 'Water, roads, waste, building plans, markets, health centres', elected: 'Ward councillors + Mayor', note: '21 municipal corporations as of 2023 merger. GCC has 200 wards.' },
  { type: 'Municipalities (நகராட்சி)', count: 138, governs: 'Towns 30,000–3 lakh population', functions_en: 'Roads, drains, waste collection, basic sanitation, markets', elected: 'Ward councillors + Chairman', note: 'Second-tier urban local body. Revenue largely from property tax and state grants.' },
  { type: 'Town Panchayats (நகர்ப்புற பஞ்சாயத்து)', count: 527, governs: 'Semi-urban areas 6,000–30,000 population', functions_en: 'Basic civic amenities, roads, drains, street lights', elected: 'Ward councillors + President', note: 'In transition — many upgraded to municipalities post-2021.' },
  { type: 'District Panchayats (மாவட்ட பஞ்சாயத்து)', count: 37, governs: 'One per district (rural)', functions_en: 'Secondary roads, bridges, higher-order rural schemes coordination', elected: 'District Panchayat councillors', note: 'Coordinates across panchayat unions within district.' },
  { type: 'Panchayat Unions (பஞ்சாயத்து ஒன்றியம்)', count: 385, governs: 'Block-level rural government', functions_en: 'Middle schools, roads, rural water supply, welfare schemes', elected: 'Panchayat union councillors + Chairman', note: 'Key implementation body for state schemes in rural Tamil Nadu.' },
  { type: 'Village Panchayats (கிராம பஞ்சாயத்து)', count: 12524, governs: 'Villages and clusters', functions_en: 'Sanitation, drinking water, street lights, burial grounds, local roads', elected: 'Ward members + President', note: 'Lowest tier of elected government. Revenue from house tax + state devolution.' },
]

function UtilisationBar({ allocated, utilised, label }: { allocated: number; utilised: number; label: string }) {
  const pct = allocated > 0 ? Math.round((utilised / allocated) * 100) : 0
  return (
    <div style={{ marginBottom: '0.625rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
        <span style={{ color: 'var(--ink-2)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', color: pct < 60 ? 'var(--flag-red)' : pct < 80 ? '#946010' : 'var(--ink-3)' }}>{pct}% utilised</span>
      </div>
      <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 80 ? 'var(--flag-green)' : pct >= 60 ? '#946010' : 'var(--flag-red)', opacity: 0.7 }} />
      </div>
    </div>
  )
}

export default function LocalGovernmentPage() {
  const totalCorpBudget = CORP_SUMMARY.totalBudgetCr

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
          Tamil Nadu — Local Government
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு — உள்ளாட்சி அமைப்பு
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', margin: '0 0 2.5rem', maxWidth: 660, lineHeight: 1.7 }}>
          Tamil Nadu has one of the largest and most active local government systems in India.
          This page covers all tiers — from corporations to village panchayats — and elected fund utilisation.
        </p>

        {/* Summary boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Corporations', value: '21' },
            { label: 'Municipalities', value: '138' },
            { label: 'Town Panchayats', value: '527' },
            { label: 'Panchayat Unions', value: '385' },
            { label: 'Village Panchayats', value: '12,524' },
            { label: 'Elected representatives', value: '~1.2 lakh' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ink)', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Local body types */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Tiers of local government</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {LOCAL_BODY_TYPES.map((t, i) => (
            <div key={t.type} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1.125rem', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{t.type}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--ink-3)', border: '1px solid var(--border)', borderRadius: 3, padding: '0 0.4rem' }}>{t.count.toLocaleString('en-IN')} units</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div><span style={{ color: 'var(--ink-3)' }}>Governs: </span><span style={{ color: 'var(--ink-2)' }}>{t.governs}</span></div>
                <div><span style={{ color: 'var(--ink-3)' }}>Key functions: </span><span style={{ color: 'var(--ink-2)' }}>{t.functions_en}</span></div>
                <div><span style={{ color: 'var(--ink-3)' }}>Elected body: </span><span style={{ color: 'var(--ink-2)' }}>{t.elected}</span></div>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--ink-4)', margin: '0.4rem 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>{t.note}</p>
            </div>
          ))}
        </div>

        {/* 74th Amendment context */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <strong>74th Constitutional Amendment (1992):</strong> Mandated elected urban local bodies with devolved functions across 18 subjects (Schedule XII).
          Tamil Nadu had existing urban bodies pre-amendment. Full devolution of all 18 functions is still in progress as of 2024 — some functions remain with state departments.
          The 73rd Amendment similarly covers rural local bodies (Panchayati Raj — Schedule XI, 29 subjects).
        </div>

        {/* Corporation profiles — all 21 */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--ink)' }}>
          All {CORP_SUMMARY.total} municipal corporations
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
          Combined budget ₹{CORP_SUMMARY.totalBudgetCr.toLocaleString('en-IN')} Cr · {CORP_SUMMARY.totalElected.toLocaleString('en-IN')} elected members · ~{CORP_SUMMARY.totalStaff.toLocaleString('en-IN')} staff
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {TN_CORPORATIONS.map(body => (
            <div key={body.id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem', background: body.data_quality === 'available' ? 'var(--bg)' : 'var(--bg-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 0.15rem', color: 'var(--ink)', lineHeight: 1.3 }}>{body.name_en}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: 0 }}>{body.name_ta} · {body.district}</p>
                </div>
                {body.data_quality === 'estimated' && (
                  <span style={{ fontSize: '0.65rem', background: 'var(--flag-amber-bg)', color: 'var(--flag-amber)', border: '1px solid var(--flag-amber)33', borderRadius: 3, padding: '0.1rem 0.35rem', whiteSpace: 'nowrap', flexShrink: 0 }}>est.</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Population</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{body.population >= 100000 ? `${(body.population / 100000).toFixed(1)}L` : `${(body.population / 1000).toFixed(0)}K`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Budget {body.budget_year}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>₹{body.budget_cr?.toLocaleString('en-IN')} Cr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Wards / Elected</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{body.elected_members}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Staff (perm + contract)</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{((body.permanent_staff ?? 0) + (body.contract_staff ?? 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {body.schemes_implemented.slice(0, 3).map(s => (
                  <span key={s} style={{ fontSize: '0.65rem', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1rem 0.3rem', color: 'var(--ink-3)' }}>{s}</span>
                ))}
                {body.schemes_implemented.length > 3 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--ink-4)', padding: '0.1rem 0.2rem' }}>+{body.schemes_implemented.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-4)', margin: '0 0 2.5rem', fontStyle: 'italic' }}>
          Source: Corporation annual reports, TN Municipal Administration directorate, 2023-24 budget documents.
          Entries marked "est." use estimated figures — RTI path below for audited data.
        </p>

        {/* MP LADS funds */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>MP Local Area Development Scheme (MPLADS)</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: '0 0 0.75rem', lineHeight: 1.6, maxWidth: 680 }}>
          Each Member of Parliament receives ₹5 crore per year to spend in their constituency on local development works.
          Projects must be recommended by the MP, sanctioned by the District Collector, and implemented by local bodies.
          Utilisation varies significantly across constituencies.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1.125rem', marginBottom: '1rem' }}>
          {MP_FUNDS_SAMPLE.map(f => (
            <UtilisationBar key={f.constituency} allocated={f.allocation_cr} utilised={f.utilised_cr} label={`${f.constituency} (₹${f.allocation_cr}Cr allocated, ${f.year})`} />
          ))}
        </div>
        <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)', borderBottom: '2px solid var(--border)' }}>
                {['Constituency', 'Allocated', 'Utilised', 'Projects sanctioned', 'Completed', 'Pending'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.625rem', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MP_FUNDS_SAMPLE.map((f, i) => (
                <tr key={f.constituency} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
                  <td style={{ padding: '0.5rem 0.625rem', color: 'var(--ink-2)' }}>{f.constituency}</td>
                  <td style={{ padding: '0.5rem 0.625rem', fontFamily: 'var(--mono)' }}>₹{f.allocation_cr}Cr</td>
                  <td style={{ padding: '0.5rem 0.625rem', fontFamily: 'var(--mono)' }}>₹{f.utilised_cr}Cr</td>
                  <td style={{ padding: '0.5rem 0.625rem', fontFamily: 'var(--mono)' }}>{f.projects_sanctioned}</td>
                  <td style={{ padding: '0.5rem 0.625rem', fontFamily: 'var(--mono)', color: 'var(--flag-green)' }}>{f.projects_completed}</td>
                  <td style={{ padding: '0.5rem 0.625rem', fontFamily: 'var(--mono)', color: f.projects_pending > 10 ? 'var(--flag-red)' : 'var(--ink-2)' }}>{f.projects_pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', borderRadius: '0 4px 4px 0', padding: '0.75rem 1rem', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          MP names withheld pending RTI confirmation. mplads.gov.in publishes constituency-level data but name-wise detail requires verification.
          The full MPLADS dataset for Tamil Nadu is available at mplads.gov.in — search by state or constituency.
        </div>

        <RTITooltip
          dept_name_en="District Collector's Office (for each constituency)"
          dept_name_ta="மாவட்ட ஆட்சியர் அலுவலகம்"
          pio_designation="Public Information Officer, District Collector's Office"
          information_type_en="Complete MPLADS project list — works sanctioned, completed, pending, and expenditure for your constituency"
          template_en={"To,\nThe PIO,\nDistrict Collector's Office,\n[Your District].\n\nUnder the Right to Information Act 2005, please provide for the period 2019-20 to 2023-24:\n1. List of all works recommended under MPLADS by the MP of [constituency]\n2. Date of sanction and implementing agency for each work\n3. Expenditure incurred against each work\n4. Current status (completed/in progress/lapsed)\n5. Any works recommended but rejected and reason for rejection"}
          template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nமாவட்ட ஆட்சியர் அலுவலகம்.\n\nதகவல் அறியும் உரிமைச் சட்டம் 2005-ன் கீழ், 2019-20 முதல் 2023-24 வரை:\n1. MPLADS-ன் கீழ் பரிந்துரைக்கப்பட்ட அனைத்து பணிகளின் பட்டியல்\n2. ஒவ்வொரு பணிக்கும் அனுமதி தேதி மற்றும் செயல்படுத்தும் அமைப்பு\n3. ஒவ்வொரு பணிக்கும் செலவிடப்பட்ட தொகை\n4. தற்போதைய நிலை"
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, District Collectorate"
        />

        {/* MLA funds */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '2.5rem 0 1rem', color: 'var(--ink)' }}>MLA Constituency Development Fund (MLACD)</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: '0 0 0.75rem', lineHeight: 1.6, maxWidth: 680 }}>
          Tamil Nadu MLAs receive ₹2 crore per year for constituency development. Utilisation data is published by the TN Assembly but constituency-level breakdowns require RTI in most districts.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1.125rem', marginBottom: '1rem' }}>
          {MLA_FUNDS_SAMPLE.map(f => (
            <UtilisationBar key={f.constituency} allocated={f.allocation_cr} utilised={f.utilised_cr} label={`${f.constituency} — ${f.district} (₹${f.allocation_cr}Cr, ${f.year})`} />
          ))}
        </div>
        <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', borderRadius: '0 4px 4px 0', padding: '0.75rem 1rem', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          MLA fund data is marked estimated — constituency-level expenditure figures are not consistently published in a machine-readable format.
          The Tamil Nadu Legislative Assembly website publishes annual statements; the data above was derived from those statements and press reports.
          File RTI to get exact figures for your constituency.
        </div>

        {/* Revenue sources */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>How local bodies are funded</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            {
              source: 'Own revenue',
              source_ta: 'சொந்த வருவாய்',
              examples: 'Property tax, water charges, building plan fees, advertisement tax, trade licence fees',
              note: 'Corporations are more self-sufficient. Village panchayats depend mostly on house tax — typically very small amounts.',
              share: '20–55%',
            },
            {
              source: 'State Finance Commission devolution',
              source_ta: 'மாநில நிதி ஆயோக்கம்',
              examples: 'Untied grants from state consolidated fund, based on SFC formula (population, area, backwardness)',
              note: 'Tamil Nadu SFC releases are sometimes delayed. 5th SFC recommendations from 2021 pending full implementation.',
              share: '25–40%',
            },
            {
              source: 'Central Finance Commission grants',
              source_ta: 'மத்திய நிதி ஆயோக்கம் மானியம்',
              examples: 'Tied grants (minimum 50% for basic services), performance grants for ULBs that publish accounts online',
              note: '15th Finance Commission grants (2021-26) require local bodies to publish audited accounts.',
              share: '15–30%',
            },
            {
              source: 'Scheme funds (CSS / State schemes)',
              source_ta: 'திட்ட நிதி',
              examples: 'AMRUT, SBM, PM-KUSUM, Smart Cities, TNUFIP, Makkalai Thedi Maruthuvam',
              note: 'Tied to specific purposes. Utilisation is tracked separately. Delayed releases affect local body cash flows.',
              share: '10–30%',
            },
          ].map(f => (
            <div key={f.source} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 0.1rem', color: 'var(--ink)' }}>{f.source}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: 0 }}>{f.source_ta}</p>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.15rem 0.4rem', whiteSpace: 'nowrap' }}>{f.share}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-2)', margin: '0.4rem 0', lineHeight: 1.5 }}>{f.examples}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>{f.note}</p>
            </div>
          ))}
        </div>

        {/* Citizen rights at local body level */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Citizen rights — what local government must provide</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', marginBottom: '2rem' }}>
          {[
            { right: 'Ward Sabha / Gram Sabha meetings', timeline: 'Quarterly', law: '74th/73rd Amendment + TN Panchayats Act', note: 'Ward Sabhas must be called quarterly. Citizens can raise grievances, approve local plans, review accounts.' },
            { right: 'Access to local body accounts', timeline: 'Annual (audited)', law: '15th FC conditions + RTI Act 2005', note: 'ULBs receiving 15th FC grants must publish audited accounts online. If not published, RTI applies.' },
            { right: 'Property tax assessment challenge', timeline: 'Within 30 days of demand', law: 'TN District Municipalities Act / Chennai City Municipal Corporation Act', note: 'Assessment can be challenged before the municipal authority. Further appeal to Appellate Authority.' },
            { right: 'Building plan approval timeline', timeline: '30 days (residential)', law: 'TN Combined Development & Building Rules 2019', note: 'Deemed approved after 30 days if no response for residential buildings. Commercial timelines differ.' },
            { right: 'Grievance redressal', timeline: '21 days', law: 'TN Public Services Guarantee Act 2010', note: '21 services notified under the act for various local body services. Missed timelines can be escalated.' },
          ].map((r, i) => (
            <div key={r.right} style={{ padding: '0.875rem 1.125rem', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{r.right}</span>
                <span style={{ fontSize: '0.72rem', background: 'var(--flag-green-bg)', border: '1px solid var(--flag-green)', borderRadius: 3, padding: '0.1rem 0.4rem', color: 'var(--flag-green)' }}>{r.timeline}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: '0 0 0.25rem' }}>Law: {r.law}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>{r.note}</p>
            </div>
          ))}
        </div>

        <RTITooltip
          dept_name_en="Municipal Administration & Water Supply Department"
          dept_name_ta="நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை"
          pio_designation="Public Information Officer, Municipal Administration & Water Supply Department"
          information_type_en="Complete financial statements, staff strength, vacancy data, and scheme utilisation for all corporations and municipalities"
          template_en={"To,\nThe PIO,\nMunicipal Administration & Water Supply Department,\nGovernment of Tamil Nadu, Chennai.\n\nUnder the Right to Information Act 2005, please provide for 2022-23:\n1. Audited income-expenditure statements for all 21 municipal corporations\n2. Sanctioned and actual staff strength for each corporation (permanent and contract separately)\n3. Property tax collection vs demand for each corporation\n4. Status of AMRUT 2.0 projects — sanctioned vs completed vs pending\n5. List of ward sabha meetings held vs required (2022-23)"}
          template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nநகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை.\n\nதகவல் அறியும் உரிமைச் சட்டம் 2005-ன் கீழ், 2022-23-க்கான:\n1. அனைத்து 21 மாநகராட்சிகளின் தணிக்கை செய்யப்பட்ட வருமான-செலவு அறிக்கைகள்\n2. நிரந்தர மற்றும் ஒப்பந்த அடிப்படையில் ஊழியர் எண்ணிக்கை\n3. வரி வசூல் vs கோரிக்கை தரவு"
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, Municipal Administration Dept"
        />

        <SourceCitation
          org="TN Municipal Administration / DESI / Finance Commission / mplads.gov.in"
          document="Corporation annual reports, 15th FC grant orders, TN Budget 2023-24"
          year="2024"
          url="https://tnurbanpoverty.gov.in"
        />
      </main>
    </>
  )
}
