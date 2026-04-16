# agentic-brain

Knowledge base for Ernest Of Gaia's AI agent system. These markdown files are the source-of-truth context injected into the multi-agent stack powering [ernestofgaia.xyz](https://ernestofgaia.xyz).

## Agent Architecture

```
Router Agent
├── Marketer Agent
├── Secretary Agent
└── Recruiter Agent
```

Each agent draws from its own folder of context files. Files tagged `agenticbrain: true` in their frontmatter are flagged for this repo.

---

## Folder Structure

```
agentic-brain/
├── business-dna/        # Core brand identity — all agents reference this
├── marketing/           # Marketer agent context: copy, pricing, market research
├── recruiter/           # Recruiter agent context: resume, work history
│   └── roles/           # One file per role (structured YAML + narrative)
├── router/              # Router agent context: site briefs, sprint specs
│   └── projects-wiki/   # High-level project status for each active site
└── secretary/           # Secretary agent context: infra, deployment standards
```

---

## Tag Schema (Obsidian Frontmatter)

Every file in this repo uses the following frontmatter pattern:

```yaml
---
tags:
  - agenticbrain
  - [agent-type]         # router | marketing | recruiter | secretary
topics:
  - [topic-tag]          # see list below
agenticbrain: true
agent-role: [router, marketing, recruiter, secretary]
last-tagged: YYYY-MM-DD
---
```

### Topic Tags

| Tag | Meaning |
|---|---|
| `business-dna` | Core identity, brand, mission, values |
| `service-offering` | What's sold, tiers, pricing |
| `brand-voice` | Tone, copy style, messaging |
| `workflow-guide` | SOPs, how-to, process docs |
| `work-history` | Ernest's professional background |
| `market-research` | Market data, feasibility, competitive analysis |
| `infrastructure` | VPS, Docker, CI/CD, deployment |
| `project-brief` | Specs and scope for active builds |

---

## File Count by Agent

| Folder | Files |
|---|---|
| `business-dna/` | 3 |
| `marketing/` | 6 |
| `recruiter/` | 4 |
| `recruiter/roles/` | 5 |
| `router/` | 4 |
| `router/projects-wiki/` | 3 |
| `secretary/` | 2 |
| **Total** | **27** |

---

## Source

All files originate from the Obsidian vault at `C:\Users\Owner\.claude\Ideas & Projects`.  
Tagged and curated: April 15, 2026.  
Maintained by: Ernest Of Gaia + Claude (Cowork mode).

---

## Usage

These files are intended to be:
1. Loaded as system prompt context for each agent type
2. Retrieved via RAG when a query matches a specific topic
3. Updated whenever the business DNA, pricing, or work history changes

When the Obsidian vault is updated, re-export tagged files here and push to keep agents current.
