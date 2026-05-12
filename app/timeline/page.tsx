'use client'
import { useState } from 'react'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import SourceCitation from '@/components/ui/SourceCitation'
import { TN_TIMELINE, getEventsByCategory, getHighSignificanceEvents } from '@/lib/timeline-data'
import type { TimelineEvent } from '@/lib/timeline-data'

const CATEGORY_META: Record<TimelineEvent['category'], { label: string; color: string; bg: string }> = {
  political:      { label: 'Political',      color: '#1A3C6E', bg: '#EBF3FF' },
  policy:         { label: 'Policy',         color: '#1A5C38', bg: '#F2F8F4' },
  economic:       { label: 'Economic',       color: '#946010', bg: '#FDF6EC' },
  social:         { label: 'Social',         color: '#5B21B6', bg: '#F3F0FF' },
  infrastructure: { label: 'Infrastructure', color: '#555',    bg: '#F5F5F3' },
  legal:          { label: 'Legal',          color: '#B83232', bg: '#FDF2F2' },
  disaster:       { label: 'Disaster',       color: '#7A3B00', bg: '#FFF4E0' },
}

const DECADE_OPTIONS = [
  { label: 'All years',  from: 1947, to: 2030 },
  { label: '1947–1967', from: 1947, to: 1968 },
  { label: '1967–1991', from: 1967, to: 1992 },
  { label: '1991–2011', from: 1991, to: 2012 },
  { label: '2011–2025', from: 2011, to: 2026 },
]

type CategoryFilter = TimelineEvent['category'] | 'all' | 'high'

function EventRow({ event }: { event: TimelineEvent }) {
  const meta = CATEGORY_META[event.category]
  const isHigh = event.significance === 'high'
  return (
    <div style={{
      display: 'flex', gap: '1rem', padding: '0.75rem 0',
      borderBottom: '1px solid var(--border)',
      opacity: 1,
    }}>
      {/* Year + dot */}
      <div style={{ width: 52, flexShrink: 0, textAlign: 'right' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: isHigh ? 'var(--ink)' : 'var(--ink-3)', fontWeight: isHigh ? 700 : 400 }}>
          {event.year}
        </span>
      </div>
      <div style={{ width: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, flexShrink: 0 }}>
        <div style={{
          width: isHigh ? 10 : 7, height: isHigh ? 10 : 7,
          borderRadius: '50%',
          background: isHigh ? meta.color : 'var(--border-2)',
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, width: 1, background: 'var(--border)', marginTop: 4 }} />
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
          <span style={{
            background: meta.bg, color: meta.color,
            fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: 3,
            whiteSpace: 'nowrap',
          }}>{meta.label}</span>
          {isHigh && (
            <span style={{ color: meta.color, fontSize: '0.65rem', fontWeight: 700 }}>● High significance</span>
          )}
        </div>
        <p style={{ margin: '0 0 0.25rem', fontSize: isHigh ? '0.9rem' : '0.85rem', color: 'var(--ink)', fontWeight: isHigh ? 600 : 400, lineHeight: 1.5 }}>
          {event.event_en}
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--ink-3)', lineHeight: 1.5 }}>
          {event.event_ta}
        </p>
        {event.cm && (
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'var(--ink-4)' }}>CM: {event.cm}</p>
        )}
        {event.source_en && (
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: 'var(--ink-4)' }}>Source: {event.source_en}</p>
        )}
      </div>
    </div>
  )
}

export default function TimelinePage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [decadeIdx, setDecadeIdx] = useState(0)

  const decade = DECADE_OPTIONS[decadeIdx]

  const filtered = TN_TIMELINE
    .filter(e => e.year >= decade.from && e.year < decade.to)
    .filter(e => {
      if (categoryFilter === 'all') return true
      if (categoryFilter === 'high') return e.significance === 'high'
      return e.category === categoryFilter
    })

  const highCount = getHighSignificanceEvents().length

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, margin: '0 0 0.35rem', color: 'var(--ink)' }}>
          Tamil Nadu — Historical Timeline
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
          தமிழ்நாடு வரலாற்று காலவரிசை
        </p>
        <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', margin: '0 0 2rem', maxWidth: 580, lineHeight: 1.7 }}>
          {TN_TIMELINE.length} events from 1947 to 2025 — political, policy, economic, social, infrastructure, and disaster milestones.
          {highCount} marked as high significance.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {/* Decade */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {DECADE_OPTIONS.map((d, i) => (
              <button key={i} onClick={() => setDecadeIdx(i)} style={{
                padding: '0.3rem 0.75rem', borderRadius: 4, border: '1px solid var(--border)',
                background: decadeIdx === i ? 'var(--accent)' : 'var(--bg)',
                color: decadeIdx === i ? '#fff' : 'var(--ink-2)',
                fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
              }}>{d.label}</button>
            ))}
          </div>
          {/* Category */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {([['all', 'All categories', 'var(--ink-3)', 'var(--bg-2)'], ['high', `High significance (${highCount})`, '#1A5C38', '#F2F8F4']] as const).map(([val, label, color, bg]) => (
              <button key={val} onClick={() => setCategoryFilter(val as CategoryFilter)} style={{
                padding: '0.3rem 0.75rem', borderRadius: 4, border: '1px solid var(--border)',
                background: categoryFilter === val ? bg : 'var(--bg)',
                color: categoryFilter === val ? color : 'var(--ink-3)',
                fontSize: '0.78rem', cursor: 'pointer',
              }}>{label}</button>
            ))}
            {(Object.keys(CATEGORY_META) as TimelineEvent['category'][]).map(cat => {
              const meta = CATEGORY_META[cat]
              return (
                <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                  padding: '0.3rem 0.75rem', borderRadius: 4, border: '1px solid var(--border)',
                  background: categoryFilter === cat ? meta.bg : 'var(--bg)',
                  color: categoryFilter === cat ? meta.color : 'var(--ink-3)',
                  fontSize: '0.78rem', cursor: 'pointer',
                }}>{meta.label}</button>
              )
            })}
          </div>
        </div>

        {/* Count */}
        <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', margin: '0 0 1rem' }}>
          Showing {filtered.length} of {TN_TIMELINE.length} events
        </p>

        {/* Timeline */}
        <div style={{ paddingLeft: '0.5rem' }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--ink-3)', fontSize: '0.88rem' }}>No events match this filter combination.</p>
          ) : (
            filtered.map((event, i) => <EventRow key={`${event.year}-${i}`} event={event} />)
          )}
        </div>

        {/* Category legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          {(Object.entries(CATEGORY_META) as [TimelineEvent['category'], typeof CATEGORY_META[keyof typeof CATEGORY_META]][]).map(([cat, meta]) => (
            <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--ink-2)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: meta.bg, border: `1px solid ${meta.color}`, display: 'inline-block' }} />
              {meta.label}
            </span>
          ))}
        </div>

        {/* Sources */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 0.5rem', color: 'var(--ink)' }}>Sources</h2>
        <ul style={{ color: 'var(--ink-2)', fontSize: '0.82rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Census of India 1951–2011 · censusindia.gov.in</li>
          <li>RBI Historical Data Publications · rbi.org.in</li>
          <li>Planning Commission / NITI Aayog documents</li>
          <li>Election Commission of India · eci.gov.in</li>
          <li>CAG Audit Reports (annual)</li>
          <li>TN Legislative Assembly Records</li>
          <li>National Disaster Management Authority (NDMA) reports</li>
        </ul>
        <SourceCitation org="Multiple official sources" document="TN Government records 1947–2025" year="2025" url="https://tn.gov.in" />
      </main>
    </>
  )
}
