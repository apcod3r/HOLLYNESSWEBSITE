import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ScaleIcon,
  HomeModernIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  ShieldExclamationIcon,
  BanknotesIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const coreServices = [
  {
    icon: BriefcaseIcon,
    title: 'Debt Collection',
    shortDesc: 'Efficient recovery of outstanding debts through legal, transparent and results-driven processes.',
    fullDesc:
      'We pursue overdue accounts on your behalf using professional, ethical and legally compliant methods — from initial debtor contact through to full settlement. Our team handles commercial, consumer and institutional debt portfolios nationwide.',
    tag: 'Core Service',
    color: 'gold',
  },
  {
    icon: BuildingStorefrontIcon,
    title: 'Public Auctions',
    shortDesc: 'Licensed auctioneer services ensuring fair, compliant and well-marketed property and asset sales.',
    fullDesc:
      'As a licensed auctioneer under Tanzanian law, we conduct transparent public auctions for movable and immovable assets — including property, vehicles, equipment and goods — with full compliance, marketing and settlement support.',
    tag: 'Core Service',
    color: 'gold',
  },
  {
    icon: ScaleIcon,
    title: 'Execution of Court Orders',
    shortDesc: 'Professional enforcement of court judgments and decrees across Tanzania.',
    fullDesc:
      'We hold certified competency in court brokerage and process serving (Law School of Tanzania, 2023). Our legal officers execute court decrees, enforce judgments and serve legal process documents with precision and full legal authority.',
    tag: 'Core Service',
    color: 'gold',
  },
  {
    icon: HomeModernIcon,
    title: 'Distress for Rent',
    shortDesc: 'Legal recovery of unpaid rent for landlords and property managers across Tanzania.',
    fullDesc:
      'We assist property owners in lawfully recovering rental arrears by levying distress on tenants\' goods, managing the legal process and facilitating settlement — protecting your rental income without jeopardising landlord-tenant relationships.',
    tag: 'Core Service',
    color: 'gold',
  },
  {
    icon: ArrowsRightLeftIcon,
    title: 'General Brokerage',
    shortDesc: 'Trusted intermediaries in financial and commercial transactions.',
    fullDesc:
      'Acting as licensed commission agents, we facilitate transactions between buyers and sellers, lenders and borrowers, and other commercial parties — ensuring terms are fair, documented and executed with professional accountability.',
    tag: 'Core Service',
    color: 'gold',
  },
]

const additionalServices = [
  { icon: MagnifyingGlassIcon,        title: 'Skip Tracing',               desc: 'Locating debtors who have moved or cannot be reached through standard means.' },
  { icon: DocumentMagnifyingGlassIcon, title: 'Credit Investigation',       desc: 'In-depth investigation of creditworthiness and debtor financial standing.' },
  { icon: ShieldExclamationIcon,       title: 'Credit Risk Management',     desc: 'Advisory and tools to help clients minimise future credit exposure.' },
  { icon: BanknotesIcon,               title: 'Debt Negotiation & Settlement', desc: 'Structured negotiation between creditors and debtors for agreed repayment.' },
  { icon: CubeTransparentIcon,         title: 'Asset Tracing',              desc: 'Identification and location of debtor assets to support recovery action.' },
  { icon: GlobeAltIcon,                title: 'International Debt Recovery', desc: 'Cross-border recovery support for debts owed by overseas parties.' },
]

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

export default function ServicesSection() {
  const hero   = useInView(0.1)
  const cards  = useInView(0.05)
  const extra  = useInView(0.05)

  return (
    <section id="services" className="bg-white scroll-mt-[90px]">

      {/* ── Section header ── */}
      <div className="bg-[#0A1F44] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            What We Do
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-5">
            Our Commission Agent Services
          </h2>
          <p className="text-[#C8D5E5] text-lg max-w-3xl mx-auto leading-relaxed">
            HOLLYNESS & RESPISHERS COMPANY LIMITED is a fully licensed commission agent offering a comprehensive suite of professional services to individuals, corporations and institutions across Tanzania.
          </p>
        </div>
      </div>

      {/* ── 5 Core service cards ── */}
      <div ref={cards.ref} className="py-20 bg-[#F4F7FA]">
        <div className="max-w-7xl mx-auto px-6">

          {/* First row — 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {coreServices.slice(0, 3).map((svc, i) => (
              <ServiceCard key={svc.title} svc={svc} index={i} visible={cards.inView} />
            ))}
          </div>

          {/* Second row — 2 cards centred */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {coreServices.slice(3).map((svc, i) => (
              <ServiceCard key={svc.title} svc={svc} index={i + 3} visible={cards.inView} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Additional / specialised services ── */}
      <div ref={extra.ref} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              Specialised Services
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h3 className="text-3xl font-bold text-[#0A1F44] font-serif">
              Extended Recovery Capabilities
            </h3>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Beyond our core services, we offer a range of specialist capabilities to cover every stage of the debt recovery lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {additionalServices.map((svc, i) => (
              <div
                key={svc.title}
                className={`flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#D4A017]/40 hover:shadow-md bg-[#F4F7FA] transition-all duration-500 ${
                  extra.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 bg-[#0A1F44] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svc.icon className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0A1F44] text-sm mb-1">{svc.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA banner ── */}
      <div ref={hero.ref} className="bg-[#0A1F44] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className={`transition-all duration-700 ${
              hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
              Ready to Recover What's Yours?
            </h3>
            <p className="text-[#C8D5E5] text-lg mb-8 max-w-2xl mx-auto">
              Talk to our licensed recovery experts today. We'll assess your case and recommend the most effective, cost-efficient approach.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById('contact')
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
                }}
                className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-7 py-3.5 rounded-md font-bold text-base hover:bg-[#e8b520] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#D4A017]/20"
              >
                Submit a Debt Case <ArrowRightIcon className="w-4 h-4" />
              </a>
              <Link
                to="/industries"
                className="flex items-center gap-2 border-2 border-[#D4A017] text-[#D4A017] px-7 py-3.5 rounded-md font-bold text-base hover:bg-[#D4A017] hover:text-[#0A1F44] transition-all hover:-translate-y-0.5"
              >
                Industries We Serve
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

/* ── Reusable service card ── */
interface Svc {
  icon: React.ElementType
  title: string
  shortDesc: string
  fullDesc: string
  tag: string
}

function ServiceCard({ svc, index, visible }: { svc: Svc; index: number; visible: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D4A017]/30 transition-all duration-500 flex flex-col ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gold top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#D4A017] to-[#e8b520] w-0 group-hover:w-full transition-all duration-500" />

      <div className="p-7 flex flex-col flex-1">
        {/* Icon + tag row */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 bg-[#0A1F44] group-hover:bg-[#D4A017] rounded-2xl flex items-center justify-center transition-colors duration-300">
            <svc.icon className="w-7 h-7 text-[#D4A017] group-hover:text-[#0A1F44] transition-colors duration-300" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2.5 py-1 rounded-full">
            {svc.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#0A1F44] mb-3 font-serif">{svc.title}</h3>

        {/* Description — collapsed or expanded */}
        <p className="text-gray-500 text-sm leading-relaxed flex-1">
          {expanded ? svc.fullDesc : svc.shortDesc}
        </p>

        {/* Expand / Collapse + CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-sm text-[#0A1F44] font-semibold hover:text-[#D4A017] transition-colors flex items-center gap-1.5"
          >
            {expanded ? 'Show less' : 'Read more'}
            <ArrowRightIcon className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('contact')
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
            }}
            className="text-sm font-bold text-[#D4A017] hover:text-[#0A1F44] transition-colors"
          >
            Hire Us →
          </a>
        </div>
      </div>
    </div>
  )
}
