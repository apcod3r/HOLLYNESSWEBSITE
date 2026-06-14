import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#0A1F44] font-serif mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default function DisclaimerPage() {
  return (
    <>
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a><span>/</span>
            <span className="text-[#D4A017]">Disclaimer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-3">Disclaimer</h1>
          <p className="text-[#8A9BB0] text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-10 p-5 bg-[#F4F7FA] rounded-xl border border-gray-100">
            Please read this disclaimer carefully before using the Hollyness & Respishers Company Limited website. By accessing this website, you accept the terms of this disclaimer in full.
          </p>

          <Section title="1. General Information Only">
            <p>The content on this website is provided for general informational purposes only. It does not constitute legal advice, financial advice or professional counsel of any kind. You should not rely on any information on this website as a substitute for professional advice tailored to your specific circumstances.</p>
          </Section>

          <Section title="2. No Legal Advice">
            <p>Nothing on this website creates a solicitor-client, attorney-client or any other professional relationship between you and Hollyness & Respishers Company Limited. For legal matters, you should consult a qualified legal practitioner registered in Tanzania.</p>
          </Section>

          <Section title="3. Accuracy of Information">
            <p>While we endeavour to keep the information on this website accurate and up to date, we make no representations or warranties of any kind — express or implied — about the completeness, accuracy, reliability or suitability of the content.</p>
            <p>Laws, regulations and procedures relevant to debt recovery and auctioneering in Tanzania may change. We recommend verifying current requirements with qualified professionals before taking any action.</p>
          </Section>

          <Section title="4. Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, Hollyness & Respishers Company Limited shall not be liable for any direct, indirect, incidental or consequential loss or damage arising from your use of, or reliance on, any content on this website.</p>
          </Section>

          <Section title="5. External Links">
            <p>This website may contain links to external websites operated by third parties. We do not endorse or take responsibility for the content, privacy practices or accuracy of any linked external sites. Accessing external links is at your own risk.</p>
          </Section>

          <Section title="6. Results Not Guaranteed">
            <p>Any reference to recovery rates, case outcomes or client results on this website represents past performance and typical scenarios only. Past results are not a guarantee of future outcomes. Every debt recovery case is unique, and results will vary depending on the circumstances of each case.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on this website, including text, images, logos and layout, is owned by or licensed to Hollyness & Respishers Company Limited. Reproduction, distribution or modification of any content without prior written consent is prohibited.</p>
          </Section>

          <Section title="8. Contact">
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
            <Link to="/aml-policy" className="text-sm text-[#D4A017] hover:underline">AML Policy</Link>
          </div>
        </div>
      </div>
    </>
  )
}
