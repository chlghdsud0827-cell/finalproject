export const DEFAULT_COURSE_ID = 'course-ui-ux'

// status: 'recruiting'(모집중, 실제 지원 가능) | 'in_progress'(현재 기수 진행 중, 종료 후 다음 기수 모집 예정)
// fundingType: 'national'이면 국비지원 대상 과정. 현재는 국비 과정 하나만 모집 중이고,
// 나머지 과정은 이미 개설되어 각자의 기수가 진행 중이며, 종료 후 다음 기수를 모집할 예정이다.
// tuition: 국비지원이 아닌 나머지 3개 과정의 총 교육비(placeholder) — 국비 과정은
// data/courseDetail.js의 courseOverview・data/fundingInfo.js에 별도로 안내됨.
export const courses = [
  {
    id: DEFAULT_COURSE_ID,
    title: 'UI/UX 디자인 실무 과정',
    summary:
      '실무 중심 커리큘럼과 1:1 멘토 매칭으로 완성하는 UI/UX 디자이너 양성 과정입니다.',
    capacity: 20,
    // 모집 시작일 ~ 마감일. 실제 일정이 정해지기 전까지 사용하는 placeholder
    applicationStart: '2026-07-15T00:00:00',
    // 8/13 제출・평가 시점 기준으로 "지원 마감까지 D-5 정도"로 보이도록 맞춘 값.
    applicationDeadline: '2026-08-18T23:59:59',
    // 과정은 기수(회차) 단위로 운영된다. 현재 모집 중인 기수.
    currentCohort: 4,
    status: 'recruiting',
    fundingType: 'national',
    // 홈 팝업 광고 이미지 (reference/교육과정(팝업).png, 원본 전체가 보이도록 크롭 없이 리사이즈만).
    promoImage: '/images/promo-course.jpg',
  },
  {
    id: 'course-ux-research',
    title: 'UX 리서치 심화 과정',
    summary:
      '사용자 인터뷰・설문 설계부터 인사이트 도출까지, 데이터 기반 UX 리서치 역량을 키우는 과정입니다.',
    tuition: '3,600,000원',
    status: 'in_progress',
    currentCohort: 1,
    progressStart: '2026-07-06',
    progressEnd: '2026-09-25',
    nextRecruitingStart: '2026-09-28',
    nextRecruitingEnd: '2026-10-19',
    progressNote: '1기 과정 진행 중 · 종료 후 2기 모집 예정',
  },
  {
    id: 'course-product-design',
    title: '프로덕트 디자인 부트캠프',
    summary:
      '기획부터 UI 디자인, 프로토타이핑까지 프로덕트 전 과정을 다루는 실전 부트캠프입니다.',
    tuition: '4,200,000원',
    status: 'in_progress',
    currentCohort: 1,
    progressStart: '2026-07-20',
    progressEnd: '2026-10-09',
    nextRecruitingStart: '2026-10-13',
    nextRecruitingEnd: '2026-11-03',
    progressNote: '1기 과정 진행 중 · 종료 후 2기 모집 예정',
  },
  {
    id: 'course-design-system',
    title: '디자인 시스템 마스터 과정',
    summary:
      '컴포넌트 설계와 디자인 토큰 운영 등 조직 단위 디자인 시스템 구축 역량을 다루는 과정입니다.',
    tuition: '3,400,000원',
    status: 'in_progress',
    currentCohort: 1,
    progressStart: '2026-06-15',
    progressEnd: '2026-08-28',
    nextRecruitingStart: '2026-09-01',
    nextRecruitingEnd: '2026-09-30',
    progressNote: '1기 과정 진행 중 · 종료 후 2기 모집 예정',
  },
]
