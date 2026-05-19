# Talanthos — Project Context & Strategy Brief
*Last updated: May 19, 2026*

## What It Is

Talanthos is a **Biblical Money Type assessment** that helps Christians discover the spiritual archetype shaping how they relate to money, and what God is calling them to repair, refine, or release.

The product is positioned as a **transformation tool, not a financial app**. Money is the symptom; spiritual posture is the root. Talanthos delivers hard truths from Scripture, not motivational fluff or prosperity gospel rebrands.

**Core positioning sentence:**
> "The Bible has more to say about money than almost any other topic — because how you hold money reveals how you hold everything. Talanthos helps you see what your money is telling you about your soul."

## The 4 Biblical Money Types

| Type | Figure | Tagline | Monogram |
|------|--------|---------|----------|
| **The Visionary** | Solomon | The Wisdom-Wealth Builder | I |
| **The Guardian** | Joseph | The Steward-Protector | II |
| **The Giver** | The Macedonians | The Generous Heart | III |
| **The Builder** | Nehemiah | The Systematic Restorer | IV |

Each type has: strengths (5), blind spots (5), key Scripture passage, a personalized "hard truth" message, a "next step" action, and a 47-page personalized PDF report.

## The Funnel

```
Landing Page (editorial biblical aesthetic, 4 types preview, CTA)
    ↓
Quiz (9-12 questions including age, marital status, children,
      current financial situation, biggest regret [free text],
      emotional relationship with money [free text])
    ↓
Calculating Screen (contemplative, "Your reading is being prepared")
    ↓
Intro Reading (Scripture + heart preparation, 1 Peter 4:10)
    ↓
Result Page (monogram, type reveal, AI-personalized "hard truth"
             reading [600-800 words], 5 tabs, locked PDF teaser)
    ↓
Email Capture (to receive full PDF reading)
    ↓
Paywall ($19 for the 47-page personalized PDF report)
```

## Brand Positioning

**Talanthos is the voice of a wise pastor who loves you enough to tell you the hard truth.**

Tone:
- Compassionate but uncompromising
- Anchored in Scripture, never in pop psychology
- Hard truths delivered with respect, not arrogance
- Inviting transformation, not selling shortcuts
- Treating money as a spiritual matter, not a math problem

What we are NOT:
- Not a financial advisor (legal disclaimer + spiritual framing)
- Not prosperity gospel (we don't promise wealth)
- Not Dave Ramsey rebranded (we don't teach budgeting techniques)
- Not Christian Calm (we are deeper, more confrontational)
- Not a money tool (we are a mirror)

## Visual Identity (rebrand in progress)

**Reference aesthetic:** Plough.com, Comment Magazine (Cardus.ca), The Rabbit Room.

Visual rules:

DO:
- Custom illustrations in "modern editorial biblical" style
- Symbolic imagery: gates, paths, ladders, open hands, seeds, lamps, water, vines, anchors, oil
- Textures: aged paper, parchment, restrained use
- Premium serif typography (Crimson Pro / EB Garamond / Cardo / Instrument Serif)
- Generous white space, contemplative pacing
- Subtle decorative details: drop caps, end-of-section ornaments
- Slow, contemplative animations (fade-in 600ms, subtle parallax)

DO NOT:
- Stock photos (no folded hands, no crosses on hills)
- Generic Christian Pinterest aesthetic (florals + crosses)
- Money iconography (dollars, coins, safes, graphs)
- Bible verse quotes overlaid on stock light-ray images
- Cheap religious lithographs

## Tech Stack

- **Frontend**: Next.js 16.2.6 + TypeScript + Tailwind CSS v4
- **Database**: Supabase Pro (quiz sessions, answers, leads, orders)
- **Email**: Resend (info@talanthos.com)
- **Payments**: Stripe (account on DEXARA SRL, new from MysticArc/Nesco)
- **AI**: Claude API (for personalized quiz readings, ~$15-30/mo at 1000 quiz/mo)
- **Hosting**: Vercel (auto-deploy from GitHub)
- **Fonts**: Geist (sans), Instrument Serif (display), Cormorant Garamond (nav)
- **Theme**: Parchment default (#f3ece0 bg, #b88a4a accent) — to be refined in rebrand

## AI Personalized Reading

After scoring identifies primary type, Claude API generates a 600-800 word personalized reading using:
- Primary type + secondary type
- Age, marital status, children
- Current financial situation
- Free text: biggest financial regret
- Free text: emotional relationship with money today

System prompt instructs Claude to write as "a compassionate but uncompromising pastor who loves the reader enough to tell them the hard truth, anchored in Scripture, never in pop psychology."

Output structure:
1. Direct acknowledgment of their type with biblical figure parallel
2. The hard truth about their blind spot — named without softening
3. A biblical character who fell from the same blind spot
4. The repentance/action being called for
5. A biblical promise to anchor the journey forward

## Current State

- Complete facelift implemented (standalone design integrated)
- Quiz fully functional (client-side scoring, hard-coded type mapping)
- All 4 types with full data (strengths, blind spots, verses, next steps)
- Result page with tabs, score bars, locked teaser
- Contact form (/contact) wired to Resend → info@talanthos.com
- Email capture + paywall pages exist
- Supabase Pro connected
- Resend domain verified (talanthos.com)
- DNS fixed (A → Vercel, MX → Hosterion, TXT SPF includes Amazon SES)

## In Progress (next 6-8 weeks)

- Visual rebrand to "editorial biblical" aesthetic
- Quiz expansion to 9-12 questions including free text inputs
- Claude API integration for personalized readings on result page
- PDF report generation pipeline (47 pages per type, dynamic content)
- Stripe checkout + Meta Pixel + Conversion API verified
- Email funnel (3 emails post-quiz: instant reading, day 2, day 4)

## Monetization

**Phase 1 (now):**
- $19 one-time PDF personalized report

**Phase 2 (after PMF, ~3-6 months):**
- $29 print / $9 digital — 90-day biblical journal for your type
- $49 — 30-day email course "The Discipline"

**Phase 3 (after 200+ customers):**
- $9/month — "The Companion" subscription (weekly devotional + monthly type-specific reading, all text/AI-audio, zero live)
- $19 each / $99 bundle — "The Library" deep dive readings on topics (debt, generosity, anxiety, contentment)

**Hard constraints — never to be violated:**
- Zero live events (no webinars, no calls, no cohorts)
- Zero personal filming by founder
- Zero "founder as figure" (faceless brand by design)
- Future AI voice/video acceptable only when imperceptible to users

## Target Audience

Christian adults 25-55, US/UK primary, Pinterest-active, seeking deeper spiritual truth about money beyond budgeting techniques. Skeptical of prosperity gospel and televangelist culture.

Highest-intent micro-segments (to be tested in Meta Ads):
- Christian women 35-55 (Pinterest-active, Faith content readers)
- Christian couples 30-45 (engaged/married, family stage)
- Christian young professionals 25-35 (career stage, faith-active)
- Churchgoers (Christian + church-related interests)

## Distribution Strategy

**Paid:**
- Meta Ads $30-50/day from launch, optimized for Purchase event
- 4 creative variants per type, 4 audience segments
- Pixel + Conversion API verified in Supabase before first ad

**Organic (parallel from launch):**
- Pinterest (primary organic channel — faceless friendly, Christian audience density)
- TikTok faceless with AI voice (ElevenLabs Brian/Charlotte, 60s narrations)
- Blog SEO (month 2+, target topics like "what does the Bible say about debt")

**Excluded for now:**
- Partnerships with churches (requires brand authority not yet built)
- Podcast guesting (requires founder face/voice)
- Live events of any kind

## Success Metrics (first 90 days)

- **Day 30 checkpoint:** 20+ paid PDF sales → continue scaling
- **Day 60 checkpoint:** CAC < $25, AOV > $30, refund rate < 10%
- **Day 90 checkpoint:** $3-5K/mo revenue baseline established

If below thresholds at day 90: postmortem on copy, audience, pricing, or product.

## Operational Constraints

- Founder (Alex) max 10-15 hours/week on Talanthos
- Run by Alex + Claude Code, no team
- Budget month 1: ~$1100-1700 (Supabase Pro, ElevenLabs, Canva Pro, Tailwind Publisher, Anthropic API, Stripe, Meta Ads ~$900-1500)
- DEXARA SRL handles invoicing, 21% Romanian VAT applies to RO sales, Stripe Tax handles US/UK/EU VAT compliance

## What This Project Is Not

- Not a side hustle to be neglected
- Not a learning project (production from day 1)
- Not a pivot from Edu-AI (Edu-AI is paused indefinitely, no waitlist obligations)
- Not a venture-backable startup (sustainable solo business model)
- Not a vehicle to grow Alex's personal brand
- Not a recurring SaaS — it is a content engine with one-time and subscription products
