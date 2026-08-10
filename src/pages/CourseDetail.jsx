import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApplications } from '../context/ApplicationContext.jsx'
import { useConsultations } from '../context/ConsultationContext.jsx'
import { courses, DEFAULT_COURSE_ID } from '../data/courses.js'
import {
  courseOverview,
  courseSkills,
  curriculum,
  courseRequirements,
  courseFaqs,
} from '../data/courseDetail.js'
import { otherCourseDetails } from '../data/otherCourseDetails.js'
import { aiToolsIntro, aiTools } from '../data/aiTools.js'
import { STATUS_LABEL, STATUS_BADGE_CLASS } from '../utils/applicationStatus.js'
import {
  CONSULT_STATUS_LABEL,
  CONSULT_STATUS_BADGE_CLASS,
} from '../utils/consultationStatus.js'
import CapacityBadge from '../components/CapacityBadge.jsx'
import DeadlineCountdown from '../components/DeadlineCountdown.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import BottomCta from '../components/BottomCta.jsx'
import './CourseDetail.css'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// 국비 과정 외 다른 과정용 패널 — 아직 모집중이 아니라 지원 플로우 없이
// 일정・스킬・커리큘럼 개요만 보여준다.
function OtherCoursePanel({ course }) {
  const detail = otherCourseDetails[course.id]

  return (
    <>
      <div className="course-detail__hero">
        <div className="course-detail__badges">
          <span className="badge badge--waiting">{course.currentCohort}기 진행중</span>
        </div>
        <h1>{course.title}</h1>
        <p>{course.summary}</p>
        <p className="course-detail__status">{course.progressNote}</p>
      </div>

      <section className="course-detail__section" aria-label="일정">
        <h2>일정</h2>
        <dl className="course-detail__other-dates">
          <div>
            <dt>진행 기간</dt>
            <dd>
              {formatDate(course.progressStart)} ~ {formatDate(course.progressEnd)}
            </dd>
          </div>
          <div>
            <dt>다음 기수 모집 예정</dt>
            <dd>
              {formatDate(course.nextRecruitingStart)} ~{' '}
              {formatDate(course.nextRecruitingEnd)}
            </dd>
          </div>
        </dl>
      </section>

      {detail && (
        <>
          <section className="course-detail__section" aria-label="이런 걸 배워요">
            <h2>이런 걸 배워요</h2>
            <ul className="course-detail__skills">
              {detail.skills.map((skill) => (
                <li key={skill} className="course-detail__skill-tag">
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section className="course-detail__section" aria-label="커리큘럼">
            <h2>커리큘럼</h2>
            <ol className="course-detail__curriculum">
              {detail.curriculum.map((phase) => (
                <li key={phase.id} className="course-detail__curriculum-item">
                  <span className="course-detail__curriculum-period">{phase.period}</span>
                  <div className="course-detail__curriculum-body">
                    <h3>{phase.title}</h3>
                    <ul className="course-detail__curriculum-topics">
                      {phase.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      <section className="course-detail__section" aria-label="모집 안내">
        <h2>모집 안내</h2>
        <p className="course-detail__other-desc">
          현재 {course.currentCohort}기 과정이 진행 중이며, 다음 기수 모집은{' '}
          {formatDate(course.nextRecruitingStart)}부터 시작될 예정입니다. 모집이
          시작되면 <Link to="/notices">공지사항</Link>과{' '}
          <Link to="/schedule">학원 일정</Link>에서 안내해 드립니다. 미리 궁금한 점이
          있다면 <Link to="/inquiry">문의하기</Link>를 이용해 주세요.
        </p>
      </section>
    </>
  )
}

function CourseDetail() {
  const { currentUser } = useAuth()
  const { getCourseWithCapacity, getMyApplications, applyToCourse } = useApplications()
  const { getMyConsultations } = useConsultations()
  const [activeCourseId, setActiveCourseId] = useState(DEFAULT_COURSE_ID)
  const course = getCourseWithCapacity(DEFAULT_COURSE_ID)
  // 지원 절차: 상담신청 → 멘토지정 → 멘토상담 → 지원하기 → 합/불.
  // 완료(completed)된 멘토 상담이 하나라도 있어야 지원하기가 열린다.
  const myConsultations = getMyConsultations()
  const hasCompletedConsultation = myConsultations.some((c) => c.status === 'completed')
  const latestConsultation = [...myConsultations].sort(
    (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt),
  )[0]
  const myApplication = getMyApplications().find(
    (a) =>
      a.courseId === DEFAULT_COURSE_ID &&
      a.status !== 'cancelled' &&
      a.status !== 'rejected',
  )
  const overviewWithPeriod = [
    {
      label: '모집 기간',
      value: `${formatDate(course.applicationStart)} ~ ${formatDate(course.applicationDeadline)}`,
    },
    ...courseOverview,
  ]

  if (!course) return null

  const activeCourse = courses.find((c) => c.id === activeCourseId)
  const isMainCourse = activeCourseId === DEFAULT_COURSE_ID

  return (
    <main className="course-detail">
      <div className="course-detail__inner">
        <div className="course-detail__tabs" role="tablist">
          {courses.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activeCourseId === c.id}
              className={`course-detail__tab ${
                activeCourseId === c.id ? 'course-detail__tab--active' : ''
              }`}
              onClick={() => setActiveCourseId(c.id)}
            >
              {c.title}
            </button>
          ))}
        </div>

        {isMainCourse ? (
          <>
            <div className="course-detail__hero">
              <div className="course-detail__badges">
                <span className="badge badge--success">{course.currentCohort}기 모집중</span>
                {course.fundingType === 'national' && (
                  <span className="badge badge--waiting">국비지원 과정</span>
                )}
                <CapacityBadge current={course.confirmedCount} capacity={course.capacity} />
                <DeadlineCountdown deadline={course.applicationDeadline} />
              </div>
              <h1>{course.title}</h1>
              <p>{course.summary}</p>

              {!currentUser ? (
                <p className="course-detail__status">
                  지원하려면 <Link to="/login">로그인</Link>이 필요합니다.
                </p>
              ) : myApplication ? (
                <p className="course-detail__status">
                  내 지원 상태:{' '}
                  <span className={`badge ${STATUS_BADGE_CLASS[myApplication.status]}`}>
                    {STATUS_LABEL[myApplication.status]}
                  </span>
                </p>
              ) : hasCompletedConsultation ? (
                <button
                  className="btn btn--primary"
                  onClick={() => applyToCourse(DEFAULT_COURSE_ID)}
                >
                  지원하기
                </button>
              ) : (
                <div className="course-detail__gate">
                  <p className="course-detail__status">
                    지원하려면 먼저 멘토 상담을 완료해야 합니다.
                    {latestConsultation && (
                      <>
                        {' '}
                        현재 상담 상태:{' '}
                        <span
                          className={`badge ${CONSULT_STATUS_BADGE_CLASS[latestConsultation.status]}`}
                        >
                          {CONSULT_STATUS_LABEL[latestConsultation.status]}
                        </span>
                      </>
                    )}
                  </p>
                  <Link
                    className="btn btn--primary"
                    to={latestConsultation ? '/mypage' : '/consultation'}
                  >
                    {latestConsultation ? '내 상담 현황 보기' : '멘토 상담 신청하기'}
                  </Link>
                </div>
              )}
            </div>

            <section className="course-detail__stats" aria-label="지원 현황">
              <div className="course-detail__stat">
                <strong>{course.capacity}</strong>
                <span>전체 정원</span>
              </div>
              <div className="course-detail__stat">
                <strong>{course.confirmedCount}</strong>
                <span>합격</span>
              </div>
              <div className="course-detail__stat">
                <strong>{course.pendingCount}</strong>
                <span>심사중(보류)</span>
              </div>
              <div className="course-detail__stat">
                <strong>{course.remaining}</strong>
                <span>남은 자리</span>
              </div>
            </section>

            <section className="course-detail__section" aria-label="모집요강">
              <h2>모집요강</h2>
              <dl className="course-detail__overview-grid">
                {overviewWithPeriod.map((item) => (
                  <div key={item.label} className="course-detail__overview-card">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="course-detail__section" aria-label="이런 걸 배워요">
              <h2>이런 걸 배워요</h2>
              <ul className="course-detail__skills">
                {courseSkills.map((skill) => (
                  <li key={skill} className="course-detail__skill-tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>

            <section className="course-detail__section" aria-label="실무에서 쓰는 AI 툴">
              <h2>실무에서 쓰는 AI 툴</h2>
              <div className="course-detail__ai-intro">
                <div className="course-detail__ai-intro-media">
                  {aiToolsIntro.image ? (
                    <img src={aiToolsIntro.image} alt="" />
                  ) : (
                    <div className="course-detail__ai-intro-placeholder">
                      <img src="/icons/ai-generative.png" alt="" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="course-detail__ai-intro-body">
                  <h3>{aiToolsIntro.title}</h3>
                  <p>{aiToolsIntro.desc}</p>
                </div>
              </div>
              <div className="course-detail__ai-tools-grid">
                {aiTools.map((tool) => (
                  <div key={tool.id} className="course-detail__ai-tool-card">
                    {tool.logo ? (
                      <img
                        className="course-detail__ai-tool-logo"
                        src={tool.logo}
                        alt={tool.name}
                      />
                    ) : (
                      <div className="course-detail__ai-tool-logo course-detail__ai-tool-logo--letter">
                        {tool.name.slice(0, 1)}
                      </div>
                    )}
                    <div>
                      <strong>{tool.name}</strong>
                      <span>{tool.maker}</span>
                      <p>{tool.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="course-detail__section" aria-label="커리큘럼">
              <h2>커리큘럼</h2>
              <ol className="course-detail__curriculum">
                {curriculum.map((phase) => (
                  <li key={phase.id} className="course-detail__curriculum-item">
                    <span className="course-detail__curriculum-period">{phase.period}</span>
                    <div className="course-detail__curriculum-body">
                      <h3>{phase.title}</h3>
                      <ul className="course-detail__curriculum-topics">
                        {phase.topics.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="course-detail__section" aria-label="지원 자격">
              <h2>지원 자격</h2>
              <ul className="course-detail__requirements">
                {courseRequirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </section>

            <FaqAccordion items={courseFaqs} title="과정 관련 자주 묻는 질문" />
          </>
        ) : (
          <OtherCoursePanel course={activeCourse} />
        )}
      </div>

      <BottomCta />
    </main>
  )
}

export default CourseDetail
