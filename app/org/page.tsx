'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import RTITooltip from '@/components/ui/RTITooltip'

type CadreGroup = {
  cadre: string
  cadre_ta: string
  allotment_year_range: string
  total_posts: number
  filled: number
  on_deputation: number
  note_en: string
}

const IAS_CADRE_DATA: CadreGroup[] = [
  {
    cadre: 'IAS — Tamil Nadu cadre',
    cadre_ta: 'இந்திய நிர்வாக சேவை — தமிழ்நாடு படை',
    allotment_year_range: '1977–2023',
    total_posts: 539,
    filled: 421,
    on_deputation: 68,
    note_en: 'Authorised strength per DOPT annual report 2022-23. Actual numbers vary monthly.',
  },
  {
    cadre: 'IPS — Tamil Nadu cadre',
    cadre_ta: 'இந்திய போலீஸ் சேவை — தமிழ்நாடு படை',
    allotment_year_range: '1977–2023',
    total_posts: 243,
    filled: 198,
    on_deputation: 22,
    note_en: 'Home Ministry data 2022-23. Includes central deputation.',
  },
  {
    cadre: 'IFS — Tamil Nadu cadre',
    cadre_ta: 'இந்திய வன சேவை — தமிழ்நாடு படை',
    allotment_year_range: '1985–2022',
    total_posts: 109,
    filled: 89,
    on_deputation: 7,
    note_en: 'MoEFCC data 2022. Forest department only.',
  },
]

type DeptSummary = {
  dept: string
  dept_ta: string
  secretary_cadre: string
  sanctioned_posts: number
  filled_posts: number
  contract_staff_approximate: number
  budget_cr: number
  budget_year: string
  citizen_facing: boolean
}

const DEPT_SUMMARIES: DeptSummary[] = [
  { dept: 'Health & Family Welfare', dept_ta: 'சுகாதாரம் மற்றும் குடும்ப நலன்', secretary_cadre: 'IAS', sanctioned_posts: 62400, filled_posts: 51000, contract_staff_approximate: 14000, budget_cr: 22450, budget_year: '2023-24', citizen_facing: true },
  { dept: 'School Education', dept_ta: 'பள்ளிக் கல்வி', secretary_cadre: 'IAS', sanctioned_posts: 178000, filled_posts: 159000, contract_staff_approximate: 21000, budget_cr: 35600, budget_year: '2023-24', citizen_facing: true },
  { dept: 'Police', dept_ta: 'காவல் துறை', secretary_cadre: 'IPS', sanctioned_posts: 121000, filled_posts: 103000, contract_staff_approximate: 4200, budget_cr: 15200, budget_year: '2023-24', citizen_facing: true },
  { dept: 'Revenue & Disaster Mgmt', dept_ta: 'வருவாய் மற்றும் பேரிடர்', secretary_cadre: 'IAS', sanctioned_posts: 34000, filled_posts: 29000, contract_staff_approximate: 1800, budget_cr: 8900, budget_year: '2023-24', citizen_facing: true },
  { dept: 'Agriculture', dept_ta: 'வேளாண்மை', secretary_cadre: 'IAS', sanctioned_posts: 18500, filled_posts: 15700, contract_staff_approximate: 3200, budget_cr: 6400, budget_year: '2023-24', citizen_facing: true },
  { dept: 'Public Works', dept_ta: 'பொதுப் பணித் துறை', secretary_cadre: 'IAS', sanctioned_posts: 22000, filled_posts: 17800, contract_staff_approximate: 5100, budget_cr: 19800, budget_year: '2023-24', citizen_facing: false },
  { dept: 'Finance', dept_ta: 'நிதி', secretary_cadre: 'IAS', sanctioned_posts: 8200, filled_posts: 7400, contract_staff_approximate: 400, budget_cr: 3200, budget_year: '2023-24', citizen_facing: false },
  { dept: 'Social Welfare & WCD', dept_ta: 'சமூக நலன் மற்றும் மகளிர்', secretary_cadre: 'IAS', sanctioned_posts: 9400, filled_posts: 7900, contract_staff_approximate: 2100, budget_cr: 14300, budget_year: '2023-24', citizen_facing: true },
  { dept: 'Adi Dravidar Welfare', dept_ta: 'ஆதி திராவிட நலன்', secretary_cadre: 'IAS', sanctioned_posts: 6200, filled_posts: 5100, contract_staff_approximate: 900, budget_cr: 5800, budget_year: '2023-24', citizen_facing: true },
  { dept: 'Municipal Administration', dept_ta: 'நகராட்சி நிர்வாகம்', secretary_cadre: 'IAS', sanctioned_posts: 41000, filled_posts: 34000, contract_staff_approximate: 7800, budget_cr: 9100, budget_year: '2023-24', citizen_facing: true },
]

type TransferPattern = {
  level: string
  authority: string
  frequency: string
  typical_tenure: string
  note_en: string
}

const TRANSFER_PATTERNS: TransferPattern[] = [
  { level: 'Chief Secretary', authority: 'Chief Minister / Cabinet', frequency: 'Rare — political transitions', typical_tenure: '1–3 years', note_en: 'Highest civil service post in state. Retirement or promotion to Centre typically ends tenure.' },
  { level: 'Principal Secretary / Additional Chief Secretary', authority: 'Chief Minister', frequency: 'On political change or project completion', typical_tenure: '1–2 years per posting', note_en: 'High-profile postings often contested. Transfers can be used as incentives or signals.' },
  { level: 'Secretary to Government', authority: 'Chief Secretary + CM office', frequency: 'Annual to biennial', typical_tenure: '12–24 months', note_en: 'Most common rotation point for IAS officers.' },
  { level: 'District Collector', authority: 'Chief Secretary + CM office', frequency: 'Annually around elections or post-flood season', typical_tenure: '12–18 months', note_en: 'Transferred more frequently during election periods. DOPT guidelines recommend minimum 2 years.' },
  { level: 'Block Development Officer / Tahsildar', authority: 'DM / Revenue Board', frequency: 'Biennial', typical_tenure: '18–30 months', note_en: 'State-service cadre. Transfers within district or division range.' },
  { level: 'Village-level officer', authority: 'Tahsildar / BDO', frequency: 'Rarely transferred', typical_tenure: '5–15 years', note_en: 'Long tenure builds local knowledge but also entrenches informal gatekeeping in some cases.' },
]

function VacancyBar({ sanctioned, filled, label }: { sanctioned: number; filled: number; label: string }) {
  const pct = sanctioned > 0 ? Math.round((filled / sanctioned) * 100) : 0
  const vacancyPct = 100 - pct
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
        <span style={{ color: vacancyPct > 20 ? 'var(--flag-red)' : vacancyPct > 10 ? '#946010' : 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
          {vacancyPct}% vacant ({(sanctioned - filled).toLocaleString('en-IN')} posts)
        </span>
      </div>
      <div style={{ height: 10, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? 'var(--flag-green)' : pct > 70 ? '#946010' : 'var(--flag-red)', opacity: 0.75 }} />
      </div>
    </div>
  )
}

export default function OrgPage() {
  const totalSanctioned = DEPT_SUMMARIES.reduce((a, d) => a + d.sanctioned_posts, 0)
  const totalFilled = DEPT_SUMMARIES.reduce((a, d) => a + d.filled_posts, 0)
  const totalContract = DEPT_SUMMARIES.reduce((a, d) => a + d.contract_staff_approximate, 0)
  const overallVacancy = Math.round(((totalSanctioned - totalFilled) / totalSanctioned) * 100)

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
          Tamil Nadu — Government Architecture
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு — அரசு அமைப்பு கட்டமைப்பு
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', margin: '0 0 2.5rem', maxWidth: 660, lineHeight: 1.7 }}>
          How the Tamil Nadu state government is organised — cadres, departments, staffing, and transfer patterns.
          All numbers are from public sources. Gaps are acknowledged and RTI paths provided.
        </p>

        {/* Summary boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Departments', value: '51' },
            { label: 'Sanctioned posts (10 major depts)', value: totalSanctioned.toLocaleString('en-IN') },
            { label: 'Filled posts', value: totalFilled.toLocaleString('en-IN') },
            { label: 'Overall vacancy', value: `${overallVacancy}%` },
            { label: 'Contract staff (approx)', value: totalContract.toLocaleString('en-IN') },
            { label: 'IAS officers (TN cadre)', value: '421 filled / 539' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ink)', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Org hierarchy diagram */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Hierarchy — how the state is structured</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1.25rem 1.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
          {[
            { level: 1, label: 'Governor', label_ta: 'ஆளுநர்', note: 'Constitutional head. Formal approval for legislation and certain appointments.', bg: '#F5F5F3' },
            { level: 2, label: 'Chief Minister & Cabinet', label_ta: 'முதலமைச்சர் & அமைச்சரவை', note: 'Executive authority. Policy decisions, budget, major appointments.', bg: '#EEECEA' },
            { level: 3, label: 'Chief Secretary', label_ta: 'தலைமை செயலர்', note: 'Senior-most IAS officer. Coordinates all secretariats. Reports to CM.', bg: '#E8E6E3' },
            { level: 4, label: 'Principal Secretary / ACS', label_ta: 'முதன்மை செயலர் / அ.தலை.செ', note: 'Heads major department secretariats. Policy translation to programme.', bg: '#E2E0DC' },
            { level: 5, label: 'Secretary to Government', label_ta: 'அரசு செயலர்', note: 'Manages day-to-day secretariat functions. IAS-level posting.', bg: '#DCDAD5' },
            { level: 6, label: 'Director / Commissioner', label_ta: 'இயக்குநர் / ஆணையர்', note: 'Field-facing head of department. Implements programmes. IAS or state-service.', bg: '#D6D3CE' },
            { level: 7, label: 'District Collector', label_ta: 'மாவட்ட ஆட்சியர்', note: 'Key coordination node. Revenue, disaster, welfare delivery across district.', bg: '#D0CEC8' },
            { level: 8, label: 'Block Development Officer / Tahsildar', label_ta: 'வட்டாட்சியர் / தாசில்தார்', note: 'Sub-district administration. Revenue, certification, welfare claims.', bg: '#CAC8C2' },
            { level: 9, label: 'Village Administrative Officer / Front-line worker', label_ta: 'கிராம நிர்வாக அலுவலர்', note: 'Citizen-facing. Land records, certificates, scheme enrollment.', bg: '#C4C2BB' },
          ].map(row => (
            <div key={row.level} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink-2)', flexShrink: 0, marginTop: 2 }}>{row.level}</div>
              <div style={{ flex: 1, background: row.bg, border: '1px solid var(--border)', borderRadius: 4, padding: '0.5rem 0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-3)' }}>{row.label_ta}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-2)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>{row.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-4)', margin: '-1rem 0 2.5rem', fontStyle: 'italic' }}>
          Neutral grey shading only — no party colours. Hierarchy is structural, not a performance ranking.
        </p>

        {/* IAS/IPS/IFS cadre */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>All-India Service cadres — Tamil Nadu</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: '0 0 1.25rem', lineHeight: 1.6, maxWidth: 680 }}>
          IAS, IPS, and IFS officers are recruited by the Union government (UPSC) and allocated to state cadres.
          The state government controls most postings within its cadre but cannot override central government decisions on deputation or cadre strength.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {IAS_CADRE_DATA.map(c => (
            <div key={c.cadre} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.2rem', color: 'var(--ink)' }}>{c.cadre}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: '0 0 0.75rem' }}>{c.cadre_ta}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Authorised strength</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{c.total_posts}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Officers in position</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{c.filled}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>On central deputation</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{c.on_deputation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-3)' }}>Vacancy</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--flag-red)' }}>{c.total_posts - c.filled} ({Math.round(((c.total_posts - c.filled) / c.total_posts) * 100)}%)</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', margin: '0.75rem 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>{c.note_en}</p>
            </div>
          ))}
        </div>

        <RTITooltip
          dept_name_en="Department of Personnel and Training (DOPT)"
          dept_name_ta="பணியாளர் மற்றும் பயிற்சி திணைக்களம்"
          pio_designation="Central Public Information Officer, DOPT"
          information_type_en="Current IAS/IPS cadre strength, vacancy, and deputation data for Tamil Nadu — updated figures"
          template_en={"To,\nThe CPIO,\nDepartment of Personnel and Training,\nNorth Block, New Delhi.\n\nUnder the Right to Information Act 2005, please provide:\n1. Current authorised cadre strength for Tamil Nadu IAS/IPS/IFS as on date\n2. Number of officers on central deputation from Tamil Nadu cadre\n3. Number of vacancies as on date\n4. List of officers on deputation with deputation period"}
          template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nபணியாளர் மற்றும் பயிற்சி திணைக்களம், புது தில்லி.\n\nதகவல் அறியும் உரிமைச் சட்டம் 2005-ன் கீழ், தமிழ்நாடு IAS/IPS/IFS படையில்:\n1. தற்போதைய அங்கீகரிக்கப்பட்ட வலிமை\n2. மத்திய பிரதிநிதித்துவத்தில் உள்ள அலுவலர்கள் எண்ணிக்கை\n3. காலியிடங்கள் எண்ணிக்கை"
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, DOPT"
        />

        {/* Department staffing comparison */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '2.5rem 0 1.25rem', color: 'var(--ink)' }}>Staffing by department</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: '0 0 1.25rem', lineHeight: 1.6, maxWidth: 680 }}>
          Sanctioned vs filled posts for 10 major departments. Contract staff is counted separately and approximated from budget documents and CAG reports.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1.25rem', marginBottom: '1rem' }}>
          {DEPT_SUMMARIES.map(d => (
            <VacancyBar key={d.dept} sanctioned={d.sanctioned_posts} filled={d.filled_posts} label={d.dept} />
          ))}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--ink-3)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 14, height: 8, borderRadius: 2, background: 'var(--flag-green)', display: 'inline-block', opacity: 0.75 }} /> &gt;85% filled</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 14, height: 8, borderRadius: 2, background: '#946010', display: 'inline-block', opacity: 0.75 }} /> 70–85% filled</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 14, height: 8, borderRadius: 2, background: 'var(--flag-red)', display: 'inline-block', opacity: 0.75 }} /> &lt;70% filled</span>
          </div>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-4)', margin: '0 0 2.5rem', fontStyle: 'italic' }}>
          Source: TN Budget documents 2023-24, CAG Report on State Finances (Tamil Nadu), department annual reports.
          Figures are approximate; exact data requires RTI.
        </p>

        {/* Contract vs permanent breakdown */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Contract staff — across departments</h2>
        <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', borderRadius: '0 4px 4px 0', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Contract staff (கான்ட்ராக்ட் ஊழியர்கள்) deliver a significant share of citizen-facing services — especially in health, education, and municipal functions — but are excluded from official staff strength figures. The estimates below are drawn from CAG observations and budget sub-heads.
        </div>
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)', borderBottom: '2px solid var(--border)' }}>
                {['Department', 'Permanent filled', 'Contract (approx)', 'Contract %', 'Budget ₹ Cr'].map(h => (
                  <th key={h} style={{ padding: '0.575rem 0.75rem', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPT_SUMMARIES.map((d, i) => {
                const contractPct = d.filled_posts > 0 ? Math.round((d.contract_staff_approximate / (d.filled_posts + d.contract_staff_approximate)) * 100) : 0
                return (
                  <tr key={d.dept} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
                    <td style={{ padding: '0.575rem 0.75rem', fontWeight: 500, color: 'var(--ink)' }}>
                      {d.dept}
                      {d.citizen_facing && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: 'var(--ink-4)', border: '1px solid var(--border)', borderRadius: 3, padding: '0 0.3rem' }}>citizen-facing</span>}
                    </td>
                    <td style={{ padding: '0.575rem 0.75rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{d.filled_posts.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.575rem 0.75rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>~{d.contract_staff_approximate.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.575rem 0.75rem', fontFamily: 'var(--mono)', color: contractPct > 20 ? '#946010' : 'var(--ink-2)' }}>{contractPct}%</td>
                    <td style={{ padding: '0.575rem 0.75rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>₹{d.budget_cr.toLocaleString('en-IN')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Transfer patterns */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Transfer patterns — how officers move</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: '0 0 1.25rem', lineHeight: 1.6, maxWidth: 680 }}>
          Transfers are a significant governance tool in Tamil Nadu, used to reward, incentivise, or signal displeasure.
          DOPT guidelines recommend minimum 2-year tenures at most levels; actual patterns vary.
          The table below reflects observed patterns from press reporting and RTI responses, not official policy.
        </p>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', marginBottom: '2rem' }}>
          {TRANSFER_PATTERNS.map((t, i) => (
            <div key={t.level} style={{ borderBottom: i < TRANSFER_PATTERNS.length - 1 ? '1px solid var(--border)' : 'none', padding: '0.875rem 1.125rem', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.4rem', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{t.level}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-4)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1rem 0.4rem' }}>Transfer authority: {t.authority}</span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--mono)', color: 'var(--ink-3)' }}>Typical tenure: {t.typical_tenure}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>{t.note_en}</p>
            </div>
          ))}
        </div>

        {/* Inter-department dependencies */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Inter-department dependencies</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-2)', margin: '0 0 1rem', lineHeight: 1.6, maxWidth: 680 }}>
          Many citizen services require sign-off from multiple departments. Delays at any dependency point can stall delivery.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { service: 'Building plan approval', depts: ['CMDA / DTCP', 'Revenue', 'PWD', 'Fire & Rescue', 'Municipal body'], avg_days: 90, note: 'Single-window system partially implemented. Physical verification required.' },
            { service: 'Patta (land title) transfer', depts: ['Revenue', 'Registration', 'Survey', 'Municipal (if urban)'], avg_days: 60, note: 'Online portal exists; field verification and SRO sign-off still required.' },
            { service: 'Caste certificate', depts: ['Revenue (Tahsildar)', 'MRO', 'District Collector (for first-time)'], avg_days: 15, note: 'e-Sevai portal. Rural processing faster than urban in some districts.' },
            { service: 'Industrial clearance', depts: ['Industries', 'Pollution Control Board', 'Labour', 'Revenue', 'Fire', 'Electricity Board'], avg_days: 120, note: 'Single Window Interface for Fast and Transparent (SWIFT) portal launched 2022.' },
          ].map(dep => (
            <div key={dep.service} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--ink)' }}>{dep.service}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
                {dep.depts.map(d => (
                  <span key={d} style={{ fontSize: '0.72rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1rem 0.4rem', color: 'var(--ink-2)' }}>{d}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--ink-3)' }}>Typical real-world days</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{dep.avg_days}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>{dep.note}</p>
            </div>
          ))}
        </div>

        {/* Vacancy analysis notes */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>Vacancy analysis — what the data shows</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1.125rem 1.375rem', marginBottom: '2rem' }}>
          {[
            { title: 'Vacancy is higher in direct-service roles', detail: 'Medical Officers, Village Health Nurses, Anganwadi supervisors — the roles citizens interact with most — show higher vacancy rates than secretariat-level posts. This is an observable pattern from published data, not an assessment of any government\'s performance.' },
            { title: 'Contract staff fills gaps but lacks security', detail: 'Where permanent posts are vacant, contract staff or scheme workers (NHM, SSA, ICDS) typically fill the gap. They receive lower pay, no pension, and can be let go at contract end. Their count is not reflected in official strength figures.' },
            { title: 'Deputation reduces state-level capacity', detail: 'When IAS/IPS officers go on central deputation, the state cadre loses that officer until they return. The state cannot refuse central deputation orders. This is a structural feature, not a policy choice of any particular state government.' },
            { title: 'Recruitment lag is systemic', detail: 'Tamil Nadu Public Service Commission (TNPSC) recruitment cycles typically take 18–36 months from notification to joining. Backlogs from delayed cycles compound vacancies. All governments have faced this; the pattern predates recent administrations.' },
          ].map((item, i) => (
            <div key={i} style={{ paddingBottom: i < 3 ? '0.875rem' : 0, marginBottom: i < 3 ? '0.875rem' : 0, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)', margin: '0 0 0.3rem' }}>{item.title}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>{item.detail}</p>
            </div>
          ))}
        </div>

        <RTITooltip
          dept_name_en="Tamil Nadu Public Service Commission (TNPSC)"
          dept_name_ta="தமிழ்நாடு அரசுப் பணியாளர் தேர்வு ஆணையம்"
          pio_designation="Public Information Officer, TNPSC"
          information_type_en="Recruitment notification dates, result dates, and joining dates for all TNPSC notifications 2015–2024 — to calculate recruitment cycle length"
          template_en={"To,\nThe PIO,\nTamil Nadu Public Service Commission,\nOfficer of the TNPSC, Chennai.\n\nUnder the Right to Information Act 2005, please provide for all Group I, Group II, and Group IV notifications from 2015 to 2024:\n1. Date of notification\n2. Date of written exam\n3. Date of result publication\n4. Date of final selection list\n5. Date of first batch joining"}
          template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nதமிழ்நாடு அரசுப் பணியாளர் தேர்வு ஆணையம், சென்னை.\n\nதகவல் அறியும் உரிமைச் சட்டம் 2005-ன் கீழ், 2015 முதல் 2024 வரை அனைத்து குழு I, II, IV அறிவிப்புகளுக்கும்:\n1. அறிவிப்பு தேதி\n2. எழுத்துத் தேர்வு தேதி\n3. முடிவு வெளியீட்டு தேதி\n4. இறுதி தேர்வு பட்டியல் தேதி\n5. முதல் தொகுதி சேர்க்கை தேதி"
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, TNPSC"
        />

        <SourceCitation
          org="DOPT / MHA / TNPSC / CAG / TN Budget Documents"
          document="Annual Reports, Budget Estimates, CAG State Finance Reports 2023"
          year="2024"
          url="https://tnpsc.gov.in"
        />
      </main>
    </>
  )
}
