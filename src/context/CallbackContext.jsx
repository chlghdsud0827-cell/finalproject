import { createContext, useContext, useState, useCallback, useEffect } from 'react'
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
  const [requests, setRequests] = useState([])

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('callback_requests').select('*')
    if (!error && data) {
      setRequests(data.map(toCallbackRequest))
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

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
