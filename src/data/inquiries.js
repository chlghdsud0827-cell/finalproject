import { DEFAULT_COURSE_ID } from './courses.js'

// 문의 게시판(Q&A) 시드 데이터. 자유 댓글형이 아니라 1:1 문의-답변형이라
// reply가 null이면 답변대기, 채워지면 답변완료로 간주한다(상태를 별도 필드로
// 중복 저장하지 않고 reply 유무에서 파생시켜 상태 불일치를 원천적으로 방지).
export const initialInquiries = [
  {
    id: 'seed-inquiry-1',
    userId: 'seed-user-3',
    courseId: DEFAULT_COURSE_ID,
    title: '국비지원 자격 조건이 궁금합니다',
    content: '국민내일배움카드가 없는데도 지원할 수 있나요?',
    contact: '010-1234-5678',
    email: 'seed-user-3@example.com',
    createdAt: '2026-07-20T10:00:00.000Z',
    reply: {
      adminId: 'admin-1',
      content:
        '국민내일배움카드 발급 대상자만 국비지원이 가능합니다. 카드 발급은 고용센터에서 별도로 신청하실 수 있으니, 발급 후 다시 지원해 주세요.',
      createdAt: '2026-07-20T15:30:00.000Z',
    },
  },
  {
    id: 'seed-inquiry-2',
    userId: 'seed-user-7',
    courseId: DEFAULT_COURSE_ID,
    title: '수업 시간표를 확인하고 싶어요',
    content: '평일 오전반과 오후반이 따로 있나요? 직장을 병행하면서 들을 수 있는지 궁금합니다.',
    contact: '',
    email: 'seed-user-7@example.com',
    createdAt: '2026-07-25T09:00:00.000Z',
    reply: null,
  },
  {
    id: 'seed-inquiry-3',
    userId: 'seed-user-11',
    courseId: DEFAULT_COURSE_ID,
    title: '비전공자도 수료 후 취업이 잘 되나요?',
    content:
      '디자인 관련 학과를 나오지 않았는데, 비전공자 수료생 비율이나 취업 사례가 궁금합니다.',
    contact: '010-2345-6789',
    email: '',
    createdAt: '2026-07-26T11:20:00.000Z',
    reply: {
      adminId: 'admin-1',
      content:
        '현재 수료생의 절반 이상이 비전공자입니다. 포트폴리오 페이지에서 비전공자 수료생들의 프로젝트도 함께 확인하실 수 있어요.',
      createdAt: '2026-07-26T16:45:00.000Z',
    },
  },
  {
    id: 'seed-inquiry-4',
    userId: 'seed-user-14',
    courseId: DEFAULT_COURSE_ID,
    title: '노트북을 새로 구매해야 할까요?',
    content: 'Figma만 실행되면 되는 걸까요, 사양 기준이 따로 있는지 궁금합니다.',
    contact: '',
    email: '',
    createdAt: '2026-07-28T13:10:00.000Z',
    reply: null,
  },
  {
    id: 'seed-inquiry-guest-1',
    userId: null,
    name: '방문자A',
    courseId: DEFAULT_COURSE_ID,
    title: '회원가입 전에 커리큘럼부터 자세히 알고 싶어요',
    content: '아직 가입은 안 했는데, 1~4주차 커리큘럼 상세 내용을 미리 받아볼 수 있을까요?',
    contact: '010-4567-8901',
    email: '',
    createdAt: '2026-08-02T10:15:00.000Z',
    reply: null,
  },
  {
    id: 'seed-inquiry-5',
    userId: 'seed-user-16',
    courseId: DEFAULT_COURSE_ID,
    title: '4기 모집 마감일이 지나면 5기를 기다려야 하나요?',
    content: '이번 마감을 놓치면 다음 기수 모집은 언제쯤 시작되는지 알고 싶습니다.',
    contact: '010-3456-7890',
    email: 'seed-user-16@example.com',
    createdAt: '2026-07-29T08:40:00.000Z',
    reply: {
      adminId: 'admin-1',
      content:
        '보통 한 기수가 끝나기 약 4주 전부터 다음 기수 모집 공고를 올리고 있습니다. 다음 기수 소식은 홈페이지 상단 배너로 안내드릴 예정입니다.',
      createdAt: '2026-07-29T14:05:00.000Z',
    },
  },
]
