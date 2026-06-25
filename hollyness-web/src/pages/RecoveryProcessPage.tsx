import SEO from '../components/SEO'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import { apiGet } from '../lib/api'
import { getIcon } from '../lib/iconMap'

interface ApiStep {
  id: number
  step_number: number
  title: string
  subtitle: string
  description: string
  what_you_provide: string[]
  outcome: string
  duration: string
  icon_name: string
  is_active: boolean
}

const guarantees = [
  { icon: ShieldCheckIcon, title: 'Fully Licensed', text: 'Certified commission agent and auctioneer under Tanzanian law.' },
  { icon: CheckCircleIcon, title: 'No Recovery, No Fee', text: 'Our fees are performance-based — you only pay when we collect.' },
  { icon: ClockIcon,       title: '24-Hour Response', text: 'Every new case submission acknowledged within one business day.' },
  { icon: ScaleIcon,       title: 'Legally Compliant', text: 'All actions comply with Tanzania\'s debt collection and AML regulations.' },
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

export default function RecoveryProcessPage() {
  const [steps, setSteps] = useState<ApiStep[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const guaranteesRef = useInView(0.1)
  const ctaRef        = useInView(0.1)

  useEffect(() => {
    apiGet<ApiStep[]>('/process').then(setSteps).catch(() => {})
  }, [])

  return (
    <>
      <SEO
        title="Our Recovery Process"
        description="Our structured 7-step debt recovery process: case submission, assessment, engagement, negotiation, legal action, auction and case closure — transparent at every stage."
        path="/recovery-process"
      />
      {/* ── Page header ── */}
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">Recovery Process</span>
          </div>
          <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-0.5 bg-[#D4A017]" />
            How It Works
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Our Recovery Process
          </h1>
          <p className="text-[#C8D5E5] text-lg max-w-2xl leading-relaxed">
            A transparent, 7-step process from the moment you submit your case to final settlement and reporting — with you informed at every stage.
          </p>
        </div>
      </div>

      {/* ── Guarantees strip ── */}
      <div ref={guaranteesRef.ref} className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((g, i) => (
              <div
                key={g.title}
                className={`flex gap-4 items-start transition-all duration-600 ${
                  guaranteesRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 bg-[#D4A017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <g.icon className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <p className="font-bold text-[#0A1F44] text-sm">{g.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{g.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main: step navigator + detail ── */}
      <div className="bg-[#F4F7FA] py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-0.5 bg-[#D4A017]" />
              Step by Step
              <span className="w-8 h-0.5 bg-[#D4A017]" />
            </div>
            <h2 className="text-4xl font-bold text-[#0A1F44] font-serif">The 7-Step Recovery Journey</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Click any step to see exactly what happens — and what we need from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Step navigator (left) */}
            <div className="space-y-2">
              {steps.map((step, i) => (
                <button
                  key={step.step_number}
                  onClick={() => setActiveStep(i)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 ${
                    activeStep === i
                      ? 'bg-[#0A1F44] border-[#0A1F44] shadow-lg'
                      : 'bg-white border-gray-100 hover:border-[#D4A017]/40 hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${
                      activeStep === i ? 'bg-[#D4A017] text-[#0A1F44]' : 'bg-[#F4F7FA] text-[#8A9BB0]'
                    }`}
                  >
                    {String(step.step_number).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm truncate transition-colors ${activeStep === i ? 'text-white' : 'text-[#0A1F44]'}`}>
                      {step.title}
                    </p>
                    <p className={`text-xs truncate transition-colors ${activeStep === i ? 'text-[#D4A017]' : 'text-gray-400'}`}>
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Step detail (right, spans 2 cols) */}
            <div className="lg:col-span-2">
              {steps.map((step, i) => {
                const StepIcon = getIcon(step.icon_name)
                return (
                <div
                  key={step.step_number}
                  className={`transition-all duration-300 ${
                    activeStep === i ? 'block' : 'hidden'
                  }`}
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

                    {/* Header */}
                    <div className="flex items-start gap-5 mb-6 pb-6 border-b border-gray-100">
                      <div className="w-16 h-16 bg-[#0A1F44] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <StepIcon className="w-8 h-8 text-[#D4A017]" />
                      </div>
                      <div>
                        <div className="text-[#D4A017] text-xs font-bold uppercase tracking-wider mb-1">
                          Step {String(step.step_number).padStart(2, '0')}
                        </div>
                        <h3 className="text-2xl font-bold text-[#0A1F44] font-serif">{step.title}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">{step.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>

                    {/* What you provide */}
                    {step.what_you_provide.length > 0 && (
                      <div className="mb-6">
                        <p className="text-[#0A1F44] font-bold text-sm mb-3">What You Provide:</p>
                        <ul className="space-y-2">
                          {step.what_you_provide.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                              <CheckCircleIcon className="w-4 h-4 text-[#D4A017] flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Outcome + duration */}
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                      <div className="bg-[#D4A017]/8 border border-[#D4A017]/20 rounded-xl p-4">
                        <p className="text-[#D4A017] text-xs font-bold uppercase tracking-wider mb-1.5">Expected Outcome</p>
                        <p className="text-[#0A1F44] text-sm leading-relaxed">{step.outcome}</p>
                      </div>
                      <div className="bg-[#F4F7FA] border border-gray-100 rounded-xl p-4">
                        <p className="text-[#8A9BB0] text-xs font-bold uppercase tracking-wider mb-1.5">Typical Duration</p>
                        <p className="text-[#0A1F44] text-sm font-semibold">{step.duration}</p>
                      </div>
                    </div>

                    {/* Step navigation */}
                    <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-100">
                      <button
                        onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                        disabled={activeStep === 0}
                        className="text-sm text-gray-400 hover:text-[#0A1F44] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        ← Previous Step
                      </button>
                      {activeStep < steps.length - 1 ? (
                        <button
                          onClick={() => setActiveStep((s) => s + 1)}
                          className="flex items-center gap-1.5 text-sm font-bold text-[#D4A017] hover:text-[#0A1F44] transition-colors"
                        >
                          Next Step <ArrowRightIcon className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <Link
                          to="/contact"
                          className="flex items-center gap-1.5 text-sm font-bold text-[#D4A017] hover:text-[#0A1F44] transition-colors"
                        >
                          Submit Your Case <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual timeline strip ── */}
      <div className="bg-white py-16 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center text-2xl font-bold text-[#0A1F44] font-serif mb-10">
            At a Glance
          </h3>
          <div className="flex items-start gap-0 min-w-[700px]">
            {steps.map((step, i) => (
              <div key={step.step_number} className="flex-1 relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#D4A017] to-[#D4A017]/30 z-0" />
                )}
                <button
                  onClick={() => { setActiveStep(i); window.scrollTo({ top: 500, behavior: 'smooth' }) }}
                  className="relative z-10 flex flex-col items-center gap-2 group w-full"
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    activeStep === i
                      ? 'bg-[#D4A017] border-[#D4A017] text-[#0A1F44] scale-110'
                      : 'bg-white border-[#D4A017]/40 text-[#8A9BB0] group-hover:border-[#D4A017] group-hover:text-[#D4A017]'
                  }`}>
                    {String(step.step_number).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-center text-gray-500 group-hover:text-[#0A1F44] transition-colors leading-tight px-1">
                    {step.title}
                  </span>
                </button>
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
            Start Your Recovery
            <span className="w-8 h-0.5 bg-[#D4A017]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
            Ready to Begin?
          </h2>
          <p className="text-[#C8D5E5] text-lg mb-8 max-w-2xl mx-auto">
            Submit your case today and a dedicated recovery officer will contact you within 24 hours to begin the assessment process.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="flex items-center gap-2 bg-[#D4A017] text-[#0A1F44] px-7 py-3.5 rounded-md font-bold hover:bg-[#e8b520] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#D4A017]/20"
            >
              Submit a Debt Case <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/industries"
              className="flex items-center gap-2 border-2 border-[#D4A017] text-[#D4A017] px-7 py-3.5 rounded-md font-bold hover:bg-[#D4A017] hover:text-[#0A1F44] transition-all hover:-translate-y-0.5"
            >
              Industries We Serve
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
