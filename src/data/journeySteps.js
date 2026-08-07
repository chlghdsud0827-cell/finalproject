// 곡선 그래프 위 마커 좌표는 JourneyGraph.jsx의 SVG path와 짝을 이루도록 설계됨(x, y는 %)
export const journeySteps = [
  {
    id: 1,
    title: '과정 지원',
    desc: '온라인으로 간편하게 지원하고\n실시간 잔여 정원을 확인합니다.',
    x: 25,
    y: 73.3,
    labelPos: 'above',
  },
  {
    id: 2,
    title: '멘토 매칭',
    desc: '신청 내용을 검토해\n담당 멘토를 배정합니다.',
    x: 47,
    y: 50,
    labelPos: 'above',
  },
  {
    id: 3,
    title: '실무 프로젝트',
    desc: '커리큘럼을 따라\n포트폴리오를 완성합니다.',
    x: 69,
    y: 30,
    labelPos: 'below',
  },
  {
    id: 4,
    title: '취업 연계',
    desc: '파트너사와 연계해\n취업까지 지원합니다.',
    x: 95,
    y: 13.3,
    labelPos: 'below',
  },
]
