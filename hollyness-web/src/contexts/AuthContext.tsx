import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { setTokenRefreshCallback, setAuthExpiredCallback } from '../lib/api'

export interface AdminUser {
  id: number
  email: string
  full_name: string
  is_admin: boolean
  is_active: boolean
}

interface AuthState {
  token: string | null
  user: AdminUser | null
  login: (token: string, user: AdminUser, refreshToken?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('hr_admin_token')
  )
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const u = localStorage.getItem('hr_admin_user')
      return u ? (JSON.parse(u) as AdminUser) : null
    } catch {
      return null
    }
  })

  // Keep React state in sync with silent token refreshes in api.ts
  useEffect(() => {
    setTokenRefreshCallback((newToken: string) => {
      setToken(newToken)
    })
    setAuthExpiredCallback(() => {
      setToken(null)
      setUser(null)
    })
  }, [])

  const login = (newToken: string, newUser: AdminUser, refreshToken?: string) => {
    localStorage.setItem('hr_admin_token', newToken)
    localStorage.setItem('hr_admin_user', JSON.stringify(newUser))
    if (refreshToken) localStorage.setItem('hr_admin_refresh', refreshToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('hr_admin_token')
    localStorage.removeItem('hr_admin_refresh')
    localStorage.removeItem('hr_admin_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
