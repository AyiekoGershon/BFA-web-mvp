import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../lib/api/auth'
import { siteInfo } from '../lib/data'
import type { Role } from '../lib/api/client'

interface LoginProps {
  role?: Role
}

export default function Login({ role = 'admin' }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, role: currentRole, user } = useAuth()
  const navigate = useNavigate()
  const requestedRole = role

  // If already logged in with the correct role, redirect to portal
  useEffect(() => {
    if (user && currentRole === requestedRole) {
      navigate(`/${currentRole}`, { replace: true })
    }
  }, [user, currentRole, requestedRole, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password, requestedRole)
    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    // signIn succeeded — the AuthProvider will update currentRole,
    // and the useEffect above will handle the redirect.
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={siteInfo.logo} alt={siteInfo.name} className="h-16 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            {requestedRole.charAt(0).toUpperCase() + requestedRole.slice(1)} Portal
          </h1>
          <p className="text-gray-600 mt-1">Sign in to your {requestedRole} account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            This login is for the {requestedRole} portal. Use the matching portal entry for each role.
          </p>
        </form>
      </div>
    </div>
  )
}
