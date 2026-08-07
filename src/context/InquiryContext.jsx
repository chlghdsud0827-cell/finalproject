import { createContext, useContext, useState, useCallback } from 'react'
import { initialInquiries } from '../data/inquiries.js'
import { useAuth } from './AuthContext.jsx'

const InquiryContext = createContext(null)

export function InquiryProvider({ children }) {
  const { currentUser } = useAuth()
  const [inquiries, setInquiries] = useState(initialInquiries)

  // 로그인 사용자는 userId로, 비회원은 name으로 작성자를 구분한다.
  const createInquiry = useCallback(
    (title, content, contact, email, guestName) => {
      setInquiries((prev) => [
        ...prev,
        {
          id: `inquiry-${Date.now()}`,
          userId: currentUser?.id ?? null,
          name: currentUser ? null : guestName?.trim() || '비회원',
          title,
          content,
          contact: contact?.trim() || '',
          email: email?.trim() || '',
          createdAt: new Date().toISOString(),
          reply: null,
        },
      ])
    },
    [currentUser],
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
    (inquiryId, content) => {
      if (!currentUser) return
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === inquiryId
            ? {
                ...i,
                reply: {
                  adminId: currentUser.id,
                  content,
                  createdAt: new Date().toISOString(),
                },
              }
            : i,
        ),
      )
    },
    [currentUser],
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
