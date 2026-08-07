// 교육시설 소개. 사진은 reference/학원시설.png(5개 공간이 한 장에 모인 콜라주)에서
// 각 항목별로 잘라 public/images/facilities/에 저장(라벨 텍스트 부분은 제외하고
// 4:3 비율로 크롭 — 카드 레이아웃과 동일한 비율).
export const facilities = [
  {
    id: 1,
    title: '이론 강의실',
    desc: '커리큘럼 이론 수업이 진행되는 공간으로, 대형 스크린과 화이트보드를 갖추고 있습니다.',
    image: '/images/facilities/theory.jpg',
  },
  {
    id: 2,
    title: '실습존',
    desc: '1인 1대 듀얼 모니터 PC로 Figma 등 실무 툴을 바로 실습할 수 있습니다.',
    image: '/images/facilities/practice.jpg',
  },
  {
    id: 3,
    title: '협업 스튜디오',
    desc: '팀 프로젝트 회의와 발표 연습을 위한 공간으로, 자유롭게 예약해 사용할 수 있습니다.',
    image: '/images/facilities/collab.jpg',
  },
  {
    id: 4,
    title: '멘토링룸',
    desc: '멘토와의 1:1 상담을 위한 별도 공간으로, 화상 상담 장비도 마련되어 있습니다.',
    image: '/images/facilities/mentoring.jpg',
  },
  {
    id: 5,
    title: '라운지 & 카페테리아',
    desc: '수업 사이 휴식과 동기 간 네트워킹을 위한 공간으로, 음료가 무료로 제공됩니다.',
    image: '/images/facilities/lounge.jpg',
  },
]
