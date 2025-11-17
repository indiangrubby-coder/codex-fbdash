import { NextResponse } from 'next/server';
import { fetchAccounts, fetchAccountDetails, fetchInsights } from '@/lib/facebook/client';
import { db } from '@/lib/db/store';
import { generateMetrics } from '@/lib/utils/sim';

export async function GET() {
  return handle();
}

export async function POST() {
  return handle();
}

async function handle() {
  if (process.env.APP_ENV !== 'production') {
    generateMetrics();
    return NextResponse.json({ ok: true, mode: 'simulation' });
  }
  try {
    const accounts = await fetchAccounts();
    await Promise.all(accounts.map(async a => {
      db.upsertAccount({ id: a.id, name: a.name, currency: a.currency, timezone: a.timezone_id, status: a.account_status });
      const details = await fetchAccountDetails(a.id);
      const insights = await fetchInsights(a.id);
      const spend = +(insights?.spend || 0);
      const clicks = +(insights?.clicks || 0);
      const impressions = +(insights?.impressions || 0);
      const cpc = +(insights?.cpc || 0);
      db.addMetric({
        ad_account_id: a.id,
        date: new Date().toISOString().slice(0, 10),
        spend,
        spend_cap: +(details?.spend_cap || 0),
        clicks,
        impressions,
        cpc,
        balance: +(details?.balance || 0),
        status_at_fetch: details?.account_status || 'UNKNOWN',
        fetched_at: new Date().toISOString()
      });
    }));
    return NextResponse.json({ ok: true, mode: 'production' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'sync_failed' }, { status: 500 });
  }
}
