# ContractorHub Design System

## Overview

ContractorHub targets blue-collar contractors (roofers, HVAC, plumbers, electricians, framers) at $499/month. The product must project **trust, professionalism, and clarity** — not prototype energy. This design system defines the visual language to support that positioning.

---

## Color Palette

### Core

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#F4F5F7` | Page background |
| `--surface` | `#FFFFFF` | Card/panel surfaces |
| `--surface-raised` | `#FAFAFA` | Slightly elevated surfaces |
| `--dark` | `#1C1C1E` | Primary text, headings |
| `--muted` | `#6B7280` | Secondary text, captions |
| `--border` | `#E5E7EB` | Dividers, input borders |

### Brand & Accent

| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#1D6AFF` | Primary CTA, links, active states |
| `--primary-dark` | `#1557C4` | Primary hover/pressed |
| `--primary-light` | `#EFF4FF` | Primary tint background |
| `--accent` | `#0EA472` | Success, "done" states, confirmation |
| `--accent-light` | `#EDFAF4` | Success tint background |

### Signal

| Token | Hex | Usage |
|---|---|---|
| `--danger` | `#D93025` | Destructive actions, errors |
| `--danger-light` | `#FEF2F1` | Error tint |
| `--warning` | `#F59E0B` | Warnings, caution states |
| `--warning-light` | `#FFFBEB` | Warning tint |

### Dark Surfaces (Landing page, dark modals)

| Token | Hex | Usage |
|---|---|---|
| `--dark-bg` | `#0A0A0C` | Deep dark background |
| `--dark-surface` | `#1C1C1E` | Dark card surface |
| `--dark-field` | `#2D2D30` | Dark input background |
| `--dark-border` | `rgba(255,255,255,0.1)` | Dark dividers |
| `--dark-muted` | `rgba(255,255,255,0.45)` | Dark secondary text |

---

## Typography

**Font:** `Inter` (Google Fonts) — clean, professional, excellent legibility at all sizes.

### Scale

| Class | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `.display` | 48px | 800 | 1.1 | Hero headlines |
| `.h1` | 28px | 700 | 1.2 | Page titles |
| `.h2` | 22px | 700 | 1.25 | Section headings |
| `.h3` | 18px | 600 | 1.3 | Card headings |
| `.body` | 16px | 400 | 1.5 | Default body copy |
| `.body-md` | 15px | 400 | 1.5 | Secondary body |
| `.body-sm` | 14px | 400 | 1.5 | Supporting text |
| `.caption` | 12px | 600 | 1.4 | Labels, badges, uppercase |

### Usage Rules
- Headings: dark (`--dark`)
- Body copy: dark (`--dark`)
- Captions, labels, metadata: muted (`--muted`)
- Never use font weights below 400 for body text

---

## Spacing Rhythm

Uses an 8px base unit:

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Chip gaps, small padding |
| `--space-3` | 12px | Input padding, small margins |
| `--space-4` | 16px | Card padding, standard gaps |
| `--space-5` | 24px | Section spacing |
| `--space-6` | 32px | Large section gaps |
| `--space-7` | 48px | Hero spacing |
| `--space-8` | 64px | Page-level separation |

---

## Border Radii

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Buttons, chips, inputs |
| `--radius-md` | 12px | Cards, modals |
| `--radius-lg` | 16px | Tier cards, panels |
| `--radius-xl` | 24px | Landing CTAs, large buttons |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle surface lift |
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,0.08)` | Cards at rest |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.10)` | Hover elevation |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.14)` | Modals, overlays |

---

## Buttons

### Hierarchy (3 levels)
1. **Primary** — blue fill, full width for main CTAs
2. **Secondary** — charcoal/gray fill, for supporting actions
3. **Ghost** — transparent with border, for tertiary actions

### Variants
- `.btn` — base button
- `.btn-primary` — blue fill, white text
- `.btn-secondary` — charcoal, white text
- `.btn-ghost` — transparent, border only
- `.btn-danger` — red, for destructive actions
- `.btn-sm` — smaller padding for inline use
- `.btn-full` — full width
- `.btn-icon` — square icon-only button

### States
- Default → Hover (slight brightness lift) → Active (slight press down) → Disabled (0.5 opacity)

---

## Form Fields

### Standard
- Background: `--surface`
- Border: 1.5px `--border`
- Radius: `--radius-md`
- Padding: 12px 16px
- Focus: border `--primary` + 3px glow ring

### Dark variant (on dark backgrounds)
- Background: `--dark-field`
- Border: 1.5px `--dark-border`

---

## Component Guidelines

### Cards
- Background: `--surface`
- Border: 1px `--border`
- Radius: `--radius-md`
- Padding: 20px (`--space-5`)
- Hover: `--shadow-md` + 1px border `--primary`

### Chips / Tags
- Pill shape: `--radius-full`
- 4 sizes: project types, filters, status
- Selected state: filled `--primary` background

### Badges
- Compact pill, used for status
- `.badge-blue` (default/sent)
- `.badge-green` (accepted/done)
- `.badge-red` (rejected/error)
- `.badge-yellow` (pending/warning)

### Icons
- Library: **Lucide React** (consistent 24px stroke icons)
- Never use emoji as icons
- Icon-only buttons need `aria-label`

### Chat Bubbles
- GPT/assistant: white surface, left-aligned, rounded on all corners except bottom-left
- User: `--primary` fill, white text, rounded all corners except bottom-right
- System: centered pill, muted background

---

## Motion Philosophy

Purposeful and quick. Motion should orient the user, not entertain them.

- **Page transitions**: fade + 8px upward translate, 280ms ease-out
- **Step transitions**: fade + 12px upward translate, 280ms ease-out
- **Button interactions**: scale(1.02) on hover, scale(0.98) on active, 150ms
- **Card hover**: shadow lift, 200ms ease-out
- **Typing indicator**: 3 dots with staggered bounce, 1.2s loop
- **Chat bubbles**: fade + 8px upward translate, 280ms ease-out

**Rule:** No animation exceeds 400ms. No decorative motion.

---

## Dark Landing Page

The landing page uses a full dark treatment (not just dark mode) to create visual contrast with the app interior.

- Background: `--dark-bg`
- Decorative radial glows for depth
- Logo: white gradient text
- CTA: purple-to-blue gradient (`#6B3FA0` → `--primary`)
- Feature pills: semi-transparent white with border

---

## Anti-patterns (Do Not Use)

- Emoji as icons (use Lucide)
- Inline styles for layout (use CSS classes)
- Pure black (`#000`) for text
- More than 3 font weights on one page
- Animations that block interaction
- Alert-style error banners as primary UI
- "Coming Soon" banners in production UI
