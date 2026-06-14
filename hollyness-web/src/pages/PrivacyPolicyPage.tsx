import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#0A1F44] font-serif mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a><span>/</span>
            <span className="text-[#D4A017]">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-3">Privacy Policy</h1>
          <p className="text-[#8A9BB0] text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-10 p-5 bg-[#F4F7FA] rounded-xl border border-gray-100">
            Hollyness & Respishers Company Limited ("we", "our", "us") is committed to protecting the privacy and confidentiality of your personal information. This Privacy Policy explains how we collect, use, store and protect your data when you use our website or engage our services.
          </p>

          <Section title="1. Information We Collect">
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li><strong>Identity & contact data:</strong> Full name, email address, phone number, physical address and organisation name.</li>
              <li><strong>Case & financial data:</strong> Debt details, supporting documents, debtor information submitted to us for recovery purposes.</li>
              <li><strong>Usage data:</strong> IP address, browser type, pages visited and time spent on our website (collected via analytics tools).</li>
              <li><strong>Communications:</strong> Messages, enquiries and correspondence submitted through our contact forms or email.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your personal information to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Process and manage debt recovery cases on your behalf.</li>
              <li>Communicate with you regarding your case, enquiries or service requests.</li>
              <li>Comply with legal and regulatory obligations under Tanzanian law.</li>
              <li>Improve our website, services and internal processes.</li>
              <li>Send relevant updates, newsletters or service notifications (where you have consented).</li>
            </ul>
          </Section>

          <Section title="3. Disclosure of Information">
            <p>We do not sell, rent or trade your personal information. We may share your data only with:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li><strong>Authorised personnel:</strong> Our staff directly involved in your case.</li>
              <li><strong>Legal & regulatory authorities:</strong> Where required by court order, law enforcement or applicable Tanzanian legislation.</li>
              <li><strong>Professional advisors:</strong> Auditors, legal counsel and compliance officers bound by confidentiality obligations.</li>
              <li><strong>Service providers:</strong> Third-party IT, hosting and communication providers acting under data processing agreements.</li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, disclosure, alteration or destruction. These include encrypted data transmission (HTTPS), access controls, and secure data storage.</p>
            <p>Despite these measures, no data transmission over the internet is completely secure. We encourage you to contact us immediately if you suspect any unauthorised use of your information.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. Case records are retained for a minimum of 7 years in accordance with Tanzanian legal and regulatory requirements.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>Subject to applicable law, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your data where it is no longer necessary.</li>
              <li>Withdraw consent for marketing communications at any time.</li>
              <li>Lodge a complaint with the relevant data protection authority in Tanzania.</li>
            </ul>
          </Section>

          <Section title="7. Cookies">
            <p>Our website uses cookies to enhance your browsing experience. Please refer to our <Link to="/cookie-policy" className="text-[#D4A017] hover:underline">Cookie Policy</Link> for full details on how we use cookies and how to manage your preferences.</p>
          </Section>

          <Section title="8. Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any external websites you visit.</p>
          </Section>

          <Section title="9. Contact Us">
            <p>If you have any questions, concerns or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <div className="mt-3 p-4 bg-[#F4F7FA] rounded-xl text-sm space-y-1">
              <p><strong>Hollyness & Respishers Company Limited</strong></p>
              <p>Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741, Mbeya, Tanzania</p>
              <p>Email: <a href="mailto:Office@hollyrespishers.com" className="text-[#D4A017]">Office@hollyrespishers.com</a></p>
              <p>Phone: <a href="tel:+255762058614" className="text-[#D4A017]">+255 762 058 614</a></p>
            </div>
          </Section>

          <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-gray-100">
            <Link to="/terms" className="text-sm text-[#D4A017] hover:underline">Terms & Conditions</Link>
            <span className="text-gray-300">|</span>
            <Link to="/cookie-policy" className="text-sm text-[#D4A017] hover:underline">Cookie Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/aml-policy" className="text-sm text-[#D4A017] hover:underline">AML Policy</Link>
          </div>
        </div>
      </div>
    </>
  )
}
