'use client';
import { useState } from 'react';
import CampaignPanel from './CampaignPanel';

const danger = ['DISABLED', 'UNSETTLED', 'PENDING_RISK_REVIEW'];

export default function AccountCard({ account }: { account: any }) {
  const m = account.metrics;
  const [copied, setCopied] = useState(false);
  const bg = danger.includes(account.status) ? 'bg-red-100 border-red-300' : 'bg-white';
  const copy = async () => {
    await navigator.clipboard.writeText(account.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={`border rounded-lg p-4 shadow-sm flex flex-col gap-3 ${bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{account.name}</h3>
          <p className="text-sm text-gray-500">{account.vendor?.name}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${account.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{account.status}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Metric label="Spend" value={`$${m?.spend ?? 0}`} />
        <Metric label="Spend Cap" value={`$${m?.spend_cap ?? 0}`} />
        <Metric label="CPC" value={`$${m?.cpc ?? 0}`} />
        <Metric label="Clicks" value={m?.clicks ?? 0} />
        <Metric label="Balance" value={`$${m?.balance ?? 0}`} />
        <Metric label="Last Updated" value={m?.fetched_at ? new Date(m.fetched_at).toLocaleTimeString() : '—'} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div>Account ID: {account.id}</div>
        <button onClick={copy} className="px-2 py-1 border rounded">{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <CampaignPanel adAccountId={account.id} />
    </div>
  );
}

const Metric = ({ label, value }: { label: string; value: any }) => (
  <div className="bg-gray-50 p-2 rounded">
    <div className="text-[11px] text-gray-500">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);
