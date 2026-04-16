---
tags:
  - agenticbrain
  - secretary
  - projects
  - brief
topics:
  - infrastructure
  - workflow-guide
agenticbrain: true
agent-role: [secretary]
last-tagged: 2026-04-15
---

# Infrastructure & Deployment

> Docker + Nginx deployment standards for all Ernest of Gaia web properties on Hostinger VPS.

## Overview
The shared infrastructure layer supporting all Ernest of Gaia web projects. A Hostinger VPS running Ubuntu 24.04 serves as the single deployment target for all sites and apps, managed through Docker containers, GitHub Actions CI/CD, and Nginx Proxy Manager for SSL termination and routing. Standardized deployment playbooks are maintained as reusable Cowork tasks.

## Status
**Active** — Stable and in daily use. Port registry and deployment checklists maintained.

## Goals
- Maintain a consistent, reproducible deployment pipeline across all projects
- Enforce zero-downtime deploys via Docker image pull + container replacement
- Keep port registry up to date to prevent conflicts
- Document and automate common failure scenarios (TypeScript errors, port conflicts, Docker build failures)
- Support planned Windows 11 Pro upgrade for Hyper-V local testing

## Server Specs

| Spec | Value |
|------|-------|
| Host | Hostinger VPS |
| OS | Ubuntu 24.04 LTS |
| CPU | 2 vCPU |
| RAM | 8 GB |
| Proxy | Nginx Proxy Manager |
| SSL | Let's Encrypt (auto-renew) |

## Deployment Pipeline

```
Local dev → git push → GitHub Actions → Docker build → push to GHCR → VPS pull → container replace
```

## Deployed Sites (Port Registry)

| Domain | App |
|--------|-----|
| ernestofgaia.xyz | Main coaching site |
| mobile.ernestofgaia.xyz | Mobile subdomain |
| mvp.ernestofgaia.xyz | Deprecated MVP |
| pelican.ernestofgaia.xyz | Pellito agent app |
| resume.ernestofgaia.xyz | Resume site |
| orchard.ernestofgaia.xyz | Projects Wiki (planned) |

## Key Cowork Tasks
- `pre_deployment_cowork_task.md` — Full 7-phase pre-deployment checklist
- `LOCAL_TO_VPS_MIGRATION_TASK.md` — Repeatable migration playbook

## Next Steps
- Consider Windows 11 Pro upgrade ($99) for Hyper-V local container testing
- Add orchard.ernestofgaia.xyz to Nginx Proxy Manager
- Document current port assignments in VPS port registry
- Automate health checks post-deploy
