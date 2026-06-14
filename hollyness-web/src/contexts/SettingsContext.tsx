import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet } from '../lib/api'

type SettingsMap = Record<string, string>

interface SettingsContextValue {
  get: (key: string, fallback?: string) => string
  all: SettingsMap
  loading: boolean
}

const SettingsContext = createContext<SettingsContextValue>({
  get: (_key, fallback = '') => fallback,
  all: {},
  loading: true,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<SettingsMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<SettingsMap>('/settings')
      .then(setAll)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const get = (key: string, fallback = '') => all[key] ?? fallback

  return (
    <SettingsContext.Provider value={{ get, all, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
