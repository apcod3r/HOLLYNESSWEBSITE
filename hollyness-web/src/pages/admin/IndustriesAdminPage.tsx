import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Industry {
  id: number
  icon_name: string
  title: string
  description: string
  cases: string[]
  sort_order: number
  is_active: boolean
}

type IndustryForm = Omit<Industry, 'id'>
const EMPTY: IndustryForm = { icon_name: 'BuildingLibraryIcon', title: '', description: '', cases: [], sort_order: 99, is_active: true }

export default function IndustriesAdminPage() {
  const { token } = useAuth()
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Industry | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<IndustryForm>(EMPTY)
  const [casesText, setCasesText] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => apiGet<Industry[]>('/industries/all', token ?? undefined).then(setIndustries).finally(() => setLoading(false))
  useEffect(() => { load() }, [token])

  const startCreate = () => { setForm(EMPTY); setCasesText(''); setCreating(true); setEditing(null) }
  const startEdit = (ind: Industry) => { setForm({ icon_name: ind.icon_name, title: ind.title, description: ind.description, cases: ind.cases, sort_order: ind.sort_order, is_active: ind.is_active }); setCasesText(ind.cases.join('\n')); setEditing(ind); setCreating(false) }
  const cancel = () => { setCreating(false); setEditing(null) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, cases: casesText.split('\n').map((c) => c.trim()).filter(Boolean) }
    try {
      if (editing) await apiPatch(`/industries/${editing.id}`, payload, token ?? undefined)
      else await apiPost('/industries', payload, token ?? undefined)
      cancel(); load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this industry?')) return
    await apiDelete(`/industries/${id}`, token ?? undefined); load()
  }

  const handleToggle = async (ind: Industry) => {
    await apiPatch(`/industries/${ind.id}`, { is_active: !ind.is_active }, token ?? undefined); load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" /></div>

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Industries We Serve</h1>
          <p className="text-gray-500 text-sm mt-1">{industries.length} industri{industries.length !== 1 ? 'es' : 'y'}</p>
        </div>
        {!showForm && <button onClick={startCreate} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e8b520] transition-colors"><PlusIcon className="w-4 h-4" /> Add Industry</button>}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#D4A017]/30 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-[#0A1F44]">{editing ? 'Edit Industry' : 'New Industry'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['title', 'icon_name'] as const).map((f) => (
              <div key={f}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.replace('_', ' ')}</label>
                <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Typical Cases (one per line)</label>
            <textarea rows={4} value={casesText} onChange={(e) => setCasesText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none font-mono" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-gray-300 text-[#D4A017] focus:ring-[#D4A017]" />
            Active (visible on website)
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e8b520] disabled:opacity-50 transition-colors"><CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}</button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"><XMarkIcon className="w-4 h-4" /> Cancel</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((ind) => (
          <div key={ind.id} className={`bg-white rounded-xl border shadow-sm p-5 ${ind.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-bold text-[#0A1F44] text-sm">{ind.title}</p>
                <p className="text-gray-400 text-xs">{ind.icon_name} · #{ind.sort_order}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => handleToggle(ind)} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">{ind.is_active ? 'Hide' : 'Show'}</button>
                <button onClick={() => startEdit(ind)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors"><PencilIcon className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(ind.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ind.description}</p>
            <ul className="space-y-0.5">
              {ind.cases.slice(0, 3).map((c) => <li key={c} className="text-xs text-gray-400 flex items-center gap-1.5"><span className="w-1 h-1 bg-[#D4A017] rounded-full flex-shrink-0" />{c}</li>)}
              {ind.cases.length > 3 && <li className="text-xs text-gray-400">+{ind.cases.length - 3} more</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
