-- 0003의 applications_insert_own 정책은 "auth.uid() = user_id"만 허용해서,
-- 계정 없는 더미 지원자(user_id가 null)를 등록할 방법이 없었다. RLS 정책은
-- 같은 command(INSERT)에 여러 개를 걸면 OR로 합쳐지므로, null 전용 정책을
-- 하나 더 추가한다(기존 정책은 그대로 둠).
create policy "applications_insert_dummy"
on academy.applications for insert
to authenticated
with check (user_id is null);
