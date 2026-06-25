import SEO from '../components/SEO'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  UserGroupIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'

interface TeamMember {
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

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [threshold])
  return { ref, inView }
}

function MemberCard({ member, index, visible }: { member: TeamMember; index: number; visible: boolean }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4A017]/30 transition-all duration-500 flex flex-col group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      {/* Photo */}
      {member.photo_url ? (
        <div className="h-56 overflow-hidden flex-shrink-0">
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-56 bg-[#0A1F44] flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A017] transition-colors duration-500">
          <UserGroupIcon className="w-20 h-20 text-[#D4A017] group-hover:text-[#0A1F44] transition-colors duration-500" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-1">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2 py-0.5 rounded-full mb-2">
            {member.department}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#0A1F44] leading-tight font-serif">{member.name}</h3>
        <p className="text-[#D4A017] text-sm font-semibold mt-0.5 mb-4">{member.role}</p>

        <p className={`text-gray-600 text-sm leading-relaxed flex-1 ${expanded ? '' : 'line-clamp-3'}`}>
          {member.bio}
        </p>
        {member.bio && member.bio.length > 120 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-[#D4A017] hover:text-[#0A1F44] font-semibold mt-2 self-start transition-colors"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
          {member.education && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AcademicCapIcon className="w-3.5 h-3.5 text-[#D4A017] flex-shrink-0" />
              {member.education}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDaysIcon className="w-3.5 h-3.5 text-[#D4A017] flex-shrink-0" />
            With company since <span className="font-semibold text-[#0A1F44] ml-1">{member.joined_year}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const [team, setTeam]     = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const gridRef = useInView(0.05)

  useEffect(() => {
    apiGet<TeamMember[]>('/team')
      .then(setTeam)
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  // Group by sort_order tiers
  // Tier 1: sort_order 1–3 → top leadership (Managing Director etc.)
  // Tier 2: sort_order 4–10 → senior management
  // Tier 3: rest → staff
  const top     = team.filter((m) => m.sort_order <= 3)
  const senior  = team.filter((m) => m.sort_order > 3 && m.sort_order <= 10)
  const staff   = team.filter((m) => m.sort_order > 10)

  return (
    <>
      <SEO
        title="Our Team"
        description="Meet the licensed professionals behind Hollyness & Respishers — experts in debt recovery, public auctioneering, legal enforcement and client relations across Tanzania."
        path="/team"
      />
      {/* ── Page Header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">Our Team</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            The People Behind Our Success
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Our Team &amp; Organisation
          </h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">
            Meet the qualified professionals who drive Hollyness &amp; Respishers' mission — from top leadership to our frontline recovery specialists across Tanzania.
          </p>
        </div>
      </div>

      {/* ── Org Overview Banner ── */}
      <div className="bg-[#D4A017] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: UserGroupIcon,      label: 'Team Members',    value: `${team.length}+` },
              { icon: BuildingOffice2Icon, label: 'Branch Offices',  value: '5 Cities' },
              { icon: AcademicCapIcon,     label: 'Qualified Professionals', value: '100%' },
              { icon: CalendarDaysIcon,    label: 'Years in Operation', value: '4+' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0A1F44]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-5 h-5 text-[#0A1F44]" />
                </div>
                <div>
                  <div className="text-[#0A1F44] font-bold text-xl leading-none">{s.value}</div>
                  <div className="text-[#0A1F44]/70 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team Content ── */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center bg-[#F4F7FA]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading team…</p>
          </div>
        </div>
      ) : (
        <div ref={gridRef.ref}>
          {/* Top Leadership */}
          {top.length > 0 && (
            <div className="bg-[#F4F7FA] py-16">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
                    <span className="w-8 h-0.5 bg-[#D4A017]" />
                    Executive Leadership
                    <span className="w-8 h-0.5 bg-[#D4A017]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Top Management</h2>
                </div>
                <div className={`grid sm:grid-cols-2 lg:grid-cols-${Math.min(top.length, 3)} gap-6 max-w-4xl mx-auto`}>
                  {top.map((m, i) => (
                    <MemberCard key={m.id} member={m} index={i} visible={gridRef.inView} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Senior Management */}
          {senior.length > 0 && (
            <div className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
                    <span className="w-8 h-0.5 bg-[#D4A017]" />
                    Management Team
                    <span className="w-8 h-0.5 bg-[#D4A017]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Senior Staff</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {senior.map((m, i) => (
                    <MemberCard key={m.id} member={m} index={i} visible={gridRef.inView} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Staff */}
          {staff.length > 0 && (
            <div className="bg-[#F4F7FA] py-16">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
                    <span className="w-8 h-0.5 bg-[#D4A017]" />
                    Our Staff
                    <span className="w-8 h-0.5 bg-[#D4A017]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Team Members</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {staff.map((m, i) => (
                    <MemberCard key={m.id} member={m} index={i} visible={gridRef.inView} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {team.length === 0 && (
            <div className="bg-[#F4F7FA] py-24 text-center">
              <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Team profiles are being updated.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Join the Team CTA ── */}
      <div className="bg-[#0A1F44] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Join Our Team
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
            Grow Your Career with Us
          </h2>
          <p className="text-[#C8D5E5] text-lg mb-8 max-w-2xl mx-auto">
            We are always looking for talented, driven professionals to join our growing team across Tanzania. Explore current opportunities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/careers"
              className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-7 py-3.5 rounded-md font-bold hover:bg-[#e8b520] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#D4A017]/20"
            >
              View Open Positions <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 border-2 border-[#D4A017] text-[#D4A017] px-7 py-3.5 rounded-md font-bold hover:bg-[#D4A017] hover:text-[#0A1F44] transition-all"
            >
              <EnvelopeIcon className="w-4 h-4" /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
