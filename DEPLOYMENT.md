# Deployment Guide: Vercel + Render + Neon (100% Free Plan)

Complete guide to deploying the **LASTRADA** menu platform with:
- **Frontend**: [Vercel](https://vercel.com) (Static/SPA)
- **Backend API**: [Render](https://render.com) (Web Service)
- **Database**: [Neon](https://neon.tech) (Serverless PostgreSQL)

---

## Architecture

```
[ Neon Postgres ]
       ▲
       │ DATABASE_URL (SSL)
       ▼
[ Render Web Service ] (Node / Express API on https://<your-api>.onrender.com)
       ▲
       │ /api rewrites (avoids cross-domain cookie issues)
       ▼
[ Vercel Frontend ] (Vite React Client on https://<your-app>.vercel.app)
```

---

## Step 1: Set Up Neon Postgres (Database)

1. Sign up or log in at **[neon.tech](https://neon.tech)**.
2. Click **Create Project**:
   - **Name**: `lastrada-db`
   - **Postgres version**: `16` or `17` (default)
   - **Region**: Choose the closest region (e.g., `Europe (Frankfurt)` for Tunisia/Europe).
3. Under **Connection Details**, copy your connection string:
   ```text
   postgresql://<username>:<password>@<neon-host>.neon.tech/<database>?sslmode=require
   ```
4. Save this string — you will use it as `DATABASE_URL` in Step 2.

---

## Step 2: Deploy Backend to Render

1. Sign up or log in at **[render.com](https://render.com)**.
2. In dashboard, click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your repo (`lastrada`).
4. Configure service parameters:
   - **Name**: `lastrada-api` (or your choice)
   - **Region**: Match Neon's region if possible (e.g., `Frankfurt (EU Central)`).
   - **Branch**: `main`
   - **Root Directory**: `lastrada_tn`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     pnpm install && pnpm --filter @workspace/api-server run build
     ```
   - **Start Command**:
     ```bash
     node server/dist/index.mjs
     ```
   - **Instance Type**: **Free** ($0/month)

5. Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port Render routes traffic to (Render provides this automatically or uses 10000) |
   | `DATABASE_URL` | *(Paste your Neon connection string)* | Connection to Neon Postgres |
   | `SESSION_SECRET` | *(64+ random characters)* | Cookie session encryption key |
   | `ADMIN_EMAIL` | `admin@lastrada.tn` | Administrator login email |
   | `ADMIN_PASSWORD` | `Choose-A-Secure-Password-123!` | Administrator password |
   | `CLIENT_ORIGIN` | `https://your-app.vercel.app` | Allowed CORS origin (can update after Step 3) |

6. Click **Create Web Service**.
7. Once deployed, copy your Render URL:  
   `https://lastrada-api.onrender.com` (example).

---

## Step 3: Deploy Frontend to Vercel

1. Open `lastrada_tn/vercel.json` and replace `YOUR_RENDER_SERVICE_NAME` with your actual Render service hostname:
   ```json
   {
     "buildCommand": "pnpm --filter ./client run build",
     "outputDirectory": "client/dist/public",
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://lastrada-api.onrender.com/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
2. Commit and push changes to GitHub:
   ```bash
   git add vercel.json .env.example
   git commit -m "Configure Vercel and Render deployment"
   git push origin main
   ```
3. Sign up or log in at **[vercel.com](https://vercel.com)**.
4. Click **Add New…** → **Project** and import the `lastrada` repository.
5. In project setup:
   - **Root Directory**: Click *Edit* and select `lastrada_tn`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `pnpm --filter ./client run build` (or leave default detected by vercel.json)
   - **Output Directory**: `client/dist/public`
6. Under **Environment Variables**, add:
   | Key | Value | Description |
   |---|---|---|
   | `PORT` | `5173` | Build-time requirement for vite.config.ts |
   | `BASE_PATH` | `/` | Base router path |
   | `NODE_ENV` | `production` | Production build |
7. Click **Deploy**.
8. Once finished, Vercel gives you your live site URL (e.g., `https://lastrada-menu.vercel.app`).

---

## Step 4: Final Connection & Verification

1. Go back to Render Dashboard → `lastrada-api` → **Environment**.
2. Update `CLIENT_ORIGIN` with your real Vercel URL (e.g. `https://lastrada-menu.vercel.app`).
3. Render automatically redeploys in ~1 minute.
4. Open your Vercel URL:
   - Verify the menu loads.
   - Go to `/admin` and log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
   - Test adding/editing a product or category.

---

## Free Tier Notes & Limitations

- **Render Cold Starts**: Render's free tier sleeps after 15 minutes of inactivity. The first visit after sleeping may take 30–50 seconds to respond. Subsequent visits are instantaneous.
- **Neon Storage**: Neon free tier provides 0.5 GiB storage and 100 compute hours/month, which is more than enough for a QR menu.
- **Vercel Bandwidth**: Free Hobby plan gives 100 GB/month bandwidth.

