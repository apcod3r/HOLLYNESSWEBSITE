import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EnvelopeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  InboxArrowDownIcon,
  ArrowRightIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../lib/api'

interface Summary {
  contacts: number
  new_contacts: number
  applications: number
  new_applications: number
  subscribers: number
  blog_posts: number
  published_posts: number
  testimonials: number
  faqs: number
  published_faqs: number
}

interface ContactItem {
  id: number
  name: string
  email: string
  service: string
  status: string
  created_at: string
}

interface AppItem {
  id: number
  name: string
  email: string
  position: string
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  new:         'bg-blue-100 text-blue-700',
  read:        'bg-gray-100 text-gray-600',
  replied:     'bg-green-100 text-green-700',
  archived:    'bg-yellow-100 text-yellow-700',
  received:    'bg-blue-100 text-blue-700',
  reviewing:   'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  rejected:    'bg-red-100 text-red-700',
  hired:       'bg-green-100 text-green-700',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DashboardPage() {
  const { token, user } = useAuth()
  const [summary, setSummary]   = useState<Summary | null>(null)
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [apps, setApps]         = useState<AppItem[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<Summary>('/admin/summary', token),
      apiGet<ContactItem[]>('/admin/contacts', token),
      apiGet<AppItem[]>('/admin/careers', token),
    ]).then(([s, c, a]) => {
      setSummary(s)
      setContacts(c.slice(0, 5))
      setApps(a.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [token])

  function StatCard({
    label, value, sub, icon: Icon, color, to,
  }: {
    label: string; value: number; sub?: string
    icon: React.ComponentType<{ className?: string }>
    color: string; to: string
  }) {
    return (
      <Link
        to={to}
        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D4A017]/30 transition-all group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-[#D4A017] transition-colors" />
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-0.5">{loading ? '—' : value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Welcome back, {user?.full_name?.split(' ')[0]}. Here's what's happening on your site.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Contact Inquiries" value={summary?.contacts ?? 0}
          sub={summary ? `${summary.new_contacts} new` : undefined}
          icon={EnvelopeIcon} color="bg-blue-50 text-blue-600" to="/admin/contacts" />
        <StatCard label="Job Applications" value={summary?.applications ?? 0}
          sub={summary ? `${summary.new_applications} unreviewed` : undefined}
          icon={BriefcaseIcon} color="bg-purple-50 text-purple-600" to="/admin/careers" />
        <StatCard label="Blog Posts" value={summary?.blog_posts ?? 0}
          sub={summary ? `${summary.published_posts} published` : undefined}
          icon={DocumentTextIcon} color="bg-amber-50 text-amber-600" to="/admin/blog" />
        <StatCard label="FAQs" value={summary?.faqs ?? 0}
          sub={summary ? `${summary.published_faqs} published` : undefined}
          icon={QuestionMarkCircleIcon} color="bg-green-50 text-green-600" to="/admin/faqs" />
        <StatCard label="Testimonials" value={summary?.testimonials ?? 0}
          icon={ChatBubbleLeftRightIcon} color="bg-rose-50 text-rose-600" to="/admin/testimonials" />
        <StatCard label="Newsletter Subscribers" value={summary?.subscribers ?? 0}
          icon={InboxArrowDownIcon} color="bg-teal-50 text-teal-600" to="/admin/newsletter" />
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Recent Contact Inquiries</h2>
            <Link to="/admin/contacts" className="text-[#D4A017] text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <p className="p-8 text-center text-gray-400 text-sm">Loading…</p>
          ) : contacts.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">No inquiries yet</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {contacts.map(c => (
                <li key={c.id} className="px-5 py-3 flex items-center gap-3">
                  <UserCircleIcon className="w-8 h-8 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.service}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.status}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <ClockIcon className="w-3 h-3" /> {fmt(c.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Recent Job Applications</h2>
            <Link to="/admin/careers" className="text-[#D4A017] text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <p className="p-8 text-center text-gray-400 text-sm">Loading…</p>
          ) : apps.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">No applications yet</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {apps.map(a => (
                <li key={a.id} className="px-5 py-3 flex items-center gap-3">
                  <UserCircleIcon className="w-8 h-8 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                    <p className="text-xs text-gray-500 truncate">{a.position}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {a.status}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <ClockIcon className="w-3 h-3" /> {fmt(a.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
