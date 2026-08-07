import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { mockUsers } from '../data/users.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'auth-current-user-id'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedId = localStorage.getItem(STORAGE_KEY)
    return mockUsers.find((u) => u.id === savedId) ?? null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, currentUser.id)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [currentUser])

  const login = useCallback((email, password) => {
    const found = mockUsers.find((u) => u.email === email && u.password === password)
    if (!found) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    setCurrentUser(found)
    return { success: true, user: found }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const isEmailTaken = useCallback(
    (email) => mockUsers.some((u) => u.email === email),
    [],
  )

  // mock 회원가입: 실제 서버 저장 없이 메모리상의 mockUsers 배열에만 추가된다(새로고침 시 초기화).
  // profile: { birthDate, gender, phone, address: { zonecode, address, detail } }
  const register = useCallback((email, password, name, profile = {}) => {
    if (mockUsers.some((u) => u.email === email)) {
      return { success: false, message: '이미 가입된 이메일입니다.' }
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: 'user',
      ...profile,
    }
    mockUsers.push(newUser)
    setCurrentUser(newUser)
    return { success: true, user: newUser }
  }, [])

  const value = { currentUser, login, logout, register, isEmailTaken }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
