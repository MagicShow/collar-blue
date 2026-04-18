export default function Dashboard() {
  const jobs = [
    { id: 1, name: 'Martinez Kitchen', type: 'Remodel', amount: '$12,400', status: 'quoted', date: 'Apr 16' },
    { id: 2, name: 'OBrien Bathroom', type: 'Drywall', amount: '$3,850', status: 'sent', date: 'Apr 14' },
    { id: 3, name: 'Patel Garage', type: 'Painting', amount: '$5,200', status: 'draft', date: 'Apr 12' },
    { id: 4, name: 'Santos Office', type: 'Flooring', amount: '$8,950', status: 'accepted', date: 'Apr 8' },
  ]

  const statusBadge = (status) => {
    const map = {
      draft: { label: 'Draft', cls: 'badge-blue' },
      quoted: { label: 'Quoted', cls: 'badge-green' },
      sent: { label: 'Sent', cls: 'badge-blue' },
      accepted: { label: 'Accepted', cls: 'badge-green' },
    }
    const b = map[status] || map.draft
    return <span className={`badge ${b.cls}`}>{b.label}</span>
  }

  return (
    <div className="app-content no-pad">
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '4px' }}>
          <div>
            <h1 className="h1">Dashboard</h1>
            <p className="muted" style={{ fontSize: '14px', marginTop: '2px' }}>Your active estimates</p>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '10px 20px', fontSize: '15px' }}
            onClick={() => window.location.hash = '#/new-estimate'}
          >
            + New Estimate
          </button>
        </div>

        {/* Coming Soon Banner */}
        <div className="coming-soon-banner">
          <div className="coming-soon-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="rgba(0,113,227,0.1)"/>
              <path d="M20 12V20L26 24" stroke="#0071E3" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="h2" style={{ marginBottom: '8px', color: 'var(--primary)' }}>Dashboard v2 — Coming Soon</h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.5 }}>
            Full job tracking, client history, invoice generation &amp; calendar integration are on the roadmap.
          </p>
        </div>

        {/* Job list skeleton */}
        <div className="dashboard-skeleton">
          {jobs.map(job => (
            <div key={job.id} className="job-row">
              <div className="job-row-avatar">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 18V9L11 3L19 9V18H13V13H9V18H3Z" fill="#0071E3" opacity="0.7"/>
                </svg>
              </div>
              <div className="job-row-info">
                <div className="job-row-name">{job.name}</div>
                <div className="job-row-meta">{job.type} · {job.date}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                {statusBadge(job.status)}
                <span className="job-row-amount">{job.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          {[
            { label: 'Active Jobs', value: '3', icon: '📋' },
            { label: 'This Month', value: '$29,600', icon: '💰' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--dark)' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
