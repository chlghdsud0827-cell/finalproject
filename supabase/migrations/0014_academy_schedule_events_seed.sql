-- src/data/schedule.js에서 courses.js 필드 기반으로 계산해두었던 일정을 그대로
-- DB로 이관한다(id는 자동 생성 — 다른 곳에서 문자열 id를 참조하지 않아 문제없음).
insert into academy.schedule_events (title, type, course_id, start_date, end_date) values
  ('UI/UX 디자인 실무 과정 1기 모집', 'recruiting', 'course-ui-ux', '2025-01-06', '2025-02-02'),
  ('UI/UX 디자인 실무 과정 1기 수업', 'course', 'course-ui-ux', '2025-02-10', '2025-06-29'),
  ('1기 수료식', 'event', 'course-ui-ux', '2025-06-29', '2025-06-29'),
  ('우수 국비교육기관 선정', 'event', 'course-ui-ux', '2025-07-15', '2025-07-15'),
  ('UI/UX 디자인 실무 과정 2기 모집', 'recruiting', 'course-ui-ux', '2025-08-04', '2025-08-31'),
  ('UI/UX 디자인 실무 과정 2기 수업', 'course', 'course-ui-ux', '2025-09-08', '2026-01-25'),
  ('2기 수료식', 'event', 'course-ui-ux', '2026-01-25', '2026-01-25'),
  ('UI/UX 디자인 실무 과정 3기 모집', 'recruiting', 'course-ui-ux', '2026-02-04', '2026-03-03'),
  ('UI/UX 디자인 실무 과정 3기 수업', 'course', 'course-ui-ux', '2026-03-11', '2026-07-28'),
  ('UI/UX 디자인 실무 과정 4기 모집', 'recruiting', 'course-ui-ux', '2026-07-15', '2026-08-18'),
  ('3기 수료식', 'event', 'course-ui-ux', '2026-07-28', '2026-07-28'),
  ('입학 설명회', 'event', 'course-ui-ux', '2026-08-12', '2026-08-12'),
  ('UI/UX 디자인 실무 과정 4기 발대식(OT)', 'event', 'course-ui-ux', '2026-08-24', '2026-08-24'),
  ('UI/UX 디자인 실무 과정 4기 수업', 'course', 'course-ui-ux', '2026-08-24', '2027-01-10'),
  ('UX 리서치 심화 과정 1기 수업', 'course', 'course-ux-research', '2026-07-06', '2026-09-25'),
  ('UX 리서치 심화 과정 2기 모집', 'recruiting', 'course-ux-research', '2026-09-28', '2026-10-19'),
  ('프로덕트 디자인 부트캠프 1기 수업', 'course', 'course-product-design', '2026-07-20', '2026-10-09'),
  ('프로덕트 디자인 부트캠프 2기 모집', 'recruiting', 'course-product-design', '2026-10-13', '2026-11-03'),
  ('디자인 시스템 마스터 과정 1기 수업', 'course', 'course-design-system', '2026-06-15', '2026-08-28'),
  ('디자인 시스템 마스터 과정 2기 모집', 'recruiting', 'course-design-system', '2026-09-01', '2026-09-30');
