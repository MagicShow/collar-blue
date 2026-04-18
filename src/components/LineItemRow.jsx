import { useState } from 'react'

export default function LineItemRow({ item, onChange }) {
  const handleChange = (field, value) => {
    const updated = { ...item, [field]: value }
    // Recalculate total
    const qty = parseFloat(updated.qty) || 0
    const rate = parseFloat(updated.rate) || 0
    updated.total = (qty * rate).toFixed(2)
    onChange(updated)
  }

  return (
    <tr>
      <td style={{ minWidth: '140px' }}>
        <input
          className="line-item-input"
          value={item.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Description"
        />
      </td>
      <td style={{ width: '60px' }}>
        <input
          className="line-item-input"
          type="number"
          min="0"
          value={item.qty}
          onChange={e => handleChange('qty', e.target.value)}
          placeholder="Qty"
        />
      </td>
      <td style={{ width: '70px' }}>
        <input
          className="line-item-input"
          value={item.unit}
          onChange={e => handleChange('unit', e.target.value)}
          placeholder="Unit"
        />
      </td>
      <td style={{ width: '80px' }}>
        <input
          className="line-item-input"
          type="number"
          min="0"
          step="0.01"
          value={item.rate}
          onChange={e => handleChange('rate', e.target.value)}
          placeholder="Rate"
        />
      </td>
      <td style={{ width: '80px', textAlign: 'right' }}>
        <span className="line-item-total">
          ${item.total || '0.00'}
        </span>
      </td>
    </tr>
  )
}
