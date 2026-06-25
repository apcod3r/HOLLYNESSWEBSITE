import SEO from '../components/SEO'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'
import { getIcon } from '../lib/iconMap'

interface ApiIndustry {
  id: number
  icon_name: string
  title: string
  description: string
  cases: string[]
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

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<ApiIndustry[]>([])
  const intro   = useInView(0.1)
  const grid    = useInView(0.05)
  const process = useInView(0.1)

  useEffect(() => {
    apiGet<ApiIndustry[]>('/industries').then(setIndustries).catch(() => {})
  }, [])

  return (
    <>
      <SEO
        title="Industries We Serve"
        description="Hollyness & Respishers serves banks, MFIs, SACCOs, healthcare providers, real estate firms, telecoms and more — sector-specific debt recovery across Tanzania."
        path="/industries"
      />
      {/* ── Page header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">Industries We Serve</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Sector Expertise
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Industries We Serve
          </h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">
            From banking and microfinance to healthcare and real estate — we bring specialist debt recovery expertise to every sector we work in.
          </p>

          {/* Quick stat strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
            {[
              { num: '11+', label: 'Sectors Served' },
              { num: '10+', label: 'Major Clients' },
              { num: '5', label: 'Cities Nationwide' },
              { num: '4+', label: 'Years Experience' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-[#D4A017] font-serif">{s.num}</div>
                <div className="text-[#C8D5E5] text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Intro strip ── */}
      <div ref={intro.ref} className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`grid md:grid-cols-3 gap-8 transition-all duration-700 ${
              intro.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {[
              {
                icon: CheckCircleIcon,
                heading: 'Sector-Specific Expertise',
                text: 'Our team understands the regulatory environment, debtor behaviour and recovery challenges unique to each industry we serve.',
              },
              {
                icon: ShieldCheckIcon,
                heading: 'Compliant & Ethical',
                text: 'Every recovery action is fully compliant with Tanzanian law, AML regulations and industry-specific codes of practice.',
              },
              {
                icon: ScaleIcon,
                heading: 'End-to-End Recovery',
                text: 'From first contact through negotiation, legal action and final settlement — we manage the entire recovery lifecycle for each sector.',
              },
            ].map((item, i) => (
              <div
                key={item.heading}
                className="flex gap-4"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[#D4A017]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A1F44] mb-1">{item.heading}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Industry cards grid ── */}
      <div ref={grid.ref} className="bg-[#F4F7FA] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              All Sectors
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-4xl font-bold text-[#0A1F44] font-serif">
              Sector-by-Sector Recovery
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Tailored debt recovery strategies for every industry — because no two sectors face the same challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, i) => {
              const Icon = getIcon(industry.icon_name)
              return (
              <div
                key={industry.id}
                className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D4A017]/30 transition-all duration-500 flex flex-col ${
                  grid.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(i % 6) * 80}ms` }}
              >
                {/* Gold accent bar on hover */}
                <div className="h-1 bg-gradient-to-r from-[#D4A017] to-[#e8b520] w-0 group-hover:w-full transition-all duration-500" />

                <div className="p-7 flex flex-col flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-[#0A1F44] group-hover:bg-[#D4A017] rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 flex-shrink-0">
                    <Icon className="w-7 h-7 text-[#D4A017] group-hover:text-[#0A1F44] transition-colors duration-300" />
                  </div>

                  {/* Title + description */}
                  <h3 className="text-xl font-bold text-[#0A1F44] mb-3 font-serif">{industry.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{industry.description}</p>

                  {/* Typical cases */}
                  <div className="bg-[#F4F7FA] rounded-xl p-4 mb-5">
                    <p className="text-[#0A1F44] text-xs font-bold uppercase tracking-wider mb-2">Typical Cases</p>
                    <ul className="space-y-1.5">
                      {industry.cases.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full flex-shrink-0 mt-1" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-bold text-[#0A1F44] hover:text-[#D4A017] transition-colors group/link"
                  >
                    Submit a Case in This Sector
                    <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── How we work ── */}
      <div ref={process.ref} className="bg-[#0A1F44] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              Our Approach
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-4xl font-bold text-white font-serif">
              How We Work With Your Sector
            </h2>
            <p className="text-[#C8D5E5] mt-3 max-w-xl mx-auto">
              A structured, sector-sensitive approach that maximises recovery while protecting your business relationships.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Case Assessment', desc: 'We review your portfolio, documentation and debtor profiles to design the most effective recovery strategy for your sector.' },
              { step: '02', title: 'Debtor Engagement', desc: 'Professional first contact via written notice, phone and personal visit — firm yet respectful, preserving your brand reputation.' },
              { step: '03', title: 'Negotiation & Settlement', desc: 'Structured negotiation to agree repayment terms, instalment plans or lump-sum settlements in your best interest.' },
              { step: '04', title: 'Legal Enforcement', desc: 'Where negotiation fails, we pursue court action, obtain judgments, execute decrees and conduct auctions as required.' },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`transition-all duration-600 ${
                  process.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="text-5xl font-bold text-[#D4A017]/20 font-serif mb-3">{item.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#C8D5E5] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-[#C8D5E5] text-lg mb-6">
              Ready to start recovering what's owed to your organisation?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-7 py-3.5 rounded-md font-bold hover:bg-[#e8b520] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#D4A017]/20"
              >
                Submit a Debt Case <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/recovery-process"
                className="flex items-center gap-2 border-2 border-[#D4A017] text-[#D4A017] px-7 py-3.5 rounded-md font-bold hover:bg-[#D4A017] hover:text-[#0A1F44] transition-all hover:-translate-y-0.5"
              >
                Our Recovery Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
