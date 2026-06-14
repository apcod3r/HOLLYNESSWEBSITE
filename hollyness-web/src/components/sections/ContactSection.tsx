import { useState, useRef, useEffect } from 'react'
import { apiPost } from '../../lib/api'
import { useSettings } from '../../contexts/SettingsContext'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'

// ── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  email: string
  phone: string
  organization: string
  service: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
}

// ── Static data ────────────────────────────────────────────────────────────
const services = [
  'Debt Collection',
  'Public Auctions',
  'Execution of Court Orders',
  'Distress for Rent',
  'General Brokerage',
  'Skip Tracing',
  'Credit Investigation',
  'Asset Tracing',
  'Debt Negotiation & Settlement',
  'International Debt Recovery',
  'General Inquiry',
]

const branches = [
  { city: 'Mbeya (HQ)', detail: 'Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741' },
  { city: 'Dar es Salaam', detail: 'Branch Office' },
  { city: 'Arusha', detail: 'Branch Office' },
  { city: 'Dodoma', detail: 'Branch Office' },
  { city: 'Mwanza', detail: 'Branch Office' },
]

const businessHours = [
  { days: 'Monday – Friday', hours: '8:00 AM – 5:00 PM' },
  { days: 'Saturday', hours: '9:00 AM – 1:00 PM' },
  { days: 'Sunday & Public Holidays', hours: 'Closed' },
]

// ── Validation ─────────────────────────────────────────────────────────────
function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name.trim() || data.name.trim().length < 2)
    errors.name = 'Full name must be at least 2 characters.'

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email.trim())
    errors.email = 'Email address is required.'
  else if (!emailRx.test(data.email))
    errors.email = 'Please enter a valid email address.'

  if (data.phone.trim() && !/^[+]?[\d\s\-()]{7,15}$/.test(data.phone.trim()))
    errors.phone = 'Please enter a valid phone number.'

  if (!data.service)
    errors.service = 'Please select a service.'

  if (!data.message.trim() || data.message.trim().length < 20)
    errors.message = 'Message must be at least 20 characters.'

  return errors
}

// ── Small reusable components ──────────────────────────────────────────────
function Field({
  label, error, required, children,
}: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">
        {label} {required && <span className="text-[#D4A017]">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-red-600 text-xs">
          <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (error?: string) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm text-[#1a2b45] bg-white focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-red-400 focus:ring-red-200'
      : 'border-gray-200 focus:border-[#D4A017] focus:ring-[#D4A017]/20'
  }`

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

// ── Main component ─────────────────────────────────────────────────────────
export default function ContactSection() {
  const { get } = useSettings()
  const section = useInView(0.05)

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', organization: '', service: '', message: '',
  })
  const [errors, setErrors]   = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (touched.has(field)) {
      setErrors(validate({ ...form, [field]: e.target.value }))
    }
  }

  const touch = (field: string) => setTouched((t) => new Set(t).add(field))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = new Set(Object.keys(form))
    setTouched(allTouched)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      await apiPost('/contact', form)
      setSubmitted(true)
    } catch (err) {
      setErrors({ message: (err as Error).message || 'Failed to send. Please try again or email us directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="scroll-mt-[90px] bg-[#F4F7FA]">

      {/* ── Section header ── */}
      <div className="bg-[#0A1F44] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            Get In Touch
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Contact Us
          </h2>
          <p className="text-[#C8D5E5] text-lg max-w-2xl mx-auto">
            Talk to a licensed debt collection and auctioneering expert today. We respond within 24 hours on business days.
          </p>
        </div>
      </div>

      {/* ── Main grid: info left + form right ── */}
      <div ref={section.ref} className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── Left: contact info ── */}
          <div
            className={`lg:col-span-2 space-y-6 transition-all duration-700 ${
              section.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Main info card */}
            <div className="bg-[#0A1F44] rounded-2xl p-7 text-white">
              <h3 className="text-lg font-bold mb-5 font-serif text-[#D4A017]">Head Office — Mbeya</h3>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-0.5" />
                  <span className="text-[#C8D5E5] text-sm leading-relaxed">
                    {get('contact_address', 'Plot No. 1532, Old Forest St., BOT Road')},<br />
                    {get('contact_po_box', 'P.O. Box 741')}, {get('contact_city', 'Mbeya')}, Tanzania
                  </span>
                </li>
                <li className="flex gap-3">
                  <PhoneIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`tel:${get('contact_phone', '+255762058614')}`} className="text-[#C8D5E5] hover:text-[#D4A017] transition-colors block">
                      {get('contact_phone', '+255 762 058 614')}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    {[
                      { dept: 'General Office', email: 'Office@hollyrespishers.com' },
                      { dept: 'Managing Director', email: 'MD@hollyrespishers.com' },
                      { dept: 'Recovery Team', email: 'Recovery@hollyrespishers.com' },
                      { dept: 'Administration', email: 'Admin@hollyrespishers.com' },
                      { dept: 'Accounts', email: 'Accounts@hollyrespishers.com' },
                    ].map(({ dept, email }) => (
                      <div key={dept}>
                        <p className="text-[#D4A017] text-xs font-semibold">{dept}</p>
                        <a href={`mailto:${email}`} className="text-[#C8D5E5] hover:text-[#D4A017] transition-colors text-xs">
                          {email}
                        </a>
                      </div>
                    ))}
                  </div>
                </li>
                <li className="flex gap-3">
                  {/* WhatsApp icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#D4A017] flex-shrink-0 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <a
                    href={`https://wa.me/${get('contact_whatsapp', '255762058614').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C8D5E5] hover:text-[#D4A017] transition-colors text-sm"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            {/* Business hours */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-5 h-5 text-[#D4A017]" />
                <h4 className="font-bold text-[#0A1F44] text-sm">Business Hours</h4>
              </div>
              <ul className="space-y-2.5">
                {businessHours.map((row) => (
                  <li key={row.days} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-500">{row.days}</span>
                    <span className={`font-semibold ${row.hours === 'Closed' ? 'text-red-400' : 'text-[#0A1F44]'}`}>
                      {row.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Branch offices */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BuildingOffice2Icon className="w-5 h-5 text-[#D4A017]" />
                <h4 className="font-bold text-[#0A1F44] text-sm">Our Offices</h4>
              </div>
              <ul className="space-y-2">
                {branches.map((b) => (
                  <li key={b.city} className="flex items-start gap-2.5 text-sm">
                    <span className="w-2 h-2 bg-[#D4A017] rounded-full flex-shrink-0 mt-1.5" />
                    <div>
                      <span className="font-semibold text-[#0A1F44]">{b.city}</span>
                      <span className="text-gray-400 ml-1.5 text-xs">{b.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-44 bg-[#e8edf2] flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Mbeya,Tanzania"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-[#8A9BB0] hover:text-[#D4A017] transition-colors"
              >
                <MapPinIcon className="w-8 h-8" />
                <span className="text-sm font-medium">View on Google Maps</span>
                <span className="text-xs">Mbeya, Tanzania</span>
              </a>
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-150 ${
              section.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircleIcon className="w-9 h-9 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A1F44] font-serif mb-2">Message Sent!</h3>
                  <p className="text-gray-500 max-w-sm">
                    Thank you, <strong>{form.name.split(' ')[0]}</strong>. We've received your enquiry and will get back to you within 24 hours on business days.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setForm({ name: '', email: '', phone: '', organization: '', service: '', message: '' })
                      setTouched(new Set())
                      setErrors({})
                    }}
                    className="mt-6 text-sm text-[#D4A017] font-bold hover:text-[#0A1F44] transition-colors"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                /* Form */
                <>
                  <div className="mb-7">
                    <h3 className="text-2xl font-bold text-[#0A1F44] font-serif">Send Us a Message</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Fields marked <span className="text-[#D4A017] font-bold">*</span> are required.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Full Name" error={errors.name} required>
                        <input
                          type="text"
                          value={form.name}
                          onChange={set('name')}
                          onBlur={() => touch('name')}
                          placeholder="e.g. John Mwangi"
                          className={inputCls(errors.name)}
                        />
                      </Field>

                      <Field label="Email Address" error={errors.email} required>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set('email')}
                          onBlur={() => touch('email')}
                          placeholder="you@example.com"
                          className={inputCls(errors.email)}
                        />
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Phone Number" error={errors.phone}>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set('phone')}
                          onBlur={() => touch('phone')}
                          placeholder="+255 7xx xxx xxx"
                          className={inputCls(errors.phone)}
                        />
                      </Field>

                      <Field label="Organisation / Company">
                        <input
                          type="text"
                          value={form.organization}
                          onChange={set('organization')}
                          placeholder="Your company (optional)"
                          className={inputCls()}
                        />
                      </Field>
                    </div>

                    <Field label="Service Required" error={errors.service} required>
                      <select
                        value={form.service}
                        onChange={set('service')}
                        onBlur={() => touch('service')}
                        className={inputCls(errors.service)}
                      >
                        <option value="">— Select a service —</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Your Message" error={errors.message} required>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        onBlur={() => touch('message')}
                        placeholder="Briefly describe your case or enquiry (minimum 20 characters)..."
                        className={inputCls(errors.message) + ' resize-none'}
                      />
                      <p className="mt-1 text-right text-xs text-gray-300">
                        {form.message.length} chars
                      </p>
                    </Field>

                    {/* Privacy note */}
                    <p className="text-xs text-gray-400 leading-relaxed">
                      By submitting this form you agree to our{' '}
                      <a href="/privacy-policy" className="text-[#D4A017] hover:underline">Privacy Policy</a>.
                      Your information is handled with strict confidentiality.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#D4A017] text-[#0A1F44] py-3.5 rounded-lg font-bold text-base hover:bg-[#e8b520] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 shadow-lg shadow-[#D4A017]/20 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
