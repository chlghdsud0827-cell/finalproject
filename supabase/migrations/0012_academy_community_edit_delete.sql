-- 커뮤니티 글・댓글에 수정・삭제 기능 추가 — 본인 글/댓글이거나 관리자면 가능.
-- 0004의 "같은 command에 정책을 여러 개 걸면 OR로 합쳐진다"는 원리를 그대로 써서,
-- "본인 소유" 정책과 "관리자" 정책을 따로 추가한다(하나라도 만족하면 허용).

create policy "community_posts_update_own"
on academy.community_posts for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "community_posts_delete_own"
on academy.community_posts for delete
to authenticated
using (auth.uid() = author_id);

create policy "community_comments_update_own"
on academy.community_comments for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "community_comments_delete_own"
on academy.community_comments for delete
to authenticated
using (auth.uid() = author_id);

-- 관리자는 다른 사람의 글・댓글도 수정・삭제할 수 있다(운영 목적).
create policy "community_posts_update_admin"
on academy.community_posts for update
to authenticated
using (exists (select 1 from academy.profiles where id = auth.uid() and role = 'admin'))
with check (true);

create policy "community_posts_delete_admin"
on academy.community_posts for delete
to authenticated
using (exists (select 1 from academy.profiles where id = auth.uid() and role = 'admin'));

create policy "community_comments_update_admin"
on academy.community_comments for update
to authenticated
using (exists (select 1 from academy.profiles where id = auth.uid() and role = 'admin'))
with check (true);

create policy "community_comments_delete_admin"
on academy.community_comments for delete
to authenticated
using (exists (select 1 from academy.profiles where id = auth.uid() and role = 'admin'));
