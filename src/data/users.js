// 회원가입/로그인은 mock 데이터 기반으로 동작한다 (실제 백엔드/암호화 없음, 데모 전용).
// 2단계 페르소나(지원자 김민지, 멘토 지수, 관리자 성훈)와 동일한 테스트 계정을 기본 제공한다.
export const mockUsers = [
  {
    id: 'user-minji',
    email: 'minji@example.com',
    password: '1234',
    name: '김민지',
    role: 'user',
  },
  // 민지는 지원/상담 이력이 전혀 없는 백지 상태 계정이라, 마이페이지 "내 멘토" 등
  // 이미 진행 중인 상태를 보여주는 화면을 확인하려면 별도 계정이 필요해서 추가함.
  // 국비 과정 합격(confirmed) + 은채 멘토와 상담 진행 중(Supabase academy.applications・
  // academy.consultations 테이블에 실제 계정 id로 시드 연결됨) — 이 배열의
  // id/password는 더 이상 로그인에 쓰이지 않고, 아직 mock 데이터로 남아있는
  // 문의・커뮤니티 화면에서 이름을 표시할 때만 참조된다.
  {
    id: 'user-yuna',
    email: 'yuna@example.com',
    password: '1234',
    name: '이유나',
    role: 'user',
  },
  {
    id: 'mentor-user-1',
    email: 'jisu@example.com',
    password: '1234',
    name: '지수',
    role: 'mentor',
    mentorId: 'mentor-1',
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: '1234',
    name: '성훈',
    role: 'admin',
  },
  // 커뮤니티(data/communityPosts.js) 시드 글・댓글 작성자들 — "회원만 작성 가능"이
  // 실제로 성립하도록 전부 로그인 계정으로 등록해두고, 각 글/댓글에 authorId로
  // 연결했다(로그인 화면에 노출되는 대표 테스트 계정은 아니고, 이미 활동 중인
  // 회원이 여럿 있는 것처럼 보이게 하는 배경 회원 데이터).
  {
    id: 'user-osehun',
    email: 'osehun@example.com',
    password: '1234',
    name: '오세훈',
    role: 'user',
  },
  {
    id: 'user-kimhaneul',
    email: 'haneul@example.com',
    password: '1234',
    name: '김하늘',
    role: 'user',
  },
  {
    id: 'user-leejiwoo',
    email: 'jiwoo@example.com',
    password: '1234',
    name: '이지우',
    role: 'user',
  },
  {
    id: 'user-choiyoojin',
    email: 'yoojin@example.com',
    password: '1234',
    name: '최유진',
    role: 'user',
  },
  {
    id: 'user-parkseojun',
    email: 'seojun@example.com',
    password: '1234',
    name: '박서준',
    role: 'user',
  },
]
