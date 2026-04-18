import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

// In a real app this would come from the server
const MOCK_QUOTE = {
  id: 'est-001',
  client: { name: 'Maria Garcia', address: '123 Main St, Suite 4B', phone: '(555) 867-5309', email: 'maria@garcia.com' },
  projectType: 'Drywall & Painting',
  tiers: [
    {
      name: 'Basic',
      description: 'Essential work, budget-friendly materials',
      lineItems: [
        { name: 'Labor — Demolition', qty: '8', unit: 'hrs', rate: '65', total: '520.00' },
        { name: 'Labor — Installation', qty: '16', unit: 'hrs', rate: '65', total: '1040.00' },
        { name: 'Drywall Sheets (Standard)', qty: '24', unit: 'sheets', rate: '18', total: '432.00' },
        { name: 'Joint Compound', qty: '6', unit: 'bags', rate: '12', total: '72.00' },
        { name: 'Paint', qty: '3', unit: 'gal', rate: '38', total: '114.00' },
      ],
      total: 2178.00,
    },
    {
      name: 'Standard',
      description: 'Quality materials, professional finish',
      lineItems: [
        { name: 'Labor — Demolition', qty: '10', unit: 'hrs', rate: '65', total: '650.00' },
        { name: 'Labor — Installation', qty: '24', unit: 'hrs', rate: '65', total: '1560.00' },
        { name: 'Drywall Sheets (Moisture Resistant)', qty: '24', unit: 'sheets', rate: '24', total: '576.00' },
        { name: 'Primer (High-Adhesion)', qty: '3', unit: 'gal', rate: '38', total: '114.00' },
        { name: 'Paint (Premium Eggshell)', qty: '4', unit: 'gal', rate: '52', total: '208.00' },
        { name: 'Corner Beads', qty: '12', unit: 'pcs', rate: '5', total: '60.00' },
      ],
      total: 3168.00,
    },
    {
      name: 'Premium',
      description: 'Top-tier materials, luxury finishes',
      lineItems: [
        { name: 'Labor — Demolition & Prep', qty: '14', unit: 'hrs', rate: '75', total: '1050.00' },
        { name: 'Labor — Expert Installation', qty: '32', unit: 'hrs', rate: '75', total: '2400.00' },
        { name: 'Drywall Sheets (Fire-Rated)', qty: '24', unit: 'sheets', rate: '32', total: '768.00' },
        { name: 'Primer (Stain-Blocking)', qty: '3', unit: 'gal', rate: '48', total: '144.00' },
        { name: 'Paint (Luxury Matte)', qty: '5', unit: 'gal', rate: '72', total: '360.00' },
        { name: 'Decorative Trim & Moldings', qty: '1', unit: 'lot', rate: '350', total: '350.00' },
      ],
      total: 5072.00,
    },
  ],
}

export default function QuotePreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const quote = MOCK_QUOTE

  const grandTotal = quote.tiers.reduce((sum, t) => sum + t.total, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavBar
        title="Quote Preview"
        lead={quote.client.name}
        onBack={() => navigate('/dashboard')}
        onClear={() => {}}
      />

      <div className="app-content">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 className="h1">{quote.client.name}</h1>
              <p className="muted" style={{ fontSize: '14px', marginTop: '4px' }}>{quote.client.address}</p>
              <p className="muted" style={{ fontSize: '14px' }}>{quote.client.phone} · {quote.client.email}</p>
            </div>
            <span className="badge badge-blue">{quote.projectType}</span>
          </div>
          <AccentBarInline />
        </div>

        {/* Tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          {quote.tiers.map(tier => (
            <div key={tier.name} className="tier-card">
              <div className="tier-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="tier-name">{tier.name}</div>
                    <div className="tier-desc">{tier.description}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700 }}>${tier.total.toFixed(2)}</div>
                  </div>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: '4px 0', marginTop: '4px' }}
                  onClick={() => navigate('/new-estimate')}
                >
                  Edit ✎
                </button>
              </div>

              <div className="tier-card-body">
                <table className="line-items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tier.lineItems.map((item, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '14px' }}>{item.name}</td>
                        <td style={{ fontSize: '14px', color: 'var(--muted)' }}>{item.qty}</td>
                        <td style={{ fontSize: '14px', color: 'var(--muted)' }}>{item.unit}</td>
                        <td style={{ fontSize: '14px', color: 'var(--muted)' }}>${item.rate}</td>
                        <td style={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Grand total */}
        <div style={{ padding: '20px', background: 'var(--dark)', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Project Range</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Basic → Premium</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>${grandTotal.toFixed(2)}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Premium total</div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary"
          onClick={() => navigate('/new-estimate')}
        >
          Send Quote to Client
        </button>
      </div>
    </div>
  )
}

function AccentBarInline() {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {['#86868B', '#0071E3', '#FF9500'].map(c => (
        <div key={c} style={{ flex: 1, height: '3px', background: c, borderRadius: '2px' }} />
      ))}
    </div>
  )
}
