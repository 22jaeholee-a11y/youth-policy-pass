create table if not exists policies (
  id uuid primary key default gen_random_uuid(),
  plcy_no varchar not null unique,
  title varchar not null,
  category varchar,
  sub_category varchar,
  min_age integer,
  max_age integer,
  age_unlimited boolean default false,
  region_code varchar,
  earn_type varchar,
  earn_max varchar,
  job_code varchar,
  description text,
  benefit_detail text,
  apply_url varchar,
  apply_method text,
  apply_period varchar,
  apply_period_type varchar,
  biz_start_date varchar,
  biz_end_date varchar,
  org_name varchar,
  view_count integer default 0,
  raw_data jsonb,
  synced_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_policies_category on policies (category);
create index if not exists idx_policies_age on policies (min_age, max_age);
create index if not exists idx_policies_region on policies (region_code);
create index if not exists idx_policies_job on policies (job_code);

alter table policies enable row level security;

create policy "공개 읽기" on policies
  for select using (true);

create policy "서비스 전용 쓰기" on policies
  for all using (auth.role() = 'service_role');
