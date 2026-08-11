-- DB 연결 3단계: 정규 상담(로그인 회원, 멘토 자동/수동 매칭).
-- 비회원 상담(콜백 요청)은 별도 테이블(0007_academy_callback_requests.sql)로 분리한다.
create table academy.consultations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id),
  -- 신청 시점의 계정 이름을 그대로 저장한다(2단계 applications.name과 동일한 이유 —
  -- 관리자 화면에서 조회 시 계정 id 대신 바로 이름을 보여주기 위함).
  name text not null,
  -- 관리자가 수동 배정하기 전까지는 null. data/mentors.js의 멘토 id(예: 'mentor-1')를
  -- 그대로 저장하므로 별도 FK는 없다(멘토도 프로필의 mentor_id와 같은 방식).
  mentor_id text,
  category text not null,
  content text not null,
  status text not null default 'requested'
    check (status in ('requested', 'matched', 'in_progress', 'completed')),
  requested_at timestamptz not null default now()
);

alter table academy.consultations enable row level security;

-- 로그인한 회원은 전체 상담 내역을 조회할 수 있다(멘토 대시보드・관리자 화면에
-- 필요 — 1・2단계와 동일한 단순화된 정책).
create policy "consultations_select_authenticated"
on academy.consultations for select
to authenticated
using (true);

-- 본인 명의로만 새 상담을 신청할 수 있다.
create policy "consultations_insert_own"
on academy.consultations for insert
to authenticated
with check (auth.uid() = student_id);

-- 상태 변경(관리자 배정, 멘토 수락/완료/거절/직접 수정)은 이 데모에서 프론트엔드
-- 화면 구분으로만 나누므로, 로그인한 사용자는 모두 수정 가능하게 둔다.
create policy "consultations_update_authenticated"
on academy.consultations for update
to authenticated
using (true)
with check (true);
