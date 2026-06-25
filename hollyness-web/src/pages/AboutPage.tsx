import SEO from '../components/SEO'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  EyeIcon,
  StarIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'
import { getIcon } from '../lib/iconMap'

interface ApiService {
  id: number
  title: string
  short_desc: string
  icon_name: string
  category: string
  sort_order: number
  is_active: boolean
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

const values = [
  { icon: ShieldCheckIcon,    title: 'Integrity',       desc: 'We act with honesty and fairness in every engagement — with clients, debtors and partners alike.' },
  { icon: EyeIcon,            title: 'Confidentiality', desc: 'Client information and case details are protected at all times, without exception.' },
  { icon: StarIcon,           title: 'Professionalism', desc: 'Every assignment is handled with expertise, diligence and respect for all parties involved.' },
  { icon: CurrencyDollarIcon, title: 'Affordability',   desc: 'High-quality services delivered at rates that make professional recovery accessible to all clients.' },
  { icon: LightBulbIcon,      title: 'Innovation',      desc: 'We continuously refine our methods to find better, faster and more effective solutions for our clients.' },
]

export default function AboutPage() {
  const [services, setServices] = useState<ApiService[]>([])
  const welcome  = useInView()
  const philo    = useInView()
  const valuesS  = useInView()
  const svcsS    = useInView()

  useEffect(() => {
    apiGet<ApiService[]>('/services').then(data => setServices(data.filter(s => s.category === 'core'))).catch(() => {})
  }, [])

  return (
    <>
      <SEO
        title="About Us"
        description="Hollyness & Respishers Co. Ltd — our history, mission, vision and values. A licensed Tanzanian firm specialising in debt recovery, auctioneering and court order execution since 2021."
        path="/about"
      />
      {/* ── Page Header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4A017]">About Us</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Who We Are
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            About Hollyness &amp; Respishers
          </h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">
            A licensed commission agent built on integrity, professionalism and a commitment to delivering results for clients across Tanzania.
          </p>
        </div>
      </div>

      {/* ── Welcome from MD ── */}
      <div ref={welcome.ref} className="bg-[#F4F7FA] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className={`transition-all duration-700 ${welcome.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
                <span className="w-8 h-0.5 bg-[#D4A017]" />
                A Message from Our Director
              </div>
              <h2 className="text-4xl font-bold text-[#0A1F44] font-serif leading-tight mb-6">
                Welcome to<br /><span className="text-[#D4A017]">Hollyness &amp; Respishers</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Thank you for visiting our website and taking the time to learn about our company.</p>
                <p>Since our establishment in 2021, our mission has been simple: to provide professional, ethical and results-driven debt recovery and auctioneering services that help our clients protect their assets, recover outstanding debts and achieve peace of mind.</p>
                <p>What sets us apart is our commitment to integrity, confidentiality and excellence in every assignment we undertake. We understand that debt recovery requires not only legal and technical expertise but also professionalism, respect and a solutions-oriented approach.</p>
                <p>From our headquarters in Mbeya and through our presence across Tanzania, our dedicated team works tirelessly to deliver efficient and compliant services to financial institutions, businesses, government entities and individuals.</p>
                <p>Whether you are seeking debt collection, auctioneering, execution of court orders, distress for rent or brokerage services, we look forward to partnering with you.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-[#D4A017] font-bold italic text-xl font-serif">Joachim Kalungwe</p>
                <p className="text-[#0A1F44] text-sm font-semibold mt-0.5">Chief Executive Officer</p>
                <p className="text-gray-400 text-xs">Hollyness &amp; Respishers Company Limited</p>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-200 ${welcome.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BuildingOffice2Icon, label: 'Incorporated',       value: '5 Feb 2021' },
                  { icon: BuildingOffice2Icon, label: 'Reg. Number',        value: '150355419' },
                  { icon: BuildingOffice2Icon, label: 'Branch Offices',     value: '5 Cities' },
                  { icon: BuildingOffice2Icon, label: 'Auctioneer License', value: '#000003633' },
                ].map((f) => (
                  <div key={f.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-[#D4A017]/10 rounded-lg flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5 text-[#D4A017]" />
                    </div>
                    <div className="text-[#0A1F44] font-bold text-lg">{f.value}</div>
                    <div className="text-gray-500 text-sm">{f.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#0A1F44] rounded-xl p-6 flex items-center gap-4">
                <CheckCircleIcon className="w-10 h-10 text-[#D4A017] flex-shrink-0" />
                <div>
                  <p className="text-white font-bold">Fully Licensed &amp; Regulated</p>
                  <p className="text-[#8A9BB0] text-sm mt-0.5">Compliant with all Tanzanian laws governing commission agents, auctioneers and debt recovery professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Vision & Mission ── */}
      <div ref={philo.ref} className="bg-[#0A1F44] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              Our Philosophy
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">Vision &amp; Mission</h2>
          </div>
          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${philo.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center mb-5">
                <EyeIcon className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif mb-4">Our Vision</h3>
              <p className="text-[#C8D5E5] leading-relaxed text-lg">
                To be the leading commission agent in Tanzania, recognized for excellence in Debt Collection, Public Auctions, General Brokerage, Execution of Court Orders and Distress for Rent services.
              </p>
            </div>
            <div className="bg-[#D4A017]/10 border border-[#D4A017]/30 rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center mb-5">
                <StarIcon className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif mb-4">Our Mission</h3>
              <p className="text-[#C8D5E5] leading-relaxed text-lg">
                To provide high-quality, professional and confidential services at affordable rates, helping clients safeguard their interests and minimize financial losses, while strictly adhering to the laws and regulations of the United Republic of Tanzania.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Core Values ── */}
      <div ref={valuesS.ref} className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              Our Values
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1F44] font-serif">What We Stand For</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">The principles that guide every engagement, decision and relationship we build.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`group text-center p-6 rounded-2xl border border-gray-100 hover:border-[#D4A017]/30 hover:shadow-lg transition-all duration-500 ${
                  valuesS.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 bg-[#D4A017]/10 group-hover:bg-[#D4A017] rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <v.icon className="w-7 h-7 text-[#D4A017] group-hover:text-[#0A1F44] transition-colors duration-300" />
                </div>
                <h4 className="font-bold text-[#0A1F44] text-base mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services Summary ── */}
      <div ref={svcsS.ref} className="bg-[#F4F7FA] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              What We Do
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1F44] font-serif">Our Core Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              A comprehensive suite of licensed commission agent services delivered across Tanzania.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {services.map((svc, i) => {
              const Icon = getIcon(svc.icon_name)
              return (
                <div
                  key={svc.id}
                  className={`bg-white rounded-xl border border-gray-100 p-6 flex gap-4 hover:border-[#D4A017]/30 hover:shadow-md transition-all duration-500 ${
                    svcsS.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="w-11 h-11 bg-[#0A1F44] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#D4A017]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A1F44] text-sm mb-1">{svc.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{svc.short_desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-[#0A1F44] text-white px-7 py-3.5 rounded-md font-bold hover:bg-[#112a5e] transition-colors"
            >
              View Full Services Detail <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#D4A017] py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0A1F44] font-serif mb-3">Ready to Work With Us?</h2>
          <p className="text-[#0A1F44]/80 text-lg mb-8">
            Submit your case and one of our recovery specialists will respond within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="flex items-center gap-2 bg-[#0A1F44] text-white px-7 py-3.5 rounded-md font-bold hover:bg-[#112a5e] transition-all hover:-translate-y-0.5"
            >
              Contact Us <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/team"
              className="flex items-center gap-2 border-2 border-[#0A1F44] text-[#0A1F44] px-7 py-3.5 rounded-md font-bold hover:bg-[#0A1F44] hover:text-white transition-all"
            >
              Meet Our Team
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
