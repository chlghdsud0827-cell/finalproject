-- academy 스키마는 새로 만든 스키마라, public 스키마와 달리 anon/authenticated
-- 역할에 기본 접근 권한이 전혀 없다. RLS 정책은 "어떤 행을 볼 수 있는지"만
-- 걸러줄 뿐, 그 전에 스키마/테이블 자체에 대한 GRANT가 먼저 있어야 한다.
grant usage on schema academy to anon, authenticated;

grant select, insert, update, delete on all tables in schema academy
  to anon, authenticated;

-- 앞으로 academy 스키마에 새 테이블을 추가해도(2단계: 지원, 3단계: 상담 등)
-- 매번 GRANT를 반복하지 않도록 기본 권한을 미리 설정해둔다.
alter default privileges in schema academy
  grant select, insert, update, delete on tables to anon, authenticated;
