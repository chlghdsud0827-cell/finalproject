import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PagePlaceholder from './PagePlaceholder.jsx'

function RequireAuth({ role, children }) {
  const { currentUser, loading } = useAuth()

  // Supabase 세션 복원 중에는 아직 로그인 여부를 알 수 없으므로, 복원이 끝나기
  // 전까지는 로그인 페이지로 튕기지 않고 잠시 대기한다(새로고침 시 깜빡임 방지).
  if (loading) {
    return null
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (role && currentUser.role !== role) {
    return (
      <PagePlaceholder
        title="접근 권한이 없습니다"
        description="이 페이지는 해당 권한을 가진 계정으로 로그인해야 볼 수 있습니다."
      />
    )
  }

  return children
}

export default RequireAuth
