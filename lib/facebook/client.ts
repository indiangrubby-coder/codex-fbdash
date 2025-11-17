import { db, AdAccount } from '../db/store';

type FBResp<T> = { data: T };
export type FBAccount = { id: string; name: string; account_status: string; currency: string; timezone_id: string; business?: { id: string } };
export type FBInsight = { spend: string; clicks: string; impressions: string; cpc: string };
export type FBCampaign = { id: string; name: string; status: 'ACTIVE' | 'PAUSED'; effective_status?: string };

const isSim = () => process.env.APP_ENV !== 'production';
const token = () => process.env.FACEBOOK_SYSTEM_USER_TOKEN;
const biz = () => process.env.FACEBOOK_BUSINESS_ID;

const fbFetch = async <T>(path: string, init?: RequestInit) => {
  const url = `https://graph.facebook.com/v20.0/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json', ...(init?.headers || {}) }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<FBResp<T>>;
};

export async function fetchAccounts(): Promise<FBAccount[]> {
  if (isSim()) return db.accounts.map(a => ({ id: a.id, name: a.name, account_status: a.status, currency: a.currency || 'USD', timezone_id: a.timezone || 'UTC', business: { id: a.business_manager_id || '' } }));
  if (!biz()) return [];
  const { data } = await fbFetch<FBAccount[]>(`${biz()}/client_ad_accounts?fields=id,name,account_status,currency,timezone_id,business`);
  data.forEach(a => db.upsertAccount({ id: a.id, name: a.name, business_manager_id: a.business?.id, status: String(a.account_status), currency: a.currency, timezone: a.timezone_id } as AdAccount));
  return data;
}

export async function fetchAccountDetails(id: string) {
  if (isSim()) return { spend_cap: '1000', balance: '500', account_status: 'ACTIVE', currency: 'USD' };
  const { data } = await fbFetch<{ spend_cap: string; balance: string; account_status: string; currency: string }>(`${id}?fields=account_status,spend_cap,currency,balance`);
  return data;
}

export async function fetchInsights(id: string): Promise<FBInsight> {
  if (isSim()) return { spend: (Math.random() * 300).toFixed(2), clicks: `${Math.floor(Math.random() * 150)}`, impressions: `${Math.floor(Math.random() * 4000)}`, cpc: (Math.random() * 2).toFixed(2) };
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await fbFetch<FBInsight[]>(`act_${id}/insights?time_range={'since':'${today}','until':'${today}'}&fields=spend,clicks,impressions,cpc`);
  return data[0];
}

export async function listCampaigns(id: string): Promise<FBCampaign[]> {
  if (isSim()) return (db.campaigns[id] || []).map(c => ({ ...c, effective_status: c.status }));
  const { data } = await fbFetch<FBCampaign[]>(`act_${id}/campaigns?fields=id,name,status,effective_status`);
  return data;
}

export async function updateCampaignStatus(adAccountId: string, id: string, status: 'ACTIVE' | 'PAUSED') {
  if (isSim()) return db.setCampaignStatus(adAccountId, id, status);
  await fbFetch<unknown>(`${id}`, { method: 'POST', body: JSON.stringify({ status }) });
  return { id, status };
}

export async function pauseAllCampaigns(adAccountId: string) {
  if (isSim()) return db.pauseAll(adAccountId);
  const active = (await listCampaigns(adAccountId)).filter(c => c.status === 'ACTIVE');
  await Promise.all(active.map(c => updateCampaignStatus(adAccountId, c.id, 'PAUSED')));
  return active.map(c => ({ ...c, status: 'PAUSED' as const }));
}

export const simMode = isSim;
