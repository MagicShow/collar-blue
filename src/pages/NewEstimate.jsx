import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import StepIndicator from '../components/StepIndicator'
import FieldInput from '../components/FieldInput'
import ProjectTypeSelector from '../components/ProjectTypeSelector'
import PhotoUploader from '../components/PhotoUploader'
import ChatThread from '../components/ChatThread'
import StyleSelector from '../components/StyleSelector'
import TierCard from '../components/TierCard'
import EmailComposer from '../components/EmailComposer'
import ContractorCosts from '../components/ContractorCosts'

// --- Mock AI responses for MVP ---
const MOCK_AI_REPLIES = [
  "Great — I've noted the scope. How many rooms are involved?",
  "Thanks. Do you have a target completion date in mind?",
  "Understood. Any specific materials or colors you're leaning toward?",
  "Perfect. Based on what you've shared, I'll generate three quote tiers now. One moment…",
  "Done! I've reviewed your project details. Here are your three estimate tiers.",
]

const MOCK_LINE_ITEMS = {
  Basic: [
    { name: 'Labor — Demolition', qty: '8', unit: 'hrs', rate: '65', total: '520.00' },
    { name: 'Labor — Installation', qty: '16', unit: 'hrs', rate: '65', total: '1040.00' },
    { name: 'Drywall Sheets (Standard)', qty: '24', unit: 'sheets', rate: '18', total: '432.00' },
    { name: 'Joint Compound', qty: '6', unit: 'bags', rate: '12', total: '72.00' },
    { name: 'Drywall Tape', qty: '4', unit: 'rolls', rate: '8', total: '32.00' },
    { name: 'Primer', qty: '2', unit: 'gal', rate: '28', total: '56.00' },
    { name: 'Paint', qty: '3', unit: 'gal', rate: '38', total: '114.00' },
  ],
  Standard: [
    { name: 'Labor — Demolition', qty: '10', unit: 'hrs', rate: '65', total: '650.00' },
    { name: 'Labor — Installation', qty: '24', unit: 'hrs', rate: '65', total: '1560.00' },
    { name: 'Drywall Sheets (Moisture Resistant)', qty: '24', unit: 'sheets', rate: '24', total: '576.00' },
    { name: 'Joint Compound (Setting Type)', qty: '8', unit: 'bags', rate: '16', total: '128.00' },
    { name: 'Drywall Tape (Fiberglass)', qty: '6', unit: 'rolls', rate: '12', total: '72.00' },
    { name: 'Primer (High-Adhesion)', qty: '3', unit: 'gal', rate: '38', total: '114.00' },
    { name: 'Paint (Premium Eggshell)', qty: '4', unit: 'gal', rate: '52', total: '208.00' },
    { name: 'Corner Beads', qty: '12', unit: 'pcs', rate: '5', total: '60.00' },
  ],
  Premium: [
    { name: 'Labor — Demolition & Prep', qty: '14', unit: 'hrs', rate: '75', total: '1050.00' },
    { name: 'Labor — Expert Installation', qty: '32', unit: 'hrs', rate: '75', total: '2400.00' },
    { name: 'Drywall Sheets (Fire-Rated)', qty: '24', unit: 'sheets', rate: '32', total: '768.00' },
    { name: 'Joint Compound (Pro Grade)', qty: '10', unit: 'bags', rate: '22', total: '220.00' },
    { name: 'Mesh Tape (Self-Adhesive)', qty: '8', unit: 'rolls', rate: '14', total: '112.00' },
    { name: 'Primer (Stain-Blocking)', qty: '3', unit: 'gal', rate: '48', total: '144.00' },
    { name: 'Paint (Luxury Matte)', qty: '5', unit: 'gal', rate: '72', total: '360.00' },
    { name: 'Decorative Trim & Moldings', qty: '1', unit: 'lot', rate: '350', total: '350.00' },
  ],
}

const TIER_TOTALS = {
  Basic: 2266.00,
  Standard: 3448.00,
  Premium: 5404.00,
}

const MOCK_VISUALS = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
]

export default function NewEstimate() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form state
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [projectTypes, setProjectTypes] = useState([])
  const [photos, setPhotos] = useState([])

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { role: 'gpt', content: "Hi! I'm your scope assistant. I'll ask a few questions to make sure we capture everything needed for an accurate estimate.\n\nLet's start — what type of project is this, and roughly how large is the area?" }
  ])
  const [chatDisabled, setChatDisabled] = useState(false)

  // Style
  const [selectedStyle, setSelectedStyle] = useState('')
  const [budget, setBudget] = useState('')

  // Costs
  const [contractorCosts, setContractorCosts] = useState([])

  // Tiers
  const [tiers, setTiers] = useState([
    { name: 'Basic', lineItems: [], total: 0, visualUrl: '' },
    { name: 'Standard', lineItems: [], total: 0, visualUrl: '' },
    { name: 'Premium', lineItems: [], total: 0, visualUrl: '' },
  ])
  const [generatingVisual, setGeneratingVisual] = useState({})

  // Email
  const [emailSent, setEmailSent] = useState(false)

  // --- Handlers ---
  const handleChatSend = useCallback(async (text) => {
    setChatMessages(prev => [...prev, { role: 'user', content: text }])
    setChatDisabled(true)

    await new Promise(r => setTimeout(r, 900))
    setChatMessages(prev => [...prev, { role: 'typing' }])

    const replyIndex = Math.min(
      Math.floor((chatMessages.length + 2) / 2),
      MOCK_AI_REPLIES.length - 1
    )
    const reply = MOCK_AI_REPLIES[replyIndex]

    await new Promise(r => setTimeout(r, 1200))
    setChatMessages(prev => {
      const withoutTyping = prev.filter(m => m.role !== 'typing')
      return [...withoutTyping, { role: 'gpt', content: reply }]
    })
    setChatDisabled(false)
  }, [chatMessages.length])

  const handleChatQuickReply = useCallback(async (text) => {
    await handleChatSend(text)
  }, [handleChatSend])

  const handleDoneChat = () => {
    setChatMessages(prev => [
      ...prev.filter(m => m.role !== 'typing'),
      { role: 'system', content: '✅ Scope captured — moving to Step 3' }
    ])
    setStep(3)
  }

  const handleContinueFromCosts = () => {
    setStep(4)
  }

  const handleGenerateQuote = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setTiers([
      { name: 'Basic', lineItems: MOCK_LINE_ITEMS.Basic, total: TIER_TOTALS.Basic, visualUrl: '' },
      { name: 'Standard', lineItems: MOCK_LINE_ITEMS.Standard, total: TIER_TOTALS.Standard, visualUrl: '' },
      { name: 'Premium', lineItems: MOCK_LINE_ITEMS.Premium, total: TIER_TOTALS.Premium, visualUrl: '' },
    ])
    setLoading(false)
    setStep(5)
  }

  const handleGenerateVisual = async (tierName) => {
    setGeneratingVisual(prev => ({ ...prev, [tierName]: true }))
    await new Promise(r => setTimeout(r, 1800))
    const randomVisual = MOCK_VISUALS[Math.floor(Math.random() * MOCK_VISUALS.length)]
    setTiers(prev => prev.map(t =>
      t.name === tierName ? { ...t, visualUrl: randomVisual } : t
    ))
    setGeneratingVisual(prev => ({ ...prev, [tierName]: false }))
  }

  const handleTierEdit = (tierName, newItems) => {
    setTiers(prev => prev.map(t => {
      if (t.name !== tierName) return t
      const subtotal = (newItems || t.lineItems).reduce((sum, item) => {
        return sum + (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)
      }, 0)
      return { ...t, lineItems: newItems || t.lineItems, total: subtotal }
    }))
  }

  const handleEmailSend = async ({ to, subject, body }) => {
    await new Promise(r => setTimeout(r, 1500))
    console.log('Email sent:', { to, subject, body })
    setEmailSent(true)
  }

  const handleClear = () => {
    if (confirm('Clear all estimate data?')) {
      window.location.hash = '#/'
    }
  }

  const totalProject = tiers.reduce((sum, t) => sum + t.total, 0)

  // --- Render step ---
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-step">
            <h2 className="wizard-step-title">Project Basics</h2>
            <p className="wizard-step-subtitle">Tell us about your client and the scope of work.</p>

            <FieldInput label="Client Name" placeholder="Maria Garcia" value={clientName} onChange={setClientName} />
            <FieldInput label="Project Address" placeholder="123 Main St, Suite 4B" value={clientAddress} onChange={setClientAddress} />
            <div className="grid-2">
              <FieldInput label="Phone" placeholder="(555) 867-5309" type="tel" value={clientPhone} onChange={setClientPhone} />
              <FieldInput label="Email" placeholder="maria@email.com" type="email" value={clientEmail} onChange={setClientEmail} />
            </div>

            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: '8px' }}>Project Type</label>
              <ProjectTypeSelector selected={projectTypes} onChange={setProjectTypes} />
            </div>

            <div className="wizard-actions">
              <button
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!clientName || projectTypes.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="wizard-step">
            <h2 className="wizard-step-title">Scope & Photos</h2>
            <p className="wizard-step-subtitle">Add project photos and let AI clarify the details.</p>

            <PhotoUploader photos={photos} onChange={setPhotos} />

            <div style={{ marginTop: '24px' }}>
              <ChatThread
                messages={chatMessages}
                onSend={handleChatSend}
                onQuickReply={handleChatQuickReply}
                disabled={chatDisabled}
              />
            </div>

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn btn-primary"
                onClick={handleDoneChat}
                disabled={chatMessages.length < 3}
              >
                Done — Move to Style
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="wizard-step">
            <h2 className="wizard-step-title">Style & Vision</h2>
            <p className="wizard-step-subtitle">What aesthetic direction is the client going for?</p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: '10px' }}>Design Style</label>
              <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: '10px' }}>Budget Level</label>
              <div className="budget-chips">
                {['Low', 'Medium', 'High'].map(b => (
                  <button
                    key={b}
                    className={`budget-chip ${budget === b ? 'selected' : ''}`}
                    onClick={() => setBudget(b)}
                    type="button"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button
                className="btn btn-primary"
                onClick={handleGenerateQuote}
                disabled={!selectedStyle || !budget || loading}
              >
                {loading ? 'Generating Tiers…' : 'Generate 3-Tier Quote'}
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="wizard-step">
            <h2 className="wizard-step-title">Contractor Costs</h2>
            <p className="wizard-step-subtitle">Enter your known costs so we can build accurate margins into the quote tiers.</p>

            <ContractorCosts costs={contractorCosts} onChange={setContractorCosts} />

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
              <button
                className="btn btn-primary"
                onClick={handleContinueFromCosts}
              >
                Continue to Quote Tiers
              </button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="wizard-step">
            <h2 className="wizard-step-title">Quote Tiers</h2>
            <p className="wizard-step-subtitle">
              Review and edit line items. Generate visuals for each tier.
              {contractorCosts.length > 0 && (
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                  Your costs (${contractorCosts.reduce((sum, c) => sum + c.cost * (parseFloat(c.qty) || 1), 0).toFixed(2)}) are factored in.
                </span>
              )}
            </p>

            {/* Project summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', background: 'rgba(0,113,227,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,113,227,0.15)' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{clientName || 'New Client'}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{projectTypes.join(', ')} · {selectedStyle} · {budget} budget</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                ${totalProject.toFixed(2)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
              {tiers.map(tier => (
                <TierCard
                  key={tier.name}
                  tier={tier.name}
                  lineItems={tier.lineItems}
                  total={tier.total}
                  visualUrl={tier.visualUrl}
                  generating={generatingVisual[tier.name]}
                  onEdit={handleTierEdit}
                  onGenerateVisual={() => handleGenerateVisual(tier.name)}
                />
              ))}
            </div>

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep(4)}>Back</button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(6)}
                disabled={tiers.every(t => t.lineItems.length === 0)}
              >
                Review &amp; Send
              </button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="wizard-step">
            <h2 className="wizard-step-title">Review &amp; Send</h2>
            <p className="wizard-step-subtitle">
              Review the estimate, then send it to {clientName || 'your client'}.
            </p>

            {/* Mini quote summary */}
            <div style={{ marginBottom: '24px' }}>
              <p className="caption" style={{ marginBottom: '10px' }}>Quote Summary</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tiers.map(t => (
                  <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{t.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>${(t.total || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--dark)', borderRadius: 'var(--radius-sm)', color: 'white' }}>
                  <span style={{ fontWeight: 600 }}>Total Project</span>
                  <span style={{ fontWeight: 800 }}>${totalProject.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {emailSent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h3 className="h2" style={{ marginBottom: '8px' }}>Quote Sent!</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Your estimate has been delivered to {clientEmail || 'the client'}.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => window.location.hash = '#/dashboard'} style={{ flex: 1 }}>
                    View Dashboard
                  </button>
                  <button className="btn btn-primary" onClick={() => window.location.hash = '#/'} style={{ flex: 1 }}>
                    New Estimate
                  </button>
                </div>
              </div>
            ) : (
              <>
                <EmailComposer
                  clientEmail={clientEmail}
                  clientName={clientName}
                  tiers={tiers}
                  onSend={handleEmailSend}
                />
                <div className="wizard-actions" style={{ marginTop: '0' }}>
                  <button className="btn btn-secondary" onClick={() => setStep(5)}>Back</button>
                </div>
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavBar
        title="New Estimate"
        lead={clientName || undefined}
        onBack={() => {
          if (step > 1) setStep(s => s - 1)
          else navigate('/')
        }}
        onClear={handleClear}
      />
      <StepIndicator currentStep={step} />
      <div className="app-content">
        {renderStep()}
      </div>
    </div>
  )
}
