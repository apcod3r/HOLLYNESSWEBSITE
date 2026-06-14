import { useEffect, useRef, useState } from 'react'
import {
  PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon,
  PhotoIcon, ArrowUpTrayIcon, UserCircleIcon,
} from '@heroicons/react/24/outline'
import { apiGet, apiPost, apiPatch, apiDelete, apiUpload } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Member {
  id: number
  name: string
  role: string
  department: string
  bio: string
  education: string
  joined_year: number
  photo_url: string | null
  sort_order: number
  is_active: boolean
}

type MemberForm = Omit<Member, 'id'>
const EMPTY: MemberForm = {
  name: '', role: '', department: '', bio: '', education: '',
  joined_year: new Date().getFullYear(), photo_url: null,
  sort_order: 99, is_active: true,
}

export default function TeamAdminPage() {
  const { token } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Member | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<MemberForm>(EMPTY)
  const [saving, setSaving] = useState(false)

  // Photo upload state
  const [photoFile, setPhotoFile]     = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto]   = useState(false)
  const [uploadingId, setUploadingId]   = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () =>
    apiGet<Member[]>('/team/all', token ?? undefined)
      .then(setMembers)
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [token])

  // Cleanup preview URL
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview) }
  }, [photoPreview])

  const startCreate = () => {
    setForm(EMPTY)
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(false)
    setCreating(true)
    setEditing(null)
  }

  const startEdit = (m: Member) => {
    setForm({
      name: m.name, role: m.role, department: m.department,
      bio: m.bio, education: m.education, joined_year: m.joined_year,
      photo_url: m.photo_url, sort_order: m.sort_order, is_active: m.is_active,
    })
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(false)
    setEditing(m)
    setCreating(false)
  }

  const cancel = () => {
    setCreating(false)
    setEditing(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setRemovePhoto(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let savedId: number
      if (editing) {
        const updated = await apiPatch<Member>(`/team/${editing.id}`, form, token ?? undefined)
        savedId = updated.id
      } else {
        const created = await apiPost<Member>('/team', form, token ?? undefined)
        savedId = created.id
      }

      if (photoFile) {
        await apiUpload(`/team/${savedId}/image`, photoFile, token ?? undefined)
      } else if (removePhoto) {
        await apiDelete(`/team/${savedId}/image`, token ?? undefined)
      }

      cancel()
      load()
    } finally {
      setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this team member?')) return
    await apiDelete(`/team/${id}`, token ?? undefined)
    load()
  }

  const handleToggle = async (m: Member) => {
    await apiPatch(`/team/${m.id}`, { is_active: !m.is_active }, token ?? undefined)
    load()
  }

  const handleQuickPhoto = async (m: Member, file: File) => {
    setUploadingId(m.id)
    try {
      await apiUpload(`/team/${m.id}/image`, file, token ?? undefined)
      load()
    } finally { setUploadingId(null) }
  }

  const displayedPhoto = photoPreview ?? (removePhoto ? null : (editing?.photo_url ?? null))

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
          <h1 className="text-2xl font-bold text-[#0A1F44]">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e8b520] transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Add Member
          </button>
        )}
      </div>

      {/* ── Create / Edit form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#D4A017]/30 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-[#0A1F44] text-lg">{editing ? 'Edit Member' : 'New Member'}</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Photo upload */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Photo</p>
              {displayedPhoto ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={displayedPhoto} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      if (photoPreview) URL.revokeObjectURL(photoPreview)
                      setPhotoFile(null)
                      setPhotoPreview(null)
                      if (editing?.photo_url) setRemovePhoto(true)
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-200 hover:border-[#D4A017]/50 rounded-xl cursor-pointer bg-gray-50 group transition-colors">
                  <PhotoIcon className="w-10 h-10 text-gray-300 group-hover:text-[#D4A017]/50 mb-2 transition-colors" />
                  <span className="text-xs text-gray-400 text-center">Click to upload photo</span>
                  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              {displayedPhoto && (
                <label className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#D4A017] cursor-pointer transition-colors">
                  <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Replace photo
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              {photoFile && <p className="text-xs text-[#D4A017] truncate">📎 {photoFile.name}</p>}
            </div>

            {/* Text fields */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {(['name', 'role', 'department', 'education'] as const).map((f) => (
                <div key={f}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 capitalize">{f}</label>
                  <input
                    value={form[f] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Joined Year</label>
                <input
                  type="number"
                  value={form.joined_year}
                  onChange={(e) => setForm((p) => ({ ...p, joined_year: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] resize-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-[#D4A017] focus:ring-[#D4A017]"
                />
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#e8b520] disabled:opacity-50 transition-colors"
            >
              <CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Member cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.id} className={`bg-white rounded-xl border shadow-sm p-5 ${m.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex items-start gap-3 mb-3">
              {/* Photo or placeholder */}
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <label className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-[#D4A017]/10 transition-colors flex-shrink-0 group" title="Click to upload photo">
                  {uploadingId === m.id
                    ? <div className="w-4 h-4 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
                    : <UserCircleIcon className="w-7 h-7 text-gray-300 group-hover:text-[#D4A017] transition-colors" />
                  }
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleQuickPhoto(m, f) }}
                  />
                </label>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0A1F44] text-sm truncate">{m.name}</p>
                <p className="text-[#D4A017] text-xs font-semibold">{m.role}</p>
                <p className="text-gray-400 text-xs">{m.department} · Since {m.joined_year}</p>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A1F44] hover:bg-gray-50 transition-colors">
                  <PencilIcon className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2">{m.bio}</p>

            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-400 truncate max-w-[140px]">{m.education}</span>
              <button
                onClick={() => handleToggle(m)}
                className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                {m.is_active ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
