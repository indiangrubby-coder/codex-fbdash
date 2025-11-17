# Facebook Ads Monitoring & Control Dashboard

Next.js + TypeScript dashboard for simulated or production Facebook Ads monitoring with Supabase schema and Vercel-friendly API routes.

## 🚀 Live Demo

Want to see the tool in action? Follow these quick steps:

### Quick Start (Simulation Mode)

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/indiangrubby-coder/codex-fbdash.git
   cd codex-fbdash
   npm install
   ```

2. **Create `.env.local` file:**
   ```bash
   echo "SESSION_SECRET=demo-secret-key-for-testing" > .env.local
   echo "APP_ENV=simulation" >> .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to the login page

5. **Login with demo credentials:**
   - **Username:** `snafu` or `sid`
   - **Password:** `random@123` or `random@1234` (respectively)

6. **Explore the dashboard:**
   - View simulated Facebook ad accounts with metrics
   - Toggle campaign statuses (Active/Paused)
   - Use "Pause All" to pause all campaigns in an account
   - See real-time updates in simulation mode

### What You'll See

![Login Page](https://github.com/user-attachments/assets/88d90cd3-5b2c-47ad-a813-ee7ea486ff54)

![Dashboard](https://github.com/user-attachments/assets/f98d633d-0019-4266-9168-b22578c2bc38)

The demo includes:
- **Multiple ad accounts** with different statuses (ACTIVE, PENDING_RISK_REVIEW)
- **Campaign management** with toggleable statuses
- **Metrics dashboard** showing spend, clicks, CPC, and account balance
- **Simulation mode** that generates realistic test data without requiring Facebook API access

### Demo Features

- ✅ No Facebook API credentials required (simulation mode)
- ✅ Pre-configured test accounts and campaigns
- ✅ Interactive campaign status controls
- ✅ Real-time UI updates
- ✅ Responsive design with Tailwind CSS

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

## Troubleshooting

### Build Issues

**Problem:** `Module not found: Can't resolve './globals.css'`
- **Solution:** Ensure the CSS import in `app/layout.tsx` points to `'../styles/globals.css'`

**Problem:** `npm run build` fails with TypeScript errors
- **Solution:** Run `npm install` again to ensure all dependencies are installed correctly

### Demo Access Issues

**Problem:** Invalid credentials error when logging in
- **Solution:** Use one of these credential pairs:
  - Username: `snafu`, Password: `random@123`
  - Username: `sid`, Password: `random@1234`

**Problem:** Redirected to login page after successful login
- **Solution:** Ensure `SESSION_SECRET` is set in your `.env.local` file

**Problem:** Dashboard shows no data
- **Solution:** The simulation mode generates data automatically. Try refreshing the page or checking browser console for errors.

### Development Server Issues

**Problem:** Port 3000 is already in use
- **Solution:** Stop other processes using port 3000, or use a different port: `npm run dev -- -p 3001`

**Problem:** Changes not reflecting in browser
- **Solution:** Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) or clear Next.js cache:
  ```bash
  rm -rf .next
  npm run dev
  ```

## Support

For issues or questions, please open an issue on the [GitHub repository](https://github.com/indiangrubby-coder/codex-fbdash/issues).
