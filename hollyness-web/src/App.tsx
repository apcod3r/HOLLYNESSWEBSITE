import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import { useAuth } from './contexts/AuthContext'

// Public pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TeamPage from './pages/TeamPage'
import ServicesPage from './pages/ServicesPage'
import IndustriesPage from './pages/IndustriesPage'
import RecoveryProcessPage from './pages/RecoveryProcessPage'
import TestimonialsPage from './pages/TestimonialsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import FaqPage from './pages/FaqPage'
import CareersPage from './pages/CareersPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import AmlPolicyPage from './pages/AmlPolicyPage'
import DisclaimerPage from './pages/DisclaimerPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import NotFoundPage from './pages/NotFoundPage'
import PortalLoginPage from './pages/portal/LoginPage'

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ContactsPage from './pages/admin/ContactsPage'
import AdminCareersPage from './pages/admin/AdminCareersPage'
import BlogListPage from './pages/admin/BlogListPage'
import BlogEditorPage from './pages/admin/BlogEditorPage'
import FaqsAdminPage from './pages/admin/FaqsAdminPage'
import TestimonialsAdminPage from './pages/admin/TestimonialsAdminPage'
import NewsletterPage from './pages/admin/NewsletterPage'
import UsersPage from './pages/admin/UsersPage'
import SiteSettingsPage from './pages/admin/SiteSettingsPage'
import ServicesAdminPage from './pages/admin/ServicesAdminPage'
import TeamAdminPage from './pages/admin/TeamAdminPage'
import IndustriesAdminPage from './pages/admin/IndustriesAdminPage'
import JobOpeningsAdminPage from './pages/admin/JobOpeningsAdminPage'
import ProcessStepsAdminPage from './pages/admin/ProcessStepsAdminPage'
import PartnersAdminPage from './pages/admin/PartnersAdminPage'

function RequireAdmin() {
  const { token } = useAuth()
  const location  = useLocation()
  if (!token) return <Navigate to="/admin/login" state={{ from: location }} replace />
  return <AdminLayout />
}

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <Routes>
        {/* ── Public site ──────────────────────────────────────────────── */}
        <Route element={<Layout />}>
          <Route path="/"                 element={<HomePage />} />
          <Route path="/about"            element={<AboutPage />} />
          <Route path="/team"             element={<TeamPage />} />
          <Route path="/services"         element={<ServicesPage />} />
          <Route path="/industries"       element={<IndustriesPage />} />
          <Route path="/recovery-process" element={<RecoveryProcessPage />} />
          <Route path="/testimonials"     element={<TestimonialsPage />} />
          <Route path="/blog"             element={<BlogPage />} />
          <Route path="/blog/:slug"       element={<BlogPostPage />} />
          <Route path="/faq"              element={<FaqPage />} />
          <Route path="/careers"          element={<CareersPage />} />
          <Route path="/contact"          element={<ContactPage />} />
          <Route path="/privacy-policy"   element={<PrivacyPolicyPage />} />
          <Route path="/terms"            element={<TermsPage />} />
          <Route path="/aml-policy"       element={<AmlPolicyPage />} />
          <Route path="/disclaimer"       element={<DisclaimerPage />} />
          <Route path="/cookie-policy"    element={<CookiePolicyPage />} />
          <Route path="/portal/login"     element={<PortalLoginPage />} />
          <Route path="*"                 element={<NotFoundPage />} />
        </Route>

        {/* ── Admin login (no admin layout) ────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ── Protected admin panel ────────────────────────────────────── */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin"                element={<DashboardPage />} />
          <Route path="/admin/contacts"       element={<ContactsPage />} />
          <Route path="/admin/careers"        element={<AdminCareersPage />} />
          <Route path="/admin/blog"           element={<BlogListPage />} />
          <Route path="/admin/blog/new"       element={<BlogEditorPage />} />
          <Route path="/admin/blog/:id"       element={<BlogEditorPage />} />
          <Route path="/admin/faqs"           element={<FaqsAdminPage />} />
          <Route path="/admin/testimonials"   element={<TestimonialsAdminPage />} />
          <Route path="/admin/newsletter"     element={<NewsletterPage />} />
          <Route path="/admin/users"          element={<UsersPage />} />
          <Route path="/admin/settings"       element={<SiteSettingsPage />} />
          <Route path="/admin/services"       element={<ServicesAdminPage />} />
          <Route path="/admin/team"           element={<TeamAdminPage />} />
          <Route path="/admin/industries"     element={<IndustriesAdminPage />} />
          <Route path="/admin/jobs"           element={<JobOpeningsAdminPage />} />
          <Route path="/admin/process"        element={<ProcessStepsAdminPage />} />
          <Route path="/admin/partners"       element={<PartnersAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  )
}
