// 교육장 위치/연락처/사업자 정보 placeholder — 실제 정보가 확정되면 교체
export const contactInfo = {
  name: 'AI UI/UX 디자인 아카데미 교육장',
  address: '서울특별시 강남구 테헤란로 000 (주소 확정 예정)',
  // 지도 표시용 좌표 placeholder(강남역 인근). 실제 주소 확정 시 해당 위치 좌표로 교체 필요.
  lat: 37.497952,
  lng: 127.027619,
  phone: '1588-0000',
  email: 'contact@example.com',
  hours: '평일 09:00 ~ 18:00 (주말·공휴일 휴무)',
  // 전화 상담 팝업(PhoneConsultModal)에 표시되는 담당별 연락처 placeholder
  phoneContacts: [
    { id: 1, department: '학원 대표번호', phone: '1588-0000', desc: '전체 안내' },
    { id: 2, department: '교육과정 담당자', phone: '1588-0001', desc: '커리큘럼·수강 신청 안내' },
    { id: 3, department: '국비지원 담당자', phone: '1588-0002', desc: '국민취업지원제도·수강료 지원 안내' },
  ],
  // 카카오톡 채널 공개 ID(예: '_xfxgxbT') — 카카오톡 채널 관리자센터 > 채널 홈 URL에서 확인.
  // 설정하면 https://pf.kakao.com/{id}/friend 링크로 "채널 추가(상담)" 버튼이 활성화됨(FloatingConsult.jsx).
  // 비워두면 "준비중"으로 표시.
  kakaoChannelId: '',
  directions: [
    '지하철: 2호선 강남역 3번 출구 도보 5분 (예시)',
    '버스: 강남역 정류장 하차 후 도보 이동',
    '주차: 건물 내 지하주차장 이용 가능 (2시간 무료)',
  ],
}

// 푸터 하단 사업자 정보 placeholder (학원 표기 관례상 필요한 항목들)
export const businessInfo = {
  companyName: '(주)AI UI/UX디자인아카데미',
  businessRegistrationNo: '123-45-67890',
  mailOrderNo: '제2026-서울강남-00000호',
  ceo: '성훈',
  academyName: 'AI UI/UX 디자인 아카데미',
  academyRegistrationNo: '서울강남 제0000호',
}
