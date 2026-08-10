-- 과정 소개 페이지의 "정원 대비 확정 인원" 배지는 로그인하지 않은 방문자에게도
-- 보여야 하는데, 0003의 select 정책이 authenticated 전용이라 비로그인 상태에서는
-- 지원 데이터가 하나도 안 보여 정원 카운트가 항상 0으로 표시되는 문제가 있다.
-- 익명(anon) 조회용 정책을 추가한다(내용 자체가 민감정보는 아니므로 전체 공개).
create policy "applications_select_anon"
on academy.applications for select
to anon
using (true);
