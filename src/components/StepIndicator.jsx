export default function StepIndicator({ currentStep, totalSteps = 5 }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 0', maxWidth: 480, margin: '0 auto' }}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isActive = step === currentStep
          const isDone = step < currentStep
          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: isActive ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: isDone ? 'var(--accent)' : isActive ? 'var(--primary)' : 'var(--border)',
                transition: 'all 300ms ease-out',
              }} />
              {isActive && (
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Step {step}
                </span>
              )}
            </div>
          )
        })}
      </div>
      {/* Progress bar */}
      <div className="progress-bar-track" style={{ marginTop: '12px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="progress-bar-fill" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
      </div>
    </div>
  )
}
