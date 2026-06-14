import { useEffect, useState } from 'react'
import {
  PlusIcon, PencilIcon, TrashIcon, XMarkIcon,
  EyeIcon, EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api'
import { useToast } from '../../components/admin/Toast'

interface FAQ {
  id: number
  category: string
  question: string
  answer: string
  sort_order: number
  is_published: boolean
}

interface FaqForm {
  category: string
  question: string
  answer: string
  sort_order: number
}

const CATEGORIES = [
  'General',
  'Debt Recovery',
  'Auctions & Court Orders',
  'Client Portal',
]

const EMPTY_FORM: FaqForm = { category: CATEGORIES[0], question: '', answer: '', sort_order: 0 }

function inputCls(err?: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 ${err ? 'border-red-300 bg-red-50' : 'border-gray-200'}`
}

export default function FaqsAdminPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [faqs, setFaqs]         = useState<FAQ[]>([])
  const [loading, setLoading]   = useState(true)
  const [activeTab, setTab]     = useState(CATEGORIES[0])
  const [modal, setModal]       = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing]   = useState<FAQ | null>(null)
  const [form, setForm]         = useState<FaqForm>(EMPTY_FORM)
  const [errors, setErrors]     = useState<Partial<Record<keyof FaqForm, string>>>({})
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    apiGet<FAQ[]>('/admin/faqs', token).then(setFaqs).finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const tabFaqs = faqs
    .filter(f => f.category === activeTab)
    .sort((a, b) => a.sort_order - b.sort_order)

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, category: activeTab })
    setErrors({})
    setEditing(null)
    setModal('create')
  }

  const openEdit = (faq: FAQ) => {
    setForm({ category: faq.category, question: faq.question, answer: faq.answer, sort_order: faq.sort_order })
    setErrors({})
    setEditing(faq)
    setModal('edit')
  }

  const set = (f: keyof FaqForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = f === 'sort_order' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [f]: val }))
    setErrors(prev => ({ ...prev, [f]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof FaqForm, string>> = {}
    if (!form.question.trim()) e.question = 'Question is required'
    if (!form.answer.trim())   e.answer   = 'Answer is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (modal === 'edit' && editing) {
        const updated = await apiPatch<FAQ>(`/faqs/${editing.id}`, form, token)
        setFaqs(prev => prev.map(f => f.id === editing.id ? updated : f))
        toast.success('FAQ updated')
      } else {
        const created = await apiPost<FAQ>('/faqs', form, token)
        setFaqs(prev => [...prev, created])
        toast.success('FAQ created')
      }
      setModal(null)
    } catch (err) {
      toast.error((err as Error).message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (faq: FAQ) => {
    try {
      const updated = await apiPatch<FAQ>(`/faqs/${faq.id}`, { is_published: !faq.is_published }, token)
      setFaqs(prev => prev.map(f => f.id === faq.id ? updated : f))
    } catch {
      toast.error('Failed to update')
    }
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await apiDelete(`/faqs/${deleting}`, token)
      setFaqs(prev => prev.filter(f => f.id !== deleting))
      toast.success('FAQ deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 text-sm mt-0.5">{faqs.filter(f => f.is_published).length} published · {faqs.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e8b520] transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setTab(c)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === c ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {c}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === c ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'bg-gray-200 text-gray-500'}`}>
              {faqs.filter(f => f.category === c).length}
            </span>
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-gray-400">Loading FAQs…</p>
        ) : tabFaqs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No FAQs in this category yet</p>
            <button onClick={openCreate} className="text-[#D4A017] font-semibold text-sm hover:underline">
              Add the first FAQ →
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {tabFaqs.map(faq => (
              <li key={faq.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                    {faq.sort_order}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${faq.is_published ? 'text-gray-900' : 'text-gray-400'}`}>
                      {faq.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => togglePublish(faq)}
                      className={`p-1.5 rounded-lg transition-colors ${faq.is_published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={faq.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {faq.is_published ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(faq)}
                      className="p-1.5 text-gray-400 hover:text-[#0A1F44] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleting(faq.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create / Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{modal === 'edit' ? 'Edit FAQ' : 'Add New FAQ'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={form.category} onChange={set('category')} className={inputCls()}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Question *</label>
                <input value={form.question} onChange={set('question')} placeholder="Enter the question…" className={inputCls(Boolean(errors.question))} />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Answer *</label>
                <textarea value={form.answer} onChange={set('answer')} rows={5} placeholder="Enter the answer…" className={inputCls(Boolean(errors.answer))} />
                {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={set('sort_order')} min={0} className={inputCls()} />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-[#D4A017] text-[#0A1F44] rounded-lg text-sm font-bold hover:bg-[#e8b520] disabled:opacity-60">
                {saving ? 'Saving…' : modal === 'edit' ? 'Update FAQ' : 'Add FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete FAQ?</h3>
            <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
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
