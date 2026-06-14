import { useEffect, useRef, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, EyeIcon, EyeSlashIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPost, apiPatch, apiDelete, apiUpload } from '../../lib/api'
import { useToast } from '../../components/admin/Toast'

interface Testimonial {
  id: number
  client_name: string
  contact_role: string | null
  sector: string | null
  quote: string
  recovered: string | null
  rating: number
  photo_url: string | null
  is_published: boolean
  created_at: string
}

interface TestForm {
  client_name: string
  contact_role: string
  sector: string
  quote: string
  recovered: string
  rating: number
}

const EMPTY: TestForm = { client_name: '', contact_role: '', sector: '', quote: '', recovered: '', rating: 5 }

const SECTORS = [
  'Banking', 'SACCO / MFI', 'Insurance', 'Telecom', 'Healthcare',
  'Education', 'Construction', 'Real Estate', 'Retail/Supplier', 'Government',
]

function inputCls(err?: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 ${err ? 'border-red-300 bg-red-50' : 'border-gray-200'}`
}

export default function TestimonialsAdminPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [items, setItems]       = useState<Testimonial[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing]   = useState<Testimonial | null>(null)
  const [form, setForm]         = useState<TestForm>(EMPTY)
  const [errors, setErrors]     = useState<Partial<Record<keyof TestForm, string>>>({})
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [photoFile, setPhotoFile]       = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto]   = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    apiGet<Testimonial[]>('/admin/testimonials', token).then(setItems).finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const resetPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null); setPhotoPreview(null); setRemovePhoto(false)
  }

  const openCreate = () => {
    setForm(EMPTY); setErrors({}); setEditing(null); resetPhoto(); setModal('create')
  }

  const openEdit = (t: Testimonial) => {
    setForm({
      client_name: t.client_name, contact_role: t.contact_role ?? '',
      sector: t.sector ?? '', quote: t.quote, recovered: t.recovered ?? '',
      rating: t.rating,
    })
    setErrors({}); setEditing(t); resetPhoto(); setModal('edit')
  }

  const set = (f: keyof TestForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = f === 'rating' ? Number(e.target.value) : e.target.value
    setForm(p => ({ ...p, [f]: val }))
    setErrors(p => ({ ...p, [f]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof TestForm, string>> = {}
    if (!form.client_name.trim()) e.client_name = 'Client name is required'
    if (form.quote.trim().length < 10) e.quote = 'Quote must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      ...form,
      contact_role: form.contact_role || null,
      sector: form.sector || null,
      recovered: form.recovered || null,
    }
    try {
      let saved: Testimonial
      if (modal === 'edit' && editing) {
        saved = await apiPatch<Testimonial>(`/testimonials/${editing.id}`, payload, token)
      } else {
        saved = await apiPost<Testimonial>('/testimonials', payload, token)
      }
      if (photoFile) {
        saved = await apiUpload<Testimonial>(`/testimonials/${saved.id}/photo`, photoFile, token)
      } else if (removePhoto) {
        saved = await apiDelete<Testimonial>(`/testimonials/${saved.id}/photo`, token) as Testimonial
      }
      if (modal === 'edit' && editing) {
        setItems(prev => prev.map(t => t.id === saved.id ? saved : t))
        toast.success('Testimonial updated')
      } else {
        setItems(prev => [saved, ...prev])
        toast.success('Testimonial created')
      }
      resetPhoto(); setModal(null)
    } catch (err) {
      toast.error((err as Error).message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (t: Testimonial) => {
    try {
      const updated = await apiPatch<Testimonial>(`/testimonials/${t.id}`, { is_published: !t.is_published }, token)
      setItems(prev => prev.map(x => x.id === t.id ? updated : x))
    } catch {
      toast.error('Update failed')
    }
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await apiDelete(`/testimonials/${deleting}`, token)
      setItems(prev => prev.filter(t => t.id !== deleting))
      toast.success('Testimonial deleted')
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
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.filter(t => t.is_published).length} published · {items.length} total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e8b520] transition-colors">
          <PlusIcon className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <p className="p-12 text-center text-gray-400">Loading testimonials…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-4">No testimonials yet</p>
          <button onClick={openCreate} className="text-[#D4A017] font-semibold text-sm hover:underline">
            Add the first testimonial →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(t => (
            <div key={t.id} className={`bg-white rounded-xl border overflow-hidden transition-all ${t.is_published ? 'border-gray-100' : 'border-dashed border-gray-300 opacity-70'}`}>
              {t.photo_url && (
                <div className="h-28 overflow-hidden">
                  <img src={t.photo_url} alt={t.client_name} className="w-full h-full object-cover object-top" />
                </div>
              )}
              <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{t.client_name}</p>
                  {t.contact_role && <p className="text-xs text-gray-500">{t.contact_role}</p>}
                  {t.sector && <p className="text-xs text-[#D4A017]">{t.sector}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => togglePublish(t)}
                    className={`p-1.5 rounded-lg transition-colors ${t.is_published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                    {t.is_published ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-[#0A1F44] hover:bg-gray-100 rounded-lg transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleting(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex">
                {[1,2,3,4,5].map(n => (
                  <StarSolid key={n} className={`w-3.5 h-3.5 ${n <= t.rating ? 'text-[#D4A017]' : 'text-gray-200'}`} />
                ))}
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 italic">"{t.quote}"</p>

              {t.recovered && (
                <span className="inline-block text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  Recovered: {t.recovered}
                </span>
              )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{modal === 'edit' ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                      <button onClick={() => { resetPhoto(); setModal(null) }} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover / Profile Photo <span className="text-gray-400 font-normal">(optional)</span></label>
                {(() => {
                  const displayUrl = photoPreview ?? (removePhoto ? null : (editing?.photo_url ?? null))
                  return displayUrl ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      <img src={displayUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                      <button
                        type="button"
                        onClick={() => { if (photoPreview) URL.revokeObjectURL(photoPreview); setPhotoFile(null); setPhotoPreview(null); if (editing?.photo_url) setRemovePhoto(true) }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      <label className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs bg-white/90 hover:bg-white text-gray-700 px-2 py-1 rounded-lg cursor-pointer shadow transition-colors">
                        <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Replace
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (photoPreview) URL.revokeObjectURL(photoPreview); setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); setRemovePhoto(false) }} />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 hover:border-[#D4A017]/50 rounded-xl cursor-pointer bg-gray-50 group transition-colors">
                      <PhotoIcon className="w-7 h-7 text-gray-300 group-hover:text-[#D4A017]/50 mb-1.5 transition-colors" />
                      <span className="text-xs text-gray-400">Click to upload photo (JPG, PNG, WebP)</span>
                      <input ref={photoRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (!f) return; setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); setRemovePhoto(false) }} />
                    </label>
                  )
                })()}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Client / Company Name *</label>
                  <input value={form.client_name} onChange={set('client_name')} placeholder="e.g. ABC Bank Ltd" className={inputCls(Boolean(errors.client_name))} />
                  {errors.client_name && <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Role</label>
                  <input value={form.contact_role} onChange={set('contact_role')} placeholder="e.g. Credit Manager" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sector</label>
                  <select value={form.sector} onChange={set('sector')} className={inputCls()}>
                    <option value="">— Select —</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Testimonial Quote *</label>
                <textarea value={form.quote} onChange={set('quote')} rows={4}
                  placeholder="What did the client say about us…"
                  className={inputCls(Boolean(errors.quote))} />
                {errors.quote && <p className="text-red-500 text-xs mt-1">{errors.quote}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount Recovered</label>
                  <input value={form.recovered} onChange={set('recovered')} placeholder="e.g. TZS 25M" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (1–5)</label>
                  <select value={form.rating} onChange={set('rating')} className={inputCls()}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#D4A017] text-[#0A1F44] rounded-lg text-sm font-bold hover:bg-[#e8b520] disabled:opacity-60">
                {saving ? 'Saving…' : modal === 'edit' ? 'Update' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Testimonial?</h3>
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
