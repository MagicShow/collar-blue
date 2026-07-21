import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'
import OpenAI from 'openai'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ─── OpenAI Client (lazy init — only created when first API call is made) ───
let _openai = null
const getOpenAI = () => {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

// ─── In-memory store (swap for PostgreSQL/Neon in Phase 2) ──────────────────
const estimates = new Map()
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ─── Scope-Building System Prompt ────────────────────────────────────────────
const SCOPE_PROMPT = `You are ScopeBot, a sharp, professional AI assistant for ContractorHub — a mobile-first sales tool for remodeling and construction contractors.

Your job: help the contractor capture a complete, accurate job scope through a short conversational interview. You are THEIR assistant, not the client's. Be efficient, focused, and contractor-friendly. Ask ONE question at a time. Use quick-reply options when helpful.

CORE QUESTIONS TO COVER (in order, don't rush):
1. Square footage of the work area
2. Ceiling height (standard 8ft, 9ft, vaulted, etc.)
3. Current condition of surfaces (damage, moisture, prep needed)
4. Desired finish level (budget, standard, or premium materials)
5. Client's color/style preferences or if they need guidance
6. Target completion date or timeline pressure
7. Any access restrictions (tenant occupied, business hours only, etc.)

RULES:
- Ask one focused question at a time. Never pile on multiple questions.
- Keep responses short and conversational — contractors are on job sites.
- When you have enough scope to generate a meaningful3-tier quote, say "I've got enough to generate your quote tiers now. Hang tight." and set done: true.
- Detect scope completeness: ~5-7 exchanges should be enough if you have sq footage, condition, finish level, and timeline.
- Never make up line items — you are gathering scope, not pricing. The quote engine handles pricing.
- If photo context is provided, reference it naturally in your questions.
- Quick-reply options: always offer 3-4 short tap-friendly options after each question.

TONE: Confident, no-nonsense, experienced. Like a sharp foreman who knows what questions to ask.`

// ─── Suggested replies by conversation depth ────────────────────────────────
const SCOPE_SUGGESTIONS = {
  0: ['About 500 sq ft', 'Around 1,000 sq ft', '150–300 sq ft', 'Large commercial'],
  1: ['Standard 8ft', '9ft vaulted', '10ft or higher', 'Mixed heights'],
  2: ['Good condition', 'Minor prep needed', 'Water damage present', 'Major demo needed'],
  3: ['Budget materials', 'Standard contractor grade', 'Premium/luxury finish', 'Not sure — need guidance'],
  4: ['Neutral whites/greys', 'Client has picks', 'Color consultation wanted', 'Flexible on color'],
  5: ['2 weeks', '1 month', 'Flexible timeline', 'As soon as possible'],
  6: ['Tenant occupied', 'Business hours only', 'Full access', 'Weekend only'],
}

function getSuggestions(depth) {
  return SCOPE_SUGGESTIONS[Math.min(depth, SCOPE_SUGGESTIONS.length - 1)] || []
}

// ─── Sanitize user input ─────────────────────────────────────────────────────
function sanitize(text) {
  return String(text)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim()
}

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    openai: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  })
})

// ─── POST /api/estimate/create ──────────────────────────────────────────────
app.post('/api/estimate/create', (req, res) => {
  const { client, projectType, photos = [] } = req.body

  if (!client || !projectType) {
    return res.status(400).json({ error: 'client and projectType are required' })
  }

  const id = genId()
  const estimate = {
    id,
    client,
    projectType,
    photos,
    scope: { chatHistory: [], summary: '', questionCount: 0 },
    style: '',
    budget: '',
    tiers: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  estimates.set(id, estimate)
  res.json({ estimateId: id })
})

// ─── POST /api/estimate/:id/chat — Real GPT-4o ──────────────────────────────
app.post('/api/estimate/:id/chat', async (req, res) => {
  const { id } = req.params
  const { messages, photos = [] } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  // Build GPT message list
  const gptMessages = [
    { role: 'system', content: SCOPE_PROMPT },
    ...estimate.scope.chatHistory,
    ...messages,
  ]

  // Attach photos as base64 if provided
  if (photos && photos.length > 0) {
    const lastUserMsg = messages.filter(m => m.role === 'user').at(-1)
    if (lastUserMsg) {
      const photoContent = photos.map(photo => ({
        type: 'image_url',
        image_url: { url: photo, detail: 'low' },
      }))
      // Inject photo context into last user message
      const updatedMsgs = gptMessages.map((m, i) => {
        if (i === gptMessages.length - 1 && m.role === 'user') {
          return {
            role: 'user',
            content: [
              { type: 'text', text: m.content },
              ...photoContent,
            ],
          }
        }
        return m
      })
      gptMessages.length = 0
      gptMessages.push(...updatedMsgs)
    }
  }

  try {
    const stream = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: gptMessages,
      max_tokens: 400,
      temperature: 0.7,
      stream: false, // MVP: single response. Upgrade to stream for UX.
    })

    const reply = stream.choices[0]?.message?.content?.trim() || "I'm having trouble with that — could you rephrase?"

    // Count exchanges to gauge depth
    const userMsgCount = messages.filter(m => m.role === 'user').length
    const questionCount = estimate.scope.questionCount + 1

    // Auto-detect done: ~6+ exchanges or keywords suggesting completion
    const done = questionCount >= 6 ||
      /\b(generate|done|ready|quote|tiers|足够了|got enough)\b/i.test(reply)

    // Save updated chat history
    estimate.scope.chatHistory = [
      ...estimate.scope.chatHistory,
      ...messages,
      { role: 'assistant', content: reply },
    ]
    estimate.scope.questionCount = questionCount
    estimates.set(id, estimate)

    res.json({
      reply,
      suggestedReplies: done ? [] : getSuggestions(userMsgCount),
      done,
    })
  } catch (err) {
    console.error('[chat] OpenAI error:', err.message)

    // Graceful fallback if no API key
    if (err.message.includes('Incorrect API key') || err.message.includes('No API key')) {
      return res.status(500).json({
        error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your .env file.',
        code: 'MISSING_API_KEY',
      })
    }

    res.status(500).json({ error: 'AI request failed. Please try again.', details: err.message })
  }
})

// ─── POST /api/estimate/:id/generate-quote — Real GPT-4o ───────────────────
app.post('/api/estimate/:id/generate-quote', async (req, res) => {
  const { id } = req.params
  const { scope, style, budget, contractorCosts = [] } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  const costTable = contractorCosts.length > 0
    ? contractorCosts.map(c => `• ${c.name}: $${c.cost} (${c.category})`).join('\n')
    : 'No contractor costs provided — use your best judgment for market-rate pricing.'

  const QUOTE_PROMPT = `You are QuoteBot, part of ContractorHub. Generate a professional 3-tier construction quote based on the scope provided.

PROJECT SCOPE:
${scope || estimate.scope.summary || 'General remodeling project'}

STYLE: ${style || 'Standard'}
BUDGET LEVEL: ${budget || 'medium'}

CONTRACTOR'S KNOWN COSTS (use as cost floor — DO NOT go below these):
${costTable}

RULES:
- Generate exactly 3 tiers: Basic, Standard, Premium
- Each tier must have: name, description, and 4-6 line items
- Each line item: name, qty, unit, rate, total
- Use contractor costs as the ABSOLUTE FLOOR — mark up appropriately per tier
- Basic: 15-25% above cost | Standard: 35-50% above cost | Premium: 60-80% above cost
- Line item qty × rate = total for each line
- Respond ONLY with valid JSON in this exact shape — no preamble, no explanation:
{
  "tiers": [
    {
      "name": "Basic",
      "description": "...",
      "lineItems": [{ "name": "...", "qty": "...", "unit": "...", "rate": "...", "total": "..." }],
      "subtotal": "..."
    },
    { "name": "Standard", ... },
    { "name": "Premium", ... }
  ]
}`

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: QUOTE_PROMPT },
        { role: 'user', content: 'Generate the 3-tier quote based on the scope above.' },
      ],
      max_tokens: 2000,
      temperature: 0.5,
    })

    const raw = completion.choices[0]?.message?.content?.trim() || ''

    // Extract JSON from response (handles markdown code blocks)
    let tiers = null
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        tiers = parsed.tiers
      }
    } catch {
      console.warn('[quote] JSON parse failed, raw:', raw.slice(0, 200))
    }

    if (!tiers) {
      return res.status(500).json({ error: 'Failed to parse quote from AI. Please try again.' })
    }

    estimate.tiers = tiers
    estimate.style = style
    estimate.budget = budget
    estimates.set(id, estimate)

    res.json({ tiers })
  } catch (err) {
    console.error('[quote] OpenAI error:', err.message)
    res.status(500).json({ error: 'Quote generation failed. Please try again.', details: err.message })
  }
})

// ─── POST /api/estimate/:id/generate-visuals — Real DALL-E 3 ────────────────
app.post('/api/estimate/:id/generate-visuals', async (req, res) => {
  const { id } = req.params
  const { tier, description, style } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  if (!description) {
    return res.status(400).json({ error: 'description is required' })
  }

  const styleContext = style ? `Style: ${style}.` : ''
  const prompt = `Professional construction/renovation render. ${styleContext} ${description}. High quality architectural visualization, realistic lighting, photorealistic finish, 16:9 aspect ratio.`

  try {
    const image = await getOpenAI().images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      style: 'natural',
    })

    const imageUrl = image.data[0]?.url
    if (!imageUrl) throw new Error('No image URL returned')

    res.json({ imageUrl })
  } catch (err) {
    console.error('[visuals] DALL-E error:', err.message)
    res.status(500).json({ error: 'Visual generation failed. Please try again.', details: err.message })
  }
})

// ─── POST /api/estimate/:id/send-quote — Real Email ──────────────────────────
app.post('/api/estimate/:id/send-quote', async (req, res) => {
  const { id } = req.params
  const { to, subject, body, includePdf } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  if (!to || !subject) {
    return res.status(400).json({ error: 'to and subject are required' })
  }

  // If no SMTP configured, return mock
  if (!process.env.SMTP_HOST) {
    console.warn('[email] SMTP not configured — sending mock response')
    const messageId = `<mock-${Date.now()}@contractorhub.ai>`
    estimate.status = 'sent'
    estimates.set(id, estimate)
    return res.json({ sent: true, messageId, mock: true })
  }

  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0071E3; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">ContractorHub</h1>
        </div>
        <div style="padding: 32px 24px; background: #ffffff;">
          ${body || '<p>Please find your quote attached.</p>'}
          <hr style="border: none; border-top: 1px solid #D2D2D7; margin: 24px 0;" />
          <p style="color: #86868B; font-size: 12px;">
            Sent via ContractorHub · This email was sent to ${to}<br>
            To unsubscribe, contact the sender.
</p>
        </div>
      </div>
    `

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: htmlBody,
    }

    const info = await transporter.sendMail(mailOptions)
    estimate.status = 'sent'
    estimates.set(id, estimate)

    res.json({ sent: true, messageId: info.messageId })
  } catch (err) {
    console.error('[email] Send error:', err.message)
    res.status(500).json({ error: 'Email send failed.', details: err.message })
  }
})

// ─── POST /api/upload ───────────────────────────────────────────────────────
app.post('/api/upload', async (req, res) => {
  // In production: Cloudinary + formidable
  // MVP: mock URL (upgrade to real Cloudinary before launch)
  const mockUrl = `https://contractorhub.ai/uploads/${Date.now()}-photo.jpg`
  res.json({ url: mockUrl })
})

// ─── GET /api/estimate/:id ──────────────────────────────────────────────────
app.get('/api/estimate/:id', (req, res) => {
  const estimate = estimates.get(req.params.id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })
  res.json(estimate)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ContractorHub API running on http://localhost:${PORT}`)
  console.log(`OpenAI: ${process.env.OPENAI_API_KEY ? '✓ configured' : '✗ NOT SET — add OPENAI_API_KEY to .env'}`)
  console.log(`SMTP:   ${process.env.SMTP_HOST ? '✓ configured' : '✗ not configured (emails will mock)'}`)
})
