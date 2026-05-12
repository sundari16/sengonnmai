'use client'
import { useParams } from 'next/navigation'
import EmbedWidget from '@/components/ui/EmbedWidget'

export default function EmbedPage() {
  const params = useParams()
  const type = params.type as string
  const id = params.id as string

  return (
    <html>
      <body style={{ margin: 0, padding: '0.5rem', background: 'transparent', fontFamily: 'system-ui, sans-serif' }}>
        <EmbedWidget type={type as 'scheme' | 'department' | 'entity'} id={id} />
        <p style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: '0.25rem', textAlign: 'right' }}>
          Data: <a href="https://sengonnmai.in" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280' }}>sengonnmai.in</a>
        </p>
      </body>
    </html>
  )
}
