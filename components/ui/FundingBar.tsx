import React from 'react'

type Props = {
  centerPct: number  // 0–100
  statePct: number   // 0–100
  label?: string
  height?: number
}

export default function FundingBar({ centerPct, statePct, label, height = 10 }: Props) {
  const remaining = Math.max(0, 100 - centerPct - statePct)
  return (
    <div>
      {label && (
        <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginBottom: 4 }}>{label}</div>
      )}
      <div style={{ display: 'flex', height, borderRadius: height / 2, overflow: 'hidden', background: 'var(--bg-3)' }}>
        {centerPct > 0 && (
          <div title={`Centre ${centerPct}%`} style={{ width: `${centerPct}%`, background: 'var(--fund-central)', transition: 'width 0.3s' }} />
        )}
        {statePct > 0 && (
          <div title={`State ${statePct}%`} style={{ width: `${statePct}%`, background: 'var(--fund-state)', transition: 'width 0.3s' }} />
        )}
        {remaining > 0 && (
          <div style={{ width: `${remaining}%`, background: 'var(--bg-3)' }} />
        )}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: 6, fontSize: '0.72rem', color: 'var(--ink-3)' }}>
        {centerPct > 0 && (
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--fund-central)', marginRight: 3 }} />Centre {centerPct}%</span>
        )}
        {statePct > 0 && (
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--fund-state)', marginRight: 3 }} />State {statePct}%</span>
        )}
      </div>
    </div>
  )
}
