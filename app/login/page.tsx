'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const r = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }), headers: { 'Content-Type': 'application/json' } });
    if (res.ok) r.push('/dashboard');
    else setErr('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <form onSubmit={submit} className="bg-white text-gray-900 p-8 rounded shadow w-96 space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input className="w-full border rounded px-3 py-2" value={u} onChange={e => setU(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={p} onChange={e => setP(e.target.value)} required />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Login</button>
      </form>
    </div>
  );
}
