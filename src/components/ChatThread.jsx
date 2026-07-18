import { useState, useRef, useEffect } from 'react'

const QUICK_REPLIES_STEP2 = [
  'About 500 sq ft',
  'Standard finish',
  'High-end materials',
  'One weekend',
  'Tenant occupied',
  'Has existing damage',
]

export default function ChatThread({ messages = [], onSend, onQuickReply, disabled = false }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || disabled) return
    onSend(text)
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-wrapper">
      {/* Messages */}
      <div className="chat-container" ref={containerRef}>
        {messages.length === 0 && (
          <div className="chat-bubble system">
            I'll ask a few questions to build your scope. Tap a quick reply or type your answer.
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.role === 'user' ? 'user' : msg.role === 'system' ? 'system' : 'gpt'}`}
          >
            {msg.role === 'typing' ? (
              <div className="chat-typing-dots">
                <span /><span /><span />
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {messages.length > 0 && !disabled && (
        <div className="quick-replies">
          {QUICK_REPLIES_STEP2.map((reply, i) => (
            <button
              key={i}
              className="quick-reply-chip"
              onClick={() => onQuickReply(reply)}
              type="button"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="chat-input-bar">
        <input
          type="text"
          placeholder={disabled ? 'Processing…' : 'Type your answer…'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          type="button"
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 2L7 9M14 2L9 14L7 9M14 2L2 7L7 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        .chat-wrapper {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--surface);
        }
      `}</style>
    </div>
  )
}
