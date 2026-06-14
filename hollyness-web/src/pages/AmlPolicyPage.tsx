import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#0A1F44] font-serif mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default function AmlPolicyPage() {
  return (
    <>
      <div className="bg-[#0A1F44] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#8A9BB0] text-sm mb-4">
            <a href="/" className="hover:text-[#D4A017] transition-colors">Home</a><span>/</span>
            <span className="text-[#D4A017]">AML Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-3">Anti-Money Laundering Policy</h1>
          <p className="text-[#8A9BB0] text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-10 p-5 bg-[#F4F7FA] rounded-xl border border-gray-100">
            Hollyness & Respishers Company Limited is committed to full compliance with Tanzania's Anti-Money Laundering Act (Cap. 423) and all applicable anti-bribery and counter-terrorism financing legislation. This policy outlines our obligations and procedures.
          </p>

          <Section title="1. Our Commitment">
            <p>The Company maintains a zero-tolerance position towards money laundering, terrorism financing, bribery and corruption. All directors, employees and agents are required to adhere strictly to this policy and to applicable Tanzanian AML/CFT legislation at all times.</p>
          </Section>

          <Section title="2. Customer Due Diligence (CDD)">
            <p>Before accepting any new client engagement, we conduct appropriate due diligence, which may include:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Verification of client identity (national ID, passport, business registration certificate).</li>
              <li>Verification of the source and legitimacy of the debt or asset being recovered.</li>
              <li>Confirmation that the client has the legal authority to instruct us.</li>
              <li>Enhanced due diligence for politically exposed persons (PEPs) or high-risk clients.</li>
            </ul>
            <p>We reserve the right to decline any instruction where due diligence cannot be satisfactorily completed.</p>
          </Section>

          <Section title="3. Suspicious Transaction Reporting">
            <p>All employees are required to report any suspected money laundering or suspicious transactions to the Company's designated AML Compliance Officer. Where reasonable grounds exist, we are required to file a Suspicious Transaction Report (STR) with the Financial Intelligence Unit (FIU) of Tanzania in accordance with the Anti-Money Laundering Act.</p>
            <p>Tipping off — informing a suspected person that a report has been or may be made — is strictly prohibited and may constitute a criminal offence.</p>
          </Section>

          <Section title="4. Record Keeping">
            <p>We maintain comprehensive records of all client identification documents, transaction records and case files for a minimum of 7 years from the date of the last transaction or closure of the matter, as required by Tanzanian law.</p>
          </Section>

          <Section title="5. Staff Training">
            <p>All staff receive regular training on AML/CFT obligations, how to identify suspicious activity, and their reporting duties. New employees receive AML induction training as part of their onboarding process.</p>
          </Section>

          <Section title="6. Anti-Bribery & Corruption">
            <p>The Company prohibits the offering, giving, receiving or soliciting of any bribe, kickback or facilitation payment — directly or indirectly — in connection with any business activity. Any employee found to have violated this prohibition will face disciplinary action, up to and including termination and referral to law enforcement authorities.</p>
          </Section>

          <Section title="7. Compliance Officer">
            <p>The Company has designated a senior officer responsible for AML/CFT compliance. Any concerns or reports related to money laundering, terrorism financing or bribery should be directed to:</p>
            <div className="mt-3 p-4 bg-[#F4F7FA] rounded-xl text-sm space-y-1">
              <p><strong>AML Compliance Officer</strong></p>
              <p>Hollyness & Respishers Company Limited</p>
              <p>Email: <a href="mailto:Compliance@hollyrespishers.com" className="text-[#D4A017]">Compliance@hollyrespishers.com</a></p>
              <p>Phone: <a href="tel:+255762058614" className="text-[#D4A017]">+255 762 058 614</a></p>
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
