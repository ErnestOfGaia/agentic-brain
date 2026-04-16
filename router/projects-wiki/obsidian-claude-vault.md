---
tags:
  - agenticbrain
  - router
  - projects
  - brief
topics:
  - project-brief
  - workflow-guide
agenticbrain: true
agent-role: [router]
last-tagged: 2026-04-15
---

# Obsidian + Claude Vault

> A dual-vault business brain connecting Obsidian knowledge management with Claude and Abacus AI.

## Overview
The Obsidian vault system is Ernest's central knowledge operating system — a dual-vault architecture that keeps business operations isolated in `.claude/` (Claude-exclusive access) and learning in `.abacus/MAI_Vault/` (Abacus CoWork access). The vault captures project context, task logs, deployment standards, and AI session outputs, making Claude a true long-term collaborator rather than a stateless assistant.

## Status
**Active** — Core structure built. Google Drive sync and MAI learning vault integration in progress.

## Goals
- Maintain a persistent, navigable business brain across all Claude sessions
- Keep business vault (`.claude/`) isolated from learning vault to prevent context bleed
- Sync vault to Google Drive for cross-device access and backup
- Store project briefs, deployment playbooks, session logs, and task templates in structured folders
- Progressively automate vault updates via Cowork tasks

## Vault Structure

| Vault | Tool Access | Purpose |
|-------|------------|---------|
| `.claude/` | Claude Desktop only | Business ops, client context, deployments |
| `.abacus/MAI_Vault/` | Abacus CoWork | Learning, CCA-F study, MAI Tech Teacher |

## Folder Organization (Business Vault)

```
Ideas & Projects/
├── A Priori/          ← Active planning, daily logs, standards
├── domains websites apps/  ← Per-site project docs
├── AI Coaching.../    ← Business model, pricing, market research
├── Marketing/         ← Content pipeline and tool briefs
├── Scout Protocol/    ← Protocol design docs
├── Spring Sprint/     ← Active sprint work
├── Cowork Tasks/      ← Reusable task templates
└── Projects Wiki/     ← This wiki (source for orchard.ernestofgaia.xyz)
```

## Tech Stack
- **Knowledge base:** Obsidian
- **Sync:** Google Drive Desktop
- **AI access:** Claude Desktop (business), Abacus CoWork (learning)
- **Task templates:** Markdown-based Cowork prompts

## Key Links
- No public URL — private local vault

## Next Steps
- Complete Google Drive Desktop sync setup
- Finalize MAI learning vault folder structure
- Create Cowork task for weekly vault review and cleanup
- Build index notes for each major project area
