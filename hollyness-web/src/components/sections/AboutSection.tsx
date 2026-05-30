import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheckIcon,
  EyeIcon,
  StarIcon,
  UserGroupIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'

const coreValues = [
  {
    icon: ShieldCheckIcon,
    title: 'Integrity',
    description: 'Acting with honesty and fairness in all engagements.',
  },
  {
    icon: EyeIcon,
    title: 'Confidentiality',
    description: 'Protecting client information and interests at all times.',
  },
  {
    icon: StarIcon,
    title: 'Professionalism',
    description: 'Delivering services with expertise and diligence.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Affordability',
    description: 'Ensuring services are cost-effective for all clients.',
  },
  {
    icon: LightBulbIcon,
    title: 'Innovation',
    description: 'Continuously seeking better solutions to client needs.',
  },
]

const whyChooseUs = [
  'Fully licensed commission agent under Tanzania laws',
  'Over 4 years of proven debt recovery experience',
  'Nationwide presence across 5 major cities',
  'Trusted by leading banks and microfinance institutions',
  'Confidential, transparent and results-driven approach',
  '100%+ annual revenue growth demonstrates our reliability',
  'Qualified legal, accounting and recovery professionals',
  'Compliant with all AML and anti-bribery regulations',
]

const team = [
  {
    name: 'Joachim Gabriel Kalungwe',
    role: 'Chief Executive Officer',
    qualification: 'BA Political Science & Public Administration',
    since: '2021',
    bio: 'Over 10 years of progressive experience in debt recovery, management and company leadership. Skilled in administration, client relations, and operational oversight.',
  },
  {
    name: 'Getruda Audphas Myula',
    role: 'Managing Director',
    qualification: 'BA Public Administration',
    since: '2021',
    bio: 'Skilled administrator ensuring governance and accountability across all company operations.',
  },
  {
    name: 'Godfrey Paul Chunda',
    role: 'Recovery Manager',
    qualification: 'Diploma in Shipping & Port Management',
    since: '2021',
    bio: 'Leads recovery operations with a focus on professionalism and integrity in all client engagements.',
  },
  {
    name: 'Jerry January',
    role: 'Legal Advisor',
    qualification: 'Master of Laws (LL.M)',
    since: '2021',
    bio: 'Provides legal advisory, contract management, corporate governance and compliance solutions.',
  },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
      <span className="w-8 h-0.5 bg-[#D4A017]" />
      {text}
      <span className="w-8 h-0.5 bg-[#D4A017]" />
    </div>
  )
}

export default function AboutSection() {
  const profile = useInView()
  const values = useInView()
  const whyUs = useInView()
  const teamSection = useInView()

  return (
    <section id="about" className="bg-white">

      {/* ── Company Profile ── */}
      <div ref={profile.ref} className="py-20 bg-[#F4F7FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div className={`transition-all duration-700 ${profile.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <SectionLabel text="Who We Are" />
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A1F44] leading-tight mb-6">
                Tanzania's Premier<br />
                <span className="text-[#D4A017]">Commission Agent</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                <strong className="text-[#0A1F44]">HOLLYNESS & RESPISHERS COMPANY LIMITED</strong> is a fully licensed commission agent offering debt collection, public auctions, general brokerage, execution of court orders and distress for rent services across Tanzania.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Since incorporation on 5th February 2021, we have established a strong reputation as a trusted provider of professional, confidential, and affordable services to individuals, corporations and public institutions across Tanzania.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With our head office in Mbeya and branches in Dar es Salaam, Arusha, Dodoma and Mwanza, we serve clients nationwide with flexibility, integrity and excellence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/about"
                  className="flex items-center gap-2 bg-[#0A1F44] text-white px-5 py-3 rounded-md font-bold text-sm hover:bg-[#112a5e] transition-colors"
                >
                  Full Company Profile <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 border-2 border-[#0A1F44] text-[#0A1F44] px-5 py-3 rounded-md font-bold text-sm hover:bg-[#0A1F44] hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right — quick facts grid */}
            <div className={`transition-all duration-700 delay-200 ${profile.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BuildingOffice2Icon, label: 'Founded', value: '2021' },
                  { icon: BuildingOffice2Icon, label: 'Reg. Number', value: '150355419' },
                  { icon: BuildingOffice2Icon, label: 'Branches', value: '5 Cities' },
                  { icon: BuildingOffice2Icon, label: 'Auctioneer License', value: '#000003633' },
                ].map((fact) => (
                  <div key={fact.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-[#D4A017]/10 rounded-lg flex items-center justify-center mb-3">
                      <fact.icon className="w-5 h-5 text-[#D4A017]" />
                    </div>
                    <div className="text-[#0A1F44] font-bold text-lg">{fact.value}</div>
                    <div className="text-gray-500 text-sm">{fact.label}</div>
                  </div>
                ))}
              </div>

              {/* Clients strip */}
              <div className="mt-4 bg-[#0A1F44] rounded-xl p-5">
                <p className="text-[#D4A017] text-xs font-bold uppercase tracking-wider mb-3">Trusted By</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Platinum Credit Ltd', 'Victoria Finance PLC', 'FINCA Microfinance Bank', 'NMB Bank Plc', 'BRAC Tanzania', 'NOE Microfinance Bank'].map((c) => (
                    <div key={c} className="text-[#C8D5E5] text-xs py-1.5 px-2 bg-white/5 rounded flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full flex-shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Vision & Mission ── */}
      <div className="py-16 bg-[#0A1F44]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center mb-5">
                <EyeIcon className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-serif">Our Vision</h3>
              <p className="text-[#C8D5E5] leading-relaxed text-lg">
                To be the leading commission agent in Tanzania, recognized for excellence in Debt Collection, Public Auctions, General Brokerage, Execution of Court Orders and Distress for Rent services.
              </p>
            </div>
            <div className="bg-[#D4A017]/10 border border-[#D4A017]/30 rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center mb-5">
                <StarIcon className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-serif">Our Mission</h3>
              <p className="text-[#C8D5E5] leading-relaxed text-lg">
                To provide high-quality, professional and confidential services at affordable rates, helping clients safeguard their interests and minimize financial losses, while strictly adhering to the laws and regulations of the United Republic of Tanzania.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Core Values ── */}
      <div ref={values.ref} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel text="Our Values" />
            <h2 className="text-4xl font-bold text-[#0A1F44]">What Drives Us</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">The principles that guide every engagement, decision and relationship we build with our clients.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map((v, i) => (
              <div
                key={v.title}
                className={`group text-center p-6 rounded-2xl border border-gray-100 hover:border-[#D4A017]/30 hover:shadow-lg transition-all duration-500 ${
                  values.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#D4A017]/10 group-hover:bg-[#D4A017] rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <v.icon className="w-7 h-7 text-[#D4A017] group-hover:text-[#0A1F44] transition-colors" />
                </div>
                <h4 className="font-bold text-[#0A1F44] text-base mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div ref={whyUs.ref} className="py-20 bg-[#F4F7FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className={`transition-all duration-700 ${whyUs.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <SectionLabel text="Why Choose Us" />
              <h2 className="text-4xl font-bold text-[#0A1F44] mb-6">
                A Partner You Can <span className="text-[#D4A017]">Trust</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our proven expertise and nationwide presence make us the partner of choice for financial institutions, corporations, and individuals seeking professional debt recovery and auctioneering services.
              </p>
              <ul className="space-y-3">
                {whyChooseUs.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-gray-700 text-sm">
                    <CheckCircleIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Financial performance */}
            <div className={`transition-all duration-700 delay-200 ${whyUs.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-[#0A1F44] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2 font-serif">Financial Performance</h3>
                <p className="text-[#8A9BB0] text-sm mb-6">Annual revenue growth — demonstrating sound management and stakeholder confidence.</p>
                <div className="space-y-4">
                  {[
                    { year: '2022', revenue: 'TZS 61,883,247', growth: 'Base year', pct: 20 },
                    { year: '2023', revenue: 'TZS 138,818,086', growth: '+124.32%', pct: 55 },
                    { year: '2024', revenue: 'TZS 313,683,162', growth: '+125.97%', pct: 100 },
                  ].map((row) => (
                    <div key={row.year}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-bold text-sm">{row.year}</span>
                        <span className="text-[#C8D5E5] text-xs">{row.revenue}</span>
                        <span className="text-[#D4A017] text-xs font-bold">{row.growth}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4A017] rounded-full transition-all duration-1000"
                          style={{ width: whyUs.inView ? `${row.pct}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[#D4A017]/10 border border-[#D4A017]/20 rounded-lg text-center">
                  <p className="text-[#D4A017] text-xs uppercase tracking-wider font-bold">Audited by</p>
                  <p className="text-white font-bold mt-1">Brain Power Consultants</p>
                  <p className="text-[#8A9BB0] text-xs">NIC Building, Karume Road, Mbeya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Leadership Team ── */}
      <div ref={teamSection.ref} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel text="Our Team" />
            <h2 className="text-4xl font-bold text-[#0A1F44]">Leadership Team</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Experienced professionals committed to delivering results with integrity and accountability.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={member.name}
                className={`group bg-[#F4F7FA] rounded-2xl p-6 border border-transparent hover:border-[#D4A017]/30 hover:shadow-lg transition-all duration-500 ${
                  teamSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 bg-[#0A1F44] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#D4A017] transition-colors">
                  <UserGroupIcon className="w-8 h-8 text-[#D4A017] group-hover:text-[#0A1F44] transition-colors" />
                </div>
                <h4 className="font-bold text-[#0A1F44] text-base leading-tight">{member.name}</h4>
                <p className="text-[#D4A017] text-sm font-semibold mt-0.5 mb-1">{member.role}</p>
                <p className="text-gray-400 text-xs mb-3">{member.qualification}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-400">
                  With company since <span className="text-[#0A1F44] font-semibold">{member.since}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border-2 border-[#0A1F44] text-[#0A1F44] px-6 py-3 rounded-md font-bold text-sm hover:bg-[#0A1F44] hover:text-white transition-colors"
            >
              View Full Team <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
