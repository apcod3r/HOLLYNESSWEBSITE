import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import type { AdminUser } from '../../contexts/AuthContext'
import { apiPost } from '../../lib/api'

interface LoginOut {
  access_token: string
  refresh_token: string
  user: AdminUser
}

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter your email and password'); return }
    setLoading(true)
    setError('')
    try {
      const res = await apiPost<LoginOut>('/auth/login', { email, password })
      if (!res.user.is_admin) { setError('Admin access required'); setLoading(false); return }
      login(res.access_token, res.user, res.refresh_token)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="H&R Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-white font-serif">Hollyness & Respishers</h1>
          <p className="text-[#8A9BB0] text-sm mt-1">Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to manage your website content</p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-5 text-red-700 text-sm">
              <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 transition-all"
                  placeholder="admin@hollyrespishers.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4A017] text-[#0A1F44] font-bold py-3 rounded-lg text-sm hover:bg-[#e8b520] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Hollyness & Respishers Co. Ltd · Admin v1.0
          </p>
        </div>

        <p className="text-center text-[#8A9BB0] text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  )
}
