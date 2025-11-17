create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact_telegram text,
  business_manager_id text,
  created_at timestamptz default now()
);

create table ad_accounts (
  id text primary key,
  name text,
  vendor_id uuid references vendors(id),
  business_manager_id text,
  status text,
  currency text,
  timezone text,
  last_seen_at timestamptz,
  created_at timestamptz default now()
);

create table account_metrics (
  id bigserial primary key,
  ad_account_id text references ad_accounts(id),
  date date,
  spend numeric,
  spend_cap numeric,
  clicks integer,
  impressions integer,
  cpc numeric,
  balance numeric,
  status_at_fetch text,
  fetched_at timestamptz default now()
);

create table account_actions (
  id bigserial primary key,
  performed_by text,
  ad_account_id text,
  target_type text,
  target_id text,
  action text,
  payload jsonb,
  created_at timestamptz default now()
);
