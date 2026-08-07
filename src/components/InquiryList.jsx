import {
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_BADGE_CLASS,
  getInquiryStatus,
} from '../utils/inquiryStatus.js'
import './InquiryList.css'

function InquiryList({ inquiries, emptyMessage, currentUserId, showAuthor = true }) {
  if (inquiries.length === 0) {
    return <p className="inquiry-list__empty">{emptyMessage}</p>
  }

  return (
    <ul className="inquiry-list">
      {inquiries.map((inquiry) => {
        const status = getInquiryStatus(inquiry)
        const isMine = !!currentUserId && inquiry.userId === currentUserId

        return (
          <li key={inquiry.id} className="inquiry-list__item">
            <details>
              <summary className="inquiry-list__summary">
                <span className={`badge ${INQUIRY_STATUS_BADGE_CLASS[status]}`}>
                  {INQUIRY_STATUS_LABEL[status]}
                </span>
                <span className="inquiry-list__title">
                  {inquiry.title}
                  {showAuthor && isMine && (
                    <span className="inquiry-list__mine-tag">내 글</span>
                  )}
                </span>
                <span className="inquiry-list__meta">
                  {showAuthor && <>{isMine ? '나' : '익명'} · </>}
                  {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                  <span className="inquiry-list__toggle-icon" aria-hidden="true" />
                </span>
              </summary>

              <div className="inquiry-list__body">
                <p className="inquiry-list__content">{inquiry.content}</p>
                {inquiry.reply ? (
                  <div className="inquiry-list__reply">
                    <strong>답변</strong>
                    <p>{inquiry.reply.content}</p>
                  </div>
                ) : (
                  <p className="inquiry-list__no-reply">아직 답변이 등록되지 않았습니다.</p>
                )}
              </div>
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export default InquiryList
