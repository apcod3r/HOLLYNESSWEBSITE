import SEO from '../components/SEO'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  HomeModernIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'

interface ApiTestimonial {
  id: number
  client_name: string
  contact_role: string | null
  sector: string | null
  quote: string
  recovered: string | null
  rating: number
  photo_url: string | null
  is_published: boolean
}

interface DisplayTestimonial extends ApiTestimonial {
  Icon: React.ElementType
}

const SECTOR_ICONS: Record<string, React.ElementType> = {
  'Microfinance':        CurrencyDollarIcon,
  'MFI Banking':         CurrencyDollarIcon,
  'Financial Institution': BuildingLibraryIcon,
  'Commercial Banking':  BuildingLibraryIcon,
  'Development Finance': BuildingOffice2Icon,
  'Real Estate':         HomeModernIcon,
  'Construction':        BuildingOffice2Icon,
  'Insurance':           ShieldCheckIcon,
}

function getIcon(sector: string | null): React.ElementType {
  return SECTOR_ICONS[sector ?? ''] ?? BuildingLibraryIcon
}

const caseStudies = [
  {
    title: 'Commercial Loan Portfolio Recovery',
    client: 'Regional Commercial Bank',
    sector: 'Banking',
    challenge: 'A batch of 47 commercial loan accounts totalling TZS 890M had been classified as non-performing for over 18 months. Internal recovery efforts had stalled.',
    approach: 'Hollyness & Respishers conducted full debtor assessments, skip traced 12 relocated borrowers and initiated structured repayment negotiations backed by court proceedings for 8 uncooperative accounts.',
    result: 'TZS 672M recovered (75.5% of total portfolio) within 90 days. 8 court decrees successfully executed.',
    stats: { recovered: '75.5%', timeline: '90 days', accounts: '47 accounts' },
  },
  {
    title: 'Rental Arrears & Distress for Rent',
    client: 'Property Management Company',
    sector: 'Real Estate',
    challenge: 'Multiple commercial tenants across 3 properties had accumulated rental arrears of over TZS 120M spanning 8–14 months. Eviction notices had been ignored.',
    approach: 'Our legal team initiated formal distress for rent proceedings, conducted property inspections and levied goods against non-paying tenants while simultaneously negotiating structured exit agreements.',
    result: 'Full recovery of TZS 114M (95% of arrears). All properties vacated or regularised within 45 days.',
    stats: { recovered: '95%', timeline: '45 days', accounts: '3 properties' },
  },
  {
    title: 'Public Auction — Asset Disposal',
    client: 'Financial Institution (Court Order)',
    sector: 'Auctioneering',
    challenge: 'Following a court judgment, a defaulted borrower\'s commercial vehicle fleet and office equipment needed to be auctioned to settle a debt of TZS 210M.',
    approach: 'As licensed auctioneers, we valued the assets, conducted public marketing, organised a well-attended auction event and managed buyer payments and transfers in full compliance.',
    result: 'Assets sold for TZS 198M — 94.3% of the judgment debt settled in a single auction event.',
    stats: { recovered: '94.3%', timeline: '21 days', accounts: '1 auction event' },
  },
]

const successStats = [
  { value: '75–95%', label: 'Typical Recovery Rate' },
  { value: '10+', label: 'Major Client Partners' },
  { value: '4+', label: 'Years of Results' },
  { value: '≈100%', label: 'Annual Revenue Growth' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-[#D4A017] text-[#D4A017]' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )
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

function TestimonialCard({ t, index, visible }: { t: DisplayTestimonial; index: number; visible: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const { Icon } = t
  const isLong = t.quote.length > 180

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#D4A017]/30 transition-all duration-500 flex flex-col overflow-hidden ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {/* Photo banner if available */}
      {t.photo_url && (
        <div className="h-44 overflow-hidden flex-shrink-0">
          <img src={t.photo_url} alt={t.client_name} className="w-full h-full object-cover object-top" />
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        <StarRating rating={t.rating} />
        <blockquote className={`text-gray-600 text-sm leading-relaxed mt-4 italic ${!expanded && isLong ? 'line-clamp-5' : ''}`}>
          "{t.quote}"
        </blockquote>
        {isLong && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-[#D4A017] hover:text-[#0A1F44] font-semibold mt-2 self-start transition-colors"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}
        {t.recovered && (
          <div className="mt-4 flex items-center gap-2 text-xs text-[#D4A017] font-semibold bg-[#D4A017]/10 rounded-lg px-3 py-2">
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            {t.recovered}
          </div>
        )}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
          {t.photo_url ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#D4A017]/30">
              <img src={t.photo_url} alt={t.client_name} className="w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#0A1F44] rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[#D4A017]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[#0A1F44] text-sm truncate">{t.client_name}</p>
            <p className="text-gray-400 text-xs truncate">{[t.contact_role, t.sector].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<DisplayTestimonial[]>([])
  const [loading, setLoading]           = useState(true)
  const statsRef = useInView(0.1)
  const cardsRef = useInView(0.05)
  const casesRef = useInView(0.05)
  const ctaRef   = useInView(0.1)

  useEffect(() => {
    apiGet<ApiTestimonial[]>('/testimonials')
      .then(data => {
        setTestimonials(data.map(t => ({ ...t, Icon: getIcon(t.sector) })))
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="Client Testimonials"
        description="Read what clients say about Hollyness & Respishers — verified testimonials from banks, businesses and individuals across Tanzania who recovered their debts."
        path="/testimonials"
      />
      {/* ── Page header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">Testimonials</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Client Feedback
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Testimonials &amp; Success Stories
          </h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">
            Real results from real clients. See what organisations across Tanzania say about partnering with Hollyness &amp; Respishers for debt recovery and auctioneering.
          </p>
        </div>
      </div>

      {/* ── Success stats bar ── */}
      <div ref={statsRef.ref} className="bg-[#D4A017] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-[#0A1F44]/20">
            {successStats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center px-4 transition-all duration-500 ${
                  statsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#0A1F44] font-serif">{s.value}</div>
                <div className="text-[#0A1F44]/70 text-sm mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonial cards ── */}
      <div ref={cardsRef.ref} className="bg-[#F4F7FA] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              What Clients Say
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-4xl font-bold text-[#0A1F44] font-serif">Client Testimonials</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Feedback from the financial institutions and organisations that trust us with their most challenging recovery cases.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading testimonials…</p>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No testimonials available yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.id} t={t} index={i} visible={cardsRef.inView} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Case studies ── */}
      <div ref={casesRef.ref} className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              Case Studies
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-4xl font-bold text-[#0A1F44] font-serif">Recovery in Action</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Detailed examples of how we approach complex recovery mandates — from initial assessment to final settlement.
            </p>
          </div>

          <div className="space-y-8">
            {caseStudies.map((cs, i) => (
              <div
                key={cs.title}
                className={`bg-[#F4F7FA] rounded-2xl border border-gray-100 overflow-hidden transition-all duration-600 ${
                  casesRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="bg-[#0A1F44] px-8 py-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[#D4A017] text-xs font-bold uppercase tracking-wider mb-1">{cs.sector}</p>
                    <h3 className="text-white font-bold text-xl font-serif">{cs.title}</h3>
                    <p className="text-[#8A9BB0] text-sm mt-0.5">{cs.client}</p>
                  </div>
                  <div className="flex gap-4">
                    {Object.entries(cs.stats).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-[#D4A017] font-bold text-lg">{val}</div>
                        <div className="text-[#8A9BB0] text-xs capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-8 grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[#0A1F44] font-bold text-sm mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs font-bold">!</span>
                      The Challenge
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div>
                    <p className="text-[#0A1F44] font-bold text-sm mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xs font-bold">→</span>
                      Our Approach
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">{cs.approach}</p>
                  </div>
                  <div>
                    <p className="text-[#0A1F44] font-bold text-sm mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                      The Result
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">{cs.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why clients trust us ── */}
      <div className="bg-[#F4F7FA] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Why Clients Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: ShieldCheckIcon, title: 'Licensed & Regulated', text: 'Fully compliant commission agent and auctioneer under Tanzania law.' },
              { icon: CheckCircleIcon,  title: 'Proven Track Record', text: '75–95% typical recovery rates across all sectors we serve.' },
              { icon: BuildingOffice2Icon, title: 'Nationwide Presence', text: 'Offices in 5 cities — we reach your debtors wherever they are.' },
              { icon: StarIcon, title: '5-Star Client Feedback', text: 'Every client we serve rates our professionalism and results highly.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:border-[#D4A017]/30 transition-all">
                <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#D4A017]" />
                </div>
                <h4 className="font-bold text-[#0A1F44] mb-2 text-sm">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div ref={ctaRef.ref} className="bg-[#0A1F44] py-16">
        <div
          className={`max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${
            ctaRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Join Our Clients
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
            Become Our Next Success Story
          </h2>
          <p className="text-[#C8D5E5] text-lg mb-8 max-w-2xl mx-auto">
            Join the growing list of organisations across Tanzania that trust Hollyness &amp; Respishers to recover what they are owed — professionally, ethically and effectively.
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
    </>
  )
}
