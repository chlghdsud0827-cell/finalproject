import { createContext, useContext, useState, useCallback } from 'react'
import { initialCallbackRequests } from '../data/callbackRequests.js'

const CallbackContext = createContext(null)

export function CallbackProvider({ children }) {
  const [requests, setRequests] = useState(initialCallbackRequests)

  // 로그인 여부와 무관하게 이름/연락처/문의 내용만으로 신청을 접수한다.
  const createCallbackRequest = useCallback((name, phone, content) => {
    setRequests((prev) => [
      ...prev,
      {
        id: `callback-${Date.now()}`,
        name,
        phone,
        content,
        requestedAt: new Date().toISOString(),
        contacted: false,
        mentorId: null,
      },
    ])
  }, [])

  const getAllCallbackRequests = useCallback(
    () => [...requests].sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt)),
    [requests],
  )

  const markContacted = useCallback((requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, contacted: true } : r)),
    )
  }, [])

  // 비회원 신청은 상담 분야가 없어 자동 매칭 대상이 아니므로, 관리자가 직접 담당 멘토를 지정/변경한다.
  const assignCallbackMentor = useCallback((requestId, mentorId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, mentorId } : r)),
    )
  }, [])

  const value = {
    createCallbackRequest,
    getAllCallbackRequests,
    markContacted,
    assignCallbackMentor,
  }

  return <CallbackContext.Provider value={value}>{children}</CallbackContext.Provider>
}

export function useCallbackRequests() {
  const ctx = useContext(CallbackContext)
  if (!ctx) {
    throw new Error('useCallbackRequests는 CallbackProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
