import { useAuth } from '../context/AuthContext.jsx'
import { useConsultations } from '../context/ConsultationContext.jsx'
import { useCallbackRequests } from '../context/CallbackContext.jsx'
import { mentors } from '../data/mentors.js'
import {
  CONSULT_STATUS_LABEL,
  CONSULT_STATUS_BADGE_CLASS,
} from '../utils/consultationStatus.js'
import './MentorDashboard.css'

function MentorDashboard() {
  const { currentUser } = useAuth()
  const {
    getMentorConsultations,
    getMentorLoad,
    acceptConsultation,
    declineConsultation,
    completeConsultation,
    setConsultationStatus,
  } = useConsultations()
  const { getAllCallbackRequests, markContacted } = useCallbackRequests()

  const mentor = mentors.find((m) => m.id === currentUser.mentorId)
  const myConsultations = getMentorConsultations(mentor.id)
  // 관리자가 배정한 비회원 상담 신청 — 분야 매칭 없이 관리자가 직접 지정한다.
  const myCallbackRequests = getAllCallbackRequests().filter(
    (r) => r.mentorId === mentor.id,
  )
  // 상단 "현재 진행" 건수는 정규 상담(matched/in_progress)과 아직 연락하지 않은
  // 비회원 상담 신청을 합산 — Admin.jsx의 멘토 현황과 동일한 계산식을 쓴다.
  const load =
    getMentorLoad(mentor.id) + myCallbackRequests.filter((r) => !r.contacted).length

  return (
    <main className="mentor-dashboard">
      <div className="mentor-dashboard__inner">
        <h1>멘토 대시보드</h1>
        <p className="mentor-dashboard__load">
          {mentor.name} 멘토 · 현재 진행 {load}/{mentor.maxConcurrent}건
        </p>

        {myConsultations.length === 0 ? (
          <p className="mentor-dashboard__empty">배정된 상담이 없습니다.</p>
        ) : (
          <ul className="mentor-dashboard__list">
            {myConsultations.map((c) => (
              <li key={c.id} className="mentor-dashboard__item">
                <div>
                  <p className="mentor-dashboard__category">{c.category}</p>
                  <p className="mentor-dashboard__content">{c.content}</p>
                  <span className={`badge ${CONSULT_STATUS_BADGE_CLASS[c.status]}`}>
                    {CONSULT_STATUS_LABEL[c.status]}
                  </span>
                </div>
                <div className="mentor-dashboard__actions">
                  {c.status === 'matched' && (
                    <>
                      <button
                        className="btn btn--primary"
                        onClick={() => acceptConsultation(c.id)}
                      >
                        수락
                      </button>
                      <button
                        className="btn btn--secondary"
                        onClick={() => declineConsultation(c.id)}
                      >
                        거절
                      </button>
                    </>
                  )}
                  {c.status === 'in_progress' && (
                    <button
                      className="btn btn--primary"
                      onClick={() => completeConsultation(c.id)}
                    >
                      완료 처리
                    </button>
                  )}
                  <label className="mentor-dashboard__status-fix">
                    상태 직접 변경
                    <select
                      value={c.status}
                      onChange={(e) => setConsultationStatus(c.id, e.target.value)}
                    >
                      <option value="matched">{CONSULT_STATUS_LABEL.matched}</option>
                      <option value="in_progress">{CONSULT_STATUS_LABEL.in_progress}</option>
                      <option value="completed">{CONSULT_STATUS_LABEL.completed}</option>
                    </select>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mentor-dashboard__section-title">담당 비회원 상담 신청</h2>
        {myCallbackRequests.length === 0 ? (
          <p className="mentor-dashboard__empty">배정된 비회원 상담 신청이 없습니다.</p>
        ) : (
          <ul className="mentor-dashboard__list">
            {myCallbackRequests.map((r) => (
              <li key={r.id} className="mentor-dashboard__item">
                <div>
                  <p className="mentor-dashboard__category">
                    {r.name} · {r.phone}
                  </p>
                  <p className="mentor-dashboard__content">{r.content}</p>
                  <span
                    className={`badge ${r.contacted ? 'badge--success' : 'badge--waiting'}`}
                  >
                    {r.contacted ? '연락완료' : '연락대기'}
                  </span>
                </div>
                {!r.contacted && (
                  <div className="mentor-dashboard__actions">
                    <button
                      className="btn btn--primary"
                      onClick={() => markContacted(r.id)}
                    >
                      연락완료로 표시
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default MentorDashboard
