import { createContext, useContext, useState, useCallback } from 'react'
import { initialConsultations } from '../data/consultations.js'
import { useAuth } from './AuthContext.jsx'

const ConsultationContext = createContext(null)

const ACTIVE_STATUSES = ['matched', 'in_progress']

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
