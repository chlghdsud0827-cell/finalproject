import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'
import './CommunityPostDetail.css'

function CommunityPostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { getPost, addComment, canModify, updatePost, deletePost, updateComment, deleteComment } =
    useCommunity()
  const [comment, setComment] = useState('')
  const [editingPost, setEditingPost] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const post = getPost(postId)

  function handleSubmit(e) {
    e.preventDefault()
    if (!comment.trim()) return
    addComment(post.id, comment.trim())
    setComment('')
  }

  function startEditPost() {
    setEditTitle(post.title)
    setEditContent(post.content)
    setEditingPost(true)
  }

  function handleUpdatePost(e) {
    e.preventDefault()
    if (!editTitle.trim() || !editContent.trim()) return
    updatePost(post.id, editTitle.trim(), editContent.trim())
    setEditingPost(false)
  }

  function handleDeletePost() {
    if (!window.confirm('이 글을 삭제하시겠습니까? 댓글도 함께 삭제됩니다.')) return
    deletePost(post.id)
    navigate('/community')
  }

  function startEditComment(c) {
    setEditingCommentId(c.id)
    setEditCommentContent(c.content)
  }

  function handleUpdateComment(e, commentId) {
    e.preventDefault()
    if (!editCommentContent.trim()) return
    updateComment(commentId, editCommentContent.trim())
    setEditingCommentId(null)
  }

  function handleDeleteComment(commentId) {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return
    deleteComment(commentId)
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

        {editingPost ? (
          <form className="community-post__edit-form" onSubmit={handleUpdatePost}>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={5}
              required
            />
            <div className="community-post__edit-actions">
              <button className="btn btn--primary" type="submit">
                저장
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setEditingPost(false)}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="community-post__head">
              <h1>{post.title}</h1>
              {canModify(post.authorId) && (
                <div className="community-post__actions">
                  <button type="button" onClick={startEditPost}>
                    수정
                  </button>
                  <button type="button" onClick={handleDeletePost}>
                    삭제
                  </button>
                </div>
              )}
            </div>
            <p className="community-post__meta">
              {post.authorName} · {new Date(post.createdAt).toLocaleString('ko-KR')}
            </p>
            <p className="community-post__content">{post.content}</p>
          </>
        )}

        <section className="community-post__comments" aria-label="댓글">
          <h2>댓글 {post.comments.length}</h2>

          {post.comments.length === 0 ? (
            <p className="community-post__no-comments">아직 댓글이 없습니다.</p>
          ) : (
            <ul className="community-post__comment-list">
              {post.comments.map((c) => (
                <li key={c.id} className="community-post__comment">
                  {editingCommentId === c.id ? (
                    <form
                      className="community-post__edit-form"
                      onSubmit={(e) => handleUpdateComment(e, c.id)}
                    >
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        rows={2}
                        required
                      />
                      <div className="community-post__edit-actions">
                        <button className="btn btn--primary" type="submit">
                          저장
                        </button>
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => setEditingCommentId(null)}
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="community-post__comment-head">
                        <p className="community-post__comment-meta">
                          <strong>{c.authorName}</strong>{' '}
                          {new Date(c.createdAt).toLocaleString('ko-KR')}
                        </p>
                        {canModify(c.authorId) && (
                          <div className="community-post__actions">
                            <button type="button" onClick={() => startEditComment(c)}>
                              수정
                            </button>
                            <button type="button" onClick={() => handleDeleteComment(c.id)}>
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="community-post__comment-content">{c.content}</p>
                    </>
                  )}
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
