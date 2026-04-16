---
tags:
  - agenticbrain
  - marketing
  - router
  - projects
topics:
  - service-offering
  - project-brief
agenticbrain: true
agent-role: [marketing, router]
last-tagged: 2026-04-15
---

# EOGbook Project Summary & Execution Guide

**Created:** 2026-04-15  
**Project:** EOGbook gitbook-style information architecture  
**Owner:** Ernest Of Gaia  
**Status:** Ready for Cowork execution  

---

## What is EOGbook?

A minimalist, gitbook-style navigation system for Ernest Of Gaia's website that:

- **Organizes 7 pages of service/coaching information** in a "book" metaphor (home directory + 7 main pages with drill-down details)
- **Fits within a red-box viewport** without scrolling (responsive to mobile, tablet, desktop)
- **Is fully GEO-compliant** — all content readable by search engines, agents, and LLMs
- **Uses clean, minimalist design** — no animations or visual clutter, just clear typography and hierarchy
- **Integrates seamlessly** with the existing ernestofgaiaxyz website

---

## The 7 Pages (+ Home Directory)

| Page | Purpose | Key Content | Drill-Downs |
|------|---------|-------------|-----------|
| **Home** | Directory of all services | 7 linked page tiles, hero tagline | — |
| **1. Who is Ernest** | Personal background + approach | Origin story, philosophy | 2 detail pages |
| **2. What I Do** | AI coaching methodology | Plain English, lifelong learning | 2 detail pages |
| **3. Services** | All 3 tiers + pricing | Tier 1, 2, 3 descriptions, plans table | 5 detail pages |
| **4. How It Works** | 5-step coaching journey | Steps 1–5, comparison table | 4 detail pages |
| **5. Nonprofit Giveback** | Community impact program | Program overview, mechanics | 2 detail pages |
| **6. Trust & FAQs** | Testimonials + objection handling | 3–5 client quotes, 8 FAQs | — |
| **7. Get Started** | CTA hub | Phone, email, form, reassurance copy | — |

---

## Three-Phase Execution

### PHASE 1: Cowork Task (Specification)
**What:** Cowork reads your website project, master copy, and live site  
**Output:** `EOGbook_Implementation_Spec.md` (3,000–4,000 words)  
**Contains:** Design tokens, content mapping, responsive rules, GEO compliance, implementation checklist  
**Time:** ~2 hours (Cowork with Claude Opus)

**Deliverables in `/outputs/`:**
1. `Cowork_EOGbook_Implementation_Spec_Prompt.md` — Full prompt for Cowork
2. `Cowork_Quick_Reference.md` — Quick guide to running the Cowork task
3. Information architecture diagram (visual flowchart)
4. Workflow integration diagram (showing all phases)

### PHASE 2: Claude Code Implementation
**What:** Claude Code reads the spec and implements the actual component  
**Input:** `EOGbook_Implementation_Spec.md` (from Cowork)  
**Output:** Fully functional `/eogbook` route on staging website  
**Contains:** 
- React/Vue component structure with routing
- All 7 pages + home + drill-down pages
- JSON-LD structured data on every page
- Responsive CSS (mobile-first)
- Navigation (back/forward/home)
- CTAs integrated (phone, email, forms)

**Time:** ~6–8 hours (Claude Code implementation + testing)

### PHASE 3: Live Integration & GEO
**What:** Deploy EOGbook to production and optimize for discoverability  
**Actions:**
- Add eogbook routes to sitemap.xml
- Update robots.txt to allow `/eogbook/*` crawling
- Add OpenGraph tags for sharing
- Test with LLM providers (Claude, ChatGPT, Perplexity scan)
- Monitor Core Web Vitals

**Time:** ~2 hours (deployment + testing)

---

## Key Design Principles

### Minimalist & Responsive
- No scrolling per page (content fits viewport)
- Typography-first design (hierarchy does the work)
- Mobile-first responsive approach
- Dynamic sizing based on device (mobile < 640px, tablet 640–1024px, desktop > 1024px)

### GEO-Compliant
- Clear H1 → H2 → H3 heading hierarchy
- JSON-LD structured data (LocalBusiness, Service, FAQPage schemas)
- Descriptive link text (no "click here")
- Semantic HTML (`<strong>`, `<em>`, `<table>` for data)
- `/eogbook.json` endpoint for agents (optional but recommended)

### Editable & Maintainable
- Content lives in master copy (single source of truth)
- Component-based structure (easy to update individual pages)
- Clear routing patterns (consistent URLs)
- No hard-coded styling (uses design system tokens)

---

## Navigation Model

**Structure:**
```
/eogbook (home/directory)
├── /eogbook/who-is-ernest
│   ├── /eogbook/who-is-ernest/origin-story
│   └── /eogbook/who-is-ernest/approach
├── /eogbook/what-i-do
│   ├── /eogbook/what-i-do/plain-english
│   └── /eogbook/what-i-do/lifelong-learning
├── /eogbook/services
│   ├── /eogbook/services/tier-1
│   ├── /eogbook/services/tier-2
│   ├── /eogbook/services/tier-3
│   └── /eogbook/services/plans
├── /eogbook/how-it-works
│   ├── /eogbook/how-it-works/steps-1-2
│   ├── /eogbook/how-it-works/step-3
│   ├── /eogbook/how-it-works/steps-4-5
│   └── /eogbook/how-it-works/why-different
├── /eogbook/giveback
│   ├── /eogbook/giveback/overview
│   └── /eogbook/giveback/how-it-works
├── /eogbook/trust-faqs
└── /eogbook/get-started
```

**Navigation Buttons on Every Page:**
- ← Back (to parent page or home)
- → Forward (to next page or next section)
- 🏠 Home (to /eogbook directory)
- Breadcrumb trail (Home > Page > Detail)

---

## Content Mapping (Master Copy → Pages)

| Master Copy Section | Maps to | Word Count Target |
|---|---|---|
| Hero section | Home / Directory | 100–150 |
| "Who is Ernest" origin | Page 1 + drill-down | 200–300 total |
| "What I Do" approach | Page 2 + drill-down | 200–300 total |
| Service tiers (3) | Page 3 + 3 drill-downs | 800–1000 total |
| Plans table | Page 3 drill-down | 100–150 |
| How It Works (5 steps) | Page 4 + 4 drill-downs | 500–700 total |
| Comparison table | Page 4 drill-down | 150–200 |
| Nonprofit giveback | Page 5 + drill-down | 300–400 total |
| FAQs (8) | Page 6 | 400–600 |
| Testimonials (3–5) | Page 6 | 300–500 |
| Contact CTAs | Page 7 | 100–150 |

**Total estimated content:** 3,500–4,500 words across all pages

---

## GEO Requirements

### JSON-LD Examples

**All pages include:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ernest Of Gaia",
  "telephone": "503-664-0546",
  "email": "eog@ernestofgaia.xyz",
  "url": "https://ernestofgaia.xyz",
  "areaServed": "Oregon"
}
```

**Service pages include:**
```json
{
  "@type": "Service",
  "name": "Tier 1: Foundations",
  "provider": { "@type": "LocalBusiness", "name": "Ernest Of Gaia" },
  "price": "75",
  "priceCurrency": "USD",
  "duration": "PT1H",
  "description": "..."
}
```

**FAQ page includes:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "I've never used AI before. Will I be lost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### Sitemap & Robots
- All eogbook routes in `sitemap.xml` with `<priority>0.7</priority>` and `<lastmod>YYYY-MM-DD</lastmod>`
- `robots.txt` allows `GET /eogbook/*`
- `<link rel="canonical">` on each page (prevent duplicates)

### Optional: `/eogbook.json` Endpoint
```json
{
  "name": "Ernest Of Gaia Coaching",
  "url": "https://ernestofgaia.xyz/eogbook",
  "description": "AI coaching services and information",
  "services": [
    {
      "name": "Tier 1: Foundations",
      "price": 75,
      "duration": "60 minutes",
      "description": "..."
    }
  ],
  "journey": [
    { "step": 1, "title": "Free Handshake Call", "description": "..." }
  ],
  "faqs": [...]
}
```

---

## Responsive Design Targets

### Mobile (< 640px)
- Single column layout
- Full-width buttons (not inline)
- Larger tap targets (44px minimum height)
- No sidebars or multi-column grids
- Generous spacing between sections

### Tablet (640px–1024px)
- 2-column grids where appropriate (services, tiers)
- Wider content areas with balanced margins
- Buttons can be inline if space permits
- Sidebar navigation optional (breadcrumb primary)

### Desktop (> 1024px)
- Full 3-tier tier comparison possible (side-by-side)
- Whitespace and breathing room
- Larger typography for better readability
- Optional hero images or visual elements (keep minimal)

---

## Files You Now Have

### In `/outputs/` (ready to download):
1. **Cowork_EOGbook_Implementation_Spec_Prompt.md** — Full detailed prompt for Cowork execution
2. **Cowork_Quick_Reference.md** — Quick guide (file locations, extraction points, output format)
3. **Information architecture diagram** (SVG visual — 7 pages + home, with drill-downs)
4. **Workflow integration diagram** (SVG visual — 3 phases from Cowork → Code → Live)
5. **This summary document** (EOGbook_Project_Summary.md)

### To Create in Cowork (after running the task):
6. **EOGbook_Implementation_Spec.md** → Save to `C:\Users\Owner\.claude\Ideas & Projects\Spring Sprint\`

---

## Next Steps

### 1. Run the Cowork Task (Today or Tomorrow)
```
1. Open Cowork
2. Copy the prompt from Cowork_EOGbook_Implementation_Spec_Prompt.md
3. Paste into Cowork task
4. Let it run (2 hours)
5. Save the output to: C:\Users\Owner\.claude\Ideas & Projects\Spring Sprint\EOGbook_Implementation_Spec.md
```

### 2. Hand Off to Claude Code
```
1. Open Claude Code (or Claude Desktop with Code enabled)
2. Provide the full path: C:\Users\Owner\.claude\Ideas & Projects\Spring Sprint\EOGbook_Implementation_Spec.md
3. Use this prompt:

"You are implementing EOGbook, a minimalist gitbook-style information 
architecture for Ernest Of Gaia's website. 

Read the complete specification at:
C:\Users\Owner\.claude\Ideas & Projects\Spring Sprint\EOGbook_Implementation_Spec.md

Then implement it exactly as specified. Do not deviate. Prioritize:
(1) Spec compliance, (2) Design system consistency, (3) GEO compliance, (4) Performance.

Expected output: A fully working /eogbook route with all 7 pages + home, 
complete with JSON-LD, responsive design, and navigation."
```

### 3. Deploy & Test
```
1. Test on staging: <your-staging-url>/eogbook
2. Verify responsive design (mobile/tablet/desktop)
3. Run Lighthouse audit (target: 90+ on all metrics)
4. Test with LLM agents (copy eogbook URL and test with Perplexity, Claude, ChatGPT)
5. Merge to production
6. Update sitemap.xml, robots.txt
7. Monitor analytics for 1 week
```

---

## Success Criteria

✅ All 7 pages + home directory live at `/eogbook`  
✅ No page scrolling (content fits red-box viewport on all devices)  
✅ Mobile-first responsive design verified on real devices  
✅ All master copy content mapped to correct pages  
✅ JSON-LD structured data on every page  
✅ Sitemap.xml includes all eogbook routes  
✅ Heading hierarchy is clear (H1 → H2 → H3, no skips)  
✅ All CTAs are clickable and working (phone, email, forms)  
✅ Lighthouse score ≥ 90 on all metrics  
✅ Agents/LLMs can discover and parse all content  

---

## Timeline Estimate

| Phase | Task | Duration |
|-------|------|----------|
| **Phase 1** | Cowork specification | 2 hours |
| **Phase 2** | Claude Code implementation | 6–8 hours |
| **Phase 3** | Testing + live deployment | 2–3 hours |
| **Total** | EOGbook complete | 10–13 hours |

---

## Support & Questions

If Cowork or Claude Code encounters issues:
1. **Design token mismatch?** Check `tailwind.config.js` or CSS variable definitions in the website project
2. **Content doesn't fit?** Adjust word count targets in the spec (shorter is better)
3. **Routing conflict?** Verify existing site doesn't use `/eogbook` route
4. **GEO compliance unclear?** Reference the JSON-LD examples in the spec

---

**EOGbook is part of your Spring Sprint MVP push.**  
Once complete, you'll have a fully discoverable, agent-readable information architecture that 
positions Ernest Of Gaia's coaching services for both human visitors and AI agents.

Good luck! 🏔️
