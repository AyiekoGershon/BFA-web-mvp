/**
 * Legacy auth — NOT USED by the main app.
 * The main app uses src/lib/api/auth.tsx (FastAPI-backed auth).
 *
 * This file exists only for backward compatibility with Signup.tsx
 * (which is not currently routed in App.tsx). It delegates to the
 * new auth API when possible.
 */

import { useState, createContext, useContext, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Role } from './client'

interface User {
  id: string
  email: string
  role: Role
  full_name: string
}

interface AuthState {
  user: User | null
  role: Role | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: Role | null }>
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

// This old auth is not used by the main app — it's here for legacy Signup.tsx.
// The actual auth is now in src/lib/api/auth.tsx using the FastAPI backend.
export function OldAuthProvider({ children }: { children: ReactNode }) {
  const [_user, _setUser] = useState<User | null>(null)
  const [_role, _setRole] = useState<Role | null>(null)
  const [_loading, _setLoading] = useState(true)
  const navigate = useNavigate()

  const signIn = async () => ({ error: 'Please use the new login page.' })
  const signUp = async () => ({ error: 'Signup is not available. Contact the administrator.' })
  const signOut = async () => { navigate('/login') }

  return (
    <AuthContext.Provider value={{ user: null, role: null, loading: false, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function OldUseAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
