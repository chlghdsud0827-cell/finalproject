import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

async function fetchProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return null
  return data
}

function toCurrentUser(authUser, profile) {
  if (!authUser || !profile) return null
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile.name,
    role: profile.role,
    mentorId: profile.mentor_id ?? undefined,
    birthDate: profile.birth_date,
    gender: profile.gender,
    phone: profile.phone,
    address: {
      zonecode: profile.zonecode,
      address: profile.address,
      detail: profile.address_detail,
    },
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  // Supabase 세션 복원은 비동기라, 복원이 끝나기 전에 RequireAuth가 "로그인 안 됨"으로
  // 오판해 로그인 페이지로 튕기지 않도록 loading 상태를 별도로 둔다.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user && !cancelled) {
        const profile = await fetchProfile(session.user.id)
        if (!cancelled) setCurrentUser(toCurrentUser(session.user, profile))
      }
      if (!cancelled) setLoading(false)
    }
    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setCurrentUser(toCurrentUser(session.user, profile))
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    const profile = await fetchProfile(data.user.id)
    const user = toCurrentUser(data.user, profile)
    setCurrentUser(user)
    return { success: true, user }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }, [])

  const isEmailTaken = useCallback(async (email) => {
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
    return (count ?? 0) > 0
  }, [])

  // profile: { birthDate, gender, phone, address: { zonecode, address, detail } }
  const register = useCallback(async (email, password, name, profile = {}) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return {
        success: false,
        message: error.message.toLowerCase().includes('already registered')
          ? '이미 가입된 이메일입니다.'
          : error.message,
      }
    }
    if (!data.user) {
      return {
        success: false,
        message: '가입 확인이 필요합니다. 이메일을 확인한 후 다시 로그인해주세요.',
      }
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      name,
      role: 'user',
      birth_date: profile.birthDate || null,
      gender: profile.gender || null,
      phone: profile.phone || null,
      zonecode: profile.address?.zonecode || null,
      address: profile.address?.address || null,
      address_detail: profile.address?.detail || null,
    })
    if (profileError) {
      return { success: false, message: '회원 정보를 저장하지 못했습니다.' }
    }

    const savedProfile = await fetchProfile(data.user.id)
    const user = toCurrentUser(data.user, savedProfile)
    setCurrentUser(user)
    return { success: true, user }
  }, [])

  const value = { currentUser, loading, login, logout, register, isEmailTaken }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
