// DB 연결 3단계 시드: 비회원 상담(콜백 요청) 2건.
// 로그인 없이 신청하는 기능이라 로그인 없이 anon 권한으로 그대로 insert한다
// (기존 mock 시드 data/callbackRequests.js, 삭제됨과 동일한 내용).
//
// 실행 전 supabase/migrations/0007_academy_callback_requests.sql을 SQL Editor에서 실행해야 한다.
// 실행: node --env-file=.env.local scripts/seed-callback-requests.mjs
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 없습니다. .env.local을 확인하세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'academy' } })

const rows = [
  {
    name: '이수진',
    phone: '010-1234-5678',
    content: '국비지원 대상인지 확인하고 싶어요. 다음 기수 모집 일정도 함께 안내받고 싶습니다.',
    requested_at: '2026-07-28T11:00:00.000Z',
    contacted: true,
  },
  {
    name: '박현우',
    phone: '010-9876-5432',
    content: '커리큘럼 관련해서 좀 더 자세히 안내받고 싶습니다. 평일 저녁에 연락 부탁드려요.',
    requested_at: '2026-08-01T09:30:00.000Z',
    contacted: false,
  },
]

const { error } = await supabase.from('callback_requests').insert(rows)
if (error) {
  console.error('[FAIL insert callback_requests]', error.message)
} else {
  console.log(`[OK] 비회원 상담 신청 ${rows.length}건 등록`)
}
