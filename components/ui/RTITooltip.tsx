'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { RTIDisclaimerProps } from '@/types'

export default function RTITooltip({
  dept_name_en,
  pio_designation,
  information_type_en,
  template_en,
  template_ta,
  filing_fee,
  response_days,
}: RTIDisclaimerProps) {
  const [open, setOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [copied, setCopied] = useState<'en' | 'ta' | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setTemplateOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
    }
  }, [open, close])

  function copy(text: string, lang: 'en' | 'ta') {
    navigator.clipboard.writeText(text)
    setCopied(lang)
    setTimeout(() => setCopied(null), 2000)
  }

  const body = (
    <>
      <p style={{ fontWeight: 700, color: '#946010', margin: '0 0 0.1rem', fontSize: '0.82rem' }}>
        Data not publicly available
      </p>
      <p style={{ color: '#6E6E68', margin: '0 0 0.6rem', fontSize: '0.73rem' }}>
        பொதுவில் கிடைக்கவில்லை
      </p>
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.78rem', color: '#3A3A36', lineHeight: 1.5 }}>
        <strong>Missing:</strong> {information_type_en}
      </p>
      <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', color: '#3A3A36', lineHeight: 1.5 }}>
        <strong>File RTI with:</strong> {pio_designation}, {dept_name_en}
      </p>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.73rem', color: '#6E6E68' }}>
        RTI Act 2005 — filing fee ₹{filing_fee}, response due {response_days} days
      </p>

      <button
        onClick={() => setTemplateOpen(v => !v)}
        style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          color: '#946010', fontSize: '0.73rem', textDecoration: 'underline',
          fontFamily: 'var(--sans)', display: 'block', marginBottom: templateOpen ? '0.5rem' : 0,
        }}
      >
        {templateOpen ? '▲ Hide template' : '▼ View RTI template'}
      </button>

      {templateOpen && (
        <div>
          {[
            { text: template_en, lang: 'en' as const, label: 'Copy', copied_label: '✓' },
            { text: template_ta, lang: 'ta' as const, label: 'நகலெடு', copied_label: '✓' },
          ].map(t => (
            <div key={t.lang} style={{ position: 'relative', marginBottom: '0.4rem' }}>
              <pre style={{
                fontFamily: 'var(--mono)', fontSize: '0.7rem',
                background: '#F9F8F6', border: '1px solid #E2DED6',
                borderRadius: 4, padding: '0.4rem 2.2rem 0.4rem 0.4rem',
                whiteSpace: 'pre-wrap', color: '#111110', margin: 0,
                maxHeight: 100, overflowY: 'auto',
              }}>{t.text}</pre>
              <button
                onClick={() => copy(t.text, t.lang)}
                style={{
                  position: 'absolute', top: '0.25rem', right: '0.25rem',
                  background: copied === t.lang ? '#1A5C38' : '#F0EEE9',
                  color: copied === t.lang ? '#fff' : '#3A3A36',
                  border: 'none', borderRadius: 3, padding: '0.15rem 0.35rem',
                  cursor: 'pointer', fontSize: '0.68rem', fontFamily: 'var(--sans)',
                }}
              >
                {copied === t.lang ? t.copied_label : t.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'calc(100% + 6px)',
    left: 0,
    zIndex: 200,
    width: 280,
    background: '#fff',
    border: '0.5px solid #D0CEC8',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    padding: '0.875rem 1rem',
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="RTI filing information — data not publicly available"
        style={{
          background: 'none', border: 'none',
          color: '#946010', cursor: 'pointer',
          fontSize: '0.875rem', fontFamily: 'var(--sans)',
          padding: '0.1rem 0.25rem',
          display: 'inline-flex', alignItems: 'center', gap: '0.15rem',
          lineHeight: 1,
        }}
      >
        RTI ⓘ
      </button>

      {/* Desktop tooltip */}
      {open && !isMobile && (
        <div style={tooltipStyle}>
          {body}
        </div>
      )}

      {/* Mobile bottom sheet */}
      {open && isMobile && (
        <>
          <div
            onClick={close}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 300,
            }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff',
            borderRadius: '12px 12px 0 0',
            padding: '1.25rem 1.25rem 2rem',
            zIndex: 301,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          }}>
            <button
              onClick={close}
              aria-label="Close"
              style={{
                position: 'absolute', top: '0.75rem', right: '0.875rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.25rem', color: '#6E6E68', padding: '0.25rem',
                lineHeight: 1,
              }}
            >×</button>
            {body}
          </div>
        </>
      )}
    </div>
  )
}
