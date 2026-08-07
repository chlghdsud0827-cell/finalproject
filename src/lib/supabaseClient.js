import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 회원 계정(academy 스키마)은 Supabase 프로젝트의 기본 public 스키마가 아니라
// 별도 스키마에 두고 있어(같은 프로젝트를 다른 앱과 함께 쓰기 때문), 클라이언트
// 기본 스키마를 academy로 지정한다 — 이후 .from('profiles') 호출은 전부
// academy.profiles를 가리킨다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'academy' },
})
