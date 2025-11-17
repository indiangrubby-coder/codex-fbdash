import { NextResponse } from 'next/server';
import { listCampaigns } from '@/lib/facebook/client';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await listCampaigns(params.id);
  return NextResponse.json(data);
}
