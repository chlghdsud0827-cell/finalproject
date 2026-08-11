-- DB 연결 3단계: 비회원 상담(콜백 요청) — 로그인 없이 이름・연락처・문의 내용만
-- 받아 담당자가 전화로 연락하는 방식. 로그인 회원용 academy.consultations와는
-- 별개 기능이다(자동 매칭 없음, 관리자가 직접 담당 멘토 지정).
create table academy.callback_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  content text not null,
  requested_at timestamptz not null default now(),
  contacted boolean not null default false,
  mentor_id text
);

alter table academy.callback_requests enable row level security;

-- 로그인 여부와 무관하게 누구나 신청할 수 있다(비회원 기능이므로 anon 포함).
create policy "callback_requests_insert_anyone"
on academy.callback_requests for insert
to anon, authenticated
with check (true);

-- 조회・연락 처리・멘토 배정은 관리자(로그인 상태)만 사용하는 화면이다.
create policy "callback_requests_select_authenticated"
on academy.callback_requests for select
to authenticated
using (true);

create policy "callback_requests_update_authenticated"
on academy.callback_requests for update
to authenticated
using (true)
with check (true);
