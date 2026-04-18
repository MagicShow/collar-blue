export default function FieldInput({ label, placeholder, value, onChange, type = 'text', dark = false }) {
  return (
    <div className={`field ${dark ? 'dark' : ''}`}>
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
