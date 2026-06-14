import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { FaFacebook, FaInstagram, FaXTwitter, FaWhatsapp } from 'react-icons/fa6'

const services = [
  { label: 'Debt Collection',      href: '/services' },
  { label: 'Public Auctions',      href: '/services' },
  { label: 'Court Order Execution', href: '/services' },
  { label: 'Distress for Rent',    href: '/services' },
  { label: 'General Brokerage',    href: '/services' },
  { label: 'Skip Tracing',         href: '/services' },
]

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Recovery Process', href: '/recovery-process' },
  { label: 'Blog & Insights', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
  { label: 'Client Portal', href: '/portal/login' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'AML Policy', href: '/aml-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

export default function Footer() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) { setStatus('ok'); setEmail('') }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-[#061229] text-[#C8D5E5]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-[#D4A017] rounded-lg flex items-center justify-center font-bold text-[#0A1F44] text-xl font-serif">
                H&amp;R
              </div>
              <div>
                <div className="text-white font-bold leading-tight">HOLLYNESS &amp; RESPISHERS</div>
                <div className="text-[#D4A017] text-xs">Company Limited</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Tanzania's trusted licensed commission agent for debt collection, public auctions, court order execution and general brokerage services.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebook,  href: '#', label: 'Facebook' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaXTwitter,  href: '#', label: 'X (Twitter)' },
                { icon: FaWhatsapp,  href: 'https://wa.me/255762058614', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-[#D4A017] hover:text-[#0A1F44] rounded-full flex items-center justify-center text-base transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 pb-2 border-b border-[#D4A017]/30">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.label}>
                  <Link to={s.href} className="text-sm hover:text-[#D4A017] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full flex-shrink-0" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 pb-2 border-b border-[#D4A017]/30">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm hover:text-[#D4A017] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 pb-2 border-b border-[#D4A017]/30">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPinIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0 mt-0.5" />
                <span>Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741, Mbeya, Tanzania</span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                <a href="tel:+255762058614" className="hover:text-[#D4A017] transition-colors">+255 762 058 614</a>
              </li>
              <li className="flex gap-3">
                <EnvelopeIcon className="w-5 h-5 text-[#D4A017] flex-shrink-0" />
                <a href="mailto:Office@hollyrespishers.com" className="hover:text-[#D4A017] transition-colors break-all">
                  Office@hollyrespishers.com
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-[#8A9BB0] mb-2 font-medium">NEWSLETTER</p>
              {status === 'ok' ? (
                <p className="text-[#D4A017] text-sm font-semibold">You're subscribed!</p>
              ) : (
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                    placeholder="Your email"
                    required
                    className="flex-1 bg-white/10 text-white placeholder-[#8A9BB0] text-sm px-3 py-2 rounded-md border border-white/20 focus:outline-none focus:border-[#D4A017]"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#D4A017] text-[#0A1F44] px-3 py-2 rounded-md text-sm font-bold hover:bg-[#e8b520] disabled:opacity-60 transition-colors"
                  >
                    {status === 'loading' ? '…' : '→'}
                  </button>
                </form>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs mt-1">Something went wrong. Try again.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#8A9BB0]">
          <p>&copy; {new Date().getFullYear()} Hollyness &amp; Respishers Company Limited. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((l) => (
              <Link key={l.label} to={l.href} className="hover:text-[#D4A017] transition-colors">
                {l.label}
              </Link>
            ))}
            <Link to="/admin/login" className="hover:text-[#D4A017] transition-colors">
              CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
