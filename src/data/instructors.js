// 강사진 소개 placeholder — 실제 강사진이 확정되면 교체.
// 담당 커리큘럼은 courseDetail.js의 curriculum 항목과 짝을 이루도록 구성.
export const instructors = [
  {
    id: 1,
    name: '한지민',
    title: '리드 강사',
    specialty: 'UX 리서치 · AI 리서치 툴 활용',
    curriculum: 'UX 리서치 & 기획 (1~4주차)',
    career: ['前 네이버 UX 리서처', '前 카카오 프로덕트 기획자', 'UX 리서치 방법론 사내 강의 다수 진행'],
    bio: '10년 이상 현업에서 서비스 기획과 사용자 리서치를 담당했습니다. "왜"를 먼저 묻는 리서치 습관과, AI로 인터뷰・설문 데이터를 빠르게 정리하는 법을 함께 가르칩니다.',
    photo: '/images/instructors/hanjimin.jpg',
  },
  {
    id: 2,
    name: '윤성민',
    title: 'UI 디자인 강사',
    specialty: 'Figma 실무 · Figma AI 기능 · 디자인 시스템',
    curriculum: 'UI 디자인 기초 & 툴 실무 (5~10주차)',
    career: ['前 토스 프로덕트 디자이너', '前 스타트업 디자인 시스템 리드', 'Figma 실무 워크숍 진행'],
    bio: '실무에서 바로 쓰는 컴포넌트 설계와 디자인 시스템 구축 노하우, 그리고 Figma AI 기능으로 작업 속도를 높이는 방법을 전달합니다.',
    photo: '/images/instructors/yoonsungmin.jpg',
  },
  {
    id: 3,
    name: '조은비',
    title: 'UX 디자인 강사',
    specialty: '인터랙션 디자인 · AI 프로토타이핑',
    curriculum: '인터랙션 & 프로토타이핑 (11~14주차)',
    career: ['前 라인 UX 디자이너', '前 게임사 인터랙션 디자이너', '사용성 테스트 퍼실리테이터 경력 다수'],
    bio: '작은 인터랙션 하나가 사용자 경험을 어떻게 바꾸는지, AI 프로토타이핑 툴로 빠르게 만들어보고 직접 테스트하며 배우는 수업을 지향합니다.',
    photo: '/images/instructors/joeunbi.jpg',
  },
  {
    id: 4,
    name: '강태오',
    title: '커리어 코치 · 프로젝트 멘토',
    specialty: '포트폴리오 컨설팅 · 취업 코칭',
    curriculum: '실무 프로젝트 & 포트폴리오 (15~20주차)',
    career: ['前 우아한형제들 프로덕트 디자이너', '스타트업 채용 면접관 다수 참여', '수료생 포트폴리오 컨설팅 200건 이상'],
    bio: '포트폴리오는 결과물이 아니라 "왜 이렇게 만들었는지"를 보여주는 과정이라고 생각합니다. AI 툴로 발표자료를 다듬는 법까지 포함해 실무 프로젝트와 취업 준비를 함께 코칭합니다.',
    photo: '/images/instructors/kangtaeo.jpg',
  },
]
