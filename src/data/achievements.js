// 실적/수상 내역 placeholder — 실제 수치·수상 내역이 확정되면 교체
export const achievements = [
  // 2025년 설립 후 현재 4기 모집 중(courses.js) → 1~3기 수료, 과정 정원 20명 기준 3개 기수 분량으로 산정.
  // 다른 3개 과정은 아직 1기 진행 중이라 수료생이 없어 포함하지 않음.
  { id: 1, to: 60, decimals: 0, suffix: '+', label: '누적 수료생', icon: '/icons/profit-growth.png' },
  { id: 2, to: 92, decimals: 0, suffix: '%', label: '취업률', icon: '/icons/self-employed.png' },
  { id: 3, to: 4.8, decimals: 1, suffix: ' / 5.0', label: '수강생 만족도', icon: '/icons/tumb-up.png' },
  { id: 4, to: null, staticValue: '2025', label: '우수 국비교육기관 선정', icon: '/icons/excellence-awards.png' },
]
