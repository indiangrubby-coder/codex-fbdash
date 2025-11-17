'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CampaignPanel({ adAccountId }: { adAccountId: string }) {
  const { data, mutate } = useSWR(`/api/accounts/${adAccountId}/campaigns`, fetcher, { refreshInterval: 10000 });
  const [busy, setBusy] = useState(false);
  const toggle = async (id: string, status: 'ACTIVE' | 'PAUSED') => {
    setBusy(true);
    await fetch(`/api/campaigns/${id}/set-status`, { method: 'POST', body: JSON.stringify({ adAccountId, status }), headers: { 'Content-Type': 'application/json' } });
    await mutate();
    setBusy(false);
  };
  const pauseAll = async () => {
    setBusy(true);
    await fetch(`/api/accounts/${adAccountId}/pause-all`, { method: 'POST' });
    await mutate();
    setBusy(false);
  };
  return (
    <div className="border-t pt-3 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Campaigns</h4>
        <button disabled={busy} onClick={pauseAll} className="px-2 py-1 border rounded text-xs">Pause All</button>
      </div>
      <div className="space-y-2">
        {(data || []).map((c: any) => (
          <div key={c.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <div>
              <div className="font-semibold text-xs">{c.name}</div>
              <div className="text-[11px] text-gray-500">{c.id}</div>
            </div>
            <button disabled={busy} onClick={() => toggle(c.id, c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')} className={`px-2 py-1 text-xs rounded ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {c.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
