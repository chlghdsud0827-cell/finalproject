// DB 연결 2단계 시드: 정원을 채우는 더미 지원자 18명(계정 없음, 이름만) +
// 실제 계정(이유나)의 합격 지원 1건.
//
// 실행 전 supabase/migrations/0003_academy_applications.sql을 SQL Editor에서 실행해야 한다.
// 실행: node --env-file=.env.local scripts/seed-applications.mjs
import { createClient } from '@supabase/supabase-js'
import { randomKoreanName } from '../src/data/randomNames.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 없습니다. .env.local을 확인하세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'academy' } })

const COURSE_ID = 'course-ui-ux'
const WINDOW_START = new Date('2026-07-15T00:00:00').getTime()
const WINDOW_END = new Date('2026-08-06T00:00:00').getTime() // 데모 기준일(오늘) 이전만

function randomAppliedAt() {
  const t = WINDOW_START + Math.random() * (WINDOW_END - WINDOW_START)
  return new Date(t).toISOString()
}

const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: 'yuna@example.com',
  password: '123456',
})
if (signInError) {
  console.error('[FAIL signIn yuna]', signInError.message)
  process.exit(1)
}

const { error: yunaError } = await supabase.from('applications').insert({
  user_id: signInData.user.id,
  name: '이유나',
  course_id: COURSE_ID,
  status: 'confirmed',
  applied_at: '2026-07-22T10:00:00.000Z',
})
if (yunaError) {
  console.error('[FAIL insert yuna application]', yunaError.message)
} else {
  console.log('[OK] 이유나 합격 지원 등록')
}

const dummyRows = Array.from({ length: 18 }, () => ({
  user_id: null,
  name: randomKoreanName(),
  course_id: COURSE_ID,
  status: 'confirmed',
  applied_at: randomAppliedAt(),
}))

const { error: dummyError } = await supabase.from('applications').insert(dummyRows)
if (dummyError) {
  console.error('[FAIL insert dummy applications]', dummyError.message)
} else {
  console.log(`[OK] 더미 지원자 ${dummyRows.length}명 등록`)
}
