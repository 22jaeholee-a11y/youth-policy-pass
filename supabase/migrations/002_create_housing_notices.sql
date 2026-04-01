create table if not exists housing_notices (
  id uuid primary key default gen_random_uuid(),
  provider varchar not null,
  notice_id varchar not null,
  title varchar not null,
  notice_type varchar,
  notice_sub_type varchar,
  region_name varchar,
  region_code varchar,
  status varchar,
  detail_url varchar,
  raw_data jsonb,
  synced_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (provider, notice_id)
);

create index if not exists idx_housing_notices_region on housing_notices (region_code);
create index if not exists idx_housing_notices_provider on housing_notices (provider);
create index if not exists idx_housing_notices_status on housing_notices (status);

alter table housing_notices enable row level security;

create policy "공개 읽기" on housing_notices
  for select using (true);

create policy "서비스 전용 쓰기" on housing_notices
  for all using (auth.role() = 'service_role');
