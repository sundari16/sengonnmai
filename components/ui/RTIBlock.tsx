'use client'

import { useState } from 'react'
import type { RTIDisclaimerProps } from '@/types'

export default function RTIBlock({
  dept_name_en,
  dept_name_ta,
  pio_designation,
  information_type_en,
  template_en,
  template_ta,
  filing_fee,
  response_days,
  appeal_body,
}: RTIDisclaimerProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<'en' | 'ta' | null>(null)

  function copy(text: string, lang: 'en' | 'ta') {
    navigator.clipboard.writeText(text)
    setCopied(lang)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{
      borderLeft: '3px solid #946010',
      background: '#FDF6EC',
      borderRadius: '0 6px 6px 0',
      padding: '1rem 1.25rem',
      margin: '1rem 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>📄</span>
        <div style={{ flex: 1 }}>
          <p style={{
            fontWeight: 700,
            color: '#946010',
            margin: '0 0 0.25rem',
            fontSize: '0.95rem',
          }}>
            Data not publicly available
          </p>
          <p style={{
            color: '#6E6E68',
            margin: '0 0 0.25rem',
            fontSize: '0.85rem',
          }}>
            தகவல் பொதுவில் வெளியிடப்படவில்லை
          </p>
          <p style={{ color: '#3A3A36', margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
            This information has not been officially published.
            Under the Right to Information Act 2005, any citizen can formally
            request this from the <strong>{pio_designation}</strong>,{' '}
            {dept_name_en}.
          </p>
          <p style={{ color: '#6E6E68', margin: '0 0 0.75rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            இந்தத் தகவல் அதிகாரப்பூர்வமாக வெளியிடப்படவில்லை.
            தகவல் அறியும் உரிமைச் சட்டம் 2005 படி,
            எந்த குடிமகனும் {dept_name_ta} நிறுவனத்தின்
            பொதுத் தகவல் அதிகாரியிடம் கோரலாம்.
          </p>

          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'none',
              border: '1px solid #946010',
              color: '#946010',
              borderRadius: '4px',
              padding: '0.3rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'var(--sans)',
            }}
          >
            {open ? '▲ Hide RTI template' : '▼ View RTI template'}
          </button>

          {open && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: '#6E6E68', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>
                English template:
              </p>
              <div style={{ position: 'relative' }}>
                <pre style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.8rem',
                  background: '#fff',
                  border: '1px solid #E2DED6',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  color: '#111110',
                  margin: '0 0 0.5rem',
                }}>{template_en}</pre>
                <button
                  onClick={() => copy(template_en, 'en')}
                  style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    background: copied === 'en' ? '#1A5C38' : '#F0EEE9',
                    color: copied === 'en' ? '#fff' : '#3A3A36',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  {copied === 'en' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <p style={{ color: '#6E6E68', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>
                தமிழில் வார்ப்புரு:
              </p>
              <div style={{ position: 'relative' }}>
                <pre style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.8rem',
                  background: '#fff',
                  border: '1px solid #E2DED6',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  color: '#111110',
                  margin: '0 0 0.5rem',
                }}>{template_ta}</pre>
                <button
                  onClick={() => copy(template_ta, 'ta')}
                  style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    background: copied === 'ta' ? '#1A5C38' : '#F0EEE9',
                    color: copied === 'ta' ? '#fff' : '#3A3A36',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  {copied === 'ta' ? 'நகலெடுக்கப்பட்டது' : 'நகலெடு'}
                </button>
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: '#6E6E68',
          }}>
            <span>Filing fee: ₹{filing_fee}</span>
            <span>Response due: {response_days} days</span>
            <span>Appeal: {appeal_body}</span>
          </div>

          <p style={{
            fontSize: '0.75rem',
            color: '#A0A09A',
            margin: '0.75rem 0 0',
          }}>
            Received a response? Contribute it to this platform and help fellow citizens.
          </p>
        </div>
      </div>
    </div>
  )
}
