// 비회원 상담 신청(콜백 요청) seed data — 로그인 없이 이름/연락처/문의 내용만 받아
// 담당자가 직접 전화로 연락하는 방식. 로그인 후 이용하는 멘토 자동매칭 상담
// (Consultation)과는 별개 기능이다.
export const initialCallbackRequests = [
  {
    id: 'seed-callback-1',
    name: '이수진',
    phone: '010-1234-5678',
    content: '국비지원 대상인지 확인하고 싶어요. 다음 기수 모집 일정도 함께 안내받고 싶습니다.',
    requestedAt: '2026-07-28T11:00:00.000Z',
    contacted: true,
    mentorId: null,
  },
  {
    id: 'seed-callback-2',
    name: '박현우',
    phone: '010-9876-5432',
    content: '커리큘럼 관련해서 좀 더 자세히 안내받고 싶습니다. 평일 저녁에 연락 부탁드려요.',
    requestedAt: '2026-08-01T09:30:00.000Z',
    contacted: false,
    mentorId: null,
  },
]
