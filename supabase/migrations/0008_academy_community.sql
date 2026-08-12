-- DB 연결 4단계: 커뮤니티 게시판(로그인 회원 누구나 자유롭게 글・댓글을 쓰는
-- 다대다 게시판). 문의 게시판(1:1 답변형)과 달리 여러 회원이 서로의 글에
-- 댓글을 남길 수 있어, 댓글을 posts의 하위 JSONB가 아니라 별도 테이블로 둔다.
create table academy.community_posts (
  id uuid primary key default gen_random_uuid(),
  -- 계정 없는 시드 글은 null(0003 applications.user_id와 동일한 더미 패턴).
  author_id uuid references auth.users (id),
  author_name text not null,
  category text not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table academy.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references academy.community_posts (id) on delete cascade,
  author_id uuid references auth.users (id),
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table academy.community_posts enable row level security;
alter table academy.community_comments enable row level security;

-- 커뮤니티는 로그인 없이도 전체 글을 볼 수 있는 게시판이다(Community.jsx 라우트가
-- RequireAuth로 감싸여 있지 않음) — 다른 테이블(select_authenticated)과 달리
-- select 정책에 anon도 포함해야 한다.
create policy "community_posts_select_all"
on academy.community_posts for select
to anon, authenticated
using (true);

create policy "community_comments_select_all"
on academy.community_comments for select
to anon, authenticated
using (true);

-- 글・댓글 작성은 로그인 회원만, 본인 명의로만 가능하다.
create policy "community_posts_insert_own"
on academy.community_posts for insert
to authenticated
with check (auth.uid() = author_id);

create policy "community_comments_insert_own"
on academy.community_comments for insert
to authenticated
with check (auth.uid() = author_id);

-- 계정 없는 시드 글・댓글을 등록할 수 있도록 null 전용 정책 추가
-- (0004 applications_insert_dummy와 동일한 패턴).
create policy "community_posts_insert_dummy"
on academy.community_posts for insert
to authenticated
with check (author_id is null);

create policy "community_comments_insert_dummy"
on academy.community_comments for insert
to authenticated
with check (author_id is null);

grant usage on schema academy to anon, authenticated;
grant select, insert, update, delete on all tables in schema academy to anon, authenticated;
