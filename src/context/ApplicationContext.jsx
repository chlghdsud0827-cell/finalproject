import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { courses } from '../data/courses.js'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

const ApplicationContext = createContext(null)

function toApplication(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    courseId: row.course_id,
    status: row.status,
    appliedAt: row.applied_at,
  }
}

export function ApplicationProvider({ children }) {
  const { currentUser } = useAuth()
  const [applications, setApplications] = useState([])

  // 상태 값은 로컬 state에 캐시해두고 화면에서는 계속 동기 함수로 읽는다(AuthContext의
  // currentUser와 동일한 패턴) — 마이페이지・관리자・과정소개 페이지를 async로 바꾸지
  // 않아도 되도록, 실제로 비동기인 부분은 최초 조회와 아래 mutation 함수들뿐이다.
  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('applications').select('*')
    if (!error && data) {
      setApplications(data.map(toApplication))
    }
  }, [])

  // currentUser도 의존성에 넣어야 한다 — Supabase 세션 복원은 비동기라, 로그인된
  // 상태로 새로고침해도 이 effect가 세션 복원 완료 전에 먼저 실행되면 RLS(select
  // to authenticated)가 막아 빈 배열을 그대로 캐싱해버린다. currentUser가 null→
  // 실제 값으로 바뀌는 순간 한 번 더 조회되도록 해서 이 레이스를 없앤다.
  useEffect(() => {
    refetch()
  }, [refetch, currentUser])

  const getConfirmedCount = useCallback(
    (courseId) =>
      applications.filter((a) => a.courseId === courseId && a.status === 'confirmed')
        .length,
    [applications],
  )

  const getStatusCount = useCallback(
    (courseId, status) =>
      applications.filter((a) => a.courseId === courseId && a.status === status).length,
    [applications],
  )

  const getCourseWithCapacity = useCallback(
    (courseId) => {
      const course = courses.find((c) => c.id === courseId)
      if (!course) return null
      const confirmedCount = getConfirmedCount(courseId)
      return {
        ...course,
        confirmedCount,
        pendingCount: getStatusCount(courseId, 'pending'),
        remaining: Math.max(course.capacity - confirmedCount, 0),
      }
    },
    [getConfirmedCount, getStatusCount],
  )

  const getMyApplications = useCallback(
    () => (currentUser ? applications.filter((a) => a.userId === currentUser.id) : []),
    [applications, currentUser],
  )

  // 불합격/취소 건은 재지원을 막지 않는다 — 그 외(심사중/합격/대기중)는 이미 진행 중인
  // 지원건이 있는 것으로 보고 중복 지원을 막는다.
  const hasActiveApplication = useCallback(
    (courseId) =>
      !!currentUser &&
      applications.some(
        (a) =>
          a.userId === currentUser.id &&
          a.courseId === courseId &&
          a.status !== 'cancelled' &&
          a.status !== 'rejected',
      ),
    [applications, currentUser],
  )

  // 정원과 무관하게 항상 "심사중"으로 접수한다 — 합격/불합격은 관리자가 수동으로 결정한다
  // (updateApplicationStatus가 confirmed 전환 시 정원 초과 여부를 별도로 검증한다).
  const applyToCourse = useCallback(
    async (courseId) => {
      if (!currentUser) return
      if (hasActiveApplication(courseId)) return

      const course = courses.find((c) => c.id === courseId)
      if (!course) return

      const { error } = await supabase.from('applications').insert({
        user_id: currentUser.id,
        name: currentUser.name,
        course_id: courseId,
        status: 'pending',
      })
      if (!error) await refetch()
    },
    [currentUser, hasActiveApplication, refetch],
  )

  // 지원 취소(자기 취소)와 관리자 상태 변경이 공유하는 단일 갱신 함수.
  // 확정 좌석이 비어도 대기 1순위를 자동으로 승격하지 않는다 — 합/불은 관리자가
  // 매번 수동으로 결정한다(빈 자리는 지원 현황 배너의 "남은 자리" 수치로 실시간 확인 가능).
  const updateApplicationStatus = useCallback(
    async (applicationId, newStatus) => {
      const target = applications.find((a) => a.id === applicationId)
      if (!target || target.status === newStatus) return

      // 관리자가 대기/취소 건을 수동으로 합격 처리할 때, 신청 시점과 동일하게
      // 정원을 넘지 않는지 확인한다.
      if (newStatus === 'confirmed') {
        const course = courses.find((c) => c.id === target.courseId)
        const confirmedCount = applications.filter(
          (a) => a.courseId === target.courseId && a.status === 'confirmed',
        ).length
        if (course && confirmedCount >= course.capacity) return
      }

      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId)
      if (!error) await refetch()
    },
    [applications, refetch],
  )

  const cancelApplication = useCallback(
    (applicationId) => updateApplicationStatus(applicationId, 'cancelled'),
    [updateApplicationStatus],
  )

  const getAllApplications = useCallback(
    () => [...applications].sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt)),
    [applications],
  )

  const value = {
    getCourseWithCapacity,
    getMyApplications,
    getAllApplications,
    hasActiveApplication,
    applyToCourse,
    cancelApplication,
    adminUpdateApplicationStatus: updateApplicationStatus,
  }

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplications() {
  const ctx = useContext(ApplicationContext)
  if (!ctx) {
    throw new Error('useApplications는 ApplicationProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
