import { useState } from 'react'
import { Link } from 'react-router-dom'
import { notices, NOTICE_CATEGORIES } from '../data/notices.js'
import './Notices.css'

function sortNotices(list) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

function Notices() {
  const [filter, setFilter] = useState('all')
  const sorted = sortNotices(notices)
  const filtered = filter === 'all' ? sorted : sorted.filter((n) => n.category === filter)

  return (
    <main className="notices">
      <div className="notices__inner">
        <h1>공지사항</h1>
        <p>모집 일정, 이벤트, 시스템 점검 등 안내 사항을 확인하세요.</p>

        <div className="notices__filters" role="tablist">
          <button
            type="button"
            className={`notices__filter ${filter === 'all' ? 'notices__filter--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          {NOTICE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`notices__filter ${filter === c ? 'notices__filter--active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="notices__empty">해당 카테고리의 공지가 없습니다.</p>
        ) : (
          <ul className="notices__list">
            {filtered.map((notice) => (
              <li key={notice.id}>
                <Link to={`/notices/${notice.id}`} className="notices__item">
                  <span className="notices__category">
                    {notice.category === '모집안내' && (
                      <img
                        className="notices__category-icon"
                        src="/icons/calendar.png"
                        alt=""
                        aria-hidden="true"
                      />
                    )}
                    {notice.category}
                  </span>
                  <span className="notices__title">
                    {notice.pinned && <span className="notices__pin">중요</span>}
                    {notice.title}
                  </span>
                  <span className="notices__date">
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default Notices
