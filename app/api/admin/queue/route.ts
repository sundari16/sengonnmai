import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

export async function GET() {
  try {
    const client = sb()
    const { data, error } = await client
      .from('admin_queue')
      .select('id, source_type, pipeline_name, data, confidence, status, created_at, reviewer_notes')
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ items: data })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, reviewer_notes } = await req.json()
    if (!id || !['approved', 'rejected'].includes(status))
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

    const client = sb()
    const { error } = await client
      .from('admin_queue')
      .update({ status, reviewer_notes: reviewer_notes ?? null, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
