-- DB 연결 2단계: 지원(Application).
create table academy.applications (
  id uuid primary key default gen_random_uuid(),
  -- 실제 로그인 계정의 지원만 연결. 정원을 채우는 더미 지원자는 계정이 없어 null.
  user_id uuid references auth.users (id),
  -- user_id가 없는 더미 지원자를 표시할 이름(실제 계정이 있으면 profiles.name을 쓰므로 비워도 됨).
  name text,
  course_id text not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'waiting', 'rejected', 'cancelled')),
  applied_at timestamptz not null default now()
);

alter table academy.applications enable row level security;

-- 로그인한 회원은 전체 지원 내역을 조회할 수 있다(정원 대비 확정 인원 계산,
-- 관리자 "지원자 관리" 화면에 필요 — 1단계 profiles와 동일한 단순화된 정책).
create policy "applications_select_authenticated"
on academy.applications for select
to authenticated
using (true);

-- 본인 명의로만 새 지원을 만들 수 있다.
create policy "applications_insert_own"
on academy.applications for insert
to authenticated
with check (auth.uid() = user_id);

-- 상태 변경(관리자의 합격/불합격 처리, 본인의 지원 취소)을 이 데모에서는
-- 프론트엔드 화면 구분으로만 나누므로, 로그인한 사용자는 모두 수정 가능하게 둔다.
create policy "applications_update_authenticated"
on academy.applications for update
to authenticated
using (true)
with check (true);

-- academy 스키마 기본 권한(0002에서 이미 실행했지만, 새 테이블에도 확실히 적용되도록 재실행).
grant usage on schema academy to anon, authenticated;
grant select, insert, update, delete on all tables in schema academy to anon, authenticated;
