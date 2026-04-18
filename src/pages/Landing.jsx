import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      {/* Atmospheric color glows */}
      <div className="landing-glow" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% -10%, rgba(107,63,160,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 15% 50%, rgba(0,113,227,0.2) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 50%, rgba(200,80,180,0.15) 0%, transparent 70%)
        `
      }} />

      <div className="landing-content">
        {/* Logo */}
        <div className="landing-logo" style={{
          fontSize: '48px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
        }}>
          ContractorHub
        </div>

        {/* Icon */}
        <div style={{ fontSize: '56px', marginTop: '8px' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.08)" />
            <path d="M16 38L28 20L40 38H16Z" fill="rgba(0,113,227,0.8)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <rect x="23" y="30" width="10" height="8" rx="2" fill="rgba(255,255,255,0.6)"/>
            <circle cx="28" cy="14" r="3" fill="#5AC8FA"/>
          </svg>
        </div>

        {/* Tagline */}
        <p className="landing-tagline">
          Build bids that close deals.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px', maxWidth: 400, lineHeight: 1.6 }}>
          AI-powered estimates with rendered visuals. For remodel, painting, flooring &amp; drywall contractors.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
          {['GPT Scope Builder', 'DALL-E Visuals', '3-Tier Quotes', 'Email Send'].map(tag => (
            <span key={tag} style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 500,
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="landing-cta"
          onClick={() => navigate('/new-estimate')}
          style={{ marginTop: '24px' }}
        >
          Get Started
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '16px' }}>
          No account needed — start estimating in seconds
        </p>
      </div>
    </div>
  )
}
