'use client';
import { useRouter } from 'next/navigation';

export default function Navbar({ user }: { user?: string }) {
  const r = useRouter();
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    r.push('/login');
  };
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
      <div className="font-semibold">FB Ads Dashboard</div>
      <div className="flex items-center gap-4 text-sm">
        {user && <span className="text-gray-500">{user}</span>}
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-900 text-white">Logout</button>
      </div>
    </header>
  );
}
