-- DB 연결 6단계: 학원 일정(모집・수업・행사) — 관리자가 추가・수정・삭제하면
-- 새로고침해도 유지되도록 한다.
create table academy.schedule_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('recruiting', 'course', 'event')),
  course_id text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now()
);

alter table academy.schedule_events enable row level security;

-- /schedule 페이지는 로그인 없이 볼 수 있는 공개 페이지라 anon도 조회 가능.
create policy "schedule_events_select_all"
on academy.schedule_events for select
to anon, authenticated
using (true);

-- 실제로는 관리자만 쓰는 화면(/admin, RequireAuth role="admin")이지만, 이
-- 데모에서는 다른 관리 테이블과 동일하게 로그인 회원 전체 허용으로 단순화한다.
create policy "schedule_events_insert_authenticated"
on academy.schedule_events for insert
to authenticated
with check (true);

create policy "schedule_events_update_authenticated"
on academy.schedule_events for update
to authenticated
using (true)
with check (true);

create policy "schedule_events_delete_authenticated"
on academy.schedule_events for delete
to authenticated
using (true);

grant usage on schema academy to anon, authenticated;
grant select, insert, update, delete on all tables in schema academy to anon, authenticated;
