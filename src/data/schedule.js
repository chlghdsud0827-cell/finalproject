import { courses, DEFAULT_COURSE_ID } from './courses.js'

const nationalCourse = courses.find((c) => c.id === DEFAULT_COURSE_ID)
const otherCourses = courses.filter((c) => c.id !== DEFAULT_COURSE_ID)

// type: 'recruiting'(모집) | 'course'(수업 진행) | 'event'(행사)
// 과정별 진행/모집 일정은 courses.js의 필드(progressStart/End, nextRecruitingStart/End,
// applicationStart/Deadline)를 그대로 참조해, 과정 소개 페이지와 일정이 어긋나지 않도록 한다.
// 행사(event)만 이 파일에 직접 날짜를 둔다.

// 국비 과정 1~3기 이력(완료분). aboutContent.js 연혁("2025년 설립, 1기 모집 시작" /
// "2025년 우수 국비교육기관 선정")과 현재 4기 모집 시점이 서로 맞물리도록 역산한
// placeholder 일정 — "2025년에 상을 받았다면서 그 해 일정이 하나도 없다"는 지적을
// 반영해 추가했다. 이후 "기수 간 텀이 너무 짧고 시작이 너무 늦다"는 피드백으로,
// 1기를 2025년 1월(연초)부터 시작하고 기수별 모집 시작 간격을 6개월 이상으로
// 넓혀 재조정. 이후 "10주 과정을 20주(약 5개월)로 늘려달라"는 요청으로 수업 기간을
// 모두 140일(20주) 기준으로 재계산 — 수료식(아래 sch-2)은 반드시 3기 수업 종료일과
// 같은 날짜로 맞춰야 하고, notices.js의 수료식 공지 날짜도 함께 수정했음. 4기 모집
// 시점은 기존 값 유지, 4기 수업만 20주 기준으로 함께 연장.
const nationalCourseHistory = [
  {
    id: 'sch-hist-1-recruit',
    title: `${nationalCourse.title} 1기 모집`,
    type: 'recruiting',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2025-01-06',
    endDate: '2025-02-02',
  },
  {
    id: 'sch-hist-1-course',
    title: `${nationalCourse.title} 1기 수업`,
    type: 'course',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2025-02-10',
    endDate: '2025-06-29',
  },
  {
    id: 'sch-hist-1-grad',
    title: '1기 수료식',
    type: 'event',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2025-06-29',
    endDate: '2025-06-29',
  },
  {
    id: 'sch-hist-award',
    title: '우수 국비교육기관 선정',
    type: 'event',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2025-07-15',
    endDate: '2025-07-15',
  },
  // 2기 모집 시작(2025-08-04)은 1기 모집 시작(2025-01-06)으로부터 약 7개월 후
  {
    id: 'sch-hist-2-recruit',
    title: `${nationalCourse.title} 2기 모집`,
    type: 'recruiting',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2025-08-04',
    endDate: '2025-08-31',
  },
  {
    id: 'sch-hist-2-course',
    title: `${nationalCourse.title} 2기 수업`,
    type: 'course',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2025-09-08',
    endDate: '2026-01-25',
  },
  {
    id: 'sch-hist-2-grad',
    title: '2기 수료식',
    type: 'event',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2026-01-25',
    endDate: '2026-01-25',
  },
  // 3기 모집 시작(2026-02-04)은 2기 모집 시작(2025-08-04)으로부터 정확히 6개월 후이자
  // 2기 수료식(2026-01-25) 이후라 겹치지 않는다.
  {
    id: 'sch-hist-3-recruit',
    title: `${nationalCourse.title} 3기 모집`,
    type: 'recruiting',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2026-02-04',
    endDate: '2026-03-03',
  },
  {
    id: 'sch-hist-3-course',
    title: `${nationalCourse.title} 3기 수업`,
    type: 'course',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2026-03-11',
    endDate: '2026-07-28',
  },
]

export const scheduleEvents = [
  ...nationalCourseHistory,
  {
    id: 'sch-1',
    title: `${nationalCourse.title} ${nationalCourse.currentCohort}기 모집`,
    type: 'recruiting',
    courseId: DEFAULT_COURSE_ID,
    startDate: nationalCourse.applicationStart.slice(0, 10),
    endDate: nationalCourse.applicationDeadline.slice(0, 10),
  },
  {
    id: 'sch-2',
    title: '3기 수료식',
    type: 'event',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2026-07-28',
    endDate: '2026-07-28',
  },
  {
    id: 'sch-3',
    title: '입학 설명회',
    type: 'event',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2026-08-12',
    endDate: '2026-08-12',
  },
  {
    id: 'sch-7',
    title: `${nationalCourse.title} ${nationalCourse.currentCohort}기 발대식(OT)`,
    type: 'event',
    courseId: DEFAULT_COURSE_ID,
    startDate: '2026-08-24',
    endDate: '2026-08-24',
  },
  {
    id: 'sch-8',
    title: `${nationalCourse.title} ${nationalCourse.currentCohort}기 수업`,
    type: 'course',
    courseId: DEFAULT_COURSE_ID,
    // 모집 마감 후 개강까지의 간격은 실제 일정이 정해지기 전까지 사용하는 placeholder.
    // 20주(140일) 과정 기준으로 종료일 계산.
    startDate: '2026-08-24',
    endDate: '2027-01-10',
  },
  ...otherCourses.flatMap((c) => [
    {
      id: `sch-course-${c.id}`,
      title: `${c.title} ${c.currentCohort}기 수업`,
      type: 'course',
      courseId: c.id,
      startDate: c.progressStart,
      endDate: c.progressEnd,
    },
    {
      id: `sch-recruit-${c.id}`,
      title: `${c.title} ${c.currentCohort + 1}기 모집`,
      type: 'recruiting',
      courseId: c.id,
      startDate: c.nextRecruitingStart,
      endDate: c.nextRecruitingEnd,
    },
  ]),
]
