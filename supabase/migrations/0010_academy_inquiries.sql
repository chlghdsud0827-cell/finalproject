-- DB 연결 5단계: 문의 게시판(1:1 답변형, 로그인 없이도 문의 가능).
-- 지원(2단계)・상담(3단계)과 같이 신청 시점 이름을 name에 함께 저장해, 관리자
-- 화면에서 계정 id 대신 바로 이름을 보여줄 수 있게 한다(로그인 회원도 동일).
create table academy.inquiries (
  id uuid primary key default gen_random_uuid(),
  -- 비회원 문의는 계정이 없어 null.
  user_id uuid references auth.users (id),
  name text not null,
  title text not null,
  content text not null,
  contact text,
  email text,
  created_at timestamptz not null default now(),
  -- 답변은 1건만 등록 가능(자유 댓글이 아닌 1:1 응답) — reply_content가 null이면
  -- 답변대기 상태.
  reply_content text,
  reply_admin_id uuid references auth.users (id),
  reply_created_at timestamptz
);

alter table academy.inquiries enable row level security;

-- 마이페이지(본인 문의 내역)・관리자(문의 관리) 둘 다 로그인 상태에서만 쓰는
-- 화면이라, 1・2・3단계와 동일하게 로그인 회원 전체 조회 허용으로 단순화한다.
create policy "inquiries_select_authenticated"
on academy.inquiries for select
to authenticated
using (true);

-- 로그인 회원은 본인 명의로, 비회원(anon)은 user_id를 null로 등록할 수 있다
-- (0007 callback_requests_insert_anyone과 같은 취지 — 로그인 없이 문의 가능).
create policy "inquiries_insert"
on academy.inquiries for insert
to anon, authenticated
with check (user_id is null or auth.uid() = user_id);

-- 답변 등록(관리자)은 이 데모에서 프론트엔드 화면 구분으로만 나누므로, 로그인한
-- 사용자는 모두 수정 가능하게 둔다(1・2・3단계와 동일한 단순화).
create policy "inquiries_update_authenticated"
on academy.inquiries for update
to authenticated
using (true)
with check (true);

grant usage on schema academy to anon, authenticated;
grant select, insert, update, delete on all tables in schema academy to anon, authenticated;
