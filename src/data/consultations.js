import { randomKoreanName } from './randomNames.js'

// 멘토별 부하(진행 중 상담 건수)가 다르게 시작하도록 만든 시드 데이터.
// 지수(mentor-1, 최대 3건)는 이미 2건 진행 중, 은채(mentor-3, 최대 4건)는 0건이라,
// 관리자가 '포트폴리오 피드백' 상담을 수동 배정할 때 부하가 더 적은 은채가
// 멘토 선택 목록 상단(분야 일치 + 여유 순 정렬)에 오는 것을 확인할 수 있다.
// 학생 이름은 실제 데이터처럼 보이도록 무작위로 생성한다(앱 로드 시마다 새로 생성됨).
export const initialConsultations = [
  {
    id: 'seed-consult-1',
    studentId: 'seed-student-1',
    name: randomKoreanName(),
    mentorId: 'mentor-1',
    category: '포트폴리오 피드백',
    content: '포트폴리오 구성 관련 피드백 요청드립니다.',
    status: 'in_progress',
    requestedAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: 'seed-consult-2',
    studentId: 'seed-student-2',
    name: randomKoreanName(),
    mentorId: 'mentor-1',
    category: '실무 툴 (Figma 등)',
    content: 'Figma 오토레이아웃 관련 질문이 있습니다.',
    status: 'matched',
    requestedAt: '2026-07-12T09:00:00.000Z',
  },
  {
    id: 'seed-consult-3',
    studentId: 'seed-student-3',
    name: randomKoreanName(),
    mentorId: 'mentor-2',
    category: '취업/이력서',
    content: '이력서 첨삭 요청드립니다.',
    status: 'in_progress',
    requestedAt: '2026-07-11T09:00:00.000Z',
  },
  // 로그인 테스트 계정 '이유나'(yuna@example.com)를 은채(mentor-3) 멘토와 미리
  // 연결해둔 시드 — 마이페이지 "내 멘토" 섹션을 빈 상태가 아니라 실제로 배정된
  // 멘토가 있는 화면으로 바로 확인할 수 있게 한다. studentId는 Supabase Auth
  // 계정 전환(DB 연결 1단계) 이후의 실제 계정 id.
  {
    id: 'seed-consult-yuna',
    studentId: 'a2692aeb-3606-4cd4-bb29-a9347dccefd3',
    name: '이유나',
    mentorId: 'mentor-3',
    category: '포트폴리오 피드백',
    content: '포트폴리오 방향 관련해서 조언을 구하고 싶습니다.',
    status: 'in_progress',
    requestedAt: '2026-07-25T09:00:00.000Z',
  },
]
