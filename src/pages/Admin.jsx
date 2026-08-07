import { useEffect, useRef, useState } from 'react'
import { useApplications } from '../context/ApplicationContext.jsx'
import { useConsultations } from '../context/ConsultationContext.jsx'
import { useCallbackRequests } from '../context/CallbackContext.jsx'
import { useInquiries } from '../context/InquiryContext.jsx'
import { useSchedule } from '../context/ScheduleContext.jsx'
import { courses, DEFAULT_COURSE_ID } from '../data/courses.js'
import { mentors } from '../data/mentors.js'
import { instructors } from '../data/instructors.js'
import { mockUsers } from '../data/users.js'
import { STATUS_LABEL, STATUS_BADGE_CLASS } from '../utils/applicationStatus.js'
import {
  CONSULT_STATUS_LABEL,
  CONSULT_STATUS_BADGE_CLASS,
} from '../utils/consultationStatus.js'
import {
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_BADGE_CLASS,
  getInquiryStatus,
} from '../utils/inquiryStatus.js'
import './Admin.css'

const STATUS_OPTIONS = ['pending', 'confirmed', 'waiting', 'rejected', 'cancelled']
const CONSULT_ACTIVE_STATUSES = ['matched', 'in_progress']
const EVENT_TYPE_OPTIONS = ['recruiting', 'course', 'event']
const EVENT_TYPE_LABEL = { recruiting: '모집', course: '수업', event: '행사' }

// 한 페이지에 모든 관리 섹션이 길게 이어져 있어 찾기 어렵다는 피드백으로 탭 분리.
const ADMIN_TABS = [
  { id: 'summary', label: '요약' },
  { id: 'applications', label: '지원자 관리' },
  { id: 'staff', label: '강사・멘토' },
  { id: 'consultations', label: '상담 관리' },
  { id: 'inquiries', label: '문의 관리' },
  { id: 'schedule', label: '학원 일정' },
]

function courseTitle(courseId) {
  return courses.find((c) => c.id === courseId)?.title ?? '알 수 없는 과정'
}

function mentorName(mentorId) {
  return mentors.find((m) => m.id === mentorId)?.name ?? '미배정'
}

// 시드 지원자는 name 필드를 직접 갖고, 실제 로그인 후 지원한 사용자는 계정 이름을 조회한다.
function applicantName(app) {
  return app.name ?? mockUsers.find((u) => u.id === app.userId)?.name ?? app.userId
}

// 시드 상담 신청은 name 필드를 직접 갖고, 실제 로그인 후 신청한 학생은 계정 이름을 조회한다.
function consultantStudentName(c) {
  return c.name ?? mockUsers.find((u) => u.id === c.studentId)?.name ?? c.studentId
}

// 로그인 후 작성한 문의는 계정 이름을, 비회원 문의는 작성 시 입력한 이름을 "(비회원)" 태그와 함께 보여준다.
function inquiryAuthorName(inquiry) {
  if (inquiry.userId) {
    return mockUsers.find((u) => u.id === inquiry.userId)?.name ?? inquiry.userId
  }
  return `${inquiry.name ?? '비회원'} (비회원)`
}

function StatCard({ value, label, tone, onClick }) {
  return (
    <button
      type="button"
      className={`admin__stat-card${tone ? ` admin__stat-card--${tone}` : ''}`}
      onClick={onClick}
    >
      <span className="admin__stat-value">{value}</span>
      <span className="admin__stat-label">{label}</span>
    </button>
  )
}

function InquiryReplyForm({ onSubmit }) {
  const [content, setContent] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit(content.trim())
    setContent('')
  }

  return (
    <form className="admin__inquiry-reply-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        placeholder="답변을 입력해 주세요."
        required
      />
      <button className="btn btn--primary" type="submit">
        답변 등록
      </button>
    </form>
  )
}

// 신규 등록(initial 없음)과 수정(initial 있음)을 함께 처리하는 폼.
function ScheduleEventForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [type, setType] = useState(initial?.type ?? 'event')
  const [courseId, setCourseId] = useState(initial?.courseId ?? DEFAULT_COURSE_ID)
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const titleInputRef = useRef(null)

  // 수정 모드로 진입할 때(=initial이 있을 때) 제목 입력칸에 자동으로 포커스를 줘서
  // "수정" 버튼을 눌렀을 때 폼이 어디로 바뀌었는지 바로 눈에 들어오게 한다.
  useEffect(() => {
    if (initial) titleInputRef.current?.focus()
  }, [initial])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !startDate || !endDate) return
    onSubmit({ title: title.trim(), type, courseId, startDate, endDate })
    if (!initial) {
      setTitle('')
      setStartDate('')
      setEndDate('')
    }
  }

  return (
    <form className="admin__schedule-form" onSubmit={handleSubmit}>
      <label>
        제목
        <input
          ref={titleInputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="일정 제목"
          required
        />
      </label>
      <label>
        구분
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {EVENT_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      </label>
      <label>
        과정
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        시작일
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </label>
      <label>
        종료일
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </label>
      <div className="admin__schedule-form-actions">
        <button className="btn btn--primary" type="submit">
          {initial ? '수정 완료' : '일정 추가'}
        </button>
        {initial && (
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            취소
          </button>
        )}
      </div>
    </form>
  )
}

function Admin() {
  const { getAllApplications, adminUpdateApplicationStatus, getCourseWithCapacity } =
    useApplications()
  const { getAllConsultations, adminAssignMentor, getMentorLoad, getMentorConsultations } =
    useConsultations()
  const { getAllCallbackRequests, markContacted, assignCallbackMentor } = useCallbackRequests()
  const { getAllInquiries, replyToInquiry } = useInquiries()
  const { getAllEvents, addEvent, updateEvent, deleteEvent } = useSchedule()
  const [bulkStatus, setBulkStatus] = useState('confirmed')
  const [editingEventId, setEditingEventId] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const scheduleFormRef = useRef(null)
  // 지원자 관리는 현재 모집 중인 국비지원 과정 지원자만 대상으로 한다(다른 과정은 모집 전이라 지원 데이터 자체가 없음).
  const applications = getAllApplications().filter((a) => a.courseId === DEFAULT_COURSE_ID)
  const consultations = getAllConsultations()
  const callbackRequests = getAllCallbackRequests()
  const inquiries = getAllInquiries()
  const course = getCourseWithCapacity(DEFAULT_COURSE_ID)

  const appStats = {
    confirmed: applications.filter((a) => a.status === 'confirmed').length,
    pending: applications.filter((a) => a.status === 'pending').length,
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

  function handleBulkStatusUpdate() {
    if (applications.length === 0) return
    const ok = window.confirm(
      `표시된 지원자 ${applications.length}명 전원을 "${STATUS_LABEL[bulkStatus]}" 상태로 변경하시겠습니까?`,
    )
    if (!ok) return
    applications.forEach((app) => adminUpdateApplicationStatus(app.id, bulkStatus))
  }

  const callbackStats = {
    pending: callbackRequests.filter((r) => !r.contacted).length,
    contacted: callbackRequests.filter((r) => r.contacted).length,
  }

  // 멘토 진행 건수는 정규 상담(matched/in_progress)과, 아직 연락하지 않은 비회원
  // 상담 신청 배정 건을 합산한다 — 비회원 신청에 멘토를 지정해도 지금까지는 이
  // 숫자에 전혀 반영되지 않아, 관리자 화면 어디를 봐도 배정 여부를 알 수 없었다.
  function mentorLoad(mentorId) {
    const consultLoad = getMentorLoad(mentorId)
    const callbackLoad = callbackRequests.filter(
      (r) => r.mentorId === mentorId && !r.contacted,
    ).length
    return consultLoad + callbackLoad
  }

  // "담당 회원" 목록 — 정규 상담(matched/in_progress) + 아직 연락하지 않은 비회원
  // 배정 건을 합쳐, 멘토별로 지금 누구를 맡고 있는지 이름까지 바로 보여준다.
  function mentorRoster(mentorId) {
    const consultRoster = getMentorConsultations(mentorId)
      .filter((c) => CONSULT_ACTIVE_STATUSES.includes(c.status))
      .map((c) => ({
        key: c.id,
        name: consultantStudentName(c),
        detail: `${c.category} · ${CONSULT_STATUS_LABEL[c.status]}`,
      }))
    const callbackRoster = callbackRequests
      .filter((r) => r.mentorId === mentorId && !r.contacted)
      .map((r) => ({ key: r.id, name: r.name, detail: '비회원 상담 · 연락대기' }))
    return [...consultRoster, ...callbackRoster]
  }

  const scheduleEventsList = [...getAllEvents()].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  )
  const editingEvent = scheduleEventsList.find((e) => e.id === editingEventId) ?? null

  function handleScheduleSubmit(data) {
    if (editingEventId) {
      updateEvent(editingEventId, data)
      setEditingEventId(null)
    } else {
      addEvent(data)
    }
  }

  function handleScheduleDelete(id) {
    const ok = window.confirm('이 일정을 삭제하시겠습니까?')
    if (!ok) return
    deleteEvent(id)
    if (editingEventId === id) setEditingEventId(null)
  }

  // "수정" 클릭 시 표의 어느 항목을 고르든 위쪽 폼으로 시선이 바로 이동하도록,
  // 상태 변경과 동시에 폼 영역을 화면 중앙으로 스크롤한다(제목 입력 포커스는
  // ScheduleEventForm 안에서 initial이 채워질 때 자동으로 처리됨).
  function handleScheduleEditClick(id) {
    setEditingEventId(id)
    scheduleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className="admin">
      <div className="admin__inner">
        <h1>관리자 대시보드</h1>

        <div className="admin__tabs" role="tablist">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`admin__tab ${activeTab === tab.id ? 'admin__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
        <section className="admin__section admin__summary" aria-label="요약 통계">
          <h2>요약 통계</h2>
          <p className="admin__desc">카드를 누르면 해당 관리 탭으로 바로 이동합니다.</p>

          <div className="admin__summary-groups">
            <div className="admin__stat-group">
              <h3 className="admin__stat-group-title">지원자 현황</h3>
              <div className="admin__stat-grid">
                <StatCard
                  value={course ? `${course.confirmedCount}/${course.capacity}` : '-'}
                  label="정원 대비 확정"
                  onClick={() => setActiveTab('applications')}
                />
                <StatCard
                  value={appStats.confirmed}
                  label="합격"
                  tone="success"
                  onClick={() => setActiveTab('applications')}
                />
                <StatCard
                  value={appStats.pending}
                  label="심사중"
                  tone="waiting"
                  onClick={() => setActiveTab('applications')}
                />
                <StatCard
                  value={appStats.waiting}
                  label="대기중"
                  tone="waiting"
                  onClick={() => setActiveTab('applications')}
                />
                <StatCard
                  value={appStats.cancelled}
                  label="취소"
                  tone="cancel"
                  onClick={() => setActiveTab('applications')}
                />
              </div>
            </div>

            <div className="admin__stat-group">
              <h3 className="admin__stat-group-title">상담 현황</h3>
              <div className="admin__stat-grid">
                <StatCard
                  value={consultStats.active}
                  label="진행중"
                  tone="success"
                  onClick={() => setActiveTab('consultations')}
                />
                <StatCard
                  value={consultStats.requested}
                  label="배정 대기중"
                  tone="waiting"
                  onClick={() => setActiveTab('consultations')}
                />
                <StatCard
                  value={consultStats.completed}
                  label="완료"
                  onClick={() => setActiveTab('consultations')}
                />
              </div>
            </div>

            <div className="admin__stat-group">
              <h3 className="admin__stat-group-title">비회원 상담 신청 현황</h3>
              <div className="admin__stat-grid">
                <StatCard
                  value={callbackStats.pending}
                  label="연락대기"
                  tone="waiting"
                  onClick={() => setActiveTab('consultations')}
                />
                <StatCard
                  value={callbackStats.contacted}
                  label="연락완료"
                  onClick={() => setActiveTab('consultations')}
                />
              </div>
            </div>

            <div className="admin__stat-group">
              <h3 className="admin__stat-group-title">문의 현황</h3>
              <div className="admin__stat-grid">
                <StatCard
                  value={inquiryStats.pending}
                  label="답변대기"
                  tone="waiting"
                  onClick={() => setActiveTab('inquiries')}
                />
                <StatCard
                  value={inquiryStats.answered}
                  label="답변완료"
                  onClick={() => setActiveTab('inquiries')}
                />
              </div>
            </div>
          </div>
        </section>
        )}

        {activeTab === 'applications' && (
        <section className="admin__section">
          <h2>지원자 관리</h2>
          <p className="admin__desc">
            현재 모집 중인 국비지원 과정 지원자만 표시합니다(다른 과정은 모집예정
            상태라 지원 데이터가 없습니다). 지원 접수 시 항상 "심사중" 상태로
            들어오며, 멘토 상담을 완료한 지원자만 지원할 수 있습니다. 심사 후
            합격/불합격으로 변경해 주세요(정원 초과 시 합격 처리는 제한됩니다).
            확정 상태였던 지원자를 취소/변경해도 대기 1순위가 자동으로 승격되지
            않으니, 빈 자리가 생기면 대기중인 지원자를 직접 합격으로 변경해
            주세요.
          </p>

          <div className="admin__bulk-actions">
            <label>
              전체 상태 일괄 변경
              <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn btn--secondary" onClick={handleBulkStatusUpdate}>
              전원 일괄 변경 적용
            </button>
          </div>

          <table className="admin__table">
            <thead>
              <tr>
                <th>지원자</th>
                <th>과정</th>
                <th>지원일</th>
                <th>상태</th>
                <th>상태 변경</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const courseInfo = getCourseWithCapacity(app.courseId)
                const courseIsFull = !!courseInfo && courseInfo.remaining <= 0

                return (
                  <tr key={app.id}>
                    <td data-label="지원자">{applicantName(app)}</td>
                    <td data-label="과정">{courseTitle(app.courseId)}</td>
                    <td data-label="지원일">
                      {new Date(app.appliedAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td data-label="상태">
                      <span className={`badge ${STATUS_BADGE_CLASS[app.status]}`}>
                        {STATUS_LABEL[app.status]}
                      </span>
                    </td>
                    <td data-label="상태 변경">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          adminUpdateApplicationStatus(app.id, e.target.value)
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                            disabled={
                              status === 'confirmed' &&
                              app.status !== 'confirmed' &&
                              courseIsFull
                            }
                          >
                            {STATUS_LABEL[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        )}

        {activeTab === 'staff' && (
        <>
        <section className="admin__section" aria-label="강사 관리">
          <h2>강사 관리</h2>
          <p className="admin__desc">현재 등록된 강사진과 담당 커리큘럼입니다.</p>
          <div className="admin__mentor-grid">
            {instructors.map((i) => (
              <div key={i.id} className="admin__mentor-card">
                <strong>
                  {i.name} <span className="admin__instructor-title">{i.title}</span>
                </strong>
                <span className="admin__mentor-specialties">{i.specialty}</span>
                <span className="admin__mentor-load">{i.curriculum}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin__section" aria-label="멘토 현황">
          <h2>멘토 현황</h2>
          <p className="admin__desc">
            정규 상담(관리자 수동 배정)과 비회원 상담 신청 배정을 합산한 현재 진행
            건수와, 지금 담당하고 있는 회원 명단입니다. 지수・태호처럼 이미
            배정된 멘토도 여기서 항상 전원 확인할 수 있습니다.
          </p>
          <div className="admin__mentor-grid">
            {mentors.map((m) => {
              const roster = mentorRoster(m.id)
              return (
                <div key={m.id} className="admin__mentor-card">
                  <strong>{m.name}</strong>
                  <span className="admin__mentor-specialties">
                    {m.specialties.join(' · ')}
                  </span>
                  <span className="admin__mentor-load">
                    진행중 {mentorLoad(m.id)}/{m.maxConcurrent}건
                  </span>
                  {roster.length > 0 ? (
                    <ul className="admin__mentor-roster">
                      {roster.map((r) => (
                        <li key={r.key}>
                          {r.name} · {r.detail}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="admin__mentor-roster-empty">담당 중인 회원 없음</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
        </>
        )}

        {activeTab === 'consultations' && (
        <>
        <section className="admin__section">
          <h2>상담 매칭 모니터링</h2>
          <p className="admin__desc">
            모든 상담 신청은 자동으로 배정되지 않고 "배정 대기중" 상태로 접수됩니다.
            요청 내용을 확인하고 담당 멘토를 직접 지정하세요 — 멘토 선택 목록은
            상담 분야와 전문분야가 일치하고 여유가 있는 멘토가 상단에 먼저
            표시됩니다.
          </p>

          <table className="admin__table">
            <thead>
              <tr>
                <th>학생</th>
                <th>분야</th>
                <th>요청 내용</th>
                <th>담당 멘토</th>
                <th>상태</th>
                <th>수동 배정</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c) => {
                const rankedMentors = [...mentors]
                  .map((m) => ({
                    mentor: m,
                    load: mentorLoad(m.id),
                    matched: m.specialties.includes(c.category),
                  }))
                  .sort((a, b) => {
                    if (a.matched !== b.matched) return a.matched ? -1 : 1
                    return a.load - b.load
                  })

                return (
                  <tr key={c.id}>
                    <td data-label="학생">{consultantStudentName(c)}</td>
                    <td data-label="분야">{c.category}</td>
                    <td data-label="요청 내용" className="admin__table-content">
                      {c.content}
                    </td>
                    <td data-label="담당 멘토">{mentorName(c.mentorId)}</td>
                    <td data-label="상태">
                      <span className={`badge ${CONSULT_STATUS_BADGE_CLASS[c.status]}`}>
                        {CONSULT_STATUS_LABEL[c.status]}
                      </span>
                    </td>
                    <td data-label="수동 배정">
                      {c.status === 'requested' ? (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) adminAssignMentor(c.id, e.target.value)
                          }}
                        >
                          <option value="" disabled>
                            멘토 선택
                          </option>
                          {rankedMentors.map(({ mentor, load, matched }) => (
                            <option key={mentor.id} value={mentor.id}>
                              {mentor.name}
                              {matched ? ' · 분야 일치' : ''} (진행중 {load}/
                              {mentor.maxConcurrent})
                            </option>
                          ))}
                        </select>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <section className="admin__section" aria-label="비회원 상담 신청 관리">
          <h2>상담 신청 관리 (비회원)</h2>
          <p className="admin__desc">
            로그인 없이 접수된 상담 신청입니다. 분야 선택 없이 접수되므로 문의
            내용을 참고해 담당 멘토를 직접 지정해 주세요. 지정하면 해당 멘토의
            대시보드에도 바로 노출되어 멘토가 직접 "연락완료"로 표시할 수
            있습니다(관리자도 여기서 동일하게 처리 가능).
          </p>

          <ul className="admin__inquiry-list">
            {callbackRequests.map((r) => (
              <li key={r.id} className="admin__inquiry-item">
                <div className="admin__inquiry-head">
                  <div>
                    <p className="admin__inquiry-title">
                      {r.name} · {r.phone}
                    </p>
                    <span className="admin__inquiry-meta">
                      {new Date(r.requestedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <span
                    className={`badge ${r.contacted ? 'badge--success' : 'badge--waiting'}`}
                  >
                    {r.contacted ? '연락완료' : '연락대기'}
                  </span>
                </div>
                <p className="admin__inquiry-content">{r.content}</p>
                <div className="admin__callback-mentor">
                  <label>
                    담당 멘토
                    <select
                      value={r.mentorId ?? ''}
                      onChange={(e) =>
                        assignCallbackMentor(r.id, e.target.value || null)
                      }
                    >
                      <option value="">미지정</option>
                      {mentors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (진행중 {mentorLoad(m.id)}/{m.maxConcurrent})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {!r.contacted && (
                  <button
                    className="btn btn--primary admin__contact-btn"
                    type="button"
                    onClick={() => markContacted(r.id)}
                  >
                    연락완료로 표시
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
        </>
        )}

        {activeTab === 'inquiries' && (
        <section className="admin__section" aria-label="문의 관리">
          <h2>문의 관리</h2>
          <p className="admin__desc">
            지원자가 남긴 문의에 답변을 등록하면 상태가 자동으로 "답변완료"로
            바뀝니다. 답변은 1건만 등록할 수 있습니다.
          </p>

          <ul className="admin__inquiry-list">
            {inquiries.map((inquiry) => {
              const status = getInquiryStatus(inquiry)
              return (
                <li key={inquiry.id} className="admin__inquiry-item">
                  <div className="admin__inquiry-head">
                    <div>
                      <p className="admin__inquiry-title">{inquiry.title}</p>
                      <span className="admin__inquiry-meta">
                        {inquiryAuthorName(inquiry)} ·{' '}
                        {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                        {(inquiry.contact || inquiry.email) && (
                          <>
                            {' '}
                            · 연락처 {inquiry.contact || '-'} / 이메일{' '}
                            {inquiry.email || '-'}
                          </>
                        )}
                      </span>
                    </div>
                    <span className={`badge ${INQUIRY_STATUS_BADGE_CLASS[status]}`}>
                      {INQUIRY_STATUS_LABEL[status]}
                    </span>
                  </div>
                  <p className="admin__inquiry-content">{inquiry.content}</p>
                  {inquiry.reply ? (
                    <div className="admin__inquiry-reply">
                      <strong>답변</strong>
                      <p>{inquiry.reply.content}</p>
                    </div>
                  ) : (
                    <InquiryReplyForm
                      onSubmit={(content) => replyToInquiry(inquiry.id, content)}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </section>
        )}

        {activeTab === 'schedule' && (
        <section className="admin__section" aria-label="학원 일정 관리">
          <h2>학원 일정 관리</h2>
          <p className="admin__desc">
            /schedule에 표시되는 모집・수업・행사 일정을 추가・수정・삭제할 수
            있습니다.
          </p>

          <div
            ref={scheduleFormRef}
            className={`admin__schedule-form-wrap ${editingEvent ? 'admin__schedule-form-wrap--editing' : ''}`}
          >
            {editingEvent && (
              <p className="admin__schedule-editing-flag">
                ✏️ <strong>{editingEvent.title}</strong> 일정을 수정하고 있습니다
              </p>
            )}
            <ScheduleEventForm
              key={editingEventId ?? 'new'}
              initial={editingEvent}
              onSubmit={handleScheduleSubmit}
              onCancel={() => setEditingEventId(null)}
            />
          </div>

          <table className="admin__table">
            <thead>
              <tr>
                <th>제목</th>
                <th>구분</th>
                <th>과정</th>
                <th>기간</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {scheduleEventsList.map((e) => (
                <tr
                  key={e.id}
                  className={
                    editingEventId === e.id ? 'admin__schedule-row--editing' : undefined
                  }
                >
                  <td data-label="제목">{e.title}</td>
                  <td data-label="구분">
                    <span className={`badge admin__type-badge--${e.type}`}>
                      {EVENT_TYPE_LABEL[e.type]}
                    </span>
                  </td>
                  <td data-label="과정">{courseTitle(e.courseId)}</td>
                  <td data-label="기간">
                    {e.startDate === e.endDate
                      ? e.startDate
                      : `${e.startDate} ~ ${e.endDate}`}
                  </td>
                  <td data-label="관리">
                    <div className="admin__schedule-row-actions">
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleScheduleEditClick(e.id)}
                      >
                        {editingEventId === e.id ? '수정 중' : '수정'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => handleScheduleDelete(e.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        )}
      </div>
    </main>
  )
}

export default Admin
