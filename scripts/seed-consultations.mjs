// DB 연결 3단계 시드: 정규 상담(로그인 회원) 4건.
// 기존 mock 시드(data/consultations.js, 삭제됨)와 동일한 시나리오를 실제 계정으로 재현한다 —
// 지수(mentor-1, 최대 3건)는 이미 2건 진행 중, 은채(mentor-3, 최대 4건)는 이유나 1건만
// 진행 중이라, 관리자가 새 상담을 수동 배정할 때 부하가 더 적은 은채가 목록 상단에 온다.
//
// 실행 전 supabase/migrations/0006_academy_consultations.sql을 SQL Editor에서 실행해야 한다.
// 실행: node --env-file=.env.local scripts/seed-consultations.mjs
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 없습니다. .env.local을 확인하세요.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'academy' } })

const seeds = [
  {
    email: 'minji@example.com',
    name: '김민지',
    mentorId: 'mentor-1',
    category: '포트폴리오 피드백',
    content: '포트폴리오 구성 관련 피드백 요청드립니다.',
    status: 'in_progress',
    requestedAt: '2026-07-10T09:00:00.000Z',
  },
  {
    email: 'osehun@example.com',
    name: '오세훈',
    mentorId: 'mentor-1',
    category: '실무 툴 (Figma 등)',
    content: 'Figma 오토레이아웃 관련 질문이 있습니다.',
    status: 'matched',
    requestedAt: '2026-07-12T09:00:00.000Z',
  },
  {
    email: 'haneul@example.com',
    name: '김하늘',
    mentorId: 'mentor-2',
    category: '취업/이력서',
    content: '이력서 첨삭 요청드립니다.',
    status: 'in_progress',
    requestedAt: '2026-07-11T09:00:00.000Z',
  },
  // 마이페이지 "내 멘토" 섹션을 빈 상태가 아니라 실제 배정된 멘토가 있는 화면으로
  // 바로 확인할 수 있도록, 로그인 테스트 계정 '이유나'를 은채(mentor-3)와 미리 연결해둔다.
  {
    email: 'yuna@example.com',
    name: '이유나',
    mentorId: 'mentor-3',
    category: '포트폴리오 피드백',
    content: '포트폴리오 방향 관련해서 조언을 구하고 싶습니다.',
    status: 'in_progress',
    requestedAt: '2026-07-25T09:00:00.000Z',
  },
]

for (const seed of seeds) {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: seed.email,
    password: '123456',
  })
  if (signInError) {
    console.error(`[FAIL signIn] ${seed.email}: ${signInError.message}`)
    continue
  }

  const { error: insertError } = await supabase.from('consultations').insert({
    student_id: signInData.user.id,
    name: seed.name,
    mentor_id: seed.mentorId,
    category: seed.category,
    content: seed.content,
    status: seed.status,
    requested_at: seed.requestedAt,
  })

  if (insertError) {
    console.error(`[FAIL insert] ${seed.email}: ${insertError.message}`)
  } else {
    console.log(`[OK] ${seed.name} → ${seed.mentorId} (${seed.status})`)
  }

  await supabase.auth.signOut()
}
