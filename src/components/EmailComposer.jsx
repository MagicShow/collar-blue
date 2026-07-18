import { useState } from 'react'

export default function EmailComposer({ clientEmail = '', clientName = '', tiers = [], onSend }) {
  const [to, setTo] = useState(clientEmail)
  const [subject, setSubject] = useState(`Your Project Estimate — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`)
  const [body, setBody] = useState(() => {
    const tiersList = tiers.map(t => `• ${t.name}: $${(t.total || 0).toFixed(2)}`).join('\n')
    return `Hi ${clientName || 'there'},

Thank you for the opportunity to provide an estimate for your project. Please find the details below.

${tiersList}

All estimates are valid for 30 days. I'd be happy to answer any questions.

Best regards`
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSend = async () => {
    if (!to || !subject) return
    setStatus('sending')
    try {
      await onSend?.({ to, subject, body })
      setStatus('sent')
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <div className="email-composer">
      {/* Status banners */}
      {status === 'sent' && (
        <div className="email-success-banner">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="var(--accent)"/>
            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Quote sent successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="email-error-banner">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="9" fill="var(--danger)"/>
            <path d="M9 5V9M9 12V12.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Failed to send. Please try again.
        </div>
      )}

      {/* To */}
      <div className="field">
        <label>To</label>
        <input type="email" value={to} onChange={e => setTo(e.target.value)} placeholder="client@email.com" />
      </div>

      {/* Subject */}
      <div className="field">
        <label>Subject</label>
        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} />
      </div>

      {/* Body */}
      <div className="field">
        <label>Message</label>
        <textarea
          className="email-textarea"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={12}
        />
      </div>

      {/* Preview */}
      <div>
        <p className="caption" style={{ marginBottom: '8px' }}>Preview</p>
        <div className="email-preview">
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px', fontWeight: 500 }}>To: {to || '—'}</div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--dark)', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>{subject}</div>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.7 }}>{body}</div>
        </div>
      </div>

      {/* Send */}
      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={status === 'sending' || !to}
        type="button"
      >
        {status === 'sending' ? (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
              <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/>
              <path d="M9 2a7 7 0 017 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Sending…
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 9L16 2L10 16L8.5 10L2 9Z" fill="white"/>
            </svg>
            Send Quote
          </>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
