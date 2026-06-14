import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPost, apiPatch, apiUpload, apiDelete } from '../../lib/api'
import { useToast } from '../../components/admin/Toast'

interface Post {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  read_time: string | null
  is_published: boolean
  is_featured: boolean
  cover_image: string | null
}

interface FormState {
  title: string
  category: string
  excerpt: string
  content: string
  read_time: string
  is_published: boolean
  is_featured: boolean
}

const CATEGORIES = [
  'Debt Recovery', 'Legal Updates', 'Auctioneering',
  'Industry Insights', 'Company News',
]

const EMPTY: FormState = {
  title: '', category: CATEGORIES[0], excerpt: '',
  content: '', read_time: '', is_published: false, is_featured: false,
}

function labelCls() {
  return 'block text-sm font-medium text-gray-700 mb-1.5'
}
function inputCls(hasError?: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 transition-all ${
    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`
}

export default function BlogEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit  = Boolean(id)
  const { token } = useAuth()
  const toast   = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm]       = useState<FormState>(EMPTY)
  const [errors, setErrors]   = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)

  // Image state
  const [coverImage, setCoverImage]   = useState<string | null>(null)  // saved URL
  const [imageFile, setImageFile]     = useState<File | null>(null)     // pending upload
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null)   // object URL
  const [removeImage, setRemoveImage] = useState(false)                 // pending remove

  useEffect(() => {
    if (!isEdit) return
    apiGet<Post[]>('/admin/blog', token).then(posts => {
      const p = posts.find(x => x.id === Number(id))
      if (p) {
        setForm({
          title: p.title, category: p.category, excerpt: p.excerpt,
          content: p.content, read_time: p.read_time ?? '',
          is_published: p.is_published, is_featured: p.is_featured,
        })
        setCoverImage(p.cover_image)
      } else {
        toast.error('Post not found')
        navigate('/admin/blog')
      }
    }).finally(() => setLoading(false))
  }, [id, token])

  // Revoke object URL on unmount or when changed
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  const set = (f: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value
    setForm(prev => ({ ...prev, [f]: val }))
    setErrors(prev => ({ ...prev, [f]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(null)
    setPreviewUrl(null)
    if (coverImage) setRemoveImage(true)
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (form.title.trim().length < 5)   e.title   = 'Title must be at least 5 characters'
    if (!form.category)                  e.category = 'Select a category'
    if (form.excerpt.trim().length < 10) e.excerpt  = 'Excerpt must be at least 10 characters'
    if (form.content.trim().length < 20) e.content  = 'Content must be at least 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (publish?: boolean) => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      ...form,
      is_published: publish !== undefined ? publish : form.is_published,
      read_time: form.read_time || null,
    }
    try {
      let savedId: number
      if (isEdit) {
        const updated = await apiPatch<Post>(`/blog/posts/${id}`, payload, token)
        savedId = updated.id
        toast.success('Post updated successfully')
      } else {
        const created = await apiPost<Post>('/blog/posts', payload, token)
        savedId = created.id
        toast.success('Post created successfully')
      }

      if (imageFile) {
        await apiUpload(`/blog/posts/${savedId}/image`, imageFile, token)
      } else if (removeImage) {
        await apiDelete(`/blog/posts/${savedId}/image`, token)
      }

      navigate('/admin/blog')
    } catch (err) {
      toast.error((err as Error).message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const displayedImage = previewUrl ?? (removeImage ? null : coverImage)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">Loading post…</div>
    )
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/blog" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Post' : 'New Blog Post'}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{isEdit ? 'Update the post content and settings' : 'Create a new article for the website blog'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div>
              <label className={labelCls()}>Post Title *</label>
              <input
                value={form.title} onChange={set('title')}
                placeholder="Enter a compelling blog title…"
                className={inputCls(Boolean(errors.title))}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className={labelCls()}>Excerpt / Summary *</label>
              <textarea
                value={form.excerpt} onChange={set('excerpt')}
                rows={3}
                placeholder="A brief summary shown on the blog listing page…"
                className={inputCls(Boolean(errors.excerpt))}
              />
              {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
            </div>

            <div>
              <label className={labelCls()}>Content *</label>
              <p className="text-xs text-gray-400 mb-2">Write your full article content here.</p>
              <textarea
                value={form.content} onChange={set('content')}
                rows={18}
                placeholder="Write your full article content here…"
                className={`${inputCls(Boolean(errors.content))} font-mono text-sm leading-relaxed resize-y`}
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Publish Settings</h3>

            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                {form.is_published
                  ? <EyeIcon className="w-4 h-4 text-green-500" />
                  : <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                }
                <span className="text-sm text-gray-700 font-medium">
                  {form.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.is_published ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.is_published ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                {form.is_featured
                  ? <StarSolid className="w-4 h-4 text-amber-500" />
                  : <StarIcon className="w-4 h-4 text-gray-400" />
                }
                <span className="text-sm text-gray-700 font-medium">Featured</span>
              </div>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, is_featured: !p.is_featured }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.is_featured ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.is_featured ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Post details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Post Details</h3>

            <div>
              <label className={labelCls()}>Category *</label>
              <select value={form.category} onChange={set('category')} className={inputCls(Boolean(errors.category))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className={labelCls()}>Read Time</label>
              <input
                value={form.read_time} onChange={set('read_time')}
                placeholder="e.g. 5 min read"
                className={inputCls()}
              />
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Cover Image</h3>

            {displayedImage ? (
              <>
                <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={displayedImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow"
                    title="Remove image"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-[#D4A017] transition-colors w-fit">
                  <ArrowUpTrayIcon className="w-4 h-4" />
                  Replace image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#D4A017]/50 rounded-lg p-6 cursor-pointer transition-colors bg-gray-50 group">
                <PhotoIcon className="w-10 h-10 text-gray-300 group-hover:text-[#D4A017]/50 mb-2 transition-colors" />
                <span className="text-xs text-gray-500 text-center leading-relaxed">
                  Click to upload a cover image<br />
                  <span className="text-gray-400">JPG, JPEG, PNG, WebP or GIF</span>
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {imageFile && (
              <p className="text-xs text-[#D4A017] font-medium truncate">
                📎 {imageFile.name}
              </p>
            )}
          </div>

          {/* Save actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="w-full bg-[#D4A017] text-[#0A1F44] font-bold py-2.5 rounded-lg text-sm hover:bg-[#e8b520] transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Save Post'}
            </button>
            <Link to="/admin/blog"
              className="block w-full text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
