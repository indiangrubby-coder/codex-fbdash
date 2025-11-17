import { NextResponse } from 'next/server';
import { updateCampaignStatus } from '@/lib/facebook/client';
import { db } from '@/lib/db/store';
import { getSession } from '@/lib/auth/session';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { adAccountId, status } = await req.json();
  const updated = await updateCampaignStatus(adAccountId, params.id, status);
  db.log({ performed_by: user.username, ad_account_id: adAccountId, target_type: 'campaign', target_id: params.id, action: 'set_status', payload: { status } });
  return NextResponse.json(updated);
}
