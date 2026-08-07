// 기존 mock 테스트 계정(data/users.js) + 커뮤니티 시드 작성자를 실제 Supabase
// Auth 계정 + academy.profiles 행으로 만드는 1회성 스크립트.
//
// 실행 전 Supabase 대시보드에서 아래 3가지가 되어 있어야 한다:
//   1. supabase/migrations/0001_academy_profiles.sql을 SQL Editor에서 실행
//   2. Project Settings → Data API → Exposed schemas에 "academy" 추가
//   3. Authentication → Sign In / Providers → Email → "Confirm email" 끄기
//      (꺼져 있지 않으면 signUp은 성공해도 즉시 로그인 가능한 계정이 아니라
//      이메일 인증 대기 상태로 생성되어 이 스크립트가 실패한다)
//
// 실행: node --env-file=.env.local scripts/seed-accounts.mjs
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 없습니다. .env.local을 확인하세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'academy' } })

const PASSWORD = '123456'

const accounts = [
  { email: 'minji@example.com', name: '김민지', role: 'user' },
  { email: 'yuna@example.com', name: '이유나', role: 'user' },
  { email: 'jisu@example.com', name: '지수', role: 'mentor', mentorId: 'mentor-1' },
  { email: 'admin@example.com', name: '성훈', role: 'admin' },
  { email: 'osehun@example.com', name: '오세훈', role: 'user' },
  { email: 'haneul@example.com', name: '김하늘', role: 'user' },
  { email: 'jiwoo@example.com', name: '이지우', role: 'user' },
  { email: 'yoojin@example.com', name: '최유진', role: 'user' },
  { email: 'seojun@example.com', name: '박서준', role: 'user' },
]

for (const acc of accounts) {
  const { data, error } = await supabase.auth.signUp({ email: acc.email, password: PASSWORD })

  if (error) {
    console.error(`[FAIL signUp] ${acc.email}: ${error.message}`)
    continue
  }
  if (!data.user) {
    console.error(
      `[NEEDS EMAIL CONFIRM] ${acc.email}: Authentication 설정에서 "Confirm email"을 꺼주세요.`,
    )
    continue
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    email: acc.email,
    name: acc.name,
    role: acc.role,
    mentor_id: acc.mentorId ?? null,
  })

  if (profileError) {
    console.error(`[FAIL profile] ${acc.email}: ${profileError.message}`)
  } else {
    console.log(`[OK] ${acc.email} (${acc.name}, ${acc.role})`)
  }

  // Supabase Auth의 signUp 연속 호출 rate limit을 피하기 위한 짧은 대기.
  await new Promise((resolve) => setTimeout(resolve, 500))
}
