// 교육장 위치/연락처/사업자 정보 — 실제 위치가 아직 없어 임의로 지정한 값(강남역 인근으로 설정).
export const contactInfo = {
  name: 'AI UI/UX 디자인 아카데미 교육장',
  address: '서울특별시 강남구 테헤란로 45, 5층',
  // 강남역 좌표에서 테헤란로를 따라 동쪽으로 약 250m 이동한 지점 — 학원이
  // 역 출구 건물 자체가 아니라 인근의 평범한 사무용 건물에 있는 것처럼
  // 보이도록, 지하철역 정중앙 좌표를 그대로 쓰지 않고 살짝 옮겨 지정.
  lat: 37.497952,
  lng: 127.030119,
  phone: '1588-0000',
  email: 'contact@example.com',
  hours: '평일 09:00 ~ 18:00 (주말·공휴일 휴무)',
  // 전화 상담 팝업(PhoneConsultModal)에 표시되는 담당별 연락처 placeholder
  phoneContacts: [
    { id: 1, department: '학원 대표번호', phone: '1588-0000', desc: '전체 안내' },
    { id: 2, department: '교육과정 담당자', phone: '1588-0001', desc: '커리큘럼·수강 신청 안내' },
    { id: 3, department: '국비지원 담당자', phone: '1588-0002', desc: '국민취업지원제도·수강료 지원 안내' },
  ],
  // 카카오톡 채널 공개 ID. 실제로 등록된 채널이 아니라 형식만 갖춘 임의 값이라
  // "채널 추가(상담)" 버튼은 활성화되어 보이지만 실제로 연결되지는 않는다
  // (FloatingConsult.jsx가 https://pf.kakao.com/{id}/friend로 연결).
  kakaoChannelId: '_xqTpK9m',
  directions: [
    '지하철: 2호선 강남역 3번 출구 도보 5분',
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
