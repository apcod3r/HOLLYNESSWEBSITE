export const API_BASE = '/api'

export interface ApiError extends Error {
  status?: number
}

// Callbacks registered by AuthContext to keep React state in sync
let _onTokenRefreshed: ((accessToken: string) => void) | null = null
let _onAuthExpired: (() => void) | null = null
// Deduplicate concurrent refresh calls
let _refreshPromise: Promise<string | null> | null = null

export function setTokenRefreshCallback(cb: (accessToken: string) => void) {
  _onTokenRefreshed = cb
}

export function setAuthExpiredCallback(cb: () => void) {
  _onAuthExpired = cb
}

function authHeaders(token?: string | null): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as unknown as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(
      (data as { detail?: string }).detail ?? `Error ${res.status}`
    ) as ApiError
    err.status = res.status
    throw err
  }
  return data as T
}

async function doRefresh(): Promise<string | null> {
  const refresh = localStorage.getItem('hr_admin_refresh')
  if (!refresh) return null
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!res.ok) {
      // Refresh token invalid — clear auth and notify AuthContext
      localStorage.removeItem('hr_admin_token')
      localStorage.removeItem('hr_admin_refresh')
      localStorage.removeItem('hr_admin_user')
      if (_onAuthExpired) _onAuthExpired()
      return null
    }
    const data = (await res.json()) as { access_token: string; refresh_token: string }
    localStorage.setItem('hr_admin_token', data.access_token)
    localStorage.setItem('hr_admin_refresh', data.refresh_token)
    if (_onTokenRefreshed) _onTokenRefreshed(data.access_token)
    return data.access_token
  } catch {
    return null
  }
}

// Multiple concurrent 401s share one refresh call to avoid race conditions
async function attemptRefresh(): Promise<string | null> {
  if (!_refreshPromise) {
    _refreshPromise = doRefresh().finally(() => { _refreshPromise = null })
  }
  return _refreshPromise
}

async function fetchWithRefresh(
  url: string,
  init: RequestInit,
  token?: string | null
): Promise<Response> {
  const res = await fetch(url, init)
  // Only attempt refresh for authenticated requests that receive 401
  if (res.status !== 401 || !token) return res
  const newToken = await attemptRefresh()
  if (!newToken) return res   // Propagate original 401
  return fetch(url, {
    ...init,
    headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${newToken}` },
  })
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const init = { headers: authHeaders(token) }
  const res = await fetchWithRefresh(`${API_BASE}${path}`, init, token)
  return handleResponse<T>(res)
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string | null
): Promise<T> {
  const init = { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) }
  const res = await fetchWithRefresh(`${API_BASE}${path}`, init, token)
  return handleResponse<T>(res)
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  token?: string | null
): Promise<T> {
  const init = { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(body) }
  const res = await fetchWithRefresh(`${API_BASE}${path}`, init, token)
  return handleResponse<T>(res)
}

export async function apiDelete(path: string, token?: string | null): Promise<void> {
  const init = { method: 'DELETE', headers: authHeaders(token) }
  const res = await fetchWithRefresh(`${API_BASE}${path}`, init, token)
  await handleResponse<void>(res)
}

export async function apiUpload<T>(
  path: string,
  file: File,
  token?: string | null
): Promise<T> {
  const body = new FormData()
  body.append('file', file)
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const init = { method: 'POST', headers, body }
  const res = await fetchWithRefresh(`${API_BASE}${path}`, init, token)
  return handleResponse<T>(res)
}
