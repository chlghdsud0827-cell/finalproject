import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

const CommunityContext = createContext(null)

function toComment(row) {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  }
}

function toPost(row, comments) {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    category: row.category,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    comments: comments
      .filter((c) => c.postId === row.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
  }
}

export function CommunityProvider({ children }) {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])

  // ApplicationContext・ConsultationContext와 동일한 패턴 — 글・댓글을 각각
  // 따로 조회한 뒤 postId 기준으로 묶어서 기존 posts[].comments 형태로 합친다.
  const refetch = useCallback(async () => {
    const [{ data: postRows, error: postError }, { data: commentRows, error: commentError }] =
      await Promise.all([
        supabase.from('community_posts').select('*'),
        supabase.from('community_comments').select('*'),
      ])
    if (!postError && !commentError && postRows && commentRows) {
      const comments = commentRows.map(toComment)
      setPosts(postRows.map((row) => toPost(row, comments)))
    }
  }, [])

  // 커뮤니티 글 목록 자체는 비로그인도 볼 수 있어 이 레이스의 영향이 크진 않지만,
  // 다른 Context들과 동일하게 currentUser 변화 시에도 재조회하도록 맞춘다.
  useEffect(() => {
    refetch()
  }, [refetch, currentUser])

  const getAllPosts = useCallback(
    () => [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts],
  )

  const getPost = useCallback((postId) => posts.find((p) => p.id === postId) ?? null, [posts])

  const getMyPosts = useCallback(
    () =>
      currentUser
        ? [...posts]
            .filter((p) => p.authorId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [],
    [posts, currentUser],
  )

  // 마이페이지 "내 활동"에서 쓰기 위해, 어느 글의 댓글인지(postId・postTitle)도
  // 함께 붙여서 평탄화한다 — 댓글 자체는 게시글 상세 안에 중첩돼 있어 목록으로
  // 보려면 이렇게 한 번 풀어줘야 한다.
  const getMyComments = useCallback(() => {
    if (!currentUser) return []
    return posts
      .flatMap((p) =>
        p.comments
          .filter((c) => c.authorId === currentUser.id)
          .map((c) => ({ ...c, postTitle: p.title })),
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [posts, currentUser])

  const createPost = useCallback(
    async (category, title, content) => {
      if (!currentUser) return
      const { error } = await supabase.from('community_posts').insert({
        author_id: currentUser.id,
        author_name: currentUser.name,
        category,
        title,
        content,
      })
      if (!error) await refetch()
    },
    [currentUser, refetch],
  )

  // 문의 게시판과 달리 누구나(관리자가 아니어도) 서로의 글에 댓글을 남길 수 있다.
  const addComment = useCallback(
    async (postId, content) => {
      if (!currentUser) return
      const { error } = await supabase.from('community_comments').insert({
        post_id: postId,
        author_id: currentUser.id,
        author_name: currentUser.name,
        content,
      })
      if (!error) await refetch()
    },
    [currentUser, refetch],
  )

  // 본인 글/댓글이거나 관리자면 수정・삭제할 수 있다(실제 허용 여부는
  // Supabase RLS(0012 마이그레이션)가 최종적으로 판단 — 여기 canModify는
  // UI에 수정・삭제 버튼을 보여줄지 결정하는 용도).
  const canModify = useCallback(
    (authorId) => !!currentUser && (currentUser.id === authorId || currentUser.role === 'admin'),
    [currentUser],
  )

  const updatePost = useCallback(
    async (postId, title, content) => {
      const { error } = await supabase
        .from('community_posts')
        .update({ title, content })
        .eq('id', postId)
      if (!error) await refetch()
      return !error
    },
    [refetch],
  )

  const deletePost = useCallback(
    async (postId) => {
      const { error } = await supabase.from('community_posts').delete().eq('id', postId)
      if (!error) await refetch()
      return !error
    },
    [refetch],
  )

  const updateComment = useCallback(
    async (commentId, content) => {
      const { error } = await supabase
        .from('community_comments')
        .update({ content })
        .eq('id', commentId)
      if (!error) await refetch()
      return !error
    },
    [refetch],
  )

  const deleteComment = useCallback(
    async (commentId) => {
      const { error } = await supabase.from('community_comments').delete().eq('id', commentId)
      if (!error) await refetch()
      return !error
    },
    [refetch],
  )

  const value = {
    getAllPosts,
    getPost,
    getMyPosts,
    getMyComments,
    createPost,
    addComment,
    canModify,
    updatePost,
    deletePost,
    updateComment,
    deleteComment,
  }

  return (
    <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>
  )
}

export function useCommunity() {
  const ctx = useContext(CommunityContext)
  if (!ctx) {
    throw new Error('useCommunity는 CommunityProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
