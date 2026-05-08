'use client'
import { useState, useEffect } from 'react'

export default function LangToggle() {
  const [lang, setLang] = useState<'en' | 'ta'>('en')

  useEffect(() => {
    const saved = localStorage.getItem('sengonnmai-lang') as 'en' | 'ta'
    if (saved) setLang(saved)
  }, [])

  const toggle = (l: 'en' | 'ta') => {
    setLang(l)
    localStorage.setItem('sengonnmai-lang', l)
    window.dispatchEvent(new CustomEvent('langchange', { detail: l }))
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-2)',
      border: '0.5px solid var(--border)',
      borderRadius: '20px',
      padding: '3px',
      gap: '2px',
    }}>
      {(['en', 'ta'] as const).map(l => (
        <button
          key={l}
          onClick={() => toggle(l)}
          style={{
            fontSize: '11px',
            fontWeight: 500,
            padding: '3px 10px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            background: lang === l ? 'var(--accent)' : 'transparent',
            color: lang === l ? '#fff' : 'var(--ink-3)',
            transition: 'all 0.15s',
          }}
        >
          {l === 'en' ? 'EN' : 'தமிழ்'}
        </button>
      ))}
    </div>
  )
}
