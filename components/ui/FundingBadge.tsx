import React from 'react'

export type FundingType = 'central' | 'centrally_sponsored' | 'state' | 'cess' | string

const FUNDING_META: Record<string, { label: string; color: string; bg: string }> = {
  central:            { label: 'Central',            color: 'var(--fund-central)', bg: 'var(--fund-central-bg)' },
  centrally_sponsored:{ label: 'Centrally Sponsored', color: 'var(--fund-css)',     bg: 'var(--fund-css-bg)'     },
  state:              { label: 'State',               color: 'var(--fund-state)',   bg: 'var(--fund-state-bg)'   },
  cess:               { label: 'Cess / WB',           color: 'var(--fund-cess)',    bg: 'var(--fund-cess-bg)'    },
}

type Props = {
  type: FundingType
  size?: 'sm' | 'md'
}

export default function FundingBadge({ type, size = 'sm' }: Props) {
  const meta = FUNDING_META[type] ?? { label: type.replace(/_/g, ' '), color: 'var(--ink-3)', bg: 'var(--bg-2)' }
  return (
    <span style={{
      display: 'inline-block',
      background: meta.bg,
      color: meta.color,
      border: `1px solid ${meta.color}33`,
      borderRadius: 3,
      padding: size === 'md' ? '0.2rem 0.6rem' : '0.1rem 0.45rem',
      fontSize: size === 'md' ? '0.78rem' : '0.7rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {meta.label}
    </span>
  )
}
