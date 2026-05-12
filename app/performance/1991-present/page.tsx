'use client'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import { METRICS_1991_PRESENT, CM_ERAS } from '@/lib/performance-data'

function BarChart({ data, label, yLabel }: { data: Array<{ year: number; value: number; cm: string }>; label: string; yLabel: string }) {
  const max = Math.max(...data.map(d => Math.abs(d.value)))
  const ZERO_Y = data.some(d => d.value < 0)

  return (
    <div style={{ marginBottom: '2.5rem', border: '1px solid var(--border)', borderRadius: 6, padding: '1.25rem', background: 'var(--bg)' }}>
      <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>{label}</h3>
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', minWidth: `${data.length * 22}px`, height: 160 }}>
          {data.map(d => {
            const pct = max > 0 ? (Math.abs(d.value) / max) * 120 : 0
            const isNeg = d.value < 0
            return (
              <div key={d.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 18 }} title={`${d.year}: ${d.value}% — ${d.cm}`}>
                {!isNeg && (
                  <div style={{ width: '100%', height: `${pct}px`, background: 'var(--accent)', borderRadius: '2px 2px 0 0', opacity: 0.75 }} />
                )}
                <div style={{ width: '100%', height: 2, background: 'var(--border)' }} />
                {isNeg && (
                  <div style={{ width: '100%', height: `${pct}px`, background: 'var(--flag-red)', borderRadius: '0 0 2px 2px', opacity: 0.75 }} />
                )}
                <span style={{ fontSize: '0.6rem', color: 'var(--ink-4)', marginTop: 2, writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: 28 }}>{d.year}</span>
              </div>
            )
          })}
        </div>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--ink-4)', margin: '0.5rem 0 0' }}>
        Source: MOSPI · TN Directorate of Economics and Statistics. Neutral grey CM era bands applied.
        Each bar represents one financial year.
      </p>
    </div>
  )
}

const CM_ERA_TABLE = [
  { cm: 'J. Jayalalithaa', party: 'AIADMK', years: '1991–1996', gsdp: '~7.0%', edu: '~3.2%', health: '~2.8%', debt: 'Moderate' },
  { cm: 'M. Karunanidhi', party: 'DMK', years: '1996–2001', gsdp: '~6.4%', edu: '~3.4%', health: '~3.0%', debt: 'Moderate' },
  { cm: 'J. Jayalalithaa', party: 'AIADMK', years: '2001–2006', gsdp: '~7.2%', edu: '~3.5%', health: '~3.2%', debt: 'Moderate' },
  { cm: 'M. Karunanidhi', party: 'DMK', years: '2006–2011', gsdp: '~9.8%', edu: '~3.8%', health: '~3.5%', debt: 'Moderate' },
  { cm: 'J. Jayalalithaa', party: 'AIADMK', years: '2011–2016', gsdp: '~8.9%', edu: '~3.6%', health: '~3.3%', debt: 'Increasing' },
  { cm: 'E. K. Palaniswami', party: 'AIADMK', years: '2017–2021', gsdp: '~6.4%', edu: '~3.4%', health: '~3.8%', debt: 'Increasing' },
  { cm: 'M. K. Stalin', party: 'DMK', years: '2021–', gsdp: '~9.4%', edu: '~3.8%', health: '~4.0%', debt: 'High' },
]

export default function Performance1991Page() {
  const growthData = METRICS_1991_PRESENT
    .filter(m => m.metric_en === 'GSDP growth rate')
    .map(m => ({ year: m.year, value: parseFloat(m.value), cm: m.cm_name }))

  const imrData = METRICS_1991_PRESENT.filter(m => m.metric_en.includes('Infant Mortality'))
  const deliveryData = METRICS_1991_PRESENT.filter(m => m.metric_en.includes('delivery rate'))
  const povertyData = METRICS_1991_PRESENT.filter(m => m.metric_en.includes('Poverty'))

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--ink)' }}>
          Tamil Nadu — The Reform Era
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '1rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு — சீர்திருத்த காலம் (1991–இன்று)
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', margin: '0 0 2.5rem', maxWidth: 640, lineHeight: 1.7 }}>
          Three decades of data on Tamil Nadu economy, governance, and social development.
          Same metrics presented for every government.
        </p>

        {/* Summary stat boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'GSDP 1991', value: '₹62,000 Cr' },
            { label: 'GSDP 2023–24', value: '₹27.5L Cr' },
            { label: 'Literacy 1991', value: '62.7%' },
            { label: 'Literacy 2011', value: '80.1%' },
            { label: 'IMR 1991', value: '57 / 1000' },
            { label: 'IMR 2021', value: '19 / 1000' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--ink)', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* GSDP growth bar chart */}
        <BarChart data={growthData} label="GSDP growth rate by year (%)" yLabel="Growth rate %" />
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-3)', margin: '-1.5rem 0 2rem', lineHeight: 1.6 }}>
          Green bars: growth recorded. Red bar (2020–21): contraction recorded (−1.2%) during COVID-19 pandemic.
          No editorial assessment. Source: MOSPI · TN DESIA.
        </p>

        {/* Social development */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Social development — health</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.75rem' }}>Infant Mortality Rate (NFHS rounds)</h3>
            {imrData.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--bg-3)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--ink-3)' }}>{m.year} (NFHS)</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{m.value} per 1000</span>
              </div>
            ))}
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', margin: '0.5rem 0 0' }}>Source: NFHS 1–5 · rchiips.org/nfhs</p>
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.75rem' }}>Institutional delivery rate</h3>
            {deliveryData.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--bg-3)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--ink-3)' }}>{m.year} (NFHS)</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{m.value}</span>
              </div>
            ))}
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', margin: '0.5rem 0 0' }}>Source: NFHS 3–5 · rchiips.org/nfhs</p>
          </div>
        </div>

        {/* Education outcomes */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>Education</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem', marginBottom: '2rem' }}>
          {[
            { year: 2001, value: '73.5%', source: 'Census 2001' },
            { year: 2011, value: '80.1%', source: 'Census 2011' },
          ].map(l => (
            <div key={l.year} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--bg-3)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--ink-3)' }}>Literacy {l.year} ({l.source})</span>
              <span style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{l.value}</span>
            </div>
          ))}
          <div style={{ background: 'var(--bg-2)', borderRadius: 4, padding: '0.625rem 0.875rem', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--ink-3)' }}>
            Note: ASER data available from 2006 onwards. Earlier learning outcome data was not systematically collected at state level.
          </div>
        </div>

        {/* Poverty */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--ink)' }}>Poverty</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '1rem 1.125rem', marginBottom: '0.75rem' }}>
          {povertyData.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--bg-3)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--ink-3)' }}>{m.year} (Tendulkar method)</span>
              <span style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{m.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--flag-amber-bg)', borderLeft: '3px solid var(--flag-amber)', borderRadius: '0 4px 4px 0', padding: '0.75rem 1rem', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Poverty measurement methodology changed after 2011-12. Post-2011 figures use a different methodology and are not directly comparable to earlier figures.
        </div>

        {/* CM era comparison table */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.25rem', color: 'var(--ink)' }}>Chief Minister era comparison</h2>
        <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-2)', borderBottom: '2px solid var(--border)' }}>
                {['CM', 'Party', 'Years', 'Avg GSDP growth', 'Edu spend %', 'Health spend %', 'Debt trend'].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CM_ERA_TABLE.map((row, i) => (
                <tr key={row.cm + i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
                  <td style={{ padding: '0.625rem 0.75rem', fontWeight: 600, color: 'var(--ink)' }}>{row.cm}</td>
                  <td style={{ padding: '0.625rem 0.75rem', color: 'var(--ink-3)' }}>{row.party}</td>
                  <td style={{ padding: '0.625rem 0.75rem', color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{row.years}</td>
                  <td style={{ padding: '0.625rem 0.75rem', color: 'var(--ink-2)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{row.gsdp}</td>
                  <td style={{ padding: '0.625rem 0.75rem', color: 'var(--ink-2)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{row.edu}</td>
                  <td style={{ padding: '0.625rem 0.75rem', color: 'var(--ink-2)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{row.health}</td>
                  <td style={{ padding: '0.625rem 0.75rem', color: 'var(--ink-2)', fontSize: '0.8rem' }}>{row.debt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-4)', margin: '0 0 2rem', fontStyle: 'italic' }}>
          Same metrics applied to all governments. No editorial assessment. Spend percentages are approximate from budget documents.
        </p>

        <SourceCitation org="MOSPI / RBI / NFHS / Census" document="Multiple public datasets" year="2024" url="https://mospi.gov.in" />
      </main>
    </>
  )
}
