import SEO from '../components/SEO'
import HeroSection from '../components/sections/HeroSection'

export default function HomePage() {
  return (
    <>
      <SEO path="/" />
      <div id="home">
        <HeroSection />
      </div>
    </>
  )
}
