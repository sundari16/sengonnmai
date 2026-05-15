import React from 'react'

export type BadgeQuality = 'verified' | 'estimated' | 'historical-incomplete' | 'rti-needed' | 'available' | 'not_available' | 'rti_needed'

const CONFIG: Record<string, { dot: string; label: string; tip: string }> = {
  verified:              { dot: 'var(--flag-green)',  label: 'verified',   tip: 'Verified against official government source' },
  available:             { dot: 'var(--flag-green)',  label: 'verified',   tip: 'Verified against official government source' },
  estimated:             { dot: 'var(--flag-amber)',  label: 'est.',       tip: 'Estimated — exact figure not officially published' },
  'historical-incomplete': { dot: 'var(--flag-amber)', label: 'historical', tip: 'Historical data — may be incomplete' },
  'rti-needed':          { dot: 'var(--ink-3)',       label: 'RTI needed', tip: 'Data not publicly available — file RTI to obtain' },
  rti_needed:            { dot: 'var(--ink-3)',       label: 'RTI needed', tip: 'Data not publicly available — file RTI to obtain' },
  not_available:         { dot: 'var(--ink-3)',       label: 'unavailable',tip: 'Data not available' },
}

type Props = {
  quality: BadgeQuality
  showLabel?: boolean
}

export default function DataQualityBadge({ quality, showLabel = true }: Props) {
  const cfg = CONFIG[quality] ?? CONFIG['estimated']
  return (
    <span
      title={cfg.tip}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 3, cursor: 'default', userSelect: 'none' }}
    >
      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {showLabel && (
        <span style={{ fontSize: '0.68rem', color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.02em' }}>{cfg.label}</span>
      )}
    </span>
  )
}
