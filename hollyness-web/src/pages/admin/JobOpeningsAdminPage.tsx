import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Job {
  id: number
  title: string
  department: string
  location: string
  job_type: string
  summary: string
  requirements: string[]
  is_active: boolean
}

type JobForm = Omit<Job, 'id'>

const EMPTY: JobForm = { title: '', department: '', location: '', job_type: 'Full-time', summary: '', requirements: [], is_active: true }

export default function JobOpeningsAdminPage() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Job | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<JobForm>(EMPTY)
  const [reqText, setReqText] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    apiGet<Job[]>('/jobs/all', token ?? undefined)
      .then(setJobs)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [token])

  const startCreate = () => { setForm(EMPTY); setReqText(''); setCreating(true); setEditing(null) }
  const startEdit = (j: Job) => { setForm({ title: j.title, department: j.department, location: j.location, job_type: j.job_type, summary: j.summary, requirements: j.requirements, is_active: j.is_active }); setReqText(j.requirements.join('\n')); setEditing(j); setCreating(false) }
  const cancel = () => { setCreating(false); setEditing(null) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, requirements: reqText.split('\n').map((r) => r.trim()).filter(Boolean) }
    try {
      if (editing) {
        await apiPatch(`/jobs/${editing.id}`, payload, token ?? undefined)
      } else {
        await apiPost('/jobs', payload, token ?? undefined)
      }
      cancel()
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job opening?')) return
    await apiDelete(`/jobs/${id}`, token ?? undefined)
    load()
  }

  const handleToggle = async (j: Job) => {
    await apiPatch(`/jobs/${j.id}`, { is_active: !j.is_active }, token ?? undefined)
    load()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Job Openings</h1>
          <p className="text-gray-500 text-sm mt-1">{jobs.length} opening{jobs.length !== 1 ? 's' : ''} total</p>
        </div>
        {!showForm && (
          <button onClick={startCreate} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e8b520] transition-colors">
            <PlusIcon className="w-4 h-4" /> Add Opening
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#D4A017]/30 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-[#0A1F44]">{editing ? 'Edit Opening' : 'New Opening'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['title', 'department', 'location', 'job_type'] as const).map((f) => (
              <div key={f}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.replace('_', ' ')}</label>
                <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Summary</label>
            <textarea rows={3} value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Requirements (one per line)</label>
            <textarea rows={5} value={reqText} onChange={(e) => setReqText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none font-mono" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-gray-300 text-[#D4A017] focus:ring-[#D4A017]" />
            Active (visible on website)
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e8b520] disabled:opacity-50 transition-colors">
              <CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
              <XMarkIcon className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className={`bg-white rounded-xl border shadow-sm p-5 flex items-start justify-between gap-4 ${j.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0A1F44] text-base">{j.title}</span>
                <span className="text-xs text-[#D4A017] bg-[#D4A017]/10 px-2 py-0.5 rounded-full font-semibold">{j.job_type}</span>
                {!j.is_active && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Hidden</span>}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{j.department} · {j.location}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{j.summary}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleToggle(j)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                {j.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => startEdit(j)} className="p-2 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors">
                <PencilIcon className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(j.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
