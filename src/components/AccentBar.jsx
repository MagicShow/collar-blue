export default function AccentBar({ color = '#0071E3' }) {
  return (
    <div style={{
      height: '3px',
      width: '100%',
      background: color,
      borderRadius: '2px',
    }} />
  )
}
