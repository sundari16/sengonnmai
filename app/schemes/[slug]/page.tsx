'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import RTITooltip from '@/components/ui/RTITooltip'
import { getSchemeBySlug, getSchemesByDept } from '@/lib/schemes-data'
import { DEPARTMENTS } from '@/lib/departments'
import type { SchemeType, SchemeStatus } from '@/types'

const SCHEME_TYPE_META: Record<SchemeType, { label_en: string; label_ta: string; color: string; description: string }> = {
  central: {
    label_en: 'Central Government Scheme',
    label_ta: 'மத்திய அரசு திட்டம்',
    color: '#1A3C6E',
    description: '100% funded and operated by the Central Government. Tamil Nadu implements but cannot change the eligibility rules.',
  },
  state: {
    label_en: 'State Government Scheme',
    label_ta: 'மாநில அரசு திட்டம்',
    color: '#1A4731',
    description: '100% funded by Tamil Nadu. Rules, eligibility, and amounts are set by the state government.',
  },
  centrally_sponsored: {
    label_en: 'Centrally Sponsored Scheme',
    label_ta: 'மத்திய-மாநில கூட்டு திட்டம்',
    color: '#7A3B00',
    description: 'Joint Central + State funding (typically 60:40). States have some flexibility in implementation but not in core eligibility.',
  },
}

const STATUS_META: Record<SchemeStatus, { label: string; bg: string; fg: string; note?: string }> = {
  active:    { label: 'Active',    bg: '#F2F8F4', fg: '#1A5C38' },
  new:       { label: 'New',       bg: '#EBF3FF', fg: '#1A3C6E', note: 'Recently launched — still rolling out across districts.' },
  extended:  { label: 'Extended',  bg: '#FDF6EC', fg: '#946010', note: 'Scope or eligibility extended from original design.' },
  renamed:   { label: 'Renamed',   bg: '#F3F0FF', fg: '#5B21B6', note: 'Same programme under a new name.' },
  shelved:   { label: 'Shelved',   bg: '#F5F5F3', fg: '#6E6E68', note: 'No longer accepting new applications.' },
}

// ── 5-Stage Journey ─────────────────────────────────────────────────

type JourneyStage = {
  stage: number
  icon: string
  title_en: string
  title_ta: string
  color: string
  details_en: string[]
}

function buildJourney(scheme: ReturnType<typeof getSchemeBySlug>): JourneyStage[] {
  if (!scheme) return []
  const steps = scheme.how_to_apply_en.split(/\.\s+/).map(s => s.trim()).filter(s => s.length > 8)
  return [
    {
      stage: 1,
      icon: '◎',
      title_en: 'Discover — Are you eligible?',
      title_ta: 'கண்டறியுங்கள் — நீங்கள் தகுதியானவரா?',
      color: '#1A3C6E',
      details_en: [
        scheme.eligibility_en,
        `Launched ${scheme.origin_year} by ${scheme.origin_party}.`,
        `Covers: ${scheme.beneficiaries_claimed}.`,
      ],
    },
    {
      stage: 2,
      icon: '✎',
      title_en: 'Apply — Documents & process',
      title_ta: 'விண்ணப்பிக்கவும் — ஆவணங்கள் மற்றும் நடைமுறை',
      color: '#946010',
      details_en: steps.length > 0 ? steps : [scheme.how_to_apply_en],
    },
    {
      stage: 3,
      icon: '◷',
      title_en: 'Wait — What happens next',
      title_ta: 'காத்திருங்கள் — என்ன நடக்கும்',
      color: '#555',
      details_en: [
        scheme.scheme_type === 'central'
          ? 'Central processing: 30–60 days depending on scheme. Track status at scheme portal or nearest CSC.'
          : scheme.scheme_type === 'centrally_sponsored'
          ? 'State + Central processing. Central fund release delays can pause disbursement even if application is approved.'
          : 'State processing: typically 15–45 days. Check status at Block Development Office or e-Sevai portal.',
        'If delayed beyond official timeline, file a complaint at the district collector\'s office or call 1800-425-1515 (TN Helpline).',
        'Do not pay intermediaries — the application process is free.',
      ],
    },
    {
      stage: 4,
      icon: '✓',
      title_en: 'Receive — What you get',
      title_ta: 'பெறுங்கள் — என்ன கிடைக்கும்',
      color: '#1A5C38',
      details_en: [
        `${scheme.beneficiaries_claimed} currently benefit from this scheme.`,
        `Funded as: ${scheme.funding_ratio_en}.`,
        scheme.parent_scheme_en ? `Note: ${scheme.parent_scheme_en}` : 'Benefits are transferred directly to bank account (DBT) or delivered at point of service.',
      ].filter(Boolean) as string[],
    },
    {
      stage: 5,
      icon: '⚖',
      title_en: 'Dispute — If denied or delayed',
      title_ta: 'மேல்முறையீடு — மறுக்கப்பட்டால் அல்லது தாமதமானால்',
      color: '#B83232',
      details_en: [
        'Step 1: Written complaint to Block Development Officer / Department official with receipt of application.',
        'Step 2: If unresolved in 30 days, file grievance at pgportal.gov.in or Tamil Nadu e-Sevai grievance portal.',
        'Step 3: File RTI with the department PIO asking for your application status and reason for denial.',
        'Step 4: First Appeal to the designated First Appellate Authority within 30 days of PIO response.',
        'Step 5: District Collector grievance day (every Monday) for unresolved cases.',
      ],
    },
  ]
}

function JourneyCard({ stage }: { stage: JourneyStage }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: '1rem' }}>
      {/* Header */}
      <div style={{ background: stage.color, padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: '#fff', fontSize: '1.1rem', opacity: 0.9 }}>{stage.icon}</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
            Stage {stage.stage} — {stage.title_en}
          </p>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem' }}>{stage.title_ta}</p>
        </div>
      </div>
      {/* Details */}
      <div style={{ padding: '1rem 1.25rem', background: 'var(--bg)' }}>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stage.details_en.map((d, i) => (
            <li key={i} style={{ color: 'var(--ink-2)', fontSize: '0.86rem', lineHeight: 1.65 }}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
      <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{value}</p>
      {sub && <p style={{ margin: '0.1rem 0 0', fontSize: '0.72rem', color: 'var(--ink-4)' }}>{sub}</p>}
    </div>
  )
}

export default function SchemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const scheme = getSchemeBySlug(slug)

  if (!scheme) notFound()

  const dept = DEPARTMENTS.find(d => d.id === scheme.dept_id)
  const typeMeta = SCHEME_TYPE_META[scheme.scheme_type]
  const statusMeta = STATUS_META[scheme.status]
  const journey = buildJourney(scheme)
  const relatedSchemes = getSchemesByDept(scheme.dept_id).filter(s => s.id !== scheme.id).slice(0, 4)

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.78rem', color: 'var(--ink-3)', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.4rem' }}>›</span>
          <Link href="/schemes" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Schemes</Link>
          <span style={{ margin: '0 0.4rem' }}>›</span>
          <span style={{ color: 'var(--ink)' }}>{scheme.name_en}</span>
        </nav>

        {/* Hero */}
        <header style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{
              background: typeMeta.color, color: '#fff',
              fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>{typeMeta.label_en}</span>
            <span style={{
              background: statusMeta.bg, color: statusMeta.fg,
              fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>{statusMeta.label}</span>
            {dept && (
              <Link href={`/dept/${dept.slug}`} style={{
                fontSize: '0.7rem', color: 'var(--ink-3)', textDecoration: 'none',
                border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4,
              }}>{dept.name_en} ↗</Link>
            )}
          </div>

          <h1 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 700, lineHeight: 1.2, color: 'var(--ink)' }}>
            {scheme.name_en}
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '1rem', color: 'var(--ink-3)' }}>
            {scheme.name_ta}
          </p>

          {statusMeta.note && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: statusMeta.bg, borderRadius: 6, display: 'inline-block' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: statusMeta.fg }}>{statusMeta.note}</p>
            </div>
          )}
          {scheme.parent_scheme_en && (
            <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.9rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ink-2)' }}>
                <strong>Continuity note:</strong> {scheme.parent_scheme_en}
              </p>
            </div>
          )}
        </header>

        {/* Key stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <InfoBox label="Beneficiaries" value={scheme.beneficiaries_claimed} />
          <InfoBox label="Funding" value={scheme.funding_ratio_en} />
          <InfoBox label="Started" value={String(scheme.origin_year)} sub={`by ${scheme.origin_party}`} />
          <InfoBox label="Scheme type" value={typeMeta.label_en} sub={typeMeta.label_ta} />
        </div>

        {/* Type explainer */}
        <div style={{ marginBottom: '2rem', padding: '0.9rem 1rem', background: 'var(--bg-2)', borderRadius: 6, borderLeft: `3px solid ${typeMeta.color}` }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-2)' }}>
            <strong style={{ color: typeMeta.color }}>What this means for you:</strong> {typeMeta.description}
          </p>
        </div>

        {/* 5-Stage Journey */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>
          Citizen Journey — 5 Stages
        </h2>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
          குடிமக்கள் பயணம் — 5 நிலைகள்
        </p>
        <div>
          {journey.map(stage => <JourneyCard key={stage.stage} stage={stage} />)}
        </div>

        {/* RTI */}
        <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
          <RTITooltip
            dept_name_en={dept?.name_en ?? 'this department'}
            dept_name_ta={dept?.name_ta ?? 'இந்தத் துறை'}
            pio_designation={dept ? `Public Information Officer, ${dept.name_en}` : 'Public Information Officer'}
            information_type_en={`Application status and denial reasons for ${scheme.name_en}`}
            template_en={`To,\nThe Public Information Officer,\n${dept?.name_en ?? '[Department]'},\nGovernment of Tamil Nadu.\n\nSubject: Information under RTI Act 2005 — regarding ${scheme.name_en}\n\nI request the following information:\n1. Status of my application submitted on [date] with reference no. [ref]\n2. Reason for rejection/delay (if applicable)\n3. Number of applications received and approved under this scheme in [district] in [year]\n4. Total amount disbursed under this scheme in [year]\n\nEnclosing ₹10 towards RTI fee.\n\nName:\nAddress:\nDate:`}
            template_ta={`பொது தகவல் அதிகாரி அவர்களுக்கு,\n${dept?.name_ta ?? '[துறை]'},\nதமிழ்நாடு அரசு.\n\nபொருள்: RTI சட்டம் 2005 — ${scheme.name_ta} திட்டம் தொடர்பான தகவல்\n\nகீழ்க்கண்ட தகவல்களை வழங்க கோருகிறேன்:\n1. [தேதி] அன்று சமர்ப்பித்த என் விண்ணப்பத்தின் நிலை\n2. நிராகரிப்பு/தாமத காரணம்\n3. [மாவட்டத்தில்] [ஆண்டில்] பெறப்பட்ட மற்றும் அங்கீகரிக்கப்பட்ட விண்ணப்பங்கள் எண்ணிக்கை\n\nRTI கட்டணம் ₹10 இணைக்கப்படுகிறது.`}
            filing_fee={10}
            response_days={30}
            appeal_body={`First Appellate Authority, ${dept?.name_en ?? 'Department'}`}
          />
        </div>

        {/* Source */}
        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-2)', borderRadius: 6, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-2)' }}>Official scheme source</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--mono)', wordBreak: 'break-all' }}>
              {scheme.source_url}
            </p>
          </div>
          <a href={scheme.source_url} target="_blank" rel="noopener noreferrer" style={{
            padding: '0.45rem 1rem', background: 'var(--accent)', color: '#fff',
            borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Official site ↗
          </a>
        </div>

        {/* Related schemes */}
        {relatedSchemes.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.875rem', color: 'var(--ink)' }}>
              More from {dept?.name_en ?? 'this department'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedSchemes.map(s => (
                <Link key={s.id} href={`/schemes/${s.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '0.875rem 1rem', border: '1px solid var(--border)', borderRadius: 6,
                    background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>{s.name_en}</p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: 'var(--ink-3)' }}>{s.beneficiaries_claimed}</p>
                    </div>
                    <span style={{
                      background: SCHEME_TYPE_META[s.scheme_type].color, color: '#fff',
                      fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                      textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>
                      {s.scheme_type === 'centrally_sponsored' ? 'CSS' : s.scheme_type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/schemes" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              ← All schemes
            </Link>
          </section>
        )}
      </main>
    </>
  )
}
