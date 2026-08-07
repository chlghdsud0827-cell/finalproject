import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PagePlaceholder from './PagePlaceholder.jsx'

function RequireAuth({ role, children }) {
  const { currentUser } = useAuth()

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
