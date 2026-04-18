import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// In-memory store for MVP
const estimates = new Map()

// Helper: generate a simple UUID-like id
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

// ============================================================
// POST /api/estimate/create
// ============================================================
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
    scope: { chatHistory: [], summary: '' },
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

// ============================================================
// POST /api/estimate/:id/chat — GPT-4o scope chat
// ============================================================
app.post('/api/estimate/:id/chat', async (req, res) => {
  const { id } = req.params
  const { messages, photos = [] } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  // --- MVP MOCK: simulate AI responses with realistic delays ---
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

  await new Promise(r => setTimeout(r, 1000 + Math.random() * 800))

  let reply = "That's helpful context — could you tell me about the condition of the existing surfaces? Any water damage, cracks, or repairs needed?"
  let done = false
  const suggestedReplies = ['No damage, just dated.', 'Small cracks in a few places.', 'Some moisture damage in corners.', 'Mostly good, minor prep needed.']

  if (lastMessage.includes('sq ft') || lastMessage.includes('square')) {
    reply = "Great — what's the ceiling height? Standard 8ft or higher?"
    suggestedReplies = ['Standard 8ft', '9ft vaulted', 'Mixed heights', 'Just tell me an estimate']
  } else if (lastMessage.includes('8ft') || lastMessage.includes('9ft') || lastMessage.includes('ceiling')) {
    reply = "Any specific finishes or colors the client has in mind? Or should I work from a neutral palette?"
    suggestedReplies = ['Neutral whites/greys', 'Client has picks already', 'Color consultation needed', 'Skip this for now']
  } else if (lastMessage.includes('color') || lastMessage.includes('neutral') || lastMessage.includes('white')) {
    reply = "Almost done — is there a target move-in or completion date I should note?"
    suggestedReplies = ['2 weeks', '1 month', 'Flexible', 'As soon as possible']
  } else if (lastMessage.includes('week') || lastMessage.includes('month') || lastMessage.includes('flexible') || lastMessage.includes('soon') || lastMessage.includes('asap')) {
    reply = "Perfect. Based on everything we've covered, I'm ready to generate your three quote tiers. Give me just a moment…"
    suggestedReplies = []
    done = true
  }

  // Save chat to estimate
  estimate.scope.chatHistory = messages
  estimate.scope.summary = `Project type: ${estimate.projectType}. ${lastMessage}`
  estimates.set(id, estimate)

  res.json({ reply, suggestedReplies, done })
})

// ============================================================
// POST /api/estimate/:id/generate-visuals — DALL-E 3
// ============================================================
app.post('/api/estimate/:id/generate-visuals', async (req, res) => {
  const { id } = req.params
  const { tier, description } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  // --- MVP MOCK: return a real construction image after delay ---
  await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

  const mockImages = [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
    'https://images.unsplash.com/photo-1556909212-54557c7e4fb7?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  ]

  const imageUrl = mockImages[Math.floor(Math.random() * mockImages.length)]

  res.json({ imageUrl })
})

// ============================================================
// POST /api/estimate/:id/generate-quote — GPT-4o quote generation
// ============================================================
app.post('/api/estimate/:id/generate-quote', async (req, res) => {
  const { id } = req.params
  const { scope, style, budget } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  // --- MVP MOCK: realistic line items after delay ---
  await new Promise(r => setTimeout(r, 1800 + Math.random() * 1200))

  const multiplier = budget === 'high' ? 1.6 : budget === 'medium' ? 1.2 : 1.0

  const tiers = [
    {
      name: 'Basic',
      description: 'Essential work with budget-friendly materials',
      lineItems: [
        { name: 'Labor — Prep & Demolition', qty: '8', unit: 'hrs', rate: (65 * multiplier).toFixed(0), total: (520 * multiplier).toFixed(2) },
        { name: 'Labor — Installation', qty: '16', unit: 'hrs', rate: (65 * multiplier).toFixed(0), total: (1040 * multiplier).toFixed(2) },
        { name: 'Materials (Standard Grade)', qty: '1', unit: 'lot', rate: (450 * multiplier).toFixed(0), total: (450 * multiplier).toFixed(2) },
        { name: 'Paint & Finishing', qty: '1', unit: 'lot', rate: (280 * multiplier).toFixed(0), total: (280 * multiplier).toFixed(2) },
      ],
      subtotal: ((520 + 1040 + 450 + 280) * multiplier).toFixed(2),
    },
    {
      name: 'Standard',
      description: 'Quality materials with professional finish',
      lineItems: [
        { name: 'Labor — Prep & Demolition', qty: '10', unit: 'hrs', rate: (65 * multiplier).toFixed(0), total: (650 * multiplier).toFixed(2) },
        { name: 'Labor — Installation', qty: '24', unit: 'hrs', rate: (65 * multiplier).toFixed(0), total: (1560 * multiplier).toFixed(2) },
        { name: 'Materials (Contractor Grade)', qty: '1', unit: 'lot', rate: (680 * multiplier).toFixed(0), total: (680 * multiplier).toFixed(2) },
        { name: 'Premium Paint & Primer', qty: '1', unit: 'lot', rate: (420 * multiplier).toFixed(0), total: (420 * multiplier).toFixed(2) },
        { name: 'Trim & Touch-Ups', qty: '1', unit: 'lot', rate: (180 * multiplier).toFixed(0), total: (180 * multiplier).toFixed(2) },
      ],
      subtotal: ((650 + 1560 + 680 + 420 + 180) * multiplier).toFixed(2),
    },
    {
      name: 'Premium',
      description: 'Top-tier materials with luxury finishes',
      lineItems: [
        { name: 'Labor — Expert Prep & Demolition', qty: '14', unit: 'hrs', rate: (75 * multiplier).toFixed(0), total: (1050 * multiplier).toFixed(2) },
        { name: 'Labor — Expert Installation', qty: '32', unit: 'hrs', rate: (75 * multiplier).toFixed(0), total: (2400 * multiplier).toFixed(2) },
        { name: 'Materials (Premium/Luxury Grade)', qty: '1', unit: 'lot', rate: (950 * multiplier).toFixed(0), total: (950 * multiplier).toFixed(2) },
        { name: 'Luxury Paint & Specialty Finishes', qty: '1', unit: 'lot', rate: (580 * multiplier).toFixed(0), total: (580 * multiplier).toFixed(2) },
        { name: 'Decorative Trim & Custom Details', qty: '1', unit: 'lot', rate: (350 * multiplier).toFixed(0), total: (350 * multiplier).toFixed(2) },
      ],
      subtotal: ((1050 + 2400 + 950 + 580 + 350) * multiplier).toFixed(2),
    },
  ]

  estimate.tiers = tiers
  estimate.style = style
  estimate.budget = budget
  estimates.set(id, estimate)

  res.json({ tiers })
})

// ============================================================
// POST /api/estimate/:id/send-quote — Nodemailer SMTP
// ============================================================
app.post('/api/estimate/:id/send-quote', async (req, res) => {
  const { id } = req.params
  const { to, subject, body, includePdf } = req.body

  const estimate = estimates.get(id)
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' })

  if (!to || !subject) {
    return res.status(400).json({ error: 'to and subject are required' })
  }

  // --- MVP MOCK: simulate email send with delay ---
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

  const messageId = `<mock-${Date.now()}@contractorhub.ai>`

  estimate.status = 'sent'
  estimates.set(id, estimate)

  res.json({ sent: true, messageId })
})

// ============================================================
// POST /api/upload — file upload (mock: return fake URL)
// ============================================================
app.post('/api/upload', (req, res) => {
  // In production: use multer + Cloudinary
  // MVP: return a fake hosted URL
  const mockUrl = `https://contractorhub.ai/uploads/${Date.now()}-photo.jpg`
  res.json({ url: mockUrl })
})

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`ContractorHub API running on http://localhost:${PORT}`)
  console.log(`OpenAI key: ${process.env.OPENAI_API_KEY ? '✓ configured' : '✗ not set (using mocks)'}`)
})
