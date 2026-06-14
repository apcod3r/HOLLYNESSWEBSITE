import { useEffect, useRef, useState } from 'react'
import { BriefcaseIcon, MapPinIcon, ClockIcon, ArrowRightIcon, CheckCircleIcon, UserGroupIcon, LightBulbIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { apiGet, apiPost } from '../lib/api'

interface JobOpening {
  id: number
  title: string
  department: string
  location: string
  job_type: string
  summary: string
  requirements: string[]
  is_active: boolean
}

const culture = [
  { icon: ShieldCheckIcon, title: 'Integrity First', text: 'We do the right thing — for our clients, our debtors and our colleagues.' },
  { icon: LightBulbIcon,   title: 'Growth Mindset', text: 'We invest in our people. Training, mentorship and career advancement are part of our culture.' },
  { icon: UserGroupIcon,   title: 'Team Spirit', text: 'We win together. Collaboration, respect and accountability define how we work.' },
  { icon: CheckCircleIcon, title: 'Results Driven', text: 'We take ownership of our targets and deliver — for clients and for ourselves.' },
]

interface AppForm { name: string; email: string; phone: string; position: string; message: string }
interface AppErrors { name?: string; email?: string; phone?: string; position?: string; message?: string }

function validate(d: AppForm): AppErrors {
  const e: AppErrors = {}
  if (!d.name.trim() || d.name.trim().length < 2) e.name = 'Full name is required.'
  if (!d.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Valid email is required.'
  if (d.phone && !/^[+]?[\d\s\-()]{7,15}$/.test(d.phone.trim())) e.phone = 'Enter a valid phone number.'
  if (!d.position) e.position = 'Please select a position.'
  if (!d.message.trim() || d.message.trim().length < 30) e.message = 'Please write at least 30 characters.'
  return e
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

const inputCls = (err?: string) => `w-full px-4 py-2.5 rounded-lg border text-sm text-[#1a2b45] bg-white focus:outline-none focus:ring-2 transition-colors ${err ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#D4A017] focus:ring-[#D4A017]/20'}`

export default function CareersPage() {
  const openingsRef = useInView(0.05)
  const formRef     = useInView(0.05)
  const [openings, setOpenings] = useState<JobOpening[]>([])
  const [form, setForm]       = useState<AppForm>({ name: '', email: '', phone: '', position: '', message: '' })
  const [errors, setErrors]   = useState<AppErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiGet<JobOpening[]>('/jobs').then(setOpenings).catch(() => {})
  }, [])

  const set = (f: keyof AppForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [f]: e.target.value }))
    if (touched.has(f)) setErrors(validate({ ...form, [f]: e.target.value }))
  }
  const touch = (f: string) => setTouched((t) => new Set(t).add(f))
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(new Set(Object.keys(form)))
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSubmitting(true)
    try {
      await apiPost('/careers/apply', { ...form, cover_letter: form.message })
      setSubmitted(true)
    } catch (err) {
      setErrors({ message: (err as Error).message || 'Submission failed. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a><span>/</span>
            <span className="text-[#D4A017]">Careers</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />Join Our Team<span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Careers at Hollyness &amp; Respishers</h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">Join a growing team committed to professional excellence in debt recovery and auctioneering across Tanzania.</p>
        </div>
      </div>

      {/* Culture */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Why Work With Us</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">A culture built on integrity, growth and teamwork — where your contribution matters.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {culture.map((v) => (
              <div key={v.title} className="bg-[#F4F7FA] rounded-2xl p-6 border border-gray-100 text-center hover:border-[#D4A017]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-[#D4A017]" />
                </div>
                <h4 className="font-bold text-[#0A1F44] text-sm mb-2">{v.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Openings */}
      <div ref={openingsRef.ref} className="bg-[#F4F7FA] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />Open Positions<span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Current Openings</h2>
            <p className="text-gray-500 mt-2 text-sm">All positions are subject to availability. Apply using the form below.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {openings.map((job, i) => (
              <div key={job.title} className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#D4A017]/30 transition-all duration-500 p-7 ${openingsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#0A1F44] rounded-xl flex items-center justify-center flex-shrink-0">
                    <BriefcaseIcon className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A1F44] text-lg font-serif">{job.title}</h3>
                    <p className="text-[#D4A017] text-sm font-semibold">{job.department}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-[#F4F7FA] px-3 py-1.5 rounded-full"><MapPinIcon className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-[#F4F7FA] px-3 py-1.5 rounded-full"><ClockIcon className="w-3.5 h-3.5" /> {job.job_type}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{job.summary}</p>
                <ul className="space-y-1.5 mb-5">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full flex-shrink-0 mt-1.5" />{r}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setForm((f) => ({ ...f, position: job.title })); document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                  className="flex items-center gap-2 text-sm font-bold text-[#D4A017] hover:text-[#0A1F44] transition-colors group">
                  Apply for this Role <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application form */}
      <div ref={formRef.ref} id="apply-form" className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />Apply Now<span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0A1F44] font-serif">Send Your Application</h2>
            <p className="text-gray-500 mt-2 text-sm">We review all applications and respond to shortlisted candidates within 7 business days.</p>
          </div>
          <div className="bg-[#F4F7FA] rounded-2xl border border-gray-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-9 h-9 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1F44] font-serif mb-2">Application Received!</h3>
                <p className="text-gray-500 text-sm max-w-sm">Thank you, <strong>{form.name.split(' ')[0]}</strong>. We've received your application and will be in touch with shortlisted candidates within 7 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Full Name <span className="text-[#D4A017]">*</span></label>
                    <input type="text" value={form.name} onChange={set('name')} onBlur={() => touch('name')} placeholder="Your full name" className={inputCls(errors.name)} />
                    {errors.name && <p className="mt-1 flex items-center gap-1 text-red-600 text-xs"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Email Address <span className="text-[#D4A017]">*</span></label>
                    <input type="email" value={form.email} onChange={set('email')} onBlur={() => touch('email')} placeholder="you@example.com" className={inputCls(errors.email)} />
                    {errors.email && <p className="mt-1 flex items-center gap-1 text-red-600 text-xs"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.email}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} onBlur={() => touch('phone')} placeholder="+255 7xx xxx xxx" className={inputCls(errors.phone)} />
                    {errors.phone && <p className="mt-1 flex items-center gap-1 text-red-600 text-xs"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Position Applying For <span className="text-[#D4A017]">*</span></label>
                    <select value={form.position} onChange={set('position')} onBlur={() => touch('position')} className={inputCls(errors.position)}>
                      <option value="">— Select a position —</option>
                      {openings.map((j) => <option key={j.title} value={j.title}>{j.title}</option>)}
                      <option value="General Application">General Application</option>
                    </select>
                    {errors.position && <p className="mt-1 flex items-center gap-1 text-red-600 text-xs"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.position}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Cover Letter / Why You Are a Good Fit <span className="text-[#D4A017]">*</span></label>
                  <textarea rows={5} value={form.message} onChange={set('message')} onBlur={() => touch('message')} placeholder="Tell us about your experience, skills and why you want to join our team (min 30 characters)..." className={inputCls(errors.message) + ' resize-none'} />
                  {errors.message && <p className="mt-1 flex items-center gap-1 text-red-600 text-xs"><ExclamationCircleIcon className="w-3.5 h-3.5" />{errors.message}</p>}
                </div>
                <p className="text-xs text-gray-400">By applying you agree to our <a href="/privacy-policy" className="text-[#D4A017] hover:underline">Privacy Policy</a>. We handle all applications with strict confidentiality.</p>
                <button type="submit" disabled={submitting} className="w-full bg-[#D4A017] text-[#0A1F44] py-3.5 rounded-lg font-bold hover:bg-[#e8b520] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? (<><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting…</>) : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
