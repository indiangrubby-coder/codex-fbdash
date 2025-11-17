'use client';
import useSWR from 'swr';
import AccountCard from './AccountCard';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardGrid() {
  const { data } = useSWR('/api/accounts', fetcher, { refreshInterval: 10000 });
  if (!data) return <div className="p-6">Loading...</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {data.map((a: any) => (
        <AccountCard key={a.id} account={a} />
      ))}
    </div>
  );
}
