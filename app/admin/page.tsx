'use client'
import { useState, useEffect, useCallback } from 'react'
import Nav from '@/components/ui/Nav'
import Topbar from '@/components/ui/Topbar'
import { DEPARTMENTS } from '@/lib/departments'
import { ALL_SCHEMES } from '@/lib/schemes-data'
import { TN_ENTITIES } from '@/lib/entities-data'
import { TN_TIMELINE } from '@/lib/timeline-data'
import type { Department } from '@/types'
import type { Scheme } from '@/types'

type Tab = 'overview' | 'departments' | 'schemes' | 'entities' | 'queue'

interface QueueItem {
  id: string
  source_type: string
  pipeline_name: string
  data: Record<string, unknown>
  confidence: number
  status: string
  created_at: string
  reviewer_notes: string | null
}

const QUALITY_COLOR: Record<string, string> = {
  available:     '#1A5C38',
  estimated:     '#946010',
  not_available: '#B83232',
}

function QBadge({ q }: { q: string }) {
  return (
    <span style={{ color: QUALITY_COLOR[q] ?? '#555', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const }}>
      {q.replace('_', ' ')}
    </span>
  )
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.875rem 1rem' }}>
      <p style={{ color: 'var(--ink-3)', fontSize: '0.68rem', margin: '0 0 0.2rem', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>{label}</p>
      <p style={{ color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 700, margin: 0, fontFamily: 'var(--mono)' }}>{value}</p>
      {sub && <p style={{ color: 'var(--ink-4)', fontSize: '0.7rem', margin: '0.15rem 0 0' }}>{sub}</p>}
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState<string | null>(null)
  const [actioning, setActioning] = useState<string | null>(null)

  const loadQueue = useCallback(async () => {
    setQueueLoading(true)
    setQueueError(null)
    try {
      const res = await fetch('/api/admin/queue')
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setQueue(json.items ?? [])
    } catch (e: unknown) {
      setQueueError(String(e))
    } finally {
      setQueueLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'queue') loadQueue()
  }, [tab, loadQueue])

  async function action(id: string, status: 'approved' | 'rejected') {
    setActioning(id)
    await fetch('/api/admin/queue', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setActioning(null)
    loadQueue()
  }

  const deptRedFlags   = DEPARTMENTS.reduce((s: number, d: Department) => s + d.flag_count_red, 0)
  const deptAmberFlags = DEPARTMENTS.reduce((s: number, d: Department) => s + d.flag_count_amber, 0)
  const deptGreenFlags = DEPARTMENTS.reduce((s: number, d: Department) => s + d.flag_count_green, 0)

  const schemeTypes = ALL_SCHEMES.reduce<Record<string, number>>((acc, s: Scheme) => {
    acc[s.scheme_type] = (acc[s.scheme_type] ?? 0) + 1
    return acc
  }, {})

  const entityLowQuality = TN_ENTITIES.filter(e => e.data_quality === 'not_available')
  const entityProfitable = TN_ENTITIES.filter(e => e.annual_profit_loss_cr > 0)

  const qPending  = queue.filter(q => q.status === 'pending_review')
  const qApproved = queue.filter(q => q.status === 'approved')
  const qRejected = queue.filter(q => q.status === 'rejected')
  const lastRun   = queue[0]?.created_at

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',    label: 'Overview' },
    { id: 'queue',       label: `Pipeline Queue${qPending.length ? ` (${qPending.length})` : ''}` },
    { id: 'departments', label: `Departments (${DEPARTMENTS.length})` },
    { id: 'schemes',     label: `Schemes (${ALL_SCHEMES.length})` },
    { id: 'entities',    label: `Entities (${TN_ENTITIES.length})` },
  ]

  return (
    <>
      <Topbar />
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem max(1.5rem,5vw) 4rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--ink)' }}>
          Admin — Data Quality Dashboard
        </h1>
        <p style={{ color: 'var(--ink-3)', fontSize: '0.82rem', margin: '0 0 2rem' }}>
          Internal view · Review flags, data completeness, and source quality across all datasets
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t.id ? 'var(--accent)' : 'var(--ink-3)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.6rem', marginBottom: '2rem' }}>
              <StatBox label="Departments" value={DEPARTMENTS.length} sub="43 official TN depts" />
              <StatBox label="Schemes" value={ALL_SCHEMES.length} sub="across all departments" />
              <StatBox label="Entities / PSUs" value={TN_ENTITIES.length} sub="profiled with financials" />
              <StatBox label="Timeline events" value={TN_TIMELINE.length} sub="1947–2025" />
              <StatBox label="Red flags" value={deptRedFlags} sub="critical data gaps" />
              <StatBox label="Amber flags" value={deptAmberFlags} sub="partial data" />
              <StatBox label="Green flags" value={deptGreenFlags} sub="data verified" />
            </div>

            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
              Scheme type distribution
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {(Object.entries(schemeTypes) as [string, number][])
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.35rem 0.75rem' }}>
                    <span style={{ color: 'var(--ink-2)', fontSize: '0.78rem' }}>{type.replace(/_/g, ' ')} </span>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.83rem', fontFamily: 'var(--mono)' }}>{count}</span>
                  </div>
                ))}
            </div>

            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--ink)' }}>
              Entities with missing data
            </h2>
            {entityLowQuality.length === 0 ? (
              <p style={{ color: 'var(--ink-3)', fontSize: '0.85rem' }}>All entities have available or estimated data.</p>
            ) : (
              <ul style={{ color: 'var(--ink-2)', fontSize: '0.83rem', lineHeight: 1.9, paddingLeft: '1.25rem' }}>
                {entityLowQuality.map(e => (
                  <li key={e.id}>{e.acronym} — {e.name_en} <span style={{ color: '#B83232', fontWeight: 600 }}>[not available]</span></li>
                ))}
              </ul>
            )}

            <div style={{ marginTop: '2rem', background: '#FDF6EC', border: '1px solid #E8C87A', borderRadius: 6, padding: '1rem 1.25rem' }}>
              <p style={{ color: '#946010', fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.35rem' }}>Data update priorities</p>
              <ul style={{ color: '#6B4A10', fontSize: '0.8rem', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.9 }}>
                <li>Budget figures: refresh after TN Budget presentation (February)</li>
                <li>Scheme beneficiary counts: update after quarterly PFMS / DBT reports</li>
                <li>Entity financials: update after annual reports published (August–October)</li>
                <li>Timeline: add events from TN Gazette weekly scraper</li>
                <li>Reservation: update if 16th FC changes devolution or new court orders</li>
              </ul>
            </div>
          </>
        )}

        {/* Pipeline Queue tab */}
        {tab === 'queue' && (
          <>
            {/* Summary row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <StatBox label="Pipeline last run" value={lastRun ? new Date(lastRun).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} sub={lastRun ? new Date(lastRun).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' UTC' : 'no runs yet'} />
              <StatBox label="Pending review" value={queueLoading ? '…' : qPending.length} sub="awaiting decision" />
              <StatBox label="Approved" value={queueLoading ? '…' : qApproved.length} sub="ready to publish" />
              <StatBox label="Rejected" value={queueLoading ? '…' : qRejected.length} sub="excluded" />
            </div>

            {queueError && (
              <div style={{ background: '#FEE', border: '1px solid #B83232', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#B83232', fontSize: '0.83rem' }}>
                Error loading queue: {queueError}
              </div>
            )}

            {queueLoading && <p style={{ color: 'var(--ink-3)', fontSize: '0.85rem' }}>Loading queue…</p>}

            {!queueLoading && qPending.length === 0 && !queueError && (
              <p style={{ color: 'var(--ink-3)', fontSize: '0.85rem' }}>No items pending review.</p>
            )}

            {/* Pending items grouped by source_type */}
            {(['budget', 'cag', 'gazette', 'schemes'] as const).map(stype => {
              const items = qPending.filter(q => q.source_type === stype)
              if (!items.length) return null
              return (
                <div key={stype} style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.6rem', color: 'var(--ink)', textTransform: 'capitalize' }}>
                    {stype} <span style={{ color: 'var(--ink-3)', fontWeight: 400, fontSize: '0.85rem' }}>({items.length} items)</span>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.pipeline_name}</p>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink)', wordBreak: 'break-word' }}>
                            {JSON.stringify(item.data).slice(0, 160)}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--mono)', color: item.confidence >= 0.8 ? '#1A5C38' : '#946010', fontWeight: 700 }}>
                            {(item.confidence * 100).toFixed(0)}%
                          </span>
                          <button
                            disabled={actioning === item.id}
                            onClick={() => action(item.id, 'approved')}
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', cursor: 'pointer', background: '#1A5C38', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}>
                            Approve
                          </button>
                          <button
                            disabled={actioning === item.id}
                            onClick={() => action(item.id, 'rejected')}
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', cursor: 'pointer', background: '#B83232', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Departments tab */}
        {tab === 'departments' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Department', 'Budget (Cr)', 'Staff Filled/Sanc', 'Flags R/A/G', 'Type'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left' as const, color: 'var(--ink-3)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' as const, letterSpacing: '0.03em', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((d: Department, i: number) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink)', fontWeight: 500 }}>
                      <a href={`/dept/${d.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{d.name_en}</a>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>
                      {d.budget_cr.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', color: d.total_staff_filled < d.total_staff_sanctioned * 0.85 ? '#B83232' : 'var(--ink-2)' }}>
                      {d.total_staff_filled.toLocaleString('en-IN')}/{d.total_staff_sanctioned.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ color: '#B83232', fontWeight: 700 }}>{d.flag_count_red}</span>
                      <span style={{ color: 'var(--ink-3)' }}>/</span>
                      <span style={{ color: '#946010', fontWeight: 700 }}>{d.flag_count_amber}</span>
                      <span style={{ color: 'var(--ink-3)' }}>/</span>
                      <span style={{ color: '#1A5C38', fontWeight: 700 }}>{d.flag_count_green}</span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-3)' }}>{d.dept_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Schemes tab */}
        {tab === 'schemes' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Scheme', 'Type', 'Dept', 'Beneficiaries (claimed)', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left' as const, color: 'var(--ink-3)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' as const, letterSpacing: '0.03em', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_SCHEMES.map((s: Scheme, i: number) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <a href={`/schemes/${s.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>{s.name_en}</a>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-3)', whiteSpace: 'nowrap' as const }}>{s.scheme_type}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-3)' }}>{s.dept_id}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-2)', fontSize: '0.78rem' }}>{s.beneficiaries_claimed}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: s.status === 'active' ? '#1A5C38' : '#946010', fontWeight: 600, fontSize: '0.78rem' }}>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Entities tab */}
        {tab === 'entities' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Entity', 'Status', 'Revenue (Cr)', 'P&L (Cr)', 'Staff', 'Data', 'Last Audit'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left' as const, color: 'var(--ink-3)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' as const, letterSpacing: '0.03em', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TN_ENTITIES.map((e, i) => {
                  const isLoss = e.annual_profit_loss_cr < 0
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-2)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <a href={`/entities/${e.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>{e.acronym}</a>
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-2)', whiteSpace: 'nowrap' as const }}>{e.status}</td>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{e.annual_revenue_cr.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', color: isLoss ? '#B83232' : '#1A5C38', fontWeight: 600 }}>
                        {isLoss ? '−' : '+'}₹{Math.abs(e.annual_profit_loss_cr).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', color: 'var(--ink-2)' }}>{e.employees.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}><QBadge q={e.data_quality} /></td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-3)' }}>{e.last_audit_year}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--bg-2)' }}>
                  <td colSpan={2} style={{ padding: '0.5rem 0.75rem', color: 'var(--ink)', fontWeight: 600, fontSize: '0.8rem' }}>Totals</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--ink)' }}>
                    {TN_ENTITIES.reduce((s, e) => s + e.annual_revenue_cr, 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', fontWeight: 700, color: TN_ENTITIES.reduce((s, e) => s + e.annual_profit_loss_cr, 0) < 0 ? '#B83232' : '#1A5C38' }}>
                    {TN_ENTITIES.reduce((s, e) => s + e.annual_profit_loss_cr, 0) < 0 ? '−' : '+'}
                    {Math.abs(TN_ENTITIES.reduce((s, e) => s + e.annual_profit_loss_cr, 0)).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--ink)' }}>
                    {TN_ENTITIES.reduce((s, e) => s + e.employees, 0).toLocaleString('en-IN')}
                  </td>
                  <td colSpan={2} style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-3)', fontSize: '0.75rem' }}>
                    {entityProfitable.length}/{TN_ENTITIES.length} profitable
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </main>
    </>
  )
}
