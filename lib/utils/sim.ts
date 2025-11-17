import { db } from '../db/store';

export function generateMetrics() {
  db.accounts.forEach(a => {
    const spend = +(Math.random() * 500).toFixed(2);
    const clicks = Math.floor(Math.random() * 200);
    const impressions = Math.floor(Math.random() * 5000);
    const cpc = clicks ? +(spend / clicks).toFixed(2) : 0;
    const spend_cap = 1000;
    const balance = +(spend_cap - spend).toFixed(2);
    db.addMetric({
      ad_account_id: a.id,
      date: new Date().toISOString().slice(0, 10),
      spend,
      spend_cap,
      clicks,
      impressions,
      cpc,
      balance,
      status_at_fetch: a.status,
      fetched_at: new Date().toISOString()
    });
  });
}
