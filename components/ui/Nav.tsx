'use client'
import Link from 'next/link'
import LangToggle from './LangToggle'

export default function Nav() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(1rem, 4vw, 3rem)',
      height: '60px',
      borderBottom: '0.5px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '30px', height: '30px',
          background: 'var(--accent)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".35"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '17px', color: 'var(--ink)', lineHeight: 1 }}>
            Sengonnmai
          </span>
          <span style={{ fontSize: '10px', color: 'var(--ink-3)', fontFamily: 'var(--sans)' }}>
            செங்கொன்னமை · Tamil Nadu Public Accounts
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', listStyle: 'none', flexWrap: 'wrap' }} className="nav-links-desktop">
          {[
            { href: '/#departments', label: 'Departments' },
            { href: '/budget', label: 'Budget' },
            { href: '/budget/finance-commission', label: 'Finance Comm' },
            { href: '/citizen-guide', label: 'Services Guide' },
            { href: '/performance/1947-1991', label: '1947–91' },
            { href: '/performance/1991-present', label: '1991–now' },
            { href: '/org', label: 'Org' },
            { href: '/local-government', label: 'Local Govt' },
            { href: '/entities', label: 'Entities' },
            { href: '/reservation', label: 'Reservation' },
            { href: '/timeline', label: 'Timeline' },
            { href: '/rights', label: 'Your Rights' },
            { href: '/about', label: 'About' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: '13px', fontWeight: 500,
              color: 'var(--ink-2)', textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}
        </div>
        <LangToggle />
      </div>
    </nav>
  )
}
