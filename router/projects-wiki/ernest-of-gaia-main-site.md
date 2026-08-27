---
tags:
  - agenticbrain
  - router
  - marketing
  - secretary
  - recruiter
  - projects
  - brief
topics:
  - project-brief
agenticbrain: true
agent-role: [router, marketing, secretary, recruiter]
last-tagged: 2026-04-15
---

# Ernest of Gaia — Main Coaching Site

> The digital front door for the Ernest of Gaia AI coaching brand.

## Overview
The primary public-facing website for Ernest of Gaia's AI coaching and consulting services. Built as an interactive experience with an embedded agent interface that routes visitors to the right service (coaching inquiry, scheduling, or hiring).

## Status
**Live in production.** The chat agents are wired to real LLM calls, and the coaching content is published under `/begin-learning`.

## Goals
- Launch a fully functional, mobile-responsive coaching site
- Integrate three sub-agents: Marketer (coaching inquiries), Secretary (scheduling), Recruiter (hiring)
- Implement GEO/SEO layer (`llms.txt`, JSON-LD, semantic HTML)
- Serve as live proof-of-work for coaching clientele
- Pass performance benchmarks: <2s load on mobile 4G

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Agents | Mastra framework + Claude API (Haiku model) |
| Hosting | Self-managed VPS |
| CI/CD | GitHub Actions → GHCR → VPS pull |
| Proxy/SSL | Nginx Proxy Manager + Let's Encrypt |

## Key Links

- **Live:** [ernestofgaia.xyz](https://ernestofgaia.xyz)
- **Coaching content:** [ernestofgaia.xyz/begin-learning](https://ernestofgaia.xyz/begin-learning)
