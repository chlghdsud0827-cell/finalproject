import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

const ConsultationContext = createContext(null)

const ACTIVE_STATUSES = ['matched', 'in_progress']
const MENTOR_EDITABLE_STATUSES = ['matched', 'in_progress', 'completed']

function toConsultation(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    name: row.name,
    mentorId: row.mentor_id,
    category: row.category,
    content: row.content,
    status: row.status,
    requestedAt: row.requested_at,
  }
}

export function ConsultationProvider({ children }) {
  const { currentUser } = useAuth()
  const [consultations, setConsultations] = useState([])

  // ApplicationContext와 동일한 패턴 — 실제로 비동기인 부분(최초 조회, 아래
  // mutation 함수들)만 Supabase 호출로 바꾸고, 화면에서는 계속 로컬 state를
  // 동기 함수로 읽는다.
  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('consultations').select('*')
    if (!error && data) {
      setConsultations(data.map(toConsultation))
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

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
    async (category, content) => {
      if (!currentUser) return false

      const { error } = await supabase.from('consultations').insert({
        student_id: currentUser.id,
        name: currentUser.name,
        category,
        content,
        status: 'requested',
      })
      if (error) return false

      await refetch()
      return true
    },
    [currentUser, refetch],
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

  const acceptConsultation = useCallback(
    async (consultationId) => {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'in_progress' })
        .eq('id', consultationId)
        .eq('status', 'matched')
      if (!error) await refetch()
    },
    [refetch],
  )

  const completeConsultation = useCallback(
    async (consultationId) => {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'completed' })
        .eq('id', consultationId)
        .eq('status', 'in_progress')
      if (!error) await refetch()
    },
    [refetch],
  )

  // 멘토가 "수락"・"완료 처리" 버튼을 잘못 눌렀을 때 직접 되돌릴 수 있도록,
  // matched・in_progress・completed 사이를 자유롭게 오갈 수 있게 하는 수동 보정
  // 기능(요청 대기 상태로는 못 돌아가게 막음 — 배정 해제는 거절 버튼의 역할이라
  // 여기서 같이 처리하면 mentorId가 붙은 채로 요청 대기 상태가 되는 모순이 생김).
  const setConsultationStatus = useCallback(
    async (consultationId, status) => {
      if (!MENTOR_EDITABLE_STATUSES.includes(status)) return
      const { error } = await supabase
        .from('consultations')
        .update({ status })
        .eq('id', consultationId)
      if (!error) await refetch()
    },
    [refetch],
  )

  // 멘토 거절: 배정을 풀고 관리자 수동 배정 대기(requested)로 되돌린다
  // (자동 재매칭 없음 — 다른 멘토 배정도 관리자가 직접 선택해야 한다).
  const declineConsultation = useCallback(
    async (consultationId) => {
      const { error } = await supabase
        .from('consultations')
        .update({ mentor_id: null, status: 'requested' })
        .eq('id', consultationId)
      if (!error) await refetch()
    },
    [refetch],
  )

  const adminAssignMentor = useCallback(
    async (consultationId, mentorId) => {
      const { error } = await supabase
        .from('consultations')
        .update({ mentor_id: mentorId, status: 'matched' })
        .eq('id', consultationId)
      if (!error) await refetch()
    },
    [refetch],
  )

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
