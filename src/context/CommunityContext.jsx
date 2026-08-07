import { createContext, useContext, useState, useCallback } from 'react'
import { initialCommunityPosts } from '../data/communityPosts.js'
import { useAuth } from './AuthContext.jsx'

const CommunityContext = createContext(null)

export function CommunityProvider({ children }) {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState(initialCommunityPosts)

  const getAllPosts = useCallback(
    () => [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts],
  )

  const getPost = useCallback(
    (postId) => posts.find((p) => p.id === postId) ?? null,
    [posts],
  )

  const createPost = useCallback(
    (category, title, content) => {
      if (!currentUser) return
      setPosts((prev) => [
        ...prev,
        {
          id: `post-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          category,
          title,
          content,
          createdAt: new Date().toISOString(),
          comments: [],
        },
      ])
    },
    [currentUser],
  )

  // 문의 게시판과 달리 누구나(관리자가 아니어도) 서로의 글에 댓글을 남길 수 있다.
  const addComment = useCallback(
    (postId, content) => {
      if (!currentUser) return
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: `comment-${Date.now()}`,
                    authorId: currentUser.id,
                    authorName: currentUser.name,
                    content,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : p,
        ),
      )
    },
    [currentUser],
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
