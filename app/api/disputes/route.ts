import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { flagId, what, source } = body
  console.log('Dispute received:', { flagId, what, source })
  return NextResponse.json({ success: true })
}
