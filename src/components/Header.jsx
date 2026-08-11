import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import NavDropdown from './NavDropdown.jsx'
import { MenuIcon, CloseIcon, UserIcon, BookIcon, ChatIcon, BuildingIcon, LogOutIcon } from './NavIcons.jsx'
import './Header.css'

const NAV_GROUPS = [
  {
    label: '교육과정',
    icon: BookIcon,
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
    icon: ChatIcon,
    items: [
      { to: '/faq', label: '자주 묻는 질문' },
      { to: '/inquiry', label: '문의하기' },
      { to: '/community', label: '커뮤니티' },
      { to: '/notices', label: '공지사항' },
    ],
  },
  {
    label: '학원안내',
    icon: BuildingIcon,
    items: [
      { to: '/about', label: '학원소개' },
      { to: '/history', label: '학원 연혁' },
      { to: '/facilities', label: '교육시설 소개' },
      { to: '/instructors', label: '강사진 소개' },
      { to: '/mentors', label: '멘토 소개' },
      { to: '/schedule', label: '학원 일정' },
      { to: '/location', label: '오시는 길' },
      { to: '/branches', label: '다른 지점 안내' },
    ],
  },
]

function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // 드로어가 열려있는 동안 뒤 배경이 스크롤되지 않게 막는다.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  function closeMobile() {
    setMobileOpen(false)
  }

  function handleLogout() {
    logout()
    closeMobile()
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

        <button
          type="button"
          className="site-header__menu-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="메뉴 열기"
        >
          <MenuIcon className="site-header__menu-icon" />
        </button>
      </div>

      <div
        className={`site-header__drawer-backdrop ${mobileOpen ? 'site-header__drawer-backdrop--open' : ''}`}
        onClick={closeMobile}
      />

      <nav
        className={`site-header__drawer ${mobileOpen ? 'site-header__drawer--open' : ''}`}
        aria-label="모바일 메뉴"
      >
        <div className="site-header__drawer-head">
          <Link className="site-header__logo" to="/" onClick={closeMobile}>
            <img src="/logo-mark.png" alt="" aria-hidden="true" />
            AI UI/UX 디자인 아카데미
          </Link>
          <button
            type="button"
            className="site-header__drawer-close"
            onClick={closeMobile}
            aria-label="메뉴 닫기"
          >
            <CloseIcon className="site-header__menu-icon" />
          </button>
        </div>

        <Link className="site-header__drawer-account" to="/mypage" onClick={closeMobile}>
          <UserIcon className="site-header__drawer-icon" />
          {currentUser ? `${currentUser.name}님 · 마이페이지` : '로그인 · 마이페이지'}
        </Link>

        {NAV_GROUPS.map((group) => {
          const GroupIcon = group.icon
          return (
            <div className="site-header__drawer-group" key={group.label}>
              <p className="site-header__drawer-group-title">
                <GroupIcon className="site-header__drawer-icon" />
                {group.label}
              </p>
              <div className="site-header__drawer-group-items">
                {group.items.map((item) => (
                  <Link key={item.to} to={item.to} onClick={closeMobile}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {currentUser?.role === 'mentor' && (
          <Link className="site-header__drawer-extra" to="/mentor" onClick={closeMobile}>
            멘토 대시보드
          </Link>
        )}
        {currentUser?.role === 'admin' && (
          <Link className="site-header__drawer-extra" to="/admin" onClick={closeMobile}>
            관리자
          </Link>
        )}

        {currentUser ? (
          <button type="button" className="site-header__drawer-logout" onClick={handleLogout}>
            <LogOutIcon className="site-header__drawer-icon" />
            로그아웃
          </button>
        ) : (
          <Link className="site-header__drawer-login" to="/login" onClick={closeMobile}>
            로그인
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
