---
tags:
  - agenticbrain
  - recruiter
  - projects
  - sprint
  - development
  - brief
topics:
  - project-brief
  - work-history
agenticbrain: true
agent-role: [recruiter]
last-tagged: 2026-04-15
---

# resume.ernestofgaia.xyz — Interactive Resume (MVP Brief - Phase 1: Text-Only)

**Status:** Concept phase. Ready for design + build starting Week 2.

---

## Vision

An interactive, brand-consistent portfolio site that demonstrates Ernest's work history and AI expertise. Visitors can chat with an AI "librarian" to explore skills, projects, and background. Recruiters can access a clean, traditional resume view. This site serves as a trust-building tool that complements the main coaching site—showing "proof" that Ernest walks the walk with AI tools.

**Core User Journey:** Visitor → Main site → "Tell me more" → Resume site → Vets skills → Reaches out

---

## MVP Scope: Phase 1 (Text-Only AI Librarian)

### What's Included

1. **Library-Themed Interface**
   - Desktop: Split-screen layout (left: librarian + library scene | right: resume data)
   - Mobile: Stacked layout (librarian above, resume data below)
   - "Wake up the librarian" interaction → triggers chat mode
   - Librarian character: 2D illustration (professional, not cartoonish)
   - Library aesthetic: Warm color palette, bookshelves, desk plaque with EoG branding
   - Design style: Pixar/premium indie game aesthetic (high-quality, polished)

2. **AI Librarian Concierge**
   - **Backend:** Claude API (same as main site sub-agents)
   - **Knowledge base:** Ernest's work history, skills, projects, accomplishments
   - **Interaction mode:** Text-based chat only (voice deferred to Phase 2)
   - **Quick prompt buttons:** Examples: "Summarize my resume," "Show my AI projects," "What's your background in coaching?"
   - **Personality:** Warm, knowledgeable, helpful (aligned with main site)
   - **Smart routing:** Identifies visitor type (recruiter, potential client, curious learner) and tailors responses

3. **Resume Data Display**
   - **Data source:** Obsidian vault (master resume file + structured work history)
   - **Display format:** Library index cards (dynamic, populated by AI responses)
   - **Searchable:** Visitor can ask about specific skills, projects, companies, time periods
   - **Example queries:** "What did you build with Claude?" → Returns relevant projects
   - **Exports:** Can download/print clean resume view (PDF or text)

4. **Classic Resume View**
   - **Link:** Always accessible ("Skip to classic view" or direct URL)
   - **Format:** Clean, printable, traditional resume layout
   - **Purpose:** For recruiters/headhunters who want quick facts without the interactive experience
   - **Content:** Same data as librarian knowledge base, but in standard format

5. **Mobile Responsive**
   - **Desktop:** Full split-screen layout, library scene complex
   - **Mobile:** Simplified single-column layout, librarian as card, chat below
   - **Readability:** Text size and button sizes touch-friendly (min 44px)
   - **Performance:** Fast load, optimized images

6. **Brand Consistency**
   - **Color palette:** Same as main site (--teal, --navy, --sky, --sage, --cream, --gold)
   - **Typography:** Matching fonts and hierarchy
   - **Contact bar:** Same format as main site (phone, email, social links)
   - **JSON-LD + semantic HTML:** Same GEO/SEO layer as main site

---

## What's NOT Included (Phase 1 Out of Scope)

❌ **Voice features** — Text-only in Phase 1 (voice input/output deferred to Phase 2)
❌ **Bilingual support** — English only in Phase 1 (Spanish added in Phase 2)
❌ **Advanced animations** — Librarian states (sleeping/awake) only; no lip-sync or complex gestures
❌ **Lead qualification logic** — Basic conversation only; no sophisticated prospect identification (can enhance later)
❌ **Video background** — No animated background or environmental effects
❌ **Booking integration** — No direct calendar/scheduling (can link to main site's booking)
❌ **Analytics** — No visitor tracking or funnel analysis (post-MVP)
❌ **User accounts** — No login or personalization (not needed for MVP)

---

## Technical Stack

| Component | Technology |
|---|---|
| **Backend** | Mastra (TypeScript) + Next.js API routes |
| **Frontend** | Next.js App Router + React |
| **LLM Provider** | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| **Knowledge base** | Obsidian vault (imported as markdown files) |
| **Character Art** | 2D illustration (AI-generated or custom vector, high-quality) |
| **Styling** | CSS modules + global CSS (shared palette with main site) |
| **Deployment** | Docker (Node Alpine) + GHCR + GitHub Actions |
| **Hosting** | Hostinger VPS (same as main site) |
| **Domain routing** | Nginx Proxy Manager |
| **Node version** | v22.14.0 |

---

## File Structure

```
/root/ernestofgaia_resume/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              (hero + librarian UI)
│   │   ├── classic/
│   │   │   └── page.tsx          (traditional resume view)
│   │   ├── globals.css           (shared palette from main site)
│   │   └── api/librarian/route.ts (POST endpoint for chat)
│   ├── public/
│   │   ├── librarian.png         (character illustration)
│   │   ├── library-bg.png        (environment scene)
│   │   └── llms.txt              (GEO content)
│   └── Dockerfile
├── src/
│   └── mastra/
│       └── agents/
│           └── librarianAgent.ts (resume concierge logic)
├── .env.local                     (ANTHROPIC_API_KEY)
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

---

## Data Structure (Obsidian Source)

**Location:** `.claude/resume/` folder in vault

**Files:**
- `_resume-master.md` — Master summary (narrative format, fed to agent system prompt)
- `[year]-[company]-[title].md` — One file per role (structured with YAML front matter)
  - Format: `2024-acme-corp-ai-engineer.md`
  - Front matter: `company`, `title`, `start`, `end`, `skills`, `tags`
  - Body: Responsibilities, accomplishments, impact

**Agent access:** The librarian agent reads `_resume-master.md` as system prompt context. Specific queries can pull from individual role files.

---

## Deployment Path

Same as main site: **Local → GitHub → GHCR → VPS**

1. Create GitHub repo: `github.com/ErnestOfGaia/ernestofgaia-resume`
2. Push code → GitHub Actions builds Docker image
3. Image pushed to GHCR: `ghcr.io/ernestofgaia/ernestofgaia-resume:latest`
4. On VPS: `docker pull` and restart container
5. Nginx Proxy Manager routes `resume.ernestofgaia.xyz` → container port 3000

---

## Success Criteria (MVP Complete)

- ✅ Site loads at `https://resume.ernestofgaia.xyz`
- ✅ Librarian character displays correctly (desktop and mobile)
- ✅ Chat interface responds meaningfully to questions about work history
- ✅ Resume data accurately reflects Obsidian vault content
- ✅ "Classic view" link provides clean, printable resume
- ✅ Contact info matches main site (phone, email, social)
- ✅ JSON-LD + semantic HTML present (GEO/SEO layer)
- ✅ Mobile layout is responsive and usable
- ✅ No TypeScript errors in build
- ✅ GitHub Actions deploy completes without errors
- ✅ VPS container runs and serves site correctly

---

## Design Decisions (Question Time - Resolved April 7, 2026)

1. **Librarian Personality** ✅
   - **Decision:** B) Friendly & conversational (warm coach tone)
   - **Implementation:** Student-centered approach. Librarian asks clarifying questions (what do you need? how do you learn best? what resources/time do you have?) before providing information. Matches main site Marketer agent tone.
   - **Behavior:** Only "active" when visitor is engaged. Sleeps when idle (visitor away/in another tab).

2. **Character Design** ✅
   - **Decision:** B) Custom vector art via AI tools with strong prompts
   - **Specs:**
     - Androgynous, non-binary, casual professional appearance
     - Own personality (not Ernest's photorealistic twin)
     - Subtle animations: shifting posture, picking up tablet while helping
     - Proportional to desk/workspace (grounded, natural)
     - No hair movement, no major 3D effects
     - Vector style optimized for AI generation (Midjourney/DALL-E friendly)
   - **Budget:** One-time cost for creation/refinement; can use apps to generate graphics with good prompts
   - **Timeline:** Create in Week 2, finalize by Week 2 Day 5

3. **Library Scene Complexity** ✅
   - **Decision:** B) Moderate with specific spatial design
   - **Layout Specifications:**
     - **Home page:** Zoomed-back view of full library with "ERNEST OF GAIA LIBRARY" centered at top
     - **Sleeping state:** Zoomed-back librarian at desk with title area showing "dreaming states" (processing indicators like AI thinking/brainstorm/ruminating) + "click anywhere to wake up"
     - **Active state (split-screen):**
       - Left: Vertical navigation bar (not top nav)
       - Right: Larger resume data display pane
       - Form flow for visitor to request resume data type (historical, skills-based, passions, etc.)
       - Button for "traditional resume wiki view"
     - **Mobile:** Voice + text focused, minimal animation (wake-up action only)
   - **Implementation note:** Design elements reflect practical, not over-engineered philosophy

4. **Resume Data Privacy** ✅
   - **Decision:** A) All public
   - **Strategic Rationale:**
     - Local-first discovery strategy (business cards → online)
     - Intentionally crawlable by humans AND AI (not gatekeeping)
     - Portfolio site meant to build credibility
     - Any data an electrician or local artist would make public in the US
   - **Scope:** Traditional resume data (starting point) + expanded work history (seasonal tech projects from YouTube, etc.)
   - **Security:** Google Voice number used for phone visibility to mitigate spam

5. **Lead Qualification Logic** ✅
   - **Decision:** C) Explicit qualification with conversational approach
   - **Implementation:**
     - Librarian asks at least 1 follow-up question to understand visitor needs (student-centered discovery)
     - NOT recruiter-focused, NOT high-pressure
     - Goal: Conversational understanding → direct contact from interested person
     - **Action buttons in chat responses:**
       - Email
       - Calendar (book a session)
       - Phone
       - Text message
     - **Pre-populated quick-start buttons when chat opens:**
       - "learn to use ai tools"
       - "book a session"
       - "send a text"
   - **Philosophy:** Qualification through understanding, not sales funneling. Removes friction to contact.

6. **Integration with Main Site** ✅
   - **Decision:** C) Integrated backend (subdomain feature)
   - **Architecture:**
     - Resume site = subdomain feature (ernestofgaia.xyz/resume or subdomain)
     - Aesthetically different and unique ("office next door" vibe)
     - Shared backend infrastructure + authentication (same keys)
     - Main site contact area has button → resume site subdomain
     - **User journey:** Main site (learn about services) → Resume site (vet credentials) → Contact (natural next step)
   - **Implementation:** Simple backend sharing, no complex merged UI integration

---

## Notes for Build

- **Shared palette:** Import CSS variables from main site to ensure color/typography consistency
- **Agent system prompt:** Will be populated from `_resume-master.md` after Obsidian import (Week 2, Day 4)
- **Character art:** Plan 1-2 weeks for illustration (can use AI image generation to prototype, then refine)
- **Mobile simplification:** Desktop has full library scene; mobile shows simplified card-based layout
- **No voice in Phase 1:** Text-only. Voice cloning and bilingual support are Phase 2 features.

---

## Handoff to Week 3

By end of Week 2:
- Resume site scaffold deployed to VPS ✓
- Placeholder page live at `resume.ernestofgaia.xyz` ✓
- GitHub Actions pipeline set up ✓
- Obsidian resume data structure finalized ✓

Week 3 will focus on:
- Librarian character art finalized
- AI concierge agent wired to Claude API
- Resume data integrated into agent system prompt
- Full chat interface tested
- Mobile layout polished

---

## Phase 2+ Features (Future)

- 🔮 Voice input/output (text-to-speech + speech-to-text)
- 🔮 Bilingual support (English + Spanish)
- 🔮 Advanced animations (lip-sync, gestures, expressions)
- 🔮 Sophisticated lead qualification logic
- 🔮 Email/calendar integration
- 🔮 Analytics dashboard
- 🔮 A/B testing different librarian personalities
