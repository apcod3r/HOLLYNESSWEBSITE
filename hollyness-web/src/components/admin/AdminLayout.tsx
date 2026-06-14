import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  InboxArrowDownIcon,
  UsersIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

type NavItem =
  | { to: string; label: string; icon: React.ComponentType<{ className?: string }> }
  | { separator: string }

const NAV: NavItem[] = [
  { to: '/admin',              label: 'Dashboard',           icon: HomeIcon },
  { separator: 'Website Content' },
  { to: '/admin/services',     label: 'Services',            icon: WrenchScrewdriverIcon },
  { to: '/admin/industries',   label: 'Industries',          icon: BuildingLibraryIcon },
  { to: '/admin/team',         label: 'Team Members',        icon: UserGroupIcon },
  { to: '/admin/partners',     label: 'Clients & Partners',  icon: BuildingOffice2Icon },
  { to: '/admin/process',      label: 'Recovery Process',    icon: ArrowPathIcon },
  { separator: 'Blog & FAQs' },
  { to: '/admin/blog',         label: 'Blog Posts',          icon: DocumentTextIcon },
  { to: '/admin/faqs',         label: 'FAQs',                icon: QuestionMarkCircleIcon },
  { to: '/admin/testimonials', label: 'Testimonials',        icon: ChatBubbleLeftRightIcon },
  { separator: 'Inquiries' },
  { to: '/admin/contacts',     label: 'Contact Inquiries',   icon: EnvelopeIcon },
  { to: '/admin/careers',      label: 'Career Applications', icon: BriefcaseIcon },
  { to: '/admin/jobs',         label: 'Job Openings',        icon: ClipboardDocumentListIcon },
  { to: '/admin/newsletter',   label: 'Newsletter',          icon: InboxArrowDownIcon },
  { separator: 'System' },
  { to: '/admin/settings',     label: 'Site Settings',       icon: Cog6ToothIcon },
  { to: '/admin/users',        label: 'Admin Users',         icon: UsersIcon },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col h-full bg-[#0A1F44]">
      {/* Brand header */}
      <div className="flex items-center justify-between px-5 py-[18px] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="H&R" className="w-8 h-8 object-contain" />
          <div>
            <div className="text-white font-bold text-sm leading-tight">H&R Admin</div>
            <div className="text-[#8A9BB0] text-[11px]">Control Panel</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#8A9BB0] hover:text-white transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV.map((item, i) => {
          if ('separator' in item) {
            return (
              <p
                key={i}
                className="text-[#8A9BB0] text-[10px] font-bold uppercase tracking-widest px-3 pt-5 pb-1.5 first:pt-1"
              >
                {item.separator}
              </p>
            )
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#D4A017] text-[#0A1F44]'
                    : 'text-[#C8D5E5] hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3 min-w-0">
          <UserCircleIcon className="w-8 h-8 text-[#8A9BB0] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-[#8A9BB0] text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs text-[#C8D5E5] hover:bg-white/10 hover:text-white transition-colors border border-white/10"
          >
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            Website
          </a>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs text-[#C8D5E5] hover:bg-red-500/20 hover:text-red-400 transition-colors border border-white/10"
          >
            <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-[#F4F7FA] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 shadow-2xl">
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-[61px] flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCircleIcon className="w-5 h-5 text-gray-400" />
            <span className="hidden sm:inline font-medium">{user?.full_name}</span>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
