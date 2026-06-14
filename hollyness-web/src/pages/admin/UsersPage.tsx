import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon, XMarkIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api'
import { useToast } from '../../components/admin/Toast'

interface AdminUserItem {
  id: number
  email: string
  full_name: string
  is_active: boolean
  is_admin: boolean
  created_at: string
}

interface UserForm {
  email: string
  full_name: string
  password: string
  is_admin: boolean
}

const EMPTY: UserForm = { email: '', full_name: '', password: '', is_admin: true }

function inputCls(err?: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 ${err ? 'border-red-300 bg-red-50' : 'border-gray-200'}`
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function UsersPage() {
  const { token, user: currentUser } = useAuth()
  const toast = useToast()
  const [users, setUsers]       = useState<AdminUserItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [showCreate, setCreate] = useState(false)
  const [form, setForm]         = useState<UserForm>(EMPTY)
  const [errors, setErrors]     = useState<Partial<Record<keyof UserForm, string>>>({})
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    apiGet<AdminUserItem[]>('/admin/users', token).then(setUsers).finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const set = (f: keyof UserForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [f]: val }))
    setErrors(p => ({ ...p, [f]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof UserForm, string>> = {}
    if (!form.email.includes('@'))          e.email     = 'Valid email required'
    if (form.full_name.trim().length < 2)   e.full_name = 'Name must be at least 2 characters'
    if (form.password.length < 8)           e.password  = 'Password must be at least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreate = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const created = await apiPost<AdminUserItem>('/admin/users', form, token)
      setUsers(prev => [created, ...prev])
      setCreate(false)
      setForm(EMPTY)
      toast.success('Admin user created')
    } catch (err) {
      toast.error((err as Error).message || 'Creation failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (u: AdminUserItem) => {
    if (u.id === currentUser?.id) { toast.error('Cannot deactivate your own account'); return }
    try {
      const updated = await apiPatch<AdminUserItem>(`/admin/users/${u.id}/toggle`, {}, token)
      setUsers(prev => prev.map(x => x.id === u.id ? updated : x))
      toast.success(updated.is_active ? 'User activated' : 'User deactivated')
    } catch {
      toast.error('Update failed')
    }
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await apiDelete(`/admin/users/${deleting}`, token)
      setUsers(prev => prev.filter(u => u.id !== deleting))
      toast.success('User deleted')
    } catch (err) {
      toast.error((err as Error).message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setErrors({}); setCreate(true) }}
          className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e8b520] transition-colors">
          <PlusIcon className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-gray-400">Loading users…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Added</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{u.full_name} {u.id === currentUser?.id && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full ml-1 font-bold">You</span>}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-0.5 rounded-full ${u.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.is_admin ? <ShieldCheckIcon className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {u.is_admin ? 'Admin' : 'Staff'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500 text-xs">{fmt(u.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {u.id !== currentUser?.id && (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggleActive(u)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              u.is_active ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}>
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => setDeleting(u.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Create Admin User</h3>
              <button onClick={() => setCreate(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input value={form.full_name} onChange={set('full_name')} placeholder="John Doe" className={inputCls(Boolean(errors.full_name))} />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="user@hollyrespishers.com" className={inputCls(Boolean(errors.email))} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={inputCls(Boolean(errors.password))} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_admin} onChange={set('is_admin')} className="w-4 h-4 rounded border-gray-300 text-[#D4A017] focus:ring-[#D4A017]" />
                <span className="text-sm text-gray-700">Grant admin privileges</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setCreate(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-2.5 bg-[#D4A017] text-[#0A1F44] rounded-lg text-sm font-bold hover:bg-[#e8b520] disabled:opacity-60">
                {saving ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete the admin account. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={doDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
