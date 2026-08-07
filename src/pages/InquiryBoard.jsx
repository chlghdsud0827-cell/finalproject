import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useInquiries } from '../context/InquiryContext.jsx'
import InquiryList from '../components/InquiryList.jsx'
import './InquiryBoard.css'

function InquiryBoard() {
  const { currentUser } = useAuth()
  const { createInquiry, getMyInquiries } = useInquiries()
  const [guestName, setGuestName] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [submitted, setSubmitted] = useState(false)
  // 다른 사람 문의는 노출하지 않고 로그인한 본인 문의만 보여준다(최신순).
  // 비회원은 로그인 계정이 없어 본인 문의 내역을 나중에 다시 조회할 방법이 없다.
  const inquiries = [...getMyInquiries()].reverse()

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    if (!currentUser && !guestName.trim()) return

    createInquiry(title.trim(), content.trim(), contact, email, guestName.trim())
    setGuestName('')
    setTitle('')
    setContent('')
    setContact('')
    setSubmitted(true)
  }

  return (
    <main className="inquiry-board">
      <div className="inquiry-board__inner">
        <h1>문의 게시판</h1>
        <p>
          궁금한 점을 남겨주시면 담당자가 확인 후 1:1로 답변을 남겨드립니다.
          로그인 없이도 문의를 남길 수 있습니다. 상담 분야가 정해진 멘토 상담과
          달리, 과정 운영 전반에 대한 문의를 자유롭게 남길 수 있습니다.
        </p>

        <form className="inquiry-board__form" onSubmit={handleSubmit}>
          {!currentUser && (
            <label>
              이름
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="이름을 입력해 주세요."
                required
              />
            </label>
          )}

          <label>
            제목
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력해 주세요."
              required
            />
          </label>

          <label>
            내용
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="문의하실 내용을 자세히 적어주세요."
              required
            />
          </label>

          <label>
            연락처 (선택)
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="010-0000-0000"
            />
          </label>

          <label>
            이메일 (선택)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </label>

          <p className="inquiry-board__form-hint">
            게시판 답변 외에 전화나 이메일로 직접 안내가 필요하실 때만
            입력해 주세요.
          </p>

          <button className="btn btn--primary" type="submit">
            문의 등록
          </button>
        </form>

        {submitted && (
          <p className="inquiry-board__result">
            문의가 등록되었습니다.{' '}
            {currentUser
              ? '답변이 등록되면 아래 목록에서 바로 확인할 수 있습니다.'
              : '남겨주신 연락처나 이메일로 담당자가 안내드릴 예정입니다.'}
          </p>
        )}

        {currentUser && (
          <section className="inquiry-board__history" aria-label="내 문의 내역">
            <h2>내 문의 내역</h2>
            <p className="inquiry-board__history-desc">
              제목을 눌러 내용과 답변을 확인하세요. 본인이 등록한 문의만
              보입니다.
            </p>
            <InquiryList
              inquiries={inquiries}
              emptyMessage="아직 등록한 문의가 없습니다."
              currentUserId={currentUser.id}
              showAuthor={false}
            />
          </section>
        )}
      </div>
    </main>
  )
}

export default InquiryBoard
