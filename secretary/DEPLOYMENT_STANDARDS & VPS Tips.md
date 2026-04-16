---
tags:
  - agenticbrain
  - secretary
  - a-priori
  - guide
  - deployment
topics:
  - infrastructure
  - workflow-guide
agenticbrain: true
agent-role: [secretary]
last-tagged: 2026-04-15
---

# Website Deployment Standards — Ernest of Gaia Projects (2026)

All website projects this year are deployed as Dockerized static sites on the VPS below.
These standards apply to **ernestofgaia.xyz** and all future projects.

Ernest Latest Comment
*need to add this where it makes sense, this has been resolving most of our bad gateway issues.* 
*"In Nginx Proxy Manager, we used the container hostname because the app is running on the shared Docker network, so NPM can resolve the service directly by name. That keeps traffic internal to Docker instead of routing through the VPS IP, which is cleaner and more reliable for container-to-container communication.*

*If this is a pattern you want to keep, it’s a good idea to make the **service name in the compose file** match the name you want to use in NPM, and to document the app’s internal port there too. That way the proxy target is predictable for future deployments and you won’t need to verify the container name each time."*

---

## VPS Specs (Hostinger)

| Property   | Value                        |
|------------|------------------------------|
| OS         | Ubuntu 24.04                 |
| CPU        | 2 vCPU                       |
| RAM        | 8 GB                         |
| Disk       | 100 GB                       |
| Site       | ernestofgaia.xyz             |
| GitHub     | https://github.com/ErnestOfGaia/ernestofgaia-website |

---

## Static Site Standard (Beginner-Friendly, Preferred)

For React/Vite/Vue SPAs — build locally, serve with `nginx:alpine`. No Node in production.

### Folder structure

```
project/
├── site/              ← built static files (contents of dist/, NOT dist/ itself)
│   └── index.html
├── docker-compose.yml
├── nginx.conf
├── Dockerfile         ← optional multi-stage build alternative
└── README.md
```

### docker-compose.yml

```yaml
services:
  web:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./site:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

### nginx.conf (SPA + health check)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    # Cache hashed static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

---

## Dockerfile (Multi-Stage Build Alternative)

Use when you want `docker compose up -d` to build everything inside the container
(good for CI/CD; not required for the beginner-friendly workflow above).

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

When using the multi-stage Dockerfile, replace `image: nginx:alpine` in docker-compose.yml with:

```yaml
build:
  context: .
  dockerfile: Dockerfile
```

---

## Runtime Requirements

- App listens on `0.0.0.0` inside the container (nginx default ✅)
- Internal port `80`, mapped to `8080` on the host
- Health check: `GET /health` → HTTP 200
- No hardcoded secrets; all config via environment variables
- Restart policy: `unless-stopped`
- If persistence is needed (uploads, sqlite): use named Docker volumes
- Supports reverse proxy headers: `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`
- TLS terminated at the proxy (Nginx/Traefik); app stays HTTP internally

---

## Build & Deploy Workflow (Beginner-Friendly)

```bash
# 1. On your local machine — build the project
npm install
npm run build

# 2. Sync dist → site/  (flatten dist contents into site/)
rsync -av --delete dist/ site/

# 3. Deploy to VPS
scp -r site/ docker-compose.yml nginx.conf user@<VPS-IP>:~/ernestofgaia/

# 4. SSH in and start
ssh user@<VPS-IP>
cd ernestofgaia
docker compose up -d

# Site is live at http://<VPS-IP>:8080
# Health check: curl http://<VPS-IP>:8080/health
```

---

## Domain & TLS (Nginx reverse proxy on VPS)

The container runs on port 8080. The host Nginx proxies `ernestofgaia.xyz → localhost:8080`
and handles TLS via Certbot/Let's Encrypt. App stays HTTP internally.

```nginx
# /etc/nginx/sites-available/ernestofgaia (on VPS host, not in container)
server {
    listen 443 ssl;
    server_name ernestofgaia.xyz www.ernestofgaia.xyz;

    ssl_certificate /etc/letsencrypt/live/ernestofgaia.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ernestofgaia.xyz/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name ernestofgaia.xyz www.ernestofgaia.xyz;
    return 301 https://$host$request_uri;
}
```

---

## Build Target

- Linux container images, **amd64** architecture
- Prefer multi-stage builds for small production images
- For static sites, serve `/dist` (or `site/`) with `nginx:alpine`
- No OS-specific dependencies

-------------------
## Port Rules

|Rule|Detail|
|---|---|
|Ports 80 / 443|NPM only — never map these to app containers|
|Internal container ports|Defined in Dockerfile (e.g. `EXPOSE 80`), not exposed to host|
|No `ports:` in compose|Unless the service is NPM itself|

---

## Hostnames

- Domains managed through Nginx Proxy Manager
- SSL certificates issued via Let's Encrypt inside NPM
- Container names act as internal hostnames on the `nginx-proxy` network
- Use descriptive container names that match the project (e.g. `ernestofgaia-mvp`)

---
# VPS Terminal Session Tips

## Hostinger VPS – Session Stability

- Hostinger VPS terminal sessions can drop/freeze intermittently
- Switching from Brave browser to Chrome significantly improved token session stability
- If terminal freezes: close and reopen in Chrome, re-SSH in, verify last command with a check command before continuing
- Always verify Node/git state after reconnecting with:

  ```bash
  node --version && pwd && git status
  ```

-----------------------------

## Related Notes

- [[Deployment Checklist]]
- [[Spring Sprint 2026]]