# ContractorHub — AI-Powered Estimator

> Replace spreadsheets, manual calcs, and design guesswork with one app that builds bids, generates visuals, and closes deals — powered by AI.

---

## 1. Concept & Vision

ContractorHub is a mobile-first sales tool for remodel/painting/flooring/drywall contractors. It replaces the chaotic mix of spreadsheets, design software, and manual emails with a single AI-powered workflow: enter the job scope → let GPT ask questions → generate a professional bid with rendered visuals → send directly to the client. It's authoritative without being cold, professional without being corporate. Built for guys on the job site who need to close deals fast.

**Long-term vision:** Part of a broader "Blue Collar AI" suite — a contractor dashboard that manages active jobs, delays, client comms, invoices, and AI-assisted operations end-to-end.

---

## 2. Design Language

### Aesthetic Direction
**Industrial-professional** — Think contractor-grade quality: clean whites, concrete grays, with electric blue as the action color. Feels like a premium tool, not a toy. Apple-level polish meets Jobsite practicality.

### Color Palette
| Role | Value | Use |
|------|-------|-----|
| Background | `#F5F5F7` | Page bg |
| Surface | `#FFFFFF` | Cards, inputs |
| Dark | `#1D1D1F` | Text |
| Muted | `#86868B` | Secondary text |
| Border | `#D2D2D7` | Dividers, outlines |
| Primary | `#0071E3` | CTAs, links, YES button |
| Accent | `#34C759` | Success, confirm |
| Danger | `#FF3B30` | Errors, delete |
| Charcoal | `#2D2D2E` | Dark UI panels |
| Dark BG | `#000000` | Dark mode surfaces |
| Dark Surface | `#1C1C1E` | Dark cards/chips |

### Typography
- **Font:** `Inter` (Google Fonts) with `-apple-system, BlinkMacSystemFont` fallback
- **Scale:**
  - Display: 48px / 800 weight
  - H1: 32px / 700
  - H2: 24px / 600
  - Body: 17px / 400
  - Caption: 12px / 500 uppercase tracking
- **Line height:** 1.5 for body, 1.1 for display

### Spatial System
- Base unit: 8px
- Padding (mobile): 16px horizontal
- Card radius: 18px
- Button radius: 12px (YES/NO), 14px (action), 16px (hero)
- Max content width: 680px (8.5" paper equivalent)
- Max layout width: 1024px

### Motion Philosophy
- Transitions: 280ms ease-out (fades/slides), 150ms for micro-interactions
- YES button flash: 550ms cyan-to-blue pulse
- Page transitions: fade + 8px vertical slide
- Loading: subtle pulse animation on cards
- Image generation: shimmer skeleton while loading

### Visual Assets
- Icons: Lucide React (clean, consistent stroke weight)
- No emoji in UI — use SVG icons
- Placeholder images: construction/renovation photography
- Visual renders: DALL-E 3 generated, displayed in 16:9 card format

---

## 3. Layout & Structure

### App Shell
```
┌─────────────────────────────┐
│  Header (680px max)         │
│  [← Back] [Title] [Clear]  │
├─────────────────────────────┤
│                             │
│  Content Area               │
│  (680px max, centered)      │
│  flex: 1                   │
│                             │
├─────────────────────────────┤
│  Bottom Nav / Action Bar    │
│  (680px max, centered)      │
└─────────────────────────────┘
```

### Screens (User Flow)
1. **Landing** — Dark, color-fade hero with "ContractorHub" logo + tagline + Get Started
2. **New Estimate** — 5-step wizard
3. **AI Chat** — Conversation thread where GPT asks scope questions
4. **Visuals Gallery** — DALL-E generated renders in a scrollable gallery
5. **Quote Preview** — 3-tier bid card with all line items
6. **Send** — Email composer with recipient, preview, send button
7. **Dashboard** — Job list, status, history (Phase 2)

### Responsive Strategy
- Mobile-first (375px base)
- Tablet (768px+): 2-column layouts where appropriate
- Desktop (1024px+): Side-by-side panels
- Max-width cap at 680px for reading content, 1024px for layout

---

## 4. Features & Interactions

### 4.1 New Estimate Wizard (5 Steps)

**Step 1 — Project Basics**
- Client name, address, phone, email
- Project type: Remodel | Painting | Flooring | Drywall | General (multi-select chip grid)
- Project address (if different from client address)
- Project type notes (free text)

**Step 2 — Scope Builder (AI-Assisted)**
- Upload photos: drag-drop or camera, up to 8 photos
- AI analyzes context from photos
- GPT asks conversational follow-up questions in a chat UI
- GPT summarises scope into line items (editable)

**Step 3 — Style & Vision**
- Style selector: Modern | Classical | Modern Rustic | Industrial | Coastal | Transitional (grid chips, pick 1)
- Reference images: optional extra uploads
- Color palette preference (free text)
- Budget indicator: Low | Medium | High (for GPT to calibrate tiers)

**Step 4 — Quote Tiers**
- GPT generates 3 tiers: Basic | Standard | Premium
- Each tier has: name, description, line items, subtotal, margin
- Line items are editable inline (name, qty, unit, rate)
- Contractor can add/remove line items per tier
- Each tier optionally linked to 1 DALL-E visual concept

**Step 5 — Review & Send**
- Client info summary (editable)
- Quote preview (full breakdown)
- Add notes/custom message to client
- Email composer: recipient (pre-filled), subject, body
- Send button → SMTP/SendGrid delivery

### 4.2 AI Chat (Scope Building)
- Thread-based conversation with GPT-4o
- Each message bubbles left (GPT) or right (contractor)
- Contractor can type or tap quick-reply options GPT suggests
- "Done" button when scope is complete → advances to Step 3
- Context from Step 1 fields fed into GPT system prompt
- Photos attached as base64 to GPT-4o vision

### 4.3 Visual Generation
- Contractor selects which tier gets a visual
- Describes what to render (e.g. "modern kitchen with island, marble counters")
- DALL-E 3 generates a render
- Loading state: shimmer skeleton card
- Displayed in gallery with regenerate/retry option
- Visual can be regenerated (3 retries max)
- Sent as image link or embedded in quote PDF

### 4.4 Quote Engine
- 3-tier structure generated by GPT
- Each line item: `qty × unit × rate = total`
- Tier totals + overall project total
- Markup/margin display
- Editable in real time
- Save as draft (localStorage for now, DB in Phase 2)

### 4.5 Email Delivery
- Connect via SMTP or SendGrid API
- Send quote as:
  - HTML email body (inline styles)
  - PDF attachment (generated client-side via `@react-pdf/renderer`)
- Sent from contractor's own email address
- Delivery confirmation / error display
- History log (Phase 2)

---

## 5. Component Inventory

### Core Components
| Component | States | Notes |
|-----------|--------|-------|
| `ProjectCard` | default, selected, editing | Step 1 project type chip |
| `PhotoUploader` | empty, dragging, filled, error | Step 2 photo upload |
| `ChatBubble` | gpt, user, system | AI chat thread |
| `AIChatInput` | idle, thinking, disabled | Chat input bar |
| `StyleChip` | default, selected | Step 3 style grid |
| `TierCard` | default, editing, saving | Step 4 quote tier |
| `LineItemRow` | default, editing | Inline editable row |
| `VisualCard` | loading, loaded, error, regenerating | DALL-E render card |
| `QuotePreview` | default | Full quote summary |
| `EmailComposer` | empty, filled, sending, sent, error | Step 5 email |
| `NavBar` | default | Back / Title / Clear |
| `TabBar` | default | Script/estimate type switcher |
| `AccentBar` | color per script | Color stripe at top |
| `StepIndicator` | active, complete, upcoming | Progress stepper |

### Button Variants
| Button | Style |
|--------|-------|
| YES | Blue gradient (`#0071E3 → #5AC8FA`), white text, flash animation |
| NO | Transparent, blue outline `#0071E3`, solid on click |
| Primary CTA | Blue gradient, full-width, rounded |
| Secondary | Charcoal `#2D2D2E`, white text |
| Ghost | Transparent, white text, border |
| Danger | Red `#FF3B30`, white text |

---

## 6. Technical Approach

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Plain CSS (no framework — full custom Apple-style)
- **State:** React `useState`/`useCallback` — no external state manager yet
- **Routing:** React Router v6 (hash router for static deploy)
- **PDF:** `@react-pdf/renderer` for quote PDF generation
- **Image Upload:** `react-dropzone` or native file input + base64 encoding

### Backend
- **Runtime:** Node.js + Express
- **AI:** OpenAI SDK (`gpt-4o`, `dall-e-3`)
- **Email:** Nodemailer (SMTP) + SendGrid API option
- **Storage:** Cloudinary (image hosting for email/PDF) — `formidable` for uploads
- **Auth:** Simple env-based API key for MVP (no user auth in Phase 1)
- **CORS:** Configured for client origin

### API Design
```
POST /api/estimate/create
  body: { client, projectType, photos[] }
  response: { estimateId }

POST /api/estimate/:id/chat
  body: { messages[], photos[] }
  response: { reply, suggestedReplies[], done }

POST /api/estimate/:id/generate-visuals
  body: { tier, description }
  response: { imageUrl }

POST /api/estimate/:id/generate-quote
  body: { scope, style, budget }
  response: { tiers: [{ name, lineItems, total }] }

POST /api/estimate/:id/send-quote
  body: { to, subject, body, includePdf }
  response: { sent, messageId }

POST /api/upload
  body: FormData (image file)
  response: { url }
```

### Data Model
```js
Estimate {
  id: uuid,
  client: { name, address, phone, email, notes },
  projectType: string[],
  photos: string[],  // URLs
  scope: { chatHistory: [], summary: '' },
  style: string,
  budget: 'low' | 'medium' | 'high',
  tiers: [
    { id, name, description, lineItems: [], subtotal, visualUrl }
  ],
  status: 'draft' | 'quoted' | 'sent' | 'accepted',
  createdAt, updatedAt
}
```

### Environment Variables
```
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
PORT=3001
```

---

## 7. Phase Roadmap

### Phase 1 — MVP (NOW)
- [ ] Landing page
- [ ] Estimate wizard (all 5 steps)
- [ ] GPT scope building chat
- [ ] DALL-E visual generation
- [ ] 3-tier quote builder
- [ ] Email send
- [ ] GitHub push + Vercel deploy

### Phase 2 — Dashboard
- [ ] Job list with status
- [ ] Active vs. completed jobs
- [ ] Client history
- [ ] Notifications / alerts

### Phase 3 — Business Suite
- [ ] Invoice generation
- [ ] Job scheduling
- [ ] Subcontractor management
- [ ] Material cost DB (with markups)
- [ ] Google Calendar integration

---

_Last updated: 2026-04-18 — v0.1_
