import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/supabase/auth'
import type { Role } from '../../lib/supabase/client'

interface Props {
  allowedRoles: Role[]
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    const portalRole = location.pathname.split('/')[1] as Role | undefined
    return <Navigate to={`/login?role=${portalRole ?? 'admin'}`} replace />
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />
  }

  return <Outlet />
}
