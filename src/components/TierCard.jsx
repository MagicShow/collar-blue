import { useState } from 'react'
import LineItemRow from './LineItemRow'

const TIER_CONFIG = {
  Basic: {
    description: 'Essential work, budget-friendly materials',
    accentColor: '#86868B',
  },
  Standard: {
    description: 'Quality materials, professional finish',
    accentColor: '#0071E3',
  },
  Premium: {
    description: 'Top-tier materials, luxury finishes',
    accentColor: '#FF9500',
  },
}

export default function TierCard({ tier, lineItems = [], total = 0, visualUrl, onEdit, onGenerateVisual, generating }) {
  const [items, setItems] = useState(lineItems)
  const config = TIER_CONFIG[tier] || TIER_CONFIG.Standard

  const handleItemChange = (index, updated) => {
    const newItems = [...items]
    newItems[index] = updated
    setItems(newItems)
    if (onEdit) onEdit(tier, newItems)
  }

  const addItem = () => {
    const newItem = { name: '', qty: '1', unit: 'ea', rate: '0', total: '0' }
    const newItems = [...items, newItem]
    setItems(newItems)
    if (onEdit) onEdit(tier, newItems)
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    if (onEdit) onEdit(tier, newItems)
  }

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0
    const rate = parseFloat(item.rate) || 0
    return sum + qty * rate
  }, 0)

  return (
    <div className={`tier-card ${tier.toLowerCase()}`}>
      {/* Header */}
      <div className="tier-card-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="tier-name">{tier}</div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: config.accentColor }} />
        </div>
        <div className="tier-desc">{config.description}</div>
      </div>

      {/* Visual */}
      <div style={{ padding: '16px 20px 0' }}>
        {visualUrl ? (
          <div className="tier-visual">
            <img src={visualUrl} alt={`${tier} tier visual`} />
          </div>
        ) : generating ? (
          <div className="shimmer" style={{ width: '100%', aspectRatio: '16/9', marginBottom: '12px' }} />
        ) : null}

        <button
          className="btn btn-secondary btn-sm btn-full"
          onClick={onGenerateVisual}
          disabled={generating}
          type="button"
          style={{ marginBottom: '16px' }}
        >
          {generating ? 'Generating…' : visualUrl ? 'Regenerate Visual' : 'Generate Visual'}
        </button>
      </div>

      {/* Line items */}
      <div className="tier-card-body" style={{ paddingTop: 0 }}>
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
            {items.map((item, i) => (
              <LineItemRow
                key={i}
                item={item}
                onChange={updated => handleItemChange(i, updated)}
              />
            ))}
          </tbody>
        </table>

        <button
          className="tier-add-item-btn"
          onClick={addItem}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Line Item
        </button>
      </div>

      {/* Footer total */}
      <div className="tier-total">
        <span className="tier-total-label">Subtotal</span>
        <span className="tier-total-value">${subtotal.toFixed(2)}</span>
      </div>
    </div>
  )
}
