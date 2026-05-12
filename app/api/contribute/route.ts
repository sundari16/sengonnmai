// Citizen contribution API — accepts data corrections, RTI results, and new source links.
// Submissions are logged (stdout for now; wire to Airtable/Notion in v4).
// No auth required; honeypot field used for spam filtering.

import { NextRequest, NextResponse } from 'next/server'

export type ContributionType =
  | 'data_correction'
  | 'rti_result'
  | 'new_source'
  | 'scheme_experience'
  | 'beneficiary_count'

export type ContributionPayload = {
  type: ContributionType
  target_id: string          // dept slug, scheme id, entity slug, or timeline event id
  target_type: 'department' | 'scheme' | 'entity' | 'timeline' | 'other'
  field?: string             // which field is being corrected (e.g. "budget_cr")
  current_value?: string     // what the site shows now
  correct_value: string      // what the contributor says it should be
  source_url?: string        // URL of the official document backing the correction
  source_doc?: string        // Document name / RTI application number
  contributor_email?: string // optional; not stored publicly
  // Anti-spam
  honeypot?: string          // must be empty for legitimate submissions
}

type ValidationError = { field: string; message: string }

function validatePayload(body: unknown): ValidationError[] {
  const errors: ValidationError[] = []
  if (typeof body !== 'object' || body === null) {
    return [{ field: 'body', message: 'Request body must be a JSON object' }]
  }
  const b = body as Record<string, unknown>

  const VALID_TYPES: ContributionType[] = [
    'data_correction', 'rti_result', 'new_source', 'scheme_experience', 'beneficiary_count',
  ]
  if (!VALID_TYPES.includes(b.type as ContributionType)) {
    errors.push({ field: 'type', message: `Must be one of: ${VALID_TYPES.join(', ')}` })
  }
  if (typeof b.target_id !== 'string' || b.target_id.trim().length === 0) {
    errors.push({ field: 'target_id', message: 'Required non-empty string' })
  }
  if (typeof b.correct_value !== 'string' || b.correct_value.trim().length < 3) {
    errors.push({ field: 'correct_value', message: 'Must be at least 3 characters' })
  }
  if (b.correct_value && typeof b.correct_value === 'string' && b.correct_value.length > 2000) {
    errors.push({ field: 'correct_value', message: 'Maximum 2000 characters' })
  }
  if (b.source_url && typeof b.source_url === 'string') {
    try {
      new URL(b.source_url)
    } catch {
      errors.push({ field: 'source_url', message: 'Must be a valid URL' })
    }
  }
  if (b.contributor_email && typeof b.contributor_email === 'string') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.contributor_email)) {
      errors.push({ field: 'contributor_email', message: 'Invalid email format' })
    }
  }
  return errors
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Honeypot check — bots fill hidden fields
  if (typeof body === 'object' && body !== null && (body as Record<string, unknown>).honeypot) {
    return NextResponse.json({ success: true }) // Silent pass
  }

  const errors = validatePayload(body)
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  const payload = body as ContributionPayload

  // Sanitise — strip email from log for privacy
  const logEntry = {
    ts: new Date().toISOString(),
    type: payload.type,
    target_type: payload.target_type,
    target_id: payload.target_id,
    field: payload.field ?? null,
    current_value: payload.current_value ?? null,
    correct_value: payload.correct_value.slice(0, 500),
    source_url: payload.source_url ?? null,
    source_doc: payload.source_doc ?? null,
    has_email: !!payload.contributor_email,
  }

  // Log to stdout — wire to external store in v4
  console.log('[CONTRIBUTE]', JSON.stringify(logEntry))

  return NextResponse.json({
    success: true,
    message: 'Thank you for contributing. We review submissions weekly and update the site when verified.',
    ref: `CTB-${Date.now().toString(36).toUpperCase()}`,
  })
}

// List recent contributions (admin only — add auth in v4)
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    note: 'Contribution history requires admin authentication (not yet implemented). Check server logs for submitted entries.',
    endpoint: '/api/contribute',
    fields: {
      type: 'ContributionType',
      target_id: 'string',
      target_type: 'department | scheme | entity | timeline | other',
      correct_value: 'string (max 2000 chars)',
      source_url: 'string (URL, optional)',
      source_doc: 'string (optional)',
      contributor_email: 'string (optional, not stored publicly)',
    },
  })
}
