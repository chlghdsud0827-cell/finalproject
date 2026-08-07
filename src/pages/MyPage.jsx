import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApplications } from '../context/ApplicationContext.jsx'
import { useConsultations } from '../context/ConsultationContext.jsx'
import { useInquiries } from '../context/InquiryContext.jsx'
import { courses } from '../data/courses.js'
import { mentors } from '../data/mentors.js'
import {
  STATUS_LABEL as APP_STATUS_LABEL,
  STATUS_BADGE_CLASS as APP_STATUS_BADGE_CLASS,
} from '../utils/applicationStatus.js'
import {
  CONSULT_STATUS_LABEL,
  CONSULT_STATUS_BADGE_CLASS,
} from '../utils/consultationStatus.js'
import { getInquiryStatus } from '../utils/inquiryStatus.js'
import InquiryList from '../components/InquiryList.jsx'
import './MyPage.css'

const ROLE_LABEL = { mentor: '멘토', admin: '관리자' }

// 일반회원의 프로필 배지는 role('user') 고정 문구가 아니라 실제 지원 현황에서
// 도출한다 — 관리자가 지원 상태를 합격으로 바꾸면 role은 그대로 'user'라도
// 화면에는 "합격자"로 즉시 반영되어야 하기 때문(둘 다 같은 ApplicationContext
// state를 읽으므로 관리자 쪽에서 상태를 바꾸는 즉시 자동으로 갱신됨).
function applicantIdentity(applications) {
  if (applications.some((a) => a.status === 'confirmed')) {
    return { label: '합격자', className: 'badge--success' }
  }
  if (applications.some((a) => a.status === 'waiting')) {
    return { label: '대기자', className: 'badge--waiting' }
  }
  return { label: '지원자', className: 'badge--waiting' }
}
const CONSULT_ACTIVE_STATUSES = ['matched', 'in_progress']

function courseTitle(courseId) {
  return courses.find((c) => c.id === courseId)?.title ?? '알 수 없는 과정'
}

function mentorName(mentorId) {
  return mentors.find((m) => m.id === mentorId)?.name ?? null
}

function ApplicationsTab() {
  const { getMyApplications, cancelApplication } = useApplications()
  const applications = getMyApplications()

  if (applications.length === 0) {
    return <p className="mypage__empty">아직 지원한 과정이 없습니다.</p>
  }

  return (
    <ul className="mypage__list">
      {applications.map((app) => (
        <li key={app.id} className="mypage__item">
          <div>
            <p className="mypage__title">{courseTitle(app.courseId)}</p>
            <span className={`badge ${APP_STATUS_BADGE_CLASS[app.status]}`}>
              {APP_STATUS_LABEL[app.status]}
            </span>
          </div>
          {app.status !== 'cancelled' && app.status !== 'rejected' && (
            <button className="btn btn--secondary" onClick={() => cancelApplication(app.id)}>
              지원 취소
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

function ConsultationsTab() {
  const { getMyConsultations } = useConsultations()
  const consultations = getMyConsultations()

  if (consultations.length === 0) {
    return (
      <p className="mypage__empty">
        아직 신청한 상담이 없습니다. <Link to="/consultation">상담 신청하러 가기</Link>
      </p>
    )
  }

  return (
    <ul className="mypage__list">
      {consultations.map((c) => (
        <li key={c.id} className="mypage__item">
          <div>
            <p className="mypage__title">{c.category}</p>
            <p className="mypage__content">{c.content}</p>
            <span className={`badge ${CONSULT_STATUS_BADGE_CLASS[c.status]}`}>
              {CONSULT_STATUS_LABEL[c.status]}
            </span>
            {mentorName(c.mentorId) && (
              <span className="mypage__mentor">담당 멘토: {mentorName(c.mentorId)}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

// 일반회원 전용: 관리자가 배정해준 멘토들을 한눈에 보여주고, 바로
// 상담 신청・문의로 이어질 수 있도록 함. "내 멘토"는 별도로 저장되는 값이 아니라
// getMyConsultations()에서 mentorId가 있는 신청들을 멘토별로 묶어 최근 것만 남긴 것.
function MyMentorsSection() {
  const { getMyConsultations } = useConsultations()
  const consultations = getMyConsultations()

  const seen = new Set()
  const myMentors = []
  for (let i = consultations.length - 1; i >= 0; i -= 1) {
    const c = consultations[i]
    if (!c.mentorId || seen.has(c.mentorId)) continue
    seen.add(c.mentorId)
    const mentor = mentors.find((m) => m.id === c.mentorId)
    if (mentor) myMentors.push({ mentor, lastConsultation: c })
  }

  return (
    <section className="mypage__mentors-section" aria-label="내 멘토">
      <h2>내 멘토</h2>
      {myMentors.length === 0 ? (
        <p className="mypage__empty">
          아직 배정된 멘토가 없습니다. 상담을 신청하면 분야에 맞는 멘토가 자동으로
          배정됩니다. <Link to="/consultation">멘토 상담 신청하기 →</Link>
        </p>
      ) : (
        <ul className="mypage__mentor-list">
          {myMentors.map(({ mentor, lastConsultation }) => (
            <li key={mentor.id} className="mypage__mentor-card">
              {mentor.photo ? (
                <img
                  className="mypage__mentor-avatar mypage__mentor-avatar--img"
                  src={mentor.photo}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <div
                  className="mypage__mentor-avatar mypage__mentor-avatar--letter"
                  aria-hidden="true"
                >
                  {mentor.name.slice(0, 1)}
                </div>
              )}
              <div className="mypage__mentor-body">
                <p className="mypage__mentor-name">
                  {mentor.name} <span className="mypage__mentor-title">{mentor.title}</span>
                </p>
                <ul className="mypage__mentor-specialties">
                  {mentor.specialties.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="mypage__mentor-status">
                  최근 상담분야: {lastConsultation.category}{' '}
                  <span
                    className={`badge ${CONSULT_STATUS_BADGE_CLASS[lastConsultation.status]}`}
                  >
                    {CONSULT_STATUS_LABEL[lastConsultation.status]}
                  </span>
                </p>
              </div>
              <div className="mypage__mentor-actions">
                <Link className="btn btn--primary" to="/consultation">
                  상담 신청
                </Link>
                <Link className="btn btn--secondary" to="/inquiry">
                  문의하기
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function InquiriesTab() {
  const { getMyInquiries } = useInquiries()
  const inquiries = getMyInquiries()

  return (
    <InquiryList
      inquiries={inquiries}
      showAuthor={false}
      emptyMessage={
        <>
          아직 등록한 문의가 없습니다. <Link to="/inquiry">문의하러 가기</Link>
        </>
      }
    />
  )
}

function MyPage() {
  const { currentUser } = useAuth()
  const { getMyApplications } = useApplications()
  const { getMyConsultations } = useConsultations()
  const { getMyInquiries } = useInquiries()
  const [tab, setTab] = useState('applications')

  const applications = getMyApplications()
  const consultations = getMyConsultations()
  const inquiries = getMyInquiries()

  const appStats = {
    confirmed: applications.filter((a) => a.status === 'confirmed').length,
    waiting: applications.filter((a) => a.status === 'waiting').length,
    cancelled: applications.filter((a) => a.status === 'cancelled').length,
  }

  const consultStats = {
    active: consultations.filter((c) => CONSULT_ACTIVE_STATUSES.includes(c.status)).length,
    requested: consultations.filter((c) => c.status === 'requested').length,
    completed: consultations.filter((c) => c.status === 'completed').length,
  }

  const inquiryStats = {
    pending: inquiries.filter((i) => getInquiryStatus(i) === 'pending').length,
    answered: inquiries.filter((i) => getInquiryStatus(i) === 'answered').length,
  }

  const identity =
    currentUser.role === 'user'
      ? applicantIdentity(applications)
      : { label: ROLE_LABEL[currentUser.role], className: 'badge--success' }

  return (
    <main className="mypage">
      <div className="mypage__inner">
        <h1>마이페이지</h1>

        <div className="mypage__profile">
          <div className="mypage__profile-avatar">{currentUser.name.slice(0, 1)}</div>
          <div>
            <p className="mypage__profile-name">
              {currentUser.name}님{' '}
              <span className={`badge ${identity.className}`}>{identity.label}</span>
            </p>
            <p className="mypage__profile-email">{currentUser.email}</p>
          </div>
        </div>

        {currentUser.role === 'user' && <MyMentorsSection />}

        <div className="mypage__stat-grid">
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{appStats.confirmed}</span>
            <span className="mypage__stat-label">지원 합격</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{appStats.waiting}</span>
            <span className="mypage__stat-label">지원 대기중</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{appStats.cancelled}</span>
            <span className="mypage__stat-label">지원 취소</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{consultStats.active}</span>
            <span className="mypage__stat-label">상담 진행중</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{consultStats.requested}</span>
            <span className="mypage__stat-label">상담 배정대기</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{consultStats.completed}</span>
            <span className="mypage__stat-label">상담 완료</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{inquiryStats.pending}</span>
            <span className="mypage__stat-label">문의 답변대기</span>
          </div>
          <div className="mypage__stat-card">
            <span className="mypage__stat-value">{inquiryStats.answered}</span>
            <span className="mypage__stat-label">문의 답변완료</span>
          </div>
        </div>

        <div className="mypage__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'applications'}
            className={`mypage__tab ${tab === 'applications' ? 'mypage__tab--active' : ''}`}
            onClick={() => setTab('applications')}
          >
            지원 현황
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'consultations'}
            className={`mypage__tab ${tab === 'consultations' ? 'mypage__tab--active' : ''}`}
            onClick={() => setTab('consultations')}
          >
            상담 현황
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'inquiries'}
            className={`mypage__tab ${tab === 'inquiries' ? 'mypage__tab--active' : ''}`}
            onClick={() => setTab('inquiries')}
          >
            문의 내역
          </button>
        </div>

        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'consultations' && <ConsultationsTab />}
        {tab === 'inquiries' && <InquiriesTab />}
      </div>
    </main>
  )
}

export default MyPage
