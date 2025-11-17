import { NextResponse } from 'next/server';
import { setSession, validateUser } from '@/lib/auth/session';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!validateUser(username, password)) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  await setSession(username, res);
  return res;
}
