import { useRef } from 'react'
import { Link } from 'react-router-dom'

function NavDropdown({ label, items }) {
  const detailsRef = useRef(null)

  function close() {
    if (detailsRef.current) detailsRef.current.open = false
  }

  // CSS만으로 details/summary의 기본 숨김을 덮어써서 호버로 열리게 하는 방식은
  // 브라우저에 따라 먹히지 않아, 클릭과 동일하게 open 속성을 직접 제어한다.
  // 터치 기기에서는 tap이 mouseenter(호버 진입) 다음에 click(네이티브 토글)까지
  // 함께 발생시키는 경우가 있어, 그대로 두면 열리자마자 클릭 토글로 다시 닫혀버린다.
  // Header.css의 모바일 분기 기준(640px)과 동일한 폭에서만 호버 오픈을 적용해
  // 좁은 화면(터치 기기 대부분)에서는 기존 클릭 방식만 동작하도록 한다.
  function openOnHover() {
    if (window.innerWidth > 640 && detailsRef.current) {
      detailsRef.current.open = true
    }
  }

  function closeOnLeave() {
    if (window.innerWidth > 640 && detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  return (
    <details
      className="site-header__dropdown"
      ref={detailsRef}
      name="main-nav"
      onMouseEnter={openOnHover}
      onMouseLeave={closeOnLeave}
    >
      <summary className="site-header__dropdown-summary">{label}</summary>
      <div className="site-header__dropdown-menu">
        {items.map((item) => (
          <Link key={item.to} to={item.to} onClick={close}>
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  )
}

export default NavDropdown
