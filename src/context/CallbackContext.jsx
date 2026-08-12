import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

const CallbackContext = createContext(null)

function toCallbackRequest(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    content: row.content,
    requestedAt: row.requested_at,
    contacted: row.contacted,
    mentorId: row.mentor_id,
  }
}

export function CallbackProvider({ children }) {
  // 신청(insert)은 로그인 여부와 무관하지만, 조회(select)는 관리자 전용 화면에서만
  // 쓰여 RLS가 authenticated로 제한돼 있다 — currentUser를 추적해야 로그인 이후
  // 재조회가 일어난다(아래 useEffect 주석 참고).
  const { currentUser } = useAuth()
  const [requests, setRequests] = useState([])

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('callback_requests').select('*')
    if (!error && data) {
      setRequests(data.map(toCallbackRequest))
    }
  }, [])

  // currentUser도 의존성에 넣어야 한다 — Supabase 세션 복원이 끝나기 전에 이
  // effect가 먼저 실행되면 RLS(select to authenticated)가 막아 빈 배열이 그대로
  // 캐싱됨 — currentUser가 바뀌는 순간 한 번 더 조회되도록 해서 레이스를 없앤다.
  useEffect(() => {
    refetch()
  }, [refetch, currentUser])

  // 로그인 여부와 무관하게 이름/연락처/문의 내용만으로 신청을 접수한다.
  const createCallbackRequest = useCallback(
    async (name, phone, content) => {
      const { error } = await supabase.from('callback_requests').insert({
        name,
        phone,
        content,
      })
      if (!error) await refetch()
    },
    [refetch],
  )

  const getAllCallbackRequests = useCallback(
    () => [...requests].sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt)),
    [requests],
  )

  const markContacted = useCallback(
    async (requestId) => {
      const { error } = await supabase
        .from('callback_requests')
        .update({ contacted: true })
        .eq('id', requestId)
      if (!error) await refetch()
    },
    [refetch],
  )

  // 비회원 신청은 상담 분야가 없어 자동 매칭 대상이 아니므로, 관리자가 직접 담당 멘토를 지정/변경한다.
  const assignCallbackMentor = useCallback(
    async (requestId, mentorId) => {
      const { error } = await supabase
        .from('callback_requests')
        .update({ mentor_id: mentorId })
        .eq('id', requestId)
      if (!error) await refetch()
    },
    [refetch],
  )

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
