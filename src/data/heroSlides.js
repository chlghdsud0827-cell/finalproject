// 메인 비주얼 슬라이더 콘텐츠.
// 핵심 컨셉은 "AI를 활용하는 UI/UX 디자이너 교육"이며, 국비지원은 이를 받쳐주는
// 보조 수단(2번 슬라이드)으로 다룬다 — 1번 슬라이드가 브랜드 정체성을 대표한다.
// image: 실제 사진/일러스트 URL이 정해지면 채워 넣는다(비워두면 브랜드 톤
// 그라디언트로 자동 대체됨, HeroSlider.css 참고). imageHint는 이미지를
// 준비할 때 참고할 촬영/선택 가이드 — 실제 이미지가 정해지면 지워도 된다.
export const heroSlides = [
  {
    id: 1,
    eyebrow: '2026 AI UI/UX 디자인 아카데미',
    title: 'AI로 더 빠르게 디자인하고,\n실무로 증명하는 UI/UX 디자이너.',
    ctaLabel: '과정 상세 보기',
    ctaTo: '/course',
    image: '/images/hero/slide-1.jpg',
    imageHint:
      '노트북 화면(Figma AI 등 AI 디자인 툴)을 진지하게 들여다보는 수강생 클로즈업. 텍스트와 겹치는 왼쪽 하단은 어둡게, 화면·손 디테일이 보이는 구도.',
  },
  {
    id: 2,
    eyebrow: '수강료 부담 없이',
    title: '국민취업지원제도로\nAI UI/UX 디자인 과정을 시작하세요.',
    ctaLabel: '국비지원 안내 보기',
    ctaTo: '/funding',
    image: '/images/hero/slide-2.jpg',
    imageHint:
      '밝고 안심되는 톤 — 서류/카드를 들고 웃는 인물 또는 "100%" 강조 그래픽 일러스트. 다른 슬라이드보다 화사한 톤으로 차별화.',
  },
  {
    id: 3,
    eyebrow: '현업 멘토가 1:1로',
    title: '막히는 지점마다\n현업 디자이너가 직접 봐드립니다.',
    ctaLabel: '강사진 소개 보기',
    ctaTo: '/instructors',
    image: '/images/hero/slide-3.jpg',
    imageHint:
      '멘토(강사)가 수강생 옆에서 같은 화면을 보며 설명하는 1:1 코칭 장면. 두 사람의 시선이 화면에 모이는 구도로 "함께 봐준다"는 인상.',
  },
  {
    id: 4,
    eyebrow: 'AI 툴 실무 활용',
    title: 'AI 프로토타이핑으로\n포트폴리오를 완성합니다.',
    ctaLabel: '수료생 포트폴리오 보기',
    ctaTo: '/portfolio',
    image: '/images/hero/slide-4.jpg',
    imageHint:
      '여러 수강생이 화이트보드/포스트잇 앞에서 팀 프로젝트를 논의하는 협업 컷, 또는 화면 속 AI 프로토타이핑 툴 결과물이 살짝 보이면 좋음.',
  },
  {
    id: 5,
    eyebrow: '수료 후에는 취업까지',
    title: '채용연계와 멘토링으로\n취업까지 함께합니다.',
    ctaLabel: '수강생 후기 보기',
    ctaTo: '/reviews',
    image: '/images/hero/slide-5.jpg',
    imageHint:
      '취업에 성공한 수료생의 인터뷰 톤 사진(정장 또는 사무실 배경, 자연스러운 미소) — /reviews 페이지의 인터뷰 컨셉과 톤을 맞춘다.',
  },
]
