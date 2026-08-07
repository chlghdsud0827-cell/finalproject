import { Link, useParams } from 'react-router-dom'
import { notices } from '../data/notices.js'
import './NoticeDetail.css'

function NoticeDetail() {
  const { noticeId } = useParams()
  const notice = notices.find((n) => n.id === noticeId)

  if (!notice) {
    return (
      <main className="notice-detail">
        <div className="notice-detail__inner">
          <p>공지사항을 찾을 수 없습니다.</p>
          <Link className="notice-detail__back" to="/notices">
            ← 공지사항으로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="notice-detail">
      <div className="notice-detail__inner">
        <Link className="notice-detail__back" to="/notices">
          ← 공지사항으로 돌아가기
        </Link>

        <span className="notice-detail__category">{notice.category}</span>
        <h1>
          {notice.pinned && <span className="notice-detail__pin">중요</span>}
          {notice.title}
        </h1>
        <p className="notice-detail__date">
          {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
        </p>
        <p className="notice-detail__content">{notice.content}</p>
      </div>
    </main>
  )
}

export default NoticeDetail
