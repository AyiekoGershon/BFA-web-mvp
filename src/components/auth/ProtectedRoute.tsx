import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/api/auth'
import type { Role } from '../../lib/api/client'

interface Props {
  allowedRoles: Role[]
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  // Show spinner while auth state is loading OR while user exists but role
  // hasn't been resolved yet (fixes the race condition bug).
  if (loading || (user && !role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const portalRole = location.pathname.split('/')[1] as Role | undefined

  // No authenticated user — redirect to the role-specific login page
  if (!user) {
    return <Navigate to={`/login/${portalRole ?? 'admin'}`} replace />
  }

  // User is signed in but trying to access a different portal (e.g., teacher
  // trying to access /admin). Redirect them to their own portal.
  if (portalRole && role && role !== portalRole) {
    return <Navigate to={`/${role}`} replace />
  }

  // User's role is not in the allowed list for this route
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />
  }

  return <Outlet />
}
