import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import ServicesSection from '../components/sections/ServicesSection'

export default function HomePage() {
  return (
    // id="home" is flush with the top of the page (header floats over it)
    <div id="home">
      <HeroSection />

      {/* AboutSection carries id="about" on its own root element */}
      <AboutSection />

      {/* ServicesSection carries id="services" on its own root element */}
      <ServicesSection />

      {/* Contact placeholder — replaced with real section next */}
      <div id="contact" className="scroll-mt-[90px]" />
    </div>
  )
}
