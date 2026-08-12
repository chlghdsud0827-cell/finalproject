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

  useEffect(() => {
    refetch()
  }, [refetch])

  const getAllPosts = useCallback(
    () => [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts],
  )

  const getPost = useCallback((postId) => posts.find((p) => p.id === postId) ?? null, [posts])

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

  const value = { getAllPosts, getPost, createPost, addComment }

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
