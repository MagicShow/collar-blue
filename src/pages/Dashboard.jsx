import { useState } from 'react'

export default function Dashboard() {
  const [jobs] = useState([
    { id: 1, name: 'Martinez Kitchen', type: 'Remodel', amount: '$12,400', status: 'quoted', date: 'Apr 16' },
    { id: 2, name: "O'Brien Bathroom", type: 'Drywall', amount: '$3,850', status: 'sent', date: 'Apr 14' },
    { id: 3, name: 'Patel Garage', type: 'Painting', amount: '$5,200', status: 'draft', date: 'Apr 12' },
    { id: 4, name: 'Santos Office', type: 'Flooring', amount: '$8,950', status: 'accepted', date: 'Apr 8' },
  ])

  const statusBadge = (status) => {
    const map = {
      draft: { label: 'Draft', cls: 'badge-gray' },
      quoted: { label: 'Quoted', cls: 'badge-blue' },
      sent: { label: 'Sent', cls: 'badge-blue' },
      accepted: { label: 'Accepted', cls: 'badge-green' },
    }
    const b = map[status] || map.draft
    return <span className={`badge ${b.cls}`}>{b.label}</span>
  }

  const totalQuoted = jobs.filter(j => j.status !== 'draft').reduce((sum, j) => {
    return sum + parseFloat(j.amount.replace(/[^0-9.]/g, ''))
  }, 0)

  return (
    <div className="app-content no-pad">
      <div style={{ padding: '0 16px' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1 className="h1">Dashboard</h1>
            <p className="muted" style={{ fontSize: '14px', marginTop: '2px' }}>Your active estimates</p>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '10px 20px', fontSize: '15px', flexShrink: 0 }}
            onClick={() => window.location.hash = '#/new-estimate'}
          >
            + New Estimate
          </button>
        </div>

        {/* Stat cards */}
        <div className="dashboard-stat-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 17V10L10 4L17 10V17H12V13H8V17H3Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="dashboard-stat-value">{jobs.filter(j => j.status !== 'accepted').length}</div>
            <div className="dashboard-stat-label">Active Jobs</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2V18M10 18L5 13M10 18L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="dashboard-stat-value">${totalQuoted.toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
            <div className="dashboard-stat-label">Quoted</div>
          </div>
        </div>

        {/* Section label */}
        <div className="dashboard-section-title">Recent Estimates</div>

        {/* Job list */}
        <div className="dashboard-skeleton">
          {jobs.map(job => (
            <div key={job.id} className="job-row">
              <div className="job-row-avatar">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 18V9L11 3L19 9V18H13V13H9V18H3Z" fill="var(--primary)" opacity="0.7"/>
                </svg>
              </div>
              <div className="job-row-info">
                <div className="job-row-name">{job.name}</div>
                <div className="job-row-meta">{job.type} · {job.date}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                {statusBadge(job.status)}
                <span className="job-row-amount">{job.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
