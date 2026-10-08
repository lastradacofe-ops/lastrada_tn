# ☕ Lastrada Coffee — Cloud Implementation & Deployment Guide

This document outlines the step-by-step procedure for initializing the GitHub repository, configuring cloud infrastructure services, and migrating the existing database to the new modern stack.

---

## 1. Git & GitHub Repository Setup

Since this workspace is already initialized with local git history, execute the following commands in PowerShell from the project root (`h:\lastrada`):

```powershell
# 1. Link the new GitHub remote repository
git remote add origin https://github.com/lastradacofe-ops/lastrada_tn.git

# (If remote 'origin' already exists, update it with):
# git remote set-url origin https://github.com/lastradacofe-ops/lastrada_tn.git

# 2. Stage all current project files
git add .

# 3. Commit the changes
git commit -m "feat: initialize lastrada coffee cloud platform"

# 4. Set branch to main and push
git branch -M main
git push -u origin main
```

---

## 2. Target Cloud Architecture Overview

```mermaid
flowchart TB
    subgraph Client ["Client Layer"]
        User["Customer / Staff Browsers"]
    end

    subgraph NetlifyEdge ["Netlify Global Edge CDN"]
        direction TB
        FrontendSPA["Static SPA Assets<br/>(React 19 + Tailwind CSS)"]
        EdgeProxy["Edge Reverse Proxy<br/>(/api/* rewrite)"]
    end

    subgraph RenderCloud ["Render.com Compute"]
        direction TB
        APIServer["Node.js Web Service<br/>(Express 5 REST API)"]
        KeepAlive["Timezone-Aware Self-Pinger<br/>(Keep Warm Service)"]
        EmailWorker["Transactional Email Queue Worker"]
    end

    subgraph AivenCloud ["Aiven Cloud Database"]
        AivenDB[("Managed PostgreSQL DB<br/>• TLS/SSL Enforced<br/>• Automated Backups")]
    end

    subgraph ExternalSaaS ["Managed Cloud SaaS"]
        ClerkAuth["Clerk Identity Cloud<br/>(RBAC & JWT Validation)"]
        SMTPService["Cloud SMTP Provider<br/>(Transactional Emails)"]
    end

    User -->|HTTPS| NetlifyEdge
    NetlifyEdge -->|Serve UI| User
    User -->|/api/* Requests| EdgeProxy
    EdgeProxy -->|Proxied API Calls| APIServer
    APIServer -->|Token Verification| ClerkAuth
    APIServer -->|Queries & Mutations (SSL)| AivenDB
    EmailWorker -->|Poll Queue| AivenDB
    EmailWorker -->|Dispatch Emails| SMTPService
    KeepAlive -.->|Health Check Ping| APIServer
```

---

## 3. Services Configuration Checklist

| Service | Component | Action Required |
| :--- | :--- | :--- |
| **GitHub** | Codebase & CI/CD | Push workspace code to `lastradacofe-ops/lastrada_tn` |
| **Aiven Cloud** | Managed PostgreSQL | Create PostgreSQL service, obtain SSL `DATABASE_URL` |
| **Render.com** | Backend REST API | Connect repo, deploy Web Service for `@workspace/api-server` |
| **Netlify** | Frontend SPA | Connect repo, build `@workspace/lastrada-menu`, configure redirects |
| **Clerk Cloud** | Identity & Auth | Create application, copy Publishable & Secret API keys |
| **Cloud SMTP** | Transactional Mail | Configure host, port, user, and password (e.g. Gmail / SendGrid / Resend) |

---

## 4. Environment Variables Reference

### Backend Web Service (`Render.com`)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgres://<user>:<password>@<aiven-host>:<aiven-port>/<dbname>?sslmode=require
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
RENDER_EXTERNAL_URL=https://<your-render-service-name>.onrender.com
PUBLIC_APP_URL=https://<your-netlify-app-name>.netlify.app
TRUST_PROXY_HOPS=1
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=no-reply@lastradacoffee.com
SMTP_PASS=your-smtp-app-password
```

### Frontend Single Page Application (`Netlify`)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
NODE_VERSION=20
```

---

## 5. Database Migration Workflow (From Live Site SQL)

1. **Provide SQL Export**: Export tables, rows, and schema from the current live site.
2. **Schema Definition**: Map all entities to type-safe Drizzle ORM models in [`lib/db/src/schema/`](file:///h:/lastrada/lib/db/src/schema/).
3. **Data Ingestion**: Run data migration scripts to seed categories, items, prices, options, orders, and user history directly into Aiven PostgreSQL.
4. **Validation**: Test queries, endpoints, and UI integration.
