import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#0A1F44] font-serif mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default function CookiePolicyPage() {
  return (
    <>
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a><span>/</span>
            <span className="text-[#D4A017]">Cookie Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-3">Cookie Policy</h1>
          <p className="text-[#8A9BB0] text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-10 p-5 bg-[#F4F7FA] rounded-xl border border-gray-100">
            This Cookie Policy explains how Hollyness & Respishers Company Limited uses cookies and similar technologies on our website. By continuing to use our site, you consent to our use of cookies as described below.
          </p>

          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files placed on your device (computer, tablet or mobile) when you visit a website. They help the website remember your preferences, improve your browsing experience and provide us with analytics about how our site is used.</p>
          </Section>

          <Section title="2. Types of Cookies We Use">
            <div className="space-y-4">
              {[
                { type: 'Essential Cookies', desc: 'These are necessary for the website to function correctly. They enable core features such as page navigation, form submission and secure area access. You cannot opt out of these cookies as they are required for the site to work.' },
                { type: 'Analytics Cookies', desc: 'We use analytics tools to understand how visitors interact with our website — including pages visited, time spent on site and referral sources. This data is used in aggregate and anonymised form to improve our website content and performance.' },
                { type: 'Functionality Cookies', desc: 'These cookies remember your preferences (such as language or region settings) to provide a more personalised experience on return visits.' },
                { type: 'Session Cookies', desc: 'Session cookies are temporary and are deleted when you close your browser. They help maintain your session as you navigate between pages.' },
              ].map((c) => (
                <div key={c.type} className="p-4 bg-[#F4F7FA] rounded-xl border border-gray-100">
                  <p className="font-bold text-[#0A1F44] text-sm mb-1">{c.type}</p>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="3. Third-Party Cookies">
            <p>Some cookies on our site are set by third-party services such as analytics providers (e.g. Google Analytics). These third parties have their own privacy policies and may collect data about your activity across multiple websites. We do not control these third-party cookies.</p>
          </Section>

          <Section title="4. Managing Your Cookie Preferences">
            <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>View cookies stored on your device and delete them individually or in bulk.</li>
              <li>Block third-party cookies.</li>
              <li>Block cookies from specific websites.</li>
              <li>Block all cookies from being set.</li>
              <li>Delete all cookies when you close your browser.</li>
            </ul>
            <p>Please note that blocking certain cookies may affect the functionality of our website. To learn how to manage cookies in your browser, visit your browser's help documentation.</p>
          </Section>

          <Section title="5. Changes to This Policy">
            <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with a revised effective date. We encourage you to review this page periodically to stay informed about our use of cookies.</p>
          </Section>

          <Section title="6. Contact Us">
            <div className="p-4 bg-[#F4F7FA] rounded-xl text-sm space-y-1">
              <p><strong>Hollyness & Respishers Company Limited</strong></p>
              <p>Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741, Mbeya, Tanzania</p>
              <p>Email: <a href="mailto:Office@hollyrespishers.com" className="text-[#D4A017]">Office@hollyrespishers.com</a></p>
            </div>
          </Section>

          <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-gray-100">
            <Link to="/privacy-policy" className="text-sm text-[#D4A017] hover:underline">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/terms" className="text-sm text-[#D4A017] hover:underline">Terms & Conditions</Link>
            <span className="text-gray-300">|</span>
            <Link to="/disclaimer" className="text-sm text-[#D4A017] hover:underline">Disclaimer</Link>
          </div>
        </div>
      </div>
    </>
  )
}
