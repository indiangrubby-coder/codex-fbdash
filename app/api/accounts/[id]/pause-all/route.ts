import { NextResponse } from 'next/server';
import { pauseAllCampaigns } from '@/lib/facebook/client';
import { db } from '@/lib/db/store';
import { getSession } from '@/lib/auth/session';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const paused = await pauseAllCampaigns(params.id);
  db.log({ performed_by: user.username, ad_account_id: params.id, target_type: 'campaign', target_id: '*', action: 'pause_all', payload: {} });
  return NextResponse.json(paused);
}
