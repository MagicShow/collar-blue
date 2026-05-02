import { useState } from 'react'

const COST_CATEGORIES = ['Materials', 'Labor', 'Equipment', 'Permits & Fees', 'Subcontractor', 'Other']

const COMMON_MATERIALS = [
  'Drywall Sheets', 'Joint Compound', 'Drywall Tape', 'Primer', 'Paint',
  'Lumber', 'Plywood', 'Insulation', 'Flooring', 'Tile', 'Grout', 'Thinset',
  'Cabinets', 'Countertops', 'Hardware', 'Electrical', 'Plumbing'
]

const COMMON_LABOR = [
  'Demolition', 'Framing', 'Electrical', 'Plumbing', 'Drywall Install',
  'Taping & Mud', 'Sandtexturing', 'Paint', 'Flooring Install', 'Trim & Finish'
]

export default function ContractorCosts({ costs, onChange }) {
  const [category, setCategory] = useState('Materials')
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState('')
  const [cost, setCost] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addCost = () => {
    if (!name.trim() || !cost) return
    onChange([
      ...costs,
      {
        id: Date.now().toString(),
        category,
        name: name.trim(),
        qty: qty || '1',
        unit: unit || 'lot',
        cost: parseFloat(cost),
      },
    ])
    setName('')
    setQty('')
    setUnit('')
    setCost('')
    setShowSuggestions(false)
  }

  const removeCost = (id) => {
    onChange(costs.filter(c => c.id !== id))
  }

  const suggestions = category === 'Materials' ? COMMON_MATERIALS : category === 'Labor' ? COMMON_LABOR : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '16px' }}>
          Enter your known costs to ensure accurate margins across the quote tiers.
          These are <strong>your costs</strong> — not the prices shown to the client.
        </p>
      </div>

      {/* Cost entry row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setName(''); }}
            style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'white', minWidth: '130px' }}
          >
            {COST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder={category === 'Labor' ? 'e.g. Drywall Install' : 'e.g. Drywall Sheets'}
              value={name}
              onChange={e => { setName(e.target.value); setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0); }}
              onFocus={() => setShowSuggestions(name.length > 0 && suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10, maxHeight: '160px', overflowY: 'auto' }}>
                {suggestions.filter(s => s.toLowerCase().includes(name.toLowerCase())).map(s => (
                  <div
                    key={s}
                    onMouseDown={() => { setName(s); setShowSuggestions(false); }}
                    style={{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                    last={s === suggestions.filter(ss => ss.toLowerCase().includes(name.toLowerCase())).slice(-1)[0] ? 'none' : undefined}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Qty"
            value={qty}
            onChange={e => setQty(e.target.value)}
            min="0"
            style={{ width: '70px', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
          />
          <input
            type="text"
            placeholder="Unit"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            style={{ width: '80px', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
          />
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '14px' }}>$</span>
            <input
              type="number"
              placeholder="Your cost"
              value={cost}
              onChange={e => setCost(e.target.value)}
              min="0"
              step="0.01"
              style={{ width: '100%', padding: '10px 12px 10px 28px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
            />
          </div>
          <button
            type="button"
            onClick={addCost}
            disabled={!name.trim() || !cost}
            style={{ padding: '10px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Cost list by category */}
      {COST_CATEGORIES.map(cat => {
        const catCosts = costs.filter(c => c.category === cat)
        if (catCosts.length === 0) return null
        const catTotal = catCosts.reduce((sum, c) => sum + c.cost * (parseFloat(c.qty) || 1), 0)
        return (
          <div key={cat} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>{cat}</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>${catTotal.toFixed(2)}</span>
            </div>
            {catCosts.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'white' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.qty} {c.unit} × ${c.cost.toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>${(c.cost * (parseFloat(c.qty) || 1)).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => removeCost(c.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      {/* Total */}
      {costs.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--charcoal)', color: 'white', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Total Costs</span>
          <span style={{ fontSize: '20px', fontWeight: 800 }}>
            ${costs.reduce((sum, c) => sum + c.cost * (parseFloat(c.qty) || 1), 0).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  )
}