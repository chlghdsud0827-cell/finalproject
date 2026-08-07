-- DB 연결 1단계: 계정(회원가입/로그인).
-- 이 프로젝트는 다른 앱과 Supabase 프로젝트를 함께 쓰기 때문에, 기본 public
-- 스키마 대신 전용 스키마(academy)를 만들어 테이블을 완전히 분리한다.
create schema if not exists academy;

-- 로그인/비밀번호 자체는 Supabase Auth(auth.users)가 담당한다(비밀번호 해싱 등
-- 보안 처리 전부 자동). 이 테이블은 회원가입 시 추가로 받는 정보만 보관한다.
create table academy.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  role text not null default 'user' check (role in ('user', 'mentor', 'admin')),
  -- 멘토 역할일 때만 값이 있고, data/mentors.js의 멘토 id(예: 'mentor-1')와 연결된다.
  mentor_id text,
  birth_date date,
  gender text,
  phone text,
  zonecode text,
  address text,
  address_detail text,
  created_at timestamptz not null default now()
);

alter table academy.profiles enable row level security;

-- 로그인한 회원은 전체 프로필을 조회할 수 있다 — 관리자 화면에서 지원자·멘토
-- 이름을 표시해야 하고, 이 프로젝트는 민감정보를 다루는 서비스가 아니라 학습용
-- 데모라 단순하게 허용한다(운영 서비스로 전환 시 관리자 전용으로 좁힐 것).
create policy "profiles_select_authenticated"
on academy.profiles for select
to authenticated
using (true);

-- 회원가입 직후, 본인 계정 프로필만 새로 만들 수 있다.
create policy "profiles_insert_own"
on academy.profiles for insert
to authenticated
with check (auth.uid() = id);

-- 본인 프로필만 수정할 수 있다.
create policy "profiles_update_own"
on academy.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
