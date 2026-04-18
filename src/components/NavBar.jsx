export default function NavBar({ title, lead, onBack, onClear }) {
  return (
    <div className="navbar">
      <button className="navbar-back" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className="navbar-title">
        {title}
        {lead && <span className="sub">{lead}</span>}
      </div>

      <button className="navbar-action" onClick={onClear}>
        Clear
      </button>
    </div>
  )
}
