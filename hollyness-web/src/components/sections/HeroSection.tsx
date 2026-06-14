import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheckIcon, ScaleIcon, BuildingLibraryIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useSettings } from '../../contexts/SettingsContext'

interface StatItem {
  value: number
  suffix: string
  label: string
}

const stats: StatItem[] = [
  { value: 100, suffix: '%', label: '≈Revenue Growth (YoY)' },
  { value: 5,   suffix: '+', label: 'Branch Offices Nationwide' },
  { value: 10,  suffix: '+', label: 'Major Clients' },
  { value: 4,   suffix: '+', label: 'Years of Excellence' },
]

const quickServices = [
  { icon: ScaleIcon,           label: 'Debt Collection' },
  { icon: BuildingLibraryIcon, label: 'Public Auctions' },
  { icon: ShieldCheckIcon,     label: 'Court Order Execution' },
  { icon: ScaleIcon,           label: 'Distress for Rent' },
  { icon: BuildingLibraryIcon, label: 'General Brokerage' },
]

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatCard({ stat, animate }: { stat: StatItem; animate: boolean }) {
  const count = useCountUp(stat.value, 1800, animate)
  return (
    <div className="text-center px-4">
      <div className="text-3xl md:text-4xl font-bold text-[#D4A017] font-serif leading-none">
        {count}{stat.suffix}
      </div>
      <div className="text-[#C8D5E5] text-sm mt-1.5 leading-tight">{stat.label}</div>
    </div>
  )
}

export default function HeroSection() {
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const { get } = useSettings()

  const heroBg = get('hero_bg_image') || '/tree.png'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dynamic background image */}
      <div className="absolute inset-0">
        <img
          key={heroBg}
          src={heroBg}
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6,18,41,0.45) 2%, rgba(10,31,68,0.30) 55%, rgba(6,18,41,0.40) 98%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to top, rgba(6,18,41,1) 0%, transparent 100%)' }}
        />
      </div>

      {/* Main hero content */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D4A017]/15 border border-[#D4A017]/30 text-[#D4A017] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                <ShieldCheckIcon className="w-4 h-4" />
                Hollyness &amp; Respishers Company Limited
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-serif">
                Your Trusted{' '}
                <span className="text-[#D4A017]">Recovery</span>{' '}
                Partner in Tanzania
              </h1>

              <p className="text-white/95 text-lg md:text-xl leading-relaxed mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                We help individuals, companies, and institutions recover debts, execute court orders, and manage auctions with{' '}
                <span className="text-[#D4A017] font-semibold">professionalism, confidentiality and integrity.</span>
              </p>

              <p className="text-white/85 text-base leading-relaxed mb-8 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Head office in Mbeya with branches in Dar es Salaam, Arusha, Dodoma and Mwanza — delivering nationwide coverage since 2021.
              </p>

            </div>

            {/* Right — info card */}
            <div className="relative hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-[#112a5e] border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <img
                      src="/Logo.png"
                      alt="Hollyness & Respishers Logo"
                      className="h-24 w-auto object-contain mx-auto mb-3"
                    />
                    <h3 className="text-white font-bold text-xl font-serif">HOLLYNESS &amp; RESPISHERS</h3>
                    <p className="text-[#D4A017] text-sm font-medium mt-1">Company Limited</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Incorporated', value: '5th February 2021' },
                      { label: 'Reg. Number',  value: '150355419' },
                      { label: 'Auctioneer License', value: '#000003633' },
                      { label: 'TIN',          value: '150-355-419' },
                      { label: 'Coverage',     value: '5 Cities Nationwide' },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-[#8A9BB0]">{row.label}</span>
                        <span className="text-white font-medium">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-[#D4A017]/10 rounded-lg border border-[#D4A017]/20 text-center">
                    <p className="text-[#D4A017] text-xs font-semibold uppercase tracking-wider">Revenue Growth</p>
                    <p className="text-white text-2xl font-bold mt-1">≈100%</p>
                    <p className="text-[#8A9BB0] text-xs mt-0.5">Year-on-year (2022–2024)</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-[#D4A017] text-[#0A1F44] px-4 py-2 rounded-lg shadow-lg text-sm font-bold">
                  10+ Major Clients
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div ref={statsRef} className="relative bg-[#061229] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} animate={statsVisible} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick services strip */}
      <div className="relative bg-white border-t-4 border-[#D4A017]">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 md:gap-0 md:divide-x md:divide-gray-200">
            <span className="text-[#0A1F44] font-bold text-sm uppercase tracking-wide mr-4 hidden md:block flex-shrink-0">
              Our Services:
            </span>
            {quickServices.map(({ icon: Icon, label }) => (
              <Link
                key={label}
                to="/services"
                className="flex items-center gap-2 px-4 py-1 text-sm text-[#0A1F44] hover:text-[#D4A017] font-medium transition-colors group"
              >
                <Icon className="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                {label}
              </Link>
            ))}
            <Link
              to="/services"
              className="ml-auto flex items-center gap-1.5 text-sm text-[#D4A017] font-bold hover:text-[#0A1F44] transition-colors flex-shrink-0"
            >
              View All Services <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
