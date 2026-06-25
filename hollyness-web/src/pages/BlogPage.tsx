import SEO from '../components/SEO'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api'
import {
  ArrowRightIcon,
  ClockIcon,
  TagIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface Post {
  id: number
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  featured: boolean
  slug: string
  coverImage: string | null
}

interface ApiPost {
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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function toPost(p: ApiPost): Post {
  return {
    id: p.id,
    category: p.category,
    title: p.title,
    excerpt: p.excerpt,
    date: fmtDate(p.published_at ?? p.created_at),
    readTime: p.read_time ?? '3 min read',
    featured: p.is_featured,
    slug: p.slug,
    coverImage: p.cover_image ?? null,
  }
}

const categoryColors: Record<string, string> = {
  'Debt Recovery':    'bg-blue-50 text-blue-700',
  'Legal Updates':    'bg-purple-50 text-purple-700',
  'Auctioneering':    'bg-amber-50 text-amber-700',
  'Industry Insights':'bg-teal-50 text-teal-700',
  'Company News':     'bg-green-50 text-green-700',
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ── Article card (used in Latest grid) ── */
function ArticleCard({ post, index, visible }: { post: Post; index: number; visible: boolean }) {
  return (
    <article
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#D4A017]/30 transition-all duration-500 flex flex-col group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {post.coverImage ? (
        <div className="h-44 overflow-hidden flex-shrink-0">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-1 bg-gradient-to-r from-[#D4A017] to-[#e8b520] w-0 group-hover:w-full transition-all duration-500" />
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
            <TagIcon className="w-3 h-3" />
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-xs">
            <ClockIcon className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-base font-bold text-[#0A1F44] mb-3 leading-snug font-serif group-hover:text-[#D4A017] transition-colors flex-1">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-400 text-xs">{post.date}</span>
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-[#D4A017] hover:text-[#0A1F44] transition-colors group/link"
          >
            Read More
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Featured card ── */
function FeaturedCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <article className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#D4A017]/30 transition-all duration-300 group flex flex-col ${large ? 'h-full' : ''}`}>
      {post.coverImage ? (
        <div className={`overflow-hidden flex-shrink-0 ${large ? 'h-56' : 'h-40'}`}>
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-1 bg-gradient-to-r from-[#D4A017] to-[#e8b520] w-0 group-hover:w-full transition-all duration-500" />
      )}
      <div className={`p-7 flex flex-col flex-1 ${large ? 'justify-between' : ''}`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
              <TagIcon className="w-3 h-3" />
              {post.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#D4A017] text-xs font-semibold">
                <StarIcon className="w-3.5 h-3.5" />
                Featured
              </span>
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <ClockIcon className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>
          <h3 className={`font-bold text-[#0A1F44] mb-3 leading-snug font-serif group-hover:text-[#D4A017] transition-colors ${large ? 'text-2xl' : 'text-base'}`}>
            {post.title}
          </h3>
          {large && (
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
          )}
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-400 text-xs">{post.date}</span>
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-[#D4A017] hover:text-[#0A1F44] transition-colors group/link"
          >
            Read More
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Featured grid — all featured posts, first one large ── */
function FeaturedSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null
  const [first, ...rest] = posts
  return (
    <div className="bg-[#F4F7FA] py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-8 h-0.5 bg-[#D4A017]" />
          Featured Articles
          <span className="w-8 h-0.5 bg-[#D4A017]" />
        </div>

        {/* Hero row: first post large, next 1–2 stacked */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <FeaturedCard post={first} large />
          </div>
          {rest.length > 0 && (
            <div className="flex flex-col gap-6">
              {rest.slice(0, 2).map((p) => (
                <FeaturedCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>

        {/* Remaining featured in a 3-column grid */}
        {rest.length > 2 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.slice(2).map((p) => (
              <FeaturedCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Latest / results grid ── */
function ArticlesSection({ posts, label }: { posts: Post[]; label: string }) {
  const ref = useInView(0.05)
  if (posts.length === 0) return null
  return (
    <div ref={ref.ref} className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-8 h-0.5 bg-[#D4A017]" />
          {label}
          <span className="w-8 h-0.5 bg-[#D4A017]" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <ArticleCard key={post.id} post={post} index={i} visible={ref.inView} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Page ── */
export default function BlogPage() {
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    apiGet<ApiPost[]>('/blog/posts')
      .then(data => setPosts(data.map(toPost)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]
  const isFiltered = activeCategory !== 'All' || search.trim() !== ''

  const filtered = posts.filter((p) => {
    const matchCat    = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const displayFeatured = filtered.filter(p => p.featured)
  const displayLatest   = filtered.filter(p => !p.featured)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F4F7FA]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading articles…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Blog & Insights"
        description="Expert insights on debt recovery, public auctioneering, credit management and legal enforcement in Tanzania from the team at Hollyness & Respishers."
        path="/blog"
      />
      {/* ── Page header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">Blog &amp; Insights</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Knowledge Hub
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Blog &amp; Insights
          </h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">
            Expert articles on debt recovery, auctioneering, legal updates and industry insights — helping clients and partners stay informed.
          </p>
          <div className="mt-8 relative max-w-lg">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A9BB0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-[#8A9BB0] pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#D4A017] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div className="bg-white border-b border-gray-100 sticky top-[68px] md:top-[90px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto py-3 scrollbar-hide">
            <div className="flex gap-1 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-[#0A1F44] text-white'
                      : 'text-gray-500 hover:text-[#0A1F44] hover:bg-[#F4F7FA]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {isFiltered && (
              <button
                onClick={() => { setActiveCategory('All'); setSearch('') }}
                className="flex-shrink-0 text-xs text-[#D4A017] hover:text-[#0A1F44] font-semibold transition-colors border border-[#D4A017]/40 px-3 py-1.5 rounded-lg"
              >
                Clear ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter label when active ── */}
      {isFiltered && (
        <div className="bg-[#F4F7FA] border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-6 text-sm text-gray-500">
            Showing <strong className="text-[#0A1F44]">{filtered.length}</strong> article{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && <> in <strong className="text-[#0A1F44]">"{activeCategory}"</strong></>}
            {search && <> matching <strong className="text-[#0A1F44]">"{search}"</strong></>}
          </div>
        </div>
      )}

      {/* ── No results ── */}
      {filtered.length === 0 && posts.length > 0 && (
        <div className="bg-white py-24 text-center">
          <p className="text-gray-400 text-lg mb-4">No articles found.</p>
          <button
            onClick={() => { setActiveCategory('All'); setSearch('') }}
            className="text-[#D4A017] font-semibold hover:text-[#0A1F44] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {posts.length === 0 && (
        <div className="bg-white py-24 text-center">
          <p className="text-gray-400 text-lg">No articles published yet.</p>
        </div>
      )}

      {/* ── Featured articles (all of them) ── */}
      {displayFeatured.length > 0 && <FeaturedSection posts={displayFeatured} />}

      {/* ── Latest / other articles ── */}
      {displayLatest.length > 0 && (
        <ArticlesSection
          posts={displayLatest}
          label={isFiltered ? 'Matching Articles' : 'Latest Articles'}
        />
      )}
    </>
  )
}
