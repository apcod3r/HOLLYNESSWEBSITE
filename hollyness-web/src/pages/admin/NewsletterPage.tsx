import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPatch } from '../../lib/api'
import { useToast } from '../../components/admin/Toast'

interface Subscriber {
  id: number
  email: string
  is_active: boolean
  created_at: string
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function NewsletterPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [subs, setSubs]       = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    apiGet<Subscriber[]>('/admin/newsletter', token)
      .then(setSubs)
      .finally(() => setLoading(false))
  }, [token])

  const visible = subs.filter(s => {
    const matchFilter = filter === 'all' || (filter === 'active' ? s.is_active : !s.is_active)
    const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const toggle = async (sub: Subscriber) => {
    try {
      const updated = await apiPatch<Subscriber>(`/admin/newsletter/${sub.id}/toggle`, {}, token)
      setSubs(prev => prev.map(s => s.id === sub.id ? updated : s))
      toast.success(updated.is_active ? 'Subscriber reactivated' : 'Subscriber deactivated')
    } catch {
      toast.error('Update failed')
    }
  }

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => toast.success('Email copied'))
  }

  const exportCsv = () => {
    const active = subs.filter(s => s.is_active)
    const csv = ['email,subscribed_date', ...active.map(s => `${s.email},${fmt(s.created_at)}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'newsletter_subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${active.length} active subscribers`)
  }

  const active = subs.filter(s => s.is_active).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{active} active · {subs.length} total</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 bg-[#0A1F44] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#061229] transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Subscribers', value: subs.length, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active', value: active, color: 'bg-green-50 text-green-600' },
          { label: 'Inactive', value: subs.length - active, color: 'bg-gray-50 text-gray-500' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-current/10`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by email…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                filter === f ? 'bg-[#0A1F44] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-gray-400">Loading subscribers…</p>
        ) : visible.length === 0 ? (
          <p className="p-12 text-center text-gray-400">No subscribers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Subscribed</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{s.email}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">{fmt(s.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => copyEmail(s.email)}
                          className="p-1.5 text-gray-400 hover:text-[#0A1F44] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy email">
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggle(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            s.is_active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}>
                          {s.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
