const STYLES = ['Modern', 'Classical', 'Modern Rustic', 'Industrial', 'Coastal', 'Transitional']

export default function StyleSelector({ selected, onChange }) {
  return (
    <div className="chip-grid">
      {STYLES.map(s => (
        <button
          key={s}
          className={`chip chip-charcoal ${selected === s ? 'selected' : ''}`}
          onClick={() => onChange(s)}
          type="button"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
