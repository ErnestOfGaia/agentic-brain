---
tags:
  - agenticbrain
  - router
  - projects
  - sprint
topics:
  - project-brief
  - infrastructure
agenticbrain: true
agent-role: [router]
last-tagged: 2026-04-15
---

# Spring Sprint — Ernest of Gaia Projects (REFOCUSED)
### AI Coaching Business Launch Plan

*Started: March 30, 2026 · Target: 6 weeks · Status: Week 2, Ready for Refocus*

---

## 1. Mission & Context

Ernest is building a launch-ready local AI coaching business serving Pacific City to Portland Metro. The goal is to complete two MVP websites (main site + resume portfolio), then immediately order business cards and van magnet signage. **Marketing initiatives have been retired from the active sprint to focus engineering effort on the two core deliverables.**

**Two Core Milestones:**
1. **Online presence complete** — ernestofgaia.xyz + resume.ernestofgaia.xyz live and testable
2. **Physical business signage ordered** — Business cards + van magnet (triggered by milestone 1)

---

## 2. Active Site Network (MVP-Focused Only)

### ernestofgaia.xyz — Main Coaching Site
**Status:** Week 1-2 complete. Live on VPS with Next.js + Mastra backend.

The primary site showcasing Ernest as "Your Local Guide to AI Tools & Coaching." Serves three audiences via routing agent:
- Coaching prospects (Marketer sub-agent)
- Scheduling inquiries (Secretary sub-agent)
- Job/collaboration offers (Recruiter sub-agent)

**Key Requirements (Locked):**
- Cape Kiwanda / Haystack Rock background (preserved exactly)
- All content as semantic HTML text (SEO + AI crawler discoverability)
- Contact info pinned: 503-664-0546 · eog@ErnestOfGaia.xyz · @ErnestOfGaia
- Hero card: "Your local AI guide. Coaching · Tutoring · Consulting"
- Chat mode: `/chat` URL route with message history
- Mastra routing agent + 3 sub-agents (Marketer, Secretary, Recruiter)
- GEO/SEO layer: JSON-LD, llms.txt, semantic HTML landmarks

**Stack (Locked):**
- Node v22.14.0 on VPS
- Next.js App Router (inside Mastra project root)
- Local repo: `/root/ernestofgaia_M_site/`
- GitHub: `github.com/ErnestOfGaia/ai-tutoring-website`
- Deploy: Docker + GHCR + GitHub Actions + Nginx Proxy Manager

---

### resume.ernestofgaia.xyz — Interactive Resume / Portfolio Site
**Status:** Concept phase → Moving to design/build in Week 2-3.

A creative, interactive portfolio showcasing Ernest's work history and AI expertise. Visitors can ask an AI librarian questions about skills, projects, and background. Recruiters can access a clean resume export view.

**MVP Scope: Phase 1 (Text-Only AI Librarian)**
- Library-themed interface with sleeping librarian character
- Text-based chat with AI concierge (Claude API)
- Resume data displayed dynamically based on visitor questions
- "Skip to classic view" link for quick resume access (text/PDF)
- Mobile-responsive with simplified layout
- Design style: High-quality 2D illustration (Pixar-indie aesthetic)
- Voice features deferred to Phase 2+

**Stack:**
- Next.js App Router
- TypeScript
- Mastra (same agent framework as main site)
- Claude API (context primed with work history data)
- Hosted on Hostinger VPS (same infrastructure)
- GitHub repo: `ernestofgaia-resume` (to be created)

---

### mvp.ernestofgaia.xyz — Archive (Complete)
**Status:** DNS + routing complete. Current React carousel site frozen at subdomain as a live demo.

---

## 3. Retired Initiatives (Out of Active Sprint)

The following were de-prioritized to focus engineering effort on MVP completion:

- ❌ Q1 tool history content draft (Medium / LinkedIn articles)
- ❌ Demo project polish and screenshot documentation
- ❌ Print materials design (business card + van magnet design)
- ❌ Social media content calendar

**Why Retired:** These initiatives require finalized product + clear business positioning. Easier to create once both MVPs are live and tested. Marketing will accelerate in Week 5-6 *after* online presence is complete.

---

## 4. Architecture & Dependencies

### Mastra Agent Stack
- **Routing Agent:** Classifies intent, routes to appropriate sub-agent
- **Marketer Sub-Agent:** Coaching/tutoring inquiries → services explanation, lead qualification, contact capture
- **Secretary Sub-Agent:** Scheduling → Google Calendar integration (stretch), manual booking fallback
- **Recruiter Sub-Agent:** Job/collaboration inquiries → pull resume data, respond with relevant experience
- **Resume Concierge:** (Week 3) New sub-agent for resume.ernestofgaia.xyz, shares Recruiter logic

### Infrastructure (Locked)
- VPS: Hostinger Ubuntu 24.04, Dockerized, Nginx Proxy Manager
- Deployment: GitHub Actions → GHCR → Docker pull on VPS
- All three sites: Same Docker pipeline, separate GitHub repos, separate Nginx routes
- Environment variables: `ANTHROPIC_API_KEY` set on VPS and in local `.env.local`

### GEO/SEO Layer (Complete)
- `/llms.txt` at domain root (machine-readable for LLM crawlers)
- JSON-LD: LocalBusiness + Person + Service schemas
- Semantic HTML: `<main>`, `<section aria-label>`, `<address>`, `<nav>`
- All contact links: `<a href="tel:">` and `<a href="mailto:">`
- Sitemap.xml (to be generated Week 3)

---

## 5. Success Criteria

### ernestofgaia.xyz MVP Complete When:
- ✅ Site is live at `https://ernestofgaia.xyz`
- ✅ All three sub-agents respond meaningfully to real user intents
- ✅ Chat persists conversation history correctly
- ✅ All contact links are clickable and functional
- ✅ JSON-LD + semantic HTML render correctly (inspect page source)
- ✅ `/llms.txt` is accessible and accurate
- ✅ Mobile layout is responsive and readable
- ✅ No TypeScript errors in build

### resume.ernestofgaia.xyz MVP Complete When:
- ✅ Site is live at `https://resume.ernestofgaia.xyz`
- ✅ Librarian character and library scene display correctly on desktop/mobile
- ✅ AI concierge responds to questions about Ernest's work history
- ✅ Resume data is accurately rendered from database/Obsidian vault
- ✅ "Skip to classic view" link provides clean, printable resume
- ✅ All contact info matches main site (phone, email)
- ✅ JSON-LD + semantic HTML (same GEO/SEO as main site)
- ✅ Mobile layout simplified but usable

---

## 6. Obsidian + Claude Integration

Vault is in `.claude` folder. MCP filesystem access confirmed.

- ✅ Vault root moved to `.claude` folder
- ✅ MCP filesystem access verified
- ✅ Read/write of test note confirmed
- ✅ Abacus resume data imported as markdown files
- ⬜ Resume concierge system prompt populated from Obsidian summary

---

## 7. Timeline: Weeks 2–4

| Phase | Week 2 | Week 3 | Week 4 |
|---|---|---|---|
| **ernestofgaia.xyz** | Agent logic + deploy | Content polish + SEO | Final testing + hardening |
| **resume.ernestofgaia.xyz** | Design + character art | Build AI concierge | Integration + testing |
| **Infra / DevOps** | Resume scaffold deploy | Sitemap.xml generation | Pre-deployment checklist |
| **Obsidian** | Resume data imported | Concierge prompt finalized | Ready for launch |

**Week 5-6 (Post-MVP):** Business cards + van magnet design, Q1 content, social media scheduling.

---

## 8. Question Time Resolution (April 7, 2026)

**All blocking design decisions completed during focused Question Time session.**

See **`Unanswered Questions & Design Decisions.md`** for full details of:
- ✅ Q1: Librarian personality (B - friendly/conversational)
- ✅ Q2: Character design (B - custom vector art via AI tools)
- ✅ Q3: Library scene (B - moderate with spatial architecture)
- ✅ Q4: Resume data privacy (A - all public)
- ✅ Q5: Lead qualification (C - explicit, student-centered)
- ✅ Q6: Site integration (C - integrated backend/subdomain)
- ✅ Q7: Beach cam (B - defer to post-MVP with local commerce)
- ✅ Q8: Data sync (B - Obsidian source of truth, monthly manual)

These decisions unblock Week 2 execution for resume site design + build phase.

---

## 9. Quick Reference

| Item | Value |
|---|---|
| Main site | ernestofgaia.xyz |
| Resume site | resume.ernestofgaia.xyz |
| Archive | mvp.ernestofgaia.xyz |
| Phone | 503-664-0546 |
| Email | eog@ErnestOfGaia.xyz |
| Service area | Pacific City · Lincoln City · Tillamook · Portland Metro |
| VPS | Hostinger Ubuntu 24.04 |
| Deploy | Docker + GHCR + GitHub Actions + Nginx Proxy Manager |
| Agent framework | Mastra (TypeScript) |
| Frontend | Next.js App Router |
| LLM provider | Anthropic Claude API |
| Main repo | github.com/ErnestOfGaia/ai-tutoring-website |
| Resume repo | github.com/ErnestOfGaia/ernestofgaia-resume |
| Node version | v22.14.0 |

---

## 9. When Complete

- [ ] All initiatives categorized and triaged
- [ ] Marketing initiatives documented as retired (not lost, just deferred)
- [ ] Three MVP briefs finalized and ready to build from
- [ ] Weeks 2–4 action plans with daily execution pattern
- [ ] Unanswered questions logged with impact assessment
- [ ] Week 2 Day 5 (resume site scaffold) ready to start
- [ ] Team aligned on Phase 1 scope (text-only AI librarian)
