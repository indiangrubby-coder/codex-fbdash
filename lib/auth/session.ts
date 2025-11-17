import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const users = [
  { username: 'snafu', password: 'random@123' },
  { username: 'sid', password: 'random@1234' }
];

const KEY = () => new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret');

export const validateUser = (u: string, p: string) => users.find(x => x.username === u && x.password === p);

export async function setSession(username: string, res: NextResponse) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(KEY());
  res.cookies.set('session', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
}

export async function clearSession(res: NextResponse) {
  res.cookies.set('session', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' });
}

export async function getSession() {
  const token = cookies().get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, KEY());
    return payload as { username: string };
  } catch {
    return null;
  }
}
