export const CONSULTATION_CATEGORIES = [
  '포트폴리오 피드백',
  '취업/이력서',
  '실무 툴 (Figma 등)',
  '학습 방법/진로',
  '교육과정 지원',
]

// photo는 reference/멘토 프로필 사진.png에서 인물별로 크롭(public/images/mentors/).
export const mentors = [
  {
    id: 'mentor-1',
    name: '지수',
    title: '시니어 UX 멘토',
    specialties: ['포트폴리오 피드백', '실무 툴 (Figma 등)'],
    maxConcurrent: 3,
    career: ['前 라인 UX 디자이너', '수료생 포트폴리오 멘토링 다수 진행'],
    bio: '포트폴리오를 볼 때 결과물보다 그 과정의 논리를 먼저 봅니다. Figma 실무 팁까지 함께 챙겨드립니다.',
    photo: '/images/mentors/jisu.jpg',
  },
  {
    id: 'mentor-2',
    name: '태호',
    title: '커리어 멘토',
    specialties: ['취업/이력서', '학습 방법/진로', '교육과정 지원'],
    maxConcurrent: 2,
    career: ['前 스타트업 채용 담당자', '이력서・포트폴리오 첨삭 200건 이상'],
    bio: '이력서 한 줄, 자기소개서 한 문장이 면접까지 어떻게 이어지는지 함께 점검하며 취업 전략을 세웁니다.',
    photo: '/images/mentors/taeho.jpg',
  },
  {
    id: 'mentor-3',
    name: '은채',
    title: '프로덕트 디자인 멘토',
    specialties: ['포트폴리오 피드백', '취업/이력서'],
    maxConcurrent: 4,
    career: ['前 프로덕트 디자이너', '주니어 디자이너 온보딩・멘토링 경력 다수'],
    bio: '주니어가 놓치기 쉬운 디테일을 짚어드리고, 실무에서 바로 통하는 포트폴리오로 다듬는 걸 돕습니다.',
    photo: '/images/mentors/eunchae.jpg',
  },
]
