import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import NavDropdown from './NavDropdown.jsx'
import './Header.css'

const NAV_GROUPS = [
  {
    label: '교육과정',
    items: [
      { to: '/course', label: '과정 소개' },
      { to: '/funding', label: '국비지원 안내' },
      { to: '/portfolio', label: '수료생 포트폴리오' },
      { to: '/reviews', label: '수강생 후기' },
      { to: '/career-support', label: '취업지원' },
      { to: '/partners', label: '채용연계 파트너사' },
    ],
  },
  {
    label: '소통공간',
    items: [
      { to: '/faq', label: '자주 묻는 질문' },
      { to: '/consultation', label: '멘토 상담' },
      { to: '/inquiry', label: '문의하기' },
      { to: '/community', label: '커뮤니티' },
    ],
  },
  {
    label: '학원안내',
    items: [
      { to: '/about', label: '학원소개' },
      { to: '/history', label: '학원 연혁' },
      { to: '/facilities', label: '교육시설 소개' },
      { to: '/instructors', label: '강사진 소개' },
      { to: '/mentors', label: '멘토 소개' },
      { to: '/schedule', label: '학원 일정' },
      { to: '/notices', label: '공지사항' },
      { to: '/location', label: '오시는 길' },
      { to: '/branches', label: '다른 지점 안내' },
    ],
  },
]

function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__logo" to="/">
          <img src="/logo-mark.png" alt="" aria-hidden="true" />
          AI UI/UX 디자인 아카데미
        </Link>
        <nav className="site-header__nav" aria-label="주요 메뉴">
          {NAV_GROUPS.map((group) => (
            <NavDropdown key={group.label} label={group.label} items={group.items} />
          ))}
          {currentUser?.role === 'mentor' && <Link to="/mentor">멘토 대시보드</Link>}
          {currentUser?.role === 'admin' && <Link to="/admin">관리자</Link>}
        </nav>
        <Link className="site-header__mypage" to="/mypage">
          마이페이지
        </Link>
        {currentUser ? (
          <div className="site-header__account">
            <span>{currentUser.name}님</span>
            <button type="button" className="site-header__logout" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <Link className="site-header__login" to="/login">
            로그인
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
