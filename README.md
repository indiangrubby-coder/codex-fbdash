# Facebook Ads Monitoring & Control Dashboard

Next.js + TypeScript dashboard for simulated or production Facebook Ads monitoring with Supabase schema and Vercel-friendly API routes.

## Installation
1. Install deps: `npm install`
2. Run dev server: `npm run dev`

## Environment Variables
Create `.env.local` with:
- `SESSION_SECRET` – signing key for session cookies (required)
- `APP_ENV` – `simulation` (default) or `production`
- `FACEBOOK_SYSTEM_USER_TOKEN` – required in production
- `FACEBOOK_BUSINESS_ID` – required in production

## Simulation Mode
- Set `APP_ENV=simulation` (or omit)
- Data is generated in-memory via `/api/sync` calling `lib/utils/sim.ts`
- Campaign toggles and pause-all mutate the in-memory store

## Production Mode
- Set `APP_ENV=production`
- Provide `FACEBOOK_SYSTEM_USER_TOKEN` and `FACEBOOK_BUSINESS_ID`
- Facebook requests live in `lib/facebook/client.ts` and use Graph API v20 endpoints:
  - `/{BUSINESS_ID}/client_ad_accounts` (discover)
  - `/ACT_<ID>/insights` for same-day metrics
  - `/act_<ID>/campaigns` list + `/<campaign_id>` status updates
- `/api/sync` upserts account metadata and metrics into the in-memory cache; wire to Supabase if desired

## Vercel Cron
Configure Vercel cron to call `/api/sync` every 5 minutes using a logged-in session cookie. All routes except `/login`, `/api/login`, `/api/logout` require auth.

## Deployment
- Push to Vercel with env vars set
- HTTPS required for secure cookies
- Run `npm run build` for verification before deploy

## Database
Supabase Postgres schema located at `supabase/schema.sql`.
