// 메인 비주얼 슬라이더 콘텐츠.
// 핵심 컨셉은 "AI를 활용하는 UI/UX 디자이너 교육"이며, 국비지원은 이를 받쳐주는
// 보조 수단(2번 슬라이드)으로 다룬다 — 1번 슬라이드가 브랜드 정체성을 대표한다.
// image: 실제 사진/일러스트 URL이 정해지면 채워 넣는다(비워두면 브랜드 톤
// 그라디언트로 자동 대체됨, HeroSlider.css 참고). imageHint는 이미지를
// 준비할 때 참고할 촬영/선택 가이드 — 실제 이미지가 정해지면 지워도 된다.
// video: 지정하면 image는 <video>의 poster(로딩 중 표시될 정지 프레임)로 쓰이고,
// 슬라이드 자동 전환은 duration이 아니라 영상이 끝나는 시점(ended)에 일어난다.
// duration: video가 없는 슬라이드가 화면에 머무는 시간(ms). 지정하지 않으면
// HeroSlider의 기본값(5000ms)을 쓴다.
export const heroSlides = [
  {
    id: 1,
    eyebrow: '2026 AI UI/UX 디자인 아카데미',
    title: 'AI로 더 빠르게 디자인하고,\n실무로 증명하는 UI/UX 디자이너.',
    ctaLabel: '과정 상세 보기',
    ctaTo: '/course',
    image: '/images/hero/slide-1.jpg',
    video: '/videos/hero-slide-1.mp4',
    imageHint:
      '노트북 화면(Figma AI 등 AI 디자인 툴)을 진지하게 들여다보는 수강생 클로즈업. 텍스트와 겹치는 왼쪽 하단은 어둡게, 화면・손 디테일이 보이는 구도.',
  },
  {
    id: 2,
    eyebrow: '수강료 부담 없이',
    title: '국민취업지원제도로\nAI UI/UX 디자인 과정을 시작하세요.',
    ctaLabel: '국비지원 안내 보기',
    ctaTo: '/funding',
    image: '/images/hero/slide-2.jpg',
    video: '/videos/hero-slide-2.mp4',
    imageHint:
      '밝고 안심되는 톤 — 서류/카드를 들고 웃는 인물 또는 "100%" 강조 그래픽 일러스트. 다른 슬라이드보다 화사한 톤으로 차별화.',
  },
  {
    id: 3,
    eyebrow: '사용자를 이해하는 디자인',
    title: '사용자 경험(UX)까지 고려한\nUI 디자인을 배웁니다.',
    ctaLabel: '강사진 소개 보기',
    ctaTo: '/instructors',
    image: '/images/hero/slide-3.jpg',
    video: '/videos/hero-slide-3.mp4',
    imageHint:
      '멘토(강사)가 수강생 옆에서 같은 화면을 보며 설명하는 1:1 코칭 장면. 두 사람의 시선이 화면에 모이는 구도로 "함께 봐준다"는 인상.',
  },
  {
    id: 4,
    eyebrow: 'AI로 넓어지는 가능성',
    title: '혼자서는 못 만들 결과물을,\nAI와 함께라면 만들 수 있습니다.',
    ctaLabel: '수료생 포트폴리오 보기',
    ctaTo: '/portfolio',
    image: '/images/hero/slide-4.jpg',
    video: '/videos/hero-slide-4.mp4',
    imageHint:
      '여러 수강생이 화이트보드/포스트잇 앞에서 팀 프로젝트를 논의하는 협업 컷, 또는 화면 속 AI 프로토타이핑 툴 결과물이 살짝 보이면 좋음.',
  },
]
