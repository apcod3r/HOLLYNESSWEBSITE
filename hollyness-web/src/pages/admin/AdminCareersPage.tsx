import { useEffect, useState } from 'react'
import {
  MagnifyingGlassIcon, TrashIcon, EyeIcon,
  XMarkIcon, ClockIcon, EnvelopeIcon, PhoneIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPatch, apiDelete } from '../../lib/api'
import { useToast } from '../../components/admin/Toast'

interface Application {
  id: number
  name: string
  email: string
  phone: string | null
  position: string
  cover_letter: string
  status: 'received' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  created_at: string
}

const STATUSES = ['received', 'reviewing', 'shortlisted', 'rejected', 'hired'] as const

const STATUS_COLORS: Record<string, string> = {
  received:    'bg-blue-100 text-blue-700',
  reviewing:   'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  rejected:    'bg-red-100 text-red-700',
  hired:       'bg-green-100 text-green-700',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminCareersPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [items, setItems]       = useState<Application[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [detail, setDetail]     = useState<Application | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    apiGet<Application[]>('/admin/careers', token)
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const visible = items.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q)
      || a.email.toLowerCase().includes(q)
      || a.position.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const updateStatus = async (id: number, status: string) => {
    try {
      const updated = await apiPatch<Application>(`/admin/careers/${id}/status`, { status }, token)
      setItems(prev => prev.map(a => a.id === id ? updated : a))
      if (detail?.id === id) setDetail(updated)
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await apiDelete(`/admin/careers/${deleting}`, token)
      setItems(prev => prev.filter(a => a.id !== deleting))
      if (detail?.id === deleting) setDetail(null)
      toast.success('Application deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Career Applications</h1>
        <p className="text-gray-500 text-sm mt-0.5">{items.length} total applications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or position…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                filter === s ? 'bg-[#0A1F44] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-gray-400">Loading applications…</p>
        ) : visible.length === 0 ? (
          <p className="p-12 text-center text-gray-400">No applications found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Applicant</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Position</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 text-xs">{a.position}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500 text-xs">{fmt(a.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={a.status}
                        onChange={e => updateStatus(a.id, e.target.value)}
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 ${STATUS_COLORS[a.status]}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setDetail(a)}
                          className="p-1.5 text-gray-400 hover:text-[#0A1F44] hover:bg-gray-100 rounded-lg transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleting(a.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <TrashIcon className="w-4 h-4" />
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

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Application Detail</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Name</p>
                  <p className="font-medium text-gray-900">{detail.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />{fmt(detail.created_at)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Contact</p>
                <p className="text-gray-700 flex items-center gap-2">
                  <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${detail.email}`} className="text-[#0A1F44] hover:underline">{detail.email}</a>
                </p>
                {detail.phone && (
                  <p className="text-gray-700 flex items-center gap-2 mt-1">
                    <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                    {detail.phone}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Position Applied</p>
                <p className="text-gray-700 font-medium">{detail.position}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Cover Letter</p>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">{detail.cover_letter}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(detail.id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${
                        detail.status === s
                          ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Application?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={doDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
