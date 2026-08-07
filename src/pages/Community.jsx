import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'
import { COMMUNITY_CATEGORIES } from '../data/communityPosts.js'
import './Community.css'

function Community() {
  const { currentUser } = useAuth()
  const { getAllPosts, createPost } = useCommunity()
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState(COMMUNITY_CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const posts = getAllPosts()
  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    createPost(category, title.trim(), content.trim())
    setTitle('')
    setContent('')
    setShowForm(false)
  }

  return (
    <main className="community">
      <div className="community__inner">
        <div className="community__head">
          <div>
            <h1>커뮤니티</h1>
            <p>수강생들끼리 자유롭게 소식을 나누고 서로 댓글을 남길 수 있는 공간입니다.</p>
          </div>
          {currentUser ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? '취소' : '글쓰기'}
            </button>
          ) : (
            <Link className="btn btn--secondary" to="/login">
              로그인하고 글쓰기
            </Link>
          )}
        </div>

        {showForm && (
          <form className="community__form" onSubmit={handleSubmit}>
            <label>
              카테고리
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {COMMUNITY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              제목
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                required
              />
            </label>
            <label>
              내용
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="내용을 입력해 주세요."
                required
              />
            </label>
            <button className="btn btn--primary" type="submit">
              등록
            </button>
          </form>
        )}

        <div className="community__filters" role="tablist">
          <button
            type="button"
            className={`community__filter ${filter === 'all' ? 'community__filter--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          {COMMUNITY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`community__filter ${filter === c ? 'community__filter--active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="community__empty">아직 등록된 글이 없습니다.</p>
        ) : (
          <ul className="community__list">
            {filtered.map((post) => (
              <li key={post.id}>
                <Link to={`/community/${post.id}`} className="community__item">
                  <span className="community__category">{post.category}</span>
                  <span className="community__title">{post.title}</span>
                  <span className="community__meta">
                    {post.authorName} ·{' '}
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')} · 댓글{' '}
                    {post.comments.length}
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

export default Community
