// "실무에서 쓰는 AI 툴" 섹션 콘텐츠.
// image/logo는 실제 이미지가 준비되기 전까지 null(그라디언트・이니셜 배지로 자동 대체)이었으나,
// 로고 4개는 reference/에 추가된 공식 아이콘 파일을 200x200으로 정리해 적용함(public/images/ai-logos/).
export const aiToolsIntro = {
  title: 'AI를 도구가 아니라 협업 파트너로',
  desc: '단순히 AI로 결과물을 뽑아내는 법이 아니라, AI 에이전트에게 반복 작업을 맡기고 디자이너는 판단과 의사결정에 집중하는 실무 워크플로를 배웁니다.',
  // reference/AI 에이전트.png에서 크롭
  image: '/images/ai-agent-intro.jpg',
}

export const aiTools = [
  {
    id: 1,
    name: 'Claude',
    maker: 'Anthropic',
    usage: '리서치 자료 요약, AI 에이전트로 반복 업무 자동화',
    logo: '/images/ai-logos/claude.png',
  },
  {
    id: 2,
    name: 'ChatGPT',
    maker: 'OpenAI',
    usage: '인터뷰・설문 분석, 카피라이팅 초안 작성',
    logo: '/images/ai-logos/chatgpt.png',
  },
  {
    id: 3,
    name: 'Gemini',
    maker: 'Google',
    usage: '자료 조사, 멀티모달 프로토타입 아이디어 발산',
    logo: '/images/ai-logos/gemini.png',
  },
  {
    id: 4,
    name: 'Figma AI',
    maker: 'Figma',
    usage: 'AI 프로토타이핑, 목업 자동 생성',
    logo: '/images/ai-logos/figma.png',
  },
]
