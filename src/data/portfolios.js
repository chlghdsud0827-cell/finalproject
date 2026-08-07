// 수료생 포트폴리오 placeholder — 실제 수료생 동의를 받은 뒤 실제 포트폴리오로 교체
// 현재 4기 모집 중이므로, 수료를 마친 1~3기까지만 포트폴리오를 제공한다.
export const portfolios = [
  {
    id: 1,
    name: '김민준',
    cohort: 3,
    role: 'UI/UX 디자이너',
    summary: '커머스 앱 리디자인 프로젝트로 실무 역량을 쌓았습니다.',
    image: '/images/portfolio/01.jpg',
  },
  {
    id: 2,
    name: '이서연',
    cohort: 3,
    role: 'UI/UX 디자이너',
    summary: '핀테크 서비스 온보딩 플로우 개선 프로젝트를 진행했습니다.',
    image: '/images/portfolio/02.jpg',
  },
  {
    id: 3,
    name: '박지훈',
    cohort: 2,
    role: '프로덕트 디자이너',
    summary: '헬스케어 플랫폼 대시보드 UX 개선 프로젝트를 진행했습니다.',
    image: '/images/portfolio/03.jpg',
  },
  {
    id: 4,
    name: '최유나',
    cohort: 2,
    role: 'UI 디자이너',
    summary: '교육 서비스 디자인 시스템 구축 경험이 있습니다.',
    image: '/images/portfolio/04.jpg',
  },
  {
    id: 5,
    name: '정도윤',
    cohort: 1,
    role: 'UI/UX 디자이너',
    summary: '여행 플랫폼 예약 플로우 리뉴얼 프로젝트를 진행했습니다.',
    image: '/images/portfolio/05.jpg',
  },
  {
    id: 6,
    name: '한소율',
    cohort: 1,
    role: 'UX 리서처',
    summary: '사용자 리서치 기반 정보구조 재설계 프로젝트를 진행했습니다.',
    image: '/images/portfolio/06.jpg',
  },
]

// 최신 기수순
export const COHORT_OPTIONS = [3, 2, 1]
