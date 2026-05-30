import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function Layout() {
  const location  = useLocation()
  const isPortal  = location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin')
  const isHome    = location.pathname === '/'

  return (
    <div className="flex flex-col min-h-screen">
      {!isPortal && <Header />}
      <main
        className={`flex-1 ${
          isPortal
            ? ''
            : isHome
              ? '' // homepage hero fills full viewport — header is transparent overlay
              : 'pt-[68px] md:pt-[90px]' // other pages: push below fixed header
        }`}
      >
        <Outlet />
      </main>
      {!isPortal && <Footer />}
      {!isPortal && <WhatsAppButton />}
    </div>
  )
}
