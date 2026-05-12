type Props = {
  designation: string
  powers: string[]
  limitations: string[]
  transferAuthority: string
  financialDelegation: string
}

export default function DecisionPowers({
  designation,
  powers,
  limitations,
  transferAuthority,
  financialDelegation,
}: Props) {
  return (
    <div style={{
      border: '1px solid #E2DED6',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
      marginBottom: '1rem',
      background: '#fff',
    }}>
      <p style={{
        fontWeight: 600,
        color: '#111110',
        margin: '0 0 0.75rem',
        fontSize: '0.95rem',
      }}>{designation}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '0.75rem',
      }}>
        <div>
          <p style={{
            fontWeight: 600,
            color: '#1A5C38',
            fontSize: '0.8rem',
            margin: '0 0 0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>Decision powers</p>
          <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
            {powers.map((p, i) => (
              <li key={i} style={{
                color: '#3A3A36',
                fontSize: '0.85rem',
                marginBottom: '0.3rem',
                lineHeight: 1.5,
              }}>{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{
            fontWeight: 600,
            color: '#946010',
            fontSize: '0.8rem',
            margin: '0 0 0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>Limitations</p>
          <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
            {limitations.map((l, i) => (
              <li key={i} style={{
                color: '#3A3A36',
                fontSize: '0.85rem',
                marginBottom: '0.3rem',
                lineHeight: 1.5,
              }}>{l}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #F0EEE9',
        paddingTop: '0.75rem',
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        fontSize: '0.82rem',
        color: '#6E6E68',
      }}>
        <span><strong style={{ color: '#3A3A36' }}>Financial delegation:</strong> {financialDelegation}</span>
        <span><strong style={{ color: '#3A3A36' }}>Transfer authority:</strong> {transferAuthority}</span>
      </div>

      <p style={{
        fontSize: '0.75rem',
        color: '#A0A09A',
        margin: '0.5rem 0 0',
      }}>
        Source: TN Financial Code · Delegation of Financial Powers Rules · TN Service Rules
      </p>
    </div>
  )
}
