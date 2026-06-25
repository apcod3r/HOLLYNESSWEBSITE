import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import ContactSection from '../components/sections/ContactSection'

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Reach Hollyness & Respishers — Mbeya HQ on BOT Road, plus offices in Dar es Salaam, Arusha, Dodoma and Mwanza. Call, email or fill in our contact form."
        path="/contact"
      />
      <div className="bg-[#0A1F44] pt-28 pb-0">
        <div className="max-w-7xl mx-auto px-6 pb-4">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm">
            <Link to="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4A017]">Contact Us</span>
          </div>
        </div>
      </div>
      <ContactSection />
    </>
  )
}
