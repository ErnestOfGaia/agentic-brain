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
├── marketing/           # Marketer agent context: copy, pricing, client-facing docs
├── recruiter/           # Recruiter agent context: resume, work history
│   └── roles/           # One file per role (structured YAML + narrative)
├── router/              # Router agent context: the live site's own record
│   └── projects-wiki/   # High-level project status for each active site
└── secretary/           # Secretary agent context: booking and scheduling
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
| `project-brief` | Scope and status of a live, public-facing property |

---

## File Count by Agent

| Folder | Files |
|---|---|
| `business-dna/` | 2 |
| `marketing/` | 4 |
| `recruiter/` | 3 |
| `recruiter/roles/` | 5 |
| `router/` | 1 |
| `router/projects-wiki/` | 2 |
| `secretary/` | 1 |
| **Total** | **18** |

---

## What belongs in this repo

Every file here is embedded and retrieved by the public agents, and returned to real visitors as
prose. Retrieval hands the model *text*, not document semantics — a chunk can be served without its
heading, its date, or the sentence that qualified it. A label marking something as unwritten,
hypothetical or forthcoming is therefore **not** a scope guard.

So the test for any file is: **does every passage read as a true statement about the business today?**

Belongs here — the offer, published pricing, service areas, contact routes, FAQs, work history.

Does not belong here, regardless of how it is labelled:

- Planning scaffolding — placeholders, draft options, "to add" lists, sample or template copy
- Unpublished figures — internal pricing arithmetic, session-count economics, cost estimates
- Claims about clients, outcomes or timelines that have not happened yet
- Statistics without a source attached *in the same file* (a citation elsewhere never travels with the chunk)
- Internal runbooks, infrastructure detail, sprint status, and local filesystem paths
- Private third-party names, and pasted transcripts from other tools or assistants
- Audit trails and correction notices — including ones that quote what was removed

The last point is the one that bites: a note explaining a fabrication still contains the fabrication.
**An audit trail and a served corpus are two different places.** Corrections belong in the vault
ledger; `.github/` and `scripts/` are not ingested and hold repo-facing records.

`scripts/content-guard.mjs` enforces the machine-checkable slice of this in CI. It catches phrasings,
not intent — a clean run is a floor, not a certificate.

## Source

Files originate from Ernest's Obsidian vault and are exported here once tagged `agenticbrain: true`.
Tagged and curated: April 15, 2026. Last hardening sweep: 2026-08-26
(see `.github/CORPUS_HARDENING_AUDIT_2026-08-26.md`).  
Maintained by: Ernest Of Gaia + Claude.

---

## Usage

These files are intended to be:
1. Loaded as system prompt context for each agent type
2. Retrieved via RAG when a query matches a specific topic
3. Updated whenever the business DNA, pricing, or work history changes

When the Obsidian vault is updated, re-export tagged files here and push to keep agents current.
