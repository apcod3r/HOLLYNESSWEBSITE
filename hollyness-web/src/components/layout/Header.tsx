import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'

// sectionId → smooth-scroll within the homepage
// href only  → navigate to a standalone page
const navItems = [
  { label: 'Home',             sectionId: 'home',      href: null },
  { label: 'About Us',         sectionId: 'about',     href: null },
  { label: 'Services',         sectionId: 'services',  href: null },
  { label: 'Industries',       sectionId: null,        href: '/industries' },
  { label: 'Recovery Process', sectionId: null,        href: '/recovery-process' },
  { label: 'Blog',             sectionId: null,        href: '/blog' },
  { label: 'Testimonials',     sectionId: null,        href: '/testimonials' },
  { label: 'Contact Us',       sectionId: 'contact',   href: null },
]

// Section order as they appear top-to-bottom on the homepage
const HOME_SECTIONS = ['home', 'about', 'services', 'contact']

const HEADER_H = 90 // px — total header height (top bar + nav)

function scrollToSection(id: string) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_H
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate  = useNavigate()

  // Solid header once user scrolls past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: on homepage, update active section as user scrolls
  useEffect(() => {
    if (location.pathname !== '/') { setActiveSection(''); return }

    const detect = () => {
      // Walk sections bottom-up; the last one whose top is at or above the
      // header bottom is the "current" section.
      let current = 'home'
      for (const id of HOME_SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= HEADER_H + 20) current = id
      }
      setActiveSection(current)
    }

    detect() // run immediately on mount / page change
    window.addEventListener('scroll', detect, { passive: true })
    return () => window.removeEventListener('scroll', detect)
  }, [location.pathname])

  // Close mobile menu whenever the route changes
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: string | null, href: string | null) => {
      e.preventDefault()
      setMobileOpen(false)

      if (!sectionId) {
        // Standalone page
        navigate(href!)
        return
      }

      if (location.pathname === '/') {
        scrollToSection(sectionId)
      } else {
        // Come back to homepage first, then scroll
        navigate('/')
        setTimeout(() => scrollToSection(sectionId), 400)
      }
    },
    [location.pathname, navigate]
  )

  const isActive = (item: (typeof navItems)[0]): boolean => {
    if (item.sectionId) {
      return location.pathname === '/' && activeSection === item.sectionId
    }
    if (!item.href) return false
    return item.href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.href)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A1F44] shadow-xl shadow-black/30'
          : 'bg-[#0A1F44]/90 backdrop-blur-md'
      }`}
    >
      {/* ── Top info bar ── */}
      <div className="bg-[#061229] text-[#C8D5E5] text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>📍</span>
            <span>Mbeya HQ · Dar es Salaam · Arusha · Dodoma · Mwanza</span>
          </span>
          <div className="flex items-center gap-6">
            <a
              href="tel:+255762058614"
              className="flex items-center gap-1.5 hover:text-[#D4A017] transition-colors"
            >
              <PhoneIcon className="w-3 h-3" />
              +255 762 058 614
            </a>
            <a
              href="mailto:hollyrespishersco.ltd@gmail.com"
              className="hover:text-[#D4A017] transition-colors"
            >
              hollyrespishersco.ltd@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-[68px]">

          {/* Logo — clicking always goes to top of homepage */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                navigate('/')
              }
            }}
            className="flex-shrink-0"
          >
            <img
              src="/Logo.png"
              alt="Hollyness & Respishers Logo"
              className="h-11 md:h-14 w-auto object-contain"
            />
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.sectionId ? `#${item.sectionId}` : item.href!}
                onClick={(e) => handleNavClick(e, item.sectionId, item.href)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'text-[#D4A017] font-semibold'
                    : 'text-[#C8D5E5] hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/portal/login"
              className="text-sm text-[#C8D5E5] hover:text-white font-medium px-3 py-2 transition-colors"
            >
              Client Portal
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact', null)}
              className="bg-[#D4A017] text-[#0A1F44] px-4 py-2.5 rounded-md text-sm font-bold hover:bg-[#e8b520] transition-all hover:-translate-y-0.5"
            >
              Submit a Case
            </a>
          </div>

          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-md text-[#C8D5E5] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A1F44] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-3 space-y-0.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.sectionId ? `#${item.sectionId}` : item.href!}
                onClick={(e) => handleNavClick(e, item.sectionId, item.href)}
                className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'text-[#D4A017] bg-white/10 font-semibold'
                    : 'text-[#C8D5E5] hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Gold dot on active */}
                {isActive(item) && (
                  <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full mr-2 flex-shrink-0" />
                )}
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile CTAs */}
          <div className="px-4 pb-5 pt-2 border-t border-white/10 space-y-2">
            <Link
              to="/portal/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center py-3 px-4 rounded-md border border-[#D4A017] text-[#D4A017] text-sm font-bold"
            >
              Client Portal Login
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact', null)}
              className="block text-center py-3 px-4 rounded-md bg-[#D4A017] text-[#0A1F44] text-sm font-bold"
            >
              Submit a Debt Case
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
