import SEO from '../components/SEO'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeftIcon,
  ClockIcon,
  TagIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'

interface BlogPost {
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
  created_at: string
  published_at: string | null
}

const categoryColors: Record<string, string> = {
  'Debt Recovery':    'bg-blue-50 text-blue-700',
  'Legal Updates':    'bg-purple-50 text-purple-700',
  'Auctioneering':    'bg-amber-50 text-amber-700',
  'Industry Insights':'bg-teal-50 text-teal-700',
  'Company News':     'bg-green-50 text-green-700',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost]         = useState<BlogPost | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    apiGet<BlogPost>(`/blog/posts/${slug}`)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F4F7FA]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading article…</p>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[60vh] bg-[#F4F7FA] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />404<span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl font-bold text-[#0A1F44] font-serif mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-8">The article you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-6 py-3 rounded-lg font-bold hover:bg-[#e8b520] transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const paragraphs = post.content.split('\n\n').filter(Boolean)

  return (
    <>
      <SEO
        title={post?.title}
        description={post?.excerpt ?? undefined}
        path={`/blog/${slug}`}
        image={post?.cover_image ?? undefined}
        type="article"
      />
      {/* ── Header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-6">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <Link to="/blog" className="hover:text-[#D4A017] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#D4A017] truncate max-w-[200px]">{post.category}</span>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 mb-5 ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
            <TagIcon className="w-3 h-3" />
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-serif leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-[#8A9BB0] text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDaysIcon className="w-4 h-4" />
              {fmtDate(post.published_at ?? post.created_at)}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                {post.read_time}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Cover image hero ── */}
      {post.cover_image && (
        <div className="w-full bg-[#F4F7FA]">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-auto max-h-[600px] object-contain"
          />
        </div>
      )}

      {/* ── Article body ── */}
      <div className="bg-[#F4F7FA] py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
            {/* Lead / excerpt */}
            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-[#D4A017] pl-5 mb-8 italic font-medium">
              {post.excerpt}
            </p>

            {/* Main content — split by double newline into paragraphs */}
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Navigation row */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-[#0A1F44] font-semibold hover:text-[#D4A017] transition-colors text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Blog
            </Link>
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = '/'
                setTimeout(() => {
                  const el = document.getElementById('contact')
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
                }, 400)
              }}
              className="text-sm font-semibold text-[#D4A017] hover:text-[#0A1F44] transition-colors"
            >
              Have a question? Contact us →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
