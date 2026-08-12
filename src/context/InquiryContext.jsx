import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

const InquiryContext = createContext(null)

function toInquiry(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    title: row.title,
    content: row.content,
    contact: row.contact,
    email: row.email,
    createdAt: row.created_at,
    reply: row.reply_content
      ? {
          adminId: row.reply_admin_id,
          content: row.reply_content,
          createdAt: row.reply_created_at,
        }
      : null,
  }
}

export function InquiryProvider({ children }) {
  const { currentUser } = useAuth()
  const [inquiries, setInquiries] = useState([])

  // ApplicationContext・ConsultationContext와 동일한 패턴.
  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('inquiries').select('*')
    if (!error && data) {
      setInquiries(data.map(toInquiry))
    }
  }, [])

  // currentUser도 의존성에 넣어야 한다 — ApplicationContext와 동일한 이유(Supabase
  // 세션 복원이 끝나기 전에 이 effect가 먼저 실행되면 RLS가 막아 빈 배열이 그대로
  // 캐싱됨) — currentUser가 바뀌는 순간 한 번 더 조회되도록 해서 레이스를 없앤다.
  useEffect(() => {
    refetch()
  }, [refetch, currentUser])

  // 로그인 사용자는 계정 이름을, 비회원은 입력한 이름을 name에 그대로 저장한다
  // (관리자 화면에서 계정 id 조회 없이 바로 이름을 보여주기 위함 — 2・3단계와 동일).
  const createInquiry = useCallback(
    async (title, content, contact, email, guestName) => {
      const { error } = await supabase.from('inquiries').insert({
        user_id: currentUser?.id ?? null,
        name: currentUser ? currentUser.name : guestName?.trim() || '비회원',
        title,
        content,
        contact: contact?.trim() || '',
        email: email?.trim() || '',
      })
      if (!error) await refetch()
    },
    [currentUser, refetch],
  )

  const getMyInquiries = useCallback(
    () => (currentUser ? inquiries.filter((i) => i.userId === currentUser.id) : []),
    [inquiries, currentUser],
  )

  const getAllInquiries = useCallback(
    () => [...inquiries].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [inquiries],
  )

  // 담당자(관리자)가 문의에 1:1로 답변을 남긴다. 자유 댓글이 아니라 답변은 1건만 등록 가능.
  const replyToInquiry = useCallback(
    async (inquiryId, content) => {
      if (!currentUser) return
      const { error } = await supabase
        .from('inquiries')
        .update({
          reply_content: content,
          reply_admin_id: currentUser.id,
          reply_created_at: new Date().toISOString(),
        })
        .eq('id', inquiryId)
      if (!error) await refetch()
    },
    [currentUser, refetch],
  )

  const value = { createInquiry, getMyInquiries, getAllInquiries, replyToInquiry }

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

export function useInquiries() {
  const ctx = useContext(InquiryContext)
  if (!ctx) {
    throw new Error('useInquiries는 InquiryProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
