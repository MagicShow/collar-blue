import { useNavigate } from 'react-router-dom'

const FEATURES = ['GPT Scope Builder', 'DALL-E Visuals', '3-Tier Quotes', 'Email Send']

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      {/* Atmospheric color glows */}
      <div className="landing-glow" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% -10%, rgba(91,44,158,0.4) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 15% 50%, rgba(29,106,255,0.2) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 50%, rgba(200,80,180,0.15) 0%, transparent 70%)
        `
      }} />

      <div className="landing-content">
        {/* Logo */}
        <div className="landing-logo">ContractorHub</div>

        {/* Icon */}
        <div className="landing-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
            <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.06)" />
            <path d="M16 38L28 20L40 38H16Z" fill="rgba(29,106,255,0.85)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            <rect x="23" y="30" width="10" height="8" rx="2" fill="rgba(255,255,255,0.6)"/>
            <circle cx="28" cy="14" r="3" fill="#5AC8FA"/>
          </svg>
        </div>

        {/* Tagline */}
        <p className="landing-tagline">Build bids that close deals.</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px', maxWidth: 400, lineHeight: 1.6 }}>
          AI-powered estimates with rendered visuals. For remodel, painting, flooring &amp; drywall contractors.
        </p>

        {/* Feature pills */}
        <div className="landing-pills">
          {FEATURES.map(tag => (
            <span key={tag} className="landing-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="landing-cta"
          onClick={() => navigate('/new-estimate')}
        >
          Get Started
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="landing-note">No account needed — start estimating in seconds</p>
      </div>
    </div>
  )
}
