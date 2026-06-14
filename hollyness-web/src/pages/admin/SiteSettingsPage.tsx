import { useEffect, useRef, useState } from 'react'
import { Cog6ToothIcon, CheckCircleIcon, PhotoIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { apiGet, apiPatch, apiUpload, apiDelete } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'

interface Setting {
  id: number
  key: string
  value: string | null
  category: string
  label: string | null
}

const CATEGORY_ORDER = ['contact', 'company', 'general', 'social']
const CATEGORY_LABELS: Record<string, string> = {
  contact: 'Contact Information',
  company: 'Company Details',
  general: 'General / Stats',
  social:  'Social Media',
}

export default function SiteSettingsPage() {
  const { token } = useAuth()
  const [settings, setSettings]   = useState<Setting[]>([])
  const [values, setValues]       = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState<Record<string, boolean>>({})
  const [saved, setSaved]         = useState<Record<string, boolean>>({})
  const [loading, setLoading]     = useState(true)

  // Hero image state
  const [heroUrl, setHeroUrl]       = useState<string>('')
  const [heroFile, setHeroFile]     = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [heroSaving, setHeroSaving]   = useState(false)
  const [heroSaved, setHeroSaved]     = useState(false)
  const heroFileRef = useRef<HTMLInputElement>(null)

  const loadSettings = () =>
    apiGet<Setting[]>('/settings/all', token ?? undefined)
      .then((data) => {
        setSettings(data)
        const map: Record<string, string> = {}
        data.forEach((s) => { map[s.key] = s.value ?? '' })
        setValues(map)
        setHeroUrl(map['hero_bg_image'] ?? '')
      })
      .finally(() => setLoading(false))

  useEffect(() => { loadSettings() }, [token])

  useEffect(() => {
    return () => { if (heroPreview) URL.revokeObjectURL(heroPreview) }
  }, [heroPreview])

  const handleSave = async (key: string) => {
    setSaving((p) => ({ ...p, [key]: true }))
    try {
      await apiPatch(`/settings/${key}`, { value: values[key] }, token ?? undefined)
      setSaved((p) => ({ ...p, [key]: true }))
      setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2000)
    } finally {
      setSaving((p) => ({ ...p, [key]: false }))
    }
  }

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (heroPreview) URL.revokeObjectURL(heroPreview)
    setHeroFile(file)
    setHeroPreview(URL.createObjectURL(file))
  }

  const handleHeroSave = async () => {
    if (!heroFile) return
    setHeroSaving(true)
    try {
      const result = await apiUpload<Setting>('/settings/hero-image', heroFile, token ?? undefined)
      setHeroUrl(result.value ?? '')
      if (heroPreview) URL.revokeObjectURL(heroPreview)
      setHeroFile(null)
      setHeroPreview(null)
      setHeroSaved(true)
      setTimeout(() => setHeroSaved(false), 2000)
    } finally { setHeroSaving(false) }
  }

  const handleHeroRemove = async () => {
    if (!confirm('Remove the hero background image? The default will be used.')) return
    setHeroSaving(true)
    try {
      await apiDelete('/settings/hero-image', token ?? undefined)
      setHeroUrl('')
      if (heroPreview) URL.revokeObjectURL(heroPreview)
      setHeroFile(null)
      setHeroPreview(null)
    } finally { setHeroSaving(false) }
  }

  // Filter out hero_bg_image from the text settings list (managed separately)
  const visibleSettings = settings.filter((s) => s.key !== 'hero_bg_image')

  const grouped = CATEGORY_ORDER.reduce<Record<string, Setting[]>>((acc, cat) => {
    acc[cat] = visibleSettings.filter((s) => s.category === cat)
    return acc
  }, {})

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const displayedHero = heroPreview ?? (heroUrl || null)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Changes here are reflected immediately on the public website.</p>
      </div>

      {/* ── Hero Background Image ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-[#F4F7FA] border-b border-gray-100">
          <PhotoIcon className="w-5 h-5 text-[#D4A017]" />
          <h2 className="font-bold text-[#0A1F44]">Hero Background Image</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">Upload a full-screen image for the homepage hero section. Leave empty to use the default background.</p>

          {displayedHero ? (
            <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: '16/6' }}>
              <img src={displayedHero} alt="Hero preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 gap-3">
                <label className="flex items-center gap-1.5 bg-white/90 text-[#0A1F44] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-white transition-colors">
                  <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Replace
                  <input ref={heroFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handleHeroFileChange} />
                </label>
                <button
                  onClick={handleHeroRemove}
                  disabled={heroSaving}
                  className="flex items-center gap-1.5 bg-red-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <XMarkIcon className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#D4A017]/50 rounded-xl p-10 cursor-pointer bg-gray-50 group transition-colors">
              <PhotoIcon className="w-12 h-12 text-gray-300 group-hover:text-[#D4A017]/50 mb-3 transition-colors" />
              <span className="text-sm text-gray-500 font-medium">Click to upload hero image</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG or WebP — recommended 1920×1080 or wider</span>
              <input ref={heroFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handleHeroFileChange} />
            </label>
          )}

          {heroFile && (
            <div className="flex items-center justify-between bg-[#D4A017]/5 border border-[#D4A017]/20 rounded-lg px-4 py-3">
              <span className="text-sm text-[#0A1F44] font-medium truncate">📎 {heroFile.name}</span>
              <button
                onClick={handleHeroSave}
                disabled={heroSaving}
                className="flex items-center gap-1.5 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e8b520] disabled:opacity-50 transition-colors flex-shrink-0 ml-3"
              >
                {heroSaved
                  ? <><CheckCircleIcon className="w-4 h-4" /> Saved</>
                  : heroSaving ? 'Uploading…' : 'Upload & Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Text settings by category ── */}
      {CATEGORY_ORDER.map((cat) => {
        const group = grouped[cat] ?? []
        if (group.length === 0) return null
        return (
          <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-[#F4F7FA] border-b border-gray-100">
              <Cog6ToothIcon className="w-5 h-5 text-[#D4A017]" />
              <h2 className="font-bold text-[#0A1F44]">{CATEGORY_LABELS[cat] ?? cat}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {group.map((s) => (
                <div key={s.key} className="px-6 py-4 flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {s.label ?? s.key}
                    </label>
                    <input
                      type="text"
                      value={values[s.key] ?? ''}
                      onChange={(e) => setValues((p) => ({ ...p, [s.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017]"
                      placeholder={`Enter ${s.label ?? s.key}`}
                    />
                  </div>
                  <button
                    onClick={() => handleSave(s.key)}
                    disabled={saving[s.key]}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-[#D4A017] text-[#0A1F44] hover:bg-[#e8b520] disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {saved[s.key]
                      ? <><CheckCircleIcon className="w-4 h-4" /> Saved</>
                      : saving[s.key] ? 'Saving…' : 'Save'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
