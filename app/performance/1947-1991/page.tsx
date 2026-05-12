'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import RTITooltip from '@/components/ui/RTITooltip'
import SourceCitation from '@/components/ui/SourceCitation'
import { METRICS_1947_1991, CM_ERAS } from '@/lib/performance-data'
import type { PerformanceMetric } from '@/types'

const SHADE_MAP: Record<string, string> = {
  'C. Rajagopalachari': '#F5F5F3',
  'K. Kamaraj': '#EFEEEB',
  'M. Bhaktavatsalam': '#EAE9E5',
  'C. N. Annadurai': '#E5E4DF',
  'M. Karunanidhi': '#E0DFDA',
  'M. G. Ramachandran': '#DAD9D3',
  'J. Jayalalithaa': '#D5D4CD',
}

function MetricChart({ metrics, title, unit }: { metrics: PerformanceMetric[]; title: string; unit: string }) {
  if (metrics.length === 0) return null
  const availableMetrics = metrics.filter(m => m.data_quality !== 'not_available')
  const maxVal = Math.max(...availableMetrics.map(m => parseFloat(m.value.replace(/[^0-9.-]/g, '').replace('approx ', '')) || 0))

  return (
    <div style={{ marginBottom: '2rem', border: '1px solid var(--border)', borderRadius: 6, padding: '1.25rem', background: 'var(--bg)' }}>
      <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {metrics.map(m => {
          const numVal = parseFloat(m.value.replace(/[^0-9.-]/g, '').replace('approx ', '')) || 0
          const pct = maxVal > 0 ? (numVal / maxVal) * 100 : 0
          const dotColor = m.data_quality === 'available' ? '#1A5C38' : m.data_quality === 'estimated' ? '#946010' : '#B83232'

          if (m.data_quality === 'not_available') {
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: 32, fontSize: '0.78rem', color: 'var(--ink-3)', flexShrink: 0 }}>{m.year}</span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-3)', fontStyle: 'italic' }}>Data not available — RTI may help</span>
              </div>
            )
          }

          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 32, fontSize: '0.78rem', color: 'var(--ink-3)', flexShrink: 0 }}>{m.year}</span>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
              <div style={{ flex: 1, background: 'var(--bg-3)', borderRadius: 3, height: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', opacity: 0.7, transition: 'width 0.3s' }} />
                <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.78rem', color: 'var(--ink)', fontWeight: 600 }}>{m.value} {unit}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', width: 100, flexShrink: 0, textAlign: 'right' }}>{m.cm_name}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.875rem', fontSize: '0.75rem', color: 'var(--ink-3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A5C38', display: 'inline-block' }} /> Official published data</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#946010', display: 'inline-block' }} /> Estimated from indirect sources</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B83232', display: 'inline-block' }} /> Data not available</span>
      </div>
    </div>
  )
}

const TIMELINE_EVENTS = [
  { year: 1947, event: 'Independence — Madras Province' },
  { year: 1950, event: 'Constitution of India enacted' },
  { year: 1952, event: 'First General Election — Congress wins Madras' },
  { year: 1956, event: 'States Reorganisation — Tamil Nadu boundaries set' },
  { year: 1967, event: 'DMK wins — first non-Congress government in TN' },
  { year: 1971, event: 'State renamed Tamil Nadu' },
  { year: 1972, event: 'AIADMK formed by M. G. Ramachandran' },
  { year: 1977, event: 'M. G. Ramachandran wins — AIADMK era begins' },
  { year: 1984, event: 'Context for 1984 election: national political shift' },
  { year: 1987, event: 'M. G. Ramachandran passes away — political transition' },
  { year: 1991, event: 'Economic liberalisation begins nationally; R. Gandhi assassination in TN' },
]

export default function Performance1947Page() {
  const literacyMetrics = METRICS_1947_1991.filter(m => m.metric_en === 'Literacy rate')
  const imrMetrics = METRICS_1947_1991.filter(m => m.metric_en.includes('Infant Mortality'))
  const gsdpMetrics = METRICS_1947_1991.filter(m => m.metric_en.includes('GSDP'))
  const enrollMetrics = METRICS_1947_1991.filter(m => m.metric_en.includes('enrollment'))
  const fiscalMetrics = METRICS_1947_1991.filter(m => m.metric_en.includes('Fiscal deficit'))

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
          Tamil Nadu — Building the Foundation
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு — அடித்தளம் அமைத்த காலம் (1947–1991)
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', margin: '0 0 2.5rem', maxWidth: 640, lineHeight: 1.7 }}>
          How Tamil Nadu developed from independence to economic liberalisation.
          We present data where it exists and acknowledge gaps honestly.
        </p>

        {/* Context banner */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <strong>Context:</strong> Tamil Nadu at independence was predominantly agricultural, with Madras as a major urban centre, low literacy, high infant mortality, and limited infrastructure.
          Population 1951: 3.06 crore. By 1991: 5.58 crore.
        </div>

        {/* Key events timeline */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Key events</h2>
        <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1.25rem', marginBottom: '3rem' }}>
          {TIMELINE_EVENTS.map(e => (
            <div key={e.year} style={{ display: 'flex', gap: '1rem', marginBottom: '0.625rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-1.375rem', top: '0.35rem', width: 8, height: 8, borderRadius: '50%', background: 'var(--border-2)' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--ink-3)', flexShrink: 0, width: 36 }}>{e.year}</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>{e.event}</span>
            </div>
          ))}
        </div>

        {/* CM era bands */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Chief Ministers 1947–1991</h2>
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {CM_ERAS.filter(e => e.end_year <= 1991).map(era => (
            <div key={era.cm + era.start_year} style={{
              background: SHADE_MAP[era.cm] ?? '#F0EEE9',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '0.5rem 0.75rem',
              minWidth: 100,
            }}>
              <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.82rem', margin: '0 0 0.15rem' }}>{era.cm}</p>
              <p style={{ color: 'var(--ink-3)', fontSize: '0.75rem', margin: 0 }}>{era.start_year}–{era.end_year}</p>
              <p style={{ color: 'var(--ink-4)', fontSize: '0.72rem', margin: '0.1rem 0 0', fontStyle: 'italic' }}>{era.party}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-4)', margin: '0 0 2.5rem' }}>
          Neutral grey shading only. No party colours. No performance assessment.
        </p>

        {/* Charts */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Data by metric</h2>

        <MetricChart metrics={literacyMetrics} title="Literacy rate" unit="%" />
        <MetricChart metrics={imrMetrics} title="Infant Mortality Rate (per 1,000 live births)" unit="per 1000" />
        <MetricChart metrics={gsdpMetrics} title="GSDP (₹ crore, current prices)" unit="₹ Cr" />
        <MetricChart metrics={enrollMetrics} title="School enrollment ratio" unit="%" />
        <MetricChart metrics={fiscalMetrics} title="Fiscal deficit (% GSDP)" unit="%" />

        {/* RTI for pre-1980 fiscal */}
        <RTITooltip
          dept_name_en="TN State Archives"
          dept_name_ta="தமிழ்நாடு மாநில ஆவணகம்"
          pio_designation="Public Information Officer, Finance Department"
          information_type_en="Pre-1980 state fiscal data — not digitised"
          template_en={"To,\nThe PIO,\nFinance Department,\nGovernment of Tamil Nadu.\n\nPlease provide: annual state fiscal deficit and revenue figures for the period 1952 to 1979.\nNote: Physical records may be available at TN State Archives, Chennai."}
          template_ta="பொது தகவல் அதிகாரி அவர்களுக்கு,\nநிதித் துறை, தமிழ்நாடு அரசு.\n\n1952 முதல் 1979 வரையிலான ஆண்டுவாரியான மாநில நிதி தகவல்கள் வழங்கவும்."
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, Finance Department"
        />

        {/* Sources */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '2rem 0 1rem', color: 'var(--ink)' }}>Sources</h2>
        <ul style={{ color: 'var(--ink-2)', fontSize: '0.88rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Census of India 1951–1991 · censusindia.gov.in</li>
          <li>RBI Historical Data Publications · rbi.org.in</li>
          <li>Planning Commission Five Year Plan Documents · mospi.gov.in</li>
          <li>Finance Commission Reports (1st–9th)</li>
          <li>EPW Research Foundation Historical Data</li>
        </ul>

        <SourceCitation org="Census India / RBI / Planning Commission" document="Historical records 1947–1991" year="2024" url="https://censusindia.gov.in" />
      </main>
    </>
  )
}
