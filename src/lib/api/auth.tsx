import { useEffect, useState, createContext, useContext, type ReactNode, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, getRole, type Role } from './client'

// ── Types ─────────────────────────────────────────────────────────────────

interface User {
  id: string
  email: string
  role: Role
  full_name: string
  phone?: string
  avatar_url?: string
}

interface AuthState {
  user: User | null
  role: Role | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string, expectedRole?: Role) => Promise<{ error?: string; role?: Role | null }>
  signOut: () => Promise<void>
}

// ── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // On mount: check if there's a stored user/token
  useEffect(() => {
    const storedUser = authApi.getCurrentUser()

    if (storedUser && authApi.isAuthenticated()) {
      // Validate token with backend
      authApi.validateToken().then((valid) => {
        if (valid && storedUser) {
          setUser(storedUser as User)
          setRole(storedUser.role as Role)
        } else {
          // Token expired — clear state
          authApi.logout()
          setUser(null)
          setRole(null)
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  // ── Sign In ─────────────────────────────────────────────────────────
  const signIn = useCallback(async (
    email: string,
    password: string,
    expectedRole?: Role
  ): Promise<{ error?: string; role?: Role | null }> => {
    setError(null)
    setLoading(true)

    try {
      const result = await authApi.login({
        email,
        password,
        expected_role: expectedRole,
      })

      const userData: User = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role as Role,
        full_name: result.user.full_name,
        phone: result.user.phone,
        avatar_url: result.user.avatar_url,
      }

      setUser(userData)
      setRole(userData.role)

      return { role: userData.role }
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please try again.'
      setError(message)
      return { error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Sign Out ────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const currentRole = getRole()
    authApi.logout()
    setUser(null)
    setRole(null)
    setError(null)

    // Navigate to the role-specific login page
    if (currentRole) {
      navigate(`/login/${currentRole}`, { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      error,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
