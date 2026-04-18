const PROJECT_TYPES = [
  { id: 'remodel', label: 'Remodel', icon: '🏠' },
  { id: 'painting', label: 'Painting', icon: '🎨' },
  { id: 'flooring', label: 'Flooring', icon: '🪵' },
  { id: 'drywall', label: 'Drywall', icon: '🧱' },
  { id: 'general', label: 'General', icon: '🔧' },
]

export default function ProjectTypeSelector({ selected, onChange }) {
  return (
    <div className="chip-grid" style={{ marginTop: '12px' }}>
      {PROJECT_TYPES.map(pt => (
        <button
          key={pt.id}
          className={`chip chip-outline ${selected.includes(pt.id) ? 'selected' : ''}`}
          onClick={() => {
            if (selected.includes(pt.id)) {
              onChange(selected.filter(id => id !== pt.id))
            } else {
              onChange([...selected, pt.id])
            }
          }}
          type="button"
        >
          <span>{pt.icon}</span>
          {pt.label}
        </button>
      ))}
    </div>
  )
}
