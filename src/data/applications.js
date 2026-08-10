import { courses, DEFAULT_COURSE_ID } from './courses.js'
import { randomKoreanName } from './randomNames.js'

const nationalCourse = courses.find((c) => c.id === DEFAULT_COURSE_ID)

// 국비 과정의 실제 모집 기간(applicationStart ~ applicationDeadline)에 맞춰 무작위 지원일시를 만든다.
// 이미 확정(confirmed)된 시드 지원자가 미래 날짜로 보이지 않도록, 데모 기준일(오늘) 이후는 제외한다.
const SEED_TODAY = new Date('2026-08-06T00:00:00').getTime()
const APPLICATION_WINDOW_START = new Date(nationalCourse.applicationStart).getTime()
const APPLICATION_WINDOW_END = Math.min(
  SEED_TODAY,
  new Date(nationalCourse.applicationDeadline).getTime(),
)

function randomAppliedAt() {
  const t =
    APPLICATION_WINDOW_START +
    Math.random() * (APPLICATION_WINDOW_END - APPLICATION_WINDOW_START)
  return new Date(t).toISOString()
}

// 다른 지원자들이 이미 채운 좌석을 흉내내는 시드 데이터(국비지원 과정 전용).
// 정원 20석 중 19석이 확정되어 있어, 내 지원 1건이 마지막 좌석을 채우는 흐름을 바로 확인할 수 있다.
// capacity를 낮추거나 이 배열 길이를 늘리면 정원 초과 → 자동 대기 흐름도 확인 가능하다.
// 지원자 이름・지원일은 실제 데이터처럼 보이도록 무작위로 생성한다(앱 로드 시마다 새로 생성됨).
// 19석 중 1석은 로그인 테스트 계정 '이유나'(yuna@example.com)가 실제로 합격한
// 좌석으로 지정해, 마이페이지에서 로그인해서 바로 "합격" 상태를 확인할 수 있게 한다
// (나머지 18석은 기존과 동일하게 무작위 이름의 다른 지원자 좌석).
// userId는 Supabase Auth 계정 전환(DB 연결 1단계) 이후의 실제 계정 id — mock
// 문자열 id를 그대로 두면 로그인해도 본인 지원 내역을 못 찾는 문제가 있었음.
export const initialApplications = [
  {
    id: 'seed-app-yuna',
    userId: 'a2692aeb-3606-4cd4-bb29-a9347dccefd3',
    name: '이유나',
    courseId: DEFAULT_COURSE_ID,
    status: 'confirmed',
    appliedAt: '2026-07-22T10:00:00.000Z',
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `seed-app-${i + 1}`,
    userId: `seed-user-${i + 1}`,
    name: randomKoreanName(),
    courseId: DEFAULT_COURSE_ID,
    status: 'confirmed',
    appliedAt: randomAppliedAt(),
  })),
].sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt))
