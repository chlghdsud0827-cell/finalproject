import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// react-router는 브라우저 기본 페이지 이동과 달리 스크롤 위치를 자동으로
// 초기화하지 않아서, 페이지 아래쪽에서 다른 메뉴로 이동해도 이전 스크롤 위치가
// 그대로 남아있었다 — 경로(pathname)가 바뀔 때마다 맨 위로 이동시킨다.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
