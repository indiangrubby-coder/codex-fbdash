import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET() {
  const data = db.accounts.map(a => ({
    ...a,
    vendor: db.vendors.find(v => v.id === a.vendor_id),
    metrics: db.latestMetric(a.id)
  }));
  return NextResponse.json(data);
}
