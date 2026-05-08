'use client'
import { useState } from 'react'

type Props = {
  flagId: string
}

export default function DisputeButton({ flagId }: Props) {
  const [open, setOpen] = useState(false)
  const [what, setWhat] = useState('')
  const [source, setSource] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = async () => {
    await fetch('/api/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagId, what, source }),
    })
    setSubmitted(true)
    setTimeout(() => { setOpen(false); setSubmitted(false) }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontSize: '10px',
          color: 'var(--ink-4)',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--sans)',
          marginTop: '6px',
          padding: 0,
          textDecoration: 'underline',
        }}
      >
        Dispute this · இதை மறுக்கவும்
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '420px',
            border: '0.5px solid var(--border)',
          }}>
            {submitted ? (
              <p style={{ fontSize: '14px', color: 'var(--flag-green)' }}>
                ✓ Thank you. This claim is now marked under review.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  Dispute this claim
                </p>
                <p style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '1rem' }}>
                  Tell us what is incorrect and provide a source if you have one.
                </p>
                <label style={{ fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                  What is incorrect?
                </label>
                <textarea
                  value={what}
                  onChange={e => setWhat(e.target.value)}
                  placeholder="Describe what you believe is wrong…"
                  style={{
                    width: '100%', padding: '8px 10px',
                    border: '0.5px solid var(--border)',
                    borderRadius: '8px', fontSize: '13px',
                    fontFamily: 'var(--sans)', minHeight: '80px',
                    resize: 'vertical', marginBottom: '10px', outline: 'none',
                  }}
                />
                <label style={{ fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                  Your source (optional)
                </label>
                <input
                  type="url"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="https://… official document or news report"
                  style={{
                    width: '100%', padding: '8px 10px',
                    border: '0.5px solid var(--border)',
                    borderRadius: '8px', fontSize: '13px',
                    fontFamily: 'var(--sans)', marginBottom: '12px', outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setOpen(false)} style={{
                    padding: '7px 14px', border: '0.5px solid var(--border)',
                    borderRadius: '8px', background: 'transparent',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--sans)',
                  }}>Cancel</button>
                  <button onClick={submit} style={{
                    padding: '7px 14px', background: 'var(--accent)',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'var(--sans)',
                  }}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
