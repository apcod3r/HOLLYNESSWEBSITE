import { useEffect, useState } from 'react'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { apiGet, apiPatch } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Step {
  id: number
  step_number: number
  title: string
  subtitle: string
  description: string
  what_you_provide: string[]
  outcome: string
  duration: string
  icon_name: string
  is_active: boolean
}

type StepForm = Omit<Step, 'id'>

export default function ProcessStepsAdminPage() {
  const { token } = useAuth()
  const [steps, setSteps] = useState<Step[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Step | null>(null)
  const [form, setForm] = useState<StepForm | null>(null)
  const [provideText, setProvideText] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => apiGet<Step[]>('/process/all', token ?? undefined).then(setSteps).finally(() => setLoading(false))
  useEffect(() => { load() }, [token])

  const startEdit = (s: Step) => {
    setForm({ step_number: s.step_number, title: s.title, subtitle: s.subtitle, description: s.description, what_you_provide: s.what_you_provide, outcome: s.outcome, duration: s.duration, icon_name: s.icon_name, is_active: s.is_active })
    setProvideText(s.what_you_provide.join('\n'))
    setEditing(s)
  }
  const cancel = () => { setEditing(null); setForm(null) }

  const handleSave = async () => {
    if (!editing || !form) return
    setSaving(true)
    const payload = { ...form, what_you_provide: provideText.split('\n').map((r) => r.trim()).filter(Boolean) }
    try {
      await apiPatch(`/process/${editing.id}`, payload, token ?? undefined)
      cancel(); load()
    } finally { setSaving(false) }
  }

  const handleToggle = async (s: Step) => {
    await apiPatch(`/process/${s.id}`, { is_active: !s.is_active }, token ?? undefined); load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Recovery Process Steps</h1>
        <p className="text-gray-500 text-sm mt-1">The 7-step process displayed on the Recovery Process page.</p>
      </div>

      {editing && form && (
        <div className="bg-white rounded-2xl border border-[#D4A017]/30 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-[#0A1F44]">Edit Step {form.step_number}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(['title', 'subtitle', 'icon_name', 'duration'] as const).map((f) => (
              <div key={f}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.replace('_', ' ')}</label>
                <input value={form[f]} onChange={(e) => setForm((p) => p ? ({ ...p, [f]: e.target.value }) : p)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => p ? ({ ...p, description: e.target.value }) : p)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">What You Provide (one per line)</label>
            <textarea rows={4} value={provideText} onChange={(e) => setProvideText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expected Outcome</label>
            <textarea rows={2} value={form.outcome} onChange={(e) => setForm((p) => p ? ({ ...p, outcome: e.target.value }) : p)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e8b520] disabled:opacity-50 transition-colors"><CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}</button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"><XMarkIcon className="w-4 h-4" /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.id} className={`bg-white rounded-xl border shadow-sm p-5 flex items-start justify-between gap-4 ${s.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 bg-[#D4A017] rounded-xl flex items-center justify-center flex-shrink-0 text-[#0A1F44] font-bold text-sm">
                {String(s.step_number).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0A1F44]">{s.title}</p>
                <p className="text-sm text-[#D4A017]">{s.subtitle}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                <p className="text-xs text-gray-400 mt-1">Duration: {s.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleToggle(s)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">{s.is_active ? 'Hide' : 'Show'}</button>
              <button onClick={() => startEdit(s)} className="p-2 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors"><PencilIcon className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
