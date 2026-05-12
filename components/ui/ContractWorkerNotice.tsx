import type { ContractWorkerCategory } from '@/types'
import RTIDisclaimer from './RTIDisclaimer'

type Props = {
  categories: ContractWorkerCategory[]
}

const DATA_QUALITY_LABEL: Record<string, string> = {
  available: 'Official data',
  estimated: 'Estimated',
  not_available: 'Not published',
  rti_needed: 'RTI needed',
}

const RTI_TEMPLATE = `To,
The Public Information Officer,
[Department Name],
Government of Tamil Nadu.

Subject: Information under Right to Information Act 2005

I request the following information:
1. Total number of contract/outsourced staff engaged as on [date]
2. Role-wise breakdown with approximate pay scales
3. Name of agency/contractor through whom they are engaged
4. Copy of contract/agreement with the agency

I am enclosing a demand draft / postal order for Rs 10 towards the RTI fee.

Name:
Address:
Date:`

const RTI_TEMPLATE_TA = `பொது தகவல் அதிகாரி அவர்களுக்கு,
[துறை பெயர்],
தமிழ்நாடு அரசு.

பொருள்: தகவல் அறியும் உரிமைச் சட்டம் 2005 படி தகவல் கோரல்

கீழ்க்கண்ட தகவல்களை வழங்க கோருகிறேன்:
1. [தேதி] நிலவரப்படி ஒப்பந்த அடிப்படையில் பணிபுரிவோர் மொத்த எண்ணிக்கை
2. பணி வகை வாரியான விவரம் மற்றும் ஊதிய விவரம்
3. ஒப்பந்தம் வழங்கிய நிறுவனம் / முகவர் பெயர்
4. நிறுவனத்துடன் செய்து கொண்ட ஒப்பந்த நகல்

RTI கட்டணமாக ரூ. 10 இணைக்கப்படுகிறது.

பெயர்:
முகவரி:
தேதி:`

export default function ContractWorkerNotice({ categories }: Props) {
  const hasUnavailable = categories.some(c => c.data_quality === 'not_available')

  return (
    <div style={{
      background: '#FDF6EC',
      border: '1px solid #E8C97A',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
    }}>
      <p style={{ fontWeight: 700, color: '#946010', margin: '0 0 0.25rem', fontSize: '0.95rem' }}>
        Contract workforce in this department
      </p>
      <p style={{ color: '#6E6E68', fontSize: '0.82rem', margin: '0 0 1rem' }}>
        இந்தத் துறையில் ஒப்பந்த அடிப்படையில் பணிபுரிவோர்
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{
            background: '#fff',
            border: '1px solid #E2DED6',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#3A3A36', fontSize: '0.9rem' }}>{cat.role_en}</span>
                <span style={{ color: '#6E6E68', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{cat.role_ta}</span>
              </div>
              <span style={{
                background: cat.data_quality === 'available' ? '#F2F8F4' : '#FDF6EC',
                color: cat.data_quality === 'available' ? '#1A5C38' : '#946010',
                fontSize: '0.72rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginLeft: '0.5rem',
              }}>{DATA_QUALITY_LABEL[cat.data_quality]}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem 1rem', marginTop: '0.5rem' }}>
              <p style={{ color: '#6E6E68', fontSize: '0.82rem', margin: 0 }}>
                <strong>Approximate count:</strong> ~{cat.count_approximate.toLocaleString('en-IN')}
              </p>
              <p style={{ color: '#6E6E68', fontSize: '0.82rem', margin: 0 }}>
                <strong>Pay range:</strong> {cat.pay_range_en}
              </p>
              <p style={{ color: '#6E6E68', fontSize: '0.82rem', margin: 0 }}>
                <strong>vs permanent:</strong> {cat.vs_permanent_pay_en}
              </p>
            </div>

            <p style={{ color: '#3A3A36', fontSize: '0.82rem', margin: '0.5rem 0 0.25rem', lineHeight: 1.5 }}>
              <strong>Services delivered:</strong> {cat.services_they_deliver_en}
            </p>
            <p style={{ color: '#6E6E68', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
              <strong>Employment terms:</strong> {cat.job_security_en}
            </p>
            <p style={{ color: '#A0A09A', fontSize: '0.75rem', margin: '0.4rem 0 0' }}>
              Source: {cat.source}
            </p>
          </div>
        ))}
      </div>

      <p style={{ color: '#6E6E68', fontSize: '0.82rem', margin: '0 0 0.25rem', lineHeight: 1.6 }}>
        Contract workers deliver many citizen-facing services.
        Their employment terms differ from permanent staff.
        Exact counts require RTI from department.
      </p>

      {hasUnavailable && (
        <RTIDisclaimer
          dept_name_en="this department"
          dept_name_ta="இந்தத் துறை"
          pio_designation="Public Information Officer"
          information_type_en="Contract workforce count and pay details"
          template_en={RTI_TEMPLATE}
          template_ta={RTI_TEMPLATE_TA}
          filing_fee={10}
          response_days={30}
          appeal_body="First Appellate Authority, department"
        />
      )}
    </div>
  )
}
