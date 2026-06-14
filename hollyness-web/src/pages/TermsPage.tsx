import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#0A1F44] font-serif mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <>
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a><span>/</span>
            <span className="text-[#D4A017]">Terms & Conditions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-3">Terms &amp; Conditions</h1>
          <p className="text-[#8A9BB0] text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-10 p-5 bg-[#F4F7FA] rounded-xl border border-gray-100">
            These Terms and Conditions govern your use of the website and services of Hollyness & Respishers Company Limited ("the Company"). By using our website or engaging our services, you agree to be bound by these terms. Please read them carefully.
          </p>

          <Section title="1. Our Services">
            <p>Hollyness & Respishers Company Limited is a licensed commission agent providing debt collection, public auctioneering, execution of court orders, distress for rent and general brokerage services in Tanzania. All services are provided subject to a separate written engagement agreement between the Company and the client.</p>
          </Section>

          <Section title="2. Engagement & Instructions">
            <p>All instructions to the Company must be provided in writing (including by email). Verbal instructions may be acted upon at the Company's discretion but must be confirmed in writing within 48 hours. The Company reserves the right to decline any instruction that it considers unlawful, unethical or contrary to its policies.</p>
          </Section>

          <Section title="3. Fees & Commissions">
            <p>Our fees are agreed in the client engagement letter prior to commencement of work. For debt recovery services, fees are typically performance-based (commission on amounts recovered). For auctioneering and court services, fixed or hourly rates may apply. All fees are exclusive of applicable taxes and disbursements unless otherwise stated.</p>
            <p>The Company shall not be liable for any failure to recover the full amount of a debt, and no fee refund is applicable where the debtor is unable to pay or is insolvent.</p>
          </Section>

          <Section title="4. Client Obligations">
            <p>The client warrants that: (a) all information and documentation provided is accurate and complete; (b) the client has the legal authority to instruct the Company in relation to the debt or asset; (c) the instruction does not violate any applicable law, court order or contractual obligation; and (d) the client will cooperate promptly with reasonable requests for information.</p>
          </Section>

          <Section title="5. Confidentiality">
            <p>Both parties agree to keep all case-related information, correspondence and financial data strictly confidential. The Company will not disclose client information to third parties except as necessary for case management, required by law or authorised in writing by the client.</p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>The Company's liability in connection with any engagement shall not exceed the total fees paid by the client under that engagement. The Company shall not be liable for indirect, consequential or special damages, including loss of profit or business opportunity.</p>
            <p>The Company is not liable for delays or failures arising from circumstances beyond its reasonable control, including court delays, debtor insolvency or force majeure events.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on this website — including text, graphics, logos and layout — is the property of Hollyness & Respishers Company Limited and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our prior written permission.</p>
          </Section>

          <Section title="8. Governing Law">
            <p>These Terms and Conditions are governed by the laws of the United Republic of Tanzania. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of Tanzania.</p>
          </Section>

          <Section title="9. Amendments">
            <p>We reserve the right to amend these Terms and Conditions at any time. Updated terms will be posted on this page with a revised effective date. Continued use of our services after such changes constitutes acceptance of the new terms.</p>
          </Section>

          <Section title="10. Contact">
            <div className="p-4 bg-[#F4F7FA] rounded-xl text-sm space-y-1">
              <p><strong>Hollyness & Respishers Company Limited</strong></p>
              <p>Plot No. 1532, Old Forest St., BOT Road, P.O. Box 741, Mbeya, Tanzania</p>
              <p>Email: <a href="mailto:Office@hollyrespishers.com" className="text-[#D4A017]">Office@hollyrespishers.com</a></p>
              <p>Phone: <a href="tel:+255762058614" className="text-[#D4A017]">+255 762 058 614</a></p>
            </div>
          </Section>

          <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-gray-100">
            <Link to="/privacy-policy" className="text-sm text-[#D4A017] hover:underline">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/disclaimer" className="text-sm text-[#D4A017] hover:underline">Disclaimer</Link>
            <span className="text-gray-300">|</span>
            <Link to="/aml-policy" className="text-sm text-[#D4A017] hover:underline">AML Policy</Link>
          </div>
        </div>
      </div>
    </>
  )
}
