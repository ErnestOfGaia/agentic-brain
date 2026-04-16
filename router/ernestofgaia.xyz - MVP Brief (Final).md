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

# ernestofgaia.xyz — Main Coaching Site (MVP Brief)

**Status:** Week 1-2 complete. Live on VPS, agents stubbed, ready for Week 2 sub-agent wiring.

---

## Vision

A clean, SEO-optimized coaching site that positions Ernest as a local AI guide in the Pacific City to Portland Metro area. The site is discoverable by both humans and AI systems, demonstrates AI tooling in action via the chat interface, and qualifies leads through intelligent routing.

---

## Core Features (MVP)

### 1. Hero Interface
- **Background:** Cape Kiwanda / Haystack Rock photo (exactly preserved)
- **Hero Card (centered):** "Your local AI guide. Coaching · Tutoring · Consulting"
- **Single CTA:** "Chat with me" button (or text input)
- **Contact Bar (top, pinned):** Phone · Email · Twitter handle
- **All content:** Real semantic HTML text (not image overlays)

### 2. Chat Mode
- **URL route:** `/chat` (URL synced with `window.history.pushState`)
- **Message history:** Persists within session (optionally can expand to localStorage later)
- **Routing agent:** Classifies incoming message intent and routes to sub-agent
- **Sub-agents:**
  - **Marketer:** "I want coaching" → explains services, qualifies leads, captures contact
  - **Secretary:** "I'd like to schedule" → books appointments, integrates Google Calendar (or manual fallback)
  - **Recruiter:** "I'd like to hire you" → pulls resume data, responds with relevant experience
- **Fallback:** Graceful default if intent doesn't match

### 3. GEO/SEO Layer (Complete)
- **`/llms.txt`** — Plain text summary of services, contact info, areas served (machine-readable for LLM crawlers)
- **JSON-LD schemas:**
  - `LocalBusiness` — Address, phone, service area
  - `Person` — Name, job title, image, contact
  - `Service` — Coaching, tutoring, consulting (with descriptions)
- **Semantic HTML:**
  - `<main>`, `<section aria-label>`, `<address>`, `<nav>` landmarks
  - Proper heading hierarchy
  - All clickable links: `<a href="tel:">` phone, `<a href="mailto:">` email, `<a href="https://twitter.com/...">` social
- **Sitemap.xml** — All routes and subdomains (to be generated Week 3)

### 4. Design System (Locked)
- **Color palette (CSS variables):**
  - `--teal` — Primary accent
  - `--navy` — Dark navy card background `rgba(44,59,74,0.88)` (frosted glass effect)
  - `--sky`, `--sage`, `--cream`, `--gold` — Supporting palette
- **Typography:** Readable sans-serif (locked from Week 1)
- **Animations:** FadeIn, smooth transitions
- **Card UI:** Dark navy with semi-transparent overlay (not white frosted glass)

### 5. Mobile Responsiveness
- **Desktop:** Full hero + card layout, chat sidebar or overlay
- **Mobile:** Hero + stacked card layout, chat as modal or bottom sheet
- **Touch-friendly:** Buttons and inputs sized for mobile (min 44px)

---

## Out of Scope (Deferred)

- Real-time typing indicators (nice-to-have, can add later)
- File upload / image sharing (not needed for MVP)
- Audio/voice chat (deferred to future phase)
- Advanced NLP beyond routing classification
- Email/SMS forwarding integrations (stretch goal)
- Analytics dashboard (post-MVP)

---

## Technical Stack

| Component | Technology |
|---|---|
| **Backend** | Mastra (TypeScript agent framework) + Next.js API routes |
| **Frontend** | Next.js App Router + React (use client) |
| **LLM Provider** | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| **Styling** | CSS modules + global CSS (brand variables) |
| **Deployment** | Docker (Node Alpine) + GHCR + GitHub Actions |
| **Hosting** | Hostinger VPS (Ubuntu 24.04) |
| **Domain Routing** | Nginx Proxy Manager |
| **Node Version** | v22.14.0 (Mastra minimum: 22.13.0) |
| **Package Manager** | npm |

---

## File Structure Reference

```
/root/ernestofgaia_M_site/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              (hero + chat UI)
│   │   ├── globals.css           (brand palette + shared styles)
│   │   └── api/chat/route.ts    (POST /api/chat)
│   ├── public/
│   │   ├── background.png        (Cape Kiwanda photo)
│   │   └── llms.txt              (GEO content)
│   └── Dockerfile
├── src/
│   └── mastra/
│       └── agents/
│           ├── routingAgent.ts   (main classifier)
│           ├── marketerAgent.ts  (coaching)
│           ├── secretaryAgent.ts (scheduling)
│           └── recruiterAgent.ts (jobs/collaboration)
├── .env.local                     (ANTHROPIC_API_KEY)
├── docker-compose.yml
├── .github/workflows/deploy.yml   (GitHub Actions)
└── README.md
```

---

## Deployment Path

**Local → GitHub → GHCR → VPS**

1. **Commit & push to GitHub main branch**
2. **GitHub Actions workflow triggers:**
   - Build Docker image from `./frontend/Dockerfile`
   - Push to GHCR: `ghcr.io/ernestofgaia/ai-tutoring-website:latest`
3. **On VPS, pull and restart:**
   ```bash
   docker pull ghcr.io/ernestofgaia/ai-tutoring-website:latest
   docker compose up -d
   ```
4. **Nginx Proxy Manager routes** `ernestofgaia.xyz` → port 3000 on VPS

---

## Success Criteria (MVP Complete)

- ✅ Site loads at `https://ernestofgaia.xyz`
- ✅ All three sub-agents respond meaningfully to real intents
- ✅ Chat history persists correctly within session
- ✅ Contact links (phone, email, Twitter) are clickable and functional
- ✅ Page source shows JSON-LD + semantic HTML (inspect → view source)
- ✅ `/llms.txt` is accessible at `https://ernestofgaia.xyz/llms.txt`
- ✅ Mobile layout is responsive (test on iOS/Android)
- ✅ No TypeScript errors in build
- ✅ Deploy via GitHub Actions completes without errors
- ✅ VPS can pull and run container successfully

---

## Open Questions Resolved

N/A — Site architecture is locked from Week 1. Any questions about agents or UX should be escalated to Question Time.

---

## Notes for Build

- **Card styling:** Navy tint is locked. Do not revert to white frosted glass.
- **URL sync:** Use `window.history.pushState` (not `router.push`) to avoid 404 on `/chat`
- **Routing agent:** Currently a stub with keyword classifier. Week 2 will wire real Mastra agents.
- **Sub-agents:** Stubbed with sensible defaults. Week 2 builds out full system prompts and LLM calls.
- **Environment:** `ANTHROPIC_API_KEY` must be set on VPS and in local `.env.local`
- **GitHub Actions:** Must use `github.repository_owner` (lowercase) for GHCR image tag
- **Node deprecation:** Use `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` in workflow (Node 20 deprecated June 2, 2026)

---

## Handoff to Week 3

By end of Week 2:
- All three sub-agents wired to real LLM calls ✓
- Chat fully functional on live site ✓
- Contact capture working (email/phone collection) ✓
- Resume data accessible to Recruiter agent ✓
- Abacus AI data imported to Obsidian ✓

Week 3 will focus on:
- Content polish (refine agent responses, improve UX)
- SEO refinement (generate sitemap.xml, validate JSON-LD)
- Integration testing with resume site
- Final polish and performance tuning
