import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'
import './CommunityPostDetail.css'

function CommunityPostDetail() {
  const { postId } = useParams()
  const { currentUser } = useAuth()
  const { getPost, addComment } = useCommunity()
  const [comment, setComment] = useState('')
  const post = getPost(postId)

  function handleSubmit(e) {
    e.preventDefault()
    if (!comment.trim()) return
    addComment(post.id, comment.trim())
    setComment('')
  }

  if (!post) {
    return (
      <main className="community-post">
        <div className="community-post__inner">
          <p>게시글을 찾을 수 없습니다.</p>
          <Link className="community-post__back" to="/community">
            ← 커뮤니티로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="community-post">
      <div className="community-post__inner">
        <Link className="community-post__back" to="/community">
          ← 커뮤니티로 돌아가기
        </Link>

        <span className="community-post__category">{post.category}</span>
        <h1>{post.title}</h1>
        <p className="community-post__meta">
          {post.authorName} · {new Date(post.createdAt).toLocaleString('ko-KR')}
        </p>
        <p className="community-post__content">{post.content}</p>

        <section className="community-post__comments" aria-label="댓글">
          <h2>댓글 {post.comments.length}</h2>

          {post.comments.length === 0 ? (
            <p className="community-post__no-comments">아직 댓글이 없습니다.</p>
          ) : (
            <ul className="community-post__comment-list">
              {post.comments.map((c) => (
                <li key={c.id} className="community-post__comment">
                  <p className="community-post__comment-meta">
                    <strong>{c.authorName}</strong>{' '}
                    {new Date(c.createdAt).toLocaleString('ko-KR')}
                  </p>
                  <p className="community-post__comment-content">{c.content}</p>
                </li>
              ))}
            </ul>
          )}

          {currentUser ? (
            <form className="community-post__comment-form" onSubmit={handleSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="댓글을 입력해 주세요."
                required
              />
              <button className="btn btn--primary" type="submit">
                댓글 등록
              </button>
            </form>
          ) : (
            <p className="community-post__login-prompt">
              댓글을 남기려면 <Link to="/login">로그인</Link>이 필요합니다.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default CommunityPostDetail
