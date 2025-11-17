export type Vendor = { id: string; name: string; contact_telegram?: string; business_manager_id?: string; created_at?: string };
export type AdAccount = { id: string; name: string; vendor_id?: string; business_manager_id?: string; status: string; currency?: string; timezone?: string; last_seen_at?: string; created_at?: string };
export type AccountMetric = { id: number; ad_account_id: string; date: string; spend: number; spend_cap: number; clicks: number; impressions: number; cpc: number; balance: number; status_at_fetch: string; fetched_at: string };
export type Campaign = { id: string; name: string; status: 'ACTIVE' | 'PAUSED'; effective_status?: string };
export type AccountAction = { id: number; performed_by: string; ad_account_id: string; target_type: string; target_id: string; action: string; payload: any; created_at: string };

let vendors: Vendor[] = [
  { id: 'vendor-1', name: 'Alpha Media', contact_telegram: '@alpha', business_manager_id: 'bm_1', created_at: new Date().toISOString() },
  { id: 'vendor-2', name: 'Beta Growth', contact_telegram: '@beta', business_manager_id: 'bm_2', created_at: new Date().toISOString() }
];
let accounts: AdAccount[] = [
  { id: '1001', name: 'Demo Ad Account', vendor_id: 'vendor-1', business_manager_id: 'bm_1', status: 'ACTIVE', currency: 'USD', timezone: 'America/Los_Angeles', last_seen_at: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: '1002', name: 'Prospecting', vendor_id: 'vendor-2', business_manager_id: 'bm_2', status: 'PENDING_RISK_REVIEW', currency: 'USD', timezone: 'America/New_York', last_seen_at: new Date().toISOString(), created_at: new Date().toISOString() }
];
let metrics: AccountMetric[] = [];
let actions: AccountAction[] = [];
const campaigns: Record<string, Campaign[]> = {
  '1001': [
    { id: 'c1', name: 'Awareness', status: 'ACTIVE' },
    { id: 'c2', name: 'Retargeting', status: 'PAUSED' }
  ],
  '1002': [
    { id: 'c3', name: 'Acquisition', status: 'ACTIVE' }
  ]
};

export const db = {
  get vendors() { return vendors; },
  get accounts() { return accounts; },
  get metrics() { return metrics; },
  get actions() { return actions; },
  get campaigns() { return campaigns; },
  upsertVendor(v: Vendor) {
    const i = vendors.findIndex(x => x.id === v.id);
    if (i >= 0) vendors[i] = { ...vendors[i], ...v };
    else vendors = [...vendors, v];
    return vendors.find(x => x.id === v.id)!;
  },
  upsertAccount(a: AdAccount) {
    const i = accounts.findIndex(x => x.id === a.id);
    if (i >= 0) accounts[i] = { ...accounts[i], ...a, last_seen_at: new Date().toISOString() };
    else accounts = [...accounts, { ...a, created_at: new Date().toISOString(), last_seen_at: new Date().toISOString() }];
    return accounts.find(x => x.id === a.id)!;
  },
  addMetric(m: Omit<AccountMetric, 'id'>) {
    const row = { ...m, id: metrics.length + 1 };
    metrics = [...metrics.filter(x => !(x.ad_account_id === m.ad_account_id && x.date === m.date)), row];
    return row;
  },
  latestMetric(id: string) {
    return metrics.filter(m => m.ad_account_id === id).sort((a, b) => b.id - a.id)[0];
  },
  log(a: Omit<AccountAction, 'id' | 'created_at'>) {
    const row: AccountAction = { ...a, id: actions.length + 1, created_at: new Date().toISOString() };
    actions = [...actions, row];
    return row;
  },
  setCampaigns(adAccountId: string, list: Campaign[]) {
    campaigns[adAccountId] = list;
    return campaigns[adAccountId];
  },
  setCampaignStatus(adAccountId: string, campaignId: string, status: 'ACTIVE' | 'PAUSED') {
    const list = campaigns[adAccountId] || [];
    campaigns[adAccountId] = list.map(c => (c.id === campaignId ? { ...c, status } : c));
    return campaigns[adAccountId].find(c => c.id === campaignId);
  },
  pauseAll(adAccountId: string) {
    campaigns[adAccountId] = (campaigns[adAccountId] || []).map(c => ({ ...c, status: 'PAUSED' }));
    return campaigns[adAccountId];
  }
};
