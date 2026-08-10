import { createContext, useContext, useState, useCallback } from 'react'
import { initialConsultations } from '../data/consultations.js'
import { useAuth } from './AuthContext.jsx'

const ConsultationContext = createContext(null)

const ACTIVE_STATUSES = ['matched', 'in_progress']
const MENTOR_EDITABLE_STATUSES = ['matched', 'in_progress', 'completed']

export function ConsultationProvider({ children }) {
  const { currentUser } = useAuth()
  const [consultations, setConsultations] = useState(initialConsultations)

  const getMentorLoad = useCallback(
    (mentorId) =>
      consultations.filter(
        (c) => c.mentorId === mentorId && ACTIVE_STATUSES.includes(c.status),
      ).length,
    [consultations],
  )

  // 신청은 항상 requested 상태로 접수되고, 담당 멘토는 관리자가 신청 내용을 직접
  // 확인한 뒤 "상담 매칭 모니터링"에서 수동으로 배정한다(자동 매칭 없음).
  const requestConsultation = useCallback(
    (category, content) => {
      if (!currentUser) return false

      setConsultations((prev) => [
        ...prev,
        {
          id: `consult-${Date.now()}`,
          studentId: currentUser.id,
          mentorId: null,
          category,
          content,
          status: 'requested',
          requestedAt: new Date().toISOString(),
        },
      ])

      return true
    },
    [currentUser],
  )

  const getMyConsultations = useCallback(
    () => (currentUser ? consultations.filter((c) => c.studentId === currentUser.id) : []),
    [consultations, currentUser],
  )

  const getMentorConsultations = useCallback(
    (mentorId) => consultations.filter((c) => c.mentorId === mentorId),
    [consultations],
  )

  const getAllConsultations = useCallback(
    () =>
      [...consultations].sort(
        (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
      ),
    [consultations],
  )

  const acceptConsultation = useCallback((consultationId) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId && c.status === 'matched'
          ? { ...c, status: 'in_progress' }
          : c,
      ),
    )
  }, [])

  const completeConsultation = useCallback((consultationId) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId && c.status === 'in_progress'
          ? { ...c, status: 'completed' }
          : c,
      ),
    )
  }, [])

  // 멘토가 "수락"・"완료 처리" 버튼을 잘못 눌렀을 때 직접 되돌릴 수 있도록,
  // matched・in_progress・completed 사이를 자유롭게 오갈 수 있게 하는 수동 보정
  // 기능(요청 대기 상태로는 못 돌아가게 막음 — 배정 해제는 거절 버튼의 역할이라
  // 여기서 같이 처리하면 mentorId가 붙은 채로 요청 대기 상태가 되는 모순이 생김).
  const setConsultationStatus = useCallback((consultationId, status) => {
    if (!MENTOR_EDITABLE_STATUSES.includes(status)) return
    setConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, status } : c)),
    )
  }, [])

  // 멘토 거절: 배정을 풀고 관리자 수동 배정 대기(requested)로 되돌린다
  // (자동 재매칭 없음 — 다른 멘토 배정도 관리자가 직접 선택해야 한다).
  const declineConsultation = useCallback((consultationId) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId ? { ...c, mentorId: null, status: 'requested' } : c,
      ),
    )
  }, [])

  const adminAssignMentor = useCallback((consultationId, mentorId) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId ? { ...c, mentorId, status: 'matched' } : c,
      ),
    )
  }, [])

  const value = {
    requestConsultation,
    getMyConsultations,
    getMentorConsultations,
    getAllConsultations,
    getMentorLoad,
    acceptConsultation,
    completeConsultation,
    declineConsultation,
    adminAssignMentor,
    setConsultationStatus,
  }

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  )
}

export function useConsultations() {
  const ctx = useContext(ConsultationContext)
  if (!ctx) {
    throw new Error('useConsultations는 ConsultationProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
