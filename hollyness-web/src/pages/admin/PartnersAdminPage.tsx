import { useEffect, useRef, useState } from 'react'
import {
  PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon,
  PhotoIcon, ArrowUpTrayIcon, BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import { apiGet, apiPost, apiPatch, apiDelete, apiUpload } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Partner {
  id: number
  name: string
  logo_url: string | null
  description: string | null
  website_url: string | null
  sort_order: number
  is_active: boolean
}

type PartnerForm = Omit<Partner, 'id'>
const EMPTY: PartnerForm = {
  name: '', logo_url: null, description: '', website_url: '', sort_order: 99, is_active: true,
}

export default function PartnersAdminPage() {
  const { token } = useAuth()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<Partner | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm]         = useState<PartnerForm>(EMPTY)
  const [saving, setSaving]     = useState(false)

  // Logo upload
  const [logoFile, setLogoFile]       = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [removeLogo, setRemoveLogo]   = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () =>
    apiGet<Partner[]>('/partners/all', token ?? undefined)
      .then(setPartners)
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [token])
  useEffect(() => { return () => { if (logoPreview) URL.revokeObjectURL(logoPreview) } }, [logoPreview])

  const startCreate = () => {
    setForm(EMPTY); setLogoFile(null); setLogoPreview(null); setRemoveLogo(false)
    setCreating(true); setEditing(null)
  }

  const startEdit = (p: Partner) => {
    setForm({ name: p.name, logo_url: p.logo_url, description: p.description ?? '', website_url: p.website_url ?? '', sort_order: p.sort_order, is_active: p.is_active })
    setLogoFile(null); setLogoPreview(null); setRemoveLogo(false)
    setEditing(p); setCreating(false)
  }

  const cancel = () => {
    setCreating(false); setEditing(null)
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoFile(null); setLogoPreview(null); setRemoveLogo(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); setRemoveLogo(false)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      let savedId: number
      if (editing) {
        const updated = await apiPatch<Partner>(`/partners/${editing.id}`, form, token ?? undefined)
        savedId = updated.id
      } else {
        const created = await apiPost<Partner>('/partners', form, token ?? undefined)
        savedId = created.id
      }
      if (logoFile) {
        await apiUpload(`/partners/${savedId}/logo`, logoFile, token ?? undefined)
      } else if (removeLogo) {
        await apiDelete(`/partners/${savedId}/logo`, token ?? undefined)
      }
      cancel(); load()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this partner/client?')) return
    await apiDelete(`/partners/${id}`, token ?? undefined); load()
  }

  const handleToggle = async (p: Partner) => {
    await apiPatch(`/partners/${p.id}`, { is_active: !p.is_active }, token ?? undefined); load()
  }

  const handleQuickLogo = async (p: Partner, file: File) => {
    setUploadingId(p.id)
    try { await apiUpload(`/partners/${p.id}/logo`, file, token ?? undefined); load() }
    finally { setUploadingId(null) }
  }

  const displayedLogo = logoPreview ?? (removeLogo ? null : (editing?.logo_url ?? null))
  const showForm = creating || editing !== null

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Clients &amp; Partners</h1>
          <p className="text-gray-500 text-sm mt-1">{partners.length} partner{partners.length !== 1 ? 's' : ''} · logos shown in the "Trusted By" section</p>
        </div>
        {!showForm && (
          <button onClick={startCreate} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e8b520] transition-colors">
            <PlusIcon className="w-4 h-4" /> Add Partner
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#D4A017]/30 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-[#0A1F44] text-lg">{editing ? 'Edit Partner' : 'New Partner / Client'}</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Logo upload */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo</p>
              {displayedLogo ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center p-3">
                  <img src={displayedLogo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      if (logoPreview) URL.revokeObjectURL(logoPreview)
                      setLogoFile(null); setLogoPreview(null)
                      if (editing?.logo_url) setRemoveLogo(true)
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 hover:border-[#D4A017]/50 rounded-xl cursor-pointer bg-gray-50 group transition-colors">
                  <PhotoIcon className="w-8 h-8 text-gray-300 group-hover:text-[#D4A017]/50 mb-1.5 transition-colors" />
                  <span className="text-xs text-gray-400 text-center">Click to upload logo<br/>PNG, JPG, SVG or WebP</span>
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              {displayedLogo && (
                <label className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4A017] cursor-pointer transition-colors">
                  <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Replace logo
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              {logoFile && <p className="text-xs text-[#D4A017] truncate">📎 {logoFile.name}</p>}
            </div>

            {/* Fields */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                  placeholder="e.g. Platinum Credit Ltd"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <input
                  value={form.description ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                  placeholder="Short description (optional)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Website URL</label>
                <input
                  value={form.website_url ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, website_url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-gray-300 text-[#D4A017] focus:ring-[#D4A017]" />
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e8b520] disabled:opacity-50 transition-colors">
              <CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
              <XMarkIcon className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Partner cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partners.map((p) => (
          <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-5 ${p.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            {/* Logo or quick-upload */}
            <div className="h-16 flex items-center justify-center mb-3">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="max-h-full max-w-[120px] object-contain" />
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full border border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#D4A017]/40 transition-colors group" title="Click to upload logo">
                  {uploadingId === p.id
                    ? <div className="w-4 h-4 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
                    : <BuildingOfficeIcon className="w-7 h-7 text-gray-300 group-hover:text-[#D4A017]/50 transition-colors" />
                  }
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleQuickLogo(p, f) }} />
                </label>
              )}
            </div>

            <p className="font-bold text-[#0A1F44] text-sm truncate">{p.name}</p>
            {p.description && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.description}</p>}
            {p.website_url && (
              <a href={p.website_url} target="_blank" rel="noreferrer" className="text-[#D4A017] text-xs hover:underline truncate block mt-1">
                {p.website_url.replace(/^https?:\/\//, '')}
              </a>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors"><PencilIcon className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button>
              </div>
              <button onClick={() => handleToggle(p)} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                {p.is_active ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          <BuildingOfficeIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No partners added yet. Click "Add Partner" to get started.</p>
        </div>
      )}
    </div>
  )
}
