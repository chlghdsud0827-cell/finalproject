// 학원소개 페이지 콘텐츠 placeholder — 실제 연혁/철학 문구가 확정되면 교체
export const missionValues = [
  {
    id: 1,
    icon: '/icons/ai-generative.png',
    title: 'AI를 실무처럼 다루는 커리큘럼',
    desc: 'Figma AI, AI 프로토타이핑 툴 등을 실무 워크플로에 녹여 이론보다 실제 프로젝트로 배웁니다. 매 기수 실무 프로젝트로 포트폴리오를 완성합니다.',
  },
  {
    id: 2,
    icon: '/icons/support.png',
    title: '1:1 멘토 매칭',
    desc: '현업 디자이너 멘토가 분야별로 배정되어, 막히는 지점마다 빠르게 피드백을 받을 수 있습니다.',
  },
  {
    id: 3,
    icon: '/icons/thumb-up.png',
    title: '취업까지 책임지는 연계',
    desc: '수료로 끝나지 않고 파트너사 채용 연계와 커리어 상담까지 함께합니다.',
  },
]

// 전체 연혁(/history 페이지에서 모두 노출). 날짜는 학원 일정(1~3기 모집・수업・수료
// 실제 일정, academy.schedule_events 테이블 — 원래 data/schedule.js에 있던 계산값을
// supabase/migrations/0014로 이관함)과 어긋나지 않도록 맞춤.
// highlight: true인 항목만 About(학원소개) 페이지에 요약으로 노출된다.
export const history = [
  {
    id: 1,
    year: '2025.01',
    desc: 'AI UI/UX 디자인 아카데미 설립, 1기 모집 시작',
    highlight: true,
  },
  { id: 2, year: '2025.06', desc: '1기 수료' },
  { id: 3, year: '2025.07', desc: '우수 국비교육기관 선정', highlight: true },
  { id: 4, year: '2025.08', desc: '2기 모집 시작' },
  { id: 5, year: '2026.01', desc: '2기 수료' },
  { id: 6, year: '2026.02', desc: '3기 모집 시작' },
  { id: 7, year: '2026.07', desc: '3기 수료' },
  {
    id: 8,
    year: '2026.08',
    desc: '4기 모집 진행 중, 취업 연계 파트너사 확대',
    highlight: true,
  },
]
