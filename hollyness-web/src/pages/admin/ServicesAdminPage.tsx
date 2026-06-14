import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Service {
  id: number
  title: string
  short_desc: string
  full_desc: string
  icon_name: string
  category: string
  tag: string
  sort_order: number
  is_active: boolean
}

type ServiceForm = Omit<Service, 'id'>
const EMPTY: ServiceForm = { title: '', short_desc: '', full_desc: '', icon_name: 'BriefcaseIcon', category: 'core', tag: 'Core Service', sort_order: 99, is_active: true }

export default function ServicesAdminPage() {
  const { token } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<ServiceForm>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => apiGet<Service[]>('/services/all', token ?? undefined).then(setServices).finally(() => setLoading(false))
  useEffect(() => { load() }, [token])

  const startCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null) }
  const startEdit = (s: Service) => { setForm({ title: s.title, short_desc: s.short_desc, full_desc: s.full_desc, icon_name: s.icon_name, category: s.category, tag: s.tag, sort_order: s.sort_order, is_active: s.is_active }); setEditing(s); setCreating(false) }
  const cancel = () => { setCreating(false); setEditing(null) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) await apiPatch(`/services/${editing.id}`, form, token ?? undefined)
      else await apiPost('/services', form, token ?? undefined)
      cancel(); load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return
    await apiDelete(`/services/${id}`, token ?? undefined); load()
  }

  const handleToggle = async (s: Service) => {
    await apiPatch(`/services/${s.id}`, { is_active: !s.is_active }, token ?? undefined); load()
  }

  const moveOrder = async (s: Service, dir: -1 | 1) => {
    const newOrder = s.sort_order + dir
    await apiPatch(`/services/${s.id}`, { sort_order: newOrder }, token ?? undefined); load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" /></div>

  const showForm = creating || editing !== null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        {!showForm && <button onClick={startCreate} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e8b520] transition-colors"><PlusIcon className="w-4 h-4" /> Add Service</button>}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#D4A017]/30 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-[#0A1F44]">{editing ? 'Edit Service' : 'New Service'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['title', 'icon_name', 'tag'] as const).map((f) => (
              <div key={f}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.replace('_', ' ')}</label>
                <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]">
                <option value="core">Core</option>
                <option value="additional">Additional</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Short Description</label>
            <textarea rows={2} value={form.short_desc} onChange={(e) => setForm((p) => ({ ...p, short_desc: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Description</label>
            <textarea rows={4} value={form.full_desc} onChange={(e) => setForm((p) => ({ ...p, full_desc: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none" />
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

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className={`bg-white rounded-xl border shadow-sm p-5 flex items-start justify-between gap-4 ${s.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0A1F44]">{s.title}</span>
                <span className="text-xs text-[#D4A017] bg-[#D4A017]/10 px-2 py-0.5 rounded-full font-semibold">{s.category}</span>
                {!s.is_active && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Hidden</span>}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Icon: {s.icon_name} · Order: {s.sort_order}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{s.short_desc}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => moveOrder(s, -1)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors"><ArrowUpIcon className="w-4 h-4" /></button>
              <button onClick={() => moveOrder(s, 1)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors"><ArrowDownIcon className="w-4 h-4" /></button>
              <button onClick={() => handleToggle(s)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">{s.is_active ? 'Hide' : 'Show'}</button>
              <button onClick={() => startEdit(s)} className="p-2 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors"><PencilIcon className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><TrashIcon className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
