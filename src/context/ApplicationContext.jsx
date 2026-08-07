import { createContext, useContext, useState, useCallback } from 'react'
import { courses } from '../data/courses.js'
import { initialApplications } from '../data/applications.js'
import { useAuth } from './AuthContext.jsx'

const ApplicationContext = createContext(null)

export function ApplicationProvider({ children }) {
  const { currentUser } = useAuth()
  const [applications, setApplications] = useState(initialApplications)

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
    (courseId) => {
      if (!currentUser) return
      if (hasActiveApplication(courseId)) return

      const course = courses.find((c) => c.id === courseId)
      if (!course) return

      setApplications((prev) => [
        ...prev,
        {
          id: `app-${Date.now()}`,
          userId: currentUser.id,
          courseId,
          status: 'pending',
          appliedAt: new Date().toISOString(),
        },
      ])
    },
    [currentUser, hasActiveApplication],
  )

  // 지원 취소(자기 취소)와 관리자 상태 변경이 공유하는 단일 갱신 함수.
  // 확정 좌석이 비어도 대기 1순위를 자동으로 승격하지 않는다 — 합/불은 관리자가
  // 매번 수동으로 결정한다(빈 자리는 지원 현황 배너의 "남은 자리" 수치로 실시간 확인 가능).
  const updateApplicationStatus = useCallback((applicationId, newStatus) => {
    setApplications((prev) => {
      const target = prev.find((a) => a.id === applicationId)
      if (!target || target.status === newStatus) return prev

      // 관리자가 대기/취소 건을 수동으로 합격 처리할 때, 신청 시점과 동일하게
      // 정원을 넘지 않는지 확인한다.
      if (newStatus === 'confirmed') {
        const course = courses.find((c) => c.id === target.courseId)
        const confirmedCount = prev.filter(
          (a) => a.courseId === target.courseId && a.status === 'confirmed',
        ).length
        if (course && confirmedCount >= course.capacity) return prev
      }

      return prev.map((a) =>
        a.id === applicationId ? { ...a, status: newStatus } : a,
      )
    })
  }, [])

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
