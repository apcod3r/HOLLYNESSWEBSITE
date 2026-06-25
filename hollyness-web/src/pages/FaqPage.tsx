import SEO from '../components/SEO'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'

interface ApiFaq {
  id: number
  category: string
  question: string
  answer: string
  sort_order: number
  is_published: boolean
}

interface FaqGroup {
  category: string
  items: { q: string; a: string }[]
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

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white hover:bg-[#F4F7FA] transition-colors group">
        <span className="font-semibold text-[#0A1F44] text-sm leading-snug group-hover:text-[#D4A017] transition-colors">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-[#D4A017] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-5 pt-2 bg-white border-t border-gray-50">
          <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [faqs, setFaqs]       = useState<FaqGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')
  const bodyRef = useInView(0.05)

  useEffect(() => {
    apiGet<ApiFaq[]>('/faqs')
      .then(data => {
        const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order)
        const grouped = sorted.reduce<FaqGroup[]>((acc, f) => {
          let group = acc.find(g => g.category === f.category)
          if (!group) { group = { category: f.category, items: [] }; acc.push(group) }
          group.items.push({ q: f.question, a: f.answer })
          return acc
        }, [])
        setFaqs(grouped)
        if (grouped.length > 0) setActiveCategory(grouped[0].category)
      })
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false))
  }, [])

  const currentFaqs = faqs.find((f) => f.category === activeCategory)?.items ?? []

  return (
    <>
      <SEO
        title="FAQ"
        description="Answers to common questions about debt collection, public auctions, court order enforcement and working with Hollyness & Respishers in Tanzania."
        path="/faq"
      />
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">FAQ</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />Help Centre<span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Frequently Asked Questions</h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">Answers to the most common questions about our services, processes, fees and client portal.</p>
        </div>
      </div>

      <div ref={bodyRef.ref} className="bg-[#F4F7FA] py-16">
        <div className="max-w-4xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading FAQs…</p>
              </div>
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No FAQs available yet.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-10">
                {faqs.map((f) => (
                  <button key={f.category} onClick={() => setActiveCategory(f.category)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === f.category ? 'bg-[#0A1F44] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#D4A017]/40 hover:text-[#0A1F44]'}`}>
                    {f.category}
                  </button>
                ))}
              </div>

              <div className={`space-y-3 transition-all duration-500 ${bodyRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {currentFaqs.map((item) => <AccordionItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </>
          )}

          <div className="mt-14 bg-[#0A1F44] rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl font-serif mb-2">Still Have Questions?</h3>
            <p className="text-[#C8D5E5] text-sm mb-6 max-w-sm mx-auto">Our team is ready to answer any questions not covered here. Reach out and we'll respond within 24 hours.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/#contact" onClick={(e) => { e.preventDefault(); window.location.href = '/'; setTimeout(() => { const el = document.getElementById('contact'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }) }, 400) }}
                className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-6 py-3 rounded-md font-bold text-sm hover:bg-[#e8b520] transition-colors">
                Contact Us <ArrowRightIcon className="w-4 h-4" />
              </a>
              <Link to="/recovery-process" className="flex items-center gap-2 border border-[#D4A017] text-[#D4A017] px-6 py-3 rounded-md font-bold text-sm hover:bg-[#D4A017] hover:text-[#0A1F44] transition-colors">
                Recovery Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
