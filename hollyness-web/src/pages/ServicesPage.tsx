import ServicesSection from '../components/sections/ServicesSection'

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-[#0A1F44] pt-28 pb-0">
        <div className="max-w-7xl mx-auto px-6 pb-0">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#D4A017]">Our Services</span>
          </div>
        </div>
      </div>
      <ServicesSection />
    </>
  )
}
