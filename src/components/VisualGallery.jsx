import { useState } from 'react'

const MOCK_VISUALS = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80',
]

export default function VisualGallery({ visuals = [], onRegenerate, onAdd }) {
  const [loading, setLoading] = useState({})

  const handleRegenerate = async (index) => {
    setLoading(prev => ({ ...prev, [index]: true }))
    await onRegenerate?.(index)
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [index]: false }))
    }, 1800)
  }

  return (
    <div>
      <div className="visual-gallery">
        {visuals.map((url, i) => (
          <div key={i} className="visual-card">
            {loading[i] ? (
              <div className="shimmer dark" style={{ width: '100%', aspectRatio: '16/9' }} />
            ) : (
              <img className="visual-card-img" src={url} alt={`Visual ${i + 1}`} />
            )}
            <div className="visual-card-actions">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleRegenerate(i)}
                disabled={loading[i]}
                type="button"
                style={{ flex: 1, fontSize: '12px' }}
              >
                {loading[i] ? '…' : '↻'}
              </button>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {[...Array(Math.max(0, 2 - visuals.length))].map((_, i) => (
          <div key={`empty-${i}`} className="visual-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '16/9', background: 'var(--bg)', border: '2px dashed var(--border)', cursor: 'pointer' }}
            onClick={onAdd}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onAdd?.()}
          >
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>➕</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Add Visual</div>
            </div>
          </div>
        ))}
      </div>

      {visuals.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', marginTop: '12px' }}>
          No visuals yet. Click "Generate Visual" on a tier card to create renders.
        </p>
      )}
    </div>
  )
}
