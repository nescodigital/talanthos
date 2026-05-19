# Talanthos — Project Context & Strategy Brief

## What It Is
Talanthos is a **Biblical Money Type assessment** — a 7-question quiz that identifies how God has uniquely wired a person to relate to money. Rooted in Scripture, it maps respondents onto 4 archetypes drawn from biblical figures.

## The 4 Biblical Money Types

| Type | Figure | Tagline | Monogram |
|------|--------|---------|----------|
| **The Visionary** | Solomon | The Wisdom-Wealth Builder | I |
| **The Guardian** | Joseph | The Steward-Protector | II |
| **The Giver** | The Macedonians | The Generous Heart | III |
| **The Builder** | Nehemiah | The Systematic Restorer | IV |

Each type has: strengths (5), blind spots (5), a key verse, a personalized "next step" action, and a 47-page PDF report.

## The Funnel

```
Landing Page (trust badges, 4 types preview, CTA)
    ↓
Quiz (7 questions, direct type-mapping per answer)
    ↓
Calculating Screen (animated, 3-step "naming" sequence)
    ↓
Intro Result (1 Peter 4:10, prepares the heart)
    ↓
Result Page (monogram, score bars, 5 tabs, locked PDF teaser)
    ↓
Email Capture (inline in result + dedicated /quiz/email page)
    ↓
Paywall ($19 for the 47-page personalized report)
```

## Tech Stack
- **Frontend**: Next.js 16.2.6 + TypeScript + Tailwind CSS v4
- **Database**: Supabase Pro (quiz sessions, answers, leads, orders)
- **Email**: Resend (info@talanthos.com) — contact form, lead confirmation, report delivery
- **Hosting**: Vercel (auto-deploy from GitHub)
- **Fonts**: Geist (sans), Instrument Serif (display), Cormorant Garamond (nav)
- **Theme**: Parchment default (#f3ece0 bg, #b88a4a accent)

## Current State
- ✅ Complete facelift implemented (standalone design integrated)
- ✅ Quiz fully functional (client-side scoring)
- ✅ All 4 types with full data (strengths, blind spots, verses, next steps)
- ✅ Result page with tabs, score bars, locked teaser
- ✅ Contact form (/contact) wired to Resend → info@talanthos.com
- ✅ Email capture + paywall pages exist
- ✅ Supabase Pro connected
- ✅ Resend domain verified (talanthos.com)
- ✅ DNS fixed (A → Vercel, MX → Hosterion, TXT SPF includes Amazon SES)

## Monetization
- **Primary**: $19 one-time purchase for 47-page personalized PDF report
- **Future ideas**: email course, community, coaching, partnerships with churches

## Immediate Goal
Test market interest through organic posts and paid ads. Validate that people actually want to discover their Biblical Money Type before building out the full product ecosystem.

## Open Questions for Strategy
1. Should the PDF report be built now, or should we test interest first with a simpler deliverable?
2. What content engine (blog, newsletter, social) supports the quiz best?
3. Which audience segment is the highest-intent? (Churchgoers, financial coaches, young professionals, couples?)
4. Should we build an email nurture sequence post-quiz to warm leads before the paywall?
5. What partnerships (churches, Christian financial advisors, podcasts) could drive organic traffic?
6. Is there a subscription/recurring model that makes sense beyond the one-time PDF?
