import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusIcon, PencilIcon, TrashIcon,
  MagnifyingGlassIcon, EyeIcon, EyeSlashIcon, StarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPatch, apiDelete } from '../../lib/api'
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
  created_at: string
}

const CATEGORIES = [
  'All', 'Debt Recovery', 'Legal Updates', 'Auctioneering',
  'Industry Insights', 'Company News',
]

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BlogListPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [posts, setPosts]       = useState<Post[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    apiGet<Post[]>('/admin/blog', token)
      .then(setPosts)
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const visible = posts.filter(p => {
    const matchCat = catFilter === 'All' || p.category === catFilter
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const toggle = async (id: number, field: 'is_published' | 'is_featured', val: boolean) => {
    try {
      const updated = await apiPatch<Post>(`/blog/posts/${id}`, { [field]: val }, token)
      setPosts(prev => prev.map(p => p.id === id ? updated : p))
      toast.success(field === 'is_published' ? (val ? 'Post published' : 'Post unpublished') : (val ? 'Marked featured' : 'Removed from featured'))
    } catch {
      toast.error('Update failed')
    }
  }

  const doDelete = async () => {
    if (!deleting) return
    try {
      await apiDelete(`/blog/posts/${deleting}`, token)
      setPosts(prev => prev.filter(p => p.id !== deleting))
      toast.success('Post deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {posts.filter(p => p.is_published).length} published · {posts.filter(p => !p.is_published).length} drafts
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e8b520] transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                catFilter === c ? 'bg-[#0A1F44] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-gray-400">Loading posts…</p>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No posts found</p>
            <Link to="/admin/blog/new" className="text-[#D4A017] font-semibold text-sm hover:underline">
              Create your first post →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Published</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Featured</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="font-medium text-gray-900 truncate">{p.title}</p>
                      <p className="text-xs text-gray-400 truncate">/blog/{p.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500 text-xs">{fmt(p.created_at)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => toggle(p.id, 'is_published', !p.is_published)}
                        title={p.is_published ? 'Unpublish' : 'Publish'}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          p.is_published
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {p.is_published ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => toggle(p.id, 'is_featured', !p.is_featured)}
                        title={p.is_featured ? 'Remove from featured' : 'Mark as featured'}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          p.is_featured
                            ? 'bg-amber-100 text-amber-500 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {p.is_featured ? <StarSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/blog/${p.id}`}
                          className="p-1.5 text-gray-400 hover:text-[#0A1F44] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleting(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete the blog post and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={doDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
