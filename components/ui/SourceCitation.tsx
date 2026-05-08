type Props = {
  org: string
  document: string
  year: string
  url: string
}

export default function SourceCitation({ org, document, year, url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        marginTop: '6px',
        fontFamily: 'var(--mono)',
        fontSize: '10px',
        color: 'var(--ink-4)',
        textDecoration: 'none',
      }}
    >
      {org} · {document} · {year} ↗
    </a>
  )
}
